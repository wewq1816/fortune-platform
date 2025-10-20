# 사주 시스템 긴급 수정 가이드
**일시**: 2025-10-21  
**우선순위**: 🔴 긴급  
**파일**: `frontend/pages/saju-api-functions.js`

---

## 🚨 문제 진단

### 현재 상태
```javascript
// saju-api-functions.js (현재)
async function calculateSaju() {
  // ❌ 문제: HTML input에서 직접 읽음
  const year = document.getElementById('year').value;
  const month = document.getElementById('month').value;
  const day = document.getElementById('day').value;
  const gender = document.getElementById('gender').value;
  const selectedTime = document.getElementById('birthTime') ? 
    document.getElementById('birthTime').value : null;
  
  // API 호출
  const response = await fetchWithDeviceId(API_URL, {
    body: JSON.stringify({ year, month, day, hour: selectedTime })
  });
}
```

**문제점**
1. savedData는 `checkTicketAndGenerateSaju()`에서 확인만 함
2. 실제 API 호출은 HTML input에서 직접 읽음
3. **savedData와 HTML input이 다를 수 있음!**
4. 사용자가 다른 페이지에서 사주를 변경해도 반영 안됨

---

## ✅ 해결 방법

### 1단계: saju-api-functions.js 수정
```javascript
// 전역 변수 확인 (이미 있어야 함)
let savedData = null;

// calculateSaju 함수 수정
async function calculateSaju() {
  // ✅ savedData에서 직접 읽기
  if (!savedData) {
    const savedDataFromStorage = localStorage.getItem('fortuneUserData');
    if (!savedDataFromStorage) {
      alert('사주 정보가 없습니다. 먼저 사주를 입력해주세요.');
      openModal();
      return;
    }
    savedData = JSON.parse(savedDataFromStorage);
  }

  // ✅ savedData에서 값 추출
  const year = parseInt(savedData.year);
  const month = parseInt(savedData.month);
  const day = parseInt(savedData.day);
  const gender = savedData.gender;
  const birthTime = savedData.birthTime;

  // 시간 검증
  if (birthTime === '태어난 시간' || !birthTime) {
    alert('태어난 시간을 입력해주세요!');
    openModal();
    return;
  }

  // 로딩 표시
  document.getElementById('loading').classList.add('show');

  try {
    // ✅ 실제 API 호출 (savedData 사용)
    const response = await fetchWithDeviceId(
      'https://fortune-platform.onrender.com/api/saju',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          year: year,
          month: month,
          day: day,
          hour: birthTime,
          isLunar: savedData.calendarType.includes('음력'),
          gender: gender,
          category: 'total' // 기본적으로 총운
        })
      }
    );

    if (!response.ok) {
      throw new Error('API 호출 실패');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || '사주 계산 실패');
    }

    // 전역 변수에 저장
    sajuData = {
      saju: data.saju,
      elements: data.elements,
      strength: data.strength,
      yongsin: data.yongsin,
      tenStars: data.tenStars,
      gender: gender,
      birthInfo: { year, month, day, hour: birthTime },
      interpretations: {
        total: data.interpretation // 첫 응답은 총운
      }
    };

    // 결과 표시
    displayResult(sajuData);
    
    document.getElementById('loading').classList.remove('show');

  } catch (error) {
    console.error('오류:', error);
    alert('사주 계산 중 오류가 발생했습니다: ' + error.message);
    document.getElementById('loading').classList.remove('show');
  }
}
```

---

### 2단계: saju-main.js 확인
```javascript
// saju-main.js에 이미 있어야 함
let savedData = null;

// 페이지 로드 시 savedData 초기화
window.onload = function() {
  const savedDataFromStorage = localStorage.getItem('fortuneUserData');
  if (savedDataFromStorage) {
    savedData = JSON.parse(savedDataFromStorage);
  }
  loadUserInfo();
};

// localStorage 동기화
window.addEventListener('pageshow', function(event) {
  const latestData = localStorage.getItem('fortuneUserData');
  if (latestData) {
    savedData = JSON.parse(latestData);
    loadUserInfo();
  }
});

window.addEventListener('focus', function() {
  const latestData = localStorage.getItem('fortuneUserData');
  if (latestData) {
    savedData = JSON.parse(latestData);
    loadUserInfo();
  }
});
```

