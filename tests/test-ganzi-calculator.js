const { getTodayGanzi, getGanziByDate } = require('../engines/utils/ganzi-calculator');

console.log('=== 60갑자 일진 계산 테스트 ===\n');

// 1. 오늘의 일진
console.log('1. 오늘의 일진:');
const today = getTodayGanzi();
console.log(`   날짜: ${new Date().toLocaleDateString('ko-KR')}`);
console.log(`   일진: ${today.korean} (${today.cheongan}${today.jiji})`);
console.log(`   천간: ${today.cheongan} (${today.cheongganElement})`);
console.log(`   지지: ${today.jiji} (${today.jijiElement})`);
console.log(`   띠: ${today.zodiac}`);
console.log(`   납음: ${today.napeum}`);
console.log('');

// 2. 알려진 날짜 검증
console.log('2. 알려진 날짜 검증:');
console.log('   2025년 1월 1일 (설날 근처)');
const newYear2025 = getGanziByDate(2025, 1, 1);
console.log(`   → ${newYear2025.korean} (${newYear2025.cheongganElement})`);
console.log('');

console.log('   1900년 1월 1일 (기준일 - 갑자일이어야 함)');
const base1900 = getGanziByDate(1900, 1, 1);
console.log(`   → ${base1900.korean} (index: ${base1900.index})`);
console.log(`   ✅ ${base1900.korean === '갑자' && base1900.index === 0 ? '정확함' : '오류!'}`);
console.log('');

// 3. 60일 후는 같은 일진이어야 함
console.log('3. 60일 주기 검증:');
const someDate = new Date(2025, 0, 15);
const ganzi1 = getTodayGanzi(someDate);
const after60Days = new Date(2025, 0, 15 + 60);
const ganzi2 = getTodayGanzi(after60Days);
console.log(`   ${someDate.toLocaleDateString('ko-KR')}: ${ganzi1.korean}`);
console.log(`   60일 후: ${ganzi2.korean}`);
console.log(`   ✅ ${ganzi1.korean === ganzi2.korean ? '60일 주기 확인됨' : '오류!'}`);
console.log('');

// 4. 연속된 날짜들
console.log('4. 연속된 5일 일진:');
for (let i = 0; i < 5; i++) {
  const date = new Date(2025, 0, 1 + i);
  const ganzi = getTodayGanzi(date);
  console.log(`   ${date.toLocaleDateString('ko-KR')}: ${ganzi.korean} (${ganzi.cheongganElement}/${ganzi.jijiElement})`);
}

console.log('\n✅ 테스트 완료!');
