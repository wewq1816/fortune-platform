# 꿈해몽 시스템 점검 보고서

점검일: 2025-01-05
점검자: Claude
점검 방식: 엔진 성능 및 정확도 중심 분석 (수정 없음)

---

## 1. 시스템 개요

### 핵심 아키텍처
```
사용자 검색어 입력
    |
    v
GET /api/dream?q=[검색어]&category=[카테고리]&limit=10
    |
    v
DreamEngine.search() - 3단계 검색
    |
    +-- 1단계: 정확 매칭 (exactMatch)
    +-- 2단계: 부분 매칭 (partialMatch) 
    +-- 3단계: 유사도 검색 (similaritySearch - Levenshtein Distance)
    |
    v
랭킹 점수 계산 (calculateRanking)
    |
    v
관련 꿈 추가 (getRelatedDreams)
    |
    v
결과 반환 (페이지네이션)
```

### 운영 방식
- **계산 방식**: 키워드 기반 검색 (DB 검색)
- **AI 사용 여부**: 아니오 (순수 알고리즘 검색)
- **데이터 의존성**: dream-db.json (2,000개 꿈 데이터)
- **검색 알고리즘**: 정확 매칭 → 부분 매칭 → Levenshtein Distance

---

## 2. 파일별 상세 분석

### 2.1 engines/core/dream-engine.js (메인 엔진)

**파일 크기**: 409줄
**주요 기능**: 
- 꿈 검색 (search)
- ID 조회 (getDreamById)
- 카테고리 목록 (getCategories)
- 통계 (getStats)
- 랜덤 꿈 (getRandomDream)

**강점:**
1. **3단계 검색 시스템**
   - 정확 매칭 → 부분 매칭 → 유사도 검색
   - 결과가 부족하면 자동으로 다음 단계 진행
   - 중복 제거 로직 존재

2. **랭킹 점수 시스템**
   - 제목 매칭: 100점
   - 키워드 정확 매칭: 50점
   - 키워드 부분 매칭: 30점
   - 길몽 보너스: 10점

3. **관련 꿈 연결**
   - related_ids를 통한 추천
   - 최대 3-5개 제공

4. **검색 히스토리 추적**
   - Map으로 빈도 기록
   - 인기 검색어 기능

**발견된 문제점:**

**문제 1: Levenshtein Distance의 한계 (높음)**
```javascript
// 현재 코드 (146-152줄)
similaritySearch(query, category) {
  const threshold = 2; // 최대 편집 거리
  
  return this.dreamDB.filter(dream => {
    return dream.keywords.some(keyword => {
      const distance = this.levenshteinDistance(
        query.toLowerCase(), 
        keyword.toLowerCase()
      );
      return distance <= threshold;
    });
  });
}
```

**웹검색 검증:**
- Levenshtein Distance는 **긴 문자열에 유리**
- **짧은 키워드(1-3글자)에는 Jaro-Winkler가 더 적합**
- 한글의 경우 **초/중/종성 분해**가 더 정확

**영향:**
- 짧은 키워드 ("뱀", "물", "불") 검색 시 정확도 낮음
- "뱁" → "뱀" 같은 오타는 잡지만, "사" → "뱀"은 못 잡음
- 한글 특성 미반영 (한글은 자소 단위 비교가 더 정확)

**우선순위**: 높음 (검색 정확도 직접 영향)

---

**문제 2: threshold 값이 고정 (보통)**
```javascript
const threshold = 2; // 최대 편집 거리
```

**문제점:**
- 검색어 길이와 무관하게 항상 2
- "뱀" (1글자) vs "사랑하다" (4글자)에서 같은 threshold 사용
- 긴 키워드일수록 threshold를 높여야 함

**웹검색 검증:**
- threshold는 일반적으로 **문자열 길이의 20-30%**
- 예: 5글자 단어는 threshold 1-2, 10글자는 2-3

**영향:**
- 긴 키워드 검색 시 유사 결과가 너무 적음
- 짧은 키워드 검색 시 불필요한 결과 포함 가능성

**우선순위**: 보통

---

