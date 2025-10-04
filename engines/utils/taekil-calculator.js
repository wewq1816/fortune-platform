// 택일 계산 엔진 (좋은 날짜 찾기)

const GOOD_DAYS = {
  // 월별 길일 (간단 버전)
  1: [5, 10, 15, 20, 25],
  2: [3, 8, 13, 18, 23, 28],
  3: [2, 7, 12, 17, 22, 27],
  4: [4, 9, 14, 19, 24, 29],
  5: [1, 6, 11, 16, 21, 26, 31],
  6: [3, 8, 13, 18, 23, 28],
  7: [5, 10, 15, 20, 25, 30],
  8: [2, 7, 12, 17, 22, 27],
  9: [4, 9, 14, 19, 24, 29],
  10: [1, 6, 11, 16, 21, 26, 31],
  11: [3, 8, 13, 18, 23, 28],
  12: [5, 10, 15, 20, 25, 30]
};

const BAD_DAYS = {
  // 월별 흉일 (간단 버전)
  1: [13, 26],
  2: [11, 24],
  3: [14, 27],
  4: [12, 25],
  5: [15, 28],
  6: [13, 26],
  7: [14, 27],
  8: [12, 25],
  9: [13, 26],
  10: [14, 27],
  11: [12, 25],
  12: [13, 26]
};

function calculateTaekil(targetYear, targetMonth, saju, purpose = 'general') {
  const goodDays = GOOD_DAYS[targetMonth] || [];
  const badDays = BAD_DAYS[targetMonth] || [];
  
  const results = [];
  
  goodDays.forEach(day => {
    if (!badDays.includes(day)) {
      const score = calculateScore(day, saju, purpose);
      results.push({
        date: targetYear + '-' + pad(targetMonth) + '-' + pad(day),
        score: score,
        reason: getReasonByScore(score)
      });
    }
  });
  
  return results.sort((a, b) => b.score - a.score);
}

function calculateScore(day, saju, purpose) {
  let score = 70;
  
  // 일진 체크 (간단 버전)
  if (day % 5 === 0) score += 10;
  if (day % 3 === 0) score += 5;
  
  // 용신과의 관계 (간단 버전)
  if (saju.yongsin) score += 15;
  
  return Math.min(score, 100);
}

function getReasonByScore(score) {
  if (score >= 95) return '대길일';
  if (score >= 85) return '길일';
  if (score >= 70) return '보통';
  return '주의';
}

function pad(num) {
  return String(num).padStart(2, '0');
}

module.exports = { calculateTaekil };
