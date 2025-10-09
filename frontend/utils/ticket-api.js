/**
 * 🔐 디바이스 ID 기반 이용권 시스템 - API 헬퍼
 * 
 * 모든 API 호출 시 디바이스 ID를 헤더에 포함
 */

// ============================================
// 📡 API 호출 헬퍼
// ============================================

/**
 * 디바이스 ID를 포함한 헤더 생성
 */
async function getAPIHeaders() {
  const deviceId = await window.DeviceFingerprint.getDeviceID();
  
  const headers = {
    'Content-Type': 'application/json',
    'X-Device-ID': deviceId
  };
  
  // 마스터 모드면 마스터 코드도 추가
  if (isMasterMode()) {
    headers['X-Master-Code'] = MASTER_CODE;
  }
  
  return headers;
}

/**
 * 이용권 충전 API 호출
 */
async function chargeTicketsAPI() {
  try {
    const headers = await getAPIHeaders();
    
    const response = await fetch('http://localhost:3000/api/tickets/charge', {
      method: 'POST',
      headers: headers
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 이용권 충전 성공:', data.tickets);
      
      // 프론트엔드 localStorage도 업데이트
      const ticketData = getTicketData();
      ticketData.count = data.tickets;
      ticketData.charged = true;
      saveTicketData(ticketData);
    } else {
      console.warn('⚠️ 이용권 충전 실패:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('❌ API 호출 실패:', error);
    return {
      success: false,
      error: '서버 연결 실패'
    };
  }
}

/**
 * 이용권 확인 API 호출
 */
async function checkTicketsAPI() {
  try {
    const headers = await getAPIHeaders();
    
    const response = await fetch('http://localhost:3000/api/tickets/check', {
      method: 'GET',
      headers: headers
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 이용권 확인:', data.tickets);
      
      // 프론트엔드 localStorage 동기화
      const ticketData = getTicketData();
      ticketData.count = data.tickets;
      ticketData.charged = data.charged;
      saveTicketData(ticketData);
    }
    
    return data;
  } catch (error) {
    console.error('❌ API 호출 실패:', error);
    return {
      success: false,
      error: '서버 연결 실패'
    };
  }
}

/**
 * 기능 사용 전 이용권 확인 및 소모
 * @param {string} featureName - 사용할 기능 이름
 */
async function useTicketAPI(featureName) {
  try {
    // 마스터 모드는 API 호출 없이 통과
    if (isMasterMode()) {
      return {
        success: true,
        remaining: Infinity
      };
    }
    
    // 먼저 프론트엔드에서 확인
    const localCheck = canUseFeature();
    if (!localCheck.canUse) {
      return {
        success: false,
        error: localCheck.reason === 'need_charge' 
          ? '이용권이 필요합니다. 쿠팡을 방문해주세요.'
          : '오늘의 이용권을 모두 사용했습니다.',
        remaining: 0
      };
    }
    
    // 프론트엔드 이용권 소모
    const result = useTicket(featureName);
    
    return result;
  } catch (error) {
    console.error('❌ 이용권 사용 실패:', error);
    return {
      success: false,
      error: '오류가 발생했습니다.'
    };
  }
}

// ============================================
// 🌐 전역 노출
// ============================================
window.TicketAPI = {
  charge: chargeTicketsAPI,
  check: checkTicketsAPI,
  use: useTicketAPI,
  getHeaders: getAPIHeaders
};

console.log('📡 이용권 API 모듈 로드 완료');
