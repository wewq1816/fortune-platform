/**
 * Redis 클라이언트 설정 (사용 안함 - MongoDB로 전환)
 * 
 * 참고: 2025-10-17 MongoDB 티켓 시스템으로 전환
 * 이 파일은 나중을 위해 보관
 */

/*
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

let redisErrorShown = false;

redisClient.on('connect', () => {
  console.log('[Redis] 연결 성공');
  redisErrorShown = false;
});

redisClient.on('error', (err) => {
  if (!redisErrorShown) {
    console.error('[Redis] 오류:', err.message);
    console.warn('[Redis] 없이 실행');
    redisErrorShown = true;
  }
});

redisClient.on('ready', () => {
  console.log('[Redis] 준비 완료');
});

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('[Redis] 초기 연결 실패:', error.message);
    console.warn('[Redis] 없이 실행');
  }
})();

function getTicketKey(deviceId, date) {
  return `ticket:${deviceId}:${date}`;
}

async function setTicketData(deviceId, date, data) {
  if (!isRedisConnected()) {
    return false;
  }
  
  try {
    const key = getTicketKey(deviceId, date);
    await redisClient.set(key, JSON.stringify(data), {
      EX: 86400
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function getTicketData(deviceId, date) {
  if (!isRedisConnected()) {
    return null;
  }
  
  try {
    const key = getTicketKey(deviceId, date);
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

function isRedisConnected() {
  return redisClient.isOpen;
}

module.exports = {
  redisClient,
  getTicketKey,
  setTicketData,
  getTicketData,
  isRedisConnected
};
*/

// MongoDB로 전환되어 더 이상 사용하지 않음
console.warn('[Redis] 이 파일은 더 이상 사용되지 않습니다 (MongoDB 사용)');

module.exports = {
  redisClient: null,
  getTicketKey: () => null,
  setTicketData: () => false,
  getTicketData: () => null,
  isRedisConnected: () => false
};
