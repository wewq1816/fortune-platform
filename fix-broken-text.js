const fs = require('fs');
const path = require('path');

// 깨진 텍스트 → 정상 텍스트 매핑
const textReplacements = {
    // 공통 텍스트
    '?�끇�뮎???�똻苑�': '오늘의운세',
    '?�뒛???�똻苑�': '오늘의운세',
    '?怨뺚봺???�똻苑�': '나만의운세',
    '?ㅻ뒛???댁꽭': '오늘의운세',
    '?곕━???댁꽭': '나만의운세',
    '?�궗二쇰�붾옄': '사주팔자',
    '??��?留뚯뼱�졇��?': '어떻게 만들어졌을까?',
    '?��?�뿤媛�': '어떤가요',
    
    // 버튼 텍스트
    '?좎옄由�': '자세히',
    '?ㅼ씠�⑺퉬湲�': '이용권보기',
    '?�뙩援щ룆�뒗諛⑸쾿': '확인하는방법',
    '?꾨━怨좊���먮뱶由�': '나리고보드리',
    '?댁슜沅뚮낯湲�': '이용권보기',
    
    // 기타
    '?�뼱?': '오늘',
    '?⑤낯': '운세',
    '諛⑸Ц': '방문'
};

// 파일별 처리
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

console.log('========================================');
console.log('깨진 텍스트 수정 시작');
console.log('========================================');

let totalReplacements = 0;

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    
    if (fs.existsSync(fullPath)) {
        try {
            console.log(`\n처리중: ${file}`);
            
            let content = fs.readFileSync(fullPath, 'utf8');
            let replacements = 0;
            
            // 모든 교체 적용
            Object.entries(textReplacements).forEach(([broken, correct]) => {
                const before = content.length;
                content = content.split(broken).join(correct);
                const after = content.length;
                
                if (before !== after) {
                    replacements++;
                    console.log(`  - "${broken}" → "${correct}"`);
                }
            });
            
            if (replacements > 0) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`✅ ${replacements}개 교체 완료`);
                totalReplacements += replacements;
            } else {
                console.log(`⚠️ 교체할 항목 없음`);
            }
            
        } catch (error) {
            console.log(`❌ 실패: ${error.message}`);
        }
    } else {
        console.log(`⚠️ 파일 없음: ${file}`);
    }
});

console.log('\n========================================');
console.log(`완료: 총 ${totalReplacements}개 교체됨`);
console.log('========================================');
