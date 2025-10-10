/**
 * 운세플랫폼 방문자 추적 시스템
 * - 디바이스 ID 기반 고유 식별자 (브라우저 핑거프린팅)
 * - 방문 기록
 * - 쿠팡 클릭 추적
 * - 이용권 사용 추적
 */

// API 엔드포인트
const API_BASE_URL = 'https://fortune-platform.onrender.com/api/analytics';

/**
 * 방문자 고유 ID 생성 또는 가져오기
 * 디바이스 ID 사용 (device-id.js에서 생성)
 */
async function getVisitorId() {
  // device-id.js에서 디바이스 ID 가져오기
  if (typeof getOrCreateDeviceId === 'function') {
    return await getOrCreateDeviceId();
  }
  
  // Fallback: localStorage 기반 (device-id.js 로드 실패 시)
  let visitorId = localStorage.getItem('visitorId');
  
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitorId', visitorId);
    console.log('✅ 새로운 방문자 ID 생성 (fallback):', visitorId);
  } else {
    console.log('✅ 기존 방문자 ID 로드 (fallback):', visitorId);
  }
  
  return visitorId;
}

/**
 * 방문 기록
 * 하루에 한 번만 방문자로 카운트 (같은 날짜에는 중복 카운트 안함)
 */
async function trackVisit() {
  try {
    const visitorId = await getVisitorId();  // async로 변경
    
    // 오늘 날짜 (YYYY-MM-DD 형식)
    const today = new Date().toISOString().split('T')[0];
    
    // 마지막 방문 기록 날짜 확인
    const lastVisitDate = localStorage.getItem('lastVisitDate');
    
    // 오늘 이미 방문 기록이 있으면 스킵
    if (lastVisitDate === today) {
      console.log('✅ 오늘 이미 방문 기록됨 (스킵)');
      return;
    }
    
    const response = await fetch(`${API_BASE_URL}/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        visitorId,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      })
    });
    
    if (response.ok) {
      // 오늘 날짜를 저장 (다음 방문 시 중복 방지)
      localStorage.setItem('lastVisitDate', today);
      console.log('✅ 방문 기록 성공 (오늘 첫 방문)');
    } else {
      console.warn('⚠️  방문 기록 실패:', response.status);
    }
  } catch (error) {
    console.error('❌ 방문 기록 오류:', error);
  }
}

/**
 * 쿠팡 클릭 추적
 * 쿠팡 게이트 페이지 이동 전 호출
 */
async function trackCoupangClick() {
  try {
    const visitorId = await getVisitorId();  // async로 변경
    
    const response = await fetch(`${API_BASE_URL}/coupang-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        visitorId,
        referrer: window.location.href
      })
    });
    
    if (response.ok) {
      console.log('✅ 쿠팡 클릭 기록 성공');
    } else {
      console.warn('⚠️  쿠팡 클릭 기록 실패:', response.status);
    }
  } catch (error) {
    console.error('❌ 쿠팡 클릭 기록 오류:', error);
  }
}

/**
 * 이용권 사용 추적
 * 각 운세 기능 사용 시 호출
 * @param {string} feature - 기능명 (예: '오늘의 운세', '타로 카드')
 */
async function trackTicketUsage(feature) {
  try {
    const visitorId = await getVisitorId();  // async로 변경
    
    const response = await fetch(`${API_BASE_URL}/ticket-usage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        visitorId,
        feature
      })
    });
    
    if (response.ok) {
      console.log(`✅ 이용권 사용 기록 성공: ${feature}`);
    } else {
      console.warn('⚠️  이용권 사용 기록 실패:', response.status);
    }
  } catch (error) {
    console.error('❌ 이용권 사용 기록 오류:', error);
  }
}

/**
 * 페이지 로드 시 자동 방문 기록
 * 모든 페이지에서 실행됨 (관리자 페이지 제외)
 */
if (typeof document !== 'undefined') {
  // 관리자 페이지는 추적하지 않음
  const isAdminPage = window.location.pathname.includes('/admin/');
  
  if (!isAdminPage) {
    // DOMContentLoaded 이벤트가 이미 발생했는지 확인
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', trackVisit);
    } else {
      // 이미 로드 완료된 경우 바로 실행
      trackVisit();
    }
  } else {
    console.log('🔒 관리자 페이지는 방문자 추적에서 제외됩니다');
  }
}

// 전역으로 내보내기 (다른 스크립트에서 사용 가능)
window.getVisitorId = getVisitorId;
window.trackVisit = trackVisit;
window.trackCoupangClick = trackCoupangClick;
window.trackTicketUsage = trackTicketUsage;

console.log('📊 Analytics Tracker 로드 완료');
