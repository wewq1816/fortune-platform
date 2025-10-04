// saju-basic-calculator.js
// 기존 사주 8글자, 오행, 신강/신약, 용신 계산

const SajuBasicCalculator = {
  // 오행 데이터
  elements: {
    cheongan: {'갑':'목','을':'목','병':'화','정':'화','무':'토','기':'토','경':'금','신':'금','임':'수','계':'수'},
    jiji: {'자':'수','축':'토','인':'목','묘':'목','진':'토','사':'화','오':'화','미':'토','신':'금','유':'금','술':'토','해':'수'}
  },

  // 월 지지 매핑
  monthJiji: ['인','묘','진','사','오','미','신','유','술','해','자','축'],

  // 시간에서 지지 추출
  extractHourJiji(birthTime) {
    const match = birthTime.match(/^(.)/);
    return match ? match[1] : '미';
  },

  // 월 지지 가져오기
  getMonthJiji(month) {
    return this.monthJiji[month - 1];
  },

  // 간단한 사주 계산 (Mock)
  calculateSaju(year, month, day, birthTime) {
    const yearGanzi = {cheongan: '갑', jiji: '자', hanja: '갑자'};
    const monthGanzi = {cheongan: '경', jiji: this.getMonthJiji(month), hanja: `경${this.getMonthJiji(month)}`};
    const dayGanzi = {cheongan: '신', jiji: '묘', hanja: '신묘'};
    const hourJiji = this.extractHourJiji(birthTime);
    const hourGanzi = {cheongan: '신', jiji: hourJiji, hanja: `신${hourJiji}`};

    return {
      year: yearGanzi,
      month: monthGanzi,
      day: dayGanzi,
      hour: hourGanzi,
      ilgan: dayGanzi.cheongan
    };
  },

  // 오행 계산
  calculateElements(saju) {
    const count = {목: 0, 화: 0, 토: 0, 금: 0, 수: 0};
    const pillars = [saju.year, saju.month, saju.day, saju.hour];
    
    pillars.forEach(ganzi => {
      const chEl = this.elements.cheongan[ganzi.cheongan];
      const jiEl = this.elements.jiji[ganzi.jiji];
      if (chEl) count[chEl]++;
      if (jiEl) count[jiEl]++;
    });
    
    return count;
  },

  // 신강/신약 판정
  calculateStrength(elementsCount, ilgan) {
    const ilganEl = this.elements.cheongan[ilgan];
    const same = elementsCount[ilganEl];
    return same >= 3 ? '신강' : '신약';
  },

  // 용신 찾기
  findYongsin(elementsCount) {
    const min = Object.keys(elementsCount).reduce((a, b) => 
      elementsCount[a] < elementsCount[b] ? a : b
    );
    return min;
  },

  // 전체 계산
  calculate(year, month, day, birthTime) {
    const saju = this.calculateSaju(year, month, day, birthTime);
    const elementsCount = this.calculateElements(saju);
    const strength = this.calculateStrength(elementsCount, saju.ilgan);
    const yongsin = this.findYongsin(elementsCount);

    // 십성 계산 추가
    const tenStars = typeof TenStarsCalculator !== 'undefined' 
      ? TenStarsCalculator.calculate(saju, saju.ilgan)
      : null;

    return {
      saju: saju,
      elements: elementsCount,
      strength: strength,
      yongsin: yongsin,
      ilgan: saju.ilgan,
      tenStars: tenStars
    };
  }
};
