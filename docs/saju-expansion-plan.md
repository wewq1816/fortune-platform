# 사주팔자 시스템 확장 작업 지시서

## 📋 프로젝트 개요
- **목적**: 사주팔자 기능을 17개 카테고리로 확장
- **원칙**: 기존 엔진 수정 금지, 새 엔진 별도 개발 후 연동

---

## 🎯 현재 상태

### 기존 엔진 (수정 금지!)
```
engines/core/saju-engine.js (64줄)
engines/utils/
├── saju-calculator.js (83줄) - 사주 8글자
├── element-analyzer.js (48줄) - 오행 분석
├── strength-calculator.js (32줄) - 신강/신약
├── yongsin-finder.js (35줄) - 용신
└── ten-stars-calculator.js (74줄) - 십성
```

### 기존 프롬프트
```
backend/prompts/saju-prompt.js
backend/prompts/saju/
├── total-prompt.js (총운)
├── wealth-prompt.js (재물운)
├── love-prompt.js (애정운)
└── health-prompt.js (건강운)
```

### 현재 프론트엔드
```
frontend/pages/saju-test.html
- 한 페이지에 4가지 운세 전부 표시
```

---

## ✅ 추가해야 할 17개 카테고리

### 1. 기본 성격 (3개)
- [ ] 성격/장단점/성향

### 2. 시간별 운세 (1개)
- [ ] 대운 (10년 단위) ⚠️ 새 엔진 필요

### 3. 분야별 운세 (7개)
- [ ] 직업운/사업운
- [ ] 학업운/시험운
- [ ] 승진운/관운
- [ ] 이동운/이사운
- [ ] 여행운
- [ ] 재물운 (이미 있음 ✅)
- [ ] 애정운/결혼운 (이미 있음 ✅)
- [ ] 건강운 (이미 있음 ✅)

### 4. 인간관계 (5개)
- [ ] 부모운
- [ ] 형제자매운
- [ ] 자녀운
- [ ] 배우자운
- [ ] 대인관계운

### 5. 진로/적성 (3개)
- [ ] 직업 적성
- [ ] 어울리는 직업
- [ ] 사업 성공 가능성

### 6. 특수 (2개)
- [ ] 신살 (도화살, 역마살 등) ⚠️ 새 엔진 필요
- [ ] 택일 (좋은 날짜) ⚠️ 새 엔진 필요

---

## 🔧 Phase 1: 새 엔진 개발 (기존 수정 금지!)

### 1-1. 대운 엔진
```
engines/utils/daeun-calculator.js (새로 생성)

기능:
- 10년 단위 대운 계산
- 순행/역행 판정
- 대운수 계산
- 대운 간지 반환

입력: {year, month, day, hour, gender, isLunar}
출력: [
  {age: "3-13세", ganzi: "갑자", cheongan: "갑", jiji: "자"},
  {age: "13-23세", ganzi: "을축", cheongan: "을", jiji: "축"},
  ...
]
```

### 1-2. 신살 엔진
```
engines/utils/sinsal-calculator.js (새로 생성)

기능:
- 도화살, 역마살, 화개살 등 계산
- 각 신살의 의미 반환

입력: {saju 8글자}
출력: {
  도화살: true/false,
  역마살: true/false,
  화개살: true/false,
  천을귀인: true/false,
  ...
}
```

### 1-3. 택일 엔진
```
engines/utils/taekil-calculator.js (새로 생성)

기능:
- 좋은 날짜 계산
- 나쁜 날짜 제외
- 월별 길일 반환

입력: {year, month, saju, purpose}
출력: [
  {date: "2025-10-15", score: 95, reason: "대길일"},
  ...
]
```

### 1-4. 통합 엔진
```
engines/core/saju-engine-extended.js (새로 생성)

기존 saju-engine.js 상속 + 새 기능 추가
- calculateDaeun()
- calculateSinsal()
- calculateTaekil()
```

---

## 📝 Phase 2: 프롬프트 추가

