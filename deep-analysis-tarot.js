// deep-analysis-tarot.js
// 타로 시스템 정밀 분석 스크립트

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('🔬 타로 시스템 정밀 분석 시작');
console.log('='.repeat(80));

const issues = [];

// 분석 1: 데이터 파일 무결성
console.log('\n📊 [분석 1] 데이터 파일 무결성 검사');
console.log('-'.repeat(80));

try {
  const cardsData = require('./engines/data/tarot-cards-complete.json');
  const meaningsData = require('./engines/data/tarot-cards-meanings.json');
  
  console.log(`✓ 카드 데이터 로드 성공: ${cardsData.cards.length}장`);
  console.log(`✓ 의미 데이터 로드 성공`);
  
  // 카드별 검증
  cardsData.cards.forEach(card => {
    if (!card.id) issues.push(`카드 ID 없음: ${JSON.stringify(card)}`);
    if (!card.name_ko) issues.push(`카드 한글명 없음: ${card.id}`);
  });
  
  // 의미 데이터 검증
  const categories = [
    'total', 'personality', 'daeun', 'wealth', 'love',
    'parents', 'siblings', 'children', 'spouse', 'social',
    'health', 'career', 'study', 'promotion', 'aptitude',
    'job', 'business', 'move', 'travel', 'taekil', 'sinsal'
  ];
  
  cardsData.cards.forEach(card => {
    if (!meaningsData.meanings[card.id]) {
      issues.push(`의미 없음: ${card.id}`);
      return;
    }
    
    const cardMeanings = meaningsData.meanings[card.id];
    
    // 정방향 검증
    if (!cardMeanings.upright) {
      issues.push(`정방향 의미 없음: ${card.id}`);
    } else {
      categories.forEach(cat => {
        if (!cardMeanings.upright[cat]) {
          issues.push(`정방향 ${cat} 의미 없음: ${card.id}`);
        }
      });
    }
    
    // 역방향 검증
    if (!cardMeanings.reversed) {
      issues.push(`역방향 의미 없음: ${card.id}`);
    } else {
      categories.forEach(cat => {
        if (!cardMeanings.reversed[cat]) {
          issues.push(`역방향 ${cat} 의미 없음: ${card.id}`);
        }
      });
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ 데이터 무결성: 완벽');
  } else {
    console.log(`❌ 발견된 문제: ${issues.length}개`);
  }
  
} catch (error) {
  console.log(`❌ 데이터 로드 실패: ${error.message}`);
  issues.push(`데이터 로드 오류: ${error.message}`);
}

// 분석 2: 엔진 로직 분석
console.log('\n⚙️  [분석 2] 엔진 로직 분석');
console.log('-'.repeat(80));

try {
  const { TarotEngine, drawInitialCards, drawNextCards, getCardMeaning } = require('./engines/core/tarot-engine');
  
  // 2-1: drawInitialCards 검증
  const initial = drawInitialCards();
  if (initial.length !== 3) {
    issues.push(`drawInitialCards: 3장이 아님 (${initial.length}장)`);
  }
  
  initial.forEach((card, i) => {
    if (!card.id) issues.push(`초기 카드 ${i}: id 없음`);
    if (!card.orientation) issues.push(`초기 카드 ${i}: orientation 없음`);
    if (card.orientation !== 'upright' && card.orientation !== 'reversed') {
      issues.push(`초기 카드 ${i}: orientation 값 이상 (${card.orientation})`);
    }
  });
  
  console.log(`✓ drawInitialCards: ${initial.length}장 생성, orientation 확인`);
  
  // 2-2: drawNextCards 검증
  const excludeIds = [initial[0].id];
  const next = drawNextCards(excludeIds);
  
  if (next.length !== 5) {
    issues.push(`drawNextCards: 5장이 아님 (${next.length}장)`);
  }
  
  if (next.some(card => excludeIds.includes(card.id))) {
    issues.push(`drawNextCards: 제외된 카드가 포함됨`);
  }
  
  console.log(`✓ drawNextCards: ${next.length}장 생성, 중복 제외 확인`);
  
  // 2-3: getCardMeaning 검증
  const meaningTest = getCardMeaning('major_00', 'upright', 'total');
  if (!meaningTest.success) {
    issues.push(`getCardMeaning: 기본 테스트 실패`);
  }
  if (!meaningTest.meaning) {
    issues.push(`getCardMeaning: meaning 값 없음`);
  }
  
  console.log(`✓ getCardMeaning: 의미 조회 성공`);
  
  // 2-4: TarotEngine 전체 플로우
  const engine = new TarotEngine();
  const session = engine.startNewSession('love');
  
  if (!session.success) issues.push(`TarotEngine: 세션 시작 실패`);
  if (session.step !== 1) issues.push(`TarotEngine: step이 1이 아님`);
  if (!session.cards || session.cards.length !== 3) {
    issues.push(`TarotEngine: 초기 카드가 3장이 아님`);
  }
  
  // 5단계 시뮬레이션
  let result = session;
  for (let i = 0; i < 5; i++) {
    const card = result.cards[0];
    
    // orientation 검증
    if (!card.orientation) {
      issues.push(`단계 ${i+1}: orientation 없음`);
    }
    
    result = engine.selectCard(card);
    
    if (i < 4) {
      if (result.completed) issues.push(`단계 ${i+1}: 조기 완료`);
      if (!result.cards) issues.push(`단계 ${i+1}: 다음 카드 없음`);
    } else {
      if (!result.completed) issues.push(`단계 5: 완료 안 됨`);
      if (!result.meanings) issues.push(`단계 5: meanings 없음`);
      if (result.meanings.length !== 5) {
        issues.push(`단계 5: meanings가 5개 아님 (${result.meanings.length}개)`);
      }
      
      // 각 meaning 검증
      result.meanings.forEach((m, idx) => {
        if (!m.meaning) issues.push(`meaning ${idx}: 텍스트 없음`);
        if (!m.card) issues.push(`meaning ${idx}: card 정보 없음`);
        if (!m.card.orientation) issues.push(`meaning ${idx}: orientation 없음`);
        if (!m.position) issues.push(`meaning ${idx}: position 없음`);
        if (!m.position_ko) issues.push(`meaning ${idx}: position_ko 없음`);
      });
    }
  }
  
  console.log(`✓ TarotEngine: 5단계 플로우 완료`);
  
} catch (error) {
  console.log(`❌ 엔진 분석 실패: ${error.message}`);
  issues.push(`엔진 오류: ${error.message}`);
}

// 최종 결과
console.log('\n' + '='.repeat(80));
if (issues.length === 0) {
  console.log('✅ 정밀 분석 완료: 문제 없음');
  console.log('🎊 시스템 완벽!');
} else {
  console.log(`❌ 발견된 문제: ${issues.length}개`);
  console.log('\n문제 목록:');
  issues.forEach((issue, i) => {
    console.log(`${i+1}. ${issue}`);
  });
}
console.log('='.repeat(80));

process.exit(issues.length > 0 ? 1 : 0);
