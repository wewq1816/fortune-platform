/**
 * dream-engine.js 개선 버전
 * 
 * 변경사항:
 * 1. Levenshtein → Jaro-Winkler 교체
 * 2. 한글 자소 분해 지원 (선택)
 * 3. threshold 동적 조정
 */

// 기존 코드는 그대로 유지하고, 아래 함수들만 교체

/**
 * Jaro-Winkler 유사도 계산
 * (npm install jaro-winkler 필요)
 */
function jaroWinklerSimilarity(str1, str2) {
  // Jaro 유사도 계산
  function jaroSimilarity(s1, s2) {
    if (s1 === s2) return 1.0;
    
    const len1 = s1.length;
    const len2 = s2.length;
    
    if (len1 === 0 || len2 === 0) return 0.0;
    
    // 매칭 거리
    const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
    
    const s1Matches = new Array(len1).fill(false);
    const s2Matches = new Array(len2).fill(false);
    
    let matches = 0;
    let transpositions = 0;
    
    // 매칭 찾기
    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, len2);
      
      for (let j = start; j < end; j++) {
        if (s2Matches[j] || s1[i] !== s2[j]) continue;
        s1Matches[i] = true;
        s2Matches[j] = true;
        matches++;
        break;
      }
    }
    
    if (matches === 0) return 0.0;
    
    // 전치 계산
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (!s1Matches[i]) continue;
      while (!s2Matches[k]) k++;
      if (s1[i] !== s2[k]) transpositions++;
      k++;
    }
    
    return (
      (matches / len1 + 
       matches / len2 + 
       (matches - transpositions / 2) / matches) / 3.0
    );
  }
  
  const jaro = jaroSimilarity(str1, str2);
  
  // 공통 접두어 길이 (최대 4)
  let prefix = 0;
  for (let i = 0; i < Math.min(4, str1.length, str2.length); i++) {
    if (str1[i] === str2[i]) prefix++;
    else break;
  }
  
  // Jaro-Winkler 계산 (p = 0.1)
  return jaro + (prefix * 0.1 * (1 - jaro));
}

/**
 * 유사도 검색 (Jaro-Winkler)
 * 
 * 기존 similaritySearch() 함수 교체
 */
function similaritySearchJaroWinkler(query, category) {
  // 동적 threshold: 검색어 길이에 따라 조정
  const baseThreshold = 0.85; // Jaro-Winkler는 0-1 범위
  
  // 짧은 검색어는 더 엄격한 threshold
  const threshold = query.length <= 2 ? 0.90 : baseThreshold;
  
  return this.dreamDB.filter(dream => {
    // 카테고리 필터
    if (category && dream.category !== category) return false;
    
    // 키워드와의 유사도 검사
    return dream.keywords.some(keyword => {
      const similarity = jaroWinklerSimilarity(
        query.toLowerCase(),
        keyword.toLowerCase()
      );
      return similarity >= threshold;
    });
  });
}

/**
 * 한글 자소 분해 Jaro-Winkler (고급)
 * 
 * 사용 시 hangul-js 설치 필요:
 * npm install hangul-js
 */
function similaritySearchHangulJaroWinkler(query, category) {
  const Hangul = require('hangul-js');
  
  const threshold = 0.85;
  
  return this.dreamDB.filter(dream => {
    if (category && dream.category !== category) return false;
    
    return dream.keywords.some(keyword => {
      // 자소 분해
      const decomposed1 = Hangul.disassemble(query.toLowerCase());
      const decomposed2 = Hangul.disassemble(keyword.toLowerCase());
      
      // 자소 문자열로 변환
      const str1 = decomposed1.join('');
      const str2 = decomposed2.join('');
      
      // Jaro-Winkler 계산
      const similarity = jaroWinklerSimilarity(str1, str2);
      
      return similarity >= threshold;
    });
  });
}

// ==========================================================================
// dream-engine.js에 적용하는 방법:
// ==========================================================================
//
// 1. 기본 Jaro-Winkler 적용 (한글 자소 분해 없음)
//    - similaritySearch() 함수를 similaritySearchJaroWinkler()로 교체
//    - jaroWinklerSimilarity() 함수 추가
//
// 2. 고급 (한글 자소 분해)
//    - npm install hangul-js
//    - similaritySearch() 함수를 similaritySearchHangulJaroWinkler()로 교체
//    - jaroWinklerSimilarity() 함수 추가
//
// 3. 테스트
//    - node tests/test-dream-engine.js
//    - "뱁" → "뱀" 검색 테스트
//    - "사" → "사랑", "사과" 검색 테스트
//
// ==========================================================================

module.exports = {
  jaroWinklerSimilarity,
  similaritySearchJaroWinkler,
  similaritySearchHangulJaroWinkler
};
