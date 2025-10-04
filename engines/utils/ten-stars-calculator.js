// engines/utils/ten-stars-calculator.js
// 십성 계산

const fiveElementsData = require('../data/five-elements.json');
const tenStarsData = require('../data/ten-stars-data.json');

/**
 * 십성 계산
 */
function calculateTenStars(saju) {
  const ilgan = saju.ilgan;
  const ilganElement = fiveElementsData.천간[ilgan];
  const ilganYinYang = fiveElementsData.천간_음양[ilgan];
  
  const result = {};
  
  // 각 주(년월일시)의 천간과 지지에 대해 십성 판정
  ['year', 'month', 'day', 'hour'].forEach(pillar => {
    const cheongan = saju[pillar].cheongan;
    const jiji = saju[pillar].jiji;
    
    result[pillar] = {
      cheongan: getTenStar(ilgan, ilganElement, ilganYinYang, cheongan, '천간'),
      jiji: getTenStar(ilgan, ilganElement, ilganYinYang, jiji, '지지')
    };
  });
  
  return result;
}

/**
 * 개별 글자의 십성 판정
 */
function getTenStar(ilgan, ilganElement, ilganYinYang, targetGanzi, type) {
  const targetElement = type === '천간' 
    ? fiveElementsData.천간[targetGanzi]
    : fiveElementsData.지지[targetGanzi];
    
  const targetYinYang = type === '천간'
    ? fiveElementsData.천간_음양[targetGanzi]
    : fiveElementsData.지지_음양[targetGanzi];
  
  // 같은 오행인가?
  if (ilganElement === targetElement) {
    return ilganYinYang === targetYinYang ? '비견' : '겁재';
  }
  
  // 내가 생하는 오행인가?
  if (fiveElementsData.오행_상생[ilganElement] === targetElement) {
    return ilganYinYang === targetYinYang ? '식신' : '상관';
  }
  
  // 내가 극하는 오행인가?
  if (fiveElementsData.오행_상극[ilganElement] === targetElement) {
    return ilganYinYang === targetYinYang ? '편재' : '정재';
  }
  
  // 나를 극하는 오행인가?
  if (fiveElementsData.오행_상극[targetElement] === ilganElement) {
    return ilganYinYang === targetYinYang ? '편관' : '정관';
  }
  
  // 나를 생하는 오행인가?
  if (fiveElementsData.오행_상생[targetElement] === ilganElement) {
    return ilganYinYang === targetYinYang ? '편인' : '정인';
  }
  
  return '알수없음';
}

module.exports = {
  calculateTenStars
};
