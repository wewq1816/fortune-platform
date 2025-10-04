/**
 * 토정비결 계산 엔진
 * 
 * 핵심: 144괘 시스템 (상중하 3괘 조합)
 * Windows 환경 호환
 */

const fs = require('fs');
const path = require('path');

// 태세수 (년 간지)
const TAESE_SOO = {
  '갑자': 1, '을축': 2, '병인': 3, '정묘': 4, '무진': 5, '기사': 6,
  '경오': 7, '신미': 8, '임신': 9, '계유': 10, '갑술': 11, '을해': 12,
  '병자': 1, '정축': 2, '무인': 3, '기묘': 4, '경진': 5, '신사': 6,
  '임오': 7, '계미': 8, '갑신': 9, '을유': 10, '병술': 11, '정해': 12,
  '무자': 1, '기축': 2, '경인': 3, '신묘': 4, '임진': 5, '계사': 6,
  '갑오': 7, '을미': 8, '병신': 9, '정유': 10, '무술': 11, '기해': 12,
  '경자': 1, '신축': 2, '임인': 3, '계묘': 4, '갑진': 5, '을사': 6,
  '병오': 7, '정미': 8, '무신': 9, '기유': 10, '경술': 11, '신해': 12,
  '임자': 1, '계축': 2, '갑인': 3, '을묘': 4, '병진': 5, '정사': 6,
  '무오': 7, '기미': 8, '경신': 9, '신유': 10, '임술': 11, '계해': 12
};

// 월건수
const WOLGUN_SOO = {
  1: 3, 2: 4, 3: 5, 4: 6, 5: 7, 6: 8,
  7: 9, 8: 10, 9: 11, 10: 12, 11: 1, 12: 2
};

// 일진수 (간지 -> 숫자)
const ILJIN_SOO = {
  '갑': 1, '을': 2, '병': 3, '정': 4, '무': 5,
  '기': 6, '경': 7, '신': 8, '임': 9, '계': 10
};

/**
 * 연도의 간지 계산
 */
function getYearGanzi(year) {
  const ganList = ['경', '신', '임', '계', '갑', '을', '병', '정', '무', '기'];
  const jiList = ['신', '유', '술', '해', '자', '축', '인', '묘', '진', '사', '오', '미'];
  
  const ganIndex = year % 10;
  const jiIndex = year % 12;
  
  return ganList[ganIndex] + jiList[jiIndex];
}

/**
 * 월별 일수 계산
 */
function getDaysInMonth(year, month, isLunar = false) {
  if (isLunar) {
    // 음력: 큰달 30일, 작은달 29일 (간단 구현)
    const smallMonths = [4, 6, 9, 11];
    return smallMonths.includes(month) ? 29 : 30;
  } else {
    // 양력
    return new Date(year, month, 0).getDate();
  }
}

/**
 * 144괘 데이터 로드
 */
function loadGuaData() {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'tojeong-gua-144.json');
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('144괘 데이터 로드 실패:', error.message);
    return null;
  }
}

/**
 * 토정비결 메인 계산 함수
 */
function calculateTojeong(birthInfo, targetYear) {
  const { year, month, day, isLunar = false } = birthInfo;
  
  try {
    // 1. 나이 계산
    const age = targetYear - year + 1;
    
    // 2. 연도 간지
    const yearGanzi = getYearGanzi(targetYear);
    const taeseSoo = TAESE_SOO[yearGanzi] || 1;
    
    // 3. 월건수
    const wolgunSoo = WOLGUN_SOO[month] || 1;
    
    // 4. 생일 간지 (간단 계산)
    const dayGan = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'][day % 10];
    const iljinSoo = ILJIN_SOO[dayGan] || 1;
    
    // 5. 상중하 계산
    const sangSu = (age + taeseSoo) % 8 || 8;
    const monthDays = getDaysInMonth(targetYear, month, isLunar);
    const jungSu = (monthDays + wolgunSoo) % 6 || 6;
    const haSu = (day + iljinSoo) % 3 || 3;
    
    // 6. 144괘 번호 계산
    // 상괘(8) x 중괘(6) x 하괘(3) = 144가지
    const guaNumber = ((sangSu - 1) * 18) + ((jungSu - 1) * 3) + haSu;
    
    // 7. 괘 데이터 로드
    const guaData = loadGuaData();
    if (!guaData) {
      return {
        success: false,
        error: '144괘 데이터를 불러올 수 없습니다.'
      };
    }
    
    const mainGua = guaData[guaNumber.toString()];
    
    if (!mainGua) {
      return {
        success: false,
        error: `괘 번호 ${guaNumber}를 찾을 수 없습니다.`
      };
    }
    
    // 8. 12개월 운세 생성
    const monthlyFortune = [];
    for (let m = 1; m <= 12; m++) {
      monthlyFortune.push({
        month: m,
        text: mainGua.monthly[m.toString()] || '운세 정보 없음'
      });
    }
    
    return {
      success: true,
      year: targetYear,
      yearGanzi: yearGanzi,
      age: age,
      calculation: {
        sangSu: sangSu,
        jungSu: jungSu,
        haSu: haSu,
        guaNumber: guaNumber
      },
      mainGua: {
        number: mainGua.number,
        name: mainGua.name,
        symbol: mainGua.symbol,
        level: mainGua.level,
        description: mainGua.description
      },
      monthlyFortune: monthlyFortune
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  calculateTojeong
};
