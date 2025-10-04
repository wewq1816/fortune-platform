// backend/prompts/saju/promotion-prompt.js
// 사주 승진운 프롬프트

function getPromotionPrompt(engineResult) {
  const { saju, ilgan, tenStars, yongsin } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 승진운과 출세운을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 용신: ${yongsin}

해석 지침:
1. 관운(승진 가능성)
2. 리더십과 관리 능력
3. 상사와의 관계운
4. 승진에 유리한 시기
5. 승진을 위해 필요한 노력
6. 승진 후 주의사항

작성 스타일:
- 직장인에게 실질적 도움
- 승진 전략 제시
- 300~500자 분량

해석:`;
}

module.exports = { getPromotionPrompt };
