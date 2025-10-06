/**
 * DB 기반 AI 꿈해몽 테스트
 */

const DreamEngine = require('../engines/core/dream-engine');

console.log('🧪 DB 기반 AI 꿈해몽 테스트 시작\n');
console.log('='.repeat(70));

const engine = new DreamEngine();

// 테스트 케이스
const testCases = [
  '용이 하늘을 나는 꿈',
  '돈을 줍는 꿈',
  '시험에 떨어지는 꿈',
  '뱀이 나를 물어요'
];

async function runTests() {
  for (const dreamText of testCases) {
    console.log(`\n\n📝 테스트: "${dreamText}"`);
    console.log('-'.repeat(70));
    
    const result = await engine.interpretWithDB(dreamText);
    
    if (result.success) {
      console.log(`✅ 성공!`);
      console.log(`DB 검색 결과: ${result.dbResultsCount}개`);
      console.log(`DB 사용 여부: ${result.usedDB ? '예' : '아니오'}`);
      console.log(`소스: ${result.source}`);
      console.log(`\n해석 결과:`);
      console.log(`  의미: ${result.interpretation.meaning}`);
      console.log(`  길흉: ${result.interpretation.fortune_type}`);
      console.log(`  해석: ${result.interpretation.interpretation.substring(0, 100)}...`);
      console.log(`  조언: ${result.interpretation.advice}`);
    } else {
      console.log(`❌ 실패: ${result.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ 모든 테스트 완료!\n');
}

runTests();
