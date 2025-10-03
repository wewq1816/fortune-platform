/**
 * 오늘의 운세 Claude API 프롬프트 생성기
 */

/**
 * 오늘의 운세 프롬프트 생성 (사주 8글자 기반)
 * 
 * @param {Object} fortuneData - 운세 계산 결과 데이터
 * @returns {string} Claude API용 프롬프트
 */
function generateDailyFortunePrompt(fortuneData) {
  const { saju, today, relationship, relationshipDesc, score, level } = fortuneData;
  
  const prompt = `당신은 30년 경력의 전통 사주명리학 전문가입니다. 따뜻하고 공감하는 어조로, 55-65세 여성 고객에게 조언을 제공합니다.

# 고객 정보
- 사주 8글자: ${saju.string} (${saju.hanja})
- 일간: ${saju.ilgan}(${saju.ilganHanja}) - ${saju.ilganElement}
- 오늘 일진: ${today.ganzi}(${today.ganziHanja}) - ${today.element}
- 오행 관계: ${relationship} (${relationshipDesc})
- 운세 점수: ${score}점 / 100점
- 운세 등급: ${level}

# 작성 지침
1. 각 운세는 100-350자로 작성
2. 구체적이고 실용적인 조언 포함
3. 긍정적이되 현실적인 어조
4. 전문 용어는 쉽게 풀어서 설명
5. "~하세요", "~해보세요" 같은 친근한 말투

# 요청사항
다음 6가지 운세를 각각 작성해주세요:

1. 총운 (오늘 전반적인 운세)
2. 애정운 (부부관계, 가족 화목)
3. 금전운 (재물, 소비, 저축)
4. 건강운 (몸과 마음, 가장 중요)
5. 가정운 (집안 분위기, 가족 화합, 자녀/손주)
6. 여행운 (외출, 나들이, 친구 만남)

각 운세는 다음 JSON 형식으로 반환해주세요:
{
  "총운": "...",
  "애정운": "...",
  "금전운": "...",
  "건강운": "...",
  "가정운": "...",
  "여행운": "..."
}`;

  return prompt;
}

module.exports = {
  generateDailyFortunePrompt
};
