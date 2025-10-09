# 🧪 디바이스 ID 보안 시스템 테스트 가이드

## 🎯 테스트 목적
IP 변경으로 무한 충전이 불가능한지 확인

---

## ⚙️ 사전 준비

### 1. 서버 실행
```bash
cd C:\xampp\htdocs\mysite\운세플랫폼
node server.js
```

**확인 사항:**
- ✅ 포트 3000에서 실행 중
- ✅ Redis 연결 (또는 메모리 모드)
- ✅ 디바이스 ID 미들웨어 로드

---

## 🧪 테스트 시나리오

### 테스트 1: 디바이스 ID 생성 확인 ✅

**목적:** 브라우저 지문이 정상 생성되는지 확인

**절차:**
1. http://localhost:3000 접속
2. F12 개발자 도구 열기
3. 콘솔 탭 확인

**예상 결과:**
```javascript
🔐 디바이스 지문 모듈 로드 완료
🔐 디바이스 지문 생성 시작...
✅ 디바이스 ID 생성 완료: 1a2b3c4d5e6f
💾 디바이스 ID 저장됨: 1a2b3c4d5e6f
📡 이용권 API 모듈 로드 완료
✅ 디바이스 ID 준비 완료: 1a2b3c4d...
```

**확인 방법:**
```javascript
// 콘솔에서 실행
localStorage.getItem('fortune_device_id')
// 결과: "1a2b3c4d5e6f" (고유 ID)
```

---

### 테스트 2: 이용권 충전 ✅

**목적:** 정상적으로 이용권이 충전되는지 확인

**절차:**
1. 쿠팡 게이트 메뉴 클릭
2. 서버 로그 확인

**예상 서버 로그:**
```
💰 이용권 충전: 1a2b3c4d...
```

**확인 방법:**
```javascript
// 콘솔에서 실행
await window.TicketAPI.check()
// 결과: { success: true, tickets: 2, charged: true }
```

---

### 테스트 3: 이용권 사용 ✅

**목적:** 이용권이 정상적으로 소모되는지 확인

**절차:**
1. "사주팔자" 메뉴 클릭
2. 사주 정보 입력 후 결과 확인
3. 서버 로그 확인

**예상 서버 로그:**
```
🎫 이용권 사용: 1a2b3c4d... - 사주팔자 (남은: 1)
```

**확인 방법:**
```javascript
await window.TicketAPI.check()
// 결과: { success: true, tickets: 1, charged: true }
```

---

### 테스트 4: 2회 사용 후 차단 ✅

**목적:** 2회 사용 후 3회째 차단되는지 확인

**절차:**
1. 사주팔자 2회 사용
2. 3회째 시도
3. 차단 메시지 확인

**예상 결과:**
```javascript
{
  "success": false,
  "error": "이용권이 부족합니다",
  "code": "TICKETS_EXHAUSTED",
  "message": "오늘의 이용권을 모두 사용했습니다. 내일 다시 이용해주세요."
}
```

**예상 서버 로그:**
```
🚫 이용권 없음: 1a2b3c4d... (charged: true)
```

---

### 테스트 5: 재충전 차단 ✅

**목적:** 하루에 1회만 충전 가능한지 확인

**절차:**
1. 이미 충전한 상태에서
2. 쿠팡 게이트 다시 방문
3. 차단 메시지 확인

**예상 결과:**
```javascript
{
  "success": false,
  "tickets": 0,
  "error": "오늘은 이미 충전했습니다.",
  "code": "ALREADY_CHARGED"
}
```

---

### 테스트 6: IP 변경 후 차단 (핵심!) 🔥

**목적:** IP 바꿔도 같은 디바이스면 차단되는지 확인

**절차:**
1. 정상적으로 충전 완료
2. **VPN 켜기** 또는 **모바일 데이터 전환**
3. 다시 충전 시도

**예상 결과:**
```javascript
{
  "success": false,
  "tickets": 2,
  "error": "오늘은 이미 충전했습니다.",
  "code": "ALREADY_CHARGED"
}
```

**확인 포인트:**
- ✅ IP는 변경됨 (VPN/모바일)
- ✅ 디바이스 ID는 동일
- ✅ 차단됨!

**네트워크 탭 확인:**
```
Request Headers:
X-Device-ID: 1a2b3c4d5e6f
```

---

### 테스트 7: 브라우저 재시작 ✅

**목적:** 브라우저 재시작해도 같은 디바이스 ID인지 확인

**절차:**
1. 현재 디바이스 ID 확인
```javascript
localStorage.getItem('fortune_device_id')
// 결과: "1a2b3c4d5e6f"
```

