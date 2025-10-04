// 확장 엔진 테스트

const sajuEngineExtended = require('../engines/core/saju-engine-extended');

console.log('=== 사주 확장 엔진 테스트 ===\n');

// 테스트 데이터
const birthInfo = {
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  gender: 'male',
  isLunar: false
};

// 1. 기본 사주 계산
console.log('1. 기본 사주 계산:');
const basic = sajuEngineExtended.calculateBasic(
  birthInfo.year, birthInfo.month, birthInfo.day, birthInfo.hour, birthInfo.isLunar
);
console.log(JSON.stringify(basic, null, 2));
console.log('\n');

// 2. 대운 계산
console.log('2. 대운 계산:');
const daeun = sajuEngineExtended.calculateDaeun(
  birthInfo.year, birthInfo.month, birthInfo.day, 
  birthInfo.hour, birthInfo.gender, birthInfo.isLunar
);
console.log('대운 (처음 3개):');
daeun.slice(0, 3).forEach(d => {
  console.log('  ' + d.age + ' : ' + d.ganzi);
});
console.log('\n');

// 3. 신살 계산
console.log('3. 신살 계산:');
const sinsal = sajuEngineExtended.calculateSinsal(basic.saju);
console.log(JSON.stringify(sinsal, null, 2));
console.log('\n');

// 4. 택일 계산
console.log('4. 택일 계산 (2025년 10월):');
const taekil = sajuEngineExtended.calculateTaekil(2025, 10, basic);
console.log('좋은 날짜 (상위 5개):');
taekil.slice(0, 5).forEach(t => {
  console.log('  ' + t.date + ' : ' + t.score + '점 (' + t.reason + ')');
});
console.log('\n');

// 5. 전체 계산
console.log('5. 전체 계산:');
const all = sajuEngineExtended.calculateAll(
  birthInfo.year, birthInfo.month, birthInfo.day, 
  birthInfo.hour, birthInfo.gender, birthInfo.isLunar
);
console.log('계산 완료! 결과 키:', Object.keys(all));
console.log('\n');

console.log('테스트 완료!');
