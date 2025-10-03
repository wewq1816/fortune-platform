const fs = require('fs');

// 카테고리별 키워드 데이터베이스
const categoryData = {
  "동물": {
    count: 300,
    keywords: [
      // 포유류
      "뱀", "용", "호랑이", "사자", "개", "고양이", "쥐", "소", "돼지", "닭",
      "말", "원숭이", "토끼", "양", "염소", "여우", "늑대", "곰", "사슴", "코끼리",
      "하마", "코뿔소", "기린", "얼룩말", "판다", "캥거루", "코알라", "다람쥐", "두더지", "너구리",
      
      // 조류
      "새", "독수리", "매", "까치", "까마귀", "비둘기", "참새", "제비", "학", "오리",
      "거위", "백조", "앵무새", "펭귄", "타조", "공작새", "닭", "병아리", "올빼미", "부엉이",
      
      // 수생동물
      "물고기", "상어", "고래", "돌고래", "거북이", "자라", "개구리", "두꺼비", "뱀장어", "잉어",
      "금붕어", "가오리", "문어", "오징어", "낙지", "조개", "게", "새우", "바닷가재", "소라",
      
      // 곤충/기타
      "벌레", "나비", "거미", "지네", "벌", "개미", "모기", "파리", "매미", "메뚜기",
      "사마귀", "풍뎅이", "잠자리", "무당벌레", "달팽이", "지렁이", "개미귀신", "노린재"
    ],
    patterns: [
      { template: "{keyword}을 보는 꿈", type: "관찰" },
      { template: "{keyword}에게 쫓기는 꿈", type: "추격" },
      { template: "{keyword}을 기르는 꿈", type: "양육" },
      { template: "{keyword}과 싸우는 꿈", type: "대결" }
    ]
  },
  
  "자연": {
    count: 300,
    keywords: [
      // 물
      "물", "바다", "강", "폭포", "호수", "샘물", "온천", "우물", "시냇물", "수영장",
      "홍수", "해일", "파도", "물결", "물웅덩이", "맑은물", "더러운물", "얼음", "빙하", "눈",
      
      // 하늘/기상
      "하늘", "해", "달", "별", "구름", "무지개", "번개", "천둥", "비", "소나기",
      "폭풍", "태풍", "눈보라", "안개", "이슬", "서리", "햇빛", "일출", "일몰", "월식",
      "일식", "유성", "별똥별", "은하수", "북극성", "구름다리",
      
      // 땅/지형
      "산", "언덕", "계곡", "동굴", "절벽", "바위", "모래", "흙", "진흙", "땅",
      "지진", "화산", "용암", "산사태", "땅굴", "바닷가", "해변", "모래사장", "갯벌", "섬",
      "무인도", "반도", "사막", "평원", "들판", "초원",
      
      // 식물
      "꽃", "나무", "풀", "숲", "정글", "대나무", "소나무", "버드나무", "벚나무", "단풍나무",
      "느티나무", "은행나무", "장미", "백합", "국화", "해바라기", "튤립", "난초", "연꽃", "목련",
      "매화", "개나리", "진달래", "철쭉", "선인장", "이끼", "버섯", "이파리", "꽃밭", "화원"
    ],
    patterns: [
      { template: "{keyword}을 보는 꿈", type: "관찰" },
      { template: "{keyword}을 만지는 꿈", type: "접촉" },
      { template: "{keyword}이 변하는 꿈", type: "변화" }
    ]
  },
  
  "사람": {
    count: 300,
    keywords: [
      // 가족
      "부모", "아버지", "어머니", "형", "누나", "동생", "오빠", "언니", "할아버지", "할머니",
      "조부모", "삼촌", "이모", "고모", "이모부", "고모부", "사촌", "조카", "손자", "손녀",
      "며느리", "사위", "장인", "장모", "시어머니", "시아버지", "친척", "일가친척",
      
      // 관계
      "친구", "연인", "애인", "남자친구", "여자친구", "배우자", "남편", "아내", "약혼자", "동료",
      "선배", "후배", "선생님", "스승", "제자", "이웃", "아는사람", "낯선사람", "외국인", "유명인",
      
      // 특수
      "아기", "어린이", "청소년", "노인", "임산부", "신부", "신랑", "죽은사람", "귀신", "유령",
      "조상", "영혼", "천사", "악마", "도깨비", "요정", "신", "부처", "예수",
      
      // 상황
      "결혼식", "장례식", "돌잔치", "생일", "동창회", "소풍", "여행", "파티", "모임", "회의",
      "싸움", "화해", "이별", "재회", "포옹", "키스", "손잡기", "악수", "인사"
    ],
    patterns: [
      { template: "{keyword}를 만나는 꿈", type: "만남" },
      { template: "{keyword}와 싸우는 꿈", type: "갈등" },
      { template: "{keyword}가 죽는 꿈", type: "상실" },
      { template: "{keyword}를 돕는 꿈", type: "도움" }
    ]
  },
  
  "음식": {
    count: 300,
    keywords: [
      // 주식
      "밥", "쌀", "빵", "국수", "라면", "파스타", "피자", "햄버거", "죽", "떡",
      "떡국", "송편", "인절미", "찰떡", "시루떡", "케이크", "도넛", "쿠키", "비스킷", "크래커",
      
      // 반찬
      "김치", "된장", "고추장", "간장", "젓갈", "장아찌", "나물", "무침", "볶음", "조림",
      
      // 고기/단백질
      "고기", "소고기", "돼지고기", "닭고기", "양고기", "오리고기", "삼겹살", "불고기", "갈비", "스테이크",
      "계란", "달걀", "메추리알", "생선", "참치", "연어", "고등어", "삼치", "명태", "조기",
      
      // 과일
      "사과", "배", "포도", "수박", "참외", "딸기", "바나나", "오렌지", "귤", "감",
      "복숭아", "자두", "살구", "앵두", "체리", "키위", "파인애플", "망고", "용과", "두리안",
      "석류", "무화과", "대추", "밤", "호두", "잣", "땅콩",
      
      // 채소
      "배추", "무", "당근", "감자", "고구마", "양파", "마늘", "파", "생강", "고추",
      "오이", "호박", "가지", "토마토", "상추", "양상추", "시금치", "콩나물", "숙주", "버섯",
      
      // 음료
      "물", "차", "커피", "우유", "주스", "탄산음료", "콜라", "사이다", "맥주", "소주",
      "막걸리", "와인", "위스키", "칵테일", "스무디", "밀크쉐이크", "요구르트",
      
      // 간식/디저트
      "과자", "사탕", "초콜릿", "젤리", "아이스크림", "빙수", "푸딩", "무스", "마카롱", "타르트"
    ],
    patterns: [
      { template: "{keyword}을 먹는 꿈", type: "섭취" },
      { template: "{keyword}을 만드는 꿈", type: "제작" },
      { template: "{keyword}을 받는 꿈", type: "수령" }
    ]
  },
  
  "건물": {
    count: 300,
    keywords: [
      // 주거
      "집", "아파트", "빌라", "단독주택", "전원주택", "한옥", "기와집", "초가집", "궁궐", "성",
      "방", "거실", "침실", "주방", "부엌", "화장실", "욕실", "베란다", "옥상", "지하실",
      "창고", "다락방", "마당", "정원", "마루", "안방", "사랑방", "대문", "울타리", "담장",
      
      // 공공시설
      "학교", "도서관", "병원", "약국", "은행", "우체국", "경찰서", "소방서", "구청", "시청",
      "관공서", "법원", "교도소", "감옥", "군대", "박물관", "미술관", "극장", "영화관", "공연장",
      
      // 상업시설
      "회사", "사무실", "공장", "식당", "카페", "커피숍", "편의점", "마트", "백화점", "쇼핑몰",
      "시장", "재래시장", "빵집", "약국", "서점", "문구점", "슈퍼마켓", "주유소", "세차장", "주차장",
      
      // 종교시설
      "교회", "성당", "절", "사찰", "암자", "예배당", "기도원", "법당", "불상", "십자가",
      "제단", "향", "촛불",
      
      // 기타시설
      "호텔", "모텔", "여관", "펜션", "리조트", "찜질방", "목욕탕", "사우나", "수영장", "헬스장",
      "체육관", "운동장", "놀이터", "공원", "유원지", "테마파크", "동물원", "식물원", "수족관", "전망대",
      
      // 구조물
      "문", "창문", "계단", "엘리베이터", "에스컬레이터", "다리", "터널", "골목", "길", "도로",
      "고속도로", "철길", "담벼락", "벽", "천장", "바닥", "지붕", "기둥", "탑", "첨탑",
      "무덤", "묘지", "납골당", "화장터"
    ],
    patterns: [
      { template: "{keyword}에 가는 꿈", type: "이동" },
      { template: "{keyword}이 무너지는 꿈", type: "붕괴" },
      { template: "{keyword}을 짓는 꿈", type: "건설" }
    ]
  },
  
  "교통": {
    count: 200,
    keywords: [
      // 육상교통
      "자동차", "차", "승용차", "SUV", "트럭", "버스", "시내버스", "고속버스", "관광버스", "택시",
      "기차", "전철", "지하철", "고속철", "KTX", "무궁화호", "화물열차", "기관차", "오토바이", "스쿠터",
      "자전거", "킥보드", "전동킥보드", "세그웨이", "스케이트보드", "마차", "인력거", "지게차", "굴삭기", "불도저",
      
      // 항공교통
      "비행기", "여객기", "전투기", "헬기", "헬리콥터", "열기구", "낙하산", "글라이더", "드론", "로켓",
      "우주선", "UFO",
      
      // 해상교통
      "배", "선박", "여객선", "화물선", "크루즈", "유람선", "요트", "보트", "모터보트", "잠수함",
      "군함", "어선", "카누", "카약", "뗏목",
      
      // 교통상황
      "운전", "주행", "정차", "주차", "신호등", "횡단보도", "사고", "추돌", "충돌", "전복",
      "추락", "침몰", "고장", "타이어펑크", "길잃음", "길막힘", "교통체증", "과속", "정속주행", "급브레이크"
    ],
    patterns: [
      { template: "{keyword}을 타는 꿈", type: "탑승" },
      { template: "{keyword} 사고 꿈", type: "사고" },
      { template: "{keyword}을 운전하는 꿈", type: "운전" }
    ]
  },
  
  "기타": {
    count: 300,
    keywords: [
      // 재물
      "돈", "지폐", "동전", "금", "은", "보석", "다이아몬드", "반지", "목걸이", "팔찌",
      "귀걸이", "금고", "통장", "카드", "신용카드", "현금", "수표", "복권", "로또", "당첨",
      "잭팟", "카지노", "도박", "주식", "부동산", "땅", "건물", "상가", "매장",
      
      // 학업/시험
      "시험", "시험지", "문제", "답안", "채점", "성적표", "합격", "불합격", "졸업", "입학",
      "수능", "내신", "중간고사", "기말고사", "발표", "프레젠테이션", "스피치", "면접", "취업",
      
      // 통신
      "전화", "스마트폰", "휴대폰", "핸드폰", "문자", "메시지", "카톡", "이메일", "편지", "우편",
      "소포", "택배", "인터넷", "컴퓨터", "노트북", "태블릿", "PC", "모니터", "키보드", "마우스",
      
      // 의류/액세서리
      "옷", "양복", "정장", "한복", "드레스", "원피스", "치마", "바지", "청바지", "반바지",
      "셔츠", "티셔츠", "블라우스", "니트", "스웨터", "코트", "점퍼", "패딩", "잠바", "조끼",
      "신발", "구두", "운동화", "슬리퍼", "샌들", "부츠", "하이힐", "가방", "핸드백", "배낭",
      "지갑", "벨트", "넥타이", "스카프", "장갑", "모자", "안경", "선글라스", "시계", "우산",
      
      // 신체/건강
      "피", "상처", "부상", "골절", "통증", "아픔", "병", "질병", "암", "수술",
      "주사", "약", "치료", "치유", "회복", "임신", "출산", "아기", "탯줄", "태몽",
      "머리카락", "머리", "얼굴", "눈", "코", "입", "귀", "손", "발", "다리",
      "팔", "배", "가슴", "등", "엉덩이", "살", "뼈", "이빨", "혀", "심장",
      
      // 물건
      "가구", "침대", "소파", "책상", "의자", "장롱", "서랍장", "식탁", "책", "책장",
      "책꽂이", "필기구", "펜", "연필", "지우개", "자", "가위", "칼", "포크", "숟가락",
      "젓가락", "그릇", "컵", "잔", "접시", "냄비", "프라이팬", "주전자", "전기밥솥", "냉장고",
      "세탁기", "청소기", "에어컨", "선풍기", "히터", "전등", "형광등", "램프", "스탠드", "촛불",
      "성냥", "라이터", "시계", "알람", "거울", "빗", "수건", "비누", "샴푸", "칫솔",
      "치약", "휴지", "티슈", "화장지", "쓰레기", "쓰레기통", "청소", "빗자루", "걸레", "먼지"
    ],
    patterns: [
      { template: "{keyword}을 얻는 꿈", type: "획득" },
      { template: "{keyword}을 잃어버리는 꿈", type: "상실" },
      { template: "{keyword}을 고르는 꿈", type: "선택" }
    ]
  }
};

