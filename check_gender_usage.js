// 전체 페이지 gender 사용 여부 점검 스크립트
const fs = require('fs');
const path = require('path');

const pagesDir = 'C:\\xampp\\htdocs\\mysite\\운세플랫폼\\frontend\\pages';

const pages = {
  'tojeong-test.html': { api: '/api/tojeong', line: 1137 },
  'saju-api-functions.js': { api: '/api/saju', line: 60 },
  'daily-fortune-test.html': { api: '/api/daily-fortune', line: 777 },
  'compatibility-test.html': { api: '/api/compatibility', line: null },
  'horoscope.html': { api: '/api/horoscope', line: null },
  'tarot-mock.html': { api: '/api/tarot', line: null },
  'dream.html': { api: '/api/dream', line: null },
  'lotto.html': { api: '/api/lotto', line: null }
};

console.log('📋 8개 페이지 gender 사용 점검\n');
console.log('='.repeat(60));

Object.keys(pages).forEach(filename => {
  const filePath = path.join(pagesDir, filename);
  const pageInfo = pages[filename];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // requestData 또는 body 부분 찾기
    const hasGenderInRequest = content.includes('gender:') || 
                                content.includes('"gender"') ||
                                content.includes('gender =');
    
    console.log(`\n📄 ${filename}`);
    console.log(`   API: ${pageInfo.api}`);
    console.log(`   Gender 포함: ${hasGenderInRequest ? '✅ YES' : '❌ NO'}`);
    
    if (pageInfo.line) {
      console.log(`   확인 라인: ${pageInfo.line}번째 줄 근처`);
    }
    
  } catch (err) {
    console.log(`\n📄 ${filename}`);
    console.log(`   ⚠️ 파일 읽기 실패: ${err.message}`);
  }
});

console.log('\n' + '='.repeat(60));
