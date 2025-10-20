// 사주 API 호출 함수

async function calculateSaju() {
  console.log('[Saju API] calculateSaju 시작');
  
  // savedData와 selectedCategory 확인
  if (!savedData) {
    alert('사주 정보를 먼저 입력해주세요!');
    return;
  }
  
  if (!selectedCategory) {
    alert('카테고리를 선택해주세요!');
    return;
  }

  const year = parseInt(savedData.year);
  const month = parseInt(savedData.month);
  const day = parseInt(savedData.day);
  const gender = savedData.gender;
  const isLunar = savedData.calendarType.includes('음력');
  
  // 시간 파싱 (예: "未(13:31~15:30)" -> 13)
  const timeMatch = savedData.birthTime.match(/\((\d+):/);
  const hour = timeMatch ? parseInt(timeMatch[1]) : 12;

  console.log('[Saju API] 요청 데이터:', { year, month, day, hour, isLunar, gender, category: selectedCategory });

  // 로딩 표시
  document.getElementById('loading').style.display = 'block';
  const resultContainer = document.getElementById('resultContainer');
  if (resultContainer) {
    resultContainer.style.display = 'none';
  }

  try {
    // API 호출
    const response = await fetch(API_BASE_URL + '/api/saju', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        year: year,
        month: month,
        day: day,
        hour: hour,
        isLunar: isLunar,
        gender: gender,
        category: selectedCategory
      })
    });

    console.log('[Saju API] 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error('API 호출 실패: ' + response.status);
    }

    const data = await response.json();
    console.log('[Saju API] 응답 데이터:', data);
    
    if (!data.success) {
      throw new Error(data.error || '사주 계산 실패');
    }

    // 로딩 숨김
    document.getElementById('loading').style.display = 'none';
    
    // 결과 표시
    displaySajuResult(data);
    
  } catch (error) {
    console.error('[Saju API] 오류:', error);
    document.getElementById('loading').style.display = 'none';
    alert('사주 계산 중 오류가 발생했습니다: ' + error.message);
  }
}

// 사주 결과 표시 함수
function displaySajuResult(data) {
  const resultContainer = document.getElementById('resultContainer');
  if (!resultContainer) {
    console.error('resultContainer를 찾을 수 없습니다');
    return;
  }

  // 기본 정보 표시
  if (typeof displaySajuBasicInfo === 'function') {
    displaySajuBasicInfo(data);
  }

  // 카테고리별 결과 표시
  let resultHTML = '<div class="result-section">';
  
  if (data.result) {
    resultHTML += `<h3>${getCategoryName(selectedCategory)}</h3>`;
    resultHTML += `<div class="result-content">${data.result}</div>`;
  }
  
  resultHTML += '</div>';
  
  resultContainer.innerHTML = resultHTML;
  resultContainer.style.display = 'block';
}

// 카테고리 이름 변환
function getCategoryName(category) {
  const names = {
    'total': '종합운',
    'career': '직업운',
    'wealth': '재물운',
    'love': '애정운',
    'health': '건강운',
    'study': '학업운',
    'sinsal': '신살',
    'taekil': '택일'
  };
  return names[category] || category;
}
