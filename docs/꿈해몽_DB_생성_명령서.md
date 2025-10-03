# 꿈해몽 DB 2,000개 생성 명령서

**작업 날짜**: 2025-10-02  
**담당**: Claude (새 창)  
**우선순위**: 최우선 🔥  
**예상 소요 시간**: 2-3시간

---

## 🎯 **작업 목표**

### **생성할 것**
```
1. scripts/generate-dream-db.js (생성 스크립트)
2. engines/data/dream-db.json (2,000개 꿈 DB)
```

### **DB 용도**
```
싼 Claude Haiku API의 지식 베이스
→ AI가 이 DB를 참고해서 꿈 해석
→ 비용 60배 절감 (Opus $15 → Haiku $0.25)
```

---

## 📋 **상세 요구사항**

### **1. DB 구조**
```json
[
  {
    "id": 1,
    "category": "동물",
    "title": "뱀이 나오는 꿈",
    "keywords": ["뱀", "구렁이", "큰뱀", "작은뱀", "독사"],
    "meaning": "재물, 지혜, 변화",
    "fortune_type": "길몽",
    "interpretation": "뱀은 동양에서 재물운과 지혜를 상징합니다. 큰 뱀이 나타나면 큰 재물운이 들어올 징조이며, 작은 뱀은 작은 행운을 의미합니다. 뱀에게 물리는 꿈은 건강 문제를 암시할 수 있으니 주의가 필요합니다.",
    "related_ids": [2, 5, 12],
    "created_at": "2025-10-02"
  }
]
```

### **2. 필수 필드 설명**
```
id           : 고유 번호 (1~2000)
category     : 카테고리 (7개 중 1개)
title        : 꿈 제목 (예: "뱀이 나오는 꿈")
keywords     : 검색용 키워드 배열 (5~10개)
meaning      : 핵심 의미 (한 줄, 10자 내외)
fortune_type : 길몽/흉몽/중립
interpretation: 해석 내용 (150~200자)
related_ids  : 관련 꿈 ID (3~5개)
created_at   : 생성 날짜
```

---

## 📁 **카테고리별 목표 개수**

### **7개 카테고리 (총 2,000개)**
```
1. 동물   : 300개
2. 자연   : 300개
3. 사람   : 300개
4. 음식   : 300개
5. 건물   : 300개
6. 교통   : 200개
7. 기타   : 300개
```

### **카테고리별 주요 키워드 예시**

#### **1. 동물 (300개)**
```
뱀, 용, 호랑이, 사자, 개, 고양이, 
쥐, 소, 돼지, 닭, 말, 원숭이,
새, 독수리, 까치, 까마귀, 비둘기,
물고기, 상어, 고래, 거북이,
벌레, 나비, 거미, 지네 등
```

#### **2. 자연 (300개)**
```
물, 불, 바다, 강, 산, 하늘,
비, 눈, 번개, 천둥, 바람, 폭풍,
해, 달, 별, 무지개, 구름,
지진, 홍수, 폭풍, 태풍,
꽃, 나무, 풀, 숲 등
```

#### **3. 사람 (300개)**
```
부모, 형제, 자식, 친구, 연인,
조상, 죽은 사람, 유명인, 낯선 사람,
아기, 어린이, 노인, 임신,
결혼, 이혼, 싸움, 화해,
죽음, 장례식, 살해 등
```

#### **4. 음식 (300개)**
```
밥, 빵, 과일, 야채, 고기,
생선, 술, 물, 차, 커피,
떡, 과자, 아이스크림,
김치, 된장, 고추장,
계란, 우유, 치즈 등
```

#### **5. 건물 (300개)**
```
집, 아파트, 학교, 회사, 병원,
교회, 절, 무덤, 화장실,
문, 창문, 계단, 엘리베이터,
방, 거실, 부엌, 침실,
다리, 터널, 건물 붕괴 등
```

#### **6. 교통 (200개)**
```
자동차, 버스, 기차, 비행기,
배, 자전거, 오토바이,
사고, 추락, 충돌,
운전, 탑승, 길 잃음 등
```

#### **7. 기타 (300개)**
```
돈, 금, 보석, 로또, 당첨,
시험, 합격, 불합격,
전화, 편지, 메시지,
옷, 신발, 가방, 안경,
피, 상처, 병, 치료 등
```

---

## 🔧 **생성 스크립트 구조**

### **파일: scripts/generate-dream-db.js**

