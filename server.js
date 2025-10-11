const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const rateLimit = require('express-rate-limit');
const { execSync } = require('child_process');
require('dotenv').config();

// ============================================
// 🔄 포트 3000 자동 정리 (서버 시작 전)
// ============================================
const PORT = 3000;

try {
  console.log(`🔍 포트 ${PORT} 사용 중인 프로세스 확인 중...`);
  
  // Windows: netstat으로 포트 3000 사용 중인 PID 찾기
  const netstatOutput = execSync(`netstat -ano | findstr :${PORT}`).toString();
  
  // PID 추출 (마지막 열)
  const lines = netstatOutput.split('\n').filter(line => line.includes('LISTENING'));
  const pids = new Set();
  
  lines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && !isNaN(pid)) {
      pids.add(pid);
    }
  });
  
  if (pids.size > 0) {
    console.log(`⚠️ 포트 ${PORT}을 사용 중인 프로세스 발견: ${Array.from(pids).join(', ')}`);
    
    pids.forEach(pid => {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        console.log(`✅ PID ${pid} 종료 완료`);
      } catch (err) {
        console.warn(`⚠️ PID ${pid} 종료 실패 (이미 종료됨)`);
      }
    });
    
    // 포트 해제 대기 (1초)
    console.log('⏳ 포트 해제 대기 중...');
    const waitStart = Date.now();
    while (Date.now() - waitStart < 1000) {
      // 1초 대기
    }
    console.log('✅ 포트 정리 완료');
  } else {
    console.log(`✅ 포트 ${PORT}은 사용 가능합니다`);
  }
} catch (error) {
  // netstat 결과 없음 = 포트 사용 중인 프로세스 없음
  console.log(`✅ 포트 ${PORT}은 사용 가능합니다`);
}

// ============================================
// 📦 모듈 임포트
// ============================================

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
const SajuEngineExtended = require('./engines/core/saju-engine-extended');
const { getSajuPrompt } = require('./backend/prompts/saju-prompt');
const { TarotEngine } = require('./engines/core/tarot-engine');
const { generateTarotPrompt } = require('./backend/prompts/tarot-prompt');

// ⭐ 관리자 및 분석 라우터 (Phase 3 추가)
const adminRouter = require('./backend/routes/admin');
const analyticsRouter = require('./backend/routes/analytics');

// 🎫 이용권 검증 미들웨어 (Phase 4 추가)
const {
  checkTicketMiddleware,
  useTicket,
  chargeTicketsEndpoint,
  getTicketsEndpoint,
  startAutoCleanup
} = require('./backend/middleware/ticket-check');

const app = express();

