# 🚨 긴급 사주 정보 시스템 진단 요청

## 📋 상황 요약

**현재 상태:** 사주팔자 기능만 "모든 항목을 입력해주세요!" 오류 발생  
**다른 7개 기능:** 정상 작동 (오늘의 운세, 타로, 토정비결 등)  
**문제 발생 시점:** 최근 수정 후

---

## 🎯 시스템 설계 의도

### 사용자 정보 관리 흐름
```
[사용자] 
  ↓ (사주 변경 버튼 클릭)
[메인페이지 또는 각 기능 페이지의 모달]
  ↓ (생년월일, 성별, 태어난 시간 입력)
[localStorage: 'fortuneUserData' 저장]
  ↓
[8개 기능이 공통으로 사용]
  ├─ 오늘의 운세
  ├─ 타로 카드
  ├─ 사주팔자 ⚠️ (문제 발생)
  ├─ 토정비결
  ├─ 꿈 해몽
  ├─ 별자리 운세
  ├─ 로또 번호
  └─ 궁합 보기
```

### 요구사항
1. **한 곳에서 변경 → 모든 곳에 반영**: localStorage 'fortuneUserData' 중앙 관리
2. **실제 사용자 정보로 프롬프트 생성**: 백엔드 API 호출 시 사용자 데이터 전송
3. **정확한 해석**: Claude API에 정확한 사주 정보 전달

---

## 🔍 점검 포인트

### 1. 프론트엔드 점검

#### 1.1 localStorage 구조 확인
```javascript
// 저장 위치
localStorage.setItem('fortuneUserData', JSON.stringify({
  gender: '남성',
  calendarType: '음력(평달)',
  year: '1984',
  month: '7',
  day: '7',
  birthTime: '未(13:31~15:30)'
}));
```

**확인 사항:**
- [ ] 모든 페이지에서 동일한 키 'fortuneUserData' 사용?
- [ ] 데이터 구조가 일관적인가?
- [ ] 모달에서 저장 후 localStorage 업데이트 확인?

#### 1.2 각 기능별 데이터 사용 방식 비교

**오늘의 운세 (정상 작동):**
```javascript
// frontend/pages/daily-fortune-test.html
let savedData = JSON.parse(localStorage.getItem('fortuneUserData')) || {
  // 기본값
};

async function getDailyFortune() {
  const userData = loadUserInfo();
  if (!userData) {
    openModal();
    return;
  }
  
  // savedData 사용
  const year = parseInt(savedData.year);
  const month = parseInt(savedData.month);
  // ...
}
```

**사주팔자 (문제 발생):**
```javascript
// frontend/pages/saju-api-functions.js
async function calculateSaju() {
  // ❌ HTML input에서 직접 읽기
  const year = document.getElementById('year').value;
  const month = document.getElementById('month').value;
  // ...
  
  if (!year || !month || ...) {
    alert('모든 항목을 입력해주세요!');  // 여기서 멈춤!
    return;
  }
}
```

**문제:**
- 오늘의 운세: `savedData` (localStorage) 직접 사용 ✅
- 사주팔자: `document.getElementById()` (HTML input) 사용 ❌
- **모달 안의 input은 모달이 열리지 않으면 비어있음!**

#### 1.3 점검 파일 목록
```
frontend/pages/daily-fortune-test.html  (정상 - 참고용)
frontend/pages/saju-test.html           (메인 페이지)
frontend/pages/saju-api-functions.js    (문제 발생 지점!)
frontend/pages/saju-main.js             (모달 관리)
frontend/utils/ticket-wrapper.js        (이용권 체크)
```

---

### 2. 백엔드 점검

#### 2.1 API 엔드포인트 확인
```
POST /api/daily-fortune  (오늘의 운세 - 정상)
POST /api/saju           (사주팔자 - 확인 필요)
```

**확인 사항:**
- [ ] `/api/saju` 엔드포인트가 존재하는가?
- [ ] 요청 body 형식이 올바른가?
- [ ] 필수 파라미터: `year, month, day, hour, isLunar, gender, category`

#### 2.2 Claude API 프롬프트 생성
```javascript
// 백엔드에서 사용자 정보로 프롬프트 생성
const prompt = `
당신은 사주명리학 전문가입니다.
생년월일: ${year}년 ${month}월 ${day}일
태어난 시간: ${hour}시
성별: ${gender}
...
`;
```

**확인 사항:**
- [ ] 사용자 데이터가 프롬프트에 정확히 반영되는가?
- [ ] 백엔드 로그에 정확한 값이 찍히는가?

#### 2.3 점검 파일 목록
```
backend/routes/analytics.js  (API 라우터)
server.js                     (메인 서버)
```

---

### 3. MongoDB 점검

#### 3.1 사용자 정보 저장 여부
**확인 사항:**
- [ ] 사용자 정보가 DB에 저장되는가? (필요시)
- [ ] 또는 localStorage만 사용하는가?

