// backend/prompts/saju/move-prompt.js
// 사주 이동운/이사운 프롬프트

function getMovePrompt(engineResult, sinsal) {
  const { saju, ilgan, yongsin } = engineResult;
  const hasYeokma = sinsal && sinsal.yeokma;
  
  return `당신은 전통 사주명리학 전문가입니다. 다음 사주를 보고 이동운과 이사운을 300~500자로 분석해주세요.

사주 정보:
- 사주 8글자: ${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}
- 일간: ${ilgan}
- 용신: ${yongsin}
- 역마살: ${hasYeokma ? '있음' : '없음'}

해석 지침:
1. 이동운의 강약
2. 역마살의 영향${hasYeokma ? ' (역마살 있음)' : ''}
3. 이사/이직에 유리한 시기
4. 새로운 환경 적응력
5. 이동 시 주의사항
6. 방향별 길흉

작성 스타일:
- 이사/이직 결정에 도움
- 구체적인 시기 제시
- 300~500자 분량

해석:`;
}

module.exports = { getMovePrompt };
