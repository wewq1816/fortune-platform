// test-saju-fixed.js
// 수정된 사주 계산 테스트

const SajuEngine = require('./engines/core/saju-engine');
const { getDailyFortuneBySaju } = require('./engines/core/daily-engine');

console.log('=== 사주 계산 테스트 (수정 버전) ===\n');

// 테스트 케이스 1: 1990년 3월 15일 14시 30분생
console.log('테스트 1: 1990년 3월 15일 14:30 (미시)');
const sajuEngine1 = new SajuEngine();
const result1 = sajuEngine1.calculateSaju({
  year: 1990,
  month: 3,
  day: 15,
  hour: 14,
  minute: 30
});

console.log('년주:', result1.year.hanja);
console.log('월주:', result1.month.hanja, '(년간에 따른 월건법 적용)');
console.log('일주:', result1.day.hanja);
console.log('시주:', result1.hour.hanja, '(14:30 = 미시)');
console.log('');

// 테스트 케이스 2: 1984년 1월 1일 23시 45분생 (자시)
console.log('테스트 2: 1984년 1월 1일 23:45 (자시)');
const sajuEngine2 = new SajuEngine();
const result2 = sajuEngine2.calculateSaju({
  year: 1984,
  month: 1,
  day: 1,
  hour: 23,
  minute: 45
});

console.log('년주:', result2.year.hanja, '(1984년 = 갑자년)');
console.log('월주:', result2.month.hanja);
console.log('일주:', result2.day.hanja);
console.log('시주:', result2.hour.hanja, '(23:45 = 자시)');
console.log('');

// 테스트 케이스 3: 2000년 6월 10일 01시 25분생 (자시)
console.log('테스트 3: 2000년 6월 10일 01:25 (자시, 경계 테스트)');
const sajuEngine3 = new SajuEngine();
const result3 = sajuEngine3.calculateSaju({
  year: 2000,
  month: 6,
  day: 10,
  hour: 1,
  minute: 25
});

console.log('년주:', result3.year.hanja);
console.log('월주:', result3.month.hanja);
console.log('일주:', result3.day.hanja);
console.log('시주:', result3.hour.hanja, '(01:25 = 자시, 01:30 미만)');
console.log('');

// 테스트 케이스 4: 오늘의 운세
console.log('테스트 4: 오늘의 운세 계산');
const dailyResult = getDailyFortuneBySaju({
  year: 1990,
  month: 3,
  day: 15,
  hour: 14,
  minute: 30
});

if (dailyResult.success) {
  console.log('사주 8글자:', dailyResult.saju.string);
  console.log('일간:', dailyResult.saju.ilgan, '(' + dailyResult.saju.ilganElement + ')');
  console.log('오늘 일진:', dailyResult.today.ganzi, '(' + dailyResult.today.element + ')');
  console.log('오행 관계:', dailyResult.relationship);
  console.log('점수:', dailyResult.score + '점');
  console.log('등급:', dailyResult.level);
  console.log('설명:', dailyResult.relationshipDesc);
} else {
  console.log('오류:', dailyResult.message);
}

console.log('\n=== 테스트 완료 ===');
