// backend/prompts/saju/spouse-prompt.js
// 사주 배우자운 프롬프트

function getSpousePrompt(engineResult) {
  const { saju, ilgan, tenStars } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 배우자와의 인연을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 일지: ${saju.day.jiji} (배우자궁)

해석 지침:
1. 배우자와의 궁합
2. 배우자의 성향과 특징
3. 부부 관계의 강점과 약점
4. 배우자로부터 받는 도움
5. 부부 갈등 해결 방법
6. 행복한 결혼 생활 조언

작성 스타일:
- 부부 관계 이해에 도움
- 긍정적이고 건설적으로
- 300~500자 분량

해석:`;
}

module.exports = { getSpousePrompt };
