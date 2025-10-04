// saju-main.js
// 메인 로직

let savedData = null;
let selectedCategory = null;

// localStorage에서 사용자 정보 가져오기
function loadUserInfo() {
  const data = localStorage.getItem('fortuneUserData');
  if (data) {
    savedData = JSON.parse(data);
    const display = document.getElementById('userInfoDisplay');
    display.textContent = `${savedData.gender} ${savedData.year}. ${savedData.month}. ${savedData.day} (${savedData.calendarType}) ${savedData.birthTime}`;
  } else {
    savedData = {
      gender: '여성',
      calendarType: '음력(평달)',
      year: '1995',
      month: '7',
      day: '7',
      birthTime: '未(13:31~15:30)'
    };
    document.getElementById('userInfoDisplay').textContent = `${savedData.gender} ${savedData.year}. ${savedData.month}. ${savedData.day} (${savedData.calendarType}) ${savedData.birthTime}`;
  }
}

// 카테고리 선택
function selectCategory(category) {
  selectedCategory = category;
  
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  event.target.classList.add('active');
  
  document.getElementById('generateBtn').disabled = false;
}

// 사주 기본 정보 표시 (토정비결 스타일)
function displaySajuBasicInfo(result) {
  const { saju, elements, strength, yongsin, tenStars } = result;
  
  const pillarsHTML = [
    { label: '년주', char: saju.year.hanja, pillar: 'year' },
    { label: '월주', char: saju.month.hanja, pillar: 'month' },
    { label: '일주', char: saju.day.hanja, pillar: 'day' },
    { label: '시주', char: saju.hour.hanja, pillar: 'hour' }
  ].map(p => {
    const cheonganStar = tenStars && tenStars[p.pillar] ? tenStars[p.pillar].cheonganStar : '';
    const jijiStar = tenStars && tenStars[p.pillar] ? tenStars[p.pillar].jijiStar : '';
    return `
      <div class="pillar">
        <div class="pillar-label">${p.label}</div>
        <div class="pillar-char">${p.char}</div>
        ${tenStars ? `<div class="pillar-star">${cheonganStar || ''}</div><div class="pillar-star">${jijiStar || ''}</div>` : ''}
      </div>
    `;
  }).join('');

  const total = Object.values(elements).reduce((a, b) => a + b, 0);
  const elementsHTML = Object.entries(elements).map(([name, count]) => {
    const percentage = (count / total) * 100;
    const hanja = {목:'木',화:'火',토:'土',금:'金',수:'水'}[name];
    return `
      <div class="element-bar">
        <div class="element-label">
          <span>${name}(${hanja})</span>
          <span>${count}개</span>
        </div>
        <div class="bar">
          <div class="bar-fill element-${name}" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join('');

  const resultDiv = document.getElementById('resultContainer');
  
  // 십성 개수 세기
  let tenStarsSummary = '';
  if (tenStars && typeof TenStarsCalculator !== 'undefined') {
    const starsCount = TenStarsCalculator.countStars(tenStars);
    const starsList = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'];
    const starsHTML = starsList.map(star => {
      const count = starsCount[star];
      return `<div class="ten-star-item ${count > 0 ? 'has-star' : ''}">${star}<br>${count}</div>`;
    }).join('');
    tenStarsSummary = `
      <div class="ten-stars-summary">
        <h4>⭐ 십성 분포</h4>
        <div class="ten-stars-grid">${starsHTML}</div>
      </div>
    `;
  }

  resultDiv.innerHTML = `
    <div class="saju-info">
      <div class="saju-pillars">${pillarsHTML}</div>
      <div class="ilgan-display">
        일간: <strong>${saju.ilgan}</strong>
      </div>
      ${tenStarsSummary}
    </div>

    <div class="elements-info">
      <h3>오행 분포</h3>
      ${elementsHTML}
      <div class="strength-yongsin">
        <div>
          <div style="color: #636e72; font-size: 13px; margin-bottom: 5px;">신강/신약</div>
          <strong>${strength}</strong>
        </div>
        <div>
          <div style="color: #636e72; font-size: 13px; margin-bottom: 5px;">용신</div>
          <strong>${yongsin}</strong>
        </div>
      </div>
    </div>

    <div id="fortuneContent"></div>

    <div class="action-buttons">
      <button class="action-btn" onclick="showOtherCategory()">다른 운세 보기</button>
      <button class="action-btn" onclick="copySaju()">내용 복사</button>
    </div>
  `;
}

// 사주 보기 버튼 클릭 (선택한 카테고리만 계산)
function generateSaju() {
  if (!savedData) {
    alert('사주 정보가 없습니다.');
    return;
  }

  if (!selectedCategory) {
    alert('운세 카테고리를 먼저 선택해주세요!');
    return;
  }

  document.getElementById('inputSection').classList.add('hidden');
  document.getElementById('loading').classList.add('show');

  setTimeout(() => {
    try {
      const year = parseInt(savedData.year);
      const month = parseInt(savedData.month);
      const day = parseInt(savedData.day);
      const birthTime = savedData.birthTime;
      const gender = savedData.gender || '남성';

      // 기본 사주 계산
      const basicResult = SajuBasicCalculator.calculate(year, month, day, birthTime);

      // 기본 정보 표시
      displaySajuBasicInfo(basicResult);

      // 선택한 카테고리만 계산
      let interpretation = '';
      let needsExtended = ['daeun', 'move', 'travel', 'sinsal', 'taekil'].includes(selectedCategory);

      if (needsExtended) {
        const daeun = SajuExtendedCalculator.calculateDaeun(year, month, gender);
        const sinsal = SajuExtendedCalculator.calculateSinsal(basicResult.saju);
        const taekil = SajuExtendedCalculator.calculateTaekil(2025, 10);

        const extendedResult = { daeun, sinsal, taekil };

        interpretation = calculateInterpretation(selectedCategory, basicResult, extendedResult, gender);
      } else {
        interpretation = calculateInterpretation(selectedCategory, basicResult, null, gender);
      }

      // 결과 표시
      const title = getCategoryTitle(selectedCategory);
      document.getElementById('fortuneContent').innerHTML = `
        <div class="fortune-card">
          <h3>${title}</h3>
          <p>${interpretation}</p>
        </div>
      `;

      document.getElementById('loading').classList.remove('show');
      document.getElementById('resultContainer').classList.add('show');

    } catch (error) {
      console.error('사주 계산 오류:', error);
      alert('사주 계산 중 오류가 발생했습니다.');
      document.getElementById('loading').classList.remove('show');
      document.getElementById('inputSection').classList.remove('hidden');
    }
  }, 500);
}

// 카테고리 제목 가져오기
function getCategoryTitle(category) {
  const titles = {
    total: '총운',
    personality: '성격/장단점',
    daeun: '대운',
    wealth: '재물운',
    love: '애정운',
    health: '건강운',
    career: '직업운',
    study: '학업운',
    promotion: '승진운',
    move: '이동운',
    travel: '여행운',
    parents: '부모운',
    siblings: '형제운',
    children: '자녀운',
    spouse: '배우자운',
    social: '대인관계운',
    aptitude: '직업 적성',
    job: '어울리는 직업',
    business: '사업 성공',
    sinsal: '신살',
    taekil: '택일'
  };
  return titles[category] || '운세';
}

// 해석 계산
function calculateInterpretation(category, basicResult, extendedResult, gender) {
  const { ilgan, elements, strength, yongsin } = basicResult;

  switch(category) {
    case 'total':
      return SajuInterpretations.generateTotal(ilgan, elements, strength, yongsin);
    case 'personality':
      return SajuInterpretations.generatePersonality(ilgan, strength);
    case 'daeun':
      return SajuInterpretations.generateDaeun(extendedResult.daeun, 30);
    case 'wealth':
      return SajuInterpretations.generateWealth(strength, yongsin);
    case 'love':
      return SajuInterpretations.generateLove(gender, strength);
    case 'health':
      return SajuInterpretations.generateHealth(yongsin);
    case 'career':
      return SajuInterpretations.generateCareer(strength);
    case 'study':
      return SajuInterpretations.generateStudy(ilgan);
    case 'promotion':
      return SajuInterpretations.generatePromotion(strength);
    case 'move':
      return SajuInterpretations.generateMove(extendedResult.sinsal);
    case 'travel':
      return SajuInterpretations.generateTravel(extendedResult.sinsal, yongsin);
    case 'parents':
      return SajuInterpretations.generateParents();
    case 'siblings':
      return SajuInterpretations.generateSiblings();
    case 'children':
      return SajuInterpretations.generateChildren();
    case 'spouse':
      return SajuInterpretations.generateSpouse();
    case 'social':
      return SajuInterpretations.generateSocial();
    case 'aptitude':
      return SajuInterpretations.generateAptitude();
    case 'job':
      return SajuInterpretations.generateJob(yongsin);
    case 'business':
      return SajuInterpretations.generateBusiness(strength);
    case 'sinsal':
      return SajuInterpretations.generateSinsal(extendedResult.sinsal);
    case 'taekil':
      return SajuInterpretations.generateTaekil();
    default:
      return '해당 카테고리의 해석을 준비 중입니다.';
  }
}

// 다른 운세 보기
function showOtherCategory() {
  document.getElementById('resultContainer').classList.remove('show');
  document.getElementById('inputSection').classList.remove('hidden');
  
  selectedCategory = null;
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById('generateBtn').disabled = true;
}

// 복사 기능
function copySaju() {
  const text = document.getElementById('resultContainer').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('내용이 복사되었습니다!');
  }).catch(() => {
    alert('복사 실패');
  });
}

// 페이지 로드 시 실행
window.onload = function() {
  loadUserInfo();
};
