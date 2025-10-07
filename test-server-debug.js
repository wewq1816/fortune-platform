// 서버 디버그 모드로 실행
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

console.log('1. 모듈 로딩 완료');

const { getDailyFortuneBySaju } = require('./engines/core/daily-engine');
const { generateDailyFortunePrompt } = require('./engines/prompts/daily-fortune-prompt');
const { getHoroscopeFortune } = require('./engines/core/horoscope-engine');
const { generateHoroscopePrompt } = require('./engines/prompts/horoscope-prompt');

console.log('2. 엔진 로딩 완료');

const DreamEngine = require('./engines/core/dream-engine');
console.log('3. DreamEngine 로딩 완료');

const { calculateCompatibility } = require('./engines/core/compatibility-engine');
const { generateCompatibilityPrompt } = require('./engines/prompts/compatibility-prompt');
const { calculateTojeong } = require('./engines/core/tojeong-engine');
const { generateTojeongPrompt } = require('./engines/prompts/tojeong-prompt');
const SajuEngine = require('./engines/core/saju-engine');
const SajuEngineExtended = require('./engines/core/saju-engine-extended');
const { getSajuPrompt } = require('./backend/prompts/saju-prompt');
const { TarotEngine } = require('./engines/core/tarot-engine');
const { generateTarotPrompt } = require('./backend/prompts/tarot-prompt');

console.log('4. 모든 엔진 로딩 완료');

const app = express();
const PORT = 3000;

console.log('5. Express 앱 생성 완료');

// Unhandled rejection 핸들러
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('❌ Reason:', reason);
});

// Uncaught exception 핸들러
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log('✅ 서버가 포트', PORT, '에서 실행 중!');
  console.log('서버가 정상적으로 시작되었습니다.');
});

console.log('6. app.listen() 호출 완료');