#### 3.2 이용권 시스템 연동
```javascript
// MongoDB 컬렉션
{
  deviceId: 'device_xxx',
  tickets: 2,
  charged: true,
  usedFeatures: ['오늘의 운세']  // 사주팔자도 여기 기록되어야 함
}
```

---

## 🔧 예상 해결 방법

### 방법 1: calculateSaju 함수 수정 (권장)
```javascript
// saju-api-functions.js 수정
async function calculateSaju() {
  // localStorage에서 읽기 (오늘의 운세 방식)
  const savedData = JSON.parse(localStorage.getItem('fortuneUserData'));
  
  if (!savedData) {
    alert('사주 정보를 먼저 입력해주세요.');
    // 모달 열기
    const modal = document.getElementById('sajuModal');
    if (modal) modal.classList.add('active');
    return;
  }
  
  // savedData에서 값 추출
  const year = parseInt(savedData.year);
  const month = parseInt(savedData.month);
  const day = parseInt(savedData.day);
  const gender = savedData.gender;
  const isLunar = savedData.calendarType.includes('음력');
  
  // 시간 파싱 (예: "未(13:31~15:30)" -> 13)
  const timeMatch = savedData.birthTime.match(/\((\d+):/);
  const hour = timeMatch ? parseInt(timeMatch[1]) : 12;
  
  // 로딩 표시
  document.getElementById('loading').style.display = 'block';
  
  try {
    // API 호출
    const response = await fetch(API_BASE_URL + '/api/saju', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year, month, day, hour, isLunar, gender,
        category: selectedCategory  // 전역 변수
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      displaySajuResult(data);
    }
  } catch (error) {
    console.error('[Saju API] 오류:', error);
    alert('사주 계산 중 오류가 발생했습니다.');
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
}
```

### 방법 2: 모든 페이지 일관성 확인
- 8개 기능이 모두 같은 방식으로 savedData 사용하는지 확인
- 불일치하는 부분 통일

---

## 📊 현재 오류 로그

```
Console:
[Ticket Wrapper] check.reason: has_tickets
[Ticket Wrapper] check.tickets: 2
[Ticket Wrapper] 사용자가 이용권 사용 확인
기능 실행
→ alert('모든 항목을 입력해주세요!')  ⚠️

원인: document.getElementById('year').value === ""
```

---

## ✅ 점검 체크리스트

### 프론트엔드
- [ ] localStorage 'fortuneUserData' 존재 및 구조 확인
- [ ] 모달에서 저장 시 localStorage 업데이트 확인
- [ ] 8개 기능 모두 savedData 사용 방식 통일 확인
- [ ] calculateSaju 함수가 savedData 사용하도록 수정
- [ ] 모달 열기/닫기 정상 작동 확인

### 백엔드
- [ ] /api/saju 엔드포인트 존재 확인
- [ ] 요청 파라미터 검증 로직 확인
- [ ] Claude API 프롬프트에 사용자 정보 반영 확인
- [ ] 백엔드 로그에서 정확한 값 수신 확인

### 데이터베이스
- [ ] 이용권 시스템 정상 작동 (이미 확인됨 ✅)
- [ ] 사용자 정보 저장 방식 확인 (필요시)

---

## 🚀 새 Claude 세션 시작 명령어

```
아래 내용을 새 Claude 창에 복사하세요:

---

안녕하세요. 운세 플랫폼 프로젝트 긴급 진단이 필요합니다.

**상황:**
- 8개 기능 중 7개는 정상 작동
- 사주팔자만 "모든 항목을 입력해주세요!" 오류 발생
- 이용권 시스템은 정상 (tickets: 2)

**프로젝트 경로:**
C:\xampp\htdocs\mysite\운세플랫폼

**핵심 문제:**
다른 기능(오늘의 운세 등)은 localStorage의 'fortuneUserData'를 사용하는데,
사주팔자는 HTML input에서 직접 값을 읽으려고 해서 빈 값 오류 발생.

**점검 요청:**
1. frontend/pages/saju-api-functions.js의 calculateSaju() 함수 확인
2. 오늘의 운세(daily-fortune-test.html)와 비교
3. savedData 기반으로 수정 필요

**진단 문서:**
C:\xampp\htdocs\mysite\운세플랫폼\docs\URGENT_SAJU_SYSTEM_DIAGNOSIS.md

이 문서를 읽고 시스템 전체를 점검해주세요.
특히 calculateSaju 함수를 getDailyFortune 방식으로 수정해야 합니다.
```

---

## 📁 관련 파일 경로

```
프론트엔드:
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-test.html
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-api-functions.js
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-main.js
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\daily-fortune-test.html  (참고용)

백엔드:
C:\xampp\htdocs\mysite\운세플랫폼\server.js
C:\xampp\htdocs\mysite\운세플랫폼\backend\routes\

문서:
C:\xampp\htdocs\mysite\운세플랫폼\docs\URGENT_SAJU_SYSTEM_DIAGNOSIS.md
```

---

**작성일:** 2025-10-21  
**작성자:** 시스템 진단  
**우선순위:** 🔴 긴급
