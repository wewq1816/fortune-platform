/**
 * 별자리 경계 계산 유틸리티
 * 
 * 24절기 데이터를 기반으로 12별자리의 정확한 경계를 계산합니다.
 * 
 * 원리:
 * - 춘분점(황경 0도) = 양자리 시작
 * - 30도 간격으로 12개 별자리 구분
 * - 춘분, 하지, 추분, 동지 4대 절기 사용
 */

const solarTermsData = require('../data/solar-terms.json');

/**
 * 특정 연도의 4대 절기 데이터 가져오기
 * @param {number} year - 연도
 * @returns {object|null} 절기 데이터 또는 null
 */
function getSolarTerms(year) {
  const yearStr = String(year);
  return solarTermsData.years[yearStr] || null;
}

/**
 * 별자리 경계 시각을 Date 객체로 변환
 * @param {number} year - 연도
 * @param {object} termData - 절기 데이터 {month, day, hour, minute}
 * @returns {Date} Date 객체
 */
function termToDate(year, termData) {
  return new Date(year, termData.month - 1, termData.day, termData.hour, termData.minute);
}

/**
 * 특정 연도의 12별자리 경계 계산
 * @param {number} year - 연도
 * @returns {Array} 12별자리 경계 배열
 */
function calculateZodiacBoundaries(year) {
  const terms = getSolarTerms(year);
  const prevTerms = getSolarTerms(year - 1); // 전년도 동지 필요 (물고기자리)
  
  if (!terms) {
    // 데이터 없으면 기본값 반환 (고정 날짜)
    return getDefaultBoundaries(year);
  }

  // 4대 절기를 Date 객체로 변환
  const springEquinox = termToDate(year, terms['춘분']); // 양자리 시작 (황경 0도)
  const summerSolstice = termToDate(year, terms['하지']); // 게자리 시작 (황경 90도)
  const autumnEquinox = termToDate(year, terms['추분']); // 천칭자리 시작 (황경 180도)
  const winterSolstice = termToDate(year, terms['동지']); // 염소자리 시작 (황경 270도)
  
  // 전년도 동지 (물고기자리 계산용)
  const prevWinterSolstice = prevTerms ? termToDate(year - 1, prevTerms['동지']) : new Date(year - 1, 11, 22)

  // 각 별자리 구간은 약 30.44일 (365.25일 / 12)
  const avgDaysPerSign = 365.25 / 12;
  const msPerDay = 24 * 60 * 60 * 1000;
  const msPerSign = avgDaysPerSign * msPerDay;

  return [
    // 1. 양자리 (춘분 ~ 춘분+30도)
    { 
      id: 1, 
      name: 'Aries', 
      korean: '양자리',
      startDate: springEquinox,
      endDate: new Date(springEquinox.getTime() + msPerSign)
    },
    // 2. 황소자리 (황경 30도 ~ 60도)
    { 
      id: 2, 
      name: 'Taurus', 
      korean: '황소자리',
      startDate: new Date(springEquinox.getTime() + msPerSign),
      endDate: new Date(springEquinox.getTime() + msPerSign * 2)
    },
    // 3. 쌍둥이자리 (황경 60도 ~ 90도, 하지 직전)
    { 
      id: 3, 
      name: 'Gemini', 
      korean: '쌍둥이자리',
      startDate: new Date(springEquinox.getTime() + msPerSign * 2),
      endDate: summerSolstice
    },
    // 4. 게자리 (하지 ~ 하지+30도)
    { 
      id: 4, 
      name: 'Cancer', 
      korean: '게자리',
      startDate: summerSolstice,
      endDate: new Date(summerSolstice.getTime() + msPerSign)
    },
    // 5. 사자자리 (황경 120도 ~ 150도)
    { 
      id: 5, 
      name: 'Leo', 
      korean: '사자자리',
      startDate: new Date(summerSolstice.getTime() + msPerSign),
      endDate: new Date(summerSolstice.getTime() + msPerSign * 2)
    },
    // 6. 처녀자리 (황경 150도 ~ 180도, 추분 직전)
    { 
      id: 6, 
      name: 'Virgo', 
      korean: '처녀자리',
      startDate: new Date(summerSolstice.getTime() + msPerSign * 2),
      endDate: autumnEquinox
    },
    // 7. 천칭자리 (추분 ~ 추분+30도)
    { 
      id: 7, 
      name: 'Libra', 
      korean: '천칭자리',
      startDate: autumnEquinox,
      endDate: new Date(autumnEquinox.getTime() + msPerSign)
    },
    // 8. 전갈자리 (황경 210도 ~ 240도)
    { 
      id: 8, 
      name: 'Scorpio', 
      korean: '전갈자리',
      startDate: new Date(autumnEquinox.getTime() + msPerSign),
      endDate: new Date(autumnEquinox.getTime() + msPerSign * 2)
    },
    // 9. 사수자리 (황경 240도 ~ 270도, 동지 직전)
    { 
      id: 9, 
      name: 'Sagittarius', 
      korean: '사수자리',
      startDate: new Date(autumnEquinox.getTime() + msPerSign * 2),
      endDate: winterSolstice
    },
    // 10. 염소자리 (동지 ~ 동지+30도)
    { 
      id: 10, 
      name: 'Capricorn', 
      korean: '염소자리',
      startDate: winterSolstice,
      endDate: new Date(winterSolstice.getTime() + msPerSign)
    },
    // 11. 물병자리 (황경 300도 ~ 330도)
    { 
      id: 11, 
      name: 'Aquarius', 
      korean: '물병자리',
      startDate: new Date(winterSolstice.getTime() + msPerSign),
      endDate: new Date(winterSolstice.getTime() + msPerSign * 2)
    },
    // 12. 물고기자리 (황경 330도 ~ 360도/0도, 춘분 직전)
    // 주의: 전년도 동지 기준으로 계산 (연도를 넘어감)
    { 
      id: 12, 
      name: 'Pisces', 
      korean: '물고기자리',
      startDate: new Date(prevWinterSolstice.getTime() + msPerSign * 2),
      endDate: springEquinox
    }
  ];
}

