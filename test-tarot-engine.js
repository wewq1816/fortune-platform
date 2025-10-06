// test-tarot-engine.js
// 타로 엔진 테스트 스크립트

const { TarotEngine, drawInitialCards, getCardMeaning } = require('./engines/core/tarot-engine');

console.log('='.repeat(70));
console.log('🎴 타로 엔진 테스트 시작!');
console.log('='.repeat(70));

// 1. 기본 기능 테스트
console.log('\n📌 1단계: 초기 3장 카드 생성 테스트');
const initial = drawInitialCards();
console.log('✅ 생성된 카드 수:', initial.length);
console.log('✅ 첫 번째 카드:', initial[0].name_ko, `(${initial[0].orientation})`);

// 2. 엔진 클래스 테스트
console.log('\n📌 2단계: TarotEngine 클래스 테스트');
const engine = new TarotEngine();

// 세션 시작
console.log('\n🔹 카테고리 선택: 총운 (total)');
const session = engine.startNewSession('total');
console.log('✅ 세션 시작 성공:', session.success);
console.log('✅ 제시된 카드:', session.cards.length, '장');
console.log('✅ 메시지:', session.message);

// 5단계 카드 선택 시뮬레이션
console.log('\n🔹 5단계 카드 선택 시뮬레이션');
for (let i = 1; i <= 5; i++) {
  const cardToSelect = session.cards ? session.cards[0] : initial[0];
  const result = engine.selectCard(cardToSelect);
  
  if (result.completed) {
    console.log(`\n✅ ${i}단계 완료 - 최종 결과 생성됨!`);
    console.log('선택된 카드:', result.selectedCards.length, '장');
    console.log('의미 데이터:', result.meanings.length, '개');
    
    // 첫 번째 의미 출력
    if (result.meanings[0]) {
      console.log('\n📖 첫 번째 카드 의미 (핵심):');
      console.log('  카드:', result.meanings[0].card.name_ko);
      console.log('  위치:', result.meanings[0].position_ko);
      console.log('  의미:', result.meanings[0].meaning.substring(0, 100) + '...');
    }
    break;
  } else {
    console.log(`✅ ${i}단계 완료 - ${result.step}단계로 진행`);
  }
}

// 3. 카드 의미 조회 테스트
console.log('\n📌 3단계: 카드 의미 조회 테스트');
const meaning = getCardMeaning('major_00', 'upright', 'total');
if (meaning.success) {
  console.log('✅ 의미 조회 성공!');
  console.log('  카드:', meaning.card.name_ko);
  console.log('  의미:', meaning.meaning.substring(0, 100) + '...');
} else {
  console.log('❌ 의미 조회 실패:', meaning.message);
}

console.log('\n' + '='.repeat(70));
console.log('🎊 타로 엔진 테스트 완료!');
console.log('='.repeat(70));
