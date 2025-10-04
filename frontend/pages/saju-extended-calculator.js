// saju-extended-calculator.js
// 대운, 신살, 택일 계산 (브라우저용)

const SajuExtendedCalculator = {
  // 천간, 지지 배열
  CHEONGAN: ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'],
  JIJI: ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'],

  // 대운 계산
  calculateDaeun(birthYear, birthMonth, gender) {
    const isYangYear = birthYear % 2 === 0;
    const isMale = gender === '남성';
    const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);
    
    const monthGanIndex = (birthMonth - 1) % 10;
    const monthJiIndex = (birthMonth - 1) % 12;
    
    const daeunList = [];
    let currentGanIndex = monthGanIndex;
    let currentJiIndex = monthJiIndex;
    
    for (let age = 3; age <= 103; age += 10) {
      if (isForward) {
        currentGanIndex = (currentGanIndex + 1) % 10;
        currentJiIndex = (currentJiIndex + 1) % 12;
      } else {
        currentGanIndex = (currentGanIndex - 1 + 10) % 10;
        currentJiIndex = (currentJiIndex - 1 + 12) % 12;
      }
      
      const ganzi = this.CHEONGAN[currentGanIndex] + this.JIJI[currentJiIndex];
      
      daeunList.push({
        age: age + '-' + (age + 10) + '세',
        ganzi: ganzi,
        cheongan: this.CHEONGAN[currentGanIndex],
        jiji: this.JIJI[currentJiIndex]
      });
    }
    
    return daeunList;
  },

  // 신살 계산
  calculateSinsal(saju) {
    const jijis = [saju.year.jiji, saju.month.jiji, saju.day.jiji, saju.hour.jiji];
    
    const SINSAL_DATA = {
      dohwa: {
        '자': ['묘'], '오': ['묘'], '묘': ['자', '오'], '유': ['자', '오']
      },
      yeokma: {
        '인': ['신'], '오': ['인'], '술': ['신'],
        '신': ['인'], '자': ['신'], '진': ['인'],
        '사': ['해'], '유': ['사'], '축': ['해'],
        '해': ['사'], '묘': ['해'], '미': ['사']
      },
      hwagae: {
        '인': ['술'], '오': ['술'], '술': ['인', '오'],
        '신': ['진'], '자': ['진'], '진': ['신', '자'],
        '사': ['축'], '유': ['축'], '축': ['사', '유'],
        '해': ['미'], '묘': ['미'], '미': ['해', '묘']
      }
    };

    const checkSinsal = (sinsalType) => {
      const data = SINSAL_DATA[sinsalType];
      for (let i = 0; i < jijis.length; i++) {
        const baseJi = jijis[i];
        const targetJis = data[baseJi] || [];
        for (let j = 0; j < jijis.length; j++) {
          if (i !== j && targetJis.includes(jijis[j])) {
            return true;
          }
        }
      }
      return false;
    };

    const cheonEulGuiIn = ['갑', '을', '무', '기'].includes(saju.day.cheongan);

    return {
      dohwa: checkSinsal('dohwa'),
      yeokma: checkSinsal('yeokma'),
      hwagae: checkSinsal('hwagae'),
      cheonEulGuiIn: cheonEulGuiIn
    };
  },

  // 택일 계산
  calculateTaekil(targetYear, targetMonth) {
    const GOOD_DAYS = {
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

    const goodDays = GOOD_DAYS[targetMonth] || [];
    const badDays = BAD_DAYS[targetMonth] || [];
    
    const results = [];
    
    goodDays.forEach(day => {
      if (!badDays.includes(day)) {
        let score = 70;
        if (day % 5 === 0) score += 10;
        if (day % 3 === 0) score += 5;
        
        const reason = score >= 95 ? '대길일' : score >= 85 ? '길일' : '보통';
        const pad = (num) => String(num).padStart(2, '0');
        
        results.push({
          date: targetYear + '-' + pad(targetMonth) + '-' + pad(day),
          score: score,
          reason: reason
        });
      }
    });
    
    return results.sort((a, b) => b.score - a.score);
  }
};
