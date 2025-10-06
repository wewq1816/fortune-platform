# 🔧 꿈해몽 시스템 긴급 수정 - 복붙 명령서

**날짜**: 2025-01-06  
**목적**: 새 Claude 세션에서 바로 실행 가능한 명령서  
**소요 시간**: 약 20분

---

## 📋 전제 조건 확인

```
프로젝트 경로: C:\xampp\htdocs\mysite\운세플랫폼
작업 파일 3개:
1. engines/core/dream-engine.js (유사도 threshold 수정)
2. engines/prompts/dream-prompt.js (새로 생성)
3. engines/data/dream-db.json (길흉 재분류)
```

---

## 🎯 작업 1: 유사도 threshold 수정 (5분)

### ✅ 실행 명령

**파일 읽기**:
```
filesystem:read_text_file 사용
경로: C:\xampp\htdocs\mysite\운세플랫폼\engines\core\dream-engine.js
옵션: head=200 (상위 200줄만)
```

**수정할 부분 찾기** (약 177번째 줄):
```javascript
// 현재 코드 (찾을 내용)
similaritySearch(query, category) {
  // Jaro-Winkler threshold: 짧은 검색어는 더 엄격하게
  const threshold = query.length <= 2 ? 0.90 : 0.85;
```

**filesystem:edit_file 사용**:
```javascript
{
  "path": "C:\\xampp\\htdocs\\mysite\\운세플랫폼\\engines\\core\\dream-engine.js",
  "edits": [{
    "oldText": "  similaritySearch(query, category) {\n    // Jaro-Winkler threshold: 짧은 검색어는 더 엄격하게\n    const threshold = query.length <= 2 ? 0.90 : 0.85;",
    "newText": "  similaritySearch(query, category) {\n    // Jaro-Winkler threshold: 오타 감지를 위해 낮춤 (2025-01-06 개선)\n    const threshold = query.length <= 2 ? 0.80 : 0.75;"
  }]
}
```

**검증**:
```bash
node C:\xampp\htdocs\mysite\운세플랫폼\tests\test-dream-engine.js
```

---

## 🎯 작업 2: 프롬프트 파일 생성 (5분)

### ✅ 실행 명령

**filesystem:write_file 사용**:

**경로**: `C:\xampp\htdocs\mysite\운세플랫폼\engines\prompts\dream-prompt.js`

