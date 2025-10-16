// ten-stars-calculator.js
// 십성(十星) 계산 엔진

const TenStarsCalculator = {
  // 천간 오행
  cheonganElements: {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수'
  },

  // 천간 음양
  cheonganYinYang: {
    '갑': '양', '을': '음',
    '병': '양', '정': '음',
    '무': '양', '기': '음',
    '경': '양', '신': '음',
    '임': '양', '계': '음'
  },

  // 지지 오행
  jijiElements: {
    '자': '수', '축': '토', '인': '목', '묘': '목',
    '진': '토', '사': '화', '오': '화', '미': '토',
    '신': '금', '유': '금', '술': '토', '해': '수'
  },

  // 오행 상생상극 관계
  elementRelations: {
    '목': { 생: '화', 극: '토', 생받음: '수', 극받음: '금' },
    '화': { 생: '토', 극: '금', 생받음: '목', 극받음: '수' },
    '토': { 생: '금', 극: '수', 생받음: '화', 극받음: '목' },
    '금': { 생: '수', 극: '목', 생받음: '토', 극받음: '화' },
    '수': { 생: '목', 극: '화', 생받음: '금', 극받음: '토' }
  },

  // 십성 판단
  getTenStar(ilganElement, ilganYinYang, targetElement, targetYinYang) {
    const relation = this.elementRelations[ilganElement];
    const sameYinYang = ilganYinYang === targetYinYang;

    // 같은 오행
    if (ilganElement === targetElement) {
      return sameYinYang ? '비견' : '겁재';
    }

    // 내가 생하는 오행 (식상)
    if (relation.생 === targetElement) {
      return sameYinYang ? '식신' : '상관';
    }

    // 내가 극하는 오행 (재성)
    if (relation.극 === targetElement) {
      return sameYinYang ? '편재' : '정재';
    }

    // 나를 극하는 오행 (관성)
    if (relation.극받음 === targetElement) {
      return sameYinYang ? '편관' : '정관';
    }

    // 나를 생하는 오행 (인성)
    if (relation.생받음 === targetElement) {
      return sameYinYang ? '편인' : '정인';
    }

    return '미상';
  },

  // 사주 전체 십성 계산
  calculate(saju, ilgan) {
    const ilganElement = this.cheonganElements[ilgan];
    const ilganYinYang = this.cheonganYinYang[ilgan];

    const result = {
      year: {
        cheongan: null,
        cheonganStar: null,
        jiji: null,
        jijiStar: null
      },
      month: {
        cheongan: null,
        cheonganStar: null,
        jiji: null,
        jijiStar: null
      },
      day: {
        cheongan: ilgan,
        cheonganStar: '일간',
        jiji: null,
        jijiStar: null
      },
      hour: {
        cheongan: null,
        cheonganStar: null,
        jiji: null,
        jijiStar: null
      }
    };

    // 년주
    result.year.cheongan = saju.year.cheongan;
    result.year.jiji = saju.year.jiji;
    const yearCheonganElement = this.cheonganElements[saju.year.cheongan];
    const yearCheonganYinYang = this.cheonganYinYang[saju.year.cheongan];
    const yearJijiElement = this.jijiElements[saju.year.jiji];
    result.year.cheonganStar = this.getTenStar(ilganElement, ilganYinYang, yearCheonganElement, yearCheonganYinYang);
    result.year.jijiStar = this.getTenStar(ilganElement, ilganYinYang, yearJijiElement, ilganYinYang);

    // 월주
    result.month.cheongan = saju.month.cheongan;
    result.month.jiji = saju.month.jiji;
    const monthCheonganElement = this.cheonganElements[saju.month.cheongan];
    const monthCheonganYinYang = this.cheonganYinYang[saju.month.cheongan];
    const monthJijiElement = this.jijiElements[saju.month.jiji];
    result.month.cheonganStar = this.getTenStar(ilganElement, ilganYinYang, monthCheonganElement, monthCheonganYinYang);
    result.month.jijiStar = this.getTenStar(ilganElement, ilganYinYang, monthJijiElement, ilganYinYang);

    // 일주 (지지만)
    result.day.jiji = saju.day.jiji;
    const dayJijiElement = this.jijiElements[saju.day.jiji];
    result.day.jijiStar = this.getTenStar(ilganElement, ilganYinYang, dayJijiElement, ilganYinYang);

    // 시주
    result.hour.cheongan = saju.hour.cheongan;
    result.hour.jiji = saju.hour.jiji;
    const hourCheonganElement = this.cheonganElements[saju.hour.cheongan];
    const hourCheonganYinYang = this.cheonganYinYang[saju.hour.cheongan];
    const hourJijiElement = this.jijiElements[saju.hour.jiji];
    result.hour.cheonganStar = this.getTenStar(ilganElement, ilganYinYang, hourCheonganElement, hourCheonganYinYang);
    result.hour.jijiStar = this.getTenStar(ilganElement, ilganYinYang, hourJijiElement, ilganYinYang);

    return result;
  },

  // 십성 개수 세기
  countStars(tenStars) {
    const count = {
      비견: 0, 겁재: 0,
      식신: 0, 상관: 0,
      편재: 0, 정재: 0,
      편관: 0, 정관: 0,
      편인: 0, 정인: 0
    };

    ['year', 'month', 'day', 'hour'].forEach(pillar => {
      const cheonganStar = tenStars[pillar].cheongan;
      const jijiStar = tenStars[pillar].jiji;
      
      if (cheonganStar && cheonganStar !== '일간' && count[cheonganStar] !== undefined) {
        count[cheonganStar]++;
      }
      if (jijiStar && count[jijiStar] !== undefined) {
        count[jijiStar]++;
      }
    });

    return count;
  },

  // 재성 개수 (편재 + 정재)
  getWealthStarsCount(tenStars) {
    const count = this.countStars(tenStars);
    return count.편재 + count.정재;
  },

  // 관성 개수 (편관 + 정관)
  getOfficialStarsCount(tenStars) {
    const count = this.countStars(tenStars);
    return count.편관 + count.정관;
  },

  // 인성 개수 (편인 + 정인)
  getSealStarsCount(tenStars) {
    const count = this.countStars(tenStars);
    return count.편인 + count.정인;
  },

  // 식상 개수 (식신 + 상관)
  getOutputStarsCount(tenStars) {
    const count = this.countStars(tenStars);
    return count.식신 + count.상관;
  },

  // 비겁 개수 (비견 + 겁재)
  getSiblingStarsCount(tenStars) {
    const count = this.countStars(tenStars);
    return count.비견 + count.겁재;
  }
};
