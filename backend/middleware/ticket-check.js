/**
 * 디바이스 ID 기반 이용권 검증 미들웨어 (MongoDB)
 * 
 * 개선 사항:
 * - Redis -> MongoDB로 변경
 * - 자정 정확한 초기화 (TTL)
 * - 데이터 영속성 보장
 */

const { TicketModel, getTodayKST } = require('../models/Ticket');

// Rate Limiting (메모리 - 가벼운 DoS 방지)
const requestCounts = new Map();
const MAX_REQUESTS_PER_MINUTE = 60;

setInterval(() => requestCounts.clear(), 60000); // 1분마다 초기화

// 마스터 코드
const MASTER_CODE = process.env.MASTER_CODE;

if (!MASTER_CODE) {
  console.error('[Ticket] MASTER_CODE 환경변수가 설정되지 않았습니다');
  console.warn('[Ticket] 기본값 "cooal" 사용');
}

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

/**
 * 디바이스 ID 추출 및 검증
 */
function getDeviceID(req) {
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

/**
 * 이용권 데이터 가져오기 (MongoDB)
 */
async function getDeviceTicketData(deviceId) {
  try {
    console.log('[Ticket] 조회 시작 - Device ID:', deviceId);
    let ticket = await TicketModel.findByDeviceId(deviceId);
    
    if (ticket) {
      console.log('[Ticket] MongoDB에서 찾음:', ticket);
      return ticket;
    }
    
    console.log('[Ticket] MongoDB에 데이터 없음 - 기본값 반환');
    // 없으면 기본값
    return {
      date: getTodayKST(),
      tickets: 0,
      charged: false,
      usedFeatures: []
    };
  } catch (error) {
    console.error('[Ticket] 조회 오류:', error.message);
    // 오류 시 기본값
    return {
      date: getTodayKST(),
      tickets: 0,
      charged: false,
      usedFeatures: []
    };
  }
}

/**
 * 이용권 데이터 저장 (MongoDB)
 */
async function saveDeviceTicketData(deviceId, data) {
  try {
    // 기존 데이터 확인
    const existing = await TicketModel.findByDeviceId(deviceId);
    
    if (existing) {
      // 업데이트
      await TicketModel.update(deviceId, data);
    } else {
      // 새로 생성
      await TicketModel.create(deviceId, data);
    }
  } catch (error) {
    console.error('[Ticket] 저장 오류:', error.message);
    throw error;
  }
}

/**
 * 이용권 확인 미들웨어
 */
async function checkTicketMiddleware(req, res, next) {
  try {
    console.log('\n==========================================');
    console.log('[Ticket] 미들웨어 실행');
    console.log('헤더:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('==========================================\n');
    
    // 마스터 모드 체크
    if (checkMasterMode(req)) {
      req.isMasterMode = true;
      console.log('[Ticket] 마스터 모드 접근');
      return next();
    }
    
    // 디바이스 ID 추출
    let deviceId;
    try {
      deviceId = getDeviceID(req);
    } catch (error) {
      console.error('[Ticket] getDeviceID 실패:', error.message);
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
      console.warn(`[Ticket] Rate Limit 초과: ${deviceId.substr(0, 8)}...`);
      return res.status(429).json({
        success: false,
        error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
    requestCounts.set(deviceId, count + 1);
    
    // 이용권 데이터 조회
    const ticketData = await getDeviceTicketData(deviceId);
    
    // 이용권 데이터를 req에 저장하고 통과
    req.deviceTicketData = ticketData;
    req.deviceId = deviceId;
    
    console.log(`[Ticket] 체크 완료: ${deviceId.substr(0, 8)}... (이용권: ${ticketData.tickets}, charged: ${ticketData.charged})`);
    
    return next();
  } catch (error) {
    console.error('[Ticket] 검증 오류:', error);
    return res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다'
    });
  }
}

/**
 * 이용권 사용
 */
async function useTicket(req, featureName = '알 수 없음') {
  console.log('[DEBUG useTicket] 시작 - featureName:', featureName);
  
  // 마스터 모드는 소모 안함
  if (req.isMasterMode) {
    console.log('[Ticket] 마스터 모드 사용:', featureName);
    return { success: true, remaining: Infinity };
  }
  
  const deviceId = req.deviceId;
  console.log('[DEBUG useTicket] deviceId:', deviceId);
  
  if (!deviceId) {
    console.log('[DEBUG useTicket] deviceId 없음!');
    return { success: false, remaining: 0, error: 'deviceId 없음' };
  }
  
  const ticketData = await getDeviceTicketData(deviceId);
  console.log('[DEBUG useTicket] ticketData:', JSON.stringify(ticketData));
  
  if (ticketData.tickets <= 0) {
    console.log('[DEBUG useTicket] 이용권 부족! tickets:', ticketData.tickets);
    return { success: false, remaining: 0, error: '이용권 부족' };
  }
  
  // 이용권 1개 소모
  ticketData.tickets -= 1;
  ticketData.usedFeatures.push({
    feature: featureName,
    time: new Date().toISOString()
  });
  
  console.log('[DEBUG useTicket] 저장 시도 - 남은 이용권:', ticketData.tickets);
  await saveDeviceTicketData(deviceId, ticketData);
  console.log('[DEBUG useTicket] 저장 완료');
  
  console.log(`[Ticket] 사용: ${deviceId.substr(0, 8)}... - ${featureName} (남은: ${ticketData.tickets})`);
  
  return { success: true, remaining: ticketData.tickets };
}

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
    console.log('[Ticket] 충전 전 데이터:', ticketData);
    
    // 이미 충전했으면 거부
    if (ticketData.charged) {
      console.log('[Ticket] 이미 충전됨 - 거부');
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
    
    console.log(`[Ticket] 충전 완료: ${deviceId.substr(0, 8)}... -> 2개`);
    console.log('[Ticket] 충전 후 데이터:', ticketData);
    
    return res.json({
      success: true,
      tickets: 2,
      message: '이용권 2개가 충전되었습니다!'
    });
  } catch (error) {
    console.error('[Ticket] 충전 오류:', error);
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
        date: getTodayKST()
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
    
    console.log('[Ticket] 조회 API 응답:', {
      deviceId: deviceId.substr(0, 8) + '...',
      tickets: ticketData.tickets,
      charged: ticketData.charged,
      date: ticketData.date
    });
    
    return res.json({
      success: true,
      tickets: ticketData.tickets,
      charged: ticketData.charged,
      date: ticketData.date
    });
  } catch (error) {
    console.error('[Ticket] 조회 오류:', error);
    return res.status(500).json({
      success: false,
      error: '서버 오류'
    });
  }
}

/**
 * 이용권 초기화 (테스트/관리용)
 */
async function resetTicketsEndpoint(req, res) {
  try {
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
    
    // 이용권 데이터 초기화
    const ticketData = {
      date: getTodayKST(),
      tickets: 0,
      charged: false,
      usedFeatures: []
    };
    
    await saveDeviceTicketData(deviceId, ticketData);
    
    console.log(`[Ticket] 초기화: ${deviceId.substr(0, 8)}...`);
    
    return res.json({
      success: true,
      tickets: 0,
      message: '이용권이 초기화되었습니다'
    });
  } catch (error) {
    console.error('[Ticket] 초기화 오류:', error);
    return res.status(500).json({
      success: false,
      error: '서버 오류'
    });
  }
}

/**
 * 이용권 수동 설정 (테스트/관리용)
 */
async function setTicketsEndpoint(req, res) {
  try {
    const { tickets } = req.body;
    
    if (typeof tickets !== 'number' || tickets < 0) {
      return res.status(400).json({
        success: false,
        error: '올바른 이용권 개수를 입력하세요'
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
    
    // 이용권 데이터 설정
    const ticketData = {
      date: getTodayKST(),
      tickets: tickets,
      charged: true,
      usedFeatures: []
    };
    
    await saveDeviceTicketData(deviceId, ticketData);
    
    console.log(`[Ticket] 수동 설정: ${deviceId.substr(0, 8)}... - ${tickets}개`);
    
    return res.json({
      success: true,
      tickets: tickets,
      message: `이용권이 ${tickets}개로 설정되었습니다`
    });
  } catch (error) {
    console.error('[Ticket] 설정 오류:', error);
    return res.status(500).json({
      success: false,
      error: '서버 오류'
    });
  }
}

module.exports = {
  checkTicketMiddleware,
  useTicket,
  chargeTicketsEndpoint,
  getTicketsEndpoint,
  resetTicketsEndpoint,
  setTicketsEndpoint
};
