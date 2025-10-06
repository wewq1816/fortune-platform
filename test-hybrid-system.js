const DreamEngine = require('./engines/core/dream-engine');
const engine = new DreamEngine();

console.log('='.repeat(70));
console.log('DB + AI 하이브리드 시스템 테스트');
console.log('='.repeat(70));

// 1. DB 검색 (기존)
console.log('\n【테스트 1】 DB 검색 (뱀)');
console.log('-'.repeat(70));
const dbResult = engine.search('뱀', { limit: 3 });
console.log(`결과: ${dbResult.total}개`);
console.log(`소스: ${dbResult.source}`);
dbResult.results.forEach(d => console.log(`  - ${d.title}`));

// 2. DB에 없는 키워드
console.log('\n【테스트 2】 DB에 없는 키워드 (유튜브) - useAI=false');
console.log('-'.repeat(70));
const noResult1 = engine.search('유튜브', { limit: 3, useAI: false });
console.log(`결과: ${noResult1.total}개`);
console.log(`AI 제안: ${noResult1.aiSuggestion ? '없음' : '없음'}`);

// 3. DB에 없는 키워드 + AI 제안
console.log('\n【테스트 3】 DB에 없는 키워드 (유튜브) - useAI=true');
console.log('-'.repeat(70));
const noResult2 = engine.search('유튜브', { limit: 3, useAI: true });
console.log(`결과: ${noResult2.total}개`);
console.log(`AI 제안: ${noResult2.aiSuggestion ? '있음' : '없음'}`);
if (noResult2.aiSuggestion) {
  console.log(`  메시지: ${noResult2.aiSuggestion.message}`);
  console.log(`  엔드포인트: ${noResult2.aiSuggestion.endpoint}`);
}

// 4. AI 해석 (실제 Claude API 호출)
console.log('\n【테스트 4】 AI 해석 실행 (유튜브)');
console.log('-'.repeat(70));

(async () => {
  try {
    const aiResult = await engine.interpretWithAI('유튜브');
    
    if (aiResult.success) {
      console.log('✅ AI 해석 성공');
      console.log(`소스: ${aiResult.source}`);
      console.log(`모델: ${aiResult.model}`);
      console.log('\n【AI 해석 내용】');
      console.log(aiResult.aiInterpretation);
      console.log('\n경고:', aiResult.warning);
    } else {
      console.log('❌ AI 해석 실패');
      console.log(`이유: ${aiResult.message}`);
    }
  } catch (error) {
    console.error('오류:', error.message);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('테스트 완료');
  console.log('='.repeat(70));
})();
