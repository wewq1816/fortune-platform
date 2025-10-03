/**
 * 궁합 API 테스트
 * 
 * 실행 방법:
 * 1. 서버 실행: node server.js
 * 2. 다른 터미널에서: node test-compatibility-api.js
 */

const testCompatibilityAPI = async () => {
  console.log('='.repeat(60));
  console.log('궁합 API 테스트 시작');
  console.log('='.repeat(60));
  console.log('');

  // 테스트 1: 연인 궁합 (쥐띠 ♥ 용띠)
  console.log('📝 테스트 1: 연인 궁합 (쥐띠 ♥ 용띠)');
  console.log('-'.repeat(60));
  
  try {
    const response = await fetch('http://localhost:3000/api/compatibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'lover',
        person1: { year: 1996, month: 1, day: 15 },
        person2: { year: 2000, month: 5, day: 20 }
      })
    });

    const data = await response.json();
    console.log('✅ 응답 성공!');
    console.log('점수:', data.score, '/', 100);
    console.log('레벨:', data.level);
    console.log('별점:', data.stars);
    console.log('띠:', data.person1.zodiac, '♥', data.person2.zodiac);
    console.log('오행:', data.person1.element, '♥', data.person2.element);
    console.log('오행 관계:', data.elementRelation.type);
    console.log('띠 관계:', data.zodiacRelation.description);
    console.log('비용:', '$' + data.cost);
    console.log('');
    console.log('🤖 Claude 해석:');
    console.log(JSON.stringify(data.interpretation, null, 2));
    console.log('');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }

  // 테스트 2: 결혼 궁합
  console.log('📝 테스트 2: 결혼 궁합 (호랑이띠 ♥ 돼지띠)');
  console.log('-'.repeat(60));
  
  try {
    const response = await fetch('http://localhost:3000/api/compatibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'marriage',
        person1: { year: 1986, month: 3, day: 10 },
        person2: { year: 1995, month: 7, day: 25 }
      })
    });

    const data = await response.json();
    console.log('✅ 응답 성공!');
    console.log('점수:', data.score, '/', 100);
    console.log('레벨:', data.level);
    console.log('비용:', '$' + data.cost);
    console.log('');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }

  console.log('='.repeat(60));
  console.log('✅ 테스트 완료!');
  console.log('='.repeat(60));
};

// 테스트 실행
testCompatibilityAPI();
