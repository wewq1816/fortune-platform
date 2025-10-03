/**
 * 오행 상생상극 계산 모듈
 * 
 * 오행: 목(木), 화(火), 토(土), 금(金), 수(水)
 * 
 * 상생(相生): 서로 돕는 관계
 * - 수생목(水生木): 물이 나무를 키움
 * - 목생화(木生火): 나무가 불을 피움
 * - 화생토(火生土): 불이 재(흙)를 만듦
 * - 토생금(土生金): 흙에서 쇠가 나옴
 * - 금생수(金生水): 쇠에서 물이 맺힘
 * 
 * 상극(相剋): 서로 제압하는 관계
 * - 수극화(水剋火): 물이 불을 끔
 * - 화극금(火剋金): 불이 쇠를 녹임
 * - 금극목(金剋木): 쇠가 나무를 자름
 * - 목극토(木剋土): 나무가 흙을 뚫음
 * - 토극수(土剋水): 흙이 물을 막음
 */

// 오행 관계 정의 (25가지 조합)
const ELEMENT_RELATIONSHIPS = {
  // 목(木)
  '목-목': { type: '비화', score: 70, level: '중길', desc: '같은 기운으로 평온함' },
  '목-화': { type: '상생', score: 95, level: '대길', desc: '목생화, 크게 길함' },
  '목-토': { type: '상극', score: 60, level: '소길', desc: '목극토, 주의 필요' },
  '목-금': { type: '피극', score: 50, level: '흉', desc: '금극목, 조심해야 함' },
  '목-수': { type: '피생', score: 85, level: '길', desc: '수생목, 도움 받음' },
  
  // 화(火)
  '화-화': { type: '비화', score: 70, level: '중길', desc: '같은 기운으로 평온함' },
  '화-토': { type: '상생', score: 95, level: '대길', desc: '화생토, 크게 길함' },
  '화-금': { type: '상극', score: 60, level: '소길', desc: '화극금, 주의 필요' },
  '화-수': { type: '피극', score: 50, level: '흉', desc: '수극화, 조심해야 함' },
  '화-목': { type: '피생', score: 85, level: '길', desc: '목생화, 도움 받음' },
  
  // 토(土)
  '토-토': { type: '비화', score: 70, level: '중길', desc: '같은 기운으로 평온함' },
  '토-금': { type: '상생', score: 95, level: '대길', desc: '토생금, 크게 길함' },
  '토-수': { type: '상극', score: 60, level: '소길', desc: '토극수, 주의 필요' },
  '토-목': { type: '피극', score: 50, level: '흉', desc: '목극토, 조심해야 함' },
  '토-화': { type: '피생', score: 85, level: '길', desc: '화생토, 도움 받음' },
  
  // 금(金)
  '금-금': { type: '비화', score: 70, level: '중길', desc: '같은 기운으로 평온함' },
  '금-수': { type: '상생', score: 95, level: '대길', desc: '금생수, 크게 길함' },
  '금-목': { type: '상극', score: 60, level: '소길', desc: '금극목, 주의 필요' },
  '금-화': { type: '피극', score: 50, level: '흉', desc: '화극금, 조심해야 함' },
  '금-토': { type: '피생', score: 85, level: '길', desc: '토생금, 도움 받음' },
  
  // 수(水)
  '수-수': { type: '비화', score: 70, level: '중길', desc: '같은 기운으로 평온함' },
  '수-목': { type: '상생', score: 95, level: '대길', desc: '수생목, 크게 길함' },
  '수-화': { type: '상극', score: 60, level: '소길', desc: '수극화, 주의 필요' },
  '수-토': { type: '피극', score: 50, level: '흉', desc: '토극수, 조심해야 함' },
  '수-금': { type: '피생', score: 85, level: '길', desc: '금생수, 도움 받음' }
};

/**
 * 두 오행의 관계 계산
 * @param {string} element1 - 첫 번째 오행 (목/화/토/금/수)
 * @param {string} element2 - 두 번째 오행 (목/화/토/금/수)
 * @returns {object} 관계 정보
 */
function getElementRelationship(element1, element2) {
  const key = `${element1}-${element2}`;
  const relationship = ELEMENT_RELATIONSHIPS[key];
  
  if (!relationship) {
    throw new Error(`잘못된 오행: ${element1}, ${element2}`);
  }
  
  return {
    ...relationship,
    element1,
    element2,
    key
  };
}

/**
 * 띠의 오행과 일진의 오행으로 운세 계산
 * @param {string} zodiacElement - 띠의 오행
 * @param {string} ganziElement - 일진의 오행 (천간 또는 지지)
 * @returns {object} 운세 정보
 */
function calculateFortuneByElements(zodiacElement, ganziElement) {
  const relationship = getElementRelationship(zodiacElement, ganziElement);
  
  return {
    relationship: relationship.type,
    score: relationship.score,
    level: relationship.level,
    description: relationship.desc,
    zodiacElement,
    ganziElement,
    detail: getDetailedExplanation(relationship)
  };
}

/**
 * 상세 설명 생성
 */
function getDetailedExplanation(relationship) {
  const explanations = {
    '상생': '서로 돕는 관계로 매우 길한 날입니다. 하고자 하는 일이 순조롭게 풀릴 것입니다.',
    '상극': '견제하는 관계로 주의가 필요한 날입니다. 신중하게 행동하면 무난합니다.',
    '피극': '불리한 관계로 조심해야 하는 날입니다. 중요한 결정은 미루는 것이 좋습니다.',
    '피생': '도움을 받는 관계로 길한 날입니다. 주변의 협력을 얻기 좋습니다.',
    '비화': '같은 기운으로 안정적인 날입니다. 평소처럼 행동하면 좋습니다.'
  };
  
  return explanations[relationship.type] || '평범한 날입니다.';
}

/**
 * 오행별 특성
 */
const ELEMENT_CHARACTERISTICS = {
  목: { 
    name: '목(木)', 
    nature: '성장', 
    direction: '동', 
    season: '봄',
    character: '인자하고 성장하는 기운'
  },
  화: { 
    name: '화(火)', 
    nature: '확산', 
    direction: '남', 
    season: '여름',
    character: '활발하고 열정적인 기운'
  },
  토: { 
    name: '토(土)', 
    nature: '안정', 
    direction: '중앙', 
    season: '환절기',
    character: '안정적이고 포용하는 기운'
  },
  금: { 
    name: '금(金)', 
    nature: '수렴', 
    direction: '서', 
    season: '가을',
    character: '결단력 있고 날카로운 기운'
  },
  수: { 
    name: '수(水)', 
    nature: '저장', 
    direction: '북', 
    season: '겨울',
    character: '지혜롭고 유연한 기운'
  }
};

/**
 * 오행 특성 조회
 */
function getElementCharacteristics(element) {
  return ELEMENT_CHARACTERISTICS[element];
}

module.exports = {
  getElementRelationship,
  calculateFortuneByElements,
  getElementCharacteristics,
  ELEMENT_RELATIONSHIPS
};
