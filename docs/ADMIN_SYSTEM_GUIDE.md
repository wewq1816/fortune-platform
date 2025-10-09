# 🔐 관리자 시스템 완전 가이드

📅 작성일: 2025-01-07  
🎯 목적: 관리자 페이지 파일 구조 및 기능 명세

---

## 📁 1. 파일 구조

### 1.1. 프론트엔드 파일

```
C:\xampp\htdocs\mysite\운세플랫폼\frontend\admin\
│
├── login.html              ⭐ 관리자 로그인 페이지
├── dashboard.html          ⭐ 관리자 대시보드
│
├── js\
│   └── dashboard.js        ⭐ 대시보드 스크립트
│
└── css\
    (비어있음 - 인라인 스타일 사용)
```

#### 📄 login.html
- **경로**: `frontend/admin/login.html`
- **접속**: `http://localhost:3000/admin/login.html`
- **역할**: 관리자 로그인 페이지
- **기능**:
  - ID/PW 입력 폼
  - JWT 토큰 발급
  - localStorage 저장
  - 대시보드 자동 이동
  - 에러 메시지 표시

**로그인 정보**:
```
ID: cooal
비밀번호: dkssud11@@
```

**API 호출**:
```javascript
POST http://localhost:3000/api/admin/login
Body: { "username": "cooal", "password": "dkssud11@@" }
Response: { "token": "...", "username": "cooal", "expiresIn": "24h" }
```

---

#### 📄 dashboard.html
- **경로**: `frontend/admin/dashboard.html`
- **접속**: `http://localhost:3000/admin/dashboard.html`
- **역할**: 관리자 통계 대시보드
- **인증**: JWT 토큰 필수 (localStorage에서 자동 로드)

**대시보드 구성**:
```
┌─────────────────────────────────────┐
│  🔐 관리자                           │
│  업데이트: 12:34               로그아웃│
├─────────────────────────────────────┤
│  📊 실시간 통계                      │
│  ┌───────┬───────┬───────┬───────┐  │
│  │👥 방문│🔗 클릭│🎫 이용│📈 전환│  │
│  └───────┴───────┴───────┴───────┘  │
├─────────────────────────────────────┤
│  🔗 쿠팡 링크 관리                   │
│  [입력 필드]                         │
│  [💾 링크 저장]                      │
├─────────────────────────────────────┤
│  📊 누적 통계                        │
│  ┌───────┬───────┐                  │
│  │👥 총방│🔗 총클│                  │
│  └───────┴───────┘                  │
├─────────────────────────────────────┤
│  📈 방문자 추이 (최근 7일)           │
│  [라인 차트]                         │
├─────────────────────────────────────┤
│  ⏰ 시간대별 방문                    │
│  [바 차트]                           │
├─────────────────────────────────────┤
│  🎯 기능별 이용권 사용               │
│  • 오늘의 운세     123회             │
│  • 타로 카드       89회              │
│  • 사주팔자        234회             │
│  ...                                │
└─────────────────────────────────────┘
```

---

#### 📄 dashboard.js
- **경로**: `frontend/admin/js/dashboard.js`
- **역할**: 대시보드 로직 및 API 호출

**주요 함수**:
```javascript
// 인증 확인
checkAuth() → localStorage에서 토큰 확인

// 로그아웃
logout() → 토큰 삭제 + 로그인 페이지 이동

// 실시간 통계 (5초 자동 갱신)
updateRealtimeStats() → GET /api/admin/stats/today

// 누적 통계
loadTotalStats() → GET /api/admin/stats/visitors
                 → GET /api/admin/stats/coupang

// 기능별 통계
loadFeatureStats() → GET /api/admin/stats/features

// 쿠팡 링크
loadCoupangLink() → GET /api/admin/settings/coupang-link
saveCoupangLink() → PUT /api/admin/settings/coupang-link

// 차트 생성
createVisitorsChart(data) → Chart.js 라인 차트
createHourlyChart(data) → Chart.js 바 차트
```

---

### 1.2. 백엔드 파일

```
C:\xampp\htdocs\mysite\운세플랫폼\backend\
│
├── routes\
│   └── admin.js            ⭐ 관리자 API 라우터
│
├── middleware\
│   └── auth.js             (인증 미들웨어)
│
└── scripts\
    └── init-admin.js       ⭐ 관리자 초기화 스크립트
```

---

#### 📄 admin.js (API 라우터)
- **경로**: `backend/routes/admin.js`
- **역할**: 관리자 전용 API 엔드포인트

**API 목록**:

