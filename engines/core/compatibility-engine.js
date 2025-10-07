/**
 * 궁합 계산 엔진
 * 
 * 기능:
 * - 띠 계산 (생년월일 → 12띠)
 * - 일주 계산 (년월일 → 일간/일지)
 * - 오행 매핑 (띠 → 오행, 일간 → 오행)
 * - 오행 상생상극 점수 계산
 * - 타입별 가중치 적용
 * - 최종 궁합 점수 및 레벨 판정
 */

const { calculateDayPillar } = require('../utils/saju-calculator');

// 12띠 배열
const zodiacAnimals = [
  '쥐', '소', '호랑이', '토끼', 
  '용', '뱀', '말', '양', 
  '원숭이', '닭', '개', '돼지'
];

// 띠별 오행 매핑
const zodiacElements = {
  '쥐': '수(水)',
  '소': '토(土)',
  '호랑이': '목(木)',
  '토끼': '목(木)',
  '용': '토(土)',
  '뱀': '화(火)',
  '말': '화(火)',
  '양': '토(土)',
  '원숭이': '금(金)',
  '닭': '금(金)',
  '개': '토(土)',
  '돼지': '수(水)'
};

// 천간 오행 매핑 (일간 → 오행)
const cheonganElements = {
  '갑': '목(木)',
  '을': '목(木)',
  '병': '화(火)',
  '정': '화(火)',
  '무': '토(土)',
  '기': '토(土)',
  '경': '금(金)',
  '신': '금(金)',
  '임': '수(水)',
  '계': '수(水)'
};

// 오행 한글-영문 매핑
const elementMap = {
  '수(水)': '수',
  '목(木)': '목',
  '화(火)': '화',
  '토(土)': '토',
  '금(金)': '금'
};

/**
 * 생년월일로 띠 계산
 * @param {number} year - 출생 연도
 * @returns {string} 띠 이름
 */
function getZodiacFromYear(year) {
  const index = (year - 4) % 12;
  return zodiacAnimals[index];
}

/**
 * 오행 관계 판단 (상생/상극/비화)
 * @param {string} element1 - 첫 번째 오행 (예: "수(水)")
 * @param {string} element2 - 두 번째 오행
 * @returns {object} { type: '상생/상극/비화', score: 점수 }
 */
function getElementRelationship(element1, element2) {
  const e1 = elementMap[element1];
  const e2 = elementMap[element2];
  
  // 같은 오행 (비화)
  if (e1 === e2) {
    return {
      type: '비화(같은 오행)',
      description: '서로 비슷한 성향으로 이해가 잘 됩니다',
      score: 70
    };
  }
  
  // 상생 관계 (A가 B를 생함)
  const shengRelations = {
    '목': '화',  // 木生火
    '화': '토',  // 火生土
    '토': '금',  // 土生金
    '금': '수',  // 金生水
    '수': '목'   // 水生木
  };
  
  if (shengRelations[e1] === e2) {
    return {
      type: '상생(서로 돕는 관계)',
      description: '첫 번째 분이 두 번째 분을 도와주는 관계입니다',
      score: 95
    };
  }
  
  if (shengRelations[e2] === e1) {
    return {
      type: '피생(도움 받는 관계)',
      description: '두 번째 분이 첫 번째 분을 도와주는 관계입니다',
      score: 85
    };
  }
  
  // 상극 관계 (A가 B를 극함)
  const keRelations = {
    '목': '토',  // 木克土
    '토': '수',  // 土克水
    '수': '화',  // 水克火
    '화': '금',  // 火克金
    '금': '목'   // 金克木
  };
  
  if (keRelations[e1] === e2) {
    return {
      type: '상극(제압하는 관계)',
      description: '첫 번째 분이 주도권을 가지기 쉬운 관계입니다',
      score: 60
    };
  }
  
  if (keRelations[e2] === e1) {
    return {
      type: '피극(제압 받는 관계)',
      description: '두 번째 분이 주도권을 가지기 쉬운 관계입니다',
      score: 50
    };
  }
  
  // 이도 저도 아닌 경우 (기본값)
  return {
    type: '중립',
    description: '특별한 상생상극이 없는 관계입니다',
    score: 65
  };
}

/**
 * 띠 궁합 점수 계산
 * @param {string} zodiac1 - 첫 번째 띠
 * @param {string} zodiac2 - 두 번째 띠
 * @returns {number} 띠 궁합 점수 (0-100)
 */
