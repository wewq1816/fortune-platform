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