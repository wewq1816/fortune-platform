const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initAdmin() {
  const client = new MongoClient(process.env.MONGO_URL);
  
  try {
    console.log('MongoDB 연결 중...');
    await client.connect();
    
    const db = client.db(process.env.DB_NAME || 'fortune_platform');
    const adminCollection = db.collection('admin_users');
    
    // 기존 관리자 계정 확인
    const existingAdmin = await adminCollection.findOne({ 
      username: process.env.ADMIN_USERNAME 
    });
    
    if (existingAdmin) {
      console.log('이미 관리자 계정이 존재합니다.');
      console.log('아이디:', process.env.ADMIN_USERNAME);
      return;
    }
    
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    
    // 관리자 계정 생성
    const adminUser = {
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: null
    };
    
    await adminCollection.insertOne(adminUser);
    
    console.log('관리자 계정이 생성되었습니다!');
    console.log('아이디:', process.env.ADMIN_USERNAME);
    console.log('비밀번호:', process.env.ADMIN_PASSWORD);
    console.log('');
    console.log('로그인 URL: https://fortune-platform.vercel.app/admin/login.html');
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await client.close();
    console.log('MongoDB 연결 종료');
  }
}

initAdmin();
