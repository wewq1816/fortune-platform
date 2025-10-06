/**
 * 꿈해몽 시스템 종합 품질 점검
 * 2025-01-06
 */

const DreamEngine = require('../engines/core/dream-engine.js');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 꿈해몽 시스템 종합 품질 점검');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const engine = new DreamEngine();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 1단계: 검색 정확도 테스트 (실제 사용 시나리오)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('📊 1단계: 검색 정확도 테스트');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const testQueries = [
  { query: '뱀', expected: '뱀 관련 꿈', minResults: 10 },
  { query: '돈', expected: '재물 관련 꿈', minResults: 5 },
  { query: '죽음', expected: '죽음 관련 꿈', minResults: 5 },
  { query: '엄마', expected: '가족 관련 꿈', minResults: 3 },
  { query: '시험', expected: '시험 관련 꿈', minResults: 3 },
  { query: '물', expected: '자연 관련 꿈', minResults: 10 },
  { query: '불', expected: '재난 관련 꿈', minResults: 5 },
  { query: '꽃', expected: '자연 관련 꿈', minResults: 5 },
  { query: '차', expected: '교통 관련 꿈', minResults: 5 },
  { query: '집', expected: '건물 관련 꿈', minResults: 5 },
];

let passCount = 0;
let totalScore = 0;

testQueries.forEach((test, index) => {
  const result = engine.search(test.query);
  const pass = result.total >= test.minResults;
  
  console.log(`테스트 ${index + 1}: "${test.query}" 검색`);
  console.log(`  기대: ${test.expected}`);
  console.log(`  결과: ${result.total}개 (최소 ${test.minResults}개 필요)`);
  console.log(`  상태: ${pass ? '✅ PASS' : '❌ FAIL'}`);
  
  if (result.total > 0) {
    console.log(`  상위 결과: ${result.results[0].title}`);
  }
  console.log('');
  
  if (pass) {
    passCount++;
    totalScore += 10;
  } else {
    totalScore += Math.min(10, (result.total / test.minResults) * 10);
  }
});

const accuracy = (passCount / testQueries.length * 100).toFixed(1);
console.log(`정확도: ${passCount}/${testQueries.length} 통과 (${accuracy}%)`);
console.log(`점수: ${totalScore.toFixed(1)}/100점`);
console.log('');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 2단계: 오타 감지 능력 테스트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 2단계: 오타 감지 능력 테스트');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const typoTests = [
  { wrong: '뱁', correct: '뱀' },
  { wrong: '돈', correct: '돈' }, // 정확
  { wrong: '울', correct: '물' },
  { wrong: '꼳', correct: '꽃' },
  { wrong: '집', correct: '집' }, // 정확
];

let typoPassCount = 0;

typoTests.forEach((test, index) => {
  const result = engine.search(test.wrong);
  const pass = result.total > 0;
  
  console.log(`테스트 ${index + 1}: "${test.wrong}" → "${test.correct}"`);
  console.log(`  결과: ${result.total}개`);
  console.log(`  상태: ${pass ? '✅ 감지 성공' : '❌ 감지 실패'}`);
  console.log('');
  
  if (pass) typoPassCount++;
});

const typoAccuracy = (typoPassCount / typoTests.length * 100).toFixed(1);
console.log(`오타 감지율: ${typoPassCount}/${typoTests.length} (${typoAccuracy}%)`);
console.log('');
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 3단계: 길흉 분포 품질 검증
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 3단계: 길흉 분포 품질 검증');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const fortuneTests = [
  { query: '돈', expectedType: '길몽' },
  { query: '금', expectedType: '길몽' },
  { query: '보물', expectedType: '길몽' },
  { query: '결혼', expectedType: '길몽' },
  { query: '죽음', expectedType: '흉몽' },
  { query: '사고', expectedType: '흉몽' },
  { query: '도둑', expectedType: '흉몽' },
  { query: '병', expectedType: '흉몽' },
];

let fortunePassCount = 0;

fortuneTests.forEach((test, index) => {
  const result = engine.search(test.query);
  
  if (result.total > 0) {
    const topResult = result.results[0];
    const pass = topResult.fortune_type === test.expectedType;
    
    console.log(`테스트 ${index + 1}: "${test.query}" 검색`);
    console.log(`  기대 길흉: ${test.expectedType}`);
    console.log(`  실제 길흉: ${topResult.fortune_type}`);
    console.log(`  제목: ${topResult.title}`);
    console.log(`  상태: ${pass ? '✅ 일치' : '⚠️ 불일치'}`);
    console.log('');
    
    if (pass) fortunePassCount++;
  } else {
    console.log(`테스트 ${index + 1}: "${test.query}" - 결과 없음 ❌`);
    console.log('');
  }
});

