// engines/utils/element-analyzer.js
// 오행 분석

const fiveElementsData = require('../data/five-elements.json');

/**
 * 오행 분포 계산
 */
function calculateElements(saju) {
  const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  
  // 천간 4개
  [saju.year.cheongan, saju.month.cheongan, saju.day.cheongan, saju.hour.cheongan]
    .forEach(ch => {
      const element = fiveElementsData.천간[ch];
      if (element) elements[element]++;
    });
  
  // 지지 4개
  [saju.year.jiji, saju.month.jiji, saju.day.jiji, saju.hour.jiji]
    .forEach(ji => {
      const element = fiveElementsData.지지[ji];
      if (element) elements[element]++;
    });
  
  return elements;
}

/**
 * 오행 상생 관계 찾기
 */
function getShengElement(element) {
  return fiveElementsData.오행_상생[element];
}

/**
 * 오행 상극 관계 찾기
 */
function getKeElement(element) {
  return fiveElementsData.오행_상극[element];
}

module.exports = {
  calculateElements,
  getShengElement,
  getKeElement
};
