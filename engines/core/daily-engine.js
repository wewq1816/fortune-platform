const SajuEngine = require('./saju-engine');
const { getTodayGanzi } = require('../utils/ganzi-calculator');
const { calculateFortuneByElements } = require('../utils/element-calculator');

/**
 * 오늘의 운세 계산 (사주 8글자 기반)
 * 
 * @param {Object} birthInfo - 생년월일시 정보
 * @param {number} birthInfo.year - 생년
 * @param {number} birthInfo.month - 생월
 * @param {number} birthInfo.day - 생일
 * @param {number} birthInfo.hour - 태어난 시간 (0-23)
 * @param {number} birthInfo.minute - 태어난 분 (0-59), 기본값 0
 * @param {boolean} birthInfo.isLunar - 음력 여부
 * @param {Date} date - 운세를 볼 날짜 (기본값: 오늘)
 * @returns {Object} 운세 결과
 */
function getDailyFortuneBySaju(birthInfo, date = new Date()) {
  // 1. 사주 8글자 계산
  const sajuEngine = new SajuEngine();
  const saju = sajuEngine.calculateSaju(birthInfo);
  
  if (!saju || !saju.day) {
    return {
      success: false,
      message: '사주 계산에 실패했습니다.'
    };
  }
  
  // 2. 오늘의 일진 계산
  const todayGanzi = getTodayGanzi(date);
  
  // 3. 일간 (나) - day pillar의 천간
  const ilgan = saju.day.cheongan;
  const ilganElement = saju.day.element || '목'; // 기본값
  
  // 4. 오늘 일진의 오행 (천간 우선)
  const ganziElement = todayGanzi.cheongganElement || todayGanzi.jijiElement;
  
  // 5. 오행 상생상극 계산
  const fortune = calculateFortuneByElements(ilganElement, ganziElement);
  
  return {
    success: true,
    
    // 사주 정보
    saju: {
      year: saju.year.hanja,
      month: saju.month.hanja,
      day: saju.day.hanja,
      hour: saju.hour.hanja,
      string: `${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}`,
      ilgan: ilgan,
      ilganElement: ilganElement
    },
    
    // 일진 정보
    today: {
      date: date.toISOString().split('T')[0],
      ganzi: todayGanzi.korean,
      ganziHanja: todayGanzi.hanja,
      cheongan: todayGanzi.cheongan,
      jiji: todayGanzi.jiji,
      element: ganziElement
    },
    
    // 오행 관계
    relationship: fortune.relationship,
    relationshipDesc: fortune.description,
    
    // 운세 점수
    level: fortune.level,
    score: fortune.score,
    
    // 메시지
    message: `일간 ${ilgan}(${ilganElement})과 오늘 일진 ${todayGanzi.cheongan}(${ganziElement})의 관계는 ${fortune.relationship}입니다. ${fortune.description}`
  };
}

module.exports = {
  getDailyFortuneBySaju
};
