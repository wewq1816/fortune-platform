/**
 * Analytics 데이터 초기화 스크립트
 * 모든 분석 데이터를 삭제하고 깨끗하게 시작
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'fortune_platform';

async function clearAnalytics() {
  console.log('🔄 MongoDB 연결 중...');
  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    console.log('✅ MongoDB 연결 성공\n');
    
    const db = client.db(DB_NAME);
    
    // 1. 방문자 데이터 삭제
    console.log('🗑️  방문자 데이터 삭제 중...');
    const visitorsResult = await db.collection('analytics_visitors').deleteMany({});
    console.log(`✅ ${visitorsResult.deletedCount}개 방문자 기록 삭제\n`);
    
    // 2. 쿠팡 클릭 데이터 삭제
    console.log('🗑️  쿠팡 클릭 데이터 삭제 중...');
    const clicksResult = await db.collection('analytics_coupang_clicks').deleteMany({});
    console.log(`✅ ${clicksResult.deletedCount}개 클릭 기록 삭제\n`);
    
    // 3. 이용권 사용 데이터 삭제
    console.log('🗑️  이용권 사용 데이터 삭제 중...');
    const usageResult = await db.collection('analytics_ticket_usage').deleteMany({});
    console.log(`✅ ${usageResult.deletedCount}개 사용 기록 삭제\n`);
    
    console.log('🎉 모든 분석 데이터가 초기화되었습니다!');
    console.log('\n📌 다음 단계:');
    console.log('   1. 서버가 실행 중이면 재시작해주세요');
    console.log('   2. 브라우저에서 관리자 대시보드 새로고침');
    console.log('   3. 통계가 0부터 다시 시작됩니다');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await client.close();
    console.log('\n🔒 MongoDB 연결 종료');
  }
}

clearAnalytics();
