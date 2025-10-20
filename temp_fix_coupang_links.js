const fs = require('fs');
const path = require('path');

const files = [
  'frontend/pages/tojeong-test.html',
  'frontend/pages/tarot-mock.html',
  'frontend/pages/saju-test.html',
  'frontend/pages/lotto.html',
  'frontend/pages/dream.html',
  'frontend/pages/compatibility-test.html',
  'frontend/index.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // showChargeTicketModal 내부의 하드코딩된 쿠팡 링크 부분을 제거
  // 대신 간단하게 checkTicketAndExecute 호출하도록 변경하지 않고
  // 실제 함수 호출 부분만 찾아서 수정
  
  console.log(`Processing ${file}...`);
  console.log(`파일이 ticket-wrapper.js를 포함하는지 확인 필요`);
});

console.log('스크립트 완료');