/**
 * 기본 별자리 경계 (절기 데이터 없을 때)
 * @param {number} year - 연도
 * @returns {Array} 기본 경계 배열
 */
function getDefaultBoundaries(year) {
  return [
    { id: 1, name: 'Aries', korean: '양자리', 
      startDate: new Date(year, 2, 21), endDate: new Date(year, 3, 19) },
    { id: 2, name: 'Taurus', korean: '황소자리', 
      startDate: new Date(year, 3, 20), endDate: new Date(year, 4, 20) },
    { id: 3, name: 'Gemini', korean: '쌍둥이자리', 
      startDate: new Date(year, 4, 21), endDate: new Date(year, 5, 21) },
    { id: 4, name: 'Cancer', korean: '게자리', 
      startDate: new Date(year, 5, 22), endDate: new Date(year, 6, 22) },
    { id: 5, name: 'Leo', korean: '사자자리', 
      startDate: new Date(year, 6, 23), endDate: new Date(year, 7, 22) },
    { id: 6, name: 'Virgo', korean: '처녀자리', 
      startDate: new Date(year, 7, 23), endDate: new Date(year, 8, 23) },
    { id: 7, name: 'Libra', korean: '천칭자리', 
      startDate: new Date(year, 8, 24), endDate: new Date(year, 9, 22) },
    { id: 8, name: 'Scorpio', korean: '전갈자리', 
      startDate: new Date(year, 9, 23), endDate: new Date(year, 10, 22) },
    { id: 9, name: 'Sagittarius', korean: '사수자리', 
      startDate: new Date(year, 10, 23), endDate: new Date(year, 11, 24) },
    { id: 10, name: 'Capricorn', korean: '염소자리', 
      startDate: new Date(year, 11, 25), endDate: new Date(year + 1, 0, 19) },
    { id: 11, name: 'Aquarius', korean: '물병자리', 
      startDate: new Date(year, 0, 20), endDate: new Date(year, 1, 18) },
    { id: 12, name: 'Pisces', korean: '물고기자리', 
      startDate: new Date(year, 1, 19), endDate: new Date(year, 2, 20) }
  ];
}

/**
 * 생년월일시로 별자리 찾기 (절기 기반)
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @param {number} day - 일 (1-31)
 * @param {number} hour - 시 (0-23, 선택)
 * @param {number} minute - 분 (0-59, 선택)
 * @returns {object|null} 별자리 정보
 */
function getZodiacSign(year, month, day, hour = 12, minute = 0) {
  // 1~2월은 전년도 동지부터 시작할 수 있으므로 전년도 경계도 확인
  const actualYear = (month <= 2) ? year : year;
  const prevYear = year - 1;
  
  const boundaries = calculateZodiacBoundaries(actualYear);
  const prevBoundaries = (month <= 2) ? calculateZodiacBoundaries(prevYear) : null;
  
  const birthDate = new Date(year, month - 1, day, hour, minute);

  // 1~2월인 경우 전년도 물고기자리 먼저 확인
  if (month <= 2 && prevBoundaries) {
    const prevPisces = prevBoundaries.find(s => s.id === 12);
    if (prevPisces && birthDate >= prevPisces.startDate && birthDate < prevPisces.endDate) {
      return prevPisces;
    }
  }

  // 별자리 찾기
  for (const sign of boundaries) {
    if (birthDate >= sign.startDate && birthDate < sign.endDate) {
      return sign;
    }
  }

  return null;
}

module.exports = {
  getSolarTerms,
  calculateZodiacBoundaries,
  getZodiacSign,
  getDefaultBoundaries
};
