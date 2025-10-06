// comprehensive-test-tarot.js
// 타로 시스템 종합 테스트

const { TarotEngine } = require('./engines/core/tarot-engine');

console.log('='.repeat(70));
console.log('🔍 타로 시스템 종합 테스트 시작');
console.log('='.repeat(70));

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   오류: ${error.message}`);
    failedTests++;
  }
}

// 테스트 1: 엔진 초기화
test('엔진 초기화', () => {
  const engine = new TarotEngine();
  if (engine.currentStep !== 0) throw new Error('초기 step이 0이 아님');
  if (engine.category !== null) throw new Error('초기 category가 null이 아님');
});

// 테스트 2: 세션 시작
test('세션 시작', () => {
  const engine = new TarotEngine();
  const result = engine.startNewSession('total');
  if (!result.success) throw new Error('세션 시작 실패');
  if (result.step !== 1) throw new Error('step이 1이 아님');
  if (result.cards.length !== 3) throw new Error('카드가 3장이 아님');
});

// 테스트 3: orientation 보존
test('orientation 정보 보존', () => {
  const engine = new TarotEngine();
  const session = engine.startNewSession('love');
  const selectedCard = session.cards[0];
  
  if (!selectedCard.orientation) throw new Error('orientation 없음');
  if (selectedCard.orientation !== 'upright' && selectedCard.orientation !== 'reversed') {
    throw new Error('orientation 값이 잘못됨');
  }
});

// 테스트 4: 5단계 전체 플로우
test('5단계 전체 플로우', () => {
  const engine = new TarotEngine();
  const session = engine.startNewSession('wealth');
  
  // 1단계
  let result = engine.selectCard(session.cards[0]);
  if (result.step !== 2) throw new Error('2단계로 진행 안 됨');
  
  // 2-4단계
  for (let i = 2; i <= 4; i++) {
    result = engine.selectCard(result.cards[0]);
    if (!result.completed && result.step !== i + 1) {
      throw new Error(`${i+1}단계로 진행 안 됨`);
    }
  }
  
  // 5단계 - 완료
  result = engine.selectCard(result.cards[0]);
  if (!result.completed) throw new Error('5단계 후 완료되지 않음');
  if (result.selectedCards.length !== 5) throw new Error('선택된 카드가 5장이 아님');
});

// 테스트 5: 의미 조회
test('카드 의미 조회', () => {
  const engine = new TarotEngine();
  const session = engine.startNewSession('career');
  
  // 5장 선택
  let result = session;
  for (let i = 0; i < 5; i++) {
    const card = result.cards[0];
    result = engine.selectCard(card);
  }
  
  // 의미 확인
  if (!result.meanings) throw new Error('meanings 없음');
  if (result.meanings.length !== 5) throw new Error('meanings가 5개가 아님');
  
  // 각 의미 확인
  result.meanings.forEach((m, i) => {
    if (!m.meaning) throw new Error(`${i}번째 의미 없음`);
    if (!m.card) throw new Error(`${i}번째 카드 정보 없음`);
    if (!m.position_ko) throw new Error(`${i}번째 position_ko 없음`);
  });
});

// 테스트 6: 중복 카드 방지
test('중복 카드 방지', () => {
  const engine = new TarotEngine();
  const session = engine.startNewSession('health');
  
  const selectedIds = [];
  let result = session;
  
  for (let i = 0; i < 5; i++) {
    const card = result.cards[0];
    
    // 이미 선택한 카드인지 확인
    if (selectedIds.includes(card.id)) {
      throw new Error('중복 카드 발견!');
    }
    
    selectedIds.push(card.id);
    result = engine.selectCard(card);
  }
});

// 테스트 7: 모든 카테고리 테스트
test('모든 카테고리 작동', () => {
  const categories = [
    'total', 'personality', 'daeun', 'wealth', 'love',
    'parents', 'siblings', 'children', 'spouse', 'social',
    'health', 'career', 'study', 'promotion', 'aptitude',
    'job', 'business', 'move', 'travel', 'taekil', 'sinsal'
  ];
  
  categories.forEach(cat => {
    const engine = new TarotEngine();
    const session = engine.startNewSession(cat);
    
    let result = session;
    for (let i = 0; i < 5; i++) {
      result = engine.selectCard(result.cards[0]);
    }
    
    if (!result.completed) throw new Error(`${cat} 카테고리 실패`);
    if (result.meanings.length !== 5) throw new Error(`${cat} 의미 개수 오류`);
  });
});

console.log('\n' + '='.repeat(70));
console.log(`테스트 결과: ${passedTests}개 통과, ${failedTests}개 실패`);
if (failedTests === 0) {
  console.log('🎊 모든 테스트 통과!');
} else {
  console.log('⚠️  일부 테스트 실패');
}
console.log('='.repeat(70));

process.exit(failedTests > 0 ? 1 : 0);