---

### 3단계: showCategory 함수도 수정
```javascript
// 카테고리 전환 (API 호출)
async function showCategory(category) {
  currentCategory = category;
  
  // 탭 활성화
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // 이미 로드된 해석이 있으면 표시
  if (sajuData.interpretations[category]) {
    document.getElementById('interpretation').textContent = 
      sajuData.interpretations[category];
    return;
  }

  // 로딩 표시
  const interpretationEl = document.getElementById('interpretation');
  interpretationEl.innerHTML = 
    '<div style="text-align: center; padding: 20px;">로딩 중...</div>';

  try {
    // ✅ savedData에서 직접 읽기
    const response = await fetchWithDeviceId(
      'https://fortune-platform.onrender.com/api/saju',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          year: parseInt(savedData.year),
          month: parseInt(savedData.month),
          day: parseInt(savedData.day),
          hour: savedData.birthTime,
          isLunar: savedData.calendarType.includes('음력'),
          gender: savedData.gender,
          category: category,
          sajuData: sajuData.saju // 사주팔자 정보 전달
        })
      }
    );

    const data = await response.json();
    
    if (data.success) {
      sajuData.interpretations[category] = data.interpretation;
      interpretationEl.textContent = data.interpretation;
    } else {
      throw new Error(data.error || '해석 실패');
    }

  } catch (error) {
    console.error('오류:', error);
    interpretationEl.innerHTML = 
      '<div style="color: red;">해석을 불러올 수 없습니다</div>';
  }
}
```

---

## 🧪 테스트 시나리오

### 테스트 1: 정상 사용
1. 사주변경 버튼 클릭
2. 정보 입력 후 저장
3. "사주팔자" 버튼 클릭
4. **예상 결과**: savedData 값으로 API 호출 ✅

### 테스트 2: 다른 페이지에서 변경 후
1. 오늘의 운세 페이지 이동
2. 사주변경으로 정보 수정
3. 사주팔자 페이지로 돌아옴
4. "사주팔자" 버튼 클릭
5. **예상 결과**: 변경된 정보로 API 호출 ✅

### 테스트 3: localStorage 동기화
1. 브라우저 콘솔에서 localStorage 직접 수정
   ```javascript
   localStorage.setItem('fortuneUserData', JSON.stringify({
     gender: '여성',
     year: '1990',
     month: '5',
     day: '15',
     birthTime: '午(11:31~13:30)',
     calendarType: '양력'
   }));
   ```
2. 페이지 새로고침 또는 포커스
3. "사주팔자" 버튼 클릭
4. **예상 결과**: 수정된 정보로 API 호출 ✅

---

## 📋 수정 체크리스트

- [ ] saju-api-functions.js 백업
- [ ] calculateSaju() 함수 수정
  - [ ] HTML input 제거
  - [ ] savedData에서 직접 읽기
  - [ ] isLunar 계산 추가
- [ ] showCategory() 함수 수정
  - [ ] savedData 사용
- [ ] saju-main.js 확인
  - [ ] savedData 전역 변수 선언
  - [ ] localStorage 동기화 확인
- [ ] 브라우저 테스트
  - [ ] 정상 사용 테스트
  - [ ] 다른 페이지에서 변경 후 테스트
  - [ ] localStorage 동기화 테스트
- [ ] 콘솔 에러 확인
- [ ] API 응답 확인

---

## 🔄 롤백 방법

만약 문제 발생 시:
```bash
# Git으로 롤백
git checkout HEAD -- frontend/pages/saju-api-functions.js
git checkout HEAD -- frontend/pages/saju-main.js
```

또는 백업 파일 복원:
```
saju-api-functions.js.backup → saju-api-functions.js
```

---

## 📊 예상 효과

**수정 전**
- savedData: `{year: 1990, month: 5, day: 15}`
- HTML input: `{year: 1984, month: 7, day: 7}` (다를 수 있음)
- API 호출: `1984년 7월 7일` ❌

**수정 후**
- savedData: `{year: 1990, month: 5, day: 15}`
- HTML input: (사용 안함)
- API 호출: `1990년 5월 15일` ✅

---

**수정 완료 후 이 문서 확인**: `FULL_SYSTEM_INSPECTION_RESULT.md`
