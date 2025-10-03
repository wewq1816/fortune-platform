/**
 * 꿈해몽 검색 엔진 테스트
 */

const DreamEngine = require('../engines/core/dream-engine');

console.log('🧪 꿈해몽 검색 엔진 테스트 시작\n');
console.log('='.repeat(70));

const engine = new DreamEngine();

// 테스트 1: 기본 검색
console.log('\n📝 테스트 1: 기본 검색 ("뱀")');
console.log('-'.repeat(70));
const result1 = engine.search('뱀', { limit: 5 });
console.log(`검색어: ${result1.query}`);
console.log(`총 결과: ${result1.total}개`);
console.log(`페이지: ${result1.page}/${result1.totalPages}`);
console.log('\n상위 5개 결과:');
result1.results.forEach((dream, i) => {
  console.log(`\n${i + 1}. ${dream.title} (ID: ${dream.id}, 점수: ${dream.score})`);
  console.log(`   카테고리: ${dream.category}`);
  console.log(`   의미: ${dream.meaning}`);
  console.log(`   길흉: ${dream.fortune_type}`);
  console.log(`   키워드: ${dream.keywords.slice(0, 5).join(', ')}`);
});

// 테스트 2: 카테고리 필터
console.log('\n\n📝 테스트 2: 카테고리 필터 ("물" + 자연)');
console.log('-'.repeat(70));
const result2 = engine.search('물', { category: '자연', limit: 3 });
console.log(`검색어: ${result2.query}`);
console.log(`카테고리: ${result2.category}`);
console.log(`총 결과: ${result2.total}개`);
console.log('\n상위 3개 결과:');
result2.results.forEach((dream, i) => {
  console.log(`\n${i + 1}. ${dream.title} (점수: ${dream.score})`);
  console.log(`   해석: ${dream.interpretation.substring(0, 80)}...`);
});

// 테스트 3: ID로 조회
console.log('\n\n📝 테스트 3: ID로 조회 (ID: 1)');
console.log('-'.repeat(70));
const result3 = engine.getDreamById(1);
if (result3.success) {
  const dream = result3.dream;
  console.log(`제목: ${dream.title}`);
  console.log(`카테고리: ${dream.category}`);
  console.log(`의미: ${dream.meaning}`);
  console.log(`길흉: ${dream.fortune_type}`);
  console.log(`키워드: ${dream.keywords.join(', ')}`);
  console.log(`해석:\n${dream.interpretation}`);
  console.log(`\n관련 꿈 (${dream.relatedDreams.length}개):`);
  dream.relatedDreams.forEach((related, i) => {
    console.log(`  ${i + 1}. ${related.title} (ID: ${related.id})`);
  });
}

// 테스트 4: 카테고리 목록
console.log('\n\n📝 테스트 4: 카테고리 목록');
console.log('-'.repeat(70));
const result4 = engine.getCategories();
console.log('전체 카테고리:');
result4.categories.forEach(cat => {
  console.log(`  • ${cat.name}: ${cat.count}개`);
});

// 테스트 5: 랜덤 꿈
console.log('\n\n📝 테스트 5: 랜덤 꿈');
console.log('-'.repeat(70));
const result5 = engine.getRandomDream();
const randomDream = result5.dream;
console.log(`제목: ${randomDream.title}`);
console.log(`카테고리: ${randomDream.category}`);
console.log(`길흉: ${randomDream.fortune_type}`);
console.log(`해석: ${randomDream.interpretation.substring(0, 100)}...`);

// 테스트 6: 통계
console.log('\n\n📝 테스트 6: DB 통계');
console.log('-'.repeat(70));
const result6 = engine.getStats();
const stats = result6.stats;
console.log(`총 꿈 개수: ${stats.totalDreams}개`);
console.log(`\n카테고리별 통계:`);
Object.entries(stats.categories).forEach(([cat, count]) => {
  console.log(`  • ${cat}: ${count}개`);
});
console.log(`\n길흉 통계:`);
Object.entries(stats.fortuneTypes).forEach(([type, count]) => {
  console.log(`  • ${type}: ${count}개`);
});
console.log(`\n평균 통계:`);
console.log(`  • 평균 키워드 수: ${stats.avgKeywordsPerDream}개`);
console.log(`  • 평균 해석 길이: ${stats.avgInterpretationLength}자`);

// 테스트 7: 유사도 검색
console.log('\n\n📝 테스트 7: 유사도 검색 (오타: "뱁")');
console.log('-'.repeat(70));
const result7 = engine.search('뱁', { limit: 3 });
console.log(`검색어: ${result7.query}`);
console.log(`총 결과: ${result7.total}개`);
if (result7.total > 0) {
  console.log('\n결과:');
  result7.results.forEach((dream, i) => {
    console.log(`${i + 1}. ${dream.title} (점수: ${dream.score})`);
  });
} else {
  console.log('결과 없음');
}

// 테스트 8: 부분 매칭
console.log('\n\n📝 테스트 8: 부분 매칭 ("사")');
console.log('-'.repeat(70));
const result8 = engine.search('사', { limit: 5 });
console.log(`검색어: ${result8.query}`);
console.log(`총 결과: ${result8.total}개`);
console.log('\n상위 5개:');
result8.results.forEach((dream, i) => {
  console.log(`${i + 1}. ${dream.title} (카테고리: ${dream.category})`);
});

console.log('\n' + '='.repeat(70));
console.log('✅ 모든 테스트 완료!\n');
