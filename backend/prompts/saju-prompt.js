// backend/prompts/saju-prompt.js
// 사주 프롬프트 통합 (17개 카테고리)

const { getTotalPrompt } = require('./saju/total-prompt');
const { getWealthPrompt } = require('./saju/wealth-prompt');
const { getLovePrompt } = require('./saju/love-prompt');
const { getHealthPrompt } = require('./saju/health-prompt');

// 새로운 프롬프트 추가
const { getPersonalityPrompt } = require('./saju/personality-prompt');
const { getDaeunPrompt } = require('./saju/daeun-prompt');
const { getCareerPrompt } = require('./saju/career-prompt');
const { getStudyPrompt } = require('./saju/study-prompt');
const { getPromotionPrompt } = require('./saju/promotion-prompt');
const { getMovePrompt } = require('./saju/move-prompt');
const { getTravelPrompt } = require('./saju/travel-prompt');
const { getParentsPrompt } = require('./saju/parents-prompt');
const { getSiblingsPrompt } = require('./saju/siblings-prompt');
const { getChildrenPrompt } = require('./saju/children-prompt');
const { getSpousePrompt } = require('./saju/spouse-prompt');
const { getSocialPrompt } = require('./saju/social-prompt');
const { getAptitudePrompt } = require('./saju/aptitude-prompt');
const { getJobRecommendPrompt } = require('./saju/job-recommend-prompt');
const { getBusinessPrompt } = require('./saju/business-prompt');
const { getSinsalPrompt } = require('./saju/sinsal-prompt');
const { getTaekilPrompt } = require('./saju/taekil-prompt');

/**
 * 사주 프롬프트 생성
 * @param {string} category - 카테고리 (17개)
 * @param {Object} engineResult - 엔진 계산 결과
 * @param {Object} options - 추가 옵션
 * @returns {string} 프롬프트
 */
function getSajuPrompt(category, engineResult, options = {}) {
  switch (category) {
    // 기존 4개
    case 'total':
      return getTotalPrompt(engineResult);
    case 'wealth':
      return getWealthPrompt(engineResult);
    case 'love':
      return getLovePrompt(engineResult, options.gender || '여성');
    case 'health':
      return getHealthPrompt(engineResult);
    
    // 새로운 13개
    case 'personality':
      return getPersonalityPrompt(engineResult);
    case 'daeun':
      return getDaeunPrompt(engineResult, options.daeunList, options.currentAge);
    case 'career':
      return getCareerPrompt(engineResult);
    case 'study':
      return getStudyPrompt(engineResult);
    case 'promotion':
      return getPromotionPrompt(engineResult);
    case 'move':
      return getMovePrompt(engineResult, options.sinsal);
    case 'travel':
      return getTravelPrompt(engineResult, options.sinsal);
    case 'parents':
      return getParentsPrompt(engineResult);
    case 'siblings':
      return getSiblingsPrompt(engineResult);
    case 'children':
      return getChildrenPrompt(engineResult);
    case 'spouse':
      return getSpousePrompt(engineResult);
    case 'social':
      return getSocialPrompt(engineResult);
    case 'aptitude':
      return getAptitudePrompt(engineResult);
    case 'job':
      return getJobRecommendPrompt(engineResult);
    case 'business':
      return getBusinessPrompt(engineResult);
    case 'sinsal':
      return getSinsalPrompt(engineResult, options.sinsal);
    case 'taekil':
      return getTaekilPrompt(engineResult, options.taekilResults, options.purpose);
    
    default:
      throw new Error(`Unknown category: ${category}`);
  }
}

module.exports = {
  getSajuPrompt
};
