/**
 * 🔐 디바이스 지문 생성기
 * 
 * 브라우저 + 하드웨어 정보를 조합하여 고유한 디바이스 ID 생성
 * VPN/프록시로는 우회 불가능
 */

// ============================================
// 🎨 Canvas 지문 (GPU 정보)
// ============================================
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 텍스트 렌더링 (GPU마다 다름)
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('🔮운세플랫폼', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Device ID', 4, 17);
    
    return canvas.toDataURL();
  } catch (e) {
    return 'canvas_error';
  }
}

// ============================================
// 🎮 WebGL 지문 (GPU 상세 정보)
// ============================================
function getWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'no_webgl';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no_debug_info';
    
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    return `${vendor}~${renderer}`;
  } catch (e) {
    return 'webgl_error';
  }
}

// ============================================
// 🔤 설치된 폰트 감지
// ============================================
function getInstalledFonts() {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New',
    'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS',
    'Trebuchet MS', 'Impact', 'Tahoma', 'Geneva'
  ];
  
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 기준 폰트 크기 측정
  const baseFontWidths = {};
  baseFonts.forEach(baseFont => {
    ctx.font = `${testSize} ${baseFont}`;
    baseFontWidths[baseFont] = ctx.measureText(testString).width;
  });
  
  // 테스트 폰트 감지
  const detectedFonts = [];
  testFonts.forEach(font => {
    let detected = false;
    baseFonts.forEach(baseFont => {
      ctx.font = `${testSize} ${font}, ${baseFont}`;
      const width = ctx.measureText(testString).width;
      if (width !== baseFontWidths[baseFont]) {
        detected = true;
      }
    });
    if (detected) detectedFonts.push(font);
  });
  
  return detectedFonts.join(',');
}

// ============================================
// 📱 디바이스 정보 수집
// ============================================
function getDeviceInfo() {
  const info = {
    // 화면 정보
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    availScreen: `${screen.availWidth}x${screen.availHeight}`,
    
    // 시간대
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    
    // 언어
    language: navigator.language,
    languages: navigator.languages?.join(',') || '',
    
    // 플랫폼
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    
    // 하드웨어
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: navigator.deviceMemory || 0,
    
    // 터치 지원
    maxTouchPoints: navigator.maxTouchPoints || 0,
    
    // 브라우저 기능
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || 'unknown',
    
    // 플러그인
    plugins: Array.from(navigator.plugins || []).map(p => p.name).join(',')
  };
  
  return info;
}

// ============================================
// 🔢 해시 함수 (간단한 해시)
// ============================================
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// ============================================
// 🎯 메인: 디바이스 ID 생성
// ============================================
async function generateDeviceID() {
  try {
    console.log('🔐 디바이스 지문 생성 시작...');
    
    // 모든 지문 정보 수집
    const fingerprints = {
      canvas: getCanvasFingerprint(),
      webgl: getWebGLFingerprint(),
      fonts: getInstalledFonts(),
      device: JSON.stringify(getDeviceInfo())
    };
    
    // 전체 데이터 결합
    const combined = Object.values(fingerprints).join('|');
    
    // 해시 생성
    const deviceId = simpleHash(combined);
    
    console.log('✅ 디바이스 ID 생성 완료:', deviceId);
    
    return deviceId;
  } catch (error) {
    console.error('❌ 디바이스 ID 생성 실패:', error);
    // 폴백: 랜덤 ID
    return 'fallback_' + Math.random().toString(36).substr(2, 9);
  }
}

// ============================================
// 💾 localStorage에 저장/로드
// ============================================
const DEVICE_ID_KEY = 'fortune_device_id';

async function getOrCreateDeviceID() {
  // localStorage에서 먼저 확인
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    // 없으면 새로 생성
    deviceId = await generateDeviceID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
    console.log('💾 디바이스 ID 저장됨:', deviceId);
  } else {
    console.log('📂 기존 디바이스 ID 로드:', deviceId);
    
    // 검증: 다시 계산해서 같은지 확인
    const recalculated = await generateDeviceID();
    if (recalculated !== deviceId) {
      console.warn('⚠️ 디바이스 ID 불일치! 재생성');
      deviceId = recalculated;
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
  }
  
  return deviceId;
}

// ============================================
// 🌐 전역 노출 (다른 스크립트에서 사용 가능)
// ============================================
window.DeviceFingerprint = {
  getDeviceID: getOrCreateDeviceID,
  generateNew: generateDeviceID
};

console.log('🔐 디바이스 지문 모듈 로드 완료');
