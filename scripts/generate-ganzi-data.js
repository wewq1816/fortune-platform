// 60갑자 데이터 생성 스크립트
const fs = require('fs');
const path = require('path');

// 천간 (10개)
const cheongan = [
  { name: '갑', element: '목' },
  { name: '을', element: '목' },
  { name: '병', element: '화' },
  { name: '정', element: '화' },
  { name: '무', element: '토' },
  { name: '기', element: '토' },
  { name: '경', element: '금' },
  { name: '신', element: '금' },
  { name: '임', element: '수' },
  { name: '계', element: '수' }
];

// 지지 (12개)
const jiji = [
  { name: '자', element: '수', zodiac: '쥐' },
  { name: '축', element: '토', zodiac: '소' },
  { name: '인', element: '목', zodiac: '호랑이' },
  { name: '묘', element: '목', zodiac: '토끼' },
  { name: '진', element: '토', zodiac: '용' },
  { name: '사', element: '화', zodiac: '뱀' },
  { name: '오', element: '화', zodiac: '말' },
  { name: '미', element: '토', zodiac: '양' },
  { name: '신', element: '금', zodiac: '원숭이' },
  { name: '유', element: '금', zodiac: '닭' },
  { name: '술', element: '토', zodiac: '개' },
  { name: '해', element: '수', zodiac: '돼지' }
];

// 60갑자 생성
const ganziData = [];
for (let i = 0; i < 60; i++) {
  const chIndex = i % 10;
  const jiIndex = i % 12;
  
  ganziData.push({
    index: i,
    korean: cheongan[chIndex].name + jiji[jiIndex].name,
    cheongan: cheongan[chIndex].name,
    jiji: jiji[jiIndex].name,
    cheongganElement: cheongan[chIndex].element,
    jijiElement: jiji[jiIndex].element,
    zodiac: jiji[jiIndex].zodiac
  });
}

// JSON 파일로 저장
const outputPath = path.join(__dirname, '../engines/data/ganzi-60.json');
fs.writeFileSync(outputPath, JSON.stringify(ganziData, null, 2), 'utf8');

console.log('✅ 60갑자 데이터 생성 완료!');
console.log(`   파일: ${outputPath}`);
console.log(`   총 ${ganziData.length}개`);
