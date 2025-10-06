// engines/core/tarot-engine.js
// 타로 카드 5단계 선택 엔진

const fs = require('fs');
const path = require('path');

/**
 * 타로 카드 데이터 로드
 */
const TAROT_CARDS = require('../data/tarot-cards-complete.json').cards;
const TAROT_MEANINGS = require('../data/tarot-cards-meanings.json');

/**
 * Fisher-Yates 셔플 알고리즘
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 정/역방향 무작위 결정
 */
function determineOrientation() {
  return Math.random() < 0.5 ? 'upright' : 'reversed';
}

/**
 * 1단계: 초기 3장 선택
 */
function drawInitialCards() {
  const shuffled = shuffleArray(TAROT_CARDS);
  return shuffled.slice(0, 3).map(card => ({
    ...card,
    orientation: determineOrientation()
  }));
}

/**
 * 2-5단계: 각 5장씩 선택
 */
function drawNextCards(excludeIds = []) {
  const available = TAROT_CARDS.filter(card => !excludeIds.includes(card.id));
  const shuffled = shuffleArray(available);
  return shuffled.slice(0, 5).map(card => ({
    ...card,
    orientation: determineOrientation()
  }));
}

/**
 * 카드 의미 조회 (카테고리별)
 */
function getCardMeaning(cardId, orientation, category) {
  if (!TAROT_MEANINGS.meanings[cardId]) {
    return {
      error: true,
      message: `카드 ID "${cardId}"를 찾을 수 없습니다.`
    };
  }

  const cardMeanings = TAROT_MEANINGS.meanings[cardId];
  const meaning = cardMeanings[orientation]?.[category];

  if (!meaning) {
    return {
      error: true,
      message: `카테고리 "${category}"의 의미를 찾을 수 없습니다.`
    };
  }

  return {
    success: true,
    meaning,
    card: TAROT_CARDS.find(c => c.id === cardId)
  };
}

/**
 * 5장 카드 최종 의미 조합
 */
function combineMeanings(selectedCards, category) {
  const positions = ['core', 'past', 'future', 'advice', 'outcome'];
  
  return selectedCards.map((card, index) => {
    const meaningResult = getCardMeaning(card.id, card.orientation, category);
    
    // 에러 처리 강화
    let meaning = '의미를 찾을 수 없습니다.';
    if (meaningResult.success && meaningResult.meaning) {
      meaning = meaningResult.meaning;
    } else if (meaningResult.error) {
      console.error(`의미 조회 실패: ${meaningResult.message}`);
    }
    
    return {
      position: positions[index],
      position_ko: ['핵심', '과거', '미래', '조언', '결과'][index],
      card: card,
      meaning: meaning
    };
  });
}

/**
 * 메인 엔진 클래스
 */
class TarotEngine {
  constructor() {
    this.selectedCards = [];
    this.currentStep = 0;
    this.category = null;
  }

  /**
   * 새 세션 시작
   */
  startNewSession(category) {
    this.category = category;
    this.selectedCards = [];
    this.currentStep = 1;
    
    // 1단계: 3장 제시
    return {
      success: true,
      step: 1,
      cards: drawInitialCards(),
      message: '3장 중 1장을 선택하세요 (핵심 카드)'
    };
  }

  /**
   * 카드 선택 처리
   */
  selectCard(selectedCard) {
    if (this.currentStep === 0) {
      return {
        success: false,
        message: 'startNewSession()을 먼저 호출하세요.'
      };
    }

    // 선택된 카드 저장 (card 객체 전체 저장 - orientation 포함)
    this.selectedCards.push(selectedCard);
    this.currentStep++;

    // 5단계 완료 확인
    if (this.currentStep > 5) {
      return this.generateFinalResult();
    }

    // 다음 단계 카드 제시
    const excludeIds = this.selectedCards.map(c => c.id);
    const nextCards = drawNextCards(excludeIds);
    
    const stepMessages = [
      '',
      '5장 중 1장을 선택하세요 (과거 카드)',
      '5장 중 1장을 선택하세요 (미래 카드)',
      '5장 중 1장을 선택하세요 (조언 카드)',
      '5장 중 1장을 선택하세요 (결과 카드)'
    ];

    return {
      success: true,
      step: this.currentStep,
      cards: nextCards,
      message: stepMessages[this.currentStep - 1]
    };
  }

  /**
   * 최종 결과 생성
   */
  generateFinalResult() {
    // 선택된 카드는 이미 orientation 포함된 객체
    // 추가 변환 불필요
    const cards = this.selectedCards;

    // 카테고리별 의미 조합
    const meanings = combineMeanings(cards, this.category);

    return {
      success: true,
      completed: true,
      category: this.category,
      selectedCards: cards,
      meanings: meanings,
      message: '타로 리딩이 완료되었습니다.'
    };
  }

  /**
   * 현재 상태 조회
   */
  getState() {
    return {
      step: this.currentStep,
      category: this.category,
      selectedCards: this.selectedCards,
      completed: this.currentStep > 5
    };
  }
}

/**
 * 간단한 원샷 API (레거시 호환용)
 */
function drawTarotCards(category, question = '', userInput = {}) {
  const engine = new TarotEngine();
  
  // 테스트용 자동 선택
  const session = engine.startNewSession(category);
  
  return {
    success: true,
    message: '5단계 선택 시스템을 사용하세요. TarotEngine 클래스를 참조하세요.',
    engine: engine,
    initialCards: session.cards
  };
}

module.exports = {
  TarotEngine,
  drawTarotCards,
  drawInitialCards,
  drawNextCards,
  getCardMeaning,
  combineMeanings
};
