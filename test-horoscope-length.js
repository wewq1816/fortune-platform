// 별자리 API 테스트 - 200-400자 검증
const http = require('http');

async function testHoroscopeAPI() {
  const data = JSON.stringify({
    year: 1995,
    month: 3,
    day: 15,
    hour: 12,
    minute: 0
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/horoscope',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          console.log('✅ API 응답 성공!');
          console.log('='.repeat(80));
          
          if (jsonData.success) {
            const fortuneText = jsonData.fortune.운세 || '';
            const fortuneLength = fortuneText.length;
            
            console.log(`🌟 별자리: ${jsonData.sign} (${jsonData.signEn}) ${jsonData.symbol}`);
            console.log(`📊 점수: ${jsonData.score}점 / ${jsonData.level}`);
            console.log(`📝 운세 길이: ${fortuneLength}자`);
            
            // 길이 체크
            if (fortuneLength >= 200 && fortuneLength <= 400) {
              console.log(`✅ 길이 검증 통과! (200-400자 범위)`);
            } else if (fortuneLength < 200) {
              console.log(`⚠️ 너무 짧습니다! (${fortuneLength}자 < 200자)`);
            } else {
              console.log(`⚠️ 너무 깁니다! (${fortuneLength}자 > 400자)`);
            }
            
            console.log('\n📖 운세 내용:');
            console.log('-'.repeat(80));
            console.log(fortuneText);
            console.log('-'.repeat(80));
            
            console.log(`\n🎯 핵심키워드: ${jsonData.fortune.핵심키워드}`);
            console.log(`🎨 행운의 색: ${jsonData.fortune.행운의색}`);
            console.log(`🔢 행운의 숫자: ${jsonData.fortune.행운의숫자}`);
            console.log(`🍀 행운의 아이템: ${jsonData.fortune.행운의아이템}`);
            console.log(`⚠️ 조심할 시간: ${jsonData.fortune.조심할시간}`);
            console.log(`💰 비용: ${jsonData.cost}`);
          } else {
            console.log('❌ 테스트 실패:', jsonData.message || jsonData.error);
          }
          
          console.log('='.repeat(80));
          resolve(jsonData);
        } catch (e) {
          console.error('❌ JSON 파싱 오류:', e.message);
          console.log('응답:', responseData);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ 요청 오류:', error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

console.log('🔮 별자리 운세 API 테스트 시작 (200-400자 검증)...\n');
testHoroscopeAPI().catch(console.error);
