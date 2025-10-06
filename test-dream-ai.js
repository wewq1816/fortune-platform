const fetch = require('node-fetch');

async function testDreamAI() {
  try {
    console.log('AI 꿈해몽 테스트 시작...\n');
    
    const dreamText = '용이 하늘을 나는 꿈';
    console.log(`꿈 내용: "${dreamText}"\n`);
    
    const response = await fetch('http://localhost:3000/api/dream/ai-interpret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: dreamText })
    });
    
    const data = await response.json();
    
    console.log('='.repeat(70));
    console.log('AI 응답:');
    console.log('='.repeat(70));
    console.log(JSON.stringify(data, null, 2));
    console.log('\n');
    
    if (data.success) {
      console.log('해석 결과:');
      console.log('-'.repeat(70));
      console.log('의미:', data.interpretation.meaning);
      console.log('길흉:', data.interpretation.fortune_type);
      console.log('해석:', data.interpretation.interpretation);
      console.log('조언:', data.interpretation.advice);
    } else {
      console.log('오류:', data.message);
    }
    
  } catch (error) {
    console.error('테스트 실패:', error.message);
  }
}

testDreamAI();