function getZodiacCompatibilityScore(zodiac1, zodiac2) {
  // 삼합(三合) - 최고의 궁합
  const samhap = [
    ['쥐', '용', '원숭이'],    // 수국삼합
    ['소', '뱀', '닭'],        // 금국삼합
    ['호랑이', '말', '개'],    // 화국삼합
    ['토끼', '양', '돼지']     // 목국삼합
  ];
  
  for (const group of samhap) {
    if (group.includes(zodiac1) && group.includes(zodiac2)) {
      return 95;  // 삼합
    }
  }
  
  // 육합(六合) - 좋은 궁합
  const yukhap = {
    '쥐': '소',
    '소': '쥐',
    '호랑이': '돼지',
    '돼지': '호랑이',
    '토끼': '개',
    '개': '토끼',
    '용': '닭',
    '닭': '용',
    '뱀': '원숭이',
    '원숭이': '뱀',
    '말': '양',
    '양': '말'
  };
  
  if (yukhap[zodiac1] === zodiac2) {
    return 90;  // 육합
  }
  
  // 충(沖) - 나쁜 궁합
  const chung = {
    '쥐': '말',
    '말': '쥐',
    '소': '양',
    '양': '소',
    '호랑이': '원숭이',
    '원숭이': '호랑이',
    '토끼': '닭',
    '닭': '토끼',
    '용': '개',
    '개': '용',
    '뱀': '돼지',
    '돼지': '뱀'
  };
  
  if (chung[zodiac1] === zodiac2) {
    return 45;  // 충
  }
  
  // 형(刑) - 주의 필요
  const hyung = {
    '쥐': '토끼',
    '토끼': '쥐',
    '소': '개',
    '개': '양',
    '양': '소',
    '호랑이': '뱀',
    '뱀': '원숭이',
    '원숭이': '호랑이'
  };
  
  if (hyung[zodiac1] === zodiac2) {
    return 55;  // 형
  }
  
  // 같은 띠
  if (zodiac1 === zodiac2) {
    return 65;  // 보통
  }
  
  // 나머지는 무난한 관계
  return 70;
}

/**
 * 타입별 가중치 (3가지 요소: 일간오행, 띠궁합, 띠오행)
 */
const typeWeights = {
  'lover': { 
    ilganElement: 0.4,  // 일간 오행 (배우자궁 - 가장 중요)
    zodiac: 0.3,         // 띠 궁합
    zodiacElement: 0.3,  // 띠 오행
    name: '연인 궁합',
    icon: '❤️'
  },
  'marriage': { 
    ilganElement: 0.5,  // 결혼은 일간 오행이 더 중요
    zodiac: 0.3,
    zodiacElement: 0.2,
    name: '결혼 궁합',
    icon: '💍'
  },
  'family': { 
    ilganElement: 0.3,
    zodiac: 0.4,
    zodiacElement: 0.3,
    name: '가족 궁합',
    icon: '👨‍👩‍👧‍👦'
  },
  'friend': { 
    ilganElement: 0.2,
    zodiac: 0.5,        // 친구는 띠 궁합이 중요
    zodiacElement: 0.3,
    name: '친구 궁합',
    icon: '👯'
  },
  'business': { 
    ilganElement: 0.5,  // 동업은 일간 오행이 중요
    zodiac: 0.2,
    zodiacElement: 0.3,
    name: '동업 궁합',
    icon: '💼'
  },
  'work': { 
    ilganElement: 0.4,
    zodiac: 0.3,
    zodiacElement: 0.3,
    name: '직장 궁합',
    icon: '🏢'
  }
};

/**
 * 궁합 레벨 판정
 * @param {number} score - 궁합 점수
 * @returns {string} 궁합 레벨
 */
function getCompatibilityLevel(score) {
  if (score >= 90) return '최고의 궁합';
  if (score >= 80) return '매우 좋은 궁합';
  if (score >= 70) return '좋은 궁합';
  if (score >= 60) return '무난한 궁합';
  if (score >= 50) return '노력이 필요한 궁합';
  return '주의가 필요한 궁합';
}

/**
 * 별점 변환 (5점 만점)
 * @param {number} score - 궁합 점수
 * @returns {string} 별 이모지
 */
function getStarRating(score) {
  const stars = Math.round(score / 20);  // 0-5
  const fullStars = '⭐'.repeat(stars);
  const emptyStars = '☆'.repeat(5 - stars);
  return fullStars + emptyStars;
}

/**
 * 메인 궁합 계산 함수
 * @param {object} person1 - { year, month, day }
 * @param {object} person2 - { year, month, day }
 * @param {string} type - 궁합 타입 (lover/marriage/family/friend/business/work)
 * @returns {object} 궁합 결과
 */
