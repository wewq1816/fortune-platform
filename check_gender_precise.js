// 정확한 gender 점검 스크립트 v2
const fs = require('fs');
const path = require('path');

const pagesDir = 'C:\\xampp\\htdocs\\mysite\\운세플랫폼\\frontend\\pages';

const checkFile = (filename, searchArea) => {
  const filePath = path.join(pagesDir, filename);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // requestData 찾기
    const requestDataLines = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('requestData') && lines[i].includes('=') && lines[i].includes('{')) {
        // 다음 10줄 확인
        for (let j = i; j < Math.min(i + 15, lines.length); j++) {
          requestDataLines.push(`${j + 1}: ${lines[j]}`);
          if (lines[j].includes('};')) break;
        }
        break;
      }
    }
    
    if (requestDataLines.length > 0) {
      const hasGender = requestDataLines.some(line => 
        line.includes('gender:') || line.includes('"gender"') || line.includes('gender =')
      );
      
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📄 ${filename}`);
      console.log(`Gender 포함: ${hasGender ? '✅ YES' : '❌ NO'}`);
      console.log(`\nrequestData 코드:`);
      requestDataLines.forEach(line => console.log(line));
    } else {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📄 ${filename}`);
      console.log(`⚠️ requestData를 찾을 수 없음`);
    }
    
  } catch (err) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 ${filename}`);
    console.log(`❌ 에러: ${err.message}`);
  }
};

console.log('🔍 8개 페이지 requestData 정확한 점검\n');

const files = [
  'tojeong-test.html',
  'daily-fortune-test.html',
  'compatibility-test.html',
  'horoscope.html',
  'tarot-mock.html',
  'dream.html',
  'lotto.html'
];

files.forEach(file => checkFile(file));

// saju는 별도 파일
console.log(`\n${'='.repeat(60)}`);
console.log(`📄 saju-api-functions.js`);
const sajuPath = path.join(pagesDir, 'saju-api-functions.js');
try {
  const content = fs.readFileSync(sajuPath, 'utf8');
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('JSON.stringify') && i > 50 && i < 80) {
      console.log(`\nJSON.stringify 영역 (${i + 1}번째 줄 근처):`);
      for (let j = Math.max(0, i - 5); j < Math.min(i + 15, lines.length); j++) {
        console.log(`${j + 1}: ${lines[j]}`);
        if (lines[j].includes('})')) break;
      }
      break;
    }
  }
} catch (err) {
  console.log(`❌ 에러: ${err.message}`);
}

console.log(`\n${'='.repeat(60)}\n`);