// 운세 타입별 해석 템플릿
const fortuneTemplates = {
  "길몽": [
    "긍정적인 변화와 성공을 예고하는 꿈입니다.",
    "좋은 소식이나 행운이 찾아올 징조입니다.",
    "재물운이나 사업운이 상승하는 길몽입니다.",
    "새로운 기회가 찾아오는 행운의 꿈입니다.",
    "소원이 이루어지고 목표를 달성하는 길한 꿈입니다."
  ],
  "흉몽": [
    "어려움이나 장애물을 경고하는 꿈입니다.",
    "건강이나 재물에 주의가 필요한 시기입니다.",
    "대인관계에서 갈등이 생길 수 있으니 조심하세요.",
    "계획에 차질이 생길 수 있으니 신중하게 행동하세요.",
    "예상치 못한 문제가 발생할 수 있는 경고의 꿈입니다."
  ],
  "중립": [
    "현재 상황에 대한 심리적 반영입니다.",
    "길흉이 섞여 있으니 신중한 판단이 필요합니다.",
    "상황에 따라 좋을 수도, 나쁠 수도 있는 꿈입니다.",
    "내면의 욕구나 불안을 나타내는 꿈입니다.",
    "중요한 선택의 시기가 다가오고 있음을 암시합니다."
  ]
};

