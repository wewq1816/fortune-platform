// 사주 확장 엔진 (기존 엔진 + 새 기능 통합)

const sajuEngine = require('./saju-engine');
const { calculateDaeun } = require('../utils/daeun-calculator');
const { calculateSinsal } = require('../utils/sinsal-calculator');
const { calculateTaekil } = require('../utils/taekil-calculator');

class SajuEngineExtended {
  // 기존 엔진의 모든 기능 포함
  calculateBasic(birthYear, birthMonth, birthDay, birthHour, isLunar = false) {
    return sajuEngine.calculate(birthYear, birthMonth, birthDay, birthHour, isLunar);
  }
  
  // 대운 계산
  calculateDaeun(birthYear, birthMonth, birthDay, birthHour, gender, isLunar = false) {
    return calculateDaeun(birthYear, birthMonth, birthDay, birthHour, gender, isLunar);
  }
  
  // 신살 계산
  calculateSinsal(saju) {
    return calculateSinsal(saju);
  }
  
  // 택일 계산
  calculateTaekil(targetYear, targetMonth, saju, purpose = 'general') {
    return calculateTaekil(targetYear, targetMonth, saju, purpose);
  }
  
  // 전체 계산 (기존 + 확장)
  calculateAll(birthYear, birthMonth, birthDay, birthHour, gender, isLunar = false) {
    const basic = this.calculateBasic(birthYear, birthMonth, birthDay, birthHour, isLunar);
    const daeun = this.calculateDaeun(birthYear, birthMonth, birthDay, birthHour, gender, isLunar);
    const sinsal = this.calculateSinsal(basic.saju);
    
    return {
      ...basic,
      daeun: daeun,
      sinsal: sinsal
    };
  }
}

module.exports = new SajuEngineExtended();