### 2-1. 새 프롬프트 파일 생성
```
backend/prompts/saju/
├── total-prompt.js ✅ (기존)
├── wealth-prompt.js ✅ (기존)
├── love-prompt.js ✅ (기존)
├── health-prompt.js ✅ (기존)
├── personality-prompt.js (새로 생성) - 성격/장단점
├── daeun-prompt.js (새로 생성) - 대운
├── career-prompt.js (새로 생성) - 직업운/사업운
├── study-prompt.js (새로 생성) - 학업운
├── promotion-prompt.js (새로 생성) - 승진운
├── move-prompt.js (새로 생성) - 이동운
├── travel-prompt.js (새로 생성) - 여행운
├── parents-prompt.js (새로 생성) - 부모운
├── siblings-prompt.js (새로 생성) - 형제운
├── children-prompt.js (새로 생성) - 자녀운
├── spouse-prompt.js (새로 생성) - 배우자운
├── social-prompt.js (새로 생성) - 대인관계운
├── aptitude-prompt.js (새로 생성) - 직업 적성
├── job-recommend-prompt.js (새로 생성) - 어울리는 직업
├── business-prompt.js (새로 생성) - 사업 성공
├── sinsal-prompt.js (새로 생성) - 신살
└── taekil-prompt.js (새로 생성) - 택일
```

### 2-2. saju-prompt.js 수정
```javascript
// 기존 4개 + 새로운 17개 추가
function getSajuPrompt(category, engineResult, options = {}) {
  switch (category) {
    case 'total': return getTotalPrompt(engineResult);
    case 'wealth': return getWealthPrompt(engineResult);
    case 'love': return getLovePrompt(engineResult, options.gender);
    case 'health': return getHealthPrompt(engineResult);
    
    // 새로 추가
    case 'personality': return getPersonalityPrompt(engineResult);
    case 'daeun': return getDaeunPrompt(engineResult);
    case 'career': return getCareerPrompt(engineResult);
    // ... 14개 더 추가
    
    default: throw new Error(`Unknown category: ${category}`);
  }
}
```

---

## 🎨 Phase 3: UI 변경

### 3-1. 카테고리 선택 방식으로 변경
```html
현재: 한 페이지에 4가지 전부 표시
변경: 카테고리 선택 → 해당 내용만 표시

<div class="category-menu">
  <button onclick="showCategory('total')">총운</button>
  <button onclick="showCategory('personality')">성격/장단점</button>
  <button onclick="showCategory('daeun')">대운</button>
  <button onclick="showCategory('wealth')">재물운</button>
  <button onclick="showCategory('love')">애정운</button>
  <button onclick="showCategory('health')">건강운</button>
  <button onclick="showCategory('career')">직업운</button>
  <button onclick="showCategory('study')">학업운</button>
  <button onclick="showCategory('promotion')">승진운</button>
  <button onclick="showCategory('move')">이동운</button>
  <button onclick="showCategory('travel')">여행운</button>
  <button onclick="showCategory('parents')">부모운</button>
  <button onclick="showCategory('siblings')">형제운</button>
  <button onclick="showCategory('children')">자녀운</button>
  <button onclick="showCategory('spouse')">배우자운</button>
  <button onclick="showCategory('social')">대인관계운</button>
  <button onclick="showCategory('aptitude')">직업 적성</button>
  <button onclick="showCategory('job')">어울리는 직업</button>
  <button onclick="showCategory('business')">사업 성공</button>
  <button onclick="showCategory('sinsal')">신살</button>
  <button onclick="showCategory('taekil')">택일</button>
</div>

<div id="result-area">
  <!-- 선택한 카테고리 결과만 표시 -->
</div>
```

### 3-2. JavaScript 수정
```javascript
// Mock 데이터에 17개 카테고리 추가
const mockInterpretations = {
  total: "...",
  personality: "...",
  daeun: "...",
  wealth: "...",
  love: "...",
  health: "...",
  career: "...",
  study: "...",
  // ... 나머지 추가
};

// 카테고리 전환
function showCategory(category) {
  const result = sajuData.interpretations[category];
  document.getElementById('result-area').innerHTML = `
    <h2>${getCategoryTitle(category)}</h2>
    <p>${result}</p>
  `;
}
```

---

## 📦 Phase 4: server.js 수정 (나중에 API 연동)

