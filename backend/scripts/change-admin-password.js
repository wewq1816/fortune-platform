/**
 * 관리자 비밀번호 변경 스크립트
 * 
 * 사용법:
 * node backend/scripts/change-admin-password.js
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'fortune_platform';

async function changePassword() {
  let client;
  
  try {
    console.log('🔐 관리자 비밀번호 변경 스크립트');
    console.log('='.repeat(70));
    
    // 새 비밀번호 입력 받기
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = (query) => new Promise((resolve) => rl.question(query, resolve));
    
    console.log('\n⚠️ 주의: 새 비밀번호는 최소 8자 이상, 영문+숫자+특수문자 조합을 권장합니다.\n');
    
    const newPassword = await question('새 비밀번호를 입력하세요: ');
    
    if (newPassword.length < 8) {
      console.error('❌ 비밀번호는 최소 8자 이상이어야 합니다.');
      rl.close();
      process.exit(1);
    }
    
    const confirmPassword = await question('비밀번호를 다시 입력하세요: ');
    
    if (newPassword !== confirmPassword) {
      console.error('❌ 비밀번호가 일치하지 않습니다.');
      rl.close();
      process.exit(1);
    }
    
    rl.close();
    
    console.log('\n📡 MongoDB 연결 중...');
    client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    
    console.log('✅ MongoDB 연결 성공');
    
    // 비밀번호 해싱
    console.log('🔒 비밀번호 암호화 중...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // DB 업데이트
    console.log('💾 데이터베이스 업데이트 중...');
    const result = await db.collection('admin_users').updateOne(
      { username: 'cooal' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      console.error('❌ 관리자 계정을 찾을 수 없습니다.');
      console.log('💡 먼저 node backend/scripts/init-admin.js를 실행하세요.');
      await client.close();
      process.exit(1);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ 비밀번호 변경 완료!');
    console.log('='.repeat(70));
    console.log('📌 아이디: cooal');
    console.log('📌 새 비밀번호: ' + '*'.repeat(newPassword.length));
    console.log('\n🔐 http://localhost:3000/admin/login.html 에서 로그인하세요.');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

changePassword();
