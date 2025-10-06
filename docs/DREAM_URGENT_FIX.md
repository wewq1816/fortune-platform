# 🎯 꿈해몽 시스템 즉시 조치 사항

**날짜**: 2025-01-06  
**상태**: 긴급 조치 필요  

---

## ⚠️ 즉시 수정 필요 (Critical)

### 1. 유사도 검색 threshold 조정

**파일**: `C:\xampp\htdocs\mysite\운세플랫폼\engines\core\dream-engine.js`  
**라인**: 약 177번째 줄

**현재 코드**:
```javascript
similaritySearch(query, category) {
  // Jaro-Winkler threshold: 짧은 검색어는 더 엄격하게
  const threshold = query.length <= 2 ? 0.90 : 0.85;
```

**수정 코드**:
```javascript
similaritySearch(query, category) {
  // Jaro-Winkler threshold: 오타 감지를 위해 낮춤 (2025-01-06 개선)
  const threshold = query.length <= 2 ? 0.80 : 0.75;
```

**효과**:
- ✅ "뱁" → "뱀" 검색 가능
- ✅ 오타 허용도 증가
- ✅ 검색 실패율 감소

---

### 2. 꿈해몽 프롬프트 파일 생성

**생성 위치**: `C:\xampp\htdocs\mysite\운세플랫폼\engines\prompts\dream-prompt.js`

**내용**:
```javascript
/**
 * 꿈해몽 AI 프롬프트 시스템
 */

const dreamPrompt = {
  /**
   * DB 기반 하이브리드 해석 프롬프트
   */
  hybrid: (query, dbResults) => {
    let dbContext = '';
    
    if (dbResults && dbResults.length > 0) {
      dbContext = '\\n\\n**전통 꿈해몽 DB 참고 정보:**\\n';
      
      dbResults.forEach((dream, index) => {
        dbContext += `\\n${index + 1}. ${dream.title}\\n`;
        dbContext += `   의미: ${dream.meaning}\\n`;
        dbContext += `   길흉: ${dream.fortune_type}\\n`;
        dbContext += `   해석: ${dream.interpretation}\\n`;
      });
      
      dbContext += '\\n위 전통 꿈해몽 정보를 참고하되, 사용자가 입력한 구체적인 꿈 내용에 맞춰 자연스럽게 재해석해주세요.\\n';
    } else {
      dbContext = '\\n\\n**참고:** DB에 정확히 일치하는 전통 꿈해몽이 없으므로, 일반적인 꿈해몽 원리에 따라 해석해주세요.\\n';
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
  }
};

module.exports = dreamPrompt;
```

---

## 📋 수정 체크리스트

```markdown
- [ ] dream-engine.js threshold 수정 (0.90/0.85 → 0.80/0.75)
- [ ] dream-prompt.js 파일 생성
- [ ] dream-engine.js에서 프롬프트 import로 변경
- [ ] 테스트 실행: node tests/test-dream-engine.js
- [ ] 유사도 검색 재테스트 ("뱁" 검색)
```

---

## 🧪 수정 후 테스트

```bash
# 1. 엔진 테스트
cd C:\xampp\htdocs\mysite\운세플랫폼
node tests/test-dream-engine.js

# 2. 유사도 검색 테스트
# "뱁" 검색 시 "뱀" 관련 결과 나오는지 확인

# 3. 하이브리드 테스트 (AI)
node tests/test-dream-hybrid.js
```

---

## 📌 참고 문서

- `DREAM_SYSTEM_ANALYSIS.md` - 전체 시스템 분석 보고서
- `DREAM_IMPROVEMENT_CHECKPOINT.md` - 개선 체크포인트

---

**작성**: Claude AI  
**우선순위**: 🔴 긴급 (Critical)  
**예상 소요 시간**: 15분