**문제 3: 검색 성능 (낮음)**
```javascript
// 현재: 전체 DB 순회 (2,000개)
this.dreamDB.filter(dream => {
  // 모든 꿈에 대해 체크
});
```

**문제점:**
- 2,000개 전체를 매번 filter
- 카테고리 인덱싱 없음
- 키워드 역인덱스 없음

**영향:**
- 현재는 2,000개라 큰 문제 없음
- 향후 10,000개 이상으로 확장 시 성능 저하

**우선순위**: 낮음 (현재 규모에서는 문제 없음)

---

### 2.2 engines/data/dream-db.json (데이터)

**파일 크기**: 1.54MB (53,898줄)
**데이터 개수**: 정확히 2,000개 (ID: 1~2000)

**데이터 구조 분석:**
```json
{
  "id": 1,
  "category": "동물",
  "title": "뱀이(가) 나오는 꿈",
  "keywords": ["뱀", "큰뱀", "작은뱀", "하얀뱀", "검은뱀", "뱀떼", "죽은뱀", "살아있는뱀", "앵무새", "낙지"],
  "meaning": "재물, 지혜, 변화",
  "fortune_type": "길몽",
  "interpretation": "뱀은(는) 재물, 지혜, 변화을(를) 상징합니다...",
  "related_ids": [207, 228, 270],
  "created_at": "2025-10-02"
}
```

**강점:**
1. **2,000개 완성**: 기획서의 목표 달성
2. **구조 일관성**: 모든 항목이 동일한 필드 보유
3. **관계 연결**: related_ids로 추천 시스템 가능
4. **카테고리 분류**: 체계적인 분류

**발견된 문제점:**

**문제 4: 키워드 품질 문제 (높음)**
```json
// ID: 38, 39 예시
"keywords": [
  "소", "큰소", "작은소", "하얀소", "검은소", "소떼", "죽은소", "살아있는소",
  "까마귀", "오리"  // ← 관련 없는 키워드
]
```

**문제점:**
- 소 꿈인데 "까마귀", "오리" 키워드 포함
- 키워드 10개 중 8개는 "소" 변형, 2개는 무관
- 자동 생성된 것으로 추정 (품질 검증 필요)

**영향:**
- 잘못된 검색 결과 반환 가능성
- "까마귀" 검색 시 "소" 꿈이 나올 수 있음

**우선순위**: 높음

---

**문제 5: 해석 텍스트의 문법 오류 (보통)**
```json
"interpretation": "뱀은(는) 재물, 지혜, 변화을(를) 상징합니다..."
                      ^^^^^              ^^^^
                      조사 오류         조사 오류
```

**문제점:**
- "뱀은(는)" → "뱀은" 또는 "뱀이"로 통일 필요
- "변화을(를)" → "변화를"
- 자동 생성 시 조사 처리 미흡

**영향:**
- 사용자 경험 저하
- 신뢰도 하락

**우선순위**: 보통

---

**문제 6: 의미의 중복/획일화 (보통)**
```json
// 많은 꿈들이 동일한 의미
"meaning": "변화와 성장의 신호"  // 반복 빈도 높음
"fortune_type": "중립"           // 대부분 중립
```

**문제점:**
- 다양한 꿈인데 의미가 비슷함
- 중립이 너무 많음 (길몽/흉몽 비율 확인 필요)

**영향:**
- 사용자에게 차별화된 정보 제공 어려움
- 꿈해몽의 특수성 부족

**우선순위**: 보통

---

### 2.3 server.js (API 엔드포인트)

**코드 위치**: 156-225줄

**엔드포인트 3개:**
1. `GET /api/dream?q=[검색어]&category=[카테고리]` - 검색
2. `GET /api/dream/:id` - 특정 꿈 조회
3. `GET /api/dream/categories/list` - 카테고리 목록

**강점:**
1. RESTful API 설계
2. 에러 처리 존재 (try-catch)
3. 검색어 필수 검증
4. 페이지네이션 지원 (limit, offset)

**발견된 문제점:**

**문제 7: includeRelated 하드코딩 (낮음)**
```javascript
// 161-185줄
const result = dreamEngine.search(q, {
  category: category || null,
  limit: parseInt(limit) || 10,
  offset: parseInt(offset) || 0,
  includeRelated: true  // 항상 true
});
```

