/**
 * 디바이스 ID 생성 유틸리티
 * 브라우저 핑거프린팅 기반 고유 식별자
 */

/**
 * 디바이스 ID 생성
 * @returns {Promise<string>} 고유 디바이스 ID
 */
async function generateDeviceId() {
  // 브라우저 특성 수집
  const components = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(',') || '',
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    screenColorDepth: screen.colorDepth,
    timezoneOffset: new Date().getTimezoneOffset(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: navigator.deviceMemory || 0,
    touchSupport: 'ontouchstart' in window,
    // Canvas 핑거프린팅 (선택)
    canvas: getCanvasFingerprint()
  };

  // JSON 문자열로 변환
  const componentString = JSON.stringify(components);
  
  // SHA-256 해시 생성
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(componentString));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // 디바이스 ID 형식
  return `device_${hashHex.substring(0, 32)}`;
}

/**
 * Canvas 핑거프린팅
 * @returns {string} Canvas 해시
 */
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    canvas.width = 200;
    canvas.height = 50;
    
    // 텍스트 그리기
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 200, 50);
    ctx.fillStyle = '#069';
    ctx.fillText('Device Fingerprint 🔐', 2, 15);
    
    // 이미지 데이터를 해시로 변환
    return canvas.toDataURL();
  } catch (e) {
    return '';
  }
}

/**
 * 디바이스 ID 가져오기 (캐시 사용)
 * @returns {Promise<string>}
 */
async function getOrCreateDeviceId() {
  // localStorage에서 기존 ID 확인
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    // 새로 생성
    deviceId = await generateDeviceId();
    localStorage.setItem('deviceId', deviceId);
    console.log('✅ 새 디바이스 ID 생성:', deviceId);
  } else {
    console.log('✅ 기존 디바이스 ID 로드:', deviceId);
  }
  
  return deviceId;
}

// 전역 노출
window.getOrCreateDeviceId = getOrCreateDeviceId;
window.generateDeviceId = generateDeviceId;

console.log('🔐 디바이스 ID 유틸리티 로드 완료');