const fortuneAccuracy = (fortunePassCount / fortuneTests.length * 100).toFixed(1);
console.log(`길흉 정확도: ${fortunePassCount}/${fortuneTests.length} (${fortuneAccuracy}%)`);
console.log('');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 4단계: 카테고리 필터링 정확도
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 4단계: 카테고리 필터링 정확도');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const categoryTests = [
  { query: '뱀', category: '동물', minResults: 5 },
  { query: '물', category: '자연', minResults: 10 },
  { query: '엄마', category: '사람', minResults: 3 },
  { query: '밥', category: '음식', minResults: 3 },
  { query: '집', category: '건물', minResults: 3 },
];

let categoryPassCount = 0;

categoryTests.forEach((test, index) => {
  const result = engine.search(test.query, { category: test.category });
  const pass = result.total >= test.minResults;
  
  console.log(`테스트 ${index + 1}: "${test.query}" + 카테고리 "${test.category}"`);
  console.log(`  결과: ${result.total}개 (최소 ${test.minResults}개 필요)`);
  console.log(`  상태: ${pass ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
  
  if (pass) categoryPassCount++;
});

const categoryAccuracy = (categoryPassCount / categoryTests.length * 100).toFixed(1);
console.log(`카테고리 필터 정확도: ${categoryPassCount}/${categoryTests.length} (${categoryAccuracy}%)`);
console.log('');
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 5단계: 검색 결과 랭킹 품질
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 5단계: 검색 결과 랭킹 품질');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const rankingTests = [
  { query: '뱀', expectedTop: '뱀', description: '정확 매칭이 최상위에 와야 함' },
  { query: '돈', expectedTop: '돈', description: '정확 매칭이 최상위에 와야 함' },
];

let rankingPassCount = 0;

rankingTests.forEach((test, index) => {
  const result = engine.search(test.query);
  
  if (result.total > 0) {
    const topTitle = result.results[0].title.toLowerCase();
    const pass = topTitle.includes(test.expectedTop);
    
    console.log(`테스트 ${index + 1}: "${test.query}" 검색`);
    console.log(`  설명: ${test.description}`);
    console.log(`  1위: ${result.results[0].title} (점수: ${result.results[0].score})`);
    if (result.results.length > 1) {
      console.log(`  2위: ${result.results[1].title} (점수: ${result.results[1].score})`);
    }
    console.log(`  상태: ${pass ? '✅ 정확' : '⚠️ 개선 필요'}`);
    console.log('');
    
    if (pass) rankingPassCount++;
  }
});

const rankingAccuracy = (rankingPassCount / rankingTests.length * 100).toFixed(1);
console.log(`랭킹 정확도: ${rankingPassCount}/${rankingTests.length} (${rankingAccuracy}%)`);
console.log('');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 최종 종합 평가
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎯 최종 종합 평가');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const scores = {
  search: accuracy,
  typo: typoAccuracy,
  fortune: fortuneAccuracy,
  category: categoryAccuracy,
  ranking: rankingAccuracy,
};

console.log('📊 부문별 점수:');
console.log(`  1. 검색 정확도:        ${scores.search}%`);
console.log(`  2. 오타 감지율:        ${scores.typo}%`);
console.log(`  3. 길흉 정확도:        ${scores.fortune}%`);
console.log(`  4. 카테고리 필터:      ${scores.category}%`);
console.log(`  5. 랭킹 정확도:        ${scores.ranking}%`);
console.log('');

const overallScore = Object.values(scores).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / Object.keys(scores).length;

console.log(`🎯 종합 만족도: ${overallScore.toFixed(1)}%`);
console.log('');

// 등급 산출
let grade = 'F';
if (overallScore >= 90) grade = 'A+';
else if (overallScore >= 85) grade = 'A';
else if (overallScore >= 80) grade = 'B+';
else if (overallScore >= 75) grade = 'B';
else if (overallScore >= 70) grade = 'C+';
else if (overallScore >= 60) grade = 'C';

console.log(`📝 최종 등급: ${grade}`);
console.log('');

// 개선 제안
console.log('💡 개선 제안:');
if (scores.search < 80) {
  console.log('  - 검색 정확도 개선: DB에 더 많은 키워드 추가 필요');
}
if (scores.typo < 80) {
  console.log('  - 오타 감지 개선: 자모 분리 알고리즘 도입 검토');
}
if (scores.fortune < 80) {
  console.log('  - 길흉 분류 개선: 키워드별 길흉 재검토 필요');
}
if (scores.category < 80) {
  console.log('  - 카테고리 정확도 개선: 카테고리 매핑 재검토');
}
if (scores.ranking < 80) {
  console.log('  - 랭킹 알고리즘 개선: 점수 계산 로직 최적화');
}

if (overallScore >= 80) {
  console.log('  ✅ 전반적으로 우수한 품질입니다!');
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎉 품질 점검 완료!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