// 키워드별 의미 매핑
const keywordMeanings = {
  // 동물
  "뱀": { meaning: "재물, 지혜, 변화", fortune: "길몽" },
  "용": { meaning: "권력, 출세, 성공", fortune: "길몽" },
  "호랑이": { meaning: "권위, 보호, 힘", fortune: "길몽" },
  "개": { meaning: "충성, 우정, 보호", fortune: "길몽" },
  "고양이": { meaning: "독립, 여성, 직감", fortune: "중립" },
  
  // 자연
  "물": { meaning: "재물, 정화, 변화", fortune: "길몽" },
  "불": { meaning: "열정, 파괴, 재생", fortune: "중립" },
  "산": { meaning: "목표, 도전, 안정", fortune: "길몽" },
  "바다": { meaning: "무한, 모험, 감정", fortune: "중립" },
  
  // 기본값
  "기본": { meaning: "변화와 성장의 신호", fortune: "중립" }
};

// 해석 생성 함수
function generateInterpretation(keyword, category, fortuneType) {
  const meaningData = keywordMeanings[keyword] || keywordMeanings["기본"];
  const templates = fortuneTemplates[fortuneType] || fortuneTemplates["중립"];
  const baseTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  const interpretations = [
    `${keyword}은(는) ${meaningData.meaning}을(를) 상징합니다. ${baseTemplate} `,
    `꿈속에서 ${keyword}을(를) 보는 것은 `,
    `현재 당신의 상황과 연결된 의미 있는 꿈입니다.`
  ];
  
  return interpretations.join('');
}

