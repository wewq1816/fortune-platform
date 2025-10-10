const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('UTF-8 인코딩 수정 시작');
console.log('========================================');

const files = [
    'frontend/pages/daily-fortune-test.html',
    'frontend/pages/tarot-mock.html',
    'frontend/pages/saju-test.html',
    'frontend/pages/tojeong-test.html',
    'frontend/pages/dream.html',
    'frontend/pages/horoscope.html',
    'frontend/pages/lotto.html',
    'frontend/pages/compatibility-test.html',
    'frontend/pages/coupang-gate.html',
    'frontend/index.html',
    'frontend/admin/login.html',
    'frontend/admin/dashboard.html'
];

let count = 0;

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    
    if (fs.existsSync(fullPath)) {
        try {
            console.log(`\n처리중: ${file}`);
            
            // 파일을 읽기 (자동 인코딩 감지)
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // UTF-8로 다시 쓰기
            fs.writeFileSync(fullPath, content, 'utf8');
            
            console.log(`✅ 성공: ${file}`);
            count++;
        } catch (error) {
            console.log(`❌ 실패: ${file} - ${error.message}`);
        }
    } else {
        console.log(`⚠️ 파일 없음: ${file}`);
    }
});

console.log('\n========================================');
console.log(`완료: ${count}개 파일 처리됨`);
console.log('========================================');
