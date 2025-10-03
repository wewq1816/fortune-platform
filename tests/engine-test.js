const lottoEngine = require('../engines/core/lotto-engine');
const dailyEngine = require('../engines/core/daily-engine');
const horoscopeEngine = require('../engines/core/horoscope-engine');

console.log('=== 로또 번호 테스트 ===');
const lottoResult = lottoEngine.getLottoFortune('1984-07-07', '홍길동');
console.log(lottoResult);
console.log('');

console.log('=== 오늘의 운세 테스트 ===');
const dailyResult = dailyEngine.getDailyFortune(1984);
console.log(dailyResult);
console.log('');

console.log('=== 별자리 운세 테스트 ===');
const horoscopeResult = horoscopeEngine.getHoroscopeFortune(7, 7);
console.log(horoscopeResult);
console.log('');

console.log('모든 테스트 완료!');
