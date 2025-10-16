// ============================================
// API Logger 자동 적용 스크립트
// ============================================

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('API Logger 자동 적용 시작...');
console.log('='.repeat(60));

const serverPath = path.join(__dirname, 'server.js');

// 백업 생성
const backupPath = path.join(__dirname, `server.js.backup.${Date.now()}`);
fs.copyFileSync(serverPath, backupPath);
console.log(`[1/4] 백업 생성: ${path.basename(backupPath)}`);

let content = fs.readFileSync(serverPath, 'utf8');
let modified = false;

// 1. 로거 import 추가
if (!content.includes('api-logger')) {
  console.log('[2/4] 로거 import 추가 중...');
  
  content = content.replace(
    "require('dotenv').config();",
    "require('dotenv').config();\n\n" +
    "// ============================================\n" +
    "// API Logger\n" +
    "// ============================================\n" +
    "const {\n" +
    "  logApiRequest,\n" +
    "  logApiSuccess,\n" +
    "  logApiError,\n" +
    "  logClaudeApiCall,\n" +
    "  logInfo,\n" +
    "  logWarning\n" +
    "} = require('./backend/utils/api-logger');\n\n" +
    "logInfo('서버 시작 준비 중...', 'system');"
  );
  modified = true;
  console.log('   완료!');
} else {
  console.log('[2/4] 로거 import 이미 존재 - 건너뜀');
}

// 2. 각 API 엔드포인트에 로거 추가
console.log('[3/4] API 엔드포인트에 로거 추가 중...');

const apis = [
  '/api/saju',
  '/api/tarot',
  '/api/daily-fortune',
  '/api/horoscope',
  '/api/tojeong',
  '/api/compatibility',
  '/api/dream/interpret'
];

let addedCount = 0;

apis.forEach(api => {
  const apiName = api.replace(/\//g, '\\/');
  
  // 이미 로거가 있는지 확인
  const checkPattern = new RegExp(`app\\.post\\('${apiName}'[^{]*\\{[^}]*logApiRequest`, 's');
  if (checkPattern.test(content)) {
    console.log(`   ${api}: 이미 존재 - 건너뜀`);
    return;
  }
  
  // 로거 추가
  const pattern = new RegExp(
    `(app\\.post\\('${apiName}'[^{]*async \\(req, res\\) => \\{)`,
    's'
  );
  
  if (pattern.test(content)) {
    content = content.replace(
      pattern,
      `$1\n  logApiRequest(req, '${api}');`
    );
    addedCount++;
    console.log(`   ${api}: 추가 완료`);
  } else {
    console.log(`   ${api}: 패턴 찾을 수 없음`);
  }
});

if (addedCount > 0) {
  modified = true;
  console.log(`   총 ${addedCount}개 API에 로거 추가됨`);
}

// 3. 파일 저장
if (modified) {
  console.log('[4/4] 변경사항 저장 중...');
  fs.writeFileSync(serverPath, content, 'utf8');
  console.log('   완료!');
  console.log('='.repeat(60));
  console.log('성공! API Logger 적용 완료!');
  console.log(`백업 파일: ${path.basename(backupPath)}`);
} else {
  console.log('[4/4] 변경사항 없음 - 저장 건너뜀');
  console.log('='.repeat(60));
  console.log('이미 모든 로거가 적용되어 있습니다.');
  // 백업 파일 삭제
  fs.unlinkSync(backupPath);
}

console.log('='.repeat(60));
console.log('');
console.log('다음 단계:');
console.log('1. node server.js 실행');
console.log('2. 브라우저에서 http://localhost:3000 접속');
console.log('3. 기능 테스트');
console.log('4. logs/error-2025-XX-XX.log 파일 확인');
console.log('');