**내용** (전체 복사):
```javascript
/**
 * 꿈해몽 AI 프롬프트 시스템
 * 2025-01-06 생성
 */

const dreamPrompt = {
  /**
   * DB 기반 하이브리드 해석 프롬프트
   */
  hybrid: (query, dbResults) => {
    let dbContext = '';
    
    if (dbResults && dbResults.length > 0) {
      dbContext = '\n\n**전통 꿈해몽 DB 참고 정보:**\n';
      
      dbResults.forEach((dream, index) => {
        dbContext += `\n${index + 1}. ${dream.title}\n`;
        dbContext += `   의미: ${dream.meaning}\n`;
        dbContext += `   길흉: ${dream.fortune_type}\n`;
        dbContext += `   해석: ${dream.interpretation}\n`;
      });
      
      dbContext += '\n위 전통 꿈해몽 정보를 참고하되, 사용자가 입력한 구체적인 꿈 내용에 맞춰 자연스럽게 재해석해주세요.\n';
    } else {
      dbContext = '\n\n**참고:** DB에 정확히 일치하는 전통 꿈해몽이 없으므로, 일반적인 꿈해몽 원리에 따라 해석해주세요.\n';
    }

    return `당신은 30년 경력의 전통 꿈해몽 전문가입니다.

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
  },

  /**
   * 순수 AI 해석 프롬프트 (DB 없을 때)
   */
  pure: (query) => {
    return `당신은 30년 경력의 전통 꿈해몽 전문가입니다.

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
  },

  /**
   * 응답 파싱용 헬퍼
   */
  parseResponse: (response) => {
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
};

module.exports = dreamPrompt;
```

---

## 🎯 작업 3: 길흉 분포 재조정 (10분)

### ⚠️ 주의사항
- dream-db.json은 2,195개 항목이 있는 대용량 파일
- 한 번에 수정하면 위험
- **단계별로 조심스럽게 진행**

### ✅ 실행 명령

#### Step 1: 현재 길흉 분포 확인

**repl 도구 사용**:
```javascript
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/xampp/htdocs/mysite/운세플랫폼/engines/data/dream-db.json', 'utf8'));

// 길흉 통계
const stats = { 길몽: 0, 흉몽: 0, 중립: 0 };
data.forEach(d => stats[d.fortune_type]++);

console.log('현재 분포:');
console.log(`길몽: ${stats['길몽']}개 (${(stats['길몽']/data.length*100).toFixed(1)}%)`);
console.log(`흉몽: ${stats['흉몽']}개 (${(stats['흉몽']/data.length*100).toFixed(1)}%)`);
console.log(`중립: ${stats['중립']}개 (${(stats['중립']/data.length*100).toFixed(1)}%)`);

// 중립인 꿈 중 상위 20개 ID만 출력
const neutrals = data.filter(d => d.fortune_type === '중립').slice(0, 20);
console.log('\n중립 꿈 샘플 (상위 20개):');
neutrals.forEach(d => console.log(`ID ${d.id}: ${d.title}`));
```

#### Step 2: 길흉 재분류 기준 설정

**기준**:
```
길몽으로 변경할 키워드:
- 돈, 금, 재물, 보물, 다이아몬드
- 꽃, 무지개, 태양, 빛
- 승진, 합격, 성공, 승리
- 결혼, 임신, 출산, 아기
- 용, 호랑이, 거북이, 봉황

흉몽으로 변경할 키워드:
- 죽음, 사고, 추락, 떨어지다
- 도난, 도둑, 잃어버리다
- 쫓기다, 도망, 공격
- 병, 질병, 다치다
- 불, 홍수 (재난)
```

#### Step 3: 길몽 재분류 스크립트 실행

**repl 사용** (길몽 재분류):
```javascript
const fs = require('fs');
const path = 'C:/xampp/htdocs/mysite/운세플랫폼/engines/data/dream-db.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 길몽 키워드
const goodKeywords = ['돈', '금', '재물', '보물', '다이아', '꽃', '무지개', '태양', '빛', 
                      '승진', '합격', '성공', '승리', '결혼', '임신', '출산', '아기',
                      '용', '호랑이', '거북', '봉황', '사랑', '행복', '기쁨'];

let changed = 0;

data.forEach(dream => {
  if (dream.fortune_type === '중립') {
    const text = (dream.title + ' ' + dream.keywords.join(' ')).toLowerCase();
    
    // 길몽 키워드가 포함되어 있으면
    if (goodKeywords.some(kw => text.includes(kw))) {
      dream.fortune_type = '길몽';
      changed++;
    }
  }
});

// 저장
fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ ${changed}개를 길몽으로 변경 완료`);
```

#### Step 4: 흉몽 재분류 스크립트 실행

**repl 사용** (흉몽 재분류):
```javascript
const fs = require('fs');
const path = 'C:/xampp/htdocs/mysite/운세플랫폼/engines/data/dream-db.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 흉몽 키워드
const badKeywords = ['죽음', '사망', '사고', '추락', '떨어', '도난', '도둑', '잃어', 
                     '쫓기', '도망', '공격', '병', '질병', '다치', '불', '화재', '홍수'];

let changed = 0;

data.forEach(dream => {
  if (dream.fortune_type === '중립') {
    const text = (dream.title + ' ' + dream.keywords.join(' ')).toLowerCase();
    
    // 흉몽 키워드가 포함되어 있으면
    if (badKeywords.some(kw => text.includes(kw))) {
      dream.fortune_type = '흉몽';
      changed++;
    }
  }
});

