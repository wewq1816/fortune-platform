# 🚨 API 400 오류 긴급 진단 보고서

작성일: 2025-01-07
상태: **CRITICAL - API 호출은 되지만 400 Bad Request 발생**

---

## 📋 현재 상황 요약

### ✅ 정상 작동하는 것
1. 프론트엔드 페이지 로딩
2. 디바이스 ID 생성 및 저장
3. 이용권 시스템 (차감 로직)
4. Analytics 추적 (방문 기록, 이용권 사용 기록)
5. 백엔드 서버 실행 (포트 3000)
6. MongoDB 연결

### ❌ 문제 발생하는 것
**오늘의 운세 API 호출 시 400 Bad Request**

---

## 🔍 오류 상세 정보

### F12 콘솔 오류
```
POST http://localhost:3000/api/daily-fortune 400 (Bad Request)

오류: Error: API 호출 실패
  at callRealDailyFortuneAPI (daily-fortune-test.html:783:15)
  at async getDailyFortuneData (daily-fortune-test.html:794:14)  
  at async getDailyFortune (daily-fortune-test.html:846:22)
```

### 백엔드 콘솔 상태
```
✅ MongoDB 연결 성공
✅ 서버 실행: http://localhost:3000
📊 방문 기록: device_df3e1cc5c505f6bf64cba77cb3b2253 (정상)
📊 이용권 사용: device_df3e1cc5c505f6bf64cba77cb3b2253 - 오늘의 운세 (정상)

❌ /api/daily-fortune 요청에 대한 로그 없음
   (logApiRequest 함수가 실행 안 됨)
```

---

## 🎯 핵심 문제

### 400 Bad Request의 의미
- **백엔드 서버까지 요청은 도달함**
- **하지만 요청 데이터가 검증 실패**
- **미들웨어나 라우터에서 거부됨**

### 가능한 원인

#### 1. 미들웨어에서 차단 (가장 유력)
```javascript
// server.js
app.post('/api/daily-fortune', checkTicketMiddleware, async (req, res) => {
```

**checkTicketMiddleware가 400을 반환하고 있을 가능성:**
- 디바이스 ID 검증 실패
- 이용권 확인 실패  
- 요청 형식 오류

#### 2. 요청 본문(body) 형식 오류
프론트엔드가 보내는 데이터:
```javascript
const requestData = {
  year: parseInt(savedData.year),
  month: parseInt(savedData.month),
  day: parseInt(savedData.day),
  hour: hour,
  isLunar: isLunar
};
```

백엔드가 기대하는 형식과 다를 수 있음

#### 3. 헤더 문제
```javascript
// api-helper.js
headers: {
  'X-Device-Id': deviceId,
  'X-Master-Code': 'cooal' // (마스터 모드일 때)
}
```

백엔드에서 특정 헤더를 강제할 수 있음

---

## 📂 관련 파일

### 프론트엔드
```
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\daily-fortune-test.html
- 783번째 줄: callRealDailyFortuneAPI()
- 846번째 줄: getDailyFortune()

C:\xampp\htdocs\mysite\운세플랫폼\frontend\utils\api-helper.js
- fetchWithDeviceId() - 헤더 추가

C:\xampp\htdocs\mysite\운세플랫폼\frontend\utils\ticket-system.js
- 이용권 차감 로직
```

### 백엔드
```
C:\xampp\htdocs\mysite\운세플랫폼\server.js
- checkTicketMiddleware - 이용권 검증 미들웨어
- POST /api/daily-fortune - 오늘의 운세 라우터

C:\xampp\htdocs\mysite\운세플랫폼\backend\routes\daily-fortune.js
- 실제 운세 생성 로직
```

---

## 🔧 즉시 확인해야 할 것

### 1. F12에서 요청 데이터 확인
```
1. F12 → Network 탭
2. daily-fortune 요청 클릭
3. Payload 탭 → 어떤 데이터를 보냈는지 확인
4. Response 탭 → 서버가 뭐라고 응답했는지 확인
```

**이 2개를 보면 즉시 원인 파악 가능!**

### 2. checkTicketMiddleware 로직 확인
```javascript
// server.js에서 이 미들웨어가 뭘 검사하는지 확인
const checkTicketMiddleware = async (req, res, next) => {
  // 여기서 400을 반환하고 있을 가능성
  // 디바이스 ID 검증?
  // 이용권 개수 확인?
  // 중복 사용 방지?
};
```

