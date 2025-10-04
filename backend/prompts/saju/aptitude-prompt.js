// backend/prompts/saju/aptitude-prompt.js
// 사주 직업 적성 프롬프트

function getAptitudePrompt(engineResult) {
  const { saju, ilgan, elements, yongsin } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 직업 적성을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개
- 용신: ${yongsin}

해석 지침:
1. 타고난 재능과 능력
2. 강한 직업 분야 3가지
3. 약한 직업 분야 2가지
4. 창의성 vs 분석력
5. 혼자 vs 팀워크
6. 적성 개발 방향

작성 스타일:
- 진로 선택에 실질적 도움
- 구체적인 적성 분야 제시
- 300~500자 분량

해석:`;
}

module.exports = { getAptitudePrompt };
