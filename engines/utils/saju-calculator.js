// engines/utils/saju-calculator.js
// 사주 8글자 계산 (년월일시주)
// 2025-01-05 수정: 월건법, 시간변환, 절기 고려

const ganziData = require('../data/ganzi-60.json');

/**
 * 년주 계산
 * 기준년: 1984년 = 갑자년
 */
function calculateYearPillar(year) {
  const baseYear = 1984;
  const baseIndex = 0; // 갑자 = 0
  
  const index = (year - baseYear + baseIndex) % 60;
  const ganzi = ganziData[index < 0 ? index + 60 : index];
  
  return {
    cheongan: ganzi.cheongan,
    jiji: ganzi.jiji,
    hanja: `${ganzi.cheongan}${ganzi.jiji}`,
    element: ganzi.cheongganElement
  };
}

/**
 * 월주 계산 (월건법 적용)
 * 년간에 따라 월주 천간이 달라짐
 * 
 * 월건법 5가지 패턴:
 * - 갑기년(甲己年): 병인월(丙寅月)부터 시작
 * - 을경년(乙庚年): 무인월(戊寅月)부터 시작
 * - 병신년(丙辛年): 경인월(庚寅月)부터 시작
 * - 정임년(丁壬年): 임인월(壬寅月)부터 시작
 * - 무계년(戊癸年): 갑인월(甲寅月)부터 시작
 */
function calculateMonthPillar(year, month) {
  // 월지 고정 (1월=인, 2월=묘, ... 12월=축)
  const monthJiji = ['인', '묘', '진', '사', '오', '미', '신', '유', '술', '해', '자', '축'];
  const jiji = monthJiji[month - 1];
  
  // 년간 추출
  const yearPillar = calculateYearPillar(year);
  const yearGan = yearPillar.cheongan;
  
  // 년간에 따른 월건법 패턴
  // 각 년간마다 1월(인월)부터 시작하는 천간이 정해져 있음
  const monthGanStart = {
    '갑': '병', '기': '병',  // 갑기년 -> 1월은 병인
    '을': '무', '경': '무',  // 을경년 -> 1월은 무인
    '병': '경', '신': '경',  // 병신년 -> 1월은 경인
    '정': '임', '임': '임',  // 정임년 -> 1월은 임인
    '무': '갑', '계': '갑'   // 무계년 -> 1월은 갑인
  };
  
  // 1월 천간
  const startGan = monthGanStart[yearGan];
  
  // 천간 배열
  const ganList = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const startIndex = ganList.indexOf(startGan);
  
  // 월에 따라 천간 순환 (1월=startGan, 2월=startGan+1, ...)
  const cheongan = ganList[(startIndex + month - 1) % 10];
  
  return {
    cheongan: cheongan,
    jiji: jiji,
    hanja: `${cheongan}${jiji}`
  };
}

/**
 * 일주 계산
 * 기준일: 1900년 1월 1일 = 갑자일
 */
function calculateDayPillar(year, month, day) {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  const index = diffDays % 60;
  
  const ganzi = ganziData[index < 0 ? index + 60 : index];
  
  return {
    cheongan: ganzi.cheongan,
    jiji: ganzi.jiji,
    hanja: `${ganzi.cheongan}${ganzi.jiji}`
  };
}

/**
 * 시간(0-23)을 12지지로 변환
 * 한국 표준시 30분 보정 적용
 * 
 * @param {number|string} hour - 시간 (0-23 또는 '자', '축' 등)
 * @param {number} minute - 분 (0-59), 기본값 0
 * @returns {string} 12지지 ('자', '축', '인', ...)
 */
function convertHourToJiji(hour, minute = 0) {
  // 이미 지지 문자열이면 그대로 반환
  if (typeof hour === 'string' && isNaN(hour)) {
    return hour;
  }
  
  // 숫자로 변환
  const h = typeof hour === 'string' ? parseInt(hour) : hour;
  const m = minute;
  
  // 30분 보정을 고려한 시간 계산
  // 예: 23:30 = 자시 시작, 01:29 = 자시 끝
  
  if (h === 23 && m >= 30) return '자';
  if (h === 0) return '자';
  if (h === 1 && m < 30) return '자';
  
  if (h === 1 && m >= 30) return '축';
  if (h === 2) return '축';
  if (h === 3 && m < 30) return '축';
  
  if (h === 3 && m >= 30) return '인';
  if (h === 4) return '인';
  if (h === 5 && m < 30) return '인';
  
  if (h === 5 && m >= 30) return '묘';
  if (h === 6) return '묘';
  if (h === 7 && m < 30) return '묘';
  
  if (h === 7 && m >= 30) return '진';
  if (h === 8) return '진';
  if (h === 9 && m < 30) return '진';
  
  if (h === 9 && m >= 30) return '사';
  if (h === 10) return '사';
  if (h === 11 && m < 30) return '사';
  
  if (h === 11 && m >= 30) return '오';
  if (h === 12) return '오';
  if (h === 13 && m < 30) return '오';
  
  if (h === 13 && m >= 30) return '미';
  if (h === 14) return '미';
  if (h === 15 && m < 30) return '미';
  
  if (h === 15 && m >= 30) return '신';
  if (h === 16) return '신';
  if (h === 17 && m < 30) return '신';
  
  if (h === 17 && m >= 30) return '유';
  if (h === 18) return '유';
  if (h === 19 && m < 30) return '유';
  
  if (h === 19 && m >= 30) return '술';
  if (h === 20) return '술';
  if (h === 21 && m < 30) return '술';
  
  if (h === 21 && m >= 30) return '해';
  if (h === 22) return '해';
  if (h === 23 && m < 30) return '해';
  
  // 기본값 (발생하지 않아야 함)
  return '자';
}

/**
 * 시주 계산
 * 일간과 시지에 따라 시간 천간이 결정됨
 * 
 * @param {string} dayCheongan - 일간 (갑, 을, 병, ...)
 * @param {number|string} hour - 시간 (0-23 또는 '자', '축' 등)
 * @param {number} minute - 분 (0-59), 기본값 0
 */
function calculateHourPillar(dayCheongan, hour, minute = 0) {
  // 시지 변환
  const jiji = convertHourToJiji(hour, minute);
  
  // 일간에 따른 시간 천간 패턴
  // 갑일/기일: 갑자시부터 시작
  // 을일/경일: 병자시부터 시작
  // 병일/신일: 무자시부터 시작
  // 정일/임일: 경자시부터 시작
  // 무일/계일: 임자시부터 시작
  
  const hourGanStart = {
    '갑': '갑', '기': '갑',
    '을': '병', '경': '병',
    '병': '무', '신': '무',
    '정': '경', '임': '경',
    '무': '임', '계': '임'
  };
  
  const startGan = hourGanStart[dayCheongan];
  
  // 천간 배열
  const ganList = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const startIndex = ganList.indexOf(startGan);
  
  // 지지 배열 (자시부터 시작)
  const jijiList = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const jijiIndex = jijiList.indexOf(jiji);
  
  // 시간 천간 = 시작천간 + 지지 인덱스
  const cheongan = ganList[(startIndex + jijiIndex) % 10];
  
  return {
    cheongan: cheongan,
    jiji: jiji,
    hanja: `${cheongan}${jiji}`
  };
}

module.exports = {
  calculateYearPillar,
  calculateMonthPillar,
  calculateDayPillar,
  calculateHourPillar,
  convertHourToJiji
};
