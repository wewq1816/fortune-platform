// backend/prompts/saju/siblings-prompt.js
// 사주 형제자매운 프롬프트

function getSiblingsPrompt(engineResult) {
  const { saju, ilgan, tenStars } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 형제자매와의 인연을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 월주: ${saju.month.hanja} (형제궁)

해석 지침:
1. 형제자매와의 인연 깊이
2. 형제 간 우애와 갈등
3. 형제로부터 받는 도움
4. 형제에게 줄 수 있는 도움
5. 관계 개선 방법
6. 형제 간 재산 문제

작성 스타일:
- 형제 관계 이해에 도움
- 화목한 관계 유지 조언
- 300~500자 분량

해석:`;
}

module.exports = { getSiblingsPrompt };
