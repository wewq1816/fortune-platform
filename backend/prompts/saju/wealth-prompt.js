// backend/prompts/saju/wealth-prompt.js
// 사주 재물운 프롬프트

function getWealthPrompt(engineResult) {
  const { saju, ilgan, elements, strength, yongsin, tenStars } = engineResult;
  
  // 재성(편재, 정재) 개수 세기
  const wealthStars = Object.values(tenStars).reduce((count, pillar) => {
    if (pillar.cheongan === '편재' || pillar.cheongan === '정재') count++;
    if (pillar.jiji === '편재' || pillar.jiji === '정재') count++;
    return count;
  }, 0);
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 이 사람의 재물운을 100~350자로 해석해주세요.

📋 사주 정보:
- 일간: ${ilgan}
- 신강/신약: ${strength}
- 용신: ${yongsin}
- 재성 개수: ${wealthStars}개

🎯 해석 지침:
1. 재물을 모으는 방식 (정재/편재 기준)
2. 재물운의 강약
3. 투자 성향과 조언
4. 재정 관리 주의사항

💡 100~350자로 자세하게

해석:`;
}

module.exports = { getWealthPrompt };
