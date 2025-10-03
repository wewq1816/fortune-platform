const { getDailyFortune } = require('../engines/core/daily-engine');

console.log('=== 오늘의 운세 엔진 테스트 (업데이트 버전) ===\n');

// 1. 쥐띠 (1996년생)
console.log('1. 쥐띠 (1996년생) - 오늘의 운세:');
const mouse = getDailyFortune(1996);
console.log(`   띠: ${mouse.zodiac} (${mouse.zodiacElement})`);
console.log(`   일진: ${mouse.ganzi} (${mouse.ganziCheongan}${mouse.ganziJiji})`);
console.log(`   일진 오행: ${mouse.ganziElement}`);
console.log(`   오행 관계: ${mouse.relationship}`);
console.log(`   운세: ${mouse.level} (${mouse.score}점)`);
console.log(`   설명: ${mouse.relationshipDesc}`);
console.log(`   메시지: ${mouse.message}`);
console.log('');

// 2. 말띠 (1990년생)
console.log('2. 말띠 (1990년생) - 오늘의 운세:');
const horse = getDailyFortune(1990);
console.log(`   띠: ${horse.zodiac} (${horse.zodiacElement})`);
console.log(`   일진: ${horse.ganzi} (${horse.ganziElement})`);
console.log(`   오행 관계: ${horse.relationship}`);
console.log(`   운세: ${horse.level} (${horse.score}점)`);
console.log('');

// 3. 12띠 전부 테스트
console.log('3. 12띠 전부 오늘의 운세:');
const testYears = [
  { year: 1996, name: '쥐띠' },
  { year: 1997, name: '소띠' },
  { year: 1998, name: '호랑이띠' },
  { year: 1999, name: '토끼띠' },
  { year: 2000, name: '용띠' },
  { year: 2001, name: '뱀띠' },
  { year: 1990, name: '말띠' },
  { year: 1991, name: '양띠' },
  { year: 1992, name: '원숭이띠' },
  { year: 1993, name: '닭띠' },
  { year: 1994, name: '개띠' },
  { year: 1995, name: '돼지띠' }
];

testYears.forEach(({ year, name }) => {
  const fortune = getDailyFortune(year);
  console.log(`   ${name}(${fortune.zodiacElement}): ${fortune.ganzi}(${fortune.ganziElement}) → ${fortune.relationship} ${fortune.level} (${fortune.score}점)`);
});
console.log('');

// 4. 특정 날짜 테스트
console.log('4. 특정 날짜 테스트 (2025년 1월 1일):');
const newYear = getDailyFortune(1996, new Date(2025, 0, 1));
console.log(`   날짜: ${newYear.date}`);
console.log(`   일진: ${newYear.ganzi}`);
console.log(`   쥐띠 운세: ${newYear.level} (${newYear.score}점)`);
console.log('');

// 5. 점수 분포 확인
console.log('5. 점수 분포 확인:');
const scores = {};
testYears.forEach(({ year }) => {
  const fortune = getDailyFortune(year);
  scores[fortune.level] = (scores[fortune.level] || 0) + 1;
});
console.log('   점수별 분포:', scores);

console.log('\n✅ 테스트 완료!');
console.log('\n🎯 주요 개선 사항:');
console.log('   - 60갑자 일진 계산 적용');
console.log('   - 오행 상생상극 기반 점수 계산');
console.log('   - 띠별 오행 매핑 완료');
console.log('   - 관계 설명 자동 생성');
