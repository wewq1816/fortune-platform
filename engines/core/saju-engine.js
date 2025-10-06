// engines/core/saju-engine.js
// 사주팔자 메인 엔진 (모듈 통합)

const sajuCalculator = require('../utils/saju-calculator');
const elementAnalyzer = require('../utils/element-analyzer');
const strengthCalculator = require('../utils/strength-calculator');
const yongsinFinder = require('../utils/yongsin-finder');
const tenStarsCalculator = require('../utils/ten-stars-calculator');

/**
 * 사주팔자 엔진 (통합)
 */
class SajuEngine {
  /**
   * 사주 8글자 계산
   */
  calculateSaju(birthInfo) {
    const { year, month, day, hour, minute = 0 } = birthInfo;

    const yearPillar = sajuCalculator.calculateYearPillar(year);
    const monthPillar = sajuCalculator.calculateMonthPillar(year, month);
    const dayPillar = sajuCalculator.calculateDayPillar(year, month, day);
    const hourPillar = sajuCalculator.calculateHourPillar(dayPillar.cheongan, hour, minute);

    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      ilgan: dayPillar.cheongan
    };
  }

  /**
   * 오행 분포 계산
   */
  calculateElements(saju) {
    return elementAnalyzer.calculateElements(saju);
  }

  /**
   * 신강/신약 판정
   */
  calculateStrength(saju, elements) {
    return strengthCalculator.calculateStrength(saju, elements);
  }

  /**
   * 용신 찾기
   */
  findYongsin(strength, elements, ilgan) {
    return yongsinFinder.findYongsin(strength, elements, ilgan);
  }

  /**
   * 십성 계산
   */
  calculateTenStars(saju) {
    return tenStarsCalculator.calculateTenStars(saju);
  }
}

module.exports = SajuEngine;
