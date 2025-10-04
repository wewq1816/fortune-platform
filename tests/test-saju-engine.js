// tests/test-saju-engine.js
// 사주팔자 엔진 테스트 (십성 포함)

const SajuEngine = require('../engines/core/saju-engine');

console.log('='.repeat(60));
console.log('사주팔자 엔진 테스트 (십성 포함)');
console.log('='.repeat(60));
console.log('');

const engine = new SajuEngine();

const birthInfo = {
  year: 1984,
  month: 7,
  day: 7,
  hour: '미',
  isLunar: false
};

try {
  // 1. 사주 8글자
  const saju = engine.calculateSaju(birthInfo);
  console.log('✅ 사주 8글자:');
  console.log(`   년주: ${saju.year.cheongan}${saju.year.jiji} (${saju.year.hanja})`);
  console.log(`   월주: ${saju.month.cheongan}${saju.month.jiji} (${saju.month.hanja})`);
  console.log(`   일주: ${saju.day.cheongan}${saju.day.jiji} (${saju.day.hanja})`);
  console.log(`   시주: ${saju.hour.cheongan}${saju.hour.jiji} (${saju.hour.hanja})`);
  console.log(`   일간: ${saju.ilgan}`);

  // 2. 오행 분포
  const elements = engine.calculateElements(saju);
  console.log('\n✅ 오행 분포:');
  console.log(`   목(木): ${elements.목}개`);
  console.log(`   화(火): ${elements.화}개`);
  console.log(`   토(土): ${elements.토}개`);
  console.log(`   금(金): ${elements.금}개`);
  console.log(`   수(水): ${elements.수}개`);

  // 3. 신강/신약
  const strength = engine.calculateStrength(saju, elements);
  console.log(`\n✅ 신강/신약: ${strength}`);

  // 4. 용신
  const yongsin = engine.findYongsin(strength, elements, saju.ilgan);
  console.log(`✅ 용신: ${yongsin}`);

  // 5. 십성 (새로 추가!)
  const tenStars = engine.calculateTenStars(saju);
  console.log('\n✅ 십성 분석:');
  console.log(`   년주: ${tenStars.year.cheongan} (천간), ${tenStars.year.jiji} (지지)`);
  console.log(`   월주: ${tenStars.month.cheongan} (천간), ${tenStars.month.jiji} (지지)`);
  console.log(`   일주: ${tenStars.day.cheongan} (천간), ${tenStars.day.jiji} (지지)`);
  console.log(`   시주: ${tenStars.hour.cheongan} (천간), ${tenStars.hour.jiji} (지지)`);

  console.log('\n' + '='.repeat(60));
  console.log('테스트 성공! ✅');
  console.log('='.repeat(60));

} catch (error) {
  console.error('\n❌ 오류 발생:', error.message);
  console.error(error.stack);
}
