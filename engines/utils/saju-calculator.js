// engines/utils/saju-calculator.js
// 사주 8글자 계산 (년월일시주)

const ganziData = require('../data/ganzi-60.json');

/**
 * 년주 계산
 */
function calculateYearPillar(year) {
  const baseYear = 1984;
  const baseIndex = 0; // 갑자 = 0
  
  const index = (year - baseYear + baseIndex) % 60;
  const ganzi = ganziData[index < 0 ? index + 60 : index];
  
  return {
    cheongan: ganzi.cheongan,
    jiji: ganzi.jiji,
    hanja: `${ganzi.cheongan}${ganzi.jiji}`
  };
}

/**
 * 월주 계산
 */
function calculateMonthPillar(year, month) {
  const monthJiji = ['인', '묘', '진', '사', '오', '미', '신', '유', '술', '해', '자', '축'];
  const jiji = monthJiji[month - 1];
  
  const pattern = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const cheongan = pattern[(month - 1) % 10];
  
  return {
    cheongan: cheongan,
    jiji: jiji,
    hanja: `${cheongan}${jiji}`
  };
}

/**
 * 일주 계산
 */
function calculateDayPillar(year, month, day) {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  const index = diffDays % 60;
  
  const ganzi = ganziData[index < 0 ? index + 60 : index];
  
  return {
    cheongan: ganzi.cheongan,
    jiji: ganzi.jiji,
    hanja: `${ganzi.cheongan}${ganzi.jiji}`
  };
}

/**
 * 시주 계산
 */
function calculateHourPillar(dayCheongan, hour) {
  const jiji = hour;
  
  const pattern = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const jiji12 = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const hourIndex = jiji12.indexOf(hour);
  const cheongan = pattern[hourIndex % 10];
  
  return {
    cheongan: cheongan,
    jiji: jiji,
    hanja: `${cheongan}${jiji}`
  };
}

module.exports = {
  calculateYearPillar,
  calculateMonthPillar,
  calculateDayPillar,
  calculateHourPillar
};
