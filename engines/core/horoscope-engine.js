const horoscopeData = require('../data/horoscope.json');
const horoscopeTraits = require('../data/horoscope-traits.json');
const { getZodiacSign } = require('../utils/zodiac-calculator');

/**
 * 생년월일로 별자리 찾기 (구버전 - 하위 호환용)
 * @param {number} month - 월 (1-12)
 * @param {number} day - 일 (1-31)
 * @returns {object|null} 별자리 정보 또는 null
 * @deprecated 절기 계산 없이 고정 날짜만 사용. getHoroscopeByDatePrecise() 사용 권장
 */
function getHoroscopeByDate(month, day) {
  for (const sign of horoscopeData) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) {
        return sign;
      }
    } else {
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      ) {
        return sign;
      }
    }
  }
  return null;
}

/**
 * 생년월일시로 별자리 찾기 (정밀 - 절기 계산 기반)
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @param {number} day - 일 (1-31)
 * @param {number} hour - 시 (0-23, 선택, 기본값: 12)
 * @param {number} minute - 분 (0-59, 선택, 기본값: 0)
 * @returns {object|null} 별자리 정보 또는 null
 */
function getHoroscopeByDatePrecise(year, month, day, hour = 12, minute = 0) {
  const zodiacSign = getZodiacSign(year, month, day, hour, minute);
  
  if (!zodiacSign) {
    return null;
  }

  // zodiac-calculator의 결과를 horoscope.json 형식으로 변환
  const sign = horoscopeData.find(s => s.korean === zodiacSign.korean);
  
  return sign || null;
}

/**
 * 별자리별 특성 데이터 가져오기
 * @param {string} signName - 별자리 이름 (예: "양자리")
 * @returns {object|null} 특성 데이터 또는 null
 */
function getTraitsBySign(signName) {
  return horoscopeTraits.find(trait => trait.sign === signName) || null;
}

/**
 * 별자리별 특성 기반 운세 점수 계산
 * @param {object} traits - 별자리 특성 데이터
 * @param {number} month - 월
 * @param {number} day - 일
 * @returns {object} {level, score}
 */
function calculateFortuneScore(traits, month, day) {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
  
  // 1. 기본 점수 (별자리별 고유 점수)
  let score = traits.baseScore;
  
  // 2. 행운의 날 보너스 (+10점)
  if (traits.luckyDays.includes(dayOfMonth)) {
    score += 10;
  }
  
  // 3. 요일별 가중치 (별자리마다 다름)
  const weeklyBonus = traits.weeklyPattern[dayOfWeek] || 5;
  score += weeklyBonus;
  
  // 4. 생일 보너스 (생년월일 월/일과 오늘 날짜 근접도)
  const birthDayDiff = Math.abs(dayOfMonth - day);
  if (birthDayDiff <= 3) {
    score += (4 - birthDayDiff) * 2; // 0일차: +8, 1일차: +6, 2일차: +4, 3일차: +2
  }
  
  // 5. 변동성 적용 (별자리별 다름)
  let variation = 0;
  if (traits.volatility === '높음') {
    variation = ((dayOfMonth + day) % 15) - 7; // -7 ~ +7
  } else if (traits.volatility === '중간') {
    variation = ((dayOfMonth + day) % 11) - 5; // -5 ~ +5
  } else { // 낮음
    variation = ((dayOfMonth + day) % 7) - 3; // -3 ~ +3
  }
  score += variation;
  
  // 6. 점수 범위 제한 (50-100)
  score = Math.max(50, Math.min(100, score));
  
  // 7. 등급 결정
  let level = '보통';
  if (score >= 90) {
    level = '매우 좋음';
  } else if (score >= 80) {
    level = '좋음';
  } else if (score >= 70) {
    level = '보통';
  } else if (score >= 60) {
    level = '주의';
  } else {
    level = '조심';
  }
  
  return { level, score };
}

/**
 * 별자리 운세 조회 (메인 함수)
 * @param {number} month - 월 (1-12)
 * @param {number} day - 일 (1-31)
 * @param {number} year - 연도 (선택, 기본값: 현재년도)
 * @param {number} hour - 시 (선택, 기본값: 12)
 * @param {number} minute - 분 (선택, 기본값: 0)
 * @returns {object} 운세 결과
 */
function getHoroscopeFortune(month, day, year = null, hour = 12, minute = 0) {
  // 연도가 없으면 현재 연도 사용
  if (!year) {
    year = new Date().getFullYear();
  }

  // 1. 별자리 찾기 (절기 기반 정밀 계산)
  let sign = getHoroscopeByDatePrecise(year, month, day, hour, minute);
  
  // 절기 데이터가 없으면 기본 방식 사용
  if (!sign) {
    sign = getHoroscopeByDate(month, day);
  }
  
  if (!sign) {
    return {
      success: false,
      message: '올바른 생년월일을 입력해주세요.'
    };
  }
  
  // 2. 별자리 특성 가져오기
  const traits = getTraitsBySign(sign.korean);
  
  if (!traits) {
    // 특성 데이터가 없으면 기본 방식으로 계산
    const today = new Date();
    const seed = (month * 31 + day + today.getDate()) % 100;
    
    let level = '보통';
    let score = 70;
    
    if (seed > 80) {
      level = '매우 좋음';
      score = 95;
    } else if (seed > 60) {
      level = '좋음';
      score = 85;
    } else if (seed > 40) {
      level = '보통';
      score = 70;
    } else if (seed > 20) {
      level = '주의';
      score = 55;
    } else {
      level = '조심';
      score = 50;
    }
    
    return {
      success: true,
      sign: sign.korean,
      signEn: sign.name,
      symbol: sign.symbol,
      level: level,
      score: score,
      date: today.toISOString().split('T')[0],
      message: `오늘 ${sign.korean}의 운세는 ${level}입니다.`
    };
  }
  
  // 3. 특성 기반 점수 계산
  const today = new Date();
  const fortune = calculateFortuneScore(traits, month, day);
  
  // 4. 결과 반환
  return {
    success: true,
    sign: sign.korean,
    signEn: sign.name,
    symbol: sign.symbol,
    level: fortune.level,
    score: fortune.score,
    date: today.toISOString().split('T')[0],
    message: `오늘 ${sign.korean}의 운세는 ${fortune.level}입니다.`,
    traits: {
      element: traits.element,
      quality: traits.quality,
      luckyNumbers: traits.luckyNumbers,
      personality: traits.personality
    }
  };
}

module.exports = {
  getHoroscopeByDate,
  getHoroscopeByDatePrecise,
  getTraitsBySign,
  calculateFortuneScore,
  getHoroscopeFortune
};
