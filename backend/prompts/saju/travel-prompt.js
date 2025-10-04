// backend/prompts/saju/travel-prompt.js
// 사주 여행운 프롬프트

function getTravelPrompt(engineResult, sinsal) {
  const { saju, ilgan, elements } = engineResult;
  const hasYeokma = sinsal && sinsal.yeokma;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 여행운을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개
- 역마살: ${hasYeokma ? '있음' : '없음'}

해석 지침:
1. 여행운의 강약
2. 어울리는 여행지 (오행 기준)
3. 여행에 좋은 시기
4. 혼자 vs 단체 여행 적성
5. 여행 중 주의사항
6. 여행으로 얻는 긍정 효과

작성 스타일:
- 여행 계획에 실용적 도움
- 구체적인 여행지 방향 제시
- 300~500자 분량

해석:`;
}

module.exports = { getTravelPrompt };
