// backend/prompts/saju/parents-prompt.js
// 사주 부모운 프롬프트

function getParentsPrompt(engineResult) {
  const { saju, ilgan, tenStars } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 부모와의 인연을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 년주: ${saju.year.hanja} (부모궁)
- 월주: ${saju.month.hanja} (부모와의 관계)

해석 지침:
1. 부모와의 전반적인 인연
2. 부모로부터 받는 영향
3. 부모님 건강운
4. 효도와 봉양
5. 부모와의 갈등 해결
6. 부모님께 도움되는 조언

작성 스타일:
- 가족 관계 개선에 도움
- 따뜻하고 실용적으로
- 300~500자 분량

해석:`;
}

module.exports = { getParentsPrompt };
