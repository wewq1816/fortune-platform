/**
 * 🎫 이용권 시스템 - 핵심 로직
 * 
 * 규칙:
 * - 하루 1회 쿠팡 방문 → 이용권 2개 충전
 * - 기능 사용 시 이용권 1개 소모
 * - 하루 최대 2번 사용 가능
 * - 자정 지나면 초기화
 * - 마스터 코드 'cooal' = 무제한
 * 
 * ⭐ Single Source of Truth: MongoDB (백엔드)
 * - 모든 이용권 정보는 백엔드 MongoDB에서 관리
 * - 프론트엔드 localStorage는 캐시용
 */

// ============================================
// 🌐 API URL 설정
// ============================================
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

const API_BASE_URL = isLocalhost 
  ? 'http://localhost:3000'
  : 'https://fortune-platform.onrender.com';

// ============================================
// 📦 localStorage 키 상수
// ============================================
const STORAGE_KEYS = {
  MASTER_MODE: 'master_mode',
  TICKETS: 'fortune_tickets'
};

// ============================================
// 🔑 마스터 코드
// ============================================
const MASTER_CODE = 'cooal';

// ============================================
// ⏰ 날짜 유틸리티
// ============================================

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 자정까지 남은 시간 계산
 */
function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  
  const diff = midnight - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes };
}

// ============================================
// 🔐 마스터 모드 관리
// ============================================

/**
 * 마스터 모드 확인
 */
function isMasterMode() {
  const masterMode = localStorage.getItem(STORAGE_KEYS.MASTER_MODE);
  return masterMode === 'true';
}

/**
 * 마스터 모드 활성화
 */
function activateMasterMode() {
  localStorage.setItem(STORAGE_KEYS.MASTER_MODE, 'true');
  console.log('🔓 Master Mode Activated!');
}

/**
 * 마스터 모드 비활성화
 */
function deactivateMasterMode() {
  localStorage.setItem(STORAGE_KEYS.MASTER_MODE, 'false');
  console.log('🔒 Master Mode Deactivated.');
}

/**
 * URL 파라미터로 마스터 모드 체크
 */
function checkMasterModeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const unlock = urlParams.get('unlock');
  
  if (unlock === MASTER_CODE) {
    activateMasterMode();
    return true;
  } else if (unlock === 'off') {
    deactivateMasterMode();
    return false;
  }
  
  return isMasterMode();
}

// ============================================
// 🎫 이용권 데이터 관리
// ============================================

/**
 * 이용권 데이터 초기화
 */
function initTicketData() {
  return {
    date: getTodayString(),
    count: 0,
    charged: false,
    last_use: null
  };
}

/**
 * 이용권 데이터 가져오기
 */
function getTicketData() {
  const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
  
  if (!data) {
    return initTicketData();
  }
  
  try {
    const ticketData = JSON.parse(data);
    
    // 날짜가 바뀌었으면 초기화
    if (ticketData.date !== getTodayString()) {
      return initTicketData();
    }
    
    return ticketData;
  } catch (error) {
    console.error('이용권 데이터 파싱 오류:', error);
    return initTicketData();
  }
}

/**
 * 이용권 데이터 저장
 */
function saveTicketData(ticketData) {
  localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(ticketData));
}

// ============================================
// 🎯 이용권 핵심 기능
// ============================================

/**
 * 백엔드에서 실제 이용권 확인 (Single Source of Truth)
 * @returns {Promise<object>} { tickets, charged, date }
 */
async function checkTicketsFromBackend() {
  try {
    const deviceId = await getOrCreateDeviceId();
    
    const response = await fetch(API_BASE_URL + '/api/tickets/check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-ID': deviceId
      }
    });
    
    if (!response.ok) {
      throw new Error('이용권 조회 실패: ' + response.status);
    }
    
    const data = await response.json();
    
    // localStorage 동기화 (캐시)
    const ticketData = {
      date: data.date || getTodayString(),
      count: data.tickets || 0,
      charged: data.charged || false,
      last_use: null
    };
    saveTicketData(ticketData);
    
    console.log('[Ticket] 백엔드 동기화:', ticketData);
    
    return {
      tickets: data.tickets || 0,
      charged: data.charged || false,
      date: data.date || getTodayString()
    };
  } catch (error) {
    console.error('[Ticket] 백엔드 확인 실패:', error);
    // 폴백: localStorage 사용
    const localData = getTicketData();
    return {
      tickets: localData.count,
      charged: localData.charged,
      date: localData.date
    };
  }
}

