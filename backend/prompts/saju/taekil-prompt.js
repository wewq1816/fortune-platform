// backend/prompts/saju/taekil-prompt.js
// 사주 택일 프롬프트

function getTaekilPrompt(engineResult, taekilResults, purpose) {
  const { saju, ilgan, yongsin } = engineResult;
  const topDays = taekilResults.slice(0, 3);
  
  const purposeText = {
    'wedding': '결혼',
    'move': '이사',
    'business': '사업 시작',
    'travel': '여행',
    'general': '일반적인 일'
  }[purpose] || '일반적인 일';
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 ${purposeText}에 좋은 날짜를 300~500자로 추천해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 용신: ${yongsin}

추천 길일 (상위 3개):
${topDays.map(d => '- ' + d.date + ' (' + d.score + '점, ' + d.reason + ')').join('\n')}

해석 지침:
1. 각 날짜가 좋은 이유
2. 날짜별 특징과 장점
3. ${purposeText}에 특히 좋은 날짜
4. 시간대 추천
5. 피해야 할 날짜
6. 택일 활용 조언

작성 스타일:
- 날짜 선택에 실질적 도움
- 구체적인 이유 제시
- 300~500자 분량

해석:`;
}

module.exports = { getTaekilPrompt };
