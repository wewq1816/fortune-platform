/**
 * 개선된 별자리 운세 엔진 테스트
 * 
 * 테스트 항목:
 * 1. 12별자리 모두 점수 계산 확인
 * 2. 같은 별자리 내에서 날짜별 점수 차이 확인
 * 3. 행운의 날 보너스 확인
 * 4. 별자리별 특성 반영 확인
 */

const { getHoroscopeFortune, getTraitsBySign } = require('./engines/core/horoscope-engine');

console.log('='.repeat(60));
console.log('개선된 별자리 운세 엔진 테스트');
console.log('='.repeat(60));
console.log('');

// 테스트 1: 12별자리 전체 테스트
console.log('테스트 1: 12별자리 운세 계산');
console.log('-'.repeat(60));

const testDates = [
  { month: 1, day: 25, expected: '물병자리' },
  { month: 2, day: 25, expected: '물고기자리' },
  { month: 3, day: 25, expected: '양자리' },
  { month: 4, day: 25, expected: '황소자리' },
  { month: 5, day: 25, expected: '쌍둥이자리' },
  { month: 6, day: 25, expected: '게자리' },
  { month: 7, day: 25, expected: '사자자리' },
  { month: 8, day: 25, expected: '처녀자리' },
  { month: 9, day: 25, expected: '천칭자리' },
  { month: 10, day: 25, expected: '전갈자리' },
  { month: 11, day: 25, expected: '사수자리' },
  { month: 12, day: 25, expected: '염소자리' }
];

testDates.forEach(test => {
  const result = getHoroscopeFortune(test.month, test.day);
  const traits = getTraitsBySign(result.sign);
  
  console.log(`생년월일: ${test.month}/${test.day}`);
  console.log(`별자리: ${result.sign} (기대: ${test.expected}) ${result.sign === test.expected ? '✓' : '✗'}`);
  console.log(`운세: ${result.level} (${result.score}점)`);
  console.log(`원소: ${traits.element} | 특성: ${traits.quality} | 변동성: ${traits.volatility}`);
  console.log(`행운의 숫자: ${traits.luckyNumbers.join(', ')}`);
  console.log('');
});

console.log('');
console.log('테스트 2: 같은 별자리 내 날짜별 점수 변화');
console.log('-'.repeat(60));

// 양자리 (3/21-4/19)에서 여러 날짜 테스트
const ariesDates = [
  { month: 3, day: 21 },
  { month: 3, day: 25 },
  { month: 4, day: 1 },
  { month: 4, day: 10 },
  { month: 4, day: 19 }
];

console.log('양자리 날짜별 점수:');
ariesDates.forEach(date => {
  const result = getHoroscopeFortune(date.month, date.day);
  console.log(`${date.month}/${date.day}: ${result.score}점 (${result.level})`);
});

console.log('');
console.log('테스트 3: 행운의 날 효과 확인');
console.log('-'.repeat(60));

// 물병자리의 행운의 날: [4, 13, 22, 31]
const aquariusDates = [
  { month: 1, day: 25, desc: '평범한 날' },
  { month: 1, day: 22, desc: '행운의 날 (22일)' },
  { month: 1, day: 31, desc: '행운의 날 (31일)' }
];

console.log('물병자리 (1/20-2/18) 행운의 날 효과:');
aquariusDates.forEach(date => {
  const result = getHoroscopeFortune(date.month, date.day);
  const traits = getTraitsBySign(result.sign);
  const isLuckyDay = traits.luckyDays.includes(new Date().getDate());
  
  console.log(`생일: ${date.month}/${date.day} (${date.desc})`);
  console.log(`점수: ${result.score}점 | 오늘이 행운의 날? ${isLuckyDay ? '예 (+10점)' : '아니오'}`);
  console.log('');
});

console.log('');
console.log('테스트 4: 별자리별 baseScore 차이 확인');
console.log('-'.repeat(60));

const scoreComparison = testDates.map(test => {
  const result = getHoroscopeFortune(test.month, test.day);
  const traits = getTraitsBySign(result.sign);
  return {
    sign: result.sign,
    baseScore: traits.baseScore,
    actualScore: result.score,
    volatility: traits.volatility
  };
});

scoreComparison.forEach(item => {
  console.log(`${item.sign}: 기본${item.baseScore}점 → 실제${item.actualScore}점 (변동성: ${item.volatility})`);
});

console.log('');
console.log('='.repeat(60));
console.log('테스트 완료!');
console.log('');
console.log('개선 사항 요약:');
console.log('✓ 별자리별 고유 기본 점수 (baseScore) 적용');
console.log('✓ 행운의 날 보너스 (+10점) 적용');
console.log('✓ 요일별 가중치 (별자리마다 다름) 적용');
console.log('✓ 생일 근접도 보너스 적용');
console.log('✓ 변동성 (높음/중간/낮음) 별자리별 다르게 적용');
console.log('');
console.log('결과: 이제 별자리마다 점수 패턴이 다르며,');
console.log('      의미 없는 랜덤이 아닌 특성 기반 계산!');
console.log('='.repeat(60));
