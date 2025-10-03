/**
 * 꿈해몽 검색 엔진
 * - 2,000개 꿈 DB 기반 검색
 * - 키워드 매칭 + 유사도 검색
 * - 카테고리 필터링
 */

const fs = require('fs');
const path = require('path');

class DreamEngine {
  constructor() {
    this.dreamDB = [];
    this.searchHistory = new Map(); // 검색어 빈도 추적
    this.loadDatabase();
  }

  /**
   * DB 로드
   */
  loadDatabase() {
    try {
      const dbPath = path.join(__dirname, '../data/dream-db.json');
      const data = fs.readFileSync(dbPath, 'utf8');
      this.dreamDB = JSON.parse(data);
      console.log(`✅ 꿈해몽 DB 로드 완료: ${this.dreamDB.length}개`);
    } catch (error) {
      console.error('❌ DB 로드 실패:', error.message);
      this.dreamDB = [];
    }
  }

  /**
   * 메인 검색 함수
   * @param {string} query - 검색어
   * @param {object} options - 검색 옵션
   * @returns {Array} 검색 결과
   */
  search(query, options = {}) {
    const {
      category = null,      // 카테고리 필터
      limit = 10,          // 최대 결과 수
      offset = 0,          // 페이지네이션 오프셋
      includeRelated = true // 관련 꿈 포함 여부
    } = options;

    // 검색어 정리
    const cleanQuery = this.cleanQuery(query);
    
    if (!cleanQuery) {
      return {
        success: false,
        message: '검색어를 입력해주세요',
        results: [],
        total: 0
      };
    }

    // 검색 히스토리 기록
    this.recordSearch(cleanQuery);

    // 1단계: 정확 매칭 검색
    let results = this.exactMatch(cleanQuery, category);

    // 2단계: 부분 매칭 검색 (정확 매칭 결과가 적으면)
    if (results.length < 5) {
      const partialResults = this.partialMatch(cleanQuery, category);
      results = [...results, ...partialResults];
    }

    // 3단계: 유사도 검색 (여전히 부족하면)
    if (results.length < 5) {
      const similarResults = this.similaritySearch(cleanQuery, category);
      results = [...results, ...similarResults];
    }

    // 중복 제거
    results = this.removeDuplicates(results);

    // 랭킹 점수 계산
    results = this.calculateRanking(results, cleanQuery);

    // 정렬 (점수 높은 순)
    results.sort((a, b) => b.score - a.score);

    // 관련 꿈 추가
    if (includeRelated) {
      results = results.map(dream => ({
        ...dream,
        relatedDreams: this.getRelatedDreams(dream.related_ids, 3)
      }));
    }

    // 페이지네이션
    const total = results.length;
    const paginatedResults = results.slice(offset, offset + limit);

    return {
      success: true,
      query: cleanQuery,
      results: paginatedResults,
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
      category: category || '전체'
    };
  }