| 메서드 | 엔드포인트 | 인증 | 기능 |
|--------|-----------|------|------|
| POST | `/api/admin/login` | ❌ | 로그인 |
| GET | `/api/admin/stats/today` | ✅ | 오늘 통계 |
| GET | `/api/admin/stats/visitors` | ✅ | 방문자 통계 |
| GET | `/api/admin/stats/coupang` | ✅ | 쿠팡 클릭 통계 |
| GET | `/api/admin/stats/features` | ✅ | 기능별 통계 |
| GET | `/api/admin/settings/coupang-link` | ✅ | 쿠팡 링크 조회 |
| PUT | `/api/admin/settings/coupang-link` | ✅ | 쿠팡 링크 수정 |
| GET | `/api/admin/export` | ✅ | 데이터 내보내기 (CSV) |
| GET | `/api/admin/profile` | ✅ | 관리자 프로필 |

---

#### 1️⃣ POST /api/admin/login
**로그인 API**

**요청**:
```json
{
  "username": "cooal",
  "password": "dkssud11@@"
}
```

**응답 (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "cooal",
  "expiresIn": "24h"
}
```

**로직**:
1. 아이디/비밀번호 검증
2. MongoDB `admin_users` 컬렉션 조회
3. bcrypt 비밀번호 비교
4. JWT 토큰 생성 (24시간 유효)
5. 마지막 로그인 시간 업데이트

---

#### 2️⃣ GET /api/admin/stats/today
**실시간 대시보드 통계**

**인증**: Bearer Token 필수

**응답**:
```json
{
  "visitorsToday": 123,
  "clicksToday": 45,
  "usageToday": 89,
  "visitorsChange": 12.5,    // 전일 대비 증감률 (%)
  "clicksChange": -5.2,       // 전일 대비 증감률 (%)
  "conversionRate": 36.6      // 방문자 대비 클릭률 (%)
}
```

**로직**:
- 오늘 날짜 기준으로 통계 조회
- 전일 데이터와 비교하여 증감률 계산
- 5초마다 자동 갱신 (프론트엔드에서)

---

#### 3️⃣ GET /api/admin/stats/visitors
**방문자 통계**

**쿼리 파라미터**:
```
?days=7   (기본값: 7일)
```

**응답**:
```json
{
  "totalVisitors": 1234,
  "returningVisitors": 567,
  "dailyVisitors": [
    { "_id": "2025-01-01", "count": 45 },
    { "_id": "2025-01-02", "count": 67 }
  ],
  "hourlyDistribution": [
    { "_id": 0, "count": 12 },
    { "_id": 1, "count": 5 }
  ],
  "weeklyPattern": [
    { "_id": "월요일", "count": 234 },
    { "_id": "화요일", "count": 189 }
  ]
}
```

---

#### 4️⃣ GET /api/admin/stats/coupang
**쿠팡 클릭 통계**

**응답**:
```json
{
  "totalClicks": 456,
  "dailyClicks": [
    { "_id": "2025-01-01", "count": 12 }
  ],
  "hourlyClicks": [
    { "_id": 14, "count": 8 }
  ]
}
```

---

#### 5️⃣ GET /api/admin/stats/features
**기능별 이용권 사용 통계**

**응답**:
```json
{
  "featureUsage": [
    { "_id": "사주팔자", "count": 234 },
    { "_id": "오늘의 운세", "count": 189 }
  ],
  "featureDaily": [
    {
      "_id": { "feature": "사주팔자", "date": "2025-01-01" },
      "count": 23
    }
  ],
  "hourlyUsage": [
    { "_id": 14, "count": 45 }
  ]
}
```

---

#### 6️⃣ GET /api/admin/settings/coupang-link
**쿠팡 링크 조회**

**응답**:
```json
{
  "coupangLink": "https://link.coupang.com/a/...",
  "updatedAt": "2025-01-07T10:30:00.000Z",
  "updatedBy": "cooal"
}
```

---

#### 7️⃣ PUT /api/admin/settings/coupang-link
**쿠팡 링크 수정**

**요청**:
```json
{
  "coupangLink": "https://link.coupang.com/a/NEW_LINK"
}
```

**응답 (200 OK)**:
```json
{
  "success": true,
  "coupangLink": "https://link.coupang.com/a/NEW_LINK",
  "message": "쿠팡 링크가 성공적으로 업데이트되었습니다"
}
```

**검증**:
- 링크 입력 확인
- URL 형식 검증 (http:// 또는 https://)

---

#### 8️⃣ GET /api/admin/export
**데이터 내보내기 (CSV)**

**쿼리 파라미터**:
```
?startDate=2025-01-01&endDate=2025-01-07&type=visitors
```

**타입**:
- `visitors`: 방문자 데이터
- `clicks`: 쿠팡 클릭 데이터
- `usage`: 이용권 사용 데이터

**응답**: CSV 파일 다운로드
```csv
날짜,시간,방문자ID,시간대,요일,재방문
2025-01-01,10:30:00,test123,10,월요일,false
```

**CSV 헤더**:
```
- visitors: 날짜,시간,방문자ID,시간대,요일,재방문
- clicks: 날짜,시간,방문자ID,시간대
- usage: 날짜,시간,방문자ID,기능,시간대
```

---

#### 📄 init-admin.js (초기화 스크립트)
- **경로**: `backend/scripts/init-admin.js`
- **역할**: 관리자 시스템 초기 설정

**실행 방법**:
```bash
cd backend
node scripts/init-admin.js
```

**수행 작업**:
1. MongoDB 연결
2. 관리자 계정 생성 (cooal / dkssud11@@)
3. 비밀번호 해싱 (bcrypt)
4. 초기 설정 저장
5. 컬렉션 인덱스 생성
6. 테스트 데이터 생성 (선택)

**생성 컬렉션**:
- `admin_users`: 관리자 계정
- `admin_settings`: 시스템 설정
- `analytics_visitors`: 방문자 기록
- `analytics_coupang_clicks`: 쿠팡 클릭 기록
- `analytics_ticket_usage`: 이용권 사용 기록

**테스트 데이터**:
- 방문자 3명
- 쿠팡 클릭 1건
- 이용권 사용 5건 (8개 기능)

---

## 📊 2. MongoDB 컬렉션 구조

### 2.1. admin_users (관리자 계정)
```json
{
  "username": "cooal",
  "password": "$2a$10$...",   // bcrypt 해시
  "createdAt": "2025-01-07T...",
  "lastLogin": "2025-01-07T..."
}
```

### 2.2. admin_settings (시스템 설정)
```json
{
  "coupangLink": "https://link.coupang.com/a/...",
  "updatedAt": "2025-01-07T...",
  "updatedBy": "cooal"
}
```

### 2.3. analytics_visitors (방문자 기록)
```json
{
  "visitorId": "test123",
  "visitDate": "2025-01-07",
  "visitTime": "2025-01-07T10:30:00.000Z",
  "visitHour": 10,
  "visitDay": "화요일",
  "userAgent": "Mozilla/5.0...",
  "isReturning": false
}
```

**인덱스**:
- `visitDate`
- `visitorId`

### 2.4. analytics_coupang_clicks (쿠팡 클릭)
```json
{
  "visitorId": "test123",
  "clickDate": "2025-01-07",
  "clickTime": "2025-01-07T10:30:00.000Z",
  "clickHour": 10
}
```

**인덱스**:
- `clickDate`
- `visitorId`

### 2.5. analytics_ticket_usage (이용권 사용)
```json
{
  "visitorId": "test123",
  "feature": "사주팔자",
  "usageDate": "2025-01-07",
  "usageTime": "2025-01-07T10:30:00.000Z",
  "usageHour": 10
}
```

**인덱스**:
- `usageDate`
- `feature`

---

## 🔐 3. 인증 시스템

### 3.1. JWT 토큰
- **알고리즘**: HS256
- **유효 기간**: 24시간
- **저장 위치**: localStorage (`adminToken`)

**토큰 구조**:
```json
{
  "username": "cooal",
  "iat": 1704614400,
  "exp": 1704700800
}
```

### 3.2. 인증 미들웨어
- **파일**: `backend/middleware/auth.js`
- **역할**: JWT 토큰 검증

**동작**:
```javascript
1. Authorization 헤더 확인
2. Bearer 토큰 추출
3. jwt.verify(token, SECRET_KEY)
4. req.admin = { username } 저장
5. next() 또는 401 Unauthorized
```

---

## 🚀 4. 사용 가이드

### 4.1. 초기 설정

**1단계: MongoDB 시작**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo service mongod start
```

**2단계: 관리자 계정 생성**
```bash
cd backend
node scripts/init-admin.js
```

출력:
```
✅ MongoDB 연결 성공
✅ 관리자 계정 생성 완료
   ID: cooal
   비밀번호: dkssud11@@
✅ 초기 설정 저장 완료
✅ 인덱스 생성 완료
✅ 테스트 데이터 생성 완료
🎉 관리자 시스템 초기화 완료!
```

**3단계: 서버 실행**
```bash
cd backend
npm start
```

**4단계: 접속**
```
http://localhost:3000/admin/login.html
```

---

### 4.2. 로그인

1. 브라우저에서 접속
2. ID: `cooal` (고정)
3. 비밀번호: `dkssud11@@` 입력
4. [로그인] 클릭
5. 자동으로 대시보드 이동

---

### 4.3. 대시보드 사용

**실시간 통계 (자동 갱신)**
- 5초마다 자동 업데이트
- 오늘 방문자, 클릭, 이용권 사용
- 전일 대비 증감률 표시

**쿠팡 링크 관리**
- 입력 필드에 새 링크 입력
- [💾 링크 저장] 클릭
- 성공 알림 표시

**데이터 분석**
- 방문자 추이 차트
- 시간대별 방문 차트
- 기능별 이용권 사용 순위