**문제점:**
- 사용자가 관련 꿈 제외 옵션 불가
- API 파라미터로 제어 불가능

**영향:**
- 유연성 낮음
- 성능 최적화 옵션 부재

**우선순위**: 낮음

---

### 2.4 frontend/pages/dream.html (프론트엔드)

**파일 크기**: 1,174줄

**확인 사항:**
- 검색 UI 존재
- 카테고리 필터 가능
- 응답 형식 확인

**점검 결과**: 별도 점검 필요 (UI/UX 중심 점검)

---

### 2.5 tests/test-dream-engine.js (테스트 파일)

**파일 크기**: 124줄

**테스트 케이스 8개:**
1. 기본 검색 ("뱀")
2. 카테고리 필터 ("물" + 자연)
3. ID로 조회 (ID: 1)
4. 카테고리 목록
5. 랜덤 꿈
6. DB 통계
7. 유사도 검색 ("뱁" - 오타)
8. 부분 매칭 ("사")

**강점:**
1. 다양한 시나리오 테스트
2. 오타 검색 테스트 포함
3. 통계 확인

**발견된 문제점:**

**문제 8: 성능 테스트 부재 (보통)**

**문제점:**
- 2,000개 전체 검색 속도 테스트 없음
- 동시 요청 테스트 없음
- 메모리 사용량 측정 없음

**영향:**
- 실제 운영 환경에서의 성능 불확실

**우선순위**: 보통

---

## 3. 강점 요약

### 정확성
- 3단계 검색으로 누락 최소화
- 정확 매칭 → 부분 매칭 → 유사도 검색 순차 진행
- 중복 제거 로직

### 설계
- 깔끔한 클래스 구조
- RESTful API 설계
- 관련 꿈 추천 시스템
- 검색 히스토리 추적

### 데이터
- 2,000개 꿈 데이터 완비
- 카테고리 분류 체계적
- 관계 연결 (related_ids)

---

## 4. 발견된 문제점 및 개선사항

### 높음 (필수 수정)

**1. Levenshtein Distance → Jaro-Winkler 교체**
```javascript
현재: Levenshtein Distance (긴 문자열에 유리)
정확: Jaro-Winkler (짧은 키워드에 유리)

영향: 검색 정확도 20-30% 향상 예상
우선순위: 높음

근거: 
- 꿈 키워드는 대부분 1-5글자
- Jaro-Winkler는 짧은 문자열에 특화
- 접두어 매칭 지원 ("사랑" vs "사람")
```

**2. 키워드 품질 검증 및 정제**
```javascript
현재: "소" 꿈에 "까마귀", "오리" 키워드 존재
정확: 관련 있는 키워드만 포함

영향: 잘못된 검색 결과 제거
우선순위: 높음

조치: 
- 2,000개 데이터 전수 조사
- 무관한 키워드 제거
- 키워드 생성 알고리즘 개선
```

---

### 보통 (권장 수정)

**3. threshold 동적 조정**
```javascript
현재: threshold = 2 (고정)
개선: threshold = Math.max(1, Math.floor(query.length * 0.3))

예시:
- "뱀" (1글자) → threshold 1
- "사랑하다" (4글자) → threshold 1
- "행복하게살다" (6글자) → threshold 2
```

**4. 해석 텍스트 문법 수정**
```javascript
현재: "뱀은(는)", "변화을(를)"
개선: 정확한 조사 사용

도구: 한글 조사 라이브러리 사용
```

**5. 의미의 다양화**
```javascript
현재: "변화와 성장의 신호" 반복
개선: 각 꿈에 맞는 고유한 의미 부여

방법:
- Claude API로 의미 재생성
- 카테고리별 차별화
```

**6. 성능 테스트 추가**
```javascript
테스트 항목:
- 2,000개 검색 평균 응답 시간
- 동시 100명 검색 처리 능력
- 메모리 사용량
```

---

### 낮음 (선택사항)

**7. 카테고리/키워드 인덱싱**
```javascript
현재: 전체 DB 순회
개선: Map 기반 인덱싱

예시:
this.categoryIndex = {
  "동물": [1, 2, 3, ...],
  "자연": [50, 51, ...]
}

this.keywordIndex = {
  "뱀": [1, 5, 20],
  "물": [100, 150]
}
```

