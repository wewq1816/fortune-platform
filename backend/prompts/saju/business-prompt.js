// backend/prompts/saju/business-prompt.js
// 사주 사업 성공 가능성 프롬프트

function getBusinessPrompt(engineResult) {
  const { saju, ilgan, elements, strength, tenStars } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 사업 성공 가능성을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개
- 신강/신약: ${strength}

해석 지침:
1. 사업 성공 가능성 (상/중/하)
2. 어울리는 사업 분야
3. 사업 자금 운용 능력
4. 직원 관리 능력
5. 사업 위험 요소
6. 성공을 위한 조언

작성 스타일:
- 창업 결정에 실질적 도움
- 현실적인 장단점 제시
- 300~500자 분량

해석:`;
}

module.exports = { getBusinessPrompt };
