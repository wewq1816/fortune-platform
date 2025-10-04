// backend/prompts/saju/total-prompt.js
// 사주 총운 프롬프트

function getTotalPrompt(engineResult) {
  const { saju, ilgan, elements, strength, yongsin } = engineResult;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 이 사람의 전반적인 성격과 인생 흐름을 300~500자로 해석해주세요.

📋 사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan} (나를 나타내는 글자)
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개
- 신강/신약: ${strength}
- 용신: ${yongsin} (사주의 약점을 보완하는 오행)

🎯 해석 지침:
1. 일간(${ilgan})의 특성 설명
2. 오행 균형 분석 (부족하거나 과한 오행의 영향)
3. ${strength} 사주의 의미 (강점과 약점)
4. 용신(${yongsin})이 의미하는 인생 방향
5. 전반적인 성격과 재능
6. 인생에서 주의할 점

💡 작성 스타일:
- 55~65세 여성이 이해하기 쉽게
- 긍정적이면서도 현실적으로
- 구체적인 조언 포함
- 300~500자 분량

해석:`;
}

module.exports = { getTotalPrompt };
