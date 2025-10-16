const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server.js');

console.log('==================================================');
console.log('이용권 소모 위치 수정 (Claude API 성공 후로 이동)');
console.log('==================================================');

// 백업
const backup = path.join(__dirname, `server.js.backup.ticket-fix.${Date.now()}`);
fs.copyFileSync(serverPath, backup);
console.log(`[1/3] 백업 생성: ${path.basename(backup)}`);

let content = fs.readFileSync(serverPath, 'utf8');

// 사주팔자 API 수정
const oldPattern = `    console.log('사주팔자 요청:', { year, month, day, hour, gender: normalizedGender, category });
    
    // 🎫 이용권 소모
    const ticketResult = useTicket(req, '사주팔자');
    if (!ticketResult.success && !req.isMasterMode) {
      return res.status(403).json({
        success: false,
        error: '이용권이 부족합니다',
        remaining: 0
      });
    }
    
    // 1. 사주 엔진 계산`;

const newPattern = `    console.log('사주팔자 요청:', { year, month, day, hour, gender: normalizedGender, category });
    
    // 1. 사주 엔진 계산`;

if (content.includes(oldPattern)) {
  content = content.replace(oldPattern, newPattern);
  console.log('[2/3] 사주팔자 API: 이용권 소모 제거 완료');
} else {
  console.log('[2/3] 사주팔자 API: 패턴을 찾을 수 없음');
}

// Claude API 성공 후 이용권 소모 추가
const costPattern = `    console.log('='.repeat(80));
    console.log(\`💰 비용: $\${cost} (입력: \${message.usage.input_tokens} 토큰, 출력: \${message.usage.output_tokens} 토큰)\`);
    console.log('='.repeat(80));
    
    // 4. 결과 반환`;

const newCostPattern = `    console.log('='.repeat(80));
    console.log(\`💰 비용: $\${cost} (입력: \${message.usage.input_tokens} 토큰, 출력: \${message.usage.output_tokens} 토큰)\`);
    console.log('='.repeat(80));
    
    // 4. 이용권 소모 (Claude API 성공 후)
    const ticketResult = await useTicket(req, '사주팔자');
    if (!ticketResult.success && !req.isMasterMode) {
      console.log('경고: 이용권 소모 실패했지만 이미 응답 생성 완료');
    }
    
    // 5. 결과 반환`;

if (content.includes(costPattern)) {
  content = content.replace(costPattern, newCostPattern);
  console.log('[3/3] Claude API 성공 후 이용권 소모 추가 완료');
} else {
  console.log('[3/3] 비용 패턴을 찾을 수 없음');
}

// 저장
fs.writeFileSync(serverPath, content, 'utf8');

console.log('==================================================');
console.log('완료! 이제 API 오류 발생 시 이용권이 소모되지 않습니다.');
console.log('==================================================');
console.log('');
console.log('다음 단계:');
console.log('1. node server.js 실행');
console.log('2. 사주팔자 테스트 (잘못된 데이터 입력)');
console.log('3. 오류 발생해도 이용권 유지 확인');
console.log('');
