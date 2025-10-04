// backend/prompts/saju/social-prompt.js
// 사주 대인관계운 프롬프트

function getSocialPrompt(engineResult) {
  const { saju, ilgan, elements, tenStars } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 대인관계운을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개

해석 지침:
1. 대인관계 성향
2. 사교성과 친화력
3. 어울리는 사람 유형
4. 피해야 할 사람 유형
5. 인간관계 갈등 해결
6. 인맥 관리 조언

작성 스타일:
- 사회생활에 실용적 도움
- 구체적인 관계 전략
- 300~500자 분량

해석:`;
}

module.exports = { getSocialPrompt };
