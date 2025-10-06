const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const { getDailyFortuneBySaju } = require('./engines/core/daily-engine');
const { generateDailyFortunePrompt } = require('./engines/prompts/daily-fortune-prompt');
const { getHoroscopeFortune } = require('./engines/core/horoscope-engine');
const { generateHoroscopePrompt } = require('./engines/prompts/horoscope-prompt');
const DreamEngine = require('./engines/core/dream-engine');
const { calculateCompatibility } = require('./engines/core/compatibility-engine');
const { generateCompatibilityPrompt } = require('./engines/prompts/compatibility-prompt');
const { calculateTojeong } = require('./engines/core/tojeong-engine');
const { generateTojeongPrompt } = require('./engines/prompts/tojeong-prompt');
const SajuEngine = require('./engines/core/saju-engine');
const { getSajuPrompt } = require('./backend/prompts/saju-prompt');
const { TarotEngine } = require('./engines/core/tarot-engine');
const { generateTarotPrompt } = require('./backend/prompts/tarot-prompt');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Claude API 클라이언트
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

// 꿈해몽 엔진 초기화
const dreamEngine = new DreamEngine();

// 타로 엔진 세션 저장소 (메모리)
const tarotSessions = new Map();

// 타로 카드 API
// 1. 시작 - 3장 카드 제시
app.post('/api/tarot/start', async (req, res) => {
  try {
    const { category } = req.body;
    
    const engine = new TarotEngine();
    const result = engine.startNewSession(category);
    
    // 세션 ID 생성 (간단하게 타임스탬프 사용)
    const sessionId = Date.now().toString();
    tarotSessions.set(sessionId, engine);
    
    res.json({
      success: true,
      sessionId,
      ...result
    });
  } catch (error) {
    console.error('타로 시작 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. 카드 선택 - 다음 단계 진행
app.post('/api/tarot/next', async (req, res) => {
  try {
    const { sessionId, selectedCard } = req.body;
    
    const engine = tarotSessions.get(sessionId);
    if (!engine) {
      return res.status(404).json({ error: '세션을 찾을 수 없습니다.' });
    }
    
    const result = engine.selectCard(selectedCard);
    
    res.json(result);
  } catch (error) {
    console.error('타로 선택 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. 최종 해석 - Claude Haiku 호출
app.post('/api/tarot/interpret', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const engine = tarotSessions.get(sessionId);
    if (!engine) {
      return res.status(404).json({ error: '세션을 찾을 수 없습니다.' });
    }
    
    const result = engine.generateFinalResult();
    
    // 프롬프트 생성
    const prompt = generateTarotPrompt(result.meanings, result.category);
    
    // Claude Haiku 호출
    console.log('Claude Haiku 호출 중...');
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    const interpretation = message.content[0].text;
    
    // 세션 정리
    tarotSessions.delete(sessionId);
    
    res.json({
      success: true,
      ...result,
      interpretation,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens
      }
    });
  } catch (error) {
    console.error('타로 해석 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 오늘의 운세 API
app.post('/api/daily-fortune', async (req, res) => {
  try {
    const { year, month, day, hour, isLunar } = req.body;
    
    console.log('요청 받음:', { year, month, day, hour, isLunar });
    
    // 1. 사주 계산
    const fortuneData = getDailyFortuneBySaju({ year, month, day, hour, isLunar });
    
    if (!fortuneData.success) {
      return res.status(400).json({ error: '사주 계산 실패' });
    }
    
    // 2. 프롬프트 생성
    const prompt = generateDailyFortunePrompt(fortuneData);
    
    // 3. Claude API 호출
    console.log('Claude API 호출 중...');
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    // 4. 응답 파싱
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let fortuneResult;
    
    if (jsonMatch) {
      fortuneResult = JSON.parse(jsonMatch[0]);
    } else {
      fortuneResult = { 원문: responseText };
    }
    
    // 5. 결과 반환
    res.json({
      success: true,
      saju: fortuneData.saju,
      today: fortuneData.today,
      relationship: fortuneData.relationship,
      score: fortuneData.score,
      level: fortuneData.level,
      fortune: fortuneResult,
      cost: (message.usage.input_tokens / 1000 * 0.00025 + message.usage.output_tokens / 1000 * 0.00125).toFixed(6)
    });
    
    console.log('성공!');
    
  } catch (error) {
    console.error('오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 별자리 운세 API
app.post('/api/horoscope', async (req, res) => {
  try {
    const { year, month, day, hour, minute } = req.body;
    
    console.log('별자리 운세 요청:', { year, month, day, hour, minute });
    
    // 1. 별자리 운세 계산 (정밀 판정)
    const fortuneData = getHoroscopeFortune(month, day, year, hour, minute);
    
    if (!fortuneData.success) {
      return res.status(400).json({ error: '별자리 계산 실패' });
    }
    
    // 2. 프롬프트 생성
    const prompt = generateHoroscopePrompt(fortuneData);
    
    // 3. Claude API 호출
    console.log('Claude API 호출 중...');
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    // 4. 응답 파싱
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let fortuneResult;
    
    if (jsonMatch) {
      fortuneResult = JSON.parse(jsonMatch[0]);
    } else {
      fortuneResult = { 운세: responseText };
    }
    
    // 5. 결과 반환
    res.json({
      success: true,
      sign: fortuneData.sign,
      signEn: fortuneData.signEn,
      symbol: fortuneData.symbol,
      level: fortuneData.level,
      score: fortuneData.score,
      date: fortuneData.date,
      fortune: fortuneResult,
      cost: (message.usage.input_tokens / 1000 * 0.00025 + message.usage.output_tokens / 1000 * 0.00125).toFixed(6)
    });
    
    console.log('별자리 운세 생성 완료!');
    
  } catch (error) {
    console.error('별자리 운세 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// 꿈해몽 API
// ========================================

/**
 * 꿈 검색
 * GET /api/dream?q=뱀&category=동물&limit=10&offset=0
 */
app.get('/api/dream', (req, res) => {
  try {
    const { q, category, limit, offset } = req.query;
    
    console.log('꿈 검색 요청:', { q, category, limit, offset });
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: '검색어(q)를 입력해주세요'
      });
    }
    
    const result = dreamEngine.search(q, {
      category: category || null,
      limit: parseInt(limit) || 10,
      offset: parseInt(offset) || 0,
      includeRelated: true
    });
    
    res.json(result);
    
  } catch (error) {
    console.error('꿈 검색 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 특정 꿈 조회
 * GET /api/dream/:id
 */
app.get('/api/dream/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('꿈 조회 요청:', id);
    
    const result = dreamEngine.getDreamById(id);
    
    res.json(result);
    
  } catch (error) {
    console.error('꿈 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 카테고리 목록
 * GET /api/dream/categories/list
 */
app.get('/api/dream/categories/list', (req, res) => {
  try {
    console.log('카테고리 목록 요청');
    
    const result = dreamEngine.getCategories();
    
    res.json(result);
    
  } catch (error) {
    console.error('카테고리 목록 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * AI 꿈해몽 (DB에 없을 때 사용)
 * POST /api/dream/ai-interpret
 * Body: { query: "유튜브" }
 */
app.post('/api/dream/ai-interpret', async (req, res) => {
  try {
    const { query } = req.body;
    
    console.log('AI 꿈해몽 요청:', query);
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: '검색어(query)를 입력해주세요'
      });
    }
    
    // AI 해석 실행
    const result = await dreamEngine.interpretWithAI(query);
    
    res.json(result);
    
  } catch (error) {
    console.error('AI 꿈해몽 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DB 기반 AI 꿈해몽 (메인 기능!)
 * POST /api/dream/interpret
 * Body: { query: "용이 하늘을 나는 꿈" }
 */
app.post('/api/dream/interpret', async (req, res) => {
  try {
    const { query } = req.body;
    
    console.log('DB 기반 AI 꿈해몽 요청:', query);
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: '꿈 내용(query)을 입력해주세요'
      });
    }
    
    // DB 검색 + AI 해석 (하이브리드)
    const result = await dreamEngine.interpretWithDB(query);
    
    res.json(result);
    
  } catch (error) {
    console.error('DB 기반 AI 꿈해몽 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 카테고리별 꿈 목록
 * GET /api/dream/categories/:category?limit=20&offset=0
 */
app.get('/api/dream/categories/:category', (req, res) => {
  try {
    const { category } = req.params;
    const { limit, offset } = req.query;
    
    console.log('카테고리별 꿈 목록 요청:', { category, limit, offset });
    
    const result = dreamEngine.getDreamsByCategory(
      category,
      parseInt(limit) || 20,
      parseInt(offset) || 0
    );
    
    res.json(result);
    
  } catch (error) {
    console.error('카테고리별 꿈 목록 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 인기 검색어
 * GET /api/dream/popular?limit=10
 */
app.get('/api/dream/popular', (req, res) => {
  try {
    const { limit } = req.query;
    
    console.log('인기 검색어 요청:', limit);
    
    const result = dreamEngine.getPopularSearches(parseInt(limit) || 10);
    
    res.json(result);
    
  } catch (error) {
    console.error('인기 검색어 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 랜덤 꿈
 * GET /api/dream/random
 */
app.get('/api/dream/random', (req, res) => {
  try {
    console.log('랜덤 꿈 요청');
    
    const result = dreamEngine.getRandomDream();
    
    res.json(result);
    
  } catch (error) {
    console.error('랜덤 꿈 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DB 통계
 * GET /api/dream/stats
 */
app.get('/api/dream/stats', (req, res) => {
  try {
    console.log('DB 통계 요청');
    
    const result = dreamEngine.getStats();
    
    res.json(result);
    
  } catch (error) {
    console.error('DB 통계 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ========================================
// 궁합 API
// ========================================

/**
 * 궁합 계산
 * POST /api/compatibility
 * Body: {
 *   type: 'lover' | 'marriage' | 'family' | 'friend' | 'business' | 'work',
 *   person1: { year, month, day },
 *   person2: { year, month, day }
 * }
 */
app.post('/api/compatibility', async (req, res) => {
  try {
    const { type, person1, person2 } = req.body;
    
    console.log('궁합 계산 요청:', { type, person1, person2 });
    
    // 입력 검증
    if (!type || !person1 || !person2) {
      return res.status(400).json({
        success: false,
        message: '궁합 타입과 두 사람의 정보를 모두 입력해주세요'
      });
    }
    
    if (!person1.year || !person2.year) {
      return res.status(400).json({
        success: false,
        message: '생년월일을 입력해주세요'
      });
    }
    
    // 1. 궁합 계산
    const compatibilityData = calculateCompatibility(person1, person2, type);
    
    if (!compatibilityData.success) {
      return res.status(400).json({
        success: false,
        message: compatibilityData.message
      });
    }
    
    // 2. 프롬프트 생성
    const prompt = generateCompatibilityPrompt(compatibilityData);
    
    // 3. Claude API 호출
    console.log('Claude API 호출 중...');
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',  // Sonnet 3.5 사용 (정확한 해석)
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    // 4. 응답 파싱
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let fortuneResult;
    
    if (jsonMatch) {
      fortuneResult = JSON.parse(jsonMatch[0]);
    } else {
      fortuneResult = { 궁합분석: responseText };
    }
    
    // 5. 결과 반환
    res.json({
      success: true,
      type: compatibilityData.type,
      typeName: compatibilityData.typeName,
      typeIcon: compatibilityData.typeIcon,
      score: compatibilityData.score,
      level: compatibilityData.level,
      stars: compatibilityData.stars,
      person1: compatibilityData.person1,
      person2: compatibilityData.person2,
      elementRelation: compatibilityData.elementRelation,
      zodiacRelation: compatibilityData.zodiacRelation,
      weights: compatibilityData.weights,
      interpretation: fortuneResult,
      cost: (message.usage.input_tokens / 1000 * 0.003 + message.usage.output_tokens / 1000 * 0.015).toFixed(6)
    });
    
    console.log('궁합 계산 완료!');
    
  } catch (error) {
    console.error('궁합 계산 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 토정비결 API
app.post('/api/tojeong', async (req, res) => {
  try {
    const { year, month, day, isLunar, targetYear } = req.body;
    
    console.log('토정비결 요청:', { year, month, day, isLunar, targetYear });
    
    // 1. 엔진 계산
    const tojeongData = calculateTojeong(
      { year, month, day, isLunar },
      targetYear
    );
    
    if (!tojeongData.success) {
      return res.status(400).json({ 
        success: false,
        error: tojeongData.error || '토정비결 계산 실패' 
      });
    }
    
    // 2. 프롬프트 생성
    const prompt = generateTojeongPrompt(tojeongData);
    
    // 3. Claude API 호출
    console.log('Claude API 호출 중...');
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 5000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    // 4. 응답 파싱
    const responseText = message.content[0].text;
    console.log('Claude 응답:', responseText.substring(0, 200) + '...');
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let fortuneResult;
    
    if (jsonMatch) {
      fortuneResult = JSON.parse(jsonMatch[0]);
    } else {
      fortuneResult = { 
        종합운세: responseText,
        월별운세: {}
      };
    }
    
    // 5. 결과 반환
    res.json({
      success: true,
      year: tojeongData.year,
      yearGanzi: tojeongData.yearGanzi,
      age: tojeongData.age,
      mainGua: tojeongData.mainGua,
      monthlyFortune: tojeongData.monthlyFortune,
      fortune: fortuneResult,
      cost: (
        message.usage.input_tokens / 1000 * 0.00025 + 
        message.usage.output_tokens / 1000 * 0.00125
      ).toFixed(6)
    });
    
    console.log('토정비결 생성 완료!');
    
  } catch (error) {
    console.error('토정비결 오류:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 사주팔자 API ⭐ 새로 추가!
app.post('/api/saju', async (req, res) => {
  try {
    const { year, month, day, hour, isLunar, gender, category } = req.body;
    
    console.log('사주팔자 요청:', { year, month, day, hour, gender, category });
    
    // 1. 사주 엔진 계산
    const sajuEngine = new SajuEngine();
    const saju = sajuEngine.calculateSaju({ year, month, day, hour, isLunar });
    const elements = sajuEngine.calculateElements(saju);
    const strength = sajuEngine.calculateStrength(saju, elements);
    const yongsin = sajuEngine.findYongsin(strength, elements, saju.ilgan);
    const tenStars = sajuEngine.calculateTenStars(saju);
    
    const engineResult = {
      saju,
      ilgan: saju.ilgan,
      elements,
      strength,
      yongsin,
      tenStars
    };
    
    console.log('엔진 계산 완료:', engineResult);
    
    // 2. 프롬프트 생성
    const prompt = getSajuPrompt(category, engineResult, { gender });
    console.log('프롬프트 생성 완료');
    
    // 3. Claude API 호출 (Mock - 나중에 실제 연동)
    // TODO: 실제 Claude API 연동 시 아래 주석 해제
    /*
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    const interpretation = message.content[0].text;
    const cost = (
      message.usage.input_tokens / 1000 * 0.00025 + 
      message.usage.output_tokens / 1000 * 0.00125
    ).toFixed(6);
    */
    
    // Mock 응답 (테스트용)
    const mockInterpretations = {
      total: `일간이 ${saju.ilgan}인 사람은 특별한 성격을 가지고 있습니다. ${strength} 사주로, ${yongsin} 오행이 용신입니다. 오행 분포는 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개로 나타납니다. 이는 당신의 인생에서 균형과 조화를 의미하며, 용신인 ${yongsin}을 활용하면 더욱 풍요로운 삶을 살 수 있습니다.`,
      wealth: `재성이 적절히 배치되어 있어 재물운이 안정적입니다. ${strength} 사주는 ${strength === '신강' ? '적극적인 투자보다는 안정적인 저축' : '꾸준한 노력으로 재물을 모을 수 있음'}을 의미합니다.`,
      love: gender === '여성' 
        ? `관성(남편)의 배치를 보면 ${strength === '신강' ? '강한 성격으로 배우자와 조화를 이루려 노력이 필요' : '부드러운 성격으로 좋은 배우자운'}합니다. 용신 ${yongsin}을 고려한 상대를 만나면 좋습니다.`
        : `재성(아내)의 배치를 보면 안정적인 가정을 꾸릴 수 있습니다. ${strength} 사주는 배우자에게 ${strength === '신강' ? '리더십' : '배려심'}을 발휘하게 됩니다.`,
      health: `오행 분포를 보면 ${Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0]} 기운이 강하고 ${Object.entries(elements).sort((a,b) => a[1]-b[1])[0][0]} 기운이 약합니다. 균형을 맞추기 위해 ${yongsin} 기운을 보충하는 것이 좋습니다.`
    };
    
    const interpretation = mockInterpretations[category] || mockInterpretations.total;
    
    // 4. 결과 반환
    res.json({
      success: true,
      saju: {
        year: saju.year,
        month: saju.month,
        day: saju.day,
        hour: saju.hour,
        ilgan: saju.ilgan
      },
      elements,
      strength,
      yongsin,
      tenStars,
      interpretation,
      cost: '0.000000' // Mock이므로 비용 0
    });
    
    console.log('사주팔자 응답 완료!');
    
  } catch (error) {
    console.error('사주팔자 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log(`🔮 운세 플랫폼 서버 실행 중!`);
  console.log(`📍 주소: http://localhost:${PORT}`);
  console.log(`🌐 프론트엔드: http://localhost:${PORT}/index.html`);
  console.log('\n📋 API 엔드포인트:');
  console.log('  • POST /api/daily-fortune - 오늘의 운세');
  console.log('  • POST /api/horoscope - 별자리 운세');
  console.log('  • POST /api/compatibility - 궁합 보기');
  console.log('  • POST /api/tojeong - 토정비결');
  console.log('  • POST /api/saju - 사주팔자 ⭐ 새로 추가!');
  console.log('  • POST /api/tarot/start - 타로 시작 🎴');
  console.log('  • POST /api/tarot/next - 타로 다음 단계 🎴');
  console.log('  • POST /api/tarot/interpret - 타로 해석 🎴');
  console.log('  • GET  /api/dream?q=검색어 - 꿈 검색');
  console.log('  • GET  /api/dream/:id - 특정 꿈 조회');
  console.log('  • GET  /api/dream/categories/list - 카테고리 목록');
  console.log('  • GET  /api/dream/categories/:category - 카테고리별 꿈');
  console.log('  • GET  /api/dream/popular - 인기 검색어');
  console.log('  • GET  /api/dream/random - 랜덤 꿈');
  console.log('  • GET  /api/dream/stats - DB 통계');
  console.log('='.repeat(70));
});
