const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkCoupangLink() {
  const client = new MongoClient(process.env.MONGO_URL);
  
  try {
    console.log('MongoDB 연결 중...');
    await client.connect();
    
    const db = client.db(process.env.DB_NAME || 'fortune_platform');
    
    // 쿠팡 링크 설정 조회
    const settings = await db.collection('admin_settings').findOne();
    
    if (settings && settings.coupangLink) {
      console.log('');
      console.log('===========================================');
      console.log('현재 설정된 쿠팡 링크:');
      console.log('===========================================');
      console.log(settings.coupangLink);
      console.log('');
      console.log('마지막 업데이트:', settings.updatedAt || '정보 없음');
      console.log('수정자:', settings.updatedBy || '정보 없음');
      console.log('===========================================');
    } else {
      console.log('');
      console.log('===========================================');
      console.log('⚠️  쿠팡 링크가 설정되지 않았습니다.');
      console.log('기본값 사용 중: https://www.coupang.com/?src=fortune-platform');
      console.log('===========================================');
    }
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await client.close();
    console.log('');
    console.log('MongoDB 연결 종료');
  }
}

checkCoupangLink();