// 관련 키워드 생성
function generateRelatedKeywords(mainKeyword, allKeywords) {
  const related = [mainKeyword];
  const variations = [
    `큰${mainKeyword}`, `작은${mainKeyword}`, `하얀${mainKeyword}`, `검은${mainKeyword}`,
    `${mainKeyword}떼`, `죽은${mainKeyword}`, `살아있는${mainKeyword}`
  ];
  
  variations.forEach(v => {
    if (related.length < 8) related.push(v);
  });
  
  // 같은 카테고리에서 랜덤 추가
  while (related.length < 10 && allKeywords.length > 0) {
    const randomKeyword = allKeywords[Math.floor(Math.random() * allKeywords.length)];
    if (!related.includes(randomKeyword)) {
      related.push(randomKeyword);
    }
  }
  
  return related.slice(0, 10);
}

// 운세 타입 결정
function getFortuneType(keyword) {
  if (keywordMeanings[keyword]) {
    return keywordMeanings[keyword].fortune;
  }
  
  // 기본 규칙
  const positiveKeywords = ["용", "호랑이", "금", "돈", "꽃", "물", "해"];
  const negativeKeywords = ["죽음", "피", "싸움", "사고", "불", "귀신"];
  
  if (positiveKeywords.some(k => keyword.includes(k))) return "길몽";
  if (negativeKeywords.some(k => keyword.includes(k))) return "흉몽";
  
  return "중립";
}

// 꿈 객체 생성
function createDream(id, category, keyword, allKeywords) {
  const fortuneType = getFortuneType(keyword);
  const meaningData = keywordMeanings[keyword] || keywordMeanings["기본"];
  
  return {
    id,
    category,
    title: `${keyword}이(가) 나오는 꿈`,
    keywords: generateRelatedKeywords(keyword, allKeywords),
    meaning: meaningData.meaning,
    fortune_type: fortuneType,
    interpretation: generateInterpretation(keyword, category, fortuneType),
    related_ids: [],
    created_at: new Date().toISOString().split('T')[0]
  };
}

