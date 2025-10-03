const horoscopeData = require('../data/horoscope.json');

function getHoroscopeByDate(month, day) {
  for (const sign of horoscopeData) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) {
        return sign;
      }
    } else {
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      ) {
        return sign;
      }
    }
  }
  return null;
}

function getHoroscopeFortune(month, day) {
  const sign = getHoroscopeByDate(month, day);
  
  if (!sign) {
    return {
      success: false,
      message: '올바른 생년월일을 입력해주세요.'
    };
  }
  
  const today = new Date();
  const seed = (month * 31 + day + today.getDate()) % 100;
  
  let level = '보통';
  let score = 70;
  
  if (seed > 80) {
    level = '매우 좋음';
    score = 95;
  } else if (seed > 60) {
    level = '좋음';
    score = 85;
  } else if (seed > 40) {
    level = '보통';
    score = 70;
  } else if (seed > 20) {
    level = '주의';
    score = 55;
  } else {
    level = '조심';
    score = 50;
  }
  
  return {
    success: true,
    sign: sign.korean,
    signEn: sign.name,
    symbol: sign.symbol,
    level: level,
    score: score,
    date: today.toISOString().split('T')[0],
    message: `오늘 ${sign.korean}의 운세는 ${level}입니다.`
  };
}

module.exports = {
  getHoroscopeByDate,
  getHoroscopeFortune
};
