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
   * 메인 검색 함수 (DB + AI 하이브리드)
   * @param {string} query - 검색어
   * @param {object} options - 검색 옵션
   * @returns {Array} 검색 결과
   */
  search(query, options = {}) {
    const {
      category = null,      // 카테고리 필터
      limit = 10,          // 최대 결과 수
      offset = 0,          // 페이지네이션 오프셋
      includeRelated = true, // 관련 꿈 포함 여부
      useAI = false        // AI 해석 사용 여부 (기본: false, 비용 절감)
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

    // DB 검색 결과 반환
    const response = {
      success: true,
      query: cleanQuery,
      results: paginatedResults,
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
      category: category || '전체',
      source: 'database' // DB 검색
    };

    // DB에 결과 없고 AI 사용 옵션이 켜져있으면
    if (total === 0 && useAI) {
      response.aiSuggestion = {
        available: true,
        message: 'DB에 없는 키워드입니다. AI 해석을 사용하시겠습니까?',
        endpoint: '/api/dream/ai-interpret'
      };
    }

    return response;
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
   * 유사도 검색 (Jaro-Winkler Similarity)
   */
  similaritySearch(query, category) {
    // 한글 오타 감지: Levenshtein Distance 사용
    const maxDistance = query.length <= 2 ? 1 : 2; // 짧은 단어는 1글자, 긴 단어는 2글자 차이까지 허용

    return this.dreamDB.filter(dream => {
      // 카테고리 필터
      if (category && dream.category !== category) return false;

      // 키워드와의 편집 거리 검사 (한글 오타 감지)
      return dream.keywords.some(keyword => {
        const distance = this.levenshteinDistance(
          query.toLowerCase(), 
          keyword.toLowerCase()
        );
        return distance <= maxDistance;
      });
    });
  }

  /**
   * Jaro-Winkler 유사도 계산
   */
  jaroWinklerSimilarity(str1, str2) {
    if (str1 === str2) return 1.0;
    
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0 || len2 === 0) return 0.0;
    
    // Jaro 유사도 계산
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
        if (s2Matches[j] || str1[i] !== str2[j]) continue;
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
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }
    
    const jaro = (
      (matches / len1 + 
       matches / len2 + 
       (matches - transpositions / 2) / matches) / 3.0
    );
    
    // 공통 접두어 길이 (최대 4)
    let prefix = 0;
    for (let i = 0; i < Math.min(4, len1, len2); i++) {
      if (str1[i] === str2[i]) prefix++;
      else break;
    }
    
    // Jaro-Winkler (p = 0.1)
    return jaro + (prefix * 0.1 * (1 - jaro));
  }

  /**
   * Levenshtein Distance 계산 (한글 오타 감지용)
   * 두 문자열 간 최소 편집 거리 계산
   */
  levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    
    // 빈 문자열 처리
    if (len1 === 0) return len2;
    if (len2 === 0) return len1;
    
    // DP 테이블 생성
    const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    // 초기화
    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;
    
    // DP 계산
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // 삭제
          dp[i][j - 1] + 1,      // 삽입
          dp[i - 1][j - 1] + cost // 교체
        );
      }
    }
    
    return dp[len1][len2];
  }

  /**
   * Levenshtein Distance 계산 (백업용, 사용 안함)
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

  /**
   * AI 해석 (Claude API 사용)
   * DB에 없는 꿈 키워드에 대해 AI가 해석
   */
  async interpretWithAI(query) {
    // 환경 변수에서 Claude API 키 확인
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        message: 'Claude API 키가 설정되지 않았습니다.',
        source: 'ai'
      };
    }

    try {
      const Anthropic = require('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey });

      const prompt = `당신은 30년 경력의 전통 꿈해몽 전문가입니다.

꿈 내용: "${query}"

다음 형식으로 간결하게 답변해주세요:

**의미**: [한 줄로 핵심 상징]
**길흉**: [길몽/중립/흉몽 중 하나만 선택]
**해석**: 
[2-3문장으로 꿈의 의미를 풀이]

**조언**: 
[1-2문장으로 실용적 조언]

참고사항:
- 전통 꿈해몽 이론을 기반으로 해석
- 명확하고 이해하기 쉽게 설명
- 긍정적이고 희망적인 방향으로 해석
- 과도한 걱정이나 두려움을 주지 않기`;

      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 600,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const aiResponse = message.content[0].text;

      return {
        success: true,
        query,
        interpretation: this.parseAIResponse(aiResponse),
        rawResponse: aiResponse,
        source: 'ai',
        model: 'claude-3-haiku',
        warning: '💡 AI 해석은 참고용입니다. 전통 꿈해몽과 다를 수 있습니다.'
      };

    } catch (error) {
      console.error('AI 해석 오류:', error);
      return {
        success: false,
        message: 'AI 해석 중 오류가 발생했습니다: ' + error.message,
        source: 'ai'
      };
    }
  }

  /**
   * AI 응답 파싱
   */
  parseAIResponse(response) {
    const lines = response.split('\n').filter(l => l.trim());
    
    const parsed = {
      meaning: '',
      fortune_type: '중립',
      interpretation: '',
      advice: ''
    };

    let currentSection = '';
    
    lines.forEach(line => {
      if (line.includes('**의미**') || line.includes('의미:')) {
        currentSection = 'meaning';
        parsed.meaning = line.replace(/\*\*의미\*\*:|의미:/g, '').trim();
      } else if (line.includes('**길흉**') || line.includes('길흉:')) {
        currentSection = 'fortune_type';
        const fortuneText = line.replace(/\*\*길흉\*\*:|길흉:/g, '').trim();
        if (fortuneText.includes('길몽')) parsed.fortune_type = '길몽';
        else if (fortuneText.includes('흉몽')) parsed.fortune_type = '흉몽';
        else parsed.fortune_type = '중립';
      } else if (line.includes('**해석**') || line.includes('해석:')) {
        currentSection = 'interpretation';
      } else if (line.includes('**조언**') || line.includes('조언:')) {
        currentSection = 'advice';
      } else if (line.trim() && !line.includes('**')) {
        if (currentSection === 'interpretation') {
          parsed.interpretation += line.trim() + ' ';
        } else if (currentSection === 'advice') {
          parsed.advice += line.trim() + ' ';
        }
      }
    });

    return parsed;
  }

  /**
   * DB 기반 AI 해석 (핵심 메서드!)
   * 1. DB에서 키워드 검색
   * 2. DB 정보를 AI에게 전달
   * 3. AI가 종합 해석
   */
  async interpretWithDB(query) {
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        message: 'Claude API 키가 설정되지 않았습니다.',
        source: 'hybrid'
      };
    }

    try {
      // 1단계: DB에서 관련 꿈 검색
      const dbResults = this.search(query, {
        limit: 5,  // 상위 5개만
        includeRelated: false
      });

      // 2단계: DB 정보를 AI 프롬프트에 포함
      let dbContext = '';
      
      if (dbResults.success && dbResults.total > 0) {
        dbContext = '\n\n**전통 꿈해몽 DB 참고 정보:**\n';
        
        dbResults.results.forEach((dream, index) => {
          dbContext += `\n${index + 1}. ${dream.title}\n`;
          dbContext += `   의미: ${dream.meaning}\n`;
          dbContext += `   길흉: ${dream.fortune_type}\n`;
          dbContext += `   해석: ${dream.interpretation}\n`;
        });
        
        dbContext += '\n위 전통 꿈해몽 정보를 참고하되, 사용자가 입력한 구체적인 꿈 내용에 맞춰 자연스럽게 재해석해주세요.\n';
      } else {
        dbContext = '\n\n**참고:** DB에 정확히 일치하는 전통 꿈해몽이 없으므로, 일반적인 꿈해몽 원리에 따라 해석해주세요.\n';
      }

      // 3단계: AI 프롬프트 생성 (DB 정보 포함)
      const Anthropic = require('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey });

      const prompt = `당신은 30년 경력의 전통 꿈해몽 전문가입니다.

사용자가 꾼 꿈: "${query}"
${dbContext}

다음 형식으로 간결하게 답변해주세요:

**의미**: [한 줄로 핵심 상징]
**길흉**: [길몽/중립/흉몽 중 하나만 선택]
**해석**: 
[2-3문장으로 꿈의 의미를 풀이]

**조언**: 
[1-2문장으로 실용적 조언]

참고사항:
- 전통 꿈해몽 DB 정보를 기반으로 하되, 사용자의 구체적인 꿈 내용에 맞게 재해석
- 명확하고 이해하기 쉽게 설명
- 긍정적이고 희망적인 방향으로 해석
- 과도한 걱정이나 두려움을 주지 않기`;

      // 4단계: AI 호출
      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 600,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const aiResponse = message.content[0].text;

      // 5단계: 결과 반환
      return {
        success: true,
        query,
        interpretation: this.parseAIResponse(aiResponse),
        rawResponse: aiResponse,
        dbResultsCount: dbResults.total || 0,
        source: 'hybrid',  // DB + AI 하이브리드
        model: 'claude-3-haiku',
        usedDB: dbResults.total > 0
      };

    } catch (error) {
      console.error('DB 기반 AI 해석 오류:', error);
      return {
        success: false,
        message: 'AI 해석 중 오류가 발생했습니다: ' + error.message,
        source: 'hybrid'
      };
    }
  }
}

// Export
module.exports = DreamEngine;
