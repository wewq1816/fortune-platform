/**
 * 꿈해몽 데이터 문법 수정 스크립트
 * 
 * 목적: dream-db.json의 조사 오류 수정
 * - "은(는)" → 올바른 조사
 * - "을(를)" → 올바른 조사
 * - "이(가)" → 올바른 조사
 */

const fs = require('fs');
const path = require('path');

/**
 * 한글 받침 체크 함수
 */
function hasFinalConsonant(word) {
  if (!word || word.length === 0) return false;
  
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);
  
  // 한글 범위 체크
  if (code < 0xAC00 || code > 0xD7A3) return false;
  
  // 받침 있음: (code - 0xAC00) % 28 !== 0
  return (code - 0xAC00) % 28 !== 0;
}

/**
 * 올바른 조사 반환
 */
function getJosa(word, type) {
  const hasFinal = hasFinalConsonant(word);
  
  switch(type) {
    case 'subject':  // 주격 조사
      return hasFinal ? '이' : '가';
    case 'topic':    // 주제격 조사
      return hasFinal ? '은' : '는';
    case 'object':   // 목적격 조사
      return hasFinal ? '을' : '를';
    default:
      return '';
  }
}

/**
 * 제목에서 조사 제거 및 키워드 추출
 */
function extractKeyword(title) {
  // "뱀이(가) 나오는 꿈" → "뱀"
  const match = title.match(/^(.+?)(이\(가\)|은\(는\)|을\(를\))/);
  if (match) {
    return match[1];
  }
  
  // "뱀을 보는 꿈" → "뱀"
  const match2 = title.match(/^(.+?)(을|를|이|가|은|는)\s/);
  if (match2) {
    return match2[1];
  }
  
  // 첫 단어 추출
  return title.split(' ')[0];
}

/**
 * 해석 텍스트 수정
 */
function fixInterpretation(dream) {
  const keyword = extractKeyword(dream.title);
  const meaning = dream.meaning;
  
  // 새로운 해석 생성
  const interpretation = `${keyword}${getJosa(keyword, 'topic')} ${meaning}${getJosa(meaning, 'object')} 상징합니다. 꿈속에서 ${keyword}${getJosa(keyword, 'object')} 보는 것은 현재 당신의 상황과 연결된 의미 있는 꿈입니다.`;
  
  return interpretation;
}

/**
 * 제목 수정
 */
function fixTitle(title) {
  // "뱀이(가) 나오는 꿈" → "뱀이 나오는 꿈"
  return title
    .replace(/이\(가\)/g, (match, offset, str) => {
      const prevChar = str[offset - 1];
      return getJosa(prevChar, 'subject');
    })
    .replace(/은\(는\)/g, (match, offset, str) => {
      const prevChar = str[offset - 1];
      return getJosa(prevChar, 'topic');
    })
    .replace(/을\(를\)/g, (match, offset, str) => {
      const prevChar = str[offset - 1];
      return getJosa(prevChar, 'object');
    });
}

/**
 * 메인 수정 함수
 */
async function fixDreamDatabase() {
  console.log('꿈해몽 데이터 문법 수정 시작...\n');
  
  // DB 로드
  const dbPath = path.join(__dirname, '../engines/data/dream-db.json');
  const data = fs.readFileSync(dbPath, 'utf8');
  const dreamDB = JSON.parse(data);
  
  console.log(`총 ${dreamDB.length}개 꿈 데이터 로드됨\n`);
  
  let fixedCount = 0;
  let titleFixedCount = 0;
  let interpretationFixedCount = 0;
  
  // 각 꿈 데이터 수정
  dreamDB.forEach((dream, index) => {
    let modified = false;
    
    // 제목 수정
    const oldTitle = dream.title;
    const newTitle = fixTitle(oldTitle);
    if (oldTitle !== newTitle) {
      dream.title = newTitle;
      titleFixedCount++;
      modified = true;
    }
    
    // 해석 수정 (조사 패턴 있는 경우)
    if (dream.interpretation.includes('(')) {
      const oldInterpretation = dream.interpretation;
      const newInterpretation = fixInterpretation(dream);
      dream.interpretation = newInterpretation;
      interpretationFixedCount++;
      modified = true;
    }
    
    if (modified) {
      fixedCount++;
    }
    
    // 100개마다 진행 상황 출력
    if ((index + 1) % 500 === 0) {
      console.log(`진행중... ${index + 1}/${dreamDB.length}`);
    }
  });
  
  // 수정된 데이터 저장
  const outputPath = path.join(__dirname, '../engines/data/dream-db-fixed.json');
  fs.writeFileSync(outputPath, JSON.stringify(dreamDB, null, 2), 'utf8');
  
  console.log('\n='.repeat(70));
  console.log('수정 완료!');
  console.log('='.repeat(70));
  console.log(`총 수정: ${fixedCount}개 / ${dreamDB.length}개`);
  console.log(`제목 수정: ${titleFixedCount}개`);
  console.log(`해석 수정: ${interpretationFixedCount}개`);
  console.log(`\n저장 위치: ${outputPath}`);
  console.log('\n다음 단계:');
  console.log('1. dream-db-fixed.json 검증');
  console.log('2. 문제 없으면 dream-db.json으로 교체');
  console.log('='.repeat(70));
}

// 실행
fixDreamDatabase().catch(console.error);
