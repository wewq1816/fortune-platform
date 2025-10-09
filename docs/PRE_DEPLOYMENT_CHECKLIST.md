# 🚀 운세플랫폼 배포 전 최종 점검 가이드

📅 작성일: 2025-01-09  
🎯 목적: 프로덕션 배포 전 전체 시스템 검증  
⏱️ 예상 소요: 2-3시간

---

## 📋 목차

1. [환경 설정 점검](#1-환경-설정-점검)
2. [파일 구조 점검](#2-파일-구조-점검)
3. [보안 시스템 점검](#3-보안-시스템-점검)
4. [8개 기능 개별 테스트](#4-8개-기능-개별-테스트)
5. [이용권 시스템 점검](#5-이용권-시스템-점검)
6. [관리자 시스템 점검](#6-관리자-시스템-점검)
7. [API 통신 점검](#7-api-통신-점검)
8. [성능 및 부하 테스트](#8-성능-및-부하-테스트)
9. [브라우저 호환성 테스트](#9-브라우저-호환성-테스트)
10. [최종 배포 준비](#10-최종-배포-준비)

---

## 1. 환경 설정 점검

### 1.1 필수 환경 변수 확인

```bash
# .env 파일 확인
cd C:\xampp\htdocs\mysite\운세플랫폼
type .env
```

**체크리스트:**
```
✅ PORT=3000 (또는 원하는 포트)
✅ CLAUDE_API_KEY=sk-ant-... (유효한 키)
✅ MONGO_URL=mongodb://... (연결 가능)
✅ JWT_SECRET=... (32자 이상 랜덤)
✅ MASTER_CODE=... (프로덕션용 강력한 코드)
✅ NODE_ENV=production (프로덕션 모드)
✅ ALLOWED_ORIGINS=https://yourdomain.com (실제 도메인)
```

**테스트:**
```bash
# 환경 변수 로드 확인
node -e "require('dotenv').config(); console.log('PORT:', process.env.PORT)"
```

**예상 출력:**
```
PORT: 3000
```

---

### 1.2 MongoDB 연결 확인

```bash
# MongoDB 실행 확인
mongosh
```

**MongoDB Shell에서:**
```javascript
// 데이터베이스 확인
use fortune_platform
show collections

// 필수 컬렉션 존재 확인
db.getCollectionNames()

// 예상 출력:
// - admin_users
// - admin_settings
// - analytics_visitors
// - analytics_coupang_clicks
// - analytics_ticket_usage
// - saju_cache (선택)
```

**관리자 계정 확인:**
```javascript
db.admin_users.findOne({ username: "cooal" })
```

**예상 출력:**
```json
{
  "_id": ObjectId("..."),
  "username": "cooal",
  "password": "$2a$10$...",  // bcrypt 해시
  "createdAt": ISODate("...")
}
```

---

### 1.3 Node.js 모듈 확인

```bash
cd C:\xampp\htdocs\mysite\운세플랫폼
npm list --depth=0
```

**필수 모듈 확인:**
```
✅ express@^4.18.2
✅ @anthropic-ai/sdk@^0.20.0
✅ mongodb@^6.3.0
✅ jsonwebtoken@^9.0.2
✅ bcryptjs@^2.4.3
✅ dotenv@^16.3.1
✅ cors@^2.8.5
✅ express-rate-limit@^7.1.5
✅ lunar-javascript@^1.6.12
✅ string-similarity@^4.0.4
```

**누락된 모듈이 있다면:**
```bash
npm install
```

---

### 1.4 Claude API 키 유효성 확인

**테스트 스크립트 작성:**
```javascript
// test-claude-api.js
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

async function testAPI() {
  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 100,
      messages: [{
        role: "user",
        content: "안녕하세요"
      }]
    });
    console.log('✅ Claude API 연결 성공!');
    console.log('응답:', response.content[0].text);
  } catch (error) {
    console.log('❌ Claude API 연결 실패:', error.message);
  }
}

testAPI();
```

**실행:**
```bash
node test-claude-api.js
```

**예상 출력:**
```
✅ Claude API 연결 성공!
응답: 안녕하세요! 무엇을 도와드릴까요?
```

---

## 2. 파일 구조 점검

### 2.1 핵심 파일 존재 확인

```bash
# PowerShell에서 실행
cd C:\xampp\htdocs\mysite\운세플랫폼

# 프론트엔드 핵심 파일
Test-Path frontend\index.html
Test-Path frontend\pages\daily-fortune-test.html
Test-Path frontend\pages\tarot-mock.html
Test-Path frontend\pages\saju-test.html
Test-Path frontend\pages\tojeong-test.html
Test-Path frontend\pages\dream.html
Test-Path frontend\pages\horoscope.html
Test-Path frontend\pages\lotto.html
Test-Path frontend\pages\compatibility-test.html
Test-Path frontend\pages\coupang-gate.html

# 이용권 시스템
Test-Path frontend\utils\ticket-system.js
Test-Path frontend\components\common\TicketModal.jsx

# 백엔드 엔진
Test-Path engines\core\daily-engine.js
Test-Path engines\core\tarot-engine.js
Test-Path engines\core\saju-engine.js
Test-Path engines\core\tojeong-engine.js
Test-Path engines\core\dream-engine.js
Test-Path engines\core\horoscope-engine.js
Test-Path engines\core\compatibility-engine.js

# 필수 유틸
Test-Path engines\utils\saju-calculator.js
Test-Path engines\data\ganzi-60.json

# 관리자 시스템
Test-Path frontend\admin\login.html
Test-Path frontend\admin\dashboard.html
Test-Path backend\routes\admin.js
Test-Path backend\middleware\auth.js
```

**모두 True 출력되어야 함**

---

### 2.2 삭제 대상 파일 확인

```bash
# 삭제되어야 할 파일들
Test-Path frontend\pages\daily-fortune.html  # False여야 함
Test-Path frontend\pages\saju-basic-calculator.js  # False여야 함
Test-Path frontend\pages\backup_20251006_191341  # False여야 함
```

**모두 False 출력되어야 함 (파일이 없어야 정상)**

---

### 2.3 파일 권한 확인 (Linux/Mac만 해당)

```bash
# Windows는 생략
# Linux/Mac에서는 실행 권한 확인
ls -la server.js
chmod +x server.js  # 필요시
```

---

## 3. 보안 시스템 점검

### 3.1 IP 기반 이용권 시스템 테스트

**서버 시작:**
```bash
cd C:\xampp\htdocs\mysite\운세플랫폼
node server.js
```

**확인할 로그:**
```
✅ Rate Limiting 활성화: Claude API는 15분당 10,000회 제한
✅ IP 이용권 자동 초기화 스케줄러 시작
🔮 운세 플랫폼 서버 실행 중!
```

---

**테스트 1: 이용권 충전**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/tickets/charge" -Method POST
```

**예상 응답:**
```json
{
  "success": true,
  "tickets": 2,
  "message": "이용권 2개가 충전되었습니다!"
}
```

✅ **통과 조건:** success: true, tickets: 2

---

**테스트 2: 중복 충전 시도**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/tickets/charge" -Method POST
```

**예상 응답:**
```json
{
  "success": false,
  "error": "오늘은 이미 충전했습니다."
}
```

✅ **통과 조건:** success: false, 중복 충전 차단

---

**테스트 3: localStorage 조작 시도 (해킹 방어)**

**브라우저에서:**
1. http://localhost:3000 접속
2. F12 → Console
3. 실행:
```javascript
localStorage.setItem('fortune_tickets', JSON.stringify({
  date: '2025-01-09',
  count: 9999,  // 조작!
  charged: false
}));

// 사주팔자 API 직접 호출
fetch('http://localhost:3000/api/saju', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    year: 1990, month: 1, day: 1, hour: 12,
    gender: '남자', category: 'total'
  })
});
```

**예상 결과:**
```json
{
  "success": false,
  "error": "이용권이 부족합니다",
  "code": "NEED_CHARGE"
}
```

✅ **통과 조건:** localStorage 조작해도 403 차단

---

**테스트 4: 이용권 소진 (2회 제한)**

**1회차:**
```powershell
$body = @{
  year = 1990
  month = 1
  day = 1
  hour = 12
  gender = "남자"
  category = "total"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/saju" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

✅ **1회차 성공 (남은 이용권: 1)**

**2회차:** 같은 명령어 재실행

✅ **2회차 성공 (남은 이용권: 0)**

**3회차:** 같은 명령어 재실행

**예상 응답:**
```json
{
  "success": false,
  "error": "이용권이 부족합니다",
  "code": "TICKETS_EXHAUSTED"
}
```

✅ **통과 조건:** 3회째 차단됨

---

### 3.2 Rate Limiting 테스트

**도구 설치:**
```bash
npm install -g autocannon
```

**부하 테스트:**
```bash
autocannon -c 100 -d 5 http://localhost:3000/api/tickets/check
```

**예상 출력:**
```
Running 5s test @ http://localhost:3000/api/tickets/check
100 connections

┌─────────┬──────┬──────┬────────┬─────────┬───────────┬──────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5%  │ 99%     │ Avg       │ Stdev    │
├─────────┼──────┼──────┼────────┼─────────┼───────────┼──────────┤
│ Latency │ 1 ms │ 2 ms │ 10 ms  │ 15 ms   │ 3.2 ms    │ 2.1 ms   │
└─────────┴──────┴──────┴────────┴─────────┴───────────┴──────────┘

✅ 99% 요청이 15ms 이내 응답
✅ Rate Limiting 작동 중 (10,000회 제한)
```

---

### 3.3 마스터 모드 테스트

**방법 1: URL 파라미터**
```
http://localhost:3000?unlock=cooal
```

브라우저 콘솔 확인:
```
🔓 마스터 모드 활성화
```

**방법 2: 헤더**
```powershell
$headers = @{
  "X-Master-Code" = "cooal"
}

$body = @{
  year = 1990
  month = 1
  day = 1
  hour = 12
  gender = "남자"
  category = "total"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/saju" `
  -Method POST `
  -Headers $headers `
  -ContentType "application/json" `
  -Body $body
```

✅ **통과 조건:** 이용권 무시하고 무제한 사용 가능

---

## 4. 8개 기능 개별 테스트

### 4.1 오늘의 운세

**접속:**
```
http://localhost:3000/pages/daily-fortune-test.html
```

**테스트 시나리오:**
1. 생년월일 입력: 1990-01-01
2. 시간 선택: 12시
3. 성별 선택: 남자
4. [운세 보기] 클릭

**확인 사항:**
- [ ] 이용권 확인 모달 표시
- [ ] 이용권 1개 차감
- [ ] 로딩 애니메이션 표시
- [ ] 사주 사신주 표시
- [ ] 오행 분석 표시
- [ ] 종합 운세 표시
- [ ] 사주 정보 localStorage 저장
- [ ] 에러 없음

**예상 응답 시간:** 3-8초

**예상 출력:**
```
🌟 오늘의 운세

사주 사신주:
경오년 무인월 갑자일 경오시

오행 분석:
목 1 화 2 토 2 금 2 수 1

종합 운세:
오늘은 ... (Claude AI 해석)
```

✅ **통과 조건:** 모든 항목 정상 표시

---

### 4.2 타로 카드

**접속:**
```
http://localhost:3000/pages/tarot-mock.html
```

**테스트 시나리오:**
1. 카테고리 선택: 종합 운세
2. 카드 3장 선택
3. [해석 보기] 클릭

**확인 사항:**
- [ ] 이용권 확인 모달 표시
- [ ] 이용권 1개 차감
- [ ] 78장 카드 덱 표시
- [ ] 카드 뒤집기 애니메이션
- [ ] 카드 이미지 정상 표시
- [ ] Claude AI 해석 표시
- [ ] PDF 다운로드 버튼 작동

**예상 출력:**
```
선택한 카드:
1. 바보(The Fool) - 정방향
2. 마법사(The Magician) - 역방향
3. 여사제(The High Priestess) - 정방향

해석:
... (Claude AI 해석)
```

✅ **통과 조건:** 카드 이미지 + Claude 해석

---

### 4.3 사주팔자

**접속:**
```
http://localhost:3000/pages/saju-test.html
```

**테스트 시나리오:**
1. 생년월일: 1990-01-01
2. 시간: 12시
3. 성별: 남자
4. 카테고리: 종합
5. [사주 분석] 클릭

**확인 사항:**
- [ ] 이용권 확인 모달
- [ ] 이용권 1개 차감
- [ ] 사주 사신주 표시
- [ ] 십성 분석 표시
- [ ] 대운 표시
- [ ] 신살 표시
- [ ] 용신 표시
- [ ] 강약 분석
- [ ] 종합 해석 (Claude AI)

**예상 출력:**
```
🔮 사주팔자 분석

기본 사신주:
시주: 경오(庚午)
일주: 갑자(甲子)
월주: 무인(戊寅)
년주: 경오(庚午)

십성:
일간: 갑목(甲木)
편인, 정관, 식신, 편인

대운:
1-10세: 기묘(己卯)
11-20세: 경진(庚辰)
...

종합 해석:
... (Claude AI)
```

✅ **통과 조건:** 정확한 사주 + Claude 해석

---

### 4.4 토정비결

**접속:**
```
http://localhost:3000/pages/tojeong-test.html
```

**테스트 시나리오:**
1. 생년월일: 1990-01-01 (양력)
2. [토정비결 보기] 클릭

**확인 사항:**
- [ ] 이용권 확인
- [ ] 음력 변환 정확
- [ ] 144괘 중 해당 괘 선택
- [ ] 괘 이미지 표시
- [ ] 원문 표시
- [ ] Claude AI 해석

**예상 출력:**
```
🎋 토정비결

음력: 1989년 12월 5일
괘: 제37괘 - 풍화가인(風火家人)

원문:
家人, 利女貞。
...

현대 해석:
... (Claude AI)
```

✅ **통과 조건:** 정확한 괘 + Claude 해석

---

### 4.5 꿈 해몽

**접속:**
```
http://localhost:3000/pages/dream.html
```

**테스트 시나리오:**
1. 키워드 입력: "뱀"
2. [꿈 해몽 보기] 클릭

**확인 사항:**
- [ ] 이용권 확인
- [ ] DB 검색 결과 표시
- [ ] 유사도 정렬
- [ ] Top 5 표시
- [ ] Claude AI 추가 해석

**예상 출력:**
```
🌙 꿈 해몽

검색 결과: "뱀"

1. 뱀을 보는 꿈 (유사도: 95%)
   - 전통 해석: 재물운 상승
   - 현대 해석: ... (Claude AI)

2. 뱀에게 물리는 꿈 (유사도: 85%)
   ...
```

✅ **통과 조건:** DB 검색 + Claude 해석

---

### 4.6 별자리 운세

**접속:**
```
http://localhost:3000/pages/horoscope.html
```

**테스트 시나리오:**
1. 생년월일: 1990-01-15
2. [별자리 운세 보기] 클릭

**확인 사항:**
- [ ] 이용권 확인
- [ ] 별자리 자동 계산 (염소자리)
- [ ] 별자리 특성 표시
- [ ] 오늘의 운세 (Claude AI)
- [ ] 이번 주 운세
- [ ] 이번 달 운세

**예상 출력:**
```
♑ 염소자리 운세

특성:
- 책임감 강함
- 목표 지향적
- 현실적

오늘의 운세:
... (Claude AI)
```

✅ **통과 조건:** 정확한 별자리 + Claude 해석

---

### 4.7 로또 번호

**접속:**
```
http://localhost:3000/pages/lotto.html
```

**테스트 시나리오:**
1. [행운의 번호 생성] 클릭
2. 여러 번 클릭

**확인 사항:**
- [ ] 이용권 불필요 (무료)
- [ ] 1~45 범위
- [ ] 6개 숫자
- [ ] 중복 없음
- [ ] 오름차순 정렬
- [ ] 매번 다른 번호

**예상 출력:**
```
🎱 행운의 로또 번호

3  12  23  31  38  42
```

✅ **통과 조건:** 유효한 번호 생성

---

### 4.8 궁합 보기

**접속:**
```
http://localhost:3000/pages/compatibility-test.html
```

**테스트 시나리오:**
1. 나의 정보: 1990-01-01, 남자
2. 상대 정보: 1992-05-15, 여자
3. [궁합 보기] 클릭

**확인 사항:**
- [ ] 이용권 확인
- [ ] 양쪽 사주 계산
- [ ] 오행 궁합 분석
- [ ] 띠 궁합 분석
- [ ] 종합 점수 (%)
- [ ] Claude AI 해석

**예상 출력:**
```
💕 궁합 분석

나: 경오년 무인월 갑자일 (남)
상대: 임신년 을사월 정축일 (여)

오행 궁합: 85점
띠 궁합: 75점
종합 점수: 80점

해석:
... (Claude AI)
```

✅ **통과 조건:** 정확한 계산 + Claude 해석

---

## 5. 이용권 시스템 점검

### 5.1 쿠팡 게이트 페이지

**접속:**
```
http://localhost:3000/pages/coupang-gate.html
```

**확인 사항:**
- [ ] 쿠팡 파트너스 링크 표시
- [ ] 링크 클릭 시 Analytics 기록
- [ ] "이용권 충전하기" 버튼 작동
- [ ] 충전 성공 메시지

---

### 5.2 이용권 UI 테스트

**메인 페이지에서:**
```
http://localhost:3000
```

**확인 사항:**
- [ ] 우측 상단 이용권 개수 표시
- [ ] 충전 버튼 작동
- [ ] 이용권 부족 시 모달 표시
- [ ] 모달에서 [충전하러 가기] 작동

---

### 5.3 사주 정보 저장/불러오기

**시나리오:**
1. 사주팔자 입력 → 분석
2. 새로고침 (F5)
3. 다시 사주팔자 페이지 접속

**확인 사항:**
- [ ] 이전 입력 정보 자동 입력
- [ ] localStorage에 저장됨
- [ ] 다른 기능에서도 사주 정보 공유

---

## 6. 관리자 시스템 점검

### 6.1 관리자 로그인

**접속:**
```
http://localhost:3000/admin/login.html
```

**테스트:**
- ID: cooal
- PW: dkssud11@@

**확인 사항:**
- [ ] 로그인 성공
- [ ] JWT 토큰 발급
- [ ] localStorage 저장
- [ ] 대시보드 자동 이동

---

### 6.2 대시보드 기능

**접속:**
```
http://localhost:3000/admin/dashboard.html
```

**확인 사항:**
- [ ] 실시간 통계 표시
- [ ] 5초 자동 갱신
- [ ] 방문자 추이 차트
- [ ] 시간대별 차트
- [ ] 기능별 사용 통계
- [ ] 쿠팡 링크 수정 기능
- [ ] 로그아웃 기능

---

### 6.3 Analytics 데이터 확인

**MongoDB에서:**
```javascript
use fortune_platform

// 방문자 기록 확인
db.analytics_visitors.find().limit(5)

// 쿠팡 클릭 확인
db.analytics_coupang_clicks.find().limit(5)

// 이용권 사용 확인
db.analytics_ticket_usage.find().limit(5)
```

✅ **통과 조건:** 실제 사용 데이터 쌓임

---

## 7. API 통신 점검

### 7.1 모든 API 엔드포인트 테스트

**테스트 스크립트:**
```javascript
// test-all-apis.js
const endpoints = [
  { method: 'POST', url: '/api/tickets/charge', body: {} },
  { method: 'GET', url: '/api/tickets/check' },
  { method: 'POST', url: '/api/daily-fortune', body: { year: 1990, month: 1, day: 1, hour: 12, gender: '남자' } },
  { method: 'POST', url: '/api/tarot', body: { cards: ['fool', 'magician'], category: 'total' } },
  { method: 'POST', url: '/api/saju', body: { year: 1990, month: 1, day: 1, hour: 12, gender: '남자', category: 'total' } },
  { method: 'POST', url: '/api/tojeong', body: { year: 1990, month: 1, day: 1 } },
  { method: 'POST', url: '/api/dream', body: { keyword: '뱀' } },
  { method: 'POST', url: '/api/horoscope', body: { birthDate: '1990-01-15' } },
  { method: 'POST', url: '/api/compatibility', body: { person1: {}, person2: {} } }
];

async function testAPIs() {
  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint.method} ${endpoint.url}...`);
    try {
      const response = await fetch(`http://localhost:3000${endpoint.url}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
      });
      console.log(response.status === 200 ? '✅ Pass' : '❌ Fail');
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
}

testAPIs();
```

---

### 7.2 에러 핸들링 테스트

**잘못된 요청:**
```javascript
// 필수 필드 누락
fetch('http://localhost:3000/api/saju', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ year: 1990 })  // month, day 누락
});
```

**예상 응답:**
```json
{
  "success": false,
  "error": "필수 입력 정보가 누락되었습니다"
}
```

✅ **통과 조건:** 명확한 에러 메시지

---

### 7.3 CORS 설정 확인

**다른 도메인에서 테스트:**
```javascript
// 브라우저 콘솔에서
fetch('http://localhost:3000/api/tickets/check')
  .then(res => res.json())
  .then(data => console.log(data));
```

✅ **통과 조건:** CORS 에러 없음

---

## 8. 성능 및 부하 테스트

### 8.1 응답 시간 측정

**도구:**
```bash
npm install -g loadtest
```

**테스트:**
```bash
loadtest -n 1000 -c 10 http://localhost:3000/api/tickets/check
```

**예상 결과:**
```
Total time: 5 s
Mean latency: 50 ms
Requests per second: 200
```

✅ **통과 기준:** 평균 응답 시간 < 100ms

---

### 8.2 동시 접속 테스트

**테스트:**
```bash
loadtest -n 1000 -c 100 http://localhost:3000
```

**확인 사항:**
- [ ] 서버 다운 없음
- [ ] 메모리 사용량 정상
- [ ] 에러율 < 1%

---

### 8.3 메모리 누수 확인

**장시간 실행:**
```bash
# 서버 시작
node server.js

# 1시간 후 메모리 확인
```

**PowerShell에서:**
```powershell
Get-Process -Name node | Select-Object WorkingSet
```

✅ **통과 조건:** 메모리 증가 < 100MB/hour

---

## 9. 브라우저 호환성 테스트

### 9.1 테스트 브라우저

- [ ] Chrome 최신 버전
- [ ] Edge 최신 버전
- [ ] Firefox 최신 버전
- [ ] Safari (Mac만 해당)
- [ ] 모바일 Chrome (Android)
- [ ] 모바일 Safari (iOS)

### 9.2 확인 사항

각 브라우저에서:
- [ ] 메인 페이지 정상 표시
- [ ] 8개 기능 모두 작동
- [ ] 이용권 시스템 작동
- [ ] 로컬스토리지 작동
- [ ] CSS 레이아웃 정상
- [ ] JavaScript 에러 없음

---

## 10. 최종 배포 준비

### 10.1 프로덕션 환경 변수 설정

**.env 파일 수정:**
```env
NODE_ENV=production
PORT=80  # 또는 443 (HTTPS)

# 프로덕션 도메인
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 강력한 마스터 코드로 변경 (필수!)
MASTER_CODE=프로덕션용_강력한_랜덤코드_32자이상

# JWT Secret 변경 (필수!)
JWT_SECRET=프로덕션용_JWT_비밀키_64자이상_랜덤문자열

# 프로덕션 MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/fortune_platform

# Claude API 키 (프로덕션 계정)
CLAUDE_API_KEY=sk-ant-api03-프로덕션키

# Analytics (선택)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

### 10.2 보안 체크리스트

- [ ] `.env` 파일 Git 제외 (.gitignore)
- [ ] MASTER_CODE 변경
- [ ] JWT_SECRET 변경
- [ ] MongoDB 보안 설정 (IP 화이트리스트)
- [ ] HTTPS 적용 (Let's Encrypt)
- [ ] 관리자 비밀번호 변경
- [ ] Rate Limiting 활성화
- [ ] CORS 제한 설정

---

### 10.3 백업 설정

**MongoDB 백업:**
```bash
# 백업 스크립트
mongodump --uri="mongodb://localhost:27017/fortune_platform" --out=/backup/$(date +%Y%m%d)

# 크론탭 등록 (Linux/Mac)
crontab -e
0 3 * * * /path/to/backup.sh
```

**파일 백업:**
```bash
# 프로젝트 전체 백업
tar -czf fortune_platform_$(date +%Y%m%d).tar.gz C:\xampp\htdocs\mysite\운세플랫폼
```

---

### 10.4 모니터링 설정

**PM2 설치 및 설정:**
```bash
npm install -g pm2

# 서버 시작
pm2 start server.js --name "fortune-platform"

# 자동 재시작 설정
pm2 startup
pm2 save

# 로그 확인
pm2 logs fortune-platform

# 모니터링
pm2 monit
```

---

### 10.5 DNS 설정

**도메인 연결:**
```
A 레코드:
yourdomain.com → 서버 IP
www.yourdomain.com → 서버 IP
```

---

### 10.6 nginx 설정 (선택)

**설치:**
```bash
sudo apt install nginx  # Ubuntu/Debian
```

**설정 파일:** `/etc/nginx/sites-available/fortune-platform`
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # HTTP → HTTPS 리다이렉트
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL 인증서
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Node.js 프록시
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 정적 파일 캐싱
    location /css {
        alias /path/to/frontend/css;
        expires 30d;
    }
    
    location /images {
        alias /path/to/frontend/images;
        expires 30d;
    }
}
```

**활성화:**
```bash
sudo ln -s /etc/nginx/sites-available/fortune-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### 10.7 HTTPS 인증서 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx

# 인증서 발급
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 자동 갱신 확인
sudo certbot renew --dry-run
```

---

### 10.8 최종 점검 리스트

**서버:**
- [ ] 서버 실행 중 (PM2)
- [ ] 포트 열림 (80, 443)
- [ ] 메모리 사용량 정상
- [ ] CPU 사용량 정상

**도메인:**
- [ ] DNS 연결 확인
- [ ] HTTPS 작동
- [ ] www 리다이렉트 작동

**기능:**
- [ ] 8개 기능 모두 작동
- [ ] 이용권 시스템 작동
- [ ] 관리자 페이지 접속
- [ ] Analytics 데이터 수집

**보안:**
- [ ] 환경 변수 설정
- [ ] 마스터 코드 변경
- [ ] JWT Secret 변경
- [ ] HTTPS 적용
- [ ] Rate Limiting 작동

**백업:**
- [ ] MongoDB 백업 스크립트
- [ ] 파일 백업 스크립트
- [ ] 자동 백업 설정

**모니터링:**
- [ ] PM2 모니터링
- [ ] 로그 확인
- [ ] 에러 알림 설정

---

## 📊 점검 완료 보고서 양식

```
===================================
운세플랫폼 배포 전 점검 보고서
===================================

점검 일시: 2025-01-09 
점검자: 

1. 환경 설정: ✅/❌
   - MongoDB 연결: ✅
   - Claude API: ✅
   - 환경 변수: ✅

2. 보안 시스템: ✅/❌
   - IP 이용권: ✅
   - Rate Limiting: ✅
   - localStorage 방어: ✅

3. 기능 테스트: ✅/❌
   - 오늘의 운세: ✅
   - 타로 카드: ✅
   - 사주팔자: ✅
   - 토정비결: ✅
   - 꿈 해몽: ✅
   - 별자리 운세: ✅
   - 로또 번호: ✅
   - 궁합 보기: ✅

4. 관리자 시스템: ✅/❌
   - 로그인: ✅
   - 대시보드: ✅
   - Analytics: ✅

5. 성능 테스트: ✅/❌
   - 응답 시간: ✅
   - 동시 접속: ✅
   - 메모리: ✅

6. 배포 준비: ✅/❌
   - 환경 변수: ✅
   - 보안 설정: ✅
   - 백업 설정: ✅
   - 모니터링: ✅

총평:
- 배포 가능 여부: ✅ 가능 / ❌ 불가
- 발견된 이슈: 0건
- 조치 필요 사항: 없음

다음 단계:
[ ] 프로덕션 배포
[ ] 실서비스 모니터링
[ ] 사용자 피드백 수집
```

---

## 🚨 긴급 롤백 절차

배포 후 문제 발생 시:

```bash
# 1. 서버 중지
pm2 stop fortune-platform

# 2. 이전 버전으로 복구
cd /backup
tar -xzf fortune_platform_YYYYMMDD.tar.gz

# 3. MongoDB 복구
mongorestore --uri="mongodb://localhost:27017" /backup/YYYYMMDD/fortune_platform

# 4. 서버 재시작
pm2 restart fortune-platform

# 5. 확인
pm2 logs fortune-platform
```

---

## 📞 긴급 연락처

**기술 지원:**
- 서버 관리자: [연락처]
- MongoDB 관리자: [연락처]
- 도메인/DNS: [연락처]

**서비스 상태 페이지:**
- MongoDB Atlas: https://status.mongodb.com
- Anthropic (Claude): https://status.anthropic.com

---

**작성일**: 2025-01-09  
**버전**: 1.0  
**다음 점검 예정**: 배포 후 7일