```javascript
const fs = require('fs');

// 카테고리별 템플릿
const categories = {
  "동물": {
    count: 300,
    keywords: ["뱀", "용", "호랑이", "개", "고양이", ...],
    templates: [
      {
        pattern: "{동물}이 나오는 꿈",
        meaning: "길흉 혼합",
        base_interpretation: "{동물}은(는) {상징}을(를) 의미합니다..."
      }
    ]
  },
  "자연": { count: 300, ... },
  "사람": { count: 300, ... },
  "음식": { count: 300, ... },
  "건물": { count: 300, ... },
  "교통": { count: 200, ... },
  "기타": { count: 300, ... }
};

// 꿈 생성 함수
function generateDream(id, category, keyword) {
  return {
    id,
    category,
    title: `${keyword}이(가) 나오는 꿈`,
    keywords: [keyword, ...generateRelatedKeywords(keyword)],
    meaning: getMeaning(keyword),
    fortune_type: getFortuneType(keyword),
    interpretation: generateInterpretation(keyword),
    related_ids: [],
    created_at: new Date().toISOString().split('T')[0]
  };
}

// 전체 DB 생성
function generateDreamDB() {
  let dreamDB = [];
  let id = 1;
  
  for (const [category, config] of Object.entries(categories)) {
    for (let i = 0; i < config.count; i++) {
      const keyword = config.keywords[i % config.keywords.length];
      dreamDB.push(generateDream(id++, category, keyword));
    }
  }
  
  // JSON 파일로 저장
  fs.writeFileSync(
    'engines/data/dream-db.json',
    JSON.stringify(dreamDB, null, 2),
    'utf8'
  );
  
  console.log(`✅ 총 ${dreamDB.length}개 꿈 DB 생성 완료!`);
}

// 실행
generateDreamDB();
```

---

## 📝 **작업 단계**

### **Step 1: 프로젝트 구조 확인**
```bash
C:\xampp\htdocs\mysite\운세플랫폼\
├── scripts/
│   └── generate-dream-db.js (생성할 파일)
├── engines/
│   └── data/
│       └── dream-db.json (생성될 파일)
```

### **Step 2: 스크립트 작성**
```
1. scripts/generate-dream-db.js 생성
2. 카테고리별 키워드 정의
3. 꿈 생성 로직 구현
4. JSON 파일로 저장
```

### **Step 3: 실행 및 검증**
```bash
node scripts/generate-dream-db.js
```

### **Step 4: 결과 확인**
```
✅ engines/data/dream-db.json 생성 확인
✅ 2,000개 꿈 데이터 확인
✅ 카테고리별 개수 확인
✅ 필수 필드 모두 있는지 확인
```

---

## ✅ **완료 조건 체크리스트**

### **필수 확인 사항**
```
[ ] scripts/generate-dream-db.js 파일 생성 완료
[ ] engines/data/dream-db.json 파일 생성 완료
[ ] 총 2,000개 꿈 데이터 생성 확인
[ ] 카테고리별 개수 맞는지 확인:
    [ ] 동물: 300개
    [ ] 자연: 300개
    [ ] 사람: 300개
    [ ] 음식: 300개
    [ ] 건물: 300개
    [ ] 교통: 200개
    [ ] 기타: 300개
[ ] 각 꿈마다 필수 필드 모두 있음:
    [ ] id
    [ ] category
    [ ] title
    [ ] keywords (5개 이상)
    [ ] meaning
    [ ] fortune_type
    [ ] interpretation (150-200자)
    [ ] related_ids
    [ ] created_at
[ ] JSON 형식 올바른지 확인 (파싱 오류 없음)
[ ] 한글 인코딩 정상 (UTF-8)
```

---

## 🎯 **중요 가이드라인**

### **1. 해석 작성 시 주의사항**
```
✅ 150-200자 분량
✅ 긍정적이고 희망적인 톤
✅ 구체적인 조언 포함
✅ "~을 의미합니다", "~을 암시합니다" 형식
✅ 길흉 구분 명확히
```

### **2. 키워드 선정 원칙**
```
✅ 검색 가능성 높은 단어
✅ 유사어/동의어 포함
✅ 5~10개 적절히
✅ 띄어쓰기 없이
```

### **3. 카테고리 분류 원칙**
```
✅ 명확한 카테고리 1개만
✅ 애매하면 "기타"
✅ 복합적인 경우 주된 요소 기준
```

---

## 💡 **팁 & 참고사항**

