const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../../.env' }); // .env 파일 로드

// 환경 변수 검증
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.error('❌ 오류: .env 파일에 ADMIN_USERNAME과 ADMIN_PASSWORD가 설정되지 않았습니다.');
  console.error('   .env 파일에 다음 항목을 추가하세요:');
  console.error('   ADMIN_USERNAME=cooal');
  console.error('   ADMIN_PASSWORD=your_secure_password');
  process.exit(1);
}

// MongoDB 연결 URI (환경 변수 사용)
const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'fortune_platform';

async function initAdmin() {
  let client;
  
  try {
    console.log('🔄 MongoDB 연결 중...');
    client = await MongoClient.connect(MONGO_URI);
    console.log('✅ MongoDB 연결 성공');
    
    const db = client.db(DB_NAME);
    
    // 1. 관리자 계정 생성
    console.log('\n📝 관리자 계정 생성 중...');
    
    // 환경 변수에서 관리자 정보 가져오기
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // 비밀번호 해싱 (salt rounds: 12 - 보안 강화)
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // 기존 admin 계정 삭제 (있다면)
    await db.collection('admin_users').deleteMany({ username: 'admin' });
    
    // 계정 확인
    const existingAdmin = await db.collection('admin_users').findOne({ username: adminUsername });
    
    if (existingAdmin) {
      console.log('⚠️  관리자 계정이 이미 존재합니다.');
      console.log('   비밀번호를 업데이트합니다...');
      await db.collection('admin_users').updateOne(
        { username: adminUsername },
        { 
          $set: { 
            password: hashedPassword,
            updatedAt: new Date()
          }
        }
      );
    } else {
      await db.collection('admin_users').insertOne({
        username: adminUsername,
        password: hashedPassword,
        createdAt: new Date(),
        lastLogin: null
      });
      console.log('✅ 관리자 계정 생성 완료');
    }
    
    console.log(`   ID: ${adminUsername}`);
    console.log(`   비밀번호: ******** (보안상 표시하지 않음)`);
    console.log(`   📌 실제 비밀번호는 .env 파일을 확인하세요`);
    
    // 2. 초기 설정 저장
    console.log('\n📝 초기 설정 저장 중...');
    const existingSettings = await db.collection('admin_settings').findOne({});
    
    if (existingSettings) {
      console.log('⚠️  설정이 이미 존재합니다. 유지합니다.');
    } else {
      await db.collection('admin_settings').insertOne({
        coupangLink: 'https://link.coupang.com/a/기존링크', // TODO: 실제 링크로 변경
        updatedAt: new Date(),
        updatedBy: 'system'
      });
      console.log('✅ 초기 설정 저장 완료');
    }
    
    // 3. 컬렉션 인덱스 생성
    console.log('\n📝 데이터베이스 인덱스 생성 중...');
    
    // 방문자 인덱스
    await db.collection('analytics_visitors').createIndex({ visitDate: 1 });
    await db.collection('analytics_visitors').createIndex({ visitorId: 1 });
    
    // 쿠팡 클릭 인덱스
    await db.collection('analytics_coupang_clicks').createIndex({ clickDate: 1 });
    await db.collection('analytics_coupang_clicks').createIndex({ visitorId: 1 });
    
    // 이용권 사용 인덱스
    await db.collection('analytics_ticket_usage').createIndex({ usageDate: 1 });
    await db.collection('analytics_ticket_usage').createIndex({ feature: 1 });
    
    console.log('✅ 인덱스 생성 완료');
    
    // 4. 테스트 데이터 생성 (선택사항)
    console.log('\n📝 테스트 데이터 생성 중...');
    
    const today = new Date().toISOString().split('T')[0];
    
    // 오늘 테스트 방문자 3명
    for (let i = 1; i <= 3; i++) {
      await db.collection('analytics_visitors').insertOne({
        visitorId: `test_visitor_${i}`,
        visitDate: today,
        visitTime: new Date(),
        visitHour: new Date().getHours(),
        visitDay: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][new Date().getDay()],
        userAgent: 'Mozilla/5.0 (Test)',
        isReturning: false
      });
    }
    
    console.log('✅ 테스트 방문자 3명 추가');
    
    // 오늘 테스트 쿠팡 클릭 1건
    await db.collection('analytics_coupang_clicks').insertOne({
      visitorId: 'test_visitor_1',
      clickDate: today,
      clickTime: new Date(),
      clickHour: new Date().getHours()
    });
    
    console.log('✅ 테스트 쿠팡 클릭 1건 추가');
    
    // 오늘 테스트 이용권 사용 5건
    const features = ['오늘의 운세', '타로 카드', '사주팔자', '토정비결', '꿈 해몽'];
    for (const feature of features) {
      await db.collection('analytics_ticket_usage').insertOne({
        visitorId: 'test_visitor_1',
        feature,
        usageDate: today,
        usageTime: new Date(),
        usageHour: new Date().getHours()
      });
    }
    
    console.log('✅ 테스트 이용권 사용 5건 추가');
    
    console.log('\n🎉 관리자 시스템 초기화 완료!');
    console.log('\n📌 다음 단계:');
    console.log('   1. 서버 실행: npm start');
    console.log('   2. 관리자 페이지 접속: http://localhost:3000/admin/login.html');
    console.log('   3. 로그인: cooal / dkssud11@@');
    
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 MongoDB가 실행되지 않았습니다!');
      console.error('   해결 방법:');
      console.error('   1. MongoDB 설치 확인');
      console.error('   2. MongoDB 서비스 시작:');
      console.error('      - Windows: net start MongoDB');
      console.error('      - Mac/Linux: sudo service mongod start');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔒 MongoDB 연결 종료');
    }
  }
}

// 스크립트 실행
initAdmin();
