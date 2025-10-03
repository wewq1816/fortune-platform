const { getDailyFortuneBySaju, getDailyFortuneByYear } = require('../engines/core/daily-engine');

console.log('='.repeat(70));
console.log('🔮 오늘의 운세 엔진 테스트 (업그레이드 버전)');
console.log('='.repeat(70));

// 테스트 1: 프리미엄 버전 (사주 8글자 기반)
console.log('\n\n✨ 테스트 1: 프리미엄 버전 - 사주 8글자 기반 운세');
console.log('-'.repeat(70));
console.log('👤 생년월일시: 1990년 3월 15일 오전 7시생 (양력)');

const premium1 = getDailyFortuneBySaju({
  year: 1990,
  month: 3,
  day: 15,
  hour: 7,
  isLunar: false
});

if (premium1.success) {
  console.log('\n📋 사주 8글자:');
  console.log(`   한글: ${premium1.saju.string}`);
  console.log(`   한자: ${premium1.saju.hanja}`);
  console.log(`   일간: ${premium1.saju.ilgan}(${premium1.saju.ilganElement})`);
  
  console.log('\n📅 오늘의 일진:');
  console.log(`   ${premium1.today.ganzi}(${premium1.today.ganziHanja})`);
  console.log(`   천간: ${premium1.today.cheongan}(${premium1.today.element})`);
  
  console.log('\n🎯 오행 관계:');
  console.log(`   관계: ${premium1.relationship}`);
  console.log(`   설명: ${premium1.relationshipDesc}`);
  
  console.log('\n⭐ 운세 결과:');
  console.log(`   등급: ${premium1.level}`);
  console.log(`   점수: ${premium1.score}점`);
  console.log(`\n💬 ${premium1.message}`);
} else {
  console.log('❌ 오류:', premium1.message);
}

// 테스트 2: 다른 사람 (같은 1990년생이지만 다른 월일시)
console.log('\n\n✨ 테스트 2: 같은 1990년생이지만 다른 월일시');
console.log('-'.repeat(70));
console.log('👤 생년월일시: 1990년 10월 20일 오후 3시생 (양력)');

const premium2 = getDailyFortuneBySaju({
  year: 1990,
  month: 10,
  day: 20,
  hour: 15,
  isLunar: false
});

if (premium2.success) {
  console.log('\n📋 사주 8글자:');
  console.log(`   한글: ${premium2.saju.string}`);
  console.log(`   일간: ${premium2.saju.ilgan}(${premium2.saju.ilganElement})`);
  
  console.log('\n⭐ 운세 결과:');
  console.log(`   등급: ${premium2.level}`);
  console.log(`   점수: ${premium2.score}점`);
  console.log(`\n💬 ${premium2.message}`);
}

// 테스트 3: 무료 버전 (띠 기반)
console.log('\n\n💰 테스트 3: 무료 버전 - 띠 기반 운세 (1990년생 전체)');
console.log('-'.repeat(70));
console.log('👤 생년: 1990년 (띠만 확인)');

const free = getDailyFortuneByYear(1990);

if (free.success) {
  console.log('\n🐴 띠 정보:');
  console.log(`   ${free.zodiac}(${free.zodiacElement})`);
  
  console.log('\n📅 오늘의 일진:');
  console.log(`   ${free.ganzi}`);
  
  console.log('\n⭐ 운세 결과:');
  console.log(`   등급: ${free.level}`);
  console.log(`   점수: ${free.score}점`);
  console.log(`\n💬 ${free.message}`);
}

// 비교 분석
console.log('\n\n📊 프리미엄 vs 무료 버전 비교');
console.log('='.repeat(70));
console.log(`
┌─────────────────┬──────────────────┬──────────────────┐
│                 │  프리미엄 (3/15생)│  프리미엄 (10/20생)│
├─────────────────┼──────────────────┼──────────────────┤
│ 사주 8글자      │ ${premium1.saju.string.padEnd(16)} │ ${premium2.saju.string.padEnd(16)} │
│ 일간            │ ${(premium1.saju.ilgan + '(' + premium1.saju.ilganElement + ')').padEnd(16)} │ ${(premium2.saju.ilgan + '(' + premium2.saju.ilganElement + ')').padEnd(16)} │
│ 운세 등급       │ ${premium1.level.padEnd(16)} │ ${premium2.level.padEnd(16)} │
│ 점수            │ ${(premium1.score + '점').padEnd(16)} │ ${(premium2.score + '점').padEnd(16)} │
└─────────────────┴──────────────────┴──────────────────┘

📌 무료 버전 (1990년생 전체): ${free.zodiac}, ${free.level}, ${free.score}점
`);

console.log('='.repeat(70));
console.log('✅ 결론:');
console.log('   - 프리미엄: 같은 1990년생이어도 월일시가 다르면 → 다른 운세');
console.log('   - 무료: 모든 1990년생 → 똑같은 운세 (띠만 확인)');
console.log('   - 프리미엄 버전이 개인화 수준이 훨씬 높음!');
console.log('='.repeat(70));
