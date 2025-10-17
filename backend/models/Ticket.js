/**
 * 티켓 모델 및 헬퍼 함수
 */

const { getDB } = require('../config/mongodb');

// 다음날 자정(KST) 계산
function getNextMidnightKST() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
  
  koreaTime.setHours(24, 0, 0, 0); // 다음날 자정
  
  return koreaTime;
}

// 오늘 날짜 (YYYY-MM-DD, KST)
function getTodayKST() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  
  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
  const day = String(koreaTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

class TicketModel {
  static async getCollection() {
    const db = getDB();
    return db.collection('tickets');
  }
  
  // 티켓 조회
  static async findByDeviceId(deviceId) {
    const collection = await this.getCollection();
    const today = getTodayKST();
    
    return await collection.findOne({ deviceId, date: today });
  }
  
  // 티켓 생성
  static async create(deviceId, data) {
    const collection = await this.getCollection();
    const today = getTodayKST();
    
    const ticket = {
      deviceId,
      date: today,
      tickets: data.tickets || 0,
      charged: data.charged || false,
      usedFeatures: data.usedFeatures || [],
      createdAt: new Date(),
      expiresAt: getNextMidnightKST()
    };
    
    await collection.insertOne(ticket);
    return ticket;
  }
  
  // 티켓 업데이트
  static async update(deviceId, data) {
    const collection = await this.getCollection();
    const today = getTodayKST();
    
    await collection.updateOne(
      { deviceId, date: today },
      { $set: data }
    );
  }
  
  // 인덱스 초기화
  static async ensureIndexes() {
    const collection = await this.getCollection();
    
    try {
      // 복합 유니크 인덱스
      await collection.createIndex(
        { deviceId: 1, date: 1 },
        { unique: true }
      );
      
      // TTL 인덱스 (자정 자동 삭제)
      await collection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
      );
      
      console.log('[Ticket] 인덱스 생성 완료');
    } catch (error) {
      console.error('[Ticket] 인덱스 생성 실패:', error.message);
    }
  }
}

module.exports = {
  TicketModel,
  getTodayKST,
  getNextMidnightKST
};
