// 신살 계산 엔진 (도화살, 역마살 등)

const SINSAL_DATA = {
  // 도화살 (지지 기준)
  dohwa: {
    '자': ['묘'], '오': ['묘'], '묘': ['자', '오'], '유': ['자', '오']
  },
  // 역마살 (지지 기준)
  yeokma: {
    '인': ['신'], '오': ['인'], '술': ['신'],
    '신': ['인'], '자': ['신'], '진': ['인'],
    '사': ['해'], '유': ['사'], '축': ['해'],
    '해': ['사'], '묘': ['해'], '미': ['사']
  },
  // 화개살 (지지 기준)
  hwagae: {
    '인': ['술'], '오': ['술'], '술': ['인', '오'],
    '신': ['진'], '자': ['진'], '진': ['신', '자'],
    '사': ['축'], '유': ['축'], '축': ['사', '유'],
    '해': ['미'], '묘': ['미'], '미': ['해', '묘']
  }
};

function calculateSinsal(saju) {
  const jijis = [saju.year.jiji, saju.month.jiji, saju.day.jiji, saju.hour.jiji];
  
  const result = {
    dohwa: checkSinsal('dohwa', jijis),
    yeokma: checkSinsal('yeokma', jijis),
    hwagae: checkSinsal('hwagae', jijis),
    cheonEulGuiIn: checkCheonEulGuiIn(saju.day.cheongan)
  };
  
  return result;
}

// 신살 체크 함수
function checkSinsal(sinsalType, jijis) {
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
}

// 천을귀인 (일간 기준)
function checkCheonEulGuiIn(dayGan) {
  const guiInMap = {
    '갑': true, '을': true, '무': true, '기': true
  };
  
  return guiInMap[dayGan] || false;
}

module.exports = { calculateSinsal };
