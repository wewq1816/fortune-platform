/**
 * 🌐 API 호출 헬퍼 함수
 * 모든 API 호출에 디바이스 ID를 자동으로 추가
 * 마스터 모드 지원 추가 (2025-01-07)
 */

/**
 * 디바이스 ID를 포함한 fetch 래퍼
 * @param {string} url - API URL
 * @param {object} options - fetch options
 * @returns {Promise<Response>}
 */
async function fetchWithDeviceId(url, options = {}) {
  // 디바이스 ID 가져오기
  let deviceId;
  if (typeof getOrCreateDeviceId === 'function') {
    deviceId = await getOrCreateDeviceId();
  } else {
    // Fallback: localStorage에서 직접 가져오기
    deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
  }
  
  // 헤더에 디바이스 ID 추가
  const headers = {
    ...options.headers,
    'X-Device-Id': deviceId
  };
  
  // ⭐ 마스터 모드일 때 헤더에 마스터 코드 추가
  if (typeof isMasterMode === 'function' && isMasterMode()) {
    headers['X-Master-Code'] = 'cooal';
    console.log('🔓 API 호출에 마스터 코드 추가');
  }
  
  // fetch 호출
  return fetch(url, {
    ...options,
    headers
  });
}

// 전역 노출
window.fetchWithDeviceId = fetchWithDeviceId;

console.log('✅ API 헬퍼 로드 완료 (마스터 모드 지원)');