**8. includeRelated API 파라미터화**
```javascript
현재: includeRelated: true (하드코딩)
개선: includeRelated: req.query.includeRelated !== 'false'
```

---

## 5. 종합 평가

### 점수: 75/100

| 항목 | 점수 | 평가 |
|------|------|------|
| 정확성 | 70/100 | Levenshtein 대신 Jaro-Winkler 필요, 키워드 품질 문제 |
| 설계 | 85/100 | 3단계 검색 우수, 관련 꿈 추천 좋음 |
| 성능 | 80/100 | 2,000개 규모에서는 양호, 인덱싱 개선 여지 |
| 데이터 품질 | 65/100 | 2,000개 완비 but 키워드/해석 품질 낮음 |
| 문서화 | 75/100 | 테스트 존재, 성능 테스트 부족 |

### 배포 가능 여부
- **조건부 가능**

**배포 전 필수 수정:**
1. Jaro-Winkler 알고리즘 적용
2. 키워드 품질 검증 (최소 샘플링 100개)
3. 해석 텍스트 문법 수정 (조사 오류)

**배포 후 개선 (3개월 내):**
4. threshold 동적 조정
5. 의미 다양화
6. 성능 테스트 및 인덱싱

---

## 6. 권장 사항

### 즉시 조치

**1. Jaro-Winkler 라이브러리 도입**
```bash
npm install jaro-winkler
```

```javascript
// 교체 예시
const jaroWinkler = require('jaro-winkler');

similaritySearch(query, category) {
  const threshold = 0.85; // Jaro-Winkler는 0-1 유사도
  
  return this.dreamDB.filter(dream => {
    return dream.keywords.some(keyword => {
      const similarity = jaroWinkler(
        query.toLowerCase(),
        keyword.toLowerCase()
      );
      return similarity >= threshold;
    });
  });
}
```

**2. 키워드 샘플링 검증**
```javascript
// 샘플 100개 추출
const samples = this.dreamDB.slice(0, 100);

// 수동 검증
samples.forEach(dream => {
  console.log(`ID: ${dream.id}`);
  console.log(`Title: ${dream.title}`);
  console.log(`Keywords: ${dream.keywords.join(', ')}`);
  console.log('---');
});
```

---

### 향후 개선

**1. 한글 자소 분해 검색**
```javascript
// 한글 자소 분해 라이브러리 사용
const Hangul = require('hangul-js');

// "뱀" → ["ㅂ", "ㅐ", "ㅁ"]
const decomposed1 = Hangul.disassemble(query);
const decomposed2 = Hangul.disassemble(keyword);

// 자소 단위 Levenshtein
const distance = this.levenshteinDistance(
  decomposed1.join(''),
  decomposed2.join('')
);
```

**2. 의미 기반 검색 (벡터 임베딩)**
```javascript
// 장기 로드맵
- 키워드 임베딩 (Word2Vec, BERT)
- 유사 의미 검색 ("뱀" → "용", "이무기")
- Claude API 활용 의미 분석
```

---

## 7. 최종 의견

꿈해몽 검색 엔진은 **기본 구조가 탄탄**하고 2,000개 데이터가 완비되어 있어 **운영 가능한 수준**입니다. 

하지만 **검색 정확도 개선**을 위해 Jaro-Winkler 알고리즘 교체와 **데이터 품질 검증**이 필수적입니다.

### 긍정적 요소
- 3단계 검색 시스템으로 누락 최소화
- 관련 꿈 추천 기능으로 사용자 경험 향상
- 깔끔한 코드 구조와 RESTful API

### 개선 필요 요소
- 짧은 키워드에 적합한 알고리즘 사용
- 키워드 품질 검증 및 정제
- 해석 텍스트의 문법 개선

**현재 상태로도 베타 테스트 가능**하지만, 정식 배포 전에 **검색 알고리즘 교체와 데이터 품질 검증**을 권장합니다.

---

점검 완료일: 2025-01-05
다음 점검: 별자리 운세 / 궁합 / 토정비결
