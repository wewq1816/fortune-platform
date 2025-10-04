// backend/prompts/saju/sinsal-prompt.js
// 사주 신살 프롬프트

function getSinsalPrompt(engineResult, sinsal) {
  const { saju, ilgan } = engineResult;
  const sinsalList = [];
  if (sinsal.dohwa) sinsalList.push('도화살');
  if (sinsal.yeokma) sinsalList.push('역마살');
  if (sinsal.hwagae) sinsalList.push('화개살');
  if (sinsal.cheonEulGuiIn) sinsalList.push('천을귀인');
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주의 신살을 보고 그 의미를 300~500자로 해석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}

신살 정보:
- 도화살: ${sinsal.dohwa ? '있음' : '없음'}
- 역마살: ${sinsal.yeokma ? '있음' : '없음'}
- 화개살: ${sinsal.hwagae ? '있음' : '없음'}
- 천을귀인: ${sinsal.cheonEulGuiIn ? '있음' : '없음'}

해석 지침:
1. 각 신살의 의미 설명
2. 신살이 주는 긍정적 영향
3. 신살이 주는 주의할 영향
4. 신살 활용 방법
5. 신살로 인한 인생 변화
6. 신살 대응 조언

작성 스타일:
- 신살을 이해하기 쉽게
- 긍정적이면서 현실적으로
- 300~500자 분량

해석:`;
}

module.exports = { getSinsalPrompt };
