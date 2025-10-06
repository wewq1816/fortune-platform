/**
 * 토정비결 계산 엔진 (lunar-javascript 기반)
 * 
 * 핵심: 144괘 시스템 (상중하 3괘 조합)
 * 수정일: 2025-01-05
 * 수정 사유: 간지 계산 오류 수정
 */

const fs = require('fs');
const path = require('path');
const lunar = require('lunar-javascript');

// 60간지 테이블 (갑자=1 ~ 계해=60)
const GANZI_60 = {
  '갑자': 1, '을축': 2, '병인': 3, '정묘': 4, '무진': 5,
  '기사': 6, '경오': 7, '신미': 8, '임신': 9, '계유': 10,
  '갑술': 11, '을해': 12, '병자': 13, '정축': 14, '무인': 15,
  '기묘': 16, '경진': 17, '신사': 18, '임오': 19, '계미': 20,
  '갑신': 21, '을유': 22, '병술': 23, '정해': 24, '무자': 25,
  '기축': 26, '경인': 27, '신묘': 28, '임진': 29, '계사': 30,
  '갑오': 31, '을미': 32, '병신': 33, '정유': 34, '무술': 35,
  '기해': 36, '경자': 37, '신축': 38, '임인': 39, '계묘': 40,
  '갑진': 41, '을사': 42, '병오': 43, '정미': 44, '무신': 45,
  '기유': 46, '경술': 47, '신해': 48, '임자': 49, '계축': 50,
  '갑인': 51, '을묘': 52, '병진': 53, '정사': 54, '무오': 55,
  '기미': 56, '경신': 57, '신유': 58, '임술': 59, '계해': 60
};

// 한자 -> 한글 변환 테이블
const HANJA_TO_HANGUL = {
  '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', '己': '기',
  '庚': '경', '辛': '신', '壬': '임', '癸': '계',
  '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
  '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

/**
 * 한자 간지를 한글로 변환
 */
function convertGanziToHangul(hanjaGanzi) {
  if (!hanjaGanzi || hanjaGanzi.length !== 2) {
    return '';
  }
  
  const gan = HANJA_TO_HANGUL[hanjaGanzi[0]] || hanjaGanzi[0];
  const ji = HANJA_TO_HANGUL[hanjaGanzi[1]] || hanjaGanzi[1];
  
  return gan + ji;
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
    // 1. 양력 -> 음력 변환
    let lunarYear, lunarMonth, lunarDay, lunarBirthDate;
    
    if (isLunar) {
      // 이미 음력인 경우
      lunarYear = year;
      lunarMonth = month;
      lunarDay = day;
      
      // Lunar 객체 생성 (음력)
      lunarBirthDate = lunar.Lunar.fromYmd(year, month, day);
    } else {
      // 양력 -> 음력 변환
      const solar = lunar.Solar.fromYmd(year, month, day);
      lunarBirthDate = solar.getLunar();
      
      lunarYear = lunarBirthDate.getYear();
      lunarMonth = lunarBirthDate.getMonth();
      lunarDay = lunarBirthDate.getDay();
    }
    
    // 2. 나이 계산 (세는 나이)
    const age = targetYear - lunarYear + 1;
    
    // 3. 토정비결 보는 해의 Lunar 객체 생성
    // 생월, 생일을 해당 년도로 변환
    const targetLunar = lunar.Lunar.fromYmd(targetYear, lunarMonth, lunarDay);
    
    // 4. 간지 가져오기 (한자)
    const yearGanZhiHanja = targetLunar.getYearInGanZhi();
    const monthGanZhiHanja = targetLunar.getMonthInGanZhi();
    const dayGanZhiHanja = targetLunar.getDayInGanZhi();
    
    // 5. 한자 -> 한글 변환
    const yearGanZhi = convertGanziToHangul(yearGanZhiHanja);
    const monthGanZhi = convertGanziToHangul(monthGanZhiHanja);
    const dayGanZhi = convertGanziToHangul(dayGanZhiHanja);
    
    // 6. 간지 -> 숫자 변환
    const taeseSoo = GANZI_60[yearGanZhi] || 1;
    const wolgunSoo = GANZI_60[monthGanZhi] || 1;
    const iljinSoo = GANZI_60[dayGanZhi] || 1;
    
    // 7. 월 달수 (큰달 30, 작은달 29) - LunarMonth 사용
    const targetLunarMonth = lunar.LunarMonth.fromYm(targetYear, lunarMonth);
    const monthDays = targetLunarMonth.getDayCount();
    
    // 8. 상중하 계산
    const sangSu = (age + taeseSoo) % 8 || 8;
    const jungSu = (monthDays + wolgunSoo) % 6 || 6;
    const haSu = (lunarDay + iljinSoo) % 3 || 3;
    
    // 9. 144괘 번호 계산
    // 상괘(8) x 중괘(6) x 하괘(3) = 144가지
    const guaNumber = ((sangSu - 1) * 18) + ((jungSu - 1) * 3) + haSu;
    
    // 10. 괘 데이터 로드
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
    
    // 11. 12개월 운세 생성
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
      yearGanzi: yearGanZhi,
      age: age,
      lunarDate: {
        year: lunarYear,
        month: lunarMonth,
        day: lunarDay
      },
      calculation: {
        sangSu: sangSu,
        jungSu: jungSu,
        haSu: haSu,
        guaNumber: guaNumber,
        taeseSoo: taeseSoo,
        wolgunSoo: wolgunSoo,
        iljinSoo: iljinSoo,
        monthDays: monthDays
      },
      ganzi: {
        year: yearGanZhi,
        month: monthGanZhi,
        day: dayGanZhi
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
