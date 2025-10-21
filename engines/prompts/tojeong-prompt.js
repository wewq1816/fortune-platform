/**
 * 토정비결 Claude API 프롬프트 생성기
 * 이모지 없음, Windows 환경
 */

function generateTojeongPrompt(tojeongData, category = '전체운', gender = '여성') {
  const { year, yearGanzi, mainGua, monthlyFortune } = tojeongData;
  
  // 월별 원문 텍스트 조합
  const monthlyText = monthlyFortune.map((m, i) => 
    `${i + 1}월: ${m.text}`
  ).join('\n');
  
  // 카테고리별 매핑
  const categoryInfo = {
    '전체운': {
      name: '종합운세',
      focus: '전반적인 한 해의 흐름과 주요 사건들'
    },
    '금전운': {
      name: '재물운',
      focus: '돈, 투자, 재정 관리, 수입과 지출'
    },
    '애정운': {
      name: '연애운',
      focus: '사랑, 만남, 관계의 발전, 배우자/연인과의 관계'
    },
    '건강운': {
      name: '건강운',
      focus: '신체와 정신 건강, 질병 예방, 건강 관리'
    },
    '가정운': {
      name: '가정운',
      focus: '가족, 집안 분위기, 자녀/손주, 가족 화목'
    },
    '여행운': {
      name: '여행운',
      focus: '외출, 여행, 이동, 새로운 장소 방문'
    }
  };

  const currentCategory = categoryInfo[category] || categoryInfo['전체운'];
  
  const genderText = gender === '남성' ? '남성' : '여성';
  const ageGuide = gender === '남성' 
    ? '55-65세 남성 고객에게 가장으로서의 책임과 따뜻한 조언을 제공합니다'
    : '55-65세 여성 고객에게 따뜻하고 실용적인 조언을 제공합니다';
  
  const prompt = `당신은 30년 경력의 토정비결 전문가입니다. ${ageGuide}.

# 고객 정보
- 연도: ${year}년 ${yearGanzi}년
- 연간 주괘: ${mainGua.name} ${mainGua.symbol}
- 괘의 의미: ${mainGua.description}
- 운세 등급: ${mainGua.level}
- **선택한 카테고리**: ${currentCategory.name}

# 월별 원문 (144괘 토정비결)
${monthlyText}

# 작성 지침
**중요**: 고객이 선택한 카테고리는 **${currentCategory.name}**입니다. 
반드시 **${currentCategory.focus}** 관점에서 운세를 해석해주세요!

1. **${currentCategory.name}**: 100-350자
   - ${year}년 ${currentCategory.focus}를 중심으로 설명
   - 주괘 ${mainGua.name}의 의미를 ${currentCategory.name} 관점에서 해석
   - ${currentCategory.name}에 맞는 구체적이고 실용적인 조언
   
2. **월별 ${currentCategory.name}**: 각 100-350자
   - 매월의 운세를 **${currentCategory.focus}** 관점에서 해석
   - 원문을 현대어로 풀되, ${currentCategory.name}에 초점을 맞춤
   - 각 월마다 ${currentCategory.name} 관련 구체적인 조언 제공

3. **어조**:
   - 따뜻하고 격려하는 톤
   - "~하세요", "~해보세요" 같은 친근한 말투
   - 부정적 내용도 희망적으로 표현

# 요청사항
다음 JSON 형식으로 정확히 작성해주세요:

{
  "${currentCategory.name}": "${year}년 ${currentCategory.name}은...",
  "월별운세": {
    "1월": "정월의 ${currentCategory.name}은...",
    "2월": "2월의 ${currentCategory.name}은...",
    "3월": "3월의 ${currentCategory.name}은...",
    "4월": "4월의 ${currentCategory.name}은...",
    "5월": "5월의 ${currentCategory.name}은...",
    "6월": "6월의 ${currentCategory.name}은...",
    "7월": "7월의 ${currentCategory.name}은...",
    "8월": "8월의 ${currentCategory.name}은...",
    "9월": "9월의 ${currentCategory.name}은...",
    "10월": "10월의 ${currentCategory.name}은...",
    "11월": "11월의 ${currentCategory.name}은...",
    "12월": "12월의 ${currentCategory.name}은..."
  }
}

**중요**: 
- 반드시 유효한 JSON 형식으로만 응답해주세요!
- 모든 내용은 **${currentCategory.name}(${currentCategory.focus})** 관점에서 작성해주세요!
- 다른 운세 카테고리는 언급하지 마세요!`;

  return prompt;
}

module.exports = {
  generateTojeongPrompt
};
