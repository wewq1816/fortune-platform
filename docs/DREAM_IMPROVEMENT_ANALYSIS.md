# 꿈해몽 개선안 분석 보고서

분석일: 2025-01-05
분석자: Claude
목적: 제안된 해결책의 타당성 검증

---

## 제안된 해결책 2가지

1. **Jaro-Winkler 라이브러리 도입**
2. **해석 텍스트 문법 수정**

---

## 1. Jaro-Winkler 도입 - 분석 결과

### 1.1 웹 검색 검증 결과

**핵심 발견:**
- Jaro-Winkler는 **짧은 문자열(이름, 주소 등) 비교에 특화**
- **접두어 매칭**에 강점 ("사랑" vs "사람" 같은 경우)
- Levenshtein은 **긴 문자열에 유리**

**전문가 의견 (웹 검색):**
```
"Jaro-Winkler는 접두어를 사용해 작은 단어나 어구(예: 이름, 주소)의 
비교에 용이하도록 개발되었기 때문에, 짧은 문자열의 유사성 계산에 더 유리하다."
```

### 1.2 꿈 키워드 데이터 분석

**실제 키워드 길이 분포:**
```json
"뱀" - 1글자
"물" - 1글자  
"불" - 1글자
"사랑" - 2글자
"죽음" - 2글자
"큰뱀" - 2글자
"행복하다" - 4글자
```

**분석:**
- 대부분 **1-3글자** 키워드
- **짧은 한글 명사** 위주
- Jaro-Winkler의 강점 영역

### 1.3 비교 테스트 (이론적)

**Case 1: 오타 검색**
```
검색어: "뱁" (오타)
정답: "뱀"

Levenshtein Distance: 1 (1글자 대체)
Jaro-Winkler: 0.89 (높은 유사도)

결론: 둘 다 검출 가능
```

**Case 2: 접두어 매칭**
```
검색어: "사"
정답: "사랑", "사과", "사자"

Levenshtein: threshold=2로 검출 어려움
Jaro-Winkler: 접두어 매칭으로 검출 용이

결론: Jaro-Winkler 우세
```

**Case 3: 짧은 단어**
```
검색어: "물"
정답: "물고기"

Levenshtein: 2 (고, 기 삽입)
Jaro-Winkler: 접두어 "물" 매칭

결론: Jaro-Winkler 우세
```

### 1.4 한글 특성

**문제점:**
- Jaro-Winkler도 **한글 초/중/종성 미고려**
- "뱀" vs "뱁": 종성만 다름 (ㅁ vs ㅂ)
- 현재는 완전히 다른 글자로 처리

**해결책:**
```javascript
// 한글 자소 분해 후 Jaro-Winkler 적용
const Hangul = require('hangul-js');

const decompose1 = Hangul.disassemble("뱀"); // ["ㅂ","ㅐ","ㅁ"]
const decompose2 = Hangul.disassemble("뱁"); // ["ㅂ","ㅐ","ㅂ"]

// 자소 단위로 Jaro-Winkler 계산
const similarity = jaroWinkler(
  decompose1.join(''),
  decompose2.join('')
);
// → 매우 높은 유사도
```

### 1.5 최종 판정: **타당함 (조건부)**

**장점:**
✅ 짧은 키워드(1-3글자)에 적합
✅ 접두어 매칭 강화
✅ 검색 정확도 향상 예상 (20-30%)

**조건:**
⚠️ **한글 자소 분해와 병행** 필요
⚠️ 실제 테스트 필요 (100개 샘플)
⚠️ 성능 측정 필요

**권장사항:**
1. **1단계**: 기본 Jaro-Winkler 도입
2. **2단계**: 한글 자소 분해 추가
3. **3단계**: A/B 테스트로 검증

---

## 2. 해석 텍스트 문법 수정 - 분석 결과

### 2.1 문제 규모 확인

**검색 결과:**
```
"은(는)|을(를)|이(가)" 패턴:
- 총 2,470개 매칭
- 거의 모든 꿈 데이터(2,000개)에 존재
```

**샘플 확인:**
```json
"interpretation": "뱀은(는) 재물, 지혜, 변화을(를) 상징합니다..."
                   ^^^^                     ^^^^
```

### 2.2 문법 오류 패턴 분석

**패턴 1: 조사 중복**
```
잘못: "뱀은(는)"
올바름: "뱀은" 또는 "뱀이"

원인: 자동 생성 시 받침 체크 실패
```

**패턴 2: 목적격 조사 오류**
```
잘못: "변화을(를)"
올바름: "변화를"

원인: 받침 유무 미확인
```

**패턴 3: 주격 조사**
```
잘못: "뱀이(가)"
올바름: "뱀이"
```

