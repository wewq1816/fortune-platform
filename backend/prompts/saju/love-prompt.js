// backend/prompts/saju/love-prompt.js
// 사주 애정운 프롬프트

function getLovePrompt(engineResult, gender) {
  const { saju, ilgan, elements, strength, yongsin, tenStars } = engineResult;
  
  // 관성(여성) 또는 재성(남성) 개수 세기
  const loveStars = Object.values(tenStars).reduce((count, pillar) => {
    if (gender === '여성') {
      if (pillar.cheongan === '편관' || pillar.cheongan === '정관') count++;
      if (pillar.jiji === '편관' || pillar.jiji === '정관') count++;
    } else {
      if (pillar.cheongan === '편재' || pillar.cheongan === '정재') count++;
      if (pillar.jiji === '편재' || pillar.jiji === '정재') count++;
    }
    return count;
  }, 0);
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 이 사람의 애정운을 100~350자로 해석해주세요.

📋 사주 정보:
- 성별: ${gender}
- 일간: ${ilgan}
- 신강/신약: ${strength}
- ${gender === '여성' ? '관성(남편)' : '재성(아내)'} 개수: ${loveStars}개

🎯 해석 지침:
1. 이성운의 강약
2. 연애/결혼 스타일
3. 배우자와의 관계
4. 애정 관계에서 주의할 점

💡 100~350자로 자세하게

해석:`;
}

module.exports = { getLovePrompt };
