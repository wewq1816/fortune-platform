// engines/utils/yongsin-finder.js
// 용신 찾기

const fiveElementsData = require('../data/five-elements.json');

/**
 * 용신 찾기
 */
function findYongsin(strength, elements, ilgan) {
  const ilganElement = fiveElementsData.천간[ilgan];
  
  if (strength === '신강') {
    // 신강이면 억제: 일간을 극하는 오행
    return fiveElementsData.오행_상극[ilganElement];
  } 
  
  if (strength === '신약') {
    // 신약이면 보강: 일간을 생하는 오행
    const shengElement = Object.keys(fiveElementsData.오행_상생).find(
      key => fiveElementsData.오행_상생[key] === ilganElement
    );
    return shengElement;
  }
  
  // 중화면 부족한 오행
  const minElement = Object.keys(elements).reduce((a, b) => 
    elements[a] < elements[b] ? a : b
  );
  return minElement;
}

module.exports = {
  findYongsin
};
