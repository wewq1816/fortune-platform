/**
 * 디바이스 ID 기반 이용권 초기화 스크립트
 * 특정 디바이스의 이용권을 리셋합니다
 */

const readline = require('readline');

// 콘솔 입력 인터페이스
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('='.repeat(70));
console.log('🎫 이용권 초기화 도구');
console.log('='.repeat(70));
console.log();
console.log('📌 디바이스 ID는 브라우저 콘솔(F12)에서 확인하세요:');
console.log('   localStorage.getItem("deviceId")');
console.log();
console.log('💡 "all"을 입력하면 모든 이용권을 초기화합니다.');
console.log();

rl.question('초기화할 디바이스 ID를 입력하세요 (또는 "all"): ', (input) => {
  const deviceId = input.trim();
  
  if (!deviceId) {
    console.log('❌ 디바이스 ID를 입력하지 않았습니다.');
    rl.close();
    return;
  }
  
  if (deviceId.toLowerCase() === 'all') {
    console.log();
    console.log('⚠️  모든 이용권을 초기화합니다!');
    console.log('   메모리에 저장된 모든 디바이스의 이용권이 삭제됩니다.');
    console.log();
    
    rl.question('정말 진행하시겠습니까? (yes/no): ', (confirm) => {
      if (confirm.toLowerCase() === 'yes') {
        console.log();
        console.log('🧹 서버를 재시작하면 모든 이용권이 초기화됩니다.');
        console.log('   또는 Redis를 사용 중이라면 Redis를 재시작하세요.');
      } else {
        console.log('❌ 취소되었습니다.');
      }
      rl.close();
    });
  } else {
    console.log();
    console.log(`✅ 디바이스 ID: ${deviceId}`);
    console.log();
    console.log('📝 초기화 방법:');
    console.log();
    console.log('1. 브라우저 콘솔(F12)에서 실행:');
    console.log('   localStorage.removeItem("deviceId");');
    console.log('   localStorage.removeItem("lastVisitDate");');
    console.log('   localStorage.removeItem("fortune_tickets");');
    console.log();
    console.log('2. 또는 http://localhost:3000/test-reset.html 접속 후');
    console.log('   "LocalStorage 초기화" 버튼 클릭');
    console.log();
    console.log('3. 페이지 새로고침 → 새로운 방문자로 인식됨');
    console.log();
    rl.close();
  }
});
