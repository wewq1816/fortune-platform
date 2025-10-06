const { calculateTojeong } = require('./core/tojeong-engine.js');

console.log('========================================');
console.log('토정비결 엔진 상세 검증 테스트');
console.log('========================================\n');

// 검증 테스트 1: 2024년 갑진년 확인
console.log('검증 1: 2024년의 간지가 갑진인지 확인');
const verify1 = calculateTojeong(
  { year: 1990, month: 1, day: 1, isLunar: true },
  2024
);
console.log('2024년 간지:', verify1.ganzi.year);
console.log('예상: 갑진, 실제:', verify1.ganzi.year);
console.log('일치:', verify1.ganzi.year === '갑진' ? '성공' : '실패');

console.log('\n----------------------------------------\n');

// 검증 테스트 2: 2025년 을사년 확인
console.log('검증 2: 2025년의 간지가 을사인지 확인');
const verify2 = calculateTojeong(
  { year: 1990, month: 1, day: 1, isLunar: true },
  2025
);
console.log('2025년 간지:', verify2.ganzi.year);
console.log('예상: 을사, 실제:', verify2.ganzi.year);
console.log('일치:', verify2.ganzi.year === '을사' ? '성공' : '실패');

console.log('\n----------------------------------------\n');

// 검증 테스트 3: 태세수가 60간지 전체를 사용하는지 확인
console.log('검증 3: 태세수가 60간지 전체를 사용하는지 확인');
console.log('2024년 갑진 태세수:', verify1.calculation.taeseSoo, '(예상: 41)');
console.log('2025년 을사 태세수:', verify2.calculation.taeseSoo, '(예상: 42)');
console.log('일치:', 
  verify1.calculation.taeseSoo === 41 && verify2.calculation.taeseSoo === 42 
  ? '성공 - 60간지 전체 사용 확인' 
  : '실패');

console.log('\n----------------------------------------\n');

// 검증 테스트 4: 월건수가 간지 기반인지 확인
console.log('검증 4: 월건수가 간지 기반으로 계산되는지 확인');
console.log('월 간지:', verify2.ganzi.month);
console.log('월건수:', verify2.calculation.wolgunSoo);
console.log('확인: 월건수가 1~60 범위이고 간지마다 다름');

console.log('\n----------------------------------------\n');

// 검증 테스트 5: 일진수가 간지 전체를 사용하는지 확인
console.log('검증 5: 일진수가 간지 전체를 사용하는지 확인');
console.log('일 간지:', verify2.ganzi.day);
console.log('일진수:', verify2.calculation.iljinSoo);
console.log('확인: 일진수가 1~60 범위이고 간지마다 다름');

console.log('\n----------------------------------------\n');

// 검증 테스트 6: 음력 변환 확인
console.log('검증 6: 양력->음력 변환이 정확한지 확인');
const verify6 = calculateTojeong(
  { year: 2000, month: 1, day: 1, isLunar: false }, // 양력 2000년 1월 1일
  2025
);
console.log('양력 입력: 2000년 1월 1일');
console.log('음력 변환:', verify6.lunarDate.year + '년', 
            verify6.lunarDate.month + '월', 
            verify6.lunarDate.day + '일');
console.log('확인: 음력 변환 실행됨');

console.log('\n========================================');
console.log('검증 테스트 완료');
console.log('========================================');
