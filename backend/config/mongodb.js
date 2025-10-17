/**
 * MongoDB 클라이언트 싱글톤
 * 티켓 시스템 전용 DB 접근
 */

const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connectMongoDB() {
  if (db) {
    return db;
  }
  
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
  const dbName = process.env.DB_NAME || 'fortune_platform';
  
  try {
    client = await MongoClient.connect(mongoUrl);
    db = client.db(dbName);
    
    console.log('[MongoDB Ticket] 연결 성공');
    
    return db;
  } catch (error) {
    console.error('[MongoDB Ticket] 연결 실패:', error.message);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('MongoDB가 연결되지 않았습니다');
  }
  return db;
}

module.exports = {
  connectMongoDB,
  getDB
};
