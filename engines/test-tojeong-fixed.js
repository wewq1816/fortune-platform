const { calculateTojeong } = require('./core/tojeong-engine.js');

console.log('========================================');
console.log('토정비결 엔진 테스트 (수정 후)');
console.log('========================================\n');

// 테스트 케이스 1: 1990년 3월 15일생, 2025년 운세
console.log('테스트 1: 1990년 3월 15일생 (양력), 2025년 운세');
const test1 = calculateTojeong(
  { year: 1990, month: 3, day: 15, isLunar: false },
  2025
);

if (test1.success) {
  console.log('성공!');
  console.log('나이:', test1.age);
  console.log('년 간지:', test1.ganzi.year);
  console.log('월 간지:', test1.ganzi.month);
  console.log('일 간지:', test1.ganzi.day);
  console.log('상수:', test1.calculation.sangSu);
  console.log('중수:', test1.calculation.jungSu);
  console.log('하수:', test1.calculation.haSu);
  console.log('괘 번호:', test1.calculation.guaNumber);
  console.log('괘 이름:', test1.mainGua.name);
  console.log('괘 등급:', test1.mainGua.level);
  console.log('태세수:', test1.calculation.taeseSoo);
  console.log('월건수:', test1.calculation.wolgunSoo);
  console.log('일진수:', test1.calculation.iljinSoo);
  console.log('월 달수:', test1.calculation.monthDays);
} else {
  console.log('실패:', test1.error);
}


console.log('\n----------------------------------------\n');

// 테스트 케이스 2: 1984년 1월 1일생 (음력), 2025년 운세
console.log('테스트 2: 1984년 1월 1일생 (음력), 2025년 운세');
const test2 = calculateTojeong(
  { year: 1984, month: 1, day: 1, isLunar: true },
  2025
);

if (test2.success) {
  console.log('성공!');
  console.log('나이:', test2.age);
  console.log('년 간지:', test2.ganzi.year);
  console.log('괘 번호:', test2.calculation.guaNumber);
  console.log('괘 이름:', test2.mainGua.name);
} else {
  console.log('실패:', test2.error);
}

console.log('\n----------------------------------------\n');

// 테스트 케이스 3: 2000년 5월 20일생 (양력), 2025년 운세
console.log('테스트 3: 2000년 5월 20일생 (양력), 2025년 운세');
const test3 = calculateTojeong(
  { year: 2000, month: 5, day: 20, isLunar: false },
  2025
);

if (test3.success) {
  console.log('성공!');
  console.log('나이:', test3.age);
  console.log('년 간지:', test3.ganzi.year);
  console.log('괘 번호:', test3.calculation.guaNumber);
  console.log('괘 이름:', test3.mainGua.name);
  console.log('괘 등급:', test3.mainGua.level);
} else {
  console.log('실패:', test3.error);
}

console.log('\n========================================');
console.log('테스트 완료');
console.log('========================================');
