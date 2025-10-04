// backend/prompts/saju/children-prompt.js
// 사주 자녀운 프롬프트

function getChildrenPrompt(engineResult) {
  const { saju, ilgan, tenStars } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 자녀와의 인연을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 시주: ${saju.hour.hanja} (자녀궁)

해석 지침:
1. 자녀와의 인연
2. 자녀의 수와 성별 경향
3. 자녀로부터 받는 복
4. 자녀 교육과 양육
5. 자녀와의 소통
6. 노후 자녀의 효도

작성 스타일:
- 부모에게 실질적 도움
- 자녀 양육 조언 포함
- 300~500자 분량

해석:`;
}

module.exports = { getChildrenPrompt };
