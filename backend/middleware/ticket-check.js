/**
 * 🎫 디바이스 ID 기반 이용권 검증 미들웨어
 * 
 * 개선 사항:
 * - IP → 디바이스 ID 기반으로 변경
 * - Redis 저장 (다중 서버 지원, 데이터 영속성)
 * - IP 변경 무한 충전 방지
 * - 자정 자동 초기화 (TTL)
 */

const { getTicketData, setTicketData, isRedisConnected } = require('../config/redis');

// ============================================
// 💾 폴백: 메모리 저장소 (Redis 없을 때)
// ============================================
const memoryTickets = new Map();
const MAX_MEMORY_ENTRIES = 10000;  // 최대 1만 개 (DoS 방지)

// Rate Limiting (디바이스당)
const requestCounts = new Map();
const MAX_REQUESTS_PER_MINUTE = 60;

// 자정 초기화 스케줄러 (메모리 모드용)
setInterval(() => {
  const today = getTodayString();
  let cleaned = 0;
  
  memoryTickets.forEach((value, key) => {
    // 오늘 날짜가 아닌 데이터 삭제
    if (!key.includes(today)) {
      memoryTickets.delete(key);
      cleaned++;
    }
  });
  
  if (cleaned > 0) {
    console.log(`🧹 메모리 자정 초기화: ${cleaned}개 항목 삭제`);
  }
  
  // Rate Limiting 카운터 초기화 (1분마다)
  requestCounts.clear();
}, 60000);  // 1분마다 체크

// ============================================
// ⏰ 날짜 유틸리티
// ============================================
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================
// 🔑 마스터 코드 (환경변수 필수)
// ============================================
const MASTER_CODE = process.env.MASTER_CODE;

if (!MASTER_CODE) {
  console.error('❌ MASTER_CODE 환경변수가 설정되지 않았습니다');
  console.warn('⚠️ 기본값 "cooal" 사용 (프로덕션에서는 변경 필수!)');
}

// 폴백 (개발용)
const EFFECTIVE_MASTER_CODE = MASTER_CODE || 'cooal';

/**
 * 마스터 모드 확인
 */
function checkMasterMode(req) {
  // URL 파라미터
  if (req.query.unlock === EFFECTIVE_MASTER_CODE) {
    return true;
  }
  
  // 헤더
  if (req.headers['x-master-code'] === EFFECTIVE_MASTER_CODE) {
    return true;
  }
  
  return false;
}

// ============================================
// 📱 디바이스 ID 추출 및 검증
// ============================================
function getDeviceID(req) {
  // 헤더에서 디바이스 ID 추출
  const deviceId = req.headers['x-device-id'];
  
  if (!deviceId) {
    throw new Error('디바이스 ID가 없습니다');
  }
  
  // 길이 검증 (16-64자)
  if (deviceId.length < 16 || deviceId.length > 64) {
    throw new Error('잘못된 디바이스 ID 길이');
  }
  
  // 형식 검증 (영숫자와 언더스코어 허용)
  if (!/^[a-zA-Z0-9_]+$/.test(deviceId)) {
    throw new Error('잘못된 디바이스 ID 형식');
  }
  
  return deviceId;
}

// ============================================
// 🎫 이용권 데이터 관리
// ============================================

/**
 * 이용권 데이터 가져오기 (Redis 또는 메모리)
 */
async function getDeviceTicketData(deviceId) {
  const today = getTodayString();
  
  // Redis 사용 가능하면 Redis에서
  if (isRedisConnected()) {
    const data = await getTicketData(deviceId, today);
    if (data) return data;
  } else {
    // Redis 없으면 메모리에서
    const key = `${deviceId}:${today}`;
    if (memoryTickets.has(key)) {
      return memoryTickets.get(key);
    }
  }
  
  // 없으면 기본값
  return {
    date: today,
    tickets: 0,
    charged: false,
    usedFeatures: []
  };
}

/**
 * 이용권 데이터 저장 (Redis 또는 메모리)
 */
async function saveDeviceTicketData(deviceId, data) {
  const today = getTodayString();
  
  if (isRedisConnected()) {
    await setTicketData(deviceId, today, data);
  } else {
    const key = `${deviceId}:${today}`;
    
    // 메모리 크기 제한 (DoS 방지)
    if (memoryTickets.size >= MAX_MEMORY_ENTRIES) {
      // 가장 오래된 항목 삭제 (LRU)
      const firstKey = memoryTickets.keys().next().value;
      memoryTickets.delete(firstKey);
      console.warn(`⚠️ 메모리 제한 도달: 오래된 항목 삭제`);
    }
    
    memoryTickets.set(key, data);
  }
}

// ============================================
// 🛡️ 이용권 검증 미들웨어
// ============================================

/**
 * 이용권 확인 미들웨어
 */
