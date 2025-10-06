// backend/prompts/tarot-prompt.js
// 타로 카드 Haiku 프롬프트 생성기

/**
 * 타로 리딩 프롬프트 생성
 */
function generateTarotPrompt(meanings, category) {
  const categoryNames = {
    total: '총운',
    personality: '성격',
    daeun: '대운',
    wealth: '재물운',
    love: '애정운',
    parents: '부모운',
    siblings: '형제운',
    children: '자녀운',
    spouse: '배우자운',
    social: '대인관계',
    health: '건강운',
    career: '직업운',
    study: '학업운',
    promotion: '승진운',
    aptitude: '적성',
    job: '직업추천',
    business: '사업운',
    move: '이동운',
    travel: '여행운',
    taekil: '택일',
    sinsal: '신살'
  };

  const categoryName = categoryNames[category] || category;

  // 5장 카드 정보 구성
  const cardsInfo = meanings.map(m => {
    return `
【${m.position_ko}】 ${m.card.name_ko} (${m.card.orientation === 'upright' ? '정방향' : '역방향'})
의미: ${m.meaning}`;
  }).join('\n');

  const prompt = `당신은 타로 카드 전문가입니다.
다음 5장의 타로 카드를 ${categoryName}에 대해 해석해주세요.

선택된 카드:
${cardsInfo}

요구사항:
1. 5장 카드를 종합적으로 연결하여 해석
2. ${categoryName}에 집중한 실용적 조언
3. 긍정적이면서도 현실적인 톤
4. 300-400자 분량
5. 각 카드의 위치(핵심, 과거, 미래, 조언, 결과)를 고려

답변 형식:
전체적으로 [종합 해석]. 
과거에는 [과거 카드 해석], 
현재 핵심은 [핵심 카드 해석]. 
앞으로 [미래 카드 해석]이 예상되며, 
[조언 카드]를 통해 [구체적 조언]. 
최종적으로 [결과 카드 해석]할 것입니다.`;

  return prompt;
}

module.exports = {
  generateTarotPrompt
};
