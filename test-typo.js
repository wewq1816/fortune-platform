const DreamEngine = require('./engines/core/dream-engine');
const engine = new DreamEngine();

console.log('오타 검색 테스트: "뱁" → "뱀" 찾기\n');

const result = engine.search('뱁', { limit: 10 });

console.log(`검색어: ${result.query}`);
console.log(`총 결과: ${result.total}개\n`);

if (result.total > 0) {
  console.log('검색 성공! 결과:');
  result.results.forEach((d, i) => {
    console.log(`${i+1}. ${d.title} (점수: ${d.score})`);
  });
} else {
  console.log('검색 실패 - threshold를 더 낮춰야 합니다.');
}