2. 브라우저 완전 종료

3. 다시 열고 확인
```javascript
localStorage.getItem('fortune_device_id')
// 결과: "1a2b3c4d5e6f" (동일!)
```

**예상 결과:**
- ✅ 같은 디바이스 ID
- ✅ 이용권 상태 유지

---

### 테스트 8: localStorage 삭제 후 재생성 ✅

**목적:** localStorage 지워도 같은 ID가 재생성되는지 확인

**절차:**
1. 기존 ID 확인
```javascript
const oldId = localStorage.getItem('fortune_device_id');
console.log('기존 ID:', oldId);
```

2. localStorage 삭제
```javascript
localStorage.removeItem('fortune_device_id');
```

3. 페이지 새로고침 (F5)

4. 새 ID 확인
```javascript
const newId = localStorage.getItem('fortune_device_id');
console.log('새 ID:', newId);
console.log('동일?', oldId === newId);
```

**예상 결과:**
```
기존 ID: 1a2b3c4d5e6f
새 ID: 1a2b3c4d5e6f
동일? true ✅
```

---

### 테스트 9: 마스터 모드 ⭐

**목적:** 마스터 모드에서 무제한 사용 가능한지 확인

**절차 A: URL 파라미터**
```
http://localhost:3000?unlock=cooal
```

**절차 B: 콘솔에서 활성화**
```javascript
localStorage.setItem('master_mode', 'true');
```

**예상 결과:**
- ✅ 이용권 무제한
- ✅ 충전 불필요
- ✅ 차단 없음

**서버 로그:**
```
🔓 마스터 모드 접근
🔓 마스터 모드 사용: 사주팔자
```

---

### 테스트 10: 다른 브라우저 ✅

**목적:** 같은 PC, 다른 브라우저는 다른 디바이스로 인식되는지 확인

**절차:**
1. Chrome에서 충전
2. Firefox 또는 Edge 열기
3. 디바이스 ID 확인

**예상 결과:**
- ✅ 다른 디바이스 ID
- ✅ 독립적으로 충전 가능

**이유:** 브라우저마다 Canvas/WebGL 렌더링이 다름

---

## 🐛 문제 해결

### 문제 1: 디바이스 ID가 계속 바뀜

**증상:**
```javascript
localStorage.getItem('fortune_device_id')
// 매번 다른 값
```

**원인:** Canvas/WebGL 불안정

**해결:**
1. 브라우저 하드웨어 가속 확인
2. GPU 드라이버 업데이트
3. 다른 브라우저 테스트

---

### 문제 2: 이용권 충전 실패

**증상:**
```
네트워크 오류 또는 400 Bad Request
```

**확인 사항:**
1. 네트워크 탭에서 헤더 확인
```
X-Device-ID: (있는지 확인)
```

2. 콘솔에서 수동 충전
```javascript
await window.TicketAPI.charge()
```

3. 서버 로그 확인

---

### 문제 3: Redis 연결 실패

**증상:**
```
❌ Redis 연결 실패
⚠️ Redis 없이 실행 (메모리 모드로 폴백)
```

**상태:** 정상! (메모리 모드로 작동)

**주의:** 서버 재시작 시 데이터 손실

**프로덕션용:** Redis 설치 필요

---

## 📊 테스트 체크리스트

### 기본 기능
- [ ] 디바이스 ID 생성
- [ ] 이용권 충전
- [ ] 이용권 사용
- [ ] 2회 사용 후 차단
- [ ] 재충전 차단

### 보안 테스트
- [ ] IP 변경 후 차단 🔥
- [ ] VPN 사용 후 차단
- [ ] 프록시 사용 후 차단
- [ ] localStorage 삭제 후 재생성
- [ ] 브라우저 재시작 후 동일 ID

### 호환성 테스트
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] 모바일 Safari
- [ ] 모바일 Chrome

---

## 🎯 성공 기준

### ✅ 필수
1. IP 변경해도 차단됨
2. VPN 사용해도 차단됨
3. localStorage 지워도 같은 ID 재생성
4. 브라우저 재시작해도 ID 유지

### ✅ 권장
1. Redis 연결 성공
2. 모든 브라우저에서 작동
3. 모바일에서도 정상 작동

---

## 📝 테스트 기록

### 테스트 일시
- 날짜: ___________
- 테스터: ___________

### 결과
- [ ] 모든 테스트 통과
- [ ] 일부 실패 (아래에 기록)

### 실패 항목
```
1. _______________________
2. _______________________
3. _______________________
```

### 비고
```
_______________________________
_______________________________
_______________________________
```

---

**🧪 테스트를 시작하세요!**
