const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'pages', 'compatibility-test.html');

// UTF-8로 파일 읽기
const content = fs.readFileSync(filePath, 'utf8');

// UTF-8 BOM 없이 다시 저장
fs.writeFileSync(filePath, content, { encoding: 'utf8' });

console.log('✅ UTF-8로 파일 재저장 완료');
