/**
 * 토정비결 엔진 테스트
 */

const { calculateTojeong } = require('../engines/core/tojeong-engine');

console.log('===== 토정비결 엔진 테스트 시작 =====\n');

// 테스트 케이스 1: 1990년생, 2025년 운세
const birthInfo1 = {
  year: 1990,
  month: 5,
  day: 15,
  isLunar: false
};

console.log('테스트 1: 1990년 5월 15일생, 2025년 운세');
const result1 = calculateTojeong(birthInfo1, 2025);
console.log(JSON.stringify(result1, null, 2));

console.log('\n\n');

// 테스트 케이스 2: 1965년생, 2025년 운세
const birthInfo2 = {
  year: 1965,
  month: 3,
  day: 20,
  isLunar: true
};

console.log('테스트 2: 1965년 3월 20일생(음력), 2025년 운세');
const result2 = calculateTojeong(birthInfo2, 2025);
console.log(JSON.stringify(result2, null, 2));

console.log('\n===== 테스트 완료 =====');