// 저장
fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ ${changed}개를 흉몽으로 변경 완료`);
```

#### Step 5: 최종 검증

**repl 사용**:
```javascript
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/xampp/htdocs/mysite/운세플랫폼/engines/data/dream-db.json', 'utf8'));

// 최종 통계
const stats = { 길몽: 0, 흉몽: 0, 중립: 0 };
data.forEach(d => stats[d.fortune_type]++);

console.log('✅ 최종 분포:');
console.log(`길몽: ${stats['길몽']}개 (${(stats['길몽']/data.length*100).toFixed(1)}%)`);
console.log(`흉몽: ${stats['흉몽']}개 (${(stats['흉몽']/data.length*100).toFixed(1)}%)`);
console.log(`중립: ${stats['중립']}개 (${(stats['중립']/data.length*100).toFixed(1)}%)`);

console.log('\n목표 비율:');
console.log('길몽: 40%, 흉몽: 15%, 중립: 45%');
```

---

## 🧪 최종 테스트

### 1. 엔진 테스트
```bash
node C:\xampp\htdocs\mysite\운세플랫폼\tests\test-dream-engine.js
```

**확인 사항**:
- ✅ "뱀" 검색: 15개 결과
- ✅ "뱁" (오타) 검색: 결과 있어야 함! (이전에는 0개)
- ✅ 카테고리 필터: 정상 작동
- ✅ 통계: 길흉 분포 개선됨

### 2. 하이브리드 테스트 (AI)
```bash
node C:\xampp\htdocs\mysite\운세플랫폼\tests\test-dream-hybrid.js
```

---

## ✅ 완료 체크리스트

```
작업 1: 유사도 threshold 수정
- [ ] dream-engine.js 읽기
- [ ] threshold 0.75로 수정 (177줄 근처)
- [ ] 파일 저장 확인

작업 2: 프롬프트 파일 생성
- [ ] dream-prompt.js 생성
- [ ] 내용 복사 붙여넣기
- [ ] 파일 저장 확인

작업 3: 길흉 재분류
- [ ] 현재 분포 확인 (repl)
- [ ] 길몽 재분류 실행
- [ ] 흉몽 재분류 실행
- [ ] 최종 통계 확인

최종 테스트:
- [ ] 엔진 테스트 실행
- [ ] "뱁" 오타 검색 테스트 (결과 있어야 함!)
- [ ] 통계 확인 (길흉 분포 개선됨)
```

---

## 📊 예상 결과

### Before (현재)
```
길몽: 261개 (11.9%)
흉몽: 38개 (1.7%)
중립: 1,896개 (86.4%)
```

### After (목표)
```
길몽: 800~900개 (약 40%)
흉몽: 300~350개 (약 15%)
중립: 900~1,000개 (약 45%)
```

---

## 🚨 문제 발생 시

### 문제 1: 파일 수정 실패 (EPERM)
```
원인: 파일이 다른 프로세스에서 사용 중
해결: Node.js 프로세스 모두 종료 후 재시도
```

### 문제 2: JSON 파싱 에러
```
원인: JSON 구조가 깨짐
해결: Git에서 이전 버전 복구
```

### 문제 3: 테스트 실패
```
원인: 경로 문제 또는 모듈 없음
해결: cd 명령으로 정확한 경로 이동 후 실행
```

---

## 📝 작업 후 문서 업데이트

작업 완료 후 다음 문서 업데이트:

1. **DREAM_IMPROVEMENT_CHECKPOINT.md**
   - 3가지 작업 완료로 체크

2. **DREAM_SYSTEM_ANALYSIS.md**
   - Phase 1 완료로 변경

3. **project_plan.md**
   - 꿈해몽 시스템 완전 완료로 기록

---

**작성**: Claude AI  
**날짜**: 2025-01-06  
**용도**: 새 Claude 세션 복붙용 명령서  
**예상 소요**: 20분