function calculateCompatibility(person1, person2, type = 'lover') {
  try {
    // 1. 띠 계산 (년주)
    const zodiac1 = getZodiacFromYear(person1.year);
    const zodiac2 = getZodiacFromYear(person2.year);
    
    // 2. 일주 계산 (년월일)
    const dayPillar1 = calculateDayPillar(person1.year, person1.month, person1.day);
    const dayPillar2 = calculateDayPillar(person2.year, person2.month, person2.day);
    
    const ilgan1 = dayPillar1.cheongan;  // 일간 (배우자궁)
    const ilgan2 = dayPillar2.cheongan;
    
    const ilji1 = dayPillar1.jiji;       // 일지
    const ilji2 = dayPillar2.jiji;
    
    // 3. 오행 계산
    // 일간 오행 (배우자궁 - 가장 중요!)
    const ilganElement1 = cheonganElements[ilgan1];
    const ilganElement2 = cheonganElements[ilgan2];
    
    // 띠 오행
    const zodiacElement1 = zodiacElements[zodiac1];
    const zodiacElement2 = zodiacElements[zodiac2];
    
    // 4. 점수 계산
    // 4-1. 일간 오행 관계 (배우자궁)
    const ilganRelation = getElementRelationship(ilganElement1, ilganElement2);
    const ilganScore = ilganRelation.score;
    
    // 4-2. 띠 궁합 점수
    const zodiacScore = getZodiacCompatibilityScore(zodiac1, zodiac2);
    
    // 4-3. 띠 오행 관계
    const zodiacElementRelation = getElementRelationship(zodiacElement1, zodiacElement2);
    const zodiacElementScore = zodiacElementRelation.score;
    
    // 5. 타입별 가중치 적용 (3가지 요소)
    const weight = typeWeights[type] || typeWeights.lover;
    const finalScore = Math.round(
      ilganScore * weight.ilganElement +           // 일간 오행 (배우자궁)
      zodiacScore * weight.zodiac +                // 띠 궁합
      zodiacElementScore * weight.zodiacElement    // 띠 오행
    );
    
    // 6. 레벨 판정
    const level = getCompatibilityLevel(finalScore);
    const stars = getStarRating(finalScore);
    
    // 7. 결과 반환
    return {
      success: true,
      type: type,
      typeName: weight.name,
      typeIcon: weight.icon,
      score: finalScore,
      level: level,
      stars: stars,
      person1: {
        zodiac: zodiac1,
        zodiacElement: zodiacElement1,
        ilgan: ilgan1,
        ilji: ilji1,
        ilganElement: ilganElement1,
        dayPillar: dayPillar1.hanja,
        year: person1.year,
        month: person1.month,
        day: person1.day
      },
      person2: {
        zodiac: zodiac2,
        zodiacElement: zodiacElement2,
        ilgan: ilgan2,
        ilji: ilji2,
        ilganElement: ilganElement2,
        dayPillar: dayPillar2.hanja,
        year: person2.year,
        month: person2.month,
        day: person2.day
      },
      ilganRelation: {
        type: ilganRelation.type,
        description: ilganRelation.description,
        score: ilganScore
      },
      zodiacRelation: {
        score: zodiacScore,
        description: getZodiacRelationDescription(zodiac1, zodiac2, zodiacScore)
      },
      zodiacElementRelation: {
        type: zodiacElementRelation.type,
        description: zodiacElementRelation.description,
        score: zodiacElementScore
      },
      weights: {
        ilganElement: `${weight.ilganElement * 100}%`,
        zodiac: `${weight.zodiac * 100}%`,
        zodiacElement: `${weight.zodiacElement * 100}%`
      },
      breakdown: {
        ilganScore: ilganScore,
        zodiacScore: zodiacScore,
        zodiacElementScore: zodiacElementScore
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: '궁합 계산 중 오류가 발생했습니다: ' + error.message
    };
  }
}

/**
 * 띠 관계 설명
 */
function getZodiacRelationDescription(zodiac1, zodiac2, score) {
  if (score >= 90) {
    return `${zodiac1}띠와 ${zodiac2}띠는 천생연분입니다`;
  } else if (score >= 70) {
    return `${zodiac1}띠와 ${zodiac2}띠는 서로 잘 맞는 편입니다`;
  } else if (score >= 60) {
    return `${zodiac1}띠와 ${zodiac2}띠는 무난한 관계입니다`;
  } else if (score >= 50) {
    return `${zodiac1}띠와 ${zodiac2}띠는 서로 이해하려는 노력이 필요합니다`;
  } else {
    return `${zodiac1}띠와 ${zodiac2}띠는 신중하게 관계를 발전시켜야 합니다`;
  }
}

module.exports = {
  calculateCompatibility,
  getZodiacFromYear,
  zodiacAnimals,
  zodiacElements,
  typeWeights
};
