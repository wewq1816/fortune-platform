/**
 * 🗄️ Redis 클라이언트 설정
 * 
 * 디바이스 ID 기반 이용권 시스템용 Redis 저장소
 */

const redis = require('redis');

// ============================================
// 🔌 Redis 클라이언트 생성
// ============================================

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// ============================================
// 📡 Redis 연결 이벤트
// ============================================

let redisErrorShown = false; // 에러 메시지 1번만 표시

redisClient.on('connect', () => {
  console.log('✅ Redis 연결 성공');
  redisErrorShown = false; // 연결 성공하면 에러 플래그 리셋
});

redisClient.on('error', (err) => {
  if (!redisErrorShown) {
    console.error('❌ Redis 오류:', err.message);
    console.warn('⚠️ Redis 없이 실행 (메모리 모드로 폴백)');
    redisErrorShown = true;
  }
});

redisClient.on('ready', () => {
  console.log('🚀 Redis 준비 완료');
});

// 초기 연결
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis 초기 연결 실패:', error.message);
    console.warn('⚠️ Redis 없이 실행 (메모리 모드로 폴백)');
  }
})();

// ============================================
// 🎯 헬퍼 함수들
// ============================================

/**
 * 이용권 키 생성
 * @param {string} deviceId - 디바이스 ID
 * @param {string} date - 날짜 (YYYY-MM-DD)
 */
function getTicketKey(deviceId, date) {
  return `ticket:${deviceId}:${date}`;
}

/**
 * 이용권 데이터 저장
 */
async function setTicketData(deviceId, date, data) {
  if (!isRedisConnected()) {
    return false; // 조용히 실패 (메모리 모드 사용)
  }
  
  try {
    const key = getTicketKey(deviceId, date);
    await redisClient.set(key, JSON.stringify(data), {
      EX: 86400 // 24시간 후 자동 삭제
    });
    return true;
  } catch (error) {
    return false; // 에러 메시지 출력 안함
  }
}

/**
 * 이용권 데이터 조회
 */
async function getTicketData(deviceId, date) {
  if (!isRedisConnected()) {
    return null; // 조용히 실패 (메모리 모드 사용)
  }
  
  try {
    const key = getTicketKey(deviceId, date);
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null; // 에러 메시지 출력 안함
  }
}

/**
 * Redis 연결 상태 확인
 */
function isRedisConnected() {
  return redisClient.isOpen;
}

// ============================================
// 🌐 모듈 익스포트
// ============================================

module.exports = {
  redisClient,
  getTicketKey,
  setTicketData,
  getTicketData,
  isRedisConnected
};
