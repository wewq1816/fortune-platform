// engines/utils/strength-calculator.js
// 신강/신약 판정

const fiveElementsData = require('../data/five-elements.json');

/**
 * 신강/신약 판정
 */
function calculateStrength(saju, elements) {
  const ilgan = saju.ilgan;
  const ilganElement = fiveElementsData.천간[ilgan];
  
  // 일간과 같은 오행 개수
  const sameElement = elements[ilganElement];
  
  // 일간을 생하는 오행 찾기
  const shengElement = Object.keys(fiveElementsData.오행_상생).find(
    key => fiveElementsData.오행_상생[key] === ilganElement
  );
  const supportElement = elements[shengElement] || 0;
  
  const strength = sameElement + supportElement;
  
  if (strength >= 4) return '신강';
  if (strength <= 2) return '신약';
  return '중화';
}

module.exports = {
  calculateStrength
};
