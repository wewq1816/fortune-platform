// backend/prompts/saju/job-recommend-prompt.js
// 사주 어울리는 직업 프롬프트

function getJobRecommendPrompt(engineResult) {
  const { saju, ilgan, elements, strength, yongsin } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 어울리는 직업을 300~500자로 추천해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개
- 신강/신약: ${strength}
- 용신: ${yongsin}

해석 지침:
1. 가장 잘 맞는 직업 5가지 구체적으로
2. 오행별 어울리는 분야
3. 일간 특성에 맞는 직종
4. 신강/신약에 따른 직업 선택
5. 용신 활용 직업
6. 피해야 할 직업

작성 스타일:
- 구체적인 직업명 제시
- 현실적이고 실용적으로
- 300~500자 분량

해석:`;
}

module.exports = { getJobRecommendPrompt };
