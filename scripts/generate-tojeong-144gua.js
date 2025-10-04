/**
 * 토정비결 144괘 데이터 생성 스크립트
 * 
 * 상괘(8) × 중괘(6) × 하괘(3) = 144괘
 * 
 * 실행 방법: node scripts/generate-tojeong-144gua.js
 */

const fs = require('fs');
const path = require('path');

// 팔괘 정의
const BAGUA = [
  { name: '건', symbol: '☰', meaning: '하늘', trait: '강건', level: '대길' },
  { name: '태', symbol: '☱', meaning: '못', trait: '기쁨', level: '길' },
  { name: '리', symbol: '☲', meaning: '불', trait: '광명', level: '중길' },
  { name: '진', symbol: '☳', meaning: '천둥', trait: '움직임', level: '길' },
  { name: '손', symbol: '☴', meaning: '바람', trait: '순종', level: '중길' },
  { name: '감', symbol: '☵', meaning: '물', trait: '험난', level: '소길' },
  { name: '간', symbol: '☶', meaning: '산', trait: '멈춤', level: '평' },
  { name: '곤', symbol: '☷', meaning: '땅', trait: '순종', level: '길' }
];

// 운세 등급 점수
const LEVEL_SCORES = {
  '대길': 5,
  '길': 4,
  '중길': 3,
  '소길': 2,
  '평': 1
};

// 등급 조합 계산
function calculateLevel(sangGua, haGua) {
  const sangScore = LEVEL_SCORES[sangGua.level] || 3;
  const haScore = LEVEL_SCORES[haGua.level] || 3;
  const avgScore = (sangScore + haScore) / 2;
  
  if (avgScore >= 4.5) return '대길';
  if (avgScore >= 3.5) return '길';
  if (avgScore >= 2.5) return '중길';
  if (avgScore >= 1.5) return '소길';
  return '평';
}

// 월별 운세 템플릿
const MONTHLY_TEMPLATES = {
  1: {
    positive: ['정월에는 해가 떠오르니 만사가 형통하도다', '정월은 새해의 시작이니 희망이 가득하도다', '정월에는 봄기운이 시작되니 새로운 일을 도모하라'],
    neutral: ['정월에는 인내가 필요하니 서두르지 말라', '정월은 준비의 시기니 계획을 세우라', '정월에는 조용히 힘을 기르라'],
    negative: ['정월에는 조심하여 경솔함을 피하라', '정월은 어려움이 있으나 인내하면 극복하리라', '정월에는 신중히 행동하라']
  },
  2: {
    positive: ['2월에는 봄바람이 불어오니 기쁜 소식이 있도다', '2월은 만물이 소생하니 좋은 기회가 오도다', '2월에는 운이 트이니 적극적으로 나아가라'],
    neutral: ['2월에는 때를 기다리며 준비하라', '2월은 변화의 조짐이 보이니 주의하라', '2월에는 차분히 상황을 살피라'],
    negative: ['2월에는 장애물이 있으니 조심하라', '2월은 시련이 있으나 극복할 수 있도다', '2월에는 무리하지 말고 기다리라']
  },
  3: {
    positive: ['3월에는 꽃이 활짝 피니 기쁨이 가득하도다', '3월은 결실을 맺을 시기니 노력하라', '3월에는 모든 일이 순조롭도다'],
    neutral: ['3월에는 조금씩 나아지니 인내하라', '3월은 변화가 시작되니 준비하라', '3월에는 신중히 판단하라'],
    negative: ['3월에는 풍파가 있으나 지나가리라', '3월은 어려움이 있으니 조심하라', '3월에는 경거망동하지 말라']
  },
  4: {
    positive: ['4월에는 나무가 무성하니 성장의 시기로다', '4월은 좋은 일이 겹치니 기뻐하라', '4월에는 뜻하는 바를 이루리라'],
    neutral: ['4월에는 평온하니 현재를 즐기라', '4월은 안정의 시기니 감사하라', '4월에는 조용히 힘을 축적하라'],
    negative: ['4월에는 주의가 필요하니 신중하라', '4월은 난관이 있으나 포기하지 말라', '4월에는 경솔함을 피하라']
  },
  5: {
    positive: ['5월에는 열매가 맺히니 노력의 결실이로다', '5월은 풍성한 수확의 시기로다', '5월에는 모든 일이 성취되도다'],
    neutral: ['5월에는 균형을 유지하라', '5월은 현상 유지가 최선이로다', '5월에는 무리하지 말라'],
    negative: ['5월에는 조심하여 실수를 피하라', '5월은 어려움이 있으니 인내하라', '5월에는 신중히 행동하라']
  },
  6: {
    positive: ['6월에는 햇살이 뜨거우니 열정을 발휘할 때', '6월은 활력이 넘치니 적극적으로 행동하라', '6월에는 큰 성과를 거두리라'],
    neutral: ['6월에는 지나침을 경계하라', '6월은 휴식이 필요한 때로다', '6월에는 차분히 정리하라'],
    negative: ['6월에는 과욕을 부리지 말라', '6월은 시련이 있으니 조심하라', '6월에는 무리하지 말고 쉬어라']
  },
  7: {
    positive: ['7월에는 서늘한 바람이 부니 좋은 소식이 있도다', '7월은 안정되니 편안히 지내라', '7월에는 뜻밖의 기쁨이 있도다'],
    neutral: ['7월에는 장마가 오니 인내가 필요한 때', '7월은 변화가 있으니 준비하라', '7월에는 조용히 때를 기다리라'],
    negative: ['7월에는 물난리를 조심하라', '7월은 험난하니 주의하라', '7월에는 경솔한 행동을 삼가라']
  },
  8: {
    positive: ['8월에는 가을바람 부니 수확의 계절이로다', '8월은 풍요로움이 가득하도다', '8월에는 모든 일이 이루어지도다'],
    neutral: ['8월에는 감사하며 나누어라', '8월은 준비의 시기니 정리하라', '8월에는 다음을 준비하라'],
    negative: ['8월에는 욕심을 부리지 말라', '8월은 어려움이 있으니 조심하라', '8월에는 신중히 판단하라']
  },
  9: {
    positive: ['9월에는 단풍이 드니 아름다운 변화로다', '9월은 좋은 변화가 있으니 기뻐하라', '9월에는 새로운 기회가 오도다'],
    neutral: ['9월에는 변화를 맞이할 때', '9월은 조정의 시기니 차분히 대응하라', '9월에는 유연하게 대처하라'],
    negative: ['9월에는 급변에 주의하라', '9월은 불안정하니 조심하라', '9월에는 경솔함을 피하라']
  },
  10: {
    positive: ['10월에는 풍성한 결실이 있도다', '10월은 노력이 보상받는 때로다', '10월에는 기쁜 일이 가득하도다'],
    neutral: ['10월에는 서리가 내리니 준비가 필요하도다', '10월은 정리의 시기니 마무리하라', '10월에는 차분히 정돈하라'],
    negative: ['10월에는 추위를 조심하라', '10월은 어려움이 있으니 대비하라', '10월에는 건강에 유의하라']
  },
  11: {
    positive: ['11월에는 겨울 준비가 잘되니 안정되도다', '11월은 평온함이 찾아오도다', '11월에는 편안한 휴식을 취하라'],
    neutral: ['11월에는 겨울이 오니 휴식을 취할 때', '11월은 내실을 다지는 시기로다', '11월에는 조용히 힘을 기르라'],
    negative: ['11월에는 추위와 어려움을 조심하라', '11월은 시련이 있으나 견디라', '11월에는 무리하지 말라']
  },
  12: {
    positive: ['12월에는 한 해를 잘 마무리하니 만족스럽도다', '12월은 감사함으로 가득하도다', '12월에는 좋은 결말이 있도다'],
    neutral: ['12월에는 한 해를 마무리하니 반성의 시간', '12월은 정리와 준비의 때로다', '12월에는 차분히 연말을 보내라'],
    negative: ['12월에는 조심하여 무사히 마무리하라', '12월은 어려움이 있으나 곧 지나가리라', '12월에는 신중히 행동하라']
  }
};

