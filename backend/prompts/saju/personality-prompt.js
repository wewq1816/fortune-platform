// backend/prompts/saju/personality-prompt.js
// 사주 성격/장단점 프롬프트

function getPersonalityPrompt(engineResult) {
  const { saju, ilgan, elements, strength, yongsin, tenStars } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 이 사람의 성격, 장점, 단점을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개
- 신강/신약: ${strength}
- 용신: ${yongsin}

해석 지침:
1. 일간(${ilgan})이 나타내는 기본 성격
2. 오행 균형에서 보이는 성격적 특징
3. 주요 장점 3가지
4. 주의해야 할 단점 2가지
5. 성격을 발전시킬 방향

작성 스타일:
- 구체적이고 실용적으로
- 장점은 격려하고 단점은 개선 방향 제시
- 300~500자 분량

해석:`;
}

module.exports = { getPersonalityPrompt };
