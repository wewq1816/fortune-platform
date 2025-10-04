// backend/prompts/saju/daeun-prompt.js
// 사주 대운 프롬프트

function getDaeunPrompt(engineResult, daeunList, currentAge) {
  const { saju, ilgan, yongsin } = engineResult;
  const currentDaeun = daeunList.find(d => {
    const [start, end] = d.age.split('-').map(a => parseInt(a.replace('세', '')));
    return currentAge >= start && currentAge <= end;
  }) || daeunList[0];
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주의 현재 대운을 보고 이 시기의 운세를 300~500자로 해석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 용신: ${yongsin}

현재 대운:
- 나이: ${currentDaeun.age}
- 대운 간지: ${currentDaeun.ganzi}
- 천간: ${currentDaeun.cheongan}, 지지: ${currentDaeun.jiji}

해석 지침:
1. 이 대운의 전반적인 특징
2. 일간과 대운 간지의 관계
3. 용신과의 조화 분석
4. 이 시기에 좋은 점
5. 이 시기에 주의할 점
6. 구체적인 활동 조언

작성 스타일:
- 10년 단위 장기 흐름 설명
- 희망적이면서 현실적으로
- 300~500자 분량

해석:`;
}

module.exports = { getDaeunPrompt };