  /**
   * 검색어 정리
   */
  cleanQuery(query) {
    if (!query) return '';
    return query
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' '); // 여러 공백을 하나로
  }

  /**
   * 정확 매칭 검색
   */
  exactMatch(query, category) {
    return this.dreamDB.filter(dream => {
      // 카테고리 필터
      if (category && dream.category !== category) return false;

      // 제목 정확 매칭
      if (dream.title.includes(query)) return true;

      // 키워드 정확 매칭
      return dream.keywords.some(keyword => 
        keyword.toLowerCase() === query
      );
    });
  }

  /**
   * 부분 매칭 검색
   */
  partialMatch(query, category) {
    return this.dreamDB.filter(dream => {
      // 카테고리 필터
      if (category && dream.category !== category) return false;

      // 키워드 부분 매칭
      return dream.keywords.some(keyword => 
        keyword.toLowerCase().includes(query) || 
        query.includes(keyword.toLowerCase())
      );
    });
  }

  /**
   * 유사도 검색 (Levenshtein Distance)
   */
  similaritySearch(query, category) {
    const threshold = 2; // 최대 편집 거리

    return this.dreamDB.filter(dream => {
      // 카테고리 필터
      if (category && dream.category !== category) return false;

      // 키워드와의 유사도 검사
      return dream.keywords.some(keyword => {
        const distance = this.levenshteinDistance(
          query.toLowerCase(), 
          keyword.toLowerCase()
        );
        return distance <= threshold;
      });
    });
  }

  /**
   * Levenshtein Distance 계산
   */
  levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    // 초기화
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // 동적 프로그래밍
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // 삭제
          matrix[i][j - 1] + 1,      // 삽입
          matrix[i - 1][j - 1] + cost // 교체
        );
      }
    }

    return matrix[len1][len2];
  }

  /**
   * 중복 제거
   */
  removeDuplicates(results) {
    const seen = new Set();
    return results.filter(dream => {
      if (seen.has(dream.id)) return false;
      seen.add(dream.id);
      return true;
    });
  }

  /**
   * 랭킹 점수 계산
   */
  calculateRanking(results, query) {
    return results.map(dream => {
      let score = 0;

      // 제목 매칭 (가중치 높음)
      if (dream.title.includes(query)) {
        score += 100;
      }

      // 키워드 정확 매칭
      dream.keywords.forEach(keyword => {
        if (keyword.toLowerCase() === query) {
          score += 50;
        } else if (keyword.toLowerCase().includes(query)) {
          score += 30;
        } else if (query.includes(keyword.toLowerCase())) {
          score += 20;
        }
      });

      // 길몽 보너스
      if (dream.fortune_type === '길몽') {
        score += 10;
      }

      return { ...dream, score };
    });
  }

  /**
   * 관련 꿈 가져오기
   */
  getRelatedDreams(relatedIds, limit = 3) {
    if (!relatedIds || relatedIds.length === 0) return [];

    return relatedIds
      .slice(0, limit)
      .map(id => this.dreamDB.find(dream => dream.id === id))
      .filter(dream => dream !== undefined);
  }

  /**
   * ID로 꿈 조회
   */
  getDreamById(id) {
    const dream = this.dreamDB.find(d => d.id === parseInt(id));
    
    if (!dream) {
      return {
        success: false,
        message: '해당 꿈을 찾을 수 없습니다'
      };
    }

    return {
      success: true,
      dream: {
        ...dream,
        relatedDreams: this.getRelatedDreams(dream.related_ids, 5)
      }
    };
  }

  /**
   * 카테고리별 꿈 목록
   */
  getDreamsByCategory(category, limit = 20, offset = 0) {
    const filtered = this.dreamDB.filter(d => d.category === category);
    const total = filtered.length;
    const results = filtered.slice(offset, offset + limit);

    return {
      success: true,
      category,
      results,
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * 전체 카테고리 목록
   */
  getCategories() {
    const categories = {};
    
    this.dreamDB.forEach(dream => {
      if (!categories[dream.category]) {
        categories[dream.category] = 0;
      }
      categories[dream.category]++;
    });

    return {
      success: true,
      categories: Object.entries(categories).map(([name, count]) => ({
        name,
        count
      }))
    };
  }

  /**
   * 랜덤 꿈 가져오기
   */
  getRandomDream() {
    const randomIndex = Math.floor(Math.random() * this.dreamDB.length);
    const dream = this.dreamDB[randomIndex];

    return {
      success: true,
      dream: {
        ...dream,
        relatedDreams: this.getRelatedDreams(dream.related_ids, 3)
      }
    };
  }

  /**
   * 인기 검색어 (Top 10)
   */
  getPopularSearches(limit = 10) {
    const sorted = Array.from(this.searchHistory.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return {
      success: true,
      popularSearches: sorted.map(([query, count]) => ({
        query,
        count
      }))
    };
  }

  /**
   * 검색 히스토리 기록
   */
  recordSearch(query) {
    const count = this.searchHistory.get(query) || 0;
    this.searchHistory.set(query, count + 1);
  }

  /**
   * DB 통계
   */
  getStats() {
    const stats = {
      totalDreams: this.dreamDB.length,
      categories: {},
      fortuneTypes: { 길몽: 0, 흉몽: 0, 중립: 0 },
      avgKeywordsPerDream: 0,
      avgInterpretationLength: 0
    };

    let totalKeywords = 0;
    let totalInterpretationLength = 0;

    this.dreamDB.forEach(dream => {
      // 카테고리별 집계
      stats.categories[dream.category] = 
        (stats.categories[dream.category] || 0) + 1;

      // 길흉 집계
      stats.fortuneTypes[dream.fortune_type]++;

      // 키워드 수
      totalKeywords += dream.keywords.length;

      // 해석 길이
      totalInterpretationLength += dream.interpretation.length;
    });

    stats.avgKeywordsPerDream = 
      (totalKeywords / this.dreamDB.length).toFixed(1);
    stats.avgInterpretationLength = 
      Math.floor(totalInterpretationLength / this.dreamDB.length);

    return {
      success: true,
      stats
    };
  }
}

// Export
module.exports = DreamEngine;
