# 꿈해몽 개선 적용 가이드

작성일: 2025-01-05
작성자: Claude

---

## 개요

이 가이드는 꿈해몽 시스템의 2가지 개선사항을 적용하는 방법을 설명합니다:
1. 문법 오류 수정 (필수, 즉시)
2. Jaro-Winkler 알고리즘 도입 (권장, 선택)

---

## Step 1: 문법 오류 수정 (필수)

### 1.1 문제 확인

현재 상태:
```json
"title": "뱀이(가) 나오는 꿈"
"interpretation": "뱀은(는) 재물을(를) 상징합니다..."
```

목표:
```json
"title": "뱀이 나오는 꿈"
"interpretation": "뱀은 재물을 상징합니다..."
```

### 1.2 스크립트 실행

```bash
# 1. 프로젝트 루트로 이동
cd C:\xampp\htdocs\mysite\운세플랫폼

# 2. 문법 수정 스크립트 실행
node scripts/fix-dream-grammar.js
```

**출력 예시:**
```
꿈해몽 데이터 문법 수정 시작...

총 2000개 꿈 데이터 로드됨

진행중... 500/2000
진행중... 1000/2000
진행중... 1500/2000
진행중... 2000/2000

======================================================================
수정 완료!
======================================================================
총 수정: 2000개 / 2000개
제목 수정: 2000개
해석 수정: 2000개

저장 위치: C:\xampp\htdocs\mysite\운세플랫폼\engines\data\dream-db-fixed.json

다음 단계:
1. dream-db-fixed.json 검증
2. 문제 없으면 dream-db.json으로 교체
======================================================================
```

### 1.3 검증

```bash
# 수정된 파일 샘플 확인
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./engines/data/dream-db-fixed.json', 'utf8'));
console.log('샘플 5개:');
data.slice(0, 5).forEach(d => {
  console.log('---');
  console.log('ID:', d.id);
  console.log('제목:', d.title);
  console.log('해석:', d.interpretation.substring(0, 100) + '...');
});
"
```

**확인 사항:**
- [ ] "은(는)", "을(를)", "이(가)" 패턴 제거됨
- [ ] 올바른 조사 사용 ("뱀은", "변화를")
- [ ] 의미 변화 없음

### 1.4 백업 및 교체

```bash
# 1. 원본 백업
copy engines\data\dream-db.json engines\data\dream-db-backup-20250105.json

# 2. 수정본으로 교체
copy engines\data\dream-db-fixed.json engines\data\dream-db.json

# 3. 서버 재시작
# Ctrl+C로 서버 중지 후
node server.js
```

### 1.5 테스트

```bash
# 브라우저에서 테스트
http://localhost:3000/pages/dream.html

# 검색어: "뱀"
# 결과 확인:
# - 제목에 "(가)" 같은 패턴 없는지
# - 해석 텍스트 자연스러운지
```

---

## Step 2: Jaro-Winkler 도입 (선택)

### 2.1 사전 테스트 (권장)

먼저 현재 Levenshtein과 비교해보세요.

```bash
# 기존 엔진 테스트
node tests/test-dream-engine.js

# 결과 저장
node tests/test-dream-engine.js > test-results-levenshtein.txt
```

### 2.2 옵션 A: 기본 Jaro-Winkler (한글 자소 분해 없음)

**장점:** 간단, 추가 패키지 불필요
**단점:** 한글 특성 미반영

#### 2.2.1 코드 수정

`engines/core/dream-engine.js` 수정:

```javascript
// 1. 파일 상단에 함수 추가
/**
 * Jaro-Winkler 유사도 계산
 */
jaroWinklerSimilarity(str1, str2) {
  // [dream-engine-jaro-winkler.js의 jaroWinklerSimilarity 함수 복사]
  // ... (전체 코드는 dream-engine-jaro-winkler.js 참조)
}

// 2. similaritySearch() 함수 교체
similaritySearch(query, category) {
  // 동적 threshold
  const threshold = query.length <= 2 ? 0.90 : 0.85;
  
  return this.dreamDB.filter(dream => {
    if (category && dream.category !== category) return false;
    
    return dream.keywords.some(keyword => {
      const similarity = this.jaroWinklerSimilarity(
        query.toLowerCase(),
        keyword.toLowerCase()
      );
      return similarity >= threshold;
    });
  });
}
```

#### 2.2.2 테스트

```bash
# 수정 후 테스트
node tests/test-dream-engine.js

# 비교
node tests/test-dream-engine.js > test-results-jarowinkler.txt
fc test-results-levenshtein.txt test-results-jarowinkler.txt
```

**확인 사항:**
- [ ] "뱁" → "뱀" 검색 성공
- [ ] "사" → "사랑", "사과" 검색 성공
- [ ] 검색 결과 개수 비교

### 2.3 옵션 B: 한글 자소 분해 (고급)

**장점:** 한글 특성 반영, 높은 정확도
**단점:** 추가 패키지 필요

#### 2.3.1 패키지 설치

```bash
npm install hangul-js
```

#### 2.3.2 코드 수정

`engines/core/dream-engine.js`:

```javascript
// 파일 상단에 추가
const Hangul = require('hangul-js');

// similaritySearch() 함수 교체
similaritySearch(query, category) {
  const threshold = 0.85;
  
  return this.dreamDB.filter(dream => {
    if (category && dream.category !== category) return false;
    
    return dream.keywords.some(keyword => {
      // 자소 분해
      const decomposed1 = Hangul.disassemble(query.toLowerCase());
      const decomposed2 = Hangul.disassemble(keyword.toLowerCase());
      
      // 문자열로 변환
      const str1 = decomposed1.join('');
      const str2 = decomposed2.join('');
      
      // Jaro-Winkler 계산
      const similarity = this.jaroWinklerSimilarity(str1, str2);
      
      return similarity >= threshold;
    });
  });
}
```

#### 2.3.3 테스트

```bash
# 한글 자소 분해 테스트
node -e "
const Hangul = require('hangul-js');
console.log('뱀:', Hangul.disassemble('뱀'));
console.log('뱁:', Hangul.disassemble('뱁'));
// 출력: ['ㅂ','ㅐ','ㅁ'] vs ['ㅂ','ㅐ','ㅂ']
"

# 전체 테스트
node tests/test-dream-engine.js
```

---

## Step 3: 성능 측정 (선택)

### 3.1 검색 속도 측정

```javascript
// 테스트 스크립트 (tests/performance-test.js)
const DreamEngine = require('../engines/core/dream-engine');
const engine = new DreamEngine();

const queries = ['뱀', '물', '사랑', '죽음', '꿈'];
const iterations = 100;

console.log('성능 테스트 시작...\n');

queries.forEach(query => {
  const start = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    engine.search(query, { limit: 10 });
  }
  
  const end = Date.now();
  const avg = (end - start) / iterations;
  
  console.log(`"${query}" - 평균: ${avg.toFixed(2)}ms`);
});
```

```bash
node tests/performance-test.js
```

### 3.2 정확도 측정

```javascript
// 테스트 케이스 (tests/accuracy-test.js)
const testCases = [
  { query: '뱀', expected: ['뱀', '큰뱀', '하얀뱀'] },
  { query: '뱁', expected: ['뱀'] },  // 오타
  { query: '사', expected: ['사랑', '사과', '사자'] },
  { query: '물', expected: ['물', '물고기', '물결'] }
];

testCases.forEach(test => {
  const result = engine.search(test.query, { limit: 10 });
  const found = test.expected.filter(exp =>
    result.results.some(r => r.keywords.includes(exp))
  );
  
  console.log(`"${test.query}": ${found.length}/${test.expected.length} 정확`);
});
```

---

## Step 4: A/B 테스트 (선택)

### 4.1 두 버전 병행 운영

```javascript
// server.js에 추가
const DreamEngineOld = require('./engines/core/dream-engine-old');
const DreamEngineNew = require('./engines/core/dream-engine');

const engineOld = new DreamEngineOld();
const engineNew = new DreamEngineNew();

app.get('/api/dream', (req, res) => {
  const { q, version } = req.query;
  
  // version=old 또는 version=new로 선택
  const engine = version === 'old' ? engineOld : engineNew;
  
  const result = engine.search(q, { limit: 10 });
  res.json(result);
});
```

### 4.2 비교 UI

```html
<!-- dream.html에 추가 -->
<button onclick="testBoth()">두 알고리즘 비교</button>

<script>
async function testBoth() {
  const query = document.querySelector('input').value;
  
  const [oldResult, newResult] = await Promise.all([
    fetch(`/api/dream?q=${query}&version=old`).then(r => r.json()),
    fetch(`/api/dream?q=${query}&version=new`).then(r => r.json())
  ]);
  
  console.log('Levenshtein:', oldResult.total, '개');
  console.log('Jaro-Winkler:', newResult.total, '개');
  console.log('차이:', newResult.total - oldResult.total);
}
</script>
```

---

## 체크리스트

### 필수 (즉시)
- [ ] Step 1.1: 문제 확인
- [ ] Step 1.2: 문법 수정 스크립트 실행
- [ ] Step 1.3: 수정 결과 검증
- [ ] Step 1.4: 백업 및 교체
- [ ] Step 1.5: 브라우저 테스트

### 권장 (1주일 내)
- [ ] Step 2.1: 사전 테스트
- [ ] Step 2.2 or 2.3: Jaro-Winkler 적용
- [ ] Step 3: 성능 측정

### 선택 (2주일 내)
- [ ] Step 4: A/B 테스트
- [ ] 사용자 피드백 수집
- [ ] 최적 threshold 값 결정

---

## 문제 해결

### Q1: 스크립트 실행 오류

```
Error: Cannot find module 'hangul-js'
```

**해결:**
```bash
npm install hangul-js
```

### Q2: 수정 후 검색 결과 없음

**확인:**
1. threshold 값이 너무 높은지 확인 (0.85 → 0.80으로 낮춤)
2. 자소 분해가 제대로 되는지 확인
3. 로그 확인: `console.log(similarity)`

### Q3: 성능 저하

**해결:**
1. threshold를 높여서 필터링 강화
2. 카테고리 인덱싱 추가
3. 캐싱 도입

---

## 다음 단계

1. **데이터 품질 개선**: 키워드 정제 (무관한 키워드 제거)
2. **의미 다양화**: 획일적인 의미 개선
3. **카테고리 인덱싱**: 검색 성능 향상
4. **사용자 피드백**: 검색 만족도 조사

---

작성자: Claude
작성일: 2025-01-05
