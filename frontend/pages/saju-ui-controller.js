// saju-ui-controller.js
// UI 제어 및 카테고리 전환

const SajuUI = {
  currentCategory: 'total',
  sajuData: null,

  // 카테고리 제목 매핑
  categoryTitles: {
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
  },

  // 사주 기본 정보 표시
  displayBasicInfo(result) {
    const { saju, elements, strength, yongsin } = result;
    
    const pillarsHTML = [
      { label: '년주', char: saju.year.hanja },
      { label: '월주', char: saju.month.hanja },
      { label: '일주', char: saju.day.hanja },
      { label: '시주', char: saju.hour.hanja }
    ].map(p => `
      <div class="pillar">
        <div class="pillar-label">${p.label}</div>
        <div class="pillar-char">${p.char}</div>
      </div>
    `).join('');

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

    document.getElementById('sajuBasicInfo').innerHTML = `
      <div class="saju-card">
        <h3>사주 8글자</h3>
        <div class="saju-pillars">${pillarsHTML}</div>
        <p style="text-align: center; margin-top: 15px;">
          일간: <strong style="color: #f39c12; font-size: 18px;">${saju.ilgan}</strong>
        </p>
      </div>

      <div class="saju-card">
        <h3>오행 분포</h3>
        <div class="elements-chart">${elementsHTML}</div>
        <p style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ffd700;">
          신강/신약: <strong style="color: #e74c3c;">${strength}</strong> | 
          용신: <strong style="color: #3498db;">${yongsin}</strong>
        </p>
      </div>
    `;
  },

  // 카테고리 표시
  showCategory(category) {
    this.currentCategory = category;
    
    // 버튼 active 상태 변경
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    const title = this.categoryTitles[category];
    const interpretation = this.sajuData.interpretations[category] || '해당 카테고리의 해석을 준비 중입니다.';

    document.getElementById('categoryResult').innerHTML = `
      <div class="fortune-card">
        <h3>${title}</h3>
        <p>${interpretation}</p>
      </div>
    `;
  },

  // 로딩 표시
  showLoading(show) {
    if (show) {
      document.getElementById('loading').classList.add('show');
      document.getElementById('resultContainer').classList.remove('show');
    } else {
      document.getElementById('loading').classList.remove('show');
      document.getElementById('resultContainer').classList.add('show');
    }
  },

  // 복사 기능
  copySaju() {
    const text = document.getElementById('resultContainer').innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert('내용이 복사되었습니다!');
    }).catch(() => {
      alert('복사 실패');
    });
  }
};