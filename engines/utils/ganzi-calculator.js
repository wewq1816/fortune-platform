const ganziData = require('../data/ganzi-60.json');

/**
 * 오늘의 일진(60갑자) 계산
 * 기준일: 1900년 1월 1일 = 갑자일 (index 0)
 */
function getTodayGanzi(date = new Date()) {
  // 기준일: 1900년 1월 1일 00:00:00 (갑자일)
  const baseDate = new Date(1900, 0, 1);
  
  // 오늘까지 경과한 일수 계산
  const diffTime = date.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 60갑자 중 오늘의 인덱스 (0-59)
  const ganziIndex = diffDays % 60;
  
  // 음수 처리 (과거 날짜 대비)
  const normalizedIndex = ganziIndex < 0 ? ganziIndex + 60 : ganziIndex;
  
  return ganziData[normalizedIndex];
}

/**
 * 특정 날짜의 일진 계산
 */
function getGanziByDate(year, month, day) {
  const date = new Date(year, month - 1, day);
  return getTodayGanzi(date);
}

/**
 * 일진 정보 상세 조회
 */
function getGanziDetail(ganziIndex) {
  if (ganziIndex < 0 || ganziIndex >= 60) {
    throw new Error('갑자 인덱스는 0-59 범위여야 합니다.');
  }
  return ganziData[ganziIndex];
}

/**
 * 한글 이름으로 갑자 찾기
 */
function getGanziByName(koreanName) {
  return ganziData.find(g => g.korean === koreanName);
}

module.exports = {
  getTodayGanzi,
  getGanziByDate,
  getGanziDetail,
  getGanziByName
};