// 나이 계산 함수
function calculateAge(year, month, day) {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// CORS 설정 (보안 강화)
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

// CORS 로그 1번만 표시용 플래그
let corsLogShown = false;

const corsOptions = {
  origin: function (origin, callback) {
    if (!corsLogShown) {
      console.log(`🔍 CORS 체크 - origin: ${origin} (타입: ${typeof origin})`);
    }
    
    // origin이 undefined/null/false인 경우 무조건 허용
    if (!origin || origin === 'null') {
      if (!corsLogShown) {
        console.log('✅ origin 없음/null → 허용');
        corsLogShown = true;
      }
      return callback(null, true);
    }
    
    // 허용된 origin인 경우
    if (allowedOrigins.indexOf(origin) !== -1) {
      if (!corsLogShown) {
        console.log(`✅ 허용된 origin: ${origin}`);
      }
      return callback(null, true);
    }
    
    // 차단
    console.warn(`⚠️ CORS 차단: ${origin}`);
    callback(new Error('CORS 정책에 의해 차단되었습니다'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Id', 'X-Master-Code']
};

app.use(cors(corsOptions));
app.use(express.json({ charset: 'utf-8' }));
app.use(express.static('frontend'));
app.use('/public', express.static('public')); // 🖼️ 루트의 public 폴더 제공

// Rate Limiting 설정 (DDoS 공격 방지용 - 매우 느슨함)
const claudeApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 10000, // 15분에 10,000회 (이용권 시스템으로 개인당 2회 제한됨)
  message: { error: '비정상적으로 많은 요청이 감지되었습니다. 잠시 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 일반 API Rate Limiting
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 10000, // 15분에 10,000회
  message: { error: '요청 한도를 초과했습니다.' }
});

// Claude API 엔드포인트에만 엄격한 Rate Limiting 적용
app.use('/api/tarot', claudeApiLimiter);
app.use('/api/daily-fortune', claudeApiLimiter);
app.use('/api/saju', claudeApiLimiter);
app.use('/api/horoscope', claudeApiLimiter);
app.use('/api/tojeong', claudeApiLimiter);
app.use('/api/compatibility', claudeApiLimiter);
app.use('/api/dream/interpret', claudeApiLimiter);
app.use('/api/dream/ai-interpret', claudeApiLimiter);

// 일반 API는 느슨한 제한
app.use('/api/', generalApiLimiter);

console.log('✅ Rate Limiting 활성화: Claude API는 15분당 10,000회 제한');

// 🎫 이용권 시스템 API (이용권 미들웨어 전에 등록 - 검증 불필요)
app.post('/api/tickets/charge', chargeTicketsEndpoint);  // 이용권 충전
app.get('/api/tickets/check', getTicketsEndpoint);       // 이용권 조회

// engines 폴더도 정적 파일로 제공 (타로 데이터 접근용)
app.use('/engines', express.static('engines'));

// UTF-8 인코딩 설정 (한글 깨짐 방지)
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Claude API 클라이언트
console.log('🔑 Claude API 키 확인:', process.env.CLAUDE_API_KEY ? '✅ 존재' : '❌ 없음');

let anthropic;
try {
  anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
  });
  console.log('✅ Anthropic 클라이언트 초기화 성공');
  console.log('🔍 Anthropic 객체 구조:', Object.keys(anthropic));
  console.log('🔍 messages 존재 여부:', anthropic.messages ? '✅ 있음' : '❌ 없음');
} catch (error) {
  console.error('❌ Anthropic 클라이언트 초기화 실패:', error.message);
  anthropic = null;
}

// 꿈해몽 엔진 초기화
const dreamEngine = new DreamEngine();

// 타로 엔진 세션 저장소 (메모리)
const tarotSessions = new Map();

// 타로 카드 API
// 1. 시작 - 3장 카드 제시
app.post('/api/tarot/start', async (req, res) => {
  try {
    const { category } = req.body;
    
    console.log('🎴 [/api/tarot/start] 요청 받음:', { category });
    
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
    console.error('❌ 타로 시작 오류:', error);
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

// 🎴 타로 카드 API - 단일 엔드포인트 (프론트엔드용)
app.post('/api/tarot', checkTicketMiddleware, async (req, res) => {
  try {
    const { category, selectedCards } = req.body;
    
    console.log('🎴 [/api/tarot] 타로 해석 요청:', { category, 카드수: selectedCards?.length, isMasterMode: req.isMasterMode });

    if (!category || !selectedCards || selectedCards.length !== 5) {
      return res.status(400).json({ 
        success: false,
        error: '카테고리와 5장의 카드가 필요합니다.' 
      });
    }
    
    // 1. 카테고리 정보
    const categoryInfo = {
      'total': '총운',
      'personality': '성격',
      'daeun': '대운',
      'wealth': '재물운',
      'love': '애정운',
      'parents': '부모운',
      'siblings': '형제운',
      'children': '자녀운',
      'spouse': '배우자운',
      'social': '대인관계',
      'health': '건강운',
      'career': '직업운',
      'study': '학업운',
      'promotion': '승진운',
      'aptitude': '적성',
      'job': '직업추천',
      'business': '사업운',
      'move': '이동운',
      'travel': '여행운',
      'taekil': '택일',
      'sinsal': '신살'
    };

    // 2. 프롬프트 생성
    const positions = ['핵심', '과거', '미래', '조언', '결과'];
    let prompt = `당신은 전문 타로 리더입니다. 선택된 카테고리는 **${categoryInfo[category] || category}**입니다.\n\n`;
    prompt += `고객이 선택한 5장의 타로 카드를 아래와 같이 해석해주세요:\n\n`;
    
    selectedCards.forEach((card, i) => {
      const orientation = card.orientation === 'upright' ? '정방향' : '역방향';
      const keywords = card.orientation === 'upright' 
        ? card.keywords_upright?.join(', ') 
        : card.keywords_reversed?.join(', ');
      const meaning = card.orientation === 'upright'
        ? card.meaning_upright
        : card.meaning_reversed;
      
      prompt += `**${positions[i]}**: ${card.name_ko} (${card.name}) - ${orientation}\n`;
      prompt += `키워드: ${keywords}\n`;
      prompt += `기본 의미: ${meaning}\n`;
      
      // ⭐ 카테고리별 특화 해석 추가!
      if (card.category_meaning) {
        prompt += `${categoryInfo[category]} 관점 해석: ${card.category_meaning}\n`;
        console.log(`✅ ${card.name_ko} - 카테고리 해석 포함됨 (${card.category_meaning.length}자)`);
      } else {
        console.warn(`⚠️ ${card.name_ko} - 카테고리 해석 없음!`);
      }
      
      prompt += `\n`;
    });
    
    prompt += `\n위 5장의 카드를 바탕으로, ${categoryInfo[category]} 관점에서 다음과 같이 해석해주세요:\n\n`;
    prompt += `1. 각 카드의 위치(핵심/과거/미래/조언/결과)에 맞는 구체적인 해석\n`;
    prompt += `2. ${categoryInfo[category]}에 초점을 맞춘 실용적인 조언\n`;
    prompt += `3. 따뜻하고 공감하는 톤으로 작성\n`;
    prompt += `4. 각 카드당 2-3문장으로 명확하게 설명\n`;
    prompt += `5. **마지막에 반드시 종합 분석 추가** - 5장 카드의 흐름을 연결하여 ${categoryInfo[category]}의 전체적인 그림과 구체적인 조언 제시 (최소 5문장 이상)\n\n`;
    prompt += `응답 형식:\n`;
    prompt += `[핵심] ...\n`;
    prompt += `[과거] ...\n`;
    prompt += `[미래] ...\n`;
    prompt += `[조언] ...\n`;
    prompt += `[결과] ...\n\n`;
    prompt += `[종합분석]\n`;
    prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    prompt += `5장 카드의 흐름을 연결하여 ${categoryInfo[category]}의 전체적인 상황과 앞으로의 방향을 구체적으로 제시해주세요.\n`;
    prompt += `과거→핵심→미래→조언→결과의 스토리를 만들어주세요.\n`;
    prompt += `실용적이고 구체적인 행동 지침을 포함해주세요.\n`;
    prompt += `최소 5문장 이상으로 풍부하게 작성해주세요.`;

    // 3. Claude API 호출
    console.log('\n' + '='.repeat(80));
    console.log('🤖 Claude API 호출 중...');
    console.log('='.repeat(80));
    console.log(prompt);
    console.log('='.repeat(80) + '\n');
    
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    const interpretation = message.content[0].text;
    
    console.log('✅ AI 해석 완료:', interpretation.substring(0, 100) + '...');

    // 이용권 소모 (마스터 모드 제외)
    let remainingTickets = Infinity;
    if (!req.isMasterMode) {
      const ticketResult = await useTicket(req, '타로 카드');
      remainingTickets = ticketResult.remaining;
    }

    // 4. 결과 반환
    res.json({
      success: true,
      category: categoryInfo[category],
      interpretation: interpretation,
      cards: selectedCards,
      remaining_tickets: remainingTickets,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
        cost: (message.usage.input_tokens / 1000 * 0.00025 + message.usage.output_tokens / 1000 * 0.00125).toFixed(6)
      }
    });

  } catch (error) {
    console.error('❌ 타로 해석 오류:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 오늘의 운세 API
app.post('/api/daily-fortune', checkTicketMiddleware, async (req, res) => {
  try {
    const { year, month, day, hour, isLunar } = req.body;
    
    console.log('📥 오늘의 운세 요청:', JSON.stringify(req.body, null, 2));
    console.log('- year:', year, typeof year);
    console.log('- month:', month, typeof month);
    console.log('- day:', day, typeof day);
    console.log('- hour:', hour, typeof hour);
    console.log('- isLunar:', isLunar, typeof isLunar);
    
    // 입력 검증
    if (!year || !month || !day || hour === undefined) {
      console.error('❌ 입력 검증 실패: 필수 값 누락');
      return res.status(400).json({
        success: false,
        error: '생년월일시를 모두 입력해주세요'
      });
    }
    
    // 1. 사주 계산
    console.log('🔮 사주 계산 시작...');
    const fortuneData = getDailyFortuneBySaju({ year, month, day, hour, isLunar });
    
    if (!fortuneData.success) {
      console.error('❌ 사주 계산 실패:', fortuneData.error || '알 수 없는 오류');
      return res.status(400).json({ 
        success: false,
        error: fortuneData.error || '사주 계산 실패' 
      });
    }
    
    console.log('✅ 사주 계산 완료:', fortuneData.saju);
    
    // 2. 프롬프트 생성
    const prompt = generateDailyFortunePrompt(fortuneData);
    
    // 프롬프트 출력 (디버깅용)
    console.log('\n' + '='.repeat(70));
    console.log('[PROMPT TO CLAUDE]');
    console.log('='.repeat(70));
    console.log(prompt);
    console.log('='.repeat(70) + '\n');
    
    // 3. Claude API 호출
    console.log('Claude API 호출 중...');
    
    // Anthropic 클라이언트 체크
    if (!anthropic) {
      throw new Error('Anthropic 클라이언트가 초기화되지 않았습니다. API 키를 확인해주세요.');
    }
    
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
    
    // 이용권 소모 (마스터 모드 제외)
    let remainingTickets = Infinity;
    if (!req.isMasterMode) {
      const ticketResult = await useTicket(req, '오늘의 운세');
      remainingTickets = ticketResult.remaining;
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
      remaining_tickets: remainingTickets,
      cost: (message.usage.input_tokens / 1000 * 0.00025 + message.usage.output_tokens / 1000 * 0.00125).toFixed(6)
    });
    
    console.log('✅ 오늘의 운세 생성 완료!');
    
  } catch (error) {
    console.error('❌ 오늘의 운세 오류 상세:');
    console.error('- 메시지:', error.message);
    console.error('- 스택:', error.stack);
    console.error('- 요청 데이터:', req.body);
    
    res.status(500).json({ 
      success: false,
      error: `운세 생성 오류: ${error.message}` 
    });
  }
});

// 별자리 운세 API
app.post('/api/horoscope', checkTicketMiddleware, async (req, res) => {
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
      max_tokens: 800,  // 토큰 제한으로 길이 조절
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    // 4. 응답 파싱 (제어 문자 제거)
    const responseText = message.content[0].text;
    console.log('Claude 응답:', responseText.substring(0, 200) + '...');
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let fortuneResult;
    
    if (jsonMatch) {
      try {
        // JSON 파싱 전에 제어 문자 제거
        const cleanedJson = jsonMatch[0]
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 제어 문자 제거
          .replace(/\n/g, '\\n')  // 줄바꿈을 이스케이프
          .replace(/\r/g, '\\r')  // 캐리지 리턴을 이스케이프
          .replace(/\t/g, '\\t'); // 탭을 이스케이프
        
        fortuneResult = JSON.parse(cleanedJson);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError.message);
        console.log('문제가 된 JSON:', jsonMatch[0].substring(0, 500));
        // 파싱 실패 시 원본 텍스트 사용
        fortuneResult = { 운세: responseText };
      }
    } else {
      fortuneResult = { 운세: responseText };
    }
    
    // 이용권 소모 (마스터 모드 제외)
    let remainingTickets = Infinity;
    if (!req.isMasterMode) {
      const ticketResult = await useTicket(req, '별자리 운세');
      remainingTickets = ticketResult.remaining;
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
      remaining_tickets: remainingTickets,
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
app.post('/api/dream/interpret', checkTicketMiddleware, async (req, res) => {
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
    
    // 이용권 소모 (마스터 모드 제외)
    let remainingTickets = Infinity;
    if (!req.isMasterMode) {
      const ticketResult = await useTicket(req, '꿈 해몽');
      remainingTickets = ticketResult.remaining;
    }
    
    result.remaining_tickets = remainingTickets;
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
app.post('/api/compatibility', checkTicketMiddleware, async (req, res) => {
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
      model: 'claude-3-haiku-20240307',  // Haiku 사용 (비용 절감)
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    // 4. 응답 파싱
    const responseText = message.content[0].text;
    console.log('Claude 응답 원문:', responseText.substring(0, 500)); // 디버그용
    
    let fortuneResult;
    
    try {
      // JSON 추출 시도 (```json ... ``` 또는 { ... } 형식)
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        let jsonStr = jsonMatch[1] || jsonMatch[0];
        
        // JSON 문자열 내부의 줄바꿈 문자를 공백으로 치환 (JSON 파싱 오류 방지)
        jsonStr = jsonStr.replace(/\n/g, ' ').replace(/\r/g, ' ');
        
        fortuneResult = JSON.parse(jsonStr);
      } else {
        // JSON 형식이 아니면 텍스트 그대로 사용
        fortuneResult = { 궁합분석: responseText };
      }
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError.message);
      console.error('파싱 시도한 텍스트:', responseText.substring(0, 500));
      // 파싱 실패 시 텍스트 그대로 사용
      fortuneResult = { 궁합분석: responseText };
    }
    
    // 이용권 소모 (마스터 모드 제외)
    let remainingTickets = Infinity;
    if (!req.isMasterMode) {
      const ticketResult = await useTicket(req, '궁합 보기');
      remainingTickets = ticketResult.remaining;
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
      remaining_tickets: remainingTickets,
      cost: (message.usage.input_tokens / 1000 * 0.00025 + message.usage.output_tokens / 1000 * 0.00125).toFixed(6)
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
app.post('/api/tojeong', checkTicketMiddleware, async (req, res) => {
  try {
    const { year, month, day, isLunar, targetYear, category } = req.body;
    
    console.log('토정비결 요청:', { year, month, day, isLunar, targetYear, category });
    
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
    
    // 2. 프롬프트 생성 (카테고리 포함)
    const prompt = generateTojeongPrompt(tojeongData, category);
    
    // 프롬프트 길이 확인
    console.log('📝 프롬프트 길이:', prompt.length, '자');
    console.log('📝 프롬프트 미리보기:');
    console.log('='.repeat(80));
    console.log(prompt.substring(0, 500) + '...');
    console.log('='.repeat(80));
    
    // 3. Claude API 호출
    console.log('Claude API 호출 중...');
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,  // Haiku 최대 제한: 4096 (여유 4000)
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
    
    // 이용권 소모 (마스터 모드 제외)
    let remainingTickets = Infinity;
    if (!req.isMasterMode) {
      const ticketResult = await useTicket(req, '토정비결');
      remainingTickets = ticketResult.remaining;
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
      remaining_tickets: remainingTickets,
      cost: (
        message.usage.input_tokens / 1000 * 0.00025 + 
        message.usage.output_tokens / 1000 * 0.00125
      ).toFixed(6)
    });
    
    console.log('토정비결 생성 완료!');
    
  } catch (error) {
    console.error('❌ 토정비결 오류 상세:');
    console.error('- 메시지:', error.message);
    console.error('- 스택:', error.stack);
    console.error('- Claude API 키:', process.env.CLAUDE_API_KEY ? '설정됨' : '없음');
    
    res.status(500).json({ 
      success: false,
      error: `API 호출 실패: ${error.message}`
    });
  }
});

// 사주팔자 API ⭐ 새로 추가!
app.post('/api/saju', checkTicketMiddleware, async (req, res) => {
  try {
    const { year, month, day, hour, isLunar, gender, category } = req.body;
    
    // 🔍 디버그: 받은 데이터 출력
    console.log('📥 사주 API 요청 받음:', JSON.stringify(req.body, null, 2));
    console.log('- hour 타입:', typeof hour, '값:', hour);
    
    // ✅ 입력 검증 추가
    if (!year || !month || !day || hour === undefined) {
      console.error('❌ 입력 검증 실패: 필수 값 누락');
      return res.status(400).json({
        success: false,
        error: '생년월일시를 모두 입력해주세요'
      });
    }
    
    // 범위 검증
    if (year < 1900 || year > 2100) {
      return res.status(400).json({ success: false, error: '연도는 1900~2100 사이여야 합니다' });
    }
    if (month < 1 || month > 12) {
      return res.status(400).json({ success: false, error: '월은 1~12 사이여야 합니다' });
    }
    if (day < 1 || day > 31) {
      return res.status(400).json({ success: false, error: '일은 1~31 사이여야 합니다' });
    }
    if (hour < 0 || hour > 23) {
      return res.status(400).json({ success: false, error: '시간은 0~23 사이여야 합니다' });
    }
    if (gender && gender !== '남자' && gender !== '여자' && gender !== '남성' && gender !== '여성') {
      return res.status(400).json({ success: false, error: '성별은 남자/남성 또는 여자/여성이어야 합니다' });
    }
    
    // 성별 정규화 (남성 → 남자, 여성 → 여자)
    const normalizedGender = gender === '남성' ? '남자' : gender === '여성' ? '여자' : gender;
    
    console.log('사주팔자 요청:', { year, month, day, hour, gender: normalizedGender, category });
    
    // 1. 사주 엔진 계산
    console.log('🔧 사주 엔진 계산 시작...');
    const sajuEngine = new SajuEngine();
    
    console.log('1️⃣ calculateSaju 호출...');
    const saju = sajuEngine.calculateSaju({ year, month, day, hour, isLunar });
    console.log('✅ saju:', saju);
    
    console.log('2️⃣ calculateElements 호출...');
    const elements = sajuEngine.calculateElements(saju);
    console.log('✅ elements:', elements);
    
    console.log('3️⃣ calculateStrength 호출...');
    const strength = sajuEngine.calculateStrength(saju, elements);
    console.log('✅ strength:', strength);
    
    console.log('4️⃣ findYongsin 호출...');
    const yongsin = sajuEngine.findYongsin(strength, elements, saju.ilgan);
    console.log('✅ yongsin:', yongsin);
    
    console.log('5️⃣ calculateTenStars 호출...');
    const tenStars = sajuEngine.calculateTenStars(saju);
    console.log('✅ tenStars:', tenStars);
    
    const engineResult = {
      saju,
      ilgan: saju.ilgan,
      elements,
      strength,
      yongsin,
      tenStars
    };
    
    console.log('✅ 엔진 계산 완료:', engineResult);
    
    // 2. 카테고리별 추가 계산 (대운, 신살, 택일)
    const options = { gender: normalizedGender };
    
    // 대운 카테고리
    if (category === 'daeun') {
      const daeunList = SajuEngineExtended.calculateDaeun(year, month, day, hour, normalizedGender, isLunar);
      const currentAge = calculateAge(year, month, day);
      options.daeunList = daeunList;
      options.currentAge = currentAge;
      console.log('대운 계산 완료:', { currentAge, daeunCount: daeunList?.length });
    }
    
    // 신살 관련 카테고리 (신살, 이동운, 여행운)
    if (category === 'sinsal' || category === 'move' || category === 'travel') {
      const sinsal = SajuEngineExtended.calculateSinsal(saju);
      options.sinsal = sinsal;
      console.log('신살 계산 완료:', sinsal);
    }
    
    // 택일 카테고리
    if (category === 'taekil') {
      const today = new Date();
      const targetYear = today.getFullYear();
      const targetMonth = today.getMonth() + 1;
      const purpose = req.body.purpose || 'general'; // 프론트에서 목적 받기
      const taekilResults = SajuEngineExtended.calculateTaekil(targetYear, targetMonth, saju, purpose);
      options.taekilResults = taekilResults;
      options.purpose = purpose;
      console.log('택일 계산 완료:', { targetYear, targetMonth, purpose });
    }
    
    // 3. 프롬프트 생성
    const prompt = getSajuPrompt(category, engineResult, options);
    console.log('프롬프트 생성 완료');
    console.log('='.repeat(80));
    console.log('📝 Claude API 프롬프트:');
    console.log(prompt);
    console.log('='.repeat(80));
    
    // 3. Claude API 호출 (실제 연동)
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2500,  // 충분한 응답 길이 확보 (약 7500~10000자)
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
    
    console.log('='.repeat(80));
    console.log('✨ Claude API 응답:');
    console.log(interpretation);
    console.log('='.repeat(80));
    console.log(`💰 비용: $${cost} (입력: ${message.usage.input_tokens} 토큰, 출력: ${message.usage.output_tokens} 토큰)`);
    console.log('='.repeat(80));
    
    // 이용권 소모 (마스터 모드 제외)
    let remainingTickets = Infinity;
    if (!req.isMasterMode) {
      const ticketResult = await useTicket(req, '사주팔자');
      remainingTickets = ticketResult.remaining;
    }
    
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
      remaining_tickets: remainingTickets,
      cost // 실제 Claude API 비용
    });
    
    console.log('사주팔자 응답 완료!');
    
  } catch (error) {
    console.error('❌ 사주팔자 오류 상세:');
    console.error('- 메시지:', error.message);
    console.error('- 스택:', error.stack);
    console.error('- 요청 데이터:', req.body);
    
    res.status(500).json({
      success: false,
      error: `사주 계산 오류: ${error.message}`
    });
  }
});

// ========================================
// ⭐ 관리자 및 분석 시스템 초기화 (Phase 3)
// ========================================

// MongoDB 연결 설정
const { MongoClient } = require('mongodb');
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'fortune_platform';
let db;

// MongoDB 연결 및 라우터 초기화
MongoClient.connect(mongoUrl)
  .then(client => {
    console.log('✅ MongoDB 연결 성공');
    db = client.db(dbName);
    
    // 라우터에 DB 전달
    adminRouter.initDB(db);
    analyticsRouter.initDB(db);
    
    console.log('✅ 관리자 및 분석 시스템 초기화 완료');
  })
  .catch(error => {
    console.error('❌ MongoDB 연결 실패:', error.message);
    console.log('⚠️ 관리자 기능이 비활성화됩니다 (일반 운세 기능은 정상 작동)');
  });

// ========================================
// 관리자 & 분석 API 라우터 등록
// ========================================
app.use('/api/admin', adminRouter);
app.use('/api/analytics', analyticsRouter);

app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log(`🔮 운세 플랫폼 서버 실행 중!`);
  console.log(`📍 주소: http://localhost:${PORT}`);
  console.log(`🌐 프론트엔드: http://localhost:${PORT}/index.html`);
  console.log(`🔐 관리자 페이지: http://localhost:${PORT}/admin/login.html`);
  console.log('\n📋 일반 사용자 API:');
  console.log('  • POST /api/daily-fortune - 오늘의 운세');
  console.log('  • POST /api/horoscope - 별자리 운세');
  console.log('  • POST /api/compatibility - 궁합 보기');
  console.log('  • POST /api/tojeong - 토정비결');
  console.log('  • POST /api/saju - 사주팔자 ⭐');
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
  console.log('\n📊 관리자 API (Phase 3 - 새로 추가):');
  console.log('  • POST /api/admin/login - 관리자 로그인');
  console.log('  • GET  /api/admin/stats/today - 실시간 통계');
  console.log('  • GET  /api/admin/stats/visitors - 방문자 통계');
  console.log('  • GET  /api/admin/stats/coupang - 쿠팡 클릭 통계');
  console.log('  • GET  /api/admin/stats/features - 기능별 사용 통계');
  console.log('  • GET  /api/admin/settings/coupang-link - 쿠팡 링크 조회');
  console.log('  • PUT  /api/admin/settings/coupang-link - 쿠팡 링크 수정');
  console.log('  • GET  /api/admin/export - 데이터 내보내기');
  console.log('\n📈 분석 API (추적용):');
  console.log('  • POST /api/analytics/visit - 방문 기록');
  console.log('  • POST /api/analytics/coupang-click - 쿠팡 클릭 기록');
  console.log('  • POST /api/analytics/ticket-usage - 이용권 사용 기록');
  console.log('\n🎫 이용권 API (Phase 4 - IP 기반 보안):');
  console.log('  • POST /api/tickets/charge - 이용권 충전 (쿠팡 방문 후)');
  console.log('  • GET  /api/tickets/check - 이용권 조회');
  console.log('='.repeat(70));
  
  // 🎫 IP 기반 이용권 자동 초기화 스케줄러 시작
  // startAutoCleanup();  // 현재 ticket-check.js에서 자동으로 처리됨
});
