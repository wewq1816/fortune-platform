const {Solar, Lunar} = require('lunar-javascript');

/**
 * 천간 (10개)
 */
const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const CHEONGAN_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/**
 * 지지 (12개)
 */
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const JIJI_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 천간 오행 매핑
 */
const CHEONGAN_ELEMENT = {
  '갑': '목', '을': '목',
  '병': '화', '정': '화',
  '무': '토', '기': '토',
  '경': '금', '신': '금',
  '임': '수', '계': '수'
};

/**
 * 지지 오행 매핑
 */
const JIJI_ELEMENT = {
  '자': '수', '해': '수',
  '인': '목', '묘': '목',
  '사': '화', '오': '화',
  '신': '금', '유': '금',
  '축': '토', '진': '토', '미': '토', '술': '토'
};

/**
 * 간지 문자열을 한글/한자로 변환
 */
function parseGanzhi(ganzhiStr) {
  // 간지 문자열 예: "庚午" 또는 "己卯"
  const ganIdx = CHEONGAN_HANJA.indexOf(ganzhiStr[0]);
  const zhiIdx = JIJI_HANJA.indexOf(ganzhiStr[1]);
  
  if (ganIdx === -1 || zhiIdx === -1) {
    return null;
  }
  
  const cheongan = CHEONGAN[ganIdx];
  const jiji = JIJI[zhiIdx];
  
  return {
    korean: cheongan + jiji,
    hanja: ganzhiStr,
    cheongan: cheongan,
    jiji: jiji,
    cheonganHanja: ganzhiStr[0],
    jijiHanja: ganzhiStr[1],
    cheonganElement: CHEONGAN_ELEMENT[cheongan],
    jijiElement: JIJI_ELEMENT[jiji]
  };
}

/**
 * 사주팔자 계산 (메인 함수)
 */
function calculateSaju(birthInfo) {
  const { year, month, day, hour = 12, isLunar = false } = birthInfo;
  
  let solar;
  
  try {
    // 양력/음력에 따라 Solar 객체 생성
    if (isLunar) {
      const lunar = Lunar.fromYmd(year, month, day);
      solar = lunar.getSolar();
    } else {
      solar = Solar.fromYmd(year, month, day);
    }
    
    const lunar = solar.getLunar();
    
    // 년주, 월주, 일주
    const yearGanzhi = lunar.getYearInGanZhi();
    const monthGanzhi = lunar.getMonthInGanZhi();
    const dayGanzhi = lunar.getDayInGanZhi();
    
    // 사주팔자 (BaZi) - 시주 포함
    const baZi = lunar.getEightChar();
    const baZiStr = baZi.toString(); // "庚午 己卯 己卯 甲子"
    const baZiParts = baZiStr.split(' ');
    
    // 시주는 baZi의 네번째 항목
    const hourGanzhi = baZiParts[3];
    
    // 각 주 파싱
    const yearColumn = parseGanzhi(yearGanzhi);
    const monthColumn = parseGanzhi(monthGanzhi);
    const dayColumn = parseGanzhi(dayGanzhi);
    const hourColumn = parseGanzhi(hourGanzhi);
    
    // 일간 (나를 나타내는 글자)
    const ilgan = dayColumn.cheongan;
    const ilganElement = CHEONGAN_ELEMENT[ilgan];
    
    return {
      success: true,
      
      // 기본 정보
      birthDate: {
        year: solar.getYear(),
        month: solar.getMonth(),
        day: solar.getDay(),
        hour: hour,
        isLunar: isLunar
      },
      
      // 사주 4주
      yearColumn: yearColumn,    // 년주
      monthColumn: monthColumn,  // 월주
      dayColumn: dayColumn,      // 일주
      hourColumn: hourColumn,    // 시주
      
      // 일간 (핵심)
      ilgan: ilgan,
      ilganHanja: dayColumn.cheonganHanja,
      ilganElement: ilganElement,
      
      // 8글자 문자열
      sajuString: `${yearColumn.korean} ${monthColumn.korean} ${dayColumn.korean} ${hourColumn.korean}`,
      sajuHanja: `${yearColumn.hanja} ${monthColumn.hanja} ${dayColumn.hanja} ${hourColumn.hanja}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: '사주 계산 중 오류가 발생했습니다.'
    };
  }
}

module.exports = {
  calculateSaju,
  CHEONGAN,
  JIJI,
  CHEONGAN_ELEMENT,
  JIJI_ELEMENT
};
