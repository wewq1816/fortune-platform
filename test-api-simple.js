/**
 * 궁합 API 테스트 (응답 전체 확인)
 */

const testCompatibilityAPI = async () => {
  console.log('궁합 API 테스트 - 연인 궁합');
  
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
    console.log('전체 응답:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('오류:', error.message);
  }
};

testCompatibilityAPI();