async function checkTicketMiddleware(req, res, next) {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎫 이용권 미들웨어 실행');
    console.log('헤더:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // 마스터 모드 체크
    if (checkMasterMode(req)) {
      req.isMasterMode = true;
      console.log('🔓 마스터 모드 접근');
      return next();
    }
    
    // 디바이스 ID 추출
    let deviceId;
    try {
      deviceId = getDeviceID(req);
    } catch (error) {
      console.error('❌ getDeviceID 실패:', error.message);
      return res.status(400).json({
        success: false,
        error: '디바이스 ID가 필요합니다',
        code: 'NO_DEVICE_ID',
        detail: error.message
      });
    }
    
    // Rate Limiting 체크
    const count = requestCounts.get(deviceId) || 0;
    if (count >= MAX_REQUESTS_PER_MINUTE) {
      console.warn(`🚫 Rate Limit 초과: ${deviceId.substr(0, 8)}...`);
      return res.status(429).json({
        success: false,
        error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
    requestCounts.set(deviceId, count + 1);
    
    // 이용권 데이터 조회
    const ticketData = await getDeviceTicketData(deviceId);
    
    // 이용권 데이터를 req에 저장하고 통과 (체크만 함)
    req.deviceTicketData = ticketData;
    req.deviceId = deviceId;
    
    console.log(`✅ 이용권 체크: ${deviceId.substr(0, 8)}... (이용권: ${ticketData.tickets}, charged: ${ticketData.charged})`);
    
    return next();
  } catch (error) {
    console.error('❌ 이용권 검증 오류:', error);
    // 오류 시 차단! (보안)
    return res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
}

// ============================================
// 🎫 이용권 소모
// ============================================

/**
 * 이용권 사용
 */
async function useTicket(req, featureName = '알 수 없음') {
  // 마스터 모드는 소모 안함
  if (req.isMasterMode) {
    console.log(`🔓 마스터 모드 사용: ${featureName}`);
    return { success: true, remaining: Infinity };
  }
  
  const deviceId = req.deviceId;
  if (!deviceId) {
    return { success: false, remaining: 0 };
  }
  
  const ticketData = await getDeviceTicketData(deviceId);
  
  if (ticketData.tickets <= 0) {
    return { success: false, remaining: 0 };
  }
  
  // 이용권 1개 소모
  ticketData.tickets -= 1;
  ticketData.usedFeatures.push({
    feature: featureName,
    time: new Date().toISOString()
  });
  
  await saveDeviceTicketData(deviceId, ticketData);
  
  console.log(`🎫 이용권 사용: ${deviceId.substr(0, 8)}... - ${featureName} (남은: ${ticketData.tickets})`);
  
  return { success: true, remaining: ticketData.tickets };
}

// ============================================
// 📡 이용권 API 엔드포인트
// ============================================

/**
 * 이용권 충전
 */
async function chargeTicketsEndpoint(req, res) {
  try {
    // 마스터 모드 체크
    if (checkMasterMode(req)) {
      return res.json({
        success: true,
        tickets: Infinity,
        message: 'Master Mode - 무제한 사용'
      });
    }
    
    // 디바이스 ID 추출
    let deviceId;
    try {
      deviceId = getDeviceID(req);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: '디바이스 ID가 필요합니다'
      });
    }
    
    const ticketData = await getDeviceTicketData(deviceId);
    
    // 이미 충전했으면 거부
    if (ticketData.charged) {
      return res.status(400).json({
        success: false,
        tickets: ticketData.tickets,
        error: '오늘은 이미 충전했습니다.',
        code: 'ALREADY_CHARGED'
      });
    }
    
    // 이용권 2개 충전
    ticketData.tickets = 2;
    ticketData.charged = true;
    await saveDeviceTicketData(deviceId, ticketData);
    
    console.log(`💰 이용권 충전: ${deviceId.substr(0, 8)}...`);
    
    return res.json({
      success: true,
      tickets: 2,
      message: '이용권 2개가 충전되었습니다!'
    });
  } catch (error) {
    console.error('❌ 충전 오류:', error);
    return res.status(500).json({
      success: false,
      error: '서버 오류'
    });
  }
}

/**
 * 이용권 조회
 */
async function getTicketsEndpoint(req, res) {
  try {
    // 마스터 모드
    if (checkMasterMode(req)) {
      return res.json({
        success: true,
        tickets: Infinity,
        charged: true,
        date: getTodayString()
      });
    }
    
    // 디바이스 ID
    let deviceId;
    try {
      deviceId = getDeviceID(req);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: '디바이스 ID가 필요합니다'
      });
    }
    
    const ticketData = await getDeviceTicketData(deviceId);
    
    return res.json({
      success: true,
      tickets: ticketData.tickets,
      charged: ticketData.charged,
      date: ticketData.date
    });
  } catch (error) {
    console.error('❌ 조회 오류:', error);
    return res.status(500).json({
      success: false,
      error: '서버 오류'
    });
  }
}

// ============================================
// 🌐 모듈 익스포트
// ============================================

module.exports = {
  checkTicketMiddleware,
  useTicket,
  chargeTicketsEndpoint,
  getTicketsEndpoint
};
