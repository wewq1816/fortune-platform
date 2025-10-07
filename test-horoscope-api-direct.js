// 별자리 API 직접 테스트 (Node.js 내장 모듈 사용)
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
          console.log(JSON.stringify(jsonData, null, 2));
          console.log('='.repeat(80));
          
          if (jsonData.success) {
            console.log('\n🎉 테스트 성공!');
            console.log(`별자리: ${jsonData.sign} (${jsonData.signEn}) ${jsonData.symbol}`);
            console.log(`점수: ${jsonData.score}점 / ${jsonData.level}`);
            console.log(`\n운세 내용 (${jsonData.fortune.운세?.length || 0}자):`);
            console.log(jsonData.fortune.운세);
            console.log(`\n💰 비용: ${jsonData.cost}`);
          } else {
            console.log('❌ 테스트 실패:', jsonData.message || jsonData.error);
          }
          
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

console.log('🔮 별자리 운세 API 테스트 시작...\n');
testHoroscopeAPI().catch(console.error);
