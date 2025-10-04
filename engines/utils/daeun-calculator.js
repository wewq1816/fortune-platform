// 대운 계산 엔진 (10년 단위)

const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

function calculateDaeun(birthYear, birthMonth, birthDay, birthHour, gender, isLunar = false) {
  // 월주 천간지지 가져오기 (간단 계산)
  const monthGanIndex = (birthMonth - 1) % 10;
  const monthJiIndex = (birthMonth - 1) % 12;
  
  // 순행/역행 판정
  const isForward = shouldGoForward(birthYear, gender);
  
  // 대운수 계산 (3~103세까지)
  const daeunList = [];
  let currentGanIndex = monthGanIndex;
  let currentJiIndex = monthJiIndex;
  
  for (let age = 3; age <= 103; age += 10) {
    // 순행/역행에 따라 간지 이동
    if (isForward) {
      currentGanIndex = (currentGanIndex + 1) % 10;
      currentJiIndex = (currentJiIndex + 1) % 12;
    } else {
      currentGanIndex = (currentGanIndex - 1 + 10) % 10;
      currentJiIndex = (currentJiIndex - 1 + 12) % 12;
    }
    
    const ganzi = CHEONGAN[currentGanIndex] + JIJI[currentJiIndex];
    
    daeunList.push({
      age: age + '-' + (age + 10) + '세',
      ganzi: ganzi,
      cheongan: CHEONGAN[currentGanIndex],
      jiji: JIJI[currentJiIndex]
    });
  }
  
  return daeunList;
}

// 순행/역행 판정 (양남음녀 = 순행, 음남양녀 = 역행)
function shouldGoForward(birthYear, gender) {
  const isYangYear = birthYear % 2 === 0; // 짝수 = 양년
  const isMale = gender === 'male';
  
  return (isYangYear && isMale) || (!isYangYear && !isMale);
}

module.exports = { calculateDaeun };