/**
 * 남은 이용권 개수
 */
function getRemainingTickets() {
  if (isMasterMode()) {
    return Infinity;
  }
  
  const ticketData = getTicketData();
  return ticketData.count;
}

/**
 * 기능 사용 가능 여부 확인 (백엔드 동기화)
 * 
 * @returns {Promise<object>} { canUse, reason, tickets }
 *   - canUse: 사용 가능 여부
 *   - reason: 'has_tickets' | 'need_charge' | 'already_used' | 'master_mode'
 *   - tickets: 현재 이용권 개수
 */
async function canUseFortune() {
  // 마스터 모드는 무조건 사용 가능
  if (isMasterMode()) {
    return {
      canUse: true,
      reason: 'master_mode',
      tickets: Infinity
    };
  }
  
  // ⭐ 백엔드에서 실제 이용권 확인
  const backendData = await checkTicketsFromBackend();
  
  // 이용권이 있으면 사용 가능
  if (backendData.tickets > 0) {
    return {
      canUse: true,
      reason: 'has_tickets',
      tickets: backendData.tickets
    };
  }
  
  // 이용권이 없고, 아직 충전 안 했으면
  if (backendData.tickets === 0 && !backendData.charged) {
    return {
      canUse: false,
      reason: 'need_charge',
      tickets: 0
    };
  }
  
  // 이용권이 없고, 이미 충전했으면 (다 사용함)
  return {
    canUse: false,
    reason: 'already_used',
    tickets: 0
  };
}

/**
 * [DEPRECATED] 이용권 소모 - 사용 안함!
 * 이제 백엔드에서만 이용권을 소모합니다.
 * 프론트엔드는 이 함수를 호출하지 마세요!
 * 
 * @param {string} featureName - 사용한 기능 이름
 */
function useTicket(featureName = '알수없음') {
  console.warn('[DEPRECATED] useTicket() 호출됨 - 백엔드에서만 이용권 소모');
  
  // 통계 기록만 수행 (이용권 소모는 안함)
  if (typeof trackTicketUsage === 'function') {
    trackTicketUsage(featureName);
  }
  
  return {
    success: true,
    remaining: getRemainingTickets(),
    message: '백엔드에서 이용권 검증'
  };
}

/**
 * 이용권 충전 (쿠팡 방문 후) - 백엔드 API 호출
 */
async function chargeTickets() {
  // 마스터 모드는 충전 불필요
  if (isMasterMode()) {
    return {
      success: true,
      tickets: Infinity,
      message: 'Master Mode - 무제한 사용'
    };
  }
  
  try {
    const deviceId = await getOrCreateDeviceId();
    
    const response = await fetch(API_BASE_URL + '/api/tickets/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-ID': deviceId
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      // localStorage 동기화
      const ticketData = getTicketData();
      ticketData.count = data.tickets;
      ticketData.charged = true;
      saveTicketData(ticketData);
      
      console.log('[Ticket] 백엔드 충전 성공:', data);
      
      return {
        success: true,
        tickets: data.tickets,
        message: data.message
      };
    } else {
      console.warn('[Ticket] 백엔드 충전 실패:', data);
      return {
        success: false,
        tickets: 0,
        error: data.error
      };
    }
  } catch (error) {
    console.error('[Ticket] 충전 API 호출 실패:', error);
    return {
      success: false,
      tickets: 0,
      error: '서버 연결 실패'
    };
  }
}

// ============================================
// 🎨 UI 헬퍼 함수
// ============================================

/**
 * 이용권 배지 HTML 생성
 */
function getTicketBadgeHTML() {
  if (isMasterMode()) {
    return `
      <div class="ticket-badge master-mode">
        🔓 Master Mode
      </div>
    `;
  }
  
  const tickets = getRemainingTickets();
  
  return `
    <div class="ticket-badge">
      🎫 이용권: ${tickets}개
    </div>
  `;
}

/**
 * 자정까지 남은 시간 텍스트
 */
function getTimeUntilMidnightText() {
  const { hours, minutes } = getTimeUntilMidnight();
  return `⏰ 자정까지: ${hours}시간 ${minutes}분`;
}
