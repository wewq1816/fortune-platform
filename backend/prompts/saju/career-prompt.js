// backend/prompts/saju/career-prompt.js
// 사주 직업운/사업운 프롬프트

function getCareerPrompt(engineResult) {
  const { saju, ilgan, elements, strength, yongsin, tenStars } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 직업운과 사업운을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개
- 신강/신약: ${strength}
- 용신: ${yongsin}

해석 지침:
1. 직장생활 vs 사업 중 어느 쪽이 유리한지
2. 일간과 오행으로 본 직업 성향
3. 리더십과 조직 적응력
4. 사업 성공 가능성
5. 직업에서 강점과 약점
6. 경력 개발 조언

작성 스타일:
- 현실적이고 구체적으로
- 직업 선택에 도움되는 조언
- 300~500자 분량

해석:`;
}

module.exports = { getCareerPrompt };
