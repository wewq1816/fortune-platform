const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('Charset을 EUC-KR로 변경 (임시 해결)');
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
            
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // UTF-8 → EUC-KR
            content = content.replace(
                /<meta charset="UTF-8">/gi,
                '<meta charset="EUC-KR">'
            );
            
            fs.writeFileSync(fullPath, content, 'utf8');
            
            console.log(`✅ 성공`);
            count++;
        } catch (error) {
            console.log(`❌ 실패: ${error.message}`);
        }
    } else {
        console.log(`⚠️ 파일 없음`);
    }
});

console.log('\n========================================');
console.log(`완료: ${count}개 파일 처리됨`);
console.log('========================================');
console.log('\n⚠️ 주의: 이것은 임시 해결책입니다.');
console.log('근본적인 해결을 위해서는 파일을 UTF-8로 다시 작성해야 합니다.');
