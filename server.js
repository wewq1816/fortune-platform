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
    const { month, day } = req.body;
    
    console.log('별자리 운세 요청:', { month, day });
    
    // 1. 별자리 운세 계산
    const fortuneData = getHoroscopeFortune(month, day);
    
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

app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log(`🔮 운세 플랫폼 서버 실행 중!`);
  console.log(`📍 주소: http://localhost:${PORT}`);
  console.log(`🌐 프론트엔드: http://localhost:${PORT}/index.html`);
  console.log('\n📋 API 엔드포인트:');
  console.log('  • POST /api/daily-fortune - 오늘의 운세');
  console.log('  • POST /api/horoscope - 별자리 운세');
  console.log('  • POST /api/compatibility - 궁합 보기 ⭐ 새로 추가!');
  console.log('  • GET  /api/dream?q=검색어 - 꿈 검색');
  console.log('  • GET  /api/dream/:id - 특정 꿈 조회');
  console.log('  • GET  /api/dream/categories/list - 카테고리 목록');
  console.log('  • GET  /api/dream/categories/:category - 카테고리별 꿈');
  console.log('  • GET  /api/dream/popular - 인기 검색어');
  console.log('  • GET  /api/dream/random - 랜덤 꿈');
  console.log('  • GET  /api/dream/stats - DB 통계');
  console.log('='.repeat(70));
});
