function generateLottoNumbers(birthDate, name = '') {
  const seed = hashCode(birthDate + name);
  const numbers = [];
  let random = seed;
  
  while (numbers.length < 6) {
    random = (random * 1103515245 + 12345) & 0x7fffffff;
    const num = (random % 45) + 1;
    
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  
  return numbers.sort((a, b) => a - b);
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getLottoFortune(birthDate, name = '') {
  const numbers = generateLottoNumbers(birthDate, name);
  
  return {
    numbers: numbers,
    message: '행운의 번호입니다. 좋은 결과 있기를 바랍니다!',
    birthDate: birthDate,
    name: name || '이름 없음',
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  generateLottoNumbers,
  getLottoFortune
};