---

### 4.4. 데이터 내보내기

**API 직접 호출**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/admin/export?startDate=2025-01-01&endDate=2025-01-07&type=visitors" \
  -o analytics.csv
```

**브라우저에서**:
```
http://localhost:3000/api/admin/export?startDate=2025-01-01&endDate=2025-01-07&type=visitors
```

---

## 🔧 5. 트러블슈팅

### 5.1. MongoDB 연결 실패
**증상**: `ECONNREFUSED`

**해결**:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo service mongod start

# 상태 확인
mongosh
```

---

### 5.2. 로그인 실패
**증상**: "잘못된 인증 정보"

**해결**:
1. 관리자 계정 재생성:
```bash
node scripts/init-admin.js
```

2. MongoDB 데이터 확인:
```bash
mongosh
use fortune_platform
db.admin_users.find()
```

---

### 5.3. 통계가 0으로 표시
**증상**: 모든 통계가 0

**원인**: 실제 데이터 없음

**해결**:
- 메인 페이지 방문 → 방문자 데이터 생성
- 쿠팡 게이트 클릭 → 클릭 데이터 생성
- 기능 사용 → 이용권 사용 데이터 생성

---

### 5.4. 차트가 표시되지 않음
**증상**: 차트 영역 빈칸

**원인**: Chart.js 로딩 실패

**해결**:
- 인터넷 연결 확인 (CDN 사용)
- 브라우저 콘솔 확인

---

## 📝 6. 추가 기능 개발 가이드

### 6.1. 새 통계 추가

**1. MongoDB 컬렉션 생성**
```javascript
db.analytics_new_stat.insertOne({
  userId: "test",
  statDate: "2025-01-07",
  value: 123
});
```

**2. API 추가 (admin.js)**
```javascript
router.get('/stats/new', authMiddleware, async (req, res) => {
  const data = await db.collection('analytics_new_stat')
    .find().toArray();
  res.json({ data });
});
```

**3. 프론트엔드 호출 (dashboard.js)**
```javascript
async function loadNewStats() {
  const response = await fetch(
    'http://localhost:3000/api/admin/stats/new', 
    { headers }
  );
  const data = await response.json();
  // 표시 로직
}
```

---

### 6.2. 새 설정 항목 추가

**1. admin_settings 업데이트**
```javascript
await db.collection('admin_settings').updateOne(
  {},
  { $set: { newSetting: 'value' } },
  { upsert: true }
);
```

**2. API 추가**
```javascript
router.get('/settings/new', authMiddleware, async (req, res) => {
  const settings = await db.collection('admin_settings').findOne();
  res.json({ newSetting: settings?.newSetting });
});

router.put('/settings/new', authMiddleware, async (req, res) => {
  const { newSetting } = req.body;
  await db.collection('admin_settings').updateOne(
    {},
    { $set: { newSetting } },
    { upsert: true }
  );
  res.json({ success: true });
});
```

---

## 🎯 7. 보안 주의사항

### 7.1. 비밀번호 관리
- ❌ 평문 저장 금지
- ✅ bcrypt 해싱 (saltRounds=10)
- ✅ 정기적인 비밀번호 변경 권장

### 7.2. JWT 토큰
- ✅ SECRET_KEY 환경 변수로 관리
- ✅ 24시간 유효 기간
- ✅ HTTPS 사용 권장

### 7.3. API 보안
- ✅ 모든 관리자 API에 authMiddleware 적용
- ✅ CORS 설정
- ✅ Rate Limiting 권장

---

## 📌 8. 체크리스트

### 초기 설정
- [ ] MongoDB 설치 및 실행
- [ ] `node scripts/init-admin.js` 실행
- [ ] 로그인 성공 확인
- [ ] 대시보드 접속 확인

### 기능 테스트
- [ ] 실시간 통계 표시
- [ ] 방문자 추이 차트
- [ ] 시간대별 차트
- [ ] 기능별 사용 통계
- [ ] 쿠팡 링크 저장
- [ ] 데이터 내보내기

### 배포 전
- [ ] SECRET_KEY 환경 변수 설정
- [ ] HTTPS 적용
- [ ] MongoDB 백업 설정
- [ ] 로그 모니터링 설정

---

**작성일**: 2025-01-07  
**버전**: 1.0  
**관리자**: cooal
