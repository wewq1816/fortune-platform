const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('HTML Title 수정');
console.log('========================================');

const fixes = [
    {
        file: 'frontend/pages/daily-fortune-test.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>오늘의운세 - 나만의운세</title>'
    },
    {
        file: 'frontend/pages/tarot-mock.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>타로카드 - 나만의운세</title>'
    },
    {
        file: 'frontend/pages/saju-test.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>사주팔자 - 나만의운세</title>'
    },
    {
        file: 'frontend/pages/tojeong-test.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>토정비결 - 나만의운세</title>'
    },
    {
        file: 'frontend/pages/dream.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>꿈해몽 - 나만의운세</title>'
    },
    {
        file: 'frontend/pages/horoscope.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>별자리운세 - 나만의운세</title>'
    },
    {
        file: 'frontend/pages/lotto.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>로또번호 - 나만의운세</title>'
    },
    {
        file: 'frontend/pages/compatibility-test.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>궁합보기 - 나만의운세</title>'
    },
    {
        file: 'frontend/pages/coupang-gate.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>이용권 충전 - 나만의운세</title>'
    },
    {
        file: 'frontend/index.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>나만의운세 - 오늘의 운세를 확인하세요</title>'
    },
    {
        file: 'frontend/admin/login.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>관리자 로그인 - 나만의운세</title>'
    },
    {
        file: 'frontend/admin/dashboard.html',
        oldTitle: /<title>.*?<\/title>/,
        newTitle: '<title>관리자 대시보드 - 나만의운세</title>'
    }
];

let count = 0;

fixes.forEach(({ file, oldTitle, newTitle }) => {
    const fullPath = path.join(__dirname, file);
    
    if (fs.existsSync(fullPath)) {
        try {
            console.log(`\n처리중: ${file}`);
            
            // 파일 읽기 (UTF-8)
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // title 교체
            content = content.replace(oldTitle, newTitle);
            
            // 저장
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