// 메인 생성 함수
function generateDreamDB() {
  console.log('🚀 꿈해몽 DB 생성 시작...\n');
  
  let dreamDB = [];
  let currentId = 1;
  
  // 카테고리별 생성
  for (const [category, config] of Object.entries(categoryData)) {
    console.log(`📁 ${category} 카테고리 생성 중... (목표: ${config.count}개)`);
    
    const categoryDreams = [];
    const keywordCount = config.keywords.length;
    const dreamsPerKeyword = Math.ceil(config.count / keywordCount);
    
    // 각 키워드별로 꿈 생성
    config.keywords.forEach((keyword, index) => {
      if (categoryDreams.length >= config.count) return;
      
      // 기본 꿈 생성
      const baseDream = createDream(currentId++, category, keyword, config.keywords);
      categoryDreams.push(baseDream);
      
      // 패턴 변형 생성 (필요한 경우)
      if (categoryDreams.length < config.count && config.patterns) {
        config.patterns.forEach(pattern => {
          if (categoryDreams.length >= config.count) return;
          
          const variantDream = {
            ...baseDream,
            id: currentId++,
            title: pattern.template.replace('{keyword}', keyword),
            interpretation: generateInterpretation(keyword, category, getFortuneType(keyword))
          };
          categoryDreams.push(variantDream);
        });
      }
    });
    
    // 목표 개수만큼 자르기
    dreamDB.push(...categoryDreams.slice(0, config.count));
    console.log(`✅ ${category}: ${categoryDreams.slice(0, config.count).length}개 생성 완료\n`);
  }
  
  // related_ids 자동 연결
  console.log('🔗 관련 꿈 ID 연결 중...');
  dreamDB.forEach((dream, index) => {
    const sameCategoryDreams = dreamDB
      .filter(d => d.category === dream.category && d.id !== dream.id)
      .map(d => d.id);
    
    // 랜덤하게 3-5개 선택
    const relatedCount = 3 + Math.floor(Math.random() * 3);
    dream.related_ids = [];
    
    for (let i = 0; i < relatedCount && sameCategoryDreams.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * sameCategoryDreams.length);
      dream.related_ids.push(sameCategoryDreams[randomIndex]);
      sameCategoryDreams.splice(randomIndex, 1);
    }
  });
  
  // 파일 저장
  const outputPath = './engines/data/dream-db.json';
  fs.writeFileSync(
    outputPath,
    JSON.stringify(dreamDB, null, 2),
    'utf8'
  );
  
  // 통계 출력
  console.log('\n');
  console.log('═══════════════════════════════════════');
  console.log('✨ 꿈해몽 DB 생성 완료!');
  console.log('═══════════════════════════════════════');
  console.log(`📊 총 개수: ${dreamDB.length}개`);
  console.log('');
  console.log('📁 카테고리별 통계:');
  
  const stats = {};
  dreamDB.forEach(dream => {
    stats[dream.category] = (stats[dream.category] || 0) + 1;
  });
  
  Object.entries(stats).forEach(([category, count]) => {
    console.log(`   ${category}: ${count}개`);
  });
  
  console.log('');
  console.log('📈 평균 통계:');
  const avgKeywords = dreamDB.reduce((sum, d) => sum + d.keywords.length, 0) / dreamDB.length;
  const avgInterpLength = dreamDB.reduce((sum, d) => sum + d.interpretation.length, 0) / dreamDB.length;
  console.log(`   평균 키워드 수: ${avgKeywords.toFixed(1)}개`);
  console.log(`   평균 해석 길이: ${avgInterpLength.toFixed(0)}자`);
  
  console.log('');
  console.log(`💾 저장 위치: ${outputPath}`);
  console.log('═══════════════════════════════════════');
  
  // 샘플 출력
  console.log('\n📝 샘플 데이터 (각 카테고리별 1개):');
  Object.keys(stats).forEach(category => {
    const sample = dreamDB.find(d => d.category === category);
    console.log(`\n[${category}]`);
    console.log(JSON.stringify(sample, null, 2));
  });
}

// 실행
try {
  generateDreamDB();
  console.log('\n✅ 모든 작업이 성공적으로 완료되었습니다!');
} catch (error) {
  console.error('\n❌ 오류 발생:', error.message);
  console.error(error.stack);
  process.exit(1);
}
