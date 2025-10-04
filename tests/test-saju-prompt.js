// tests/test-saju-prompt.js
// 사주 프롬프트 테스트

const SajuEngine = require('../engines/core/saju-engine');
const { getSajuPrompt } = require('../backend/prompts/saju-prompt');

console.log('='.repeat(60));
console.log('사주 프롬프트 테스트');
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
  // 엔진 계산
  const saju = engine.calculateSaju(birthInfo);
  const elements = engine.calculateElements(saju);
  const strength = engine.calculateStrength(saju, elements);
  const yongsin = engine.findYongsin(strength, elements, saju.ilgan);
  const tenStars = engine.calculateTenStars(saju);

  const engineResult = {
    saju,
    ilgan: saju.ilgan,
    elements,
    strength,
    yongsin,
    tenStars
  };

  // 4가지 카테고리 프롬프트 생성
  console.log('📋 1. 총운 프롬프트:');
  console.log('-'.repeat(60));
  console.log(getSajuPrompt('total', engineResult));
  console.log('');

  console.log('💰 2. 재물운 프롬프트:');
  console.log('-'.repeat(60));
  console.log(getSajuPrompt('wealth', engineResult));
  console.log('');

  console.log('💕 3. 애정운 프롬프트:');
  console.log('-'.repeat(60));
  console.log(getSajuPrompt('love', engineResult, { gender: '여성' }));
  console.log('');

  console.log('🏥 4. 건강운 프롬프트:');
  console.log('-'.repeat(60));
  console.log(getSajuPrompt('health', engineResult));
  console.log('');

  console.log('='.repeat(60));
  console.log('프롬프트 생성 성공! ✅');
  console.log('='.repeat(60));

} catch (error) {
  console.error('❌ 오류:', error.message);
  console.error(error.stack);
}