### **효율적인 생성 방법**
```
1. 템플릿 활용
   - "~이 나오는 꿈"
   - "~을 먹는 꿈"
   - "~을 보는 꿈"
   - "~에 쫓기는 꿈"

2. 변형 생성
   - 큰뱀/작은뱀/흰뱀/검은뱀
   - 많은물/맑은물/더러운물
   - 죽은사람/살아난사람

3. 반복 활용
   - 기본 패턴 만들고
   - 키워드만 바꿔가며 생성
```

### **시간 단축 방법**
```
1. ChatGPT/Claude 활용
   - 카테고리별 100개씩 생성 요청
   - JSON 형식으로 바로 받기

2. 단계별 생성
   - 동물 300개 → 저장 → 확인
   - 자연 300개 → 저장 → 확인
   - ...반복

3. 템플릿 재사용
   - 비슷한 패턴은 복사-수정
```

---

## 📊 **예상 결과물**

### **engines/data/dream-db.json (일부)**
```json
[
  {
    "id": 1,
    "category": "동물",
    "title": "뱀이 나오는 꿈",
    "keywords": ["뱀", "구렁이", "큰뱀", "작은뱀", "독사"],
    "meaning": "재물, 지혜, 변화",
    "fortune_type": "길몽",
    "interpretation": "뱀은 동양에서 재물운과 지혜를 상징합니다. 큰 뱀이 나타나면 큰 재물운이 들어올 징조이며, 작은 뱀은 작은 행운을 의미합니다. 뱀에게 물리는 꿈은 건강 문제를 암시할 수 있으니 주의가 필요합니다.",
    "related_ids": [2, 5, 12],
    "created_at": "2025-10-02"
  },
  {
    "id": 2,
    "category": "동물",
    "title": "뱀에게 물리는 꿈",
    "keywords": ["뱀", "물리다", "뱀물림", "독사", "피"],
    "meaning": "경고, 건강",
    "fortune_type": "흉몽",
    "interpretation": "뱀에게 물리는 꿈은 건강 문제나 대인관계의 어려움을 경고하는 신호입니다. 하지만 피가 나는 경우 오히려 재물운이 들어올 수 있는 길몽으로 해석되기도 합니다. 주변 사람들과의 관계에 주의하세요.",
    "related_ids": [1, 3, 15],
    "created_at": "2025-10-02"
  }
]
```

---

## 🚨 **주의사항**

### **반드시 지켜야 할 것**
```
❌ 중복된 ID 없어야 함
❌ 빈 필드 없어야 함
❌ JSON 형식 오류 없어야 함
❌ 한글 깨짐 없어야 함 (UTF-8)
❌ 너무 짧거나 긴 해석 없어야 함
```

### **테스트 방법**
```javascript
// JSON 파싱 테스트
const dreamDB = require('./engines/data/dream-db.json');

// 개수 확인
console.log(`총 개수: ${dreamDB.length}`); // 2000

// 카테고리별 개수
const categories = dreamDB.reduce((acc, dream) => {
  acc[dream.category] = (acc[dream.category] || 0) + 1;
  return acc;
}, {});
console.log(categories);
// { 동물: 300, 자연: 300, 사람: 300, ... }

// 필드 누락 확인
const requiredFields = ['id', 'category', 'title', 'keywords', 
                        'meaning', 'fortune_type', 'interpretation'];
dreamDB.forEach(dream => {
  requiredFields.forEach(field => {
    if (!dream[field]) {
      console.error(`ID ${dream.id}: ${field} 누락!`);
    }
  });
});
```

---

## 📞 **완료 후 보고**

### **작업 완료 시 알려줄 내용**
```
✅ 파일 생성 완료
   - scripts/generate-dream-db.js
   - engines/data/dream-db.json

✅ 통계
   - 총 개수: 2,000개
   - 카테고리별 개수
   - 평균 키워드 수
   - 평균 해석 길이

✅ 샘플 데이터 (5개 정도)
   - 각 카테고리별 1개씩

✅ 검증 결과
   - JSON 파싱 성공
   - 필드 누락 없음
   - 한글 정상
```

---

## 🎯 **최종 목표**

```
2,000개 꿈 DB 완성
    ↓
AI가 이 DB를 참고
    ↓
싼 Haiku로도 정확한 해석
    ↓
비용 60배 절감! 💰
```

---

**이 명령서를 다른 Claude 창에 복사-붙여넣기하면 됩니다!** 🚀
