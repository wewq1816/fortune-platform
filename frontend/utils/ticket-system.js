/**
 * 🎫 이용권 시스템 - 핵심 로직
 * 
 * 규칙:
 * - 하루 1회 쿠팡 방문 → 이용권 2개 충전
 * - 기능 사용 시 이용권 1개 소모
 * - 하루 최대 2번 사용 가능
 * - 자정 지나면 초기화
 * - 마스터 코드 'cooal' = 무제한
 */

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
 * 기능 사용 가능 여부 확인
 * 
 * @returns {object} { canUse, reason, tickets }
 *   - canUse: 사용 가능 여부
 *   - reason: 'has_tickets' | 'need_charge' | 'already_used' | 'master_mode'
 *   - tickets: 현재 이용권 개수
 */
function canUseFortune() {
  // 마스터 모드는 무조건 사용 가능
  if (isMasterMode()) {
    return {
      canUse: true,
      reason: 'master_mode',
      tickets: Infinity
    };
  }
  
  const ticketData = getTicketData();
  
  // 이용권이 있으면 사용 가능
  if (ticketData.count > 0) {
    return {
      canUse: true,
      reason: 'has_tickets',
      tickets: ticketData.count
    };
  }
  
  // 이용권이 없고, 아직 충전 안 했으면
  if (ticketData.count === 0 && !ticketData.charged) {
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
 * 이용권 충전 (쿠팡 방문 후)
 */
function chargeTickets() {
  // 마스터 모드는 충전 불필요
  if (isMasterMode()) {
    return {
      success: true,
      tickets: Infinity,
      message: 'Master Mode - 무제한 사용'
    };
  }
  
  const ticketData = getTicketData();
  
  // 이미 충전했으면
  if (ticketData.charged) {
    return {
      success: false,
      tickets: ticketData.count,
      error: '오늘은 이미 충전했습니다.'
    };
  }
  
  // 이용권 2개 충전
  ticketData.count = 2;
  ticketData.charged = true;
  
  saveTicketData(ticketData);
  
  return {
    success: true,
    tickets: 2,
    message: '이용권 2개가 충전되었습니다!'
  };
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
