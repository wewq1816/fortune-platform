# API 오류 진단 보고서

작성일: 2025-01-07
상태: 긴급 - API 호출 실패

---

## 현재 상황

### 증상
- 프론트엔드에서 API 호출 시 오류 발생
- 백엔드 서버 콘솔에는 API 요청 로그가 전혀 안 찍힘
- 이용권 사용 로그는 정상 출력됨

### F12 콘솔 오류
```
POST http://localhost:3000/api/analytics/api/daily-fortune
404 (Not Found)

오류: Error: API 호출 실패
  at callRealDailyFortuneAPI (daily-fortune-test.html:783:15)
  at async getDailyFortuneData (daily-fortune-test.html:794:14)
  at async getDailyFortune (daily-fortune-test.html:846:22)
```

### 백엔드 콘솔 상태
```
✅ MongoDB 연결 성공
✅ 관리자 및 분석 시스템 초기화 완료
❌ Redis 오류 (메모리 모드로 폴백)
📊 방문 기록: device_1e91cfbdf40fae05df187ef7b8b9c7f0 (재방문)
📊 이용권 사용: device_1e91cfbdf40fae05df187ef7b8b9c7f0 - 오늘의 운세
```

---

## 핵심 문제 발견

### 1. URL 이중 경로 문제

**오류 URL:**
```
http://localhost:3000/api/analytics/api/daily-fortune
                      ^^^^^^^^^^^^^^ 잘못됨
```

**정상 URL이어야 함:**
```
http://localhost:3000/api/daily-fortune
```

### 2. 원인 분석

`analytics-tracker.js` 파일:
```javascript
// 14번째 줄
const API_BASE_URL = isLocalhost 
  ? 'http://localhost:3000/api/analytics'  // 문제!!!
  : 'https://fortune-platform.onrender.com/api/analytics';
```

`daily-fortune-test.html` 파일:
```javascript
// 783번째 줄
const response = await fetchWithDeviceId(API_BASE_URL + '/api/daily-fortune', {
```

**결과:**
```
'http://localhost:3000/api/analytics' + '/api/daily-fortune'
= 'http://localhost:3000/api/analytics/api/daily-fortune'  // 404 오류!
```

---

## 해결 방법

### analytics-tracker.js 수정 (14~16번째 줄)

**변경 전:**
```javascript
const API_BASE_URL = isLocalhost 
  ? 'http://localhost:3000/api/analytics'
  : 'https://fortune-platform.onrender.com/api/analytics';
```

**변경 후:**
```javascript
const API_BASE_URL = isLocalhost 
  ? 'http://localhost:3000'
  : 'https://fortune-platform.onrender.com';
```

### 이유
- `API_BASE_URL`은 **서버 루트 주소**만 포함해야 함
- 각 페이지에서 `/api/daily-fortune`, `/api/analytics/visit` 등을 추가하기 때문

---

## 추가 확인 사항

### 1. 디바이스 ID 보안
현재 정상 작동:
```
device_1e91cfbdf40fae05df187ef7b8b9c7f0
```

### 2. 이용권 시스템
정상 작동:
```
이용권 사용: device_1e91cfbdf40fae05df187ef7b8b9c7f0 - 오늘의 운세
```

### 3. 백엔드 API 엔드포인트
정상 대기 중:
```
POST /api/daily-fortune
POST /api/analytics/visit
POST /api/analytics/ticket-usage
```

---

## 수정 후 예상 결과

### 정상 API 호출:
```
POST http://localhost:3000/api/daily-fortune
200 OK
```

### 백엔드 로그 출력:
```
[2025-01-07 00:XX:XX] [REQUEST] POST /api/daily-fortune | IP: ::1
[2025-01-07 00:XX:XX] [BODY] {"year":1984,"month":7,"day":7,"hour":13,"isLunar":true}
📥 오늘의 운세 요청: {"year":1984,"month":7,"day":7,"hour":13,"isLunar":true}
🔮 사주 계산 시작...
✅ 사주 계산 완료: 갑자 을축 병인 정묘
Claude API 호출 중...
✅ 오늘의 운세 생성 완료!
```

---

## 즉시 실행할 명령

1. analytics-tracker.js 수정
2. Ctrl + Shift + R (강력 새로고침)
3. 백엔드 서버 재시작 (불필요하지만 안전)
4. 테스트

---

## 관련 파일

- `C:\xampp\htdocs\mysite\운세플랫폼\frontend\utils\analytics-tracker.js` (14번째 줄)
- `C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\daily-fortune-test.html` (783번째 줄)
- `C:\xampp\htdocs\mysite\운세플랫폼\server.js` (백엔드)

---

## 결론

**URL 경로가 이중으로 쌓여서 404 오류 발생**
- analytics-tracker.js에서 `/api/analytics`까지 포함
- 각 페이지에서 다시 `/api/XXX` 추가
- 결과: `/api/analytics/api/daily-fortune` (404)

**수정:** analytics-tracker.js의 API_BASE_URL에서 `/api/analytics` 제거
