// saju-basic-calculator.js
// 프론트엔드용 간단한 사주 계산기 (더미 데이터)

const SajuBasicCalculator = {
  /**
   * 사주 계산 (간단 버전)
   */
  calculate: function(year, month, day, birthTime) {
    // 간지 더미 데이터
    const ganjiList = [
      '갑자', '을축', '병인', '정묘', '무진', '기사', '경오', '신미', '임신', '계유',
      '갑술', '을해', '병자', '정축', '무인', '기묘', '경진', '신사', '임오', '계미',
      '갑신', '을유', '병술', '정해', '무자', '기축', '경인', '신묘', '임진', '계사',
      '갑오', '을미', '병신', '정유', '무술', '기해', '경자', '신축', '임인', '계묘',
      '갑진', '을사', '병오', '정미', '무신', '기유', '경술', '신해', '임자', '계축',
      '갑인', '을묘', '병진', '정사', '무오', '기미', '경신', '신유', '임술', '계해'
    ];

    // 년주 계산 (간단)
    const yearIndex = (year - 4) % 60;
    const yearGanji = ganjiList[yearIndex];

    // 월주 계산 (간단)
    const monthIndex = (month - 1 + year * 2) % 60;
    const monthGanji = ganjiList[monthIndex];

    // 일주 계산 (간단)
    const dayIndex = (year * 365 + month * 30 + day) % 60;
    const dayGanji = ganjiList[dayIndex];

    // 시주 - birthTime에서 추출
    const hourGanji = birthTime.split('(')[0] || '미';

    // 천간/지지 분리
    function splitGanji(ganji) {
      return {
        cheongan: ganji[0],
        jiji: ganji[1],
        hanja: ganji
      };
    }

    const saju = {
      year: splitGanji(yearGanji),
      month: splitGanji(monthGanji),
      day: splitGanji(dayGanji),
      hour: { cheongan: '정', jiji: hourGanji, hanja: '정' + hourGanji }
    };

    // 오행 계산 (간단)
    const elements = this.calculateElements(saju);

    // 신강/신약 (간단)
    const strength = elements.화 >= 3 ? '신강' : '신약';

    // 용신 (간단)
    const yongsin = strength === '신강' ? '금' : '화';

    // 십성 (더미)
    const tenStars = {
      year: { cheongan: '비견', jiji: '편인', cheonganStar: '비견', jijiStar: '편인' },
      month: { cheongan: '비견', jiji: '편재', cheonganStar: '비견', jijiStar: '편재' },
      day: { cheongan: '일간', jiji: '비견', cheonganStar: '일간', jijiStar: '비견' },
      hour: { cheongan: '겁재', jiji: '식신', cheonganStar: '겁재', jijiStar: '식신' }
    };

    return {
      saju,
      elements,
      strength,
      yongsin,
      tenStars
    };
  },

  /**
   * 오행 계산
   */
  calculateElements: function(saju) {
    const elementMap = {
      '갑': '목', '을': '목',
      '병': '화', '정': '화',
      '무': '토', '기': '토',
      '경': '금', '신': '금',
      '임': '수', '계': '수',
      '자': '수', '축': '토', '인': '목', '묘': '목', '진': '토', '사': '화',
      '오': '화', '미': '토', '신': '금', '유': '금', '술': '토', '해': '수'
    };

    const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

    // 천간 4개
    [saju.year, saju.month, saju.day, saju.hour].forEach(pillar => {
      const el = elementMap[pillar.cheongan];
      if (el) elements[el]++;
    });

    // 지지 4개
    [saju.year, saju.month, saju.day, saju.hour].forEach(pillar => {
      const el = elementMap[pillar.jiji[0]]; // 첫 글자만
      if (el) elements[el]++;
    });

    return elements;
  }
};