### 3. 백엔드 로그 추가
```javascript
// checkTicketMiddleware 맨 위에 추가
console.log('🎫 이용권 체크 시작:', {
  deviceId: req.headers['x-device-id'],
  body: req.body,
  path: req.path
});
```

이렇게 하면 미들웨어가 뭘 받았는지 볼 수 있음

---

## 🔍 의심되는 시나리오

### 시나리오 A: 디바이스 ID 중복 체크
```javascript
// 프론트엔드에서 이용권을 이미 차감함
trackTicketUsage('오늘의 운세');

// 백엔드 미들웨어에서 또 체크하려고 함
// "이미 사용했네?" → 400 반환
```

**해결:** 프론트엔드 이용권 차감을 주석 처리하고 테스트

### 시나리오 B: 보안 정책 충돌
최근 보안 관련 수정을 하면서:
- CORS 설정
- 디바이스 ID 검증 강화
- 중복 요청 방지

이런 것들이 정상 요청을 막고 있을 수 있음

### 시나리오 C: 요청 데이터 형식 오류
```javascript
// 백엔드가 기대하는 형식
{
  deviceId: "device_xxx",
  year: 1984,
  month: 7,
  day: 7,
  hour: 13,
  isLunar: true
}

// 프론트엔드가 보내는 형식
{
  // deviceId가 헤더에만 있고 body에 없음?
  year: 1984,
  month: 7,
  day: 7,
  hour: 13,
  isLunar: true
}
```

---

## ⚡ 즉시 실행할 디버깅 단계

### 1단계: 백엔드에 로그 추가
```javascript
// server.js의 checkTicketMiddleware 맨 위에
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎫 이용권 미들웨어 실행');
console.log('Device ID:', req.headers['x-device-id']);
console.log('Body:', JSON.stringify(req.body, null, 2));
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
```

### 2단계: 백엔드 재시작
```
Ctrl + C
node server.js
```

### 3단계: 프론트엔드에서 재시도
- 운세 보기 버튼 클릭
- 백엔드 콘솔 확인
- 어디서 막히는지 정확히 파악

### 4단계: F12 Network에서 Response 확인
- 서버가 정확히 어떤 에러 메시지를 보냈는지 확인
- 이게 가장 중요!

---

## 🎯 예상 해결 방법

### 방법 1: 미들웨어 임시 비활성화
```javascript
// server.js
// app.post('/api/daily-fortune', checkTicketMiddleware, async (req, res) => {
app.post('/api/daily-fortune', async (req, res) => {
```

이렇게 하고 테스트 → 통과하면 미들웨어가 문제

### 방법 2: 프론트엔드 이용권 차감 주석
```javascript
// daily-fortune-test.html
// if (typeof trackTicketUsage === 'function') {
//   trackTicketUsage('오늘의 운세');
// }
```

이렇게 하고 테스트 → 통과하면 중복 차감 문제

### 방법 3: 요청 데이터에 deviceId 추가
```javascript
// daily-fortune-test.html
const requestData = {
  deviceId: await getOrCreateDeviceId(), // 추가
  year: parseInt(savedData.year),
  month: parseInt(savedData.month),
  day: parseInt(savedData.day),
  hour: hour,
  isLunar: isLunar
};
```

---

## 📌 다음 단계

1. **F12 Network의 Response 탭 내용 확인** (최우선!)
2. 백엔드 checkTicketMiddleware에 로그 추가
3. 미들웨어 로직 검토
4. 필요시 미들웨어 수정

---

## 🔗 참고: 정상 작동 플로우

```
[프론트엔드]
사용자 클릭
  → 이용권 체크 (canUseFortune)
  → 이용권 차감 (trackTicketUsage) ✅
  → API 호출 (fetchWithDeviceId)
  
[백엔드]
요청 수신
  → checkTicketMiddleware ❌ 여기서 400!
  → (도달 못 함) 운세 생성 로직
  → (도달 못 함) 응답 반환
```

**문제는 checkTicketMiddleware!**

---

## 💡 결론

**F12 Network 탭에서 Response 내용을 확인하면 즉시 해결 가능합니다.**

서버가 정확히 왜 거부했는지 메시지를 보냈을 것입니다.
그 메시지만 보면 끝!
