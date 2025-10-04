// backend/prompts/saju/health-prompt.js
// 사주 건강운 프롬프트

function getHealthPrompt(engineResult) {
  const { saju, ilgan, elements, strength, yongsin } = engineResult;
  
  // 과하거나 부족한 오행 찾기
  const maxElement = Object.keys(elements).reduce((a, b) => 
    elements[a] > elements[b] ? a : b
  );
  const minElement = Object.keys(elements).reduce((a, b) => 
    elements[a] < elements[b] ? a : b
  );
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 이 사람의 건강운을 100~150자로 해석해주세요.

📋 사주 정보:
- 일간: ${ilgan}
- 오행 분포: 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개
- 과한 오행: ${maxElement}
- 부족한 오행: ${minElement}

🎯 해석 지침:
1. 체질과 건강 특성
2. 주의해야 할 장기나 부위
3. 건강 관리 조언
4. 계절이나 환경 주의사항

💡 100~150자로 간단명료하게

해석:`;
}

module.exports = { getHealthPrompt };
