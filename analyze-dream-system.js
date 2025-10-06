const DreamEngine = require('./engines/core/dream-engine');
const engine = new DreamEngine();

console.log('='.repeat(70));
console.log('꿈해몽 시스템 분석');
console.log('='.repeat(70));

// 1. DB에 없는 키워드 검색
console.log('\n【테스트 1】 DB에 없는 키워드');
console.log('-'.repeat(70));

const testQueries = [
  '우주선',      // DB에 없을 가능성
  '스마트폰',    // 현대적 키워드
  '비트코인',    // 최신 키워드
  '유튜브',      // 현대 키워드
  '코로나',      // 최근 키워드
];

testQueries.forEach(q => {
  const result = engine.search(q, { limit: 5 });
  console.log(`\n"${q}": ${result.total}개 결과`);
  if (result.total > 0) {
    result.results.slice(0, 3).forEach(d => {
      console.log(`  - ${d.title}`);
    });
  } else {
    console.log('  → 검색 결과 없음 (AI 해석 없음!)');
  }
});

// 2. 정확도 테스트
console.log('\n\n【테스트 2】 검색 정확도');
console.log('-'.repeat(70));

const accuracyTests = [
  { query: '뱀', expected: '뱀 관련' },
  { query: '뱀꿈', expected: '뱀 관련' },
  { query: '뱀이 나왔어', expected: '뱀 관련' },
  { query: '오늘 뱀을 봤는데', expected: '뱀 관련' },
];

accuracyTests.forEach(test => {
  const result = engine.search(test.query, { limit: 3 });
  const match = result.total > 0 && result.results[0].keywords.includes('뱀');
  console.log(`\n"${test.query}": ${match ? '✅ 정확' : '❌ 부정확'} (${result.total}개)`);
  if (result.total > 0) {
    console.log(`  첫 결과: ${result.results[0].title}`);
  }
});

// 3. 현재 시스템 방식
console.log('\n\n【현재 시스템】');
console.log('-'.repeat(70));
console.log('방식: DB 검색 전용 (AI 미사용)');
console.log('장점:');
console.log('  - 빠른 응답 속도');
console.log('  - 일관된 결과');
console.log('  - 비용 없음 (AI API 호출 0)');
console.log('\n단점:');
console.log('  - DB에 없는 키워드는 검색 실패');
console.log('  - 자연어 질문 처리 불가 ("오늘 뱀꿈 꿨는데")');
console.log('  - 복합 키워드 처리 약함 ("큰 검은 뱀")');
console.log('  - 해석이 획일적 (템플릿 방식)');

console.log('\n\n' + '='.repeat(70));