// 월별 운세 생성
function generateMonthlyFortune(level) {
  const monthly = {};
  
  for (let month = 1; month <= 12; month++) {
    const templates = MONTHLY_TEMPLATES[month];
    let selectedTemplate;
    
    // 등급에 따라 템플릿 선택
    if (level === '대길' || level === '길') {
      selectedTemplate = templates.positive[Math.floor(Math.random() * templates.positive.length)];
    } else if (level === '평' || level === '소길') {
      selectedTemplate = templates.negative[Math.floor(Math.random() * templates.negative.length)];
    } else {
      selectedTemplate = templates.neutral[Math.floor(Math.random() * templates.neutral.length)];
    }
    
    monthly[month.toString()] = selectedTemplate;
  }
  
  return monthly;
}

// 144괘 생성
function generate144Gua() {
  const gua144 = {};
  let guaNumber = 1;
  
  // 상괘 8개
  for (let sang = 0; sang < 8; sang++) {
    const sangGua = BAGUA[sang];
    
    // 중괘 6개 (실제로는 다른 팔괘 6개 선택)
    for (let jung = 0; jung < 6; jung++) {
      const jungIndex = (sang + jung + 1) % 8;
      const jungGua = BAGUA[jungIndex];
      
      // 하괘 3개
      for (let ha = 0; ha < 3; ha++) {
        const haIndex = (sang + jung + ha) % 8;
        const haGua = BAGUA[haIndex];
        
        // 괘 이름
        const guaName = `${sangGua.name}지${haGua.name}`;
        
        // 심볼
        const symbol = `${sangGua.symbol}${haGua.symbol}`;
        
        // 운세 등급
        const level = calculateLevel(sangGua, haGua);
        
        // 설명
        const description = `${sangGua.meaning}이 ${haGua.meaning}을 만나니 ${level === '대길' || level === '길' ? '길한' : level === '평' ? '평범한' : '주의가 필요한'} 괘이다`;
        
        // 월별 운세
        const monthly = generateMonthlyFortune(level);
        
        // 저장
        gua144[guaNumber.toString()] = {
          number: guaNumber,
          name: guaName,
          symbol: symbol,
          level: level,
          description: description,
          monthly: monthly
        };
        
        guaNumber++;
        
        // 144개 도달하면 종료
        if (guaNumber > 144) break;
      }
      if (guaNumber > 144) break;
    }
    if (guaNumber > 144) break;
  }
  
  return gua144;
}

// 메인 실행
console.log('🎯 토정비결 144괘 데이터 생성 시작...');

const gua144 = generate144Gua();

// 파일 저장
const outputPath = path.join(__dirname, '..', 'engines', 'data', 'tojeong-gua-144.json');
const outputDir = path.dirname(outputPath);

// 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 디렉토리 생성: ${outputDir}`);
}

// JSON 저장
fs.writeFileSync(outputPath, JSON.stringify(gua144, null, 2), 'utf8');

console.log('✅ 144괘 데이터 생성 완료!');
console.log(`📄 파일 위치: ${outputPath}`);
console.log(`📊 총 괘 수: ${Object.keys(gua144).length}개`);

// 샘플 출력
console.log('\n📋 샘플 괘 (1번):');
console.log(JSON.stringify(gua144['1'], null, 2));
