// backend/prompts/saju/study-prompt.js
// 사주 학업운 프롬프트

function getStudyPrompt(engineResult) {
  const { saju, ilgan, elements, strength } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 학업운과 학습 능력을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개
- 신강/신약: ${strength}

해석 지침:
1. 학습 능력과 이해력
2. 집중력과 끈기
3. 어울리는 학습 방법
4. 강한 과목 vs 약한 과목
5. 시험운
6. 학업 향상을 위한 조언

작성 스타일:
- 학습자 본인과 부모에게 도움되게
- 구체적인 학습 전략 제시
- 300~500자 분량

해석:`;
}

module.exports = { getStudyPrompt };