```javascript
// Mock 응답에 17개 카테고리 추가
app.post('/api/saju', async (req, res) => {
  const { category } = req.body;
  
  // 엔진 계산
  const engineResult = calculateExtended(birthInfo);
  
  // 프롬프트 생성
  const prompt = getSajuPrompt(category, engineResult, options);
  
  // Claude API 호출 (나중에)
  // const interpretation = await callClaude(prompt);
  
  // Mock 응답
  const interpretation = getMockInterpretation(category, engineResult);
  
  res.json({ success: true, interpretation });
});
```

---

## 🎯 작업 순서

### Step 1: 엔진 개발 (30분)
1. daeun-calculator.js 생성
2. sinsal-calculator.js 생성
3. taekil-calculator.js 생성
4. saju-engine-extended.js 생성 및 통합

### Step 2: 프롬프트 생성 (20분)
1. 17개 프롬프트 파일 생성
2. saju-prompt.js에 통합

### Step 3: UI 변경 (20분)
1. saju-test.html 카테고리 방식으로 변경
2. Mock 데이터 17개 추가
3. 카테고리 전환 로직 추가

### Step 4: 테스트 (10분)
1. 각 카테고리 클릭 테스트
2. Mock 데이터 확인

---

## 📂 최종 파일 구조

```
운세플랫폼/
├── engines/
│   ├── core/
│   │   ├── saju-engine.js ✅ (기존 - 수정 금지)
│   │   └── saju-engine-extended.js ⭐ (새로 생성)
│   └── utils/
│       ├── saju-calculator.js ✅ (기존)
│       ├── element-analyzer.js ✅ (기존)
│       ├── strength-calculator.js ✅ (기존)
│       ├── yongsin-finder.js ✅ (기존)
│       ├── ten-stars-calculator.js ✅ (기존)
│       ├── daeun-calculator.js ⭐ (새로 생성)
│       ├── sinsal-calculator.js ⭐ (새로 생성)
│       └── taekil-calculator.js ⭐ (새로 생성)
│
├── backend/prompts/
│   ├── saju-prompt.js (수정)
│   └── saju/
│       ├── total-prompt.js ✅ (기존)
│       ├── wealth-prompt.js ✅ (기존)
│       ├── love-prompt.js ✅ (기존)
│       ├── health-prompt.js ✅ (기존)
│       └── [17개 새 프롬프트] ⭐
│
└── frontend/pages/
    └── saju-test.html (전면 수정)
```

---

## ⚠️ 주의사항

1. **기존 엔진 절대 수정 금지**
   - saju-engine.js
   - saju-calculator.js
   - element-analyzer.js
   - strength-calculator.js
   - yongsin-finder.js
   - ten-stars-calculator.js

2. **새 파일만 생성**
   - daeun-calculator.js
   - sinsal-calculator.js
   - taekil-calculator.js
   - saju-engine-extended.js

3. **기존 프롬프트 유지**
   - total-prompt.js
   - wealth-prompt.js
   - love-prompt.js
   - health-prompt.js

4. **Mock 데이터로 먼저 완성**
   - 실제 API 연동은 나중에

---

## 🚀 시작 명령

새 Claude 창에 이렇게 물어보세요:

```
"C:\xampp\htdocs\mysite\운세플랫폼 프로젝트의 사주팔자 기능을 17개 카테고리로 확장해야 합니다.

첨부된 작업 지시서(saju-expansion-plan.md)를 보고:

Phase 1부터 시작해주세요.
1. daeun-calculator.js 생성
2. sinsal-calculator.js 생성  
3. taekil-calculator.js 생성
4. saju-engine-extended.js 생성

기존 엔진 파일은 절대 수정하지 마세요!"
```

---

## 📌 참고 정보

### 프로젝트 경로
```
C:\xampp\htdocs\mysite\운세플랫폼
```

### 테스트 방법
```
브라우저에서 열기:
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-test.html
```

### 파일 크기 제한
- 각 파일 30줄 이하 권장
- 긴 파일은 여러 개로 분할

---

**이 문서를 새 Claude 창에 첨부하고 작업 시작하세요!**
