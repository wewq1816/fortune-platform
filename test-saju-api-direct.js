// 사주 API 직접 테스트
const fetch = require('node-fetch');

async function testSajuAPI() {
  try {
    console.log('📞 사주 API 호출 시작...');
    
    const response = await fetch('http://localhost:3000/api/saju', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        year: 1986,
        month: 7,
        day: 12,
        hour: '未(13:31~15:30)',
        isLunar: true,
        gender: '남성',
        category: 'total'
      })
    });
    
    console.log('✅ 응답 상태:', response.status);
    
    const data = await response.json();
    
    console.log('📦 응답 데이터:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

testSajuAPI();
