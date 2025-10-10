const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

console.log('========================================');
console.log('EUC-KR → UTF-8 완전 변환');
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
            
            // 1단계: 바이너리로 읽기
            const buffer = fs.readFileSync(fullPath);
            
            // 2단계: EUC-KR로 디코딩 시도
            let content;
            try {
                content = iconv.decode(buffer, 'euc-kr');
                console.log('  - EUC-KR 디코딩 성공');
            } catch (e) {
                // EUC-KR 실패시 UTF-8 시도
                content = buffer.toString('utf8');
                console.log('  - UTF-8로 읽음');
            }
            
            // 3단계: charset을 UTF-8로 수정
            content = content.replace(
                /<meta charset="EUC-KR">/gi,
                '<meta charset="UTF-8">'
            );
            
            // 4단계: UTF-8로 저장
            const utf8Buffer = Buffer.from(content, 'utf8');
            fs.writeFileSync(fullPath, utf8Buffer);
            
            console.log(`✅ 성공: UTF-8로 저장됨`);
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
