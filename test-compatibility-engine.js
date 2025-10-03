/**
 * 궁합 엔진 테스트
 * 
 * 실행 방법: node test-compatibility-engine.js
 */

const { calculateCompatibility, getZodiacFromYear } = require('./engines/core/compatibility-engine');

console.log('='.repeat(60));
console.log('궁합 엔진 테스트 시작');
console.log('='.repeat(60));
console.log('');

// 테스트 케이스 1: 연인 궁합 (쥐띠 ♥ 용띠) - 삼합
console.log('📝 테스트 1: 연인 궁합 (쥐띠 ♥ 용띠)');
console.log('-'.repeat(60));
const test1 = calculateCompatibility(
  { year: 1996, month: 1, day: 15 },  // 쥐띠
  { year: 2000, month: 5, day: 20 },  // 용띠
  'lover'
);
console.log(JSON.stringify(test1, null, 2));
console.log('');

// 테스트 케이스 2: 결혼 궁합 (호랑이띠 ♥ 돼지띠) - 육합
console.log('📝 테스트 2: 결혼 궁합 (호랑이띠 ♥ 돼지띠)');
console.log('-'.repeat(60));
const test2 = calculateCompatibility(
  { year: 1986, month: 3, day: 10 },  // 호랑이띠
  { year: 1995, month: 7, day: 25 },  // 돼지띠
  'marriage'
);
console.log(JSON.stringify(test2, null, 2));
console.log('');

// 테스트 케이스 3: 가족 궁합 (소띠 ♥ 양띠) - 충
console.log('📝 테스트 3: 가족 궁합 (소띠 ♥ 양띠)');
console.log('-'.repeat(60));
const test3 = calculateCompatibility(
  { year: 1961, month: 2, day: 5 },   // 소띠
  { year: 1991, month: 6, day: 15 },  // 양띠
  'family'
);
console.log(JSON.stringify(test3, null, 2));
console.log('');

// 테스트 케이스 4: 친구 궁합 (원숭이띠 ♥ 원숭이띠) - 같은 띠
console.log('📝 테스트 4: 친구 궁합 (원숭이띠 ♥ 원숭이띠)');
console.log('-'.repeat(60));
const test4 = calculateCompatibility(
  { year: 1992, month: 4, day: 12 },  // 원숭이띠
  { year: 1992, month: 9, day: 20 },  // 원숭이띠
  'friend'
);
console.log(JSON.stringify(test4, null, 2));
console.log('');

// 테스트 케이스 5: 동업 궁합 (뱀띠 ♥ 닭띠) - 삼합
console.log('📝 테스트 5: 동업 궁합 (뱀띠 ♥ 닭띠)');
console.log('-'.repeat(60));
const test5 = calculateCompatibility(
  { year: 1977, month: 8, day: 8 },   // 뱀띠
  { year: 1981, month: 11, day: 3 },  // 닭띠
  'business'
);
console.log(JSON.stringify(test5, null, 2));
console.log('');

// 테스트 케이스 6: 직장 궁합 (말띠 ♥ 쥐띠) - 충
console.log('📝 테스트 6: 직장 궁합 (말띠 ♥ 쥐띠)');
console.log('-'.repeat(60));
const test6 = calculateCompatibility(
  { year: 1990, month: 5, day: 10 },  // 말띠
  { year: 1996, month: 7, day: 20 },  // 쥐띠
  'work'
);
console.log(JSON.stringify(test6, null, 2));
console.log('');

// 12띠 전체 출력
console.log('📋 12띠 전체 목록');
console.log('-'.repeat(60));
for (let year = 2020; year <= 2031; year++) {
  const zodiac = getZodiacFromYear(year);
  console.log(`${year}년: ${zodiac}띠`);
}
console.log('');

console.log('='.repeat(60));
console.log('✅ 테스트 완료!');
console.log('='.repeat(60));