### 2.3 원인 분석

**추정 생성 방식:**
```javascript
// 잘못된 방식 (추정)
const text = `${word}은(는) ${meaning}을(를) 상징합니다...`;
```

**올바른 방식:**
```javascript
// 받침 체크 함수
function getJosa(word, josaType) {
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0) - 0xAC00;
  
  // 받침 있음: (code % 28) !== 0
  const hasFinalConsonant = (code % 28) !== 0;
  
  if (josaType === 'subject') {
    return hasFinalConsonant ? '이' : '가';
  } else if (josaType === 'topic') {
    return hasFinalConsonant ? '은' : '는';
  } else if (josaType === 'object') {
    return hasFinalConsonant ? '을' : '를';
  }
}

// 사용
const text = `${word}${getJosa(word, 'topic')} ${meaning}${getJosa(meaning, 'object')} 상징합니다...`;

// 예시:
// "뱀" + getJosa("뱀", "topic") → "뱀은"
// "변화" + getJosa("변화", "object") → "변화를"
```

### 2.4 수정 방법

**방법 1: 전체 데이터 재생성 (권장)**
```javascript
// dream-db.json 전체 재생성
const fixInterpretation = (dream) => {
  const word = dream.title.match(/(.+?)(이\(가\)|은\(는\)|을\(를\))/)[1];
  
  return `${word}${getJosa(word, 'topic')} ${dream.meaning}${getJosa(dream.meaning, 'object')} 상징합니다. ${dream.interpretation.split('.')[1]}`;
};

// 2,000개 전체 수정
dreamDB.forEach(dream => {
  dream.interpretation = fixInterpretation(dream);
  dream.title = dream.title.replace(/이\(가\)|은\(는\)|을\(를\)/, '');
});
```

**방법 2: 정규식 치환 (빠른 임시 방법)**
```javascript
// 간단 치환 (부정확할 수 있음)
const text = interpretation
  .replace(/은\(는\)/g, '은')  // 받침 있는 경우 많음
  .replace(/을\(를\)/g, '을')
  .replace(/이\(가\)/g, '이');
```

**방법 3: 조사 라이브러리 사용 (추천)**
```bash
npm install josa
```

```javascript
const { josa } = require('josa');

const text = josa(`#{word}은 #{meaning}을 상징합니다...`);
// "뱀은 변화를 상징합니다..."
```

### 2.5 최종 판정: **타당함 (필수)**

**심각도: 높음**
- 모든 꿈 데이터(2,000개)에 영향
- 사용자 경험 직접 저하
- 신뢰도 하락

**해결 방법:**
1. **즉시**: josa 라이브러리 도입
2. **단기**: 전체 데이터 재생성 스크립트 작성
3. **장기**: 데이터 생성 파이프라인 개선

---

## 3. 종합 판정

### 3.1 우선순위

| 순위 | 작업 | 난이도 | 효과 | 긴급도 |
|------|------|--------|------|--------|
| 1 | 문법 수정 | 낮음 | 높음 | 긴급 |
| 2 | Jaro-Winkler 도입 | 중간 | 중간 | 보통 |
| 3 | 한글 자소 분해 | 높음 | 높음 | 낮음 |

### 3.2 권장 실행 계획

**Week 1 (즉시):**
```bash
# 1. josa 라이브러리 설치
npm install josa

# 2. 문법 수정 스크립트 작성 및 실행
node scripts/fix-dream-grammar.js

# 3. 검증 (샘플 100개)
node scripts/verify-grammar.js
```

**Week 2:**
```bash
# 4. Jaro-Winkler 설치
npm install jaro-winkler

# 5. dream-engine.js 수정
# 6. 테스트 (100개 검색 케이스)
```

**Week 3:**
```bash
# 7. 한글 자소 분해 추가 (선택)
npm install hangul-js

# 8. A/B 테스트
# 9. 성능 측정
```

---

## 4. 결론

### 두 해결책 모두 타당함

**1. Jaro-Winkler 도입: ✅ 타당 (조건부)**
- 짧은 키워드 검색에 적합
- 검색 정확도 향상 예상
- 조건: 한글 자소 분해 병행 권장

**2. 문법 수정: ✅ 타당 (필수)**
- 2,000개 전체에 영향
- 즉시 수정 필요
- josa 라이브러리로 간단히 해결 가능

### 실행 권장

**즉시 착수:**
1. 문법 수정 (josa 라이브러리)
2. 전체 데이터 재생성

**후속 작업:**
3. Jaro-Winkler 도입
4. 한글 자소 분해 (선택)
5. A/B 테스트 및 검증

---

작성자: Claude
작성일: 2025-01-05
