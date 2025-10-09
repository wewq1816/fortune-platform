# 🔐 관리자 페이지 개발 가이드

📅 작성일: 2025-01-07  
🎯 목적: 운세플랫폼 관리자 대시보드 개발  
🔑 관리자 비밀번호: `dkssud11@@`

---

## 📌 프로젝트 개요

### 현재 상황
- **프로젝트명**: 운세플랫폼 (Fortune Platform)
- **경로**: `C:\xampp\htdocs\mysite\운세플랫폼\`
- **기술 스택**: 
  - 백엔드: Node.js + Express + MongoDB
  - 프론트엔드: HTML/CSS/JavaScript
  - AI: Claude API
- **포트**: 3000 (백엔드 서버)
- **GitHub**: https://github.com/wewq1816/fortune-platform.git

### 현재 기능 (8개)
1. 오늘의 운세
2. 타로 카드
3. 사주팔자
4. 토정비결
5. 꿈 해몽
6. 별자리 운세
7. 로또 번호
8. 궁합 보기

### 이용권 시스템
- 사용자는 **하루 2번** 무료로 기능 사용 가능
- 쿠팡 광고를 보면 이용권 2회 충전
- 현재 쿠팡 링크는 하드코딩되어 있음 → **관리자 페이지에서 변경 가능하게 만들어야 함**

---

## 🎯 관리자 페이지 요구사항

### ✅ 필수 기능

#### 1. 관리자 인증
- 로그인 페이지 필요
- ID: `admin`
- 비밀번호: `dkssud11@@` (해시 암호화 필수)
- 세션 유지 (JWT 또는 Session)
- 로그아웃 기능

#### 2. 쿠팡 링크 관리
- 현재 쿠팡 링크 표시
- 링크 수정 기능
- 저장 버튼 → 즉시 적용
- 링크 유효성 검증 (URL 형식)

#### 3. 실시간 대시보드 (5초마다 자동 갱신)
- **오늘 방문자 수** (실시간 카운트)
- **오늘 쿠팡 클릭 수** (실시간 카운트)
- **오늘 이용권 사용 횟수** (실시간 카운트)
- 전일 대비 증감률 표시

#### 4. 방문자 통계
- **총 방문자 수** (누적)
- **일별 방문자 수** (그래프: 최근 7일/30일)
- **시간대별 방문 분포** (0~23시 막대 그래프)
- **요일별 패턴** (월~일)

#### 5. 쿠팡 클릭 통계
- **총 클릭 수** (누적)
- **일별 클릭 수** (그래프: 최근 7일/30일)
- **전환율** (방문자 대비 클릭률 %)

#### 6. 기능별 이용권 사용 통계
- **8개 기능별 총 사용량**
  - 오늘의 운세
  - 타로 카드
  - 사주팔자
  - 토정비결
  - 꿈 해몽
  - 별자리 운세
  - 로또 번호
  - 궁합 보기
- **8개 기능별 일별 사용량** (그래프)
- **인기 기능 순위** (막대 그래프)
- **파이 차트** (비율)

#### 7. 사용자 행동 분석
- **이용권 충전률**: 방문자 중 쿠팡 클릭한 비율
- **2회 사용 완료율**: 2회 중 평균 몇 번 사용했는지
- **재방문율**: 다시 찾아온 사용자 비율

#### 8. 시스템 상태
- 서버 상태 (실행 중/중지)
- 데이터베이스 용량
- 최근 에러 로그 (최근 10개)
- API 응답 속도

#### 9. 데이터 내보내기
- 기간별 통계 Excel/CSV 다운로드
- 날짜 범위 선택

#### 10. 실시간 알림 시스템
- **브라우저 알림**:
  - "오늘 방문자 100명 달성!"
  - "쿠팡 클릭 50회 돌파!"
- **시스템 알림**:
  - "서버 응답 속도 느림"
  - "데이터베이스 연결 끊김"
- **일간 리포트**:
  - 매일 자정 오늘 통계 요약

### ❌ 제외 기능
- 수익 분석 (쿠팡 파트너스)

---

## 🗄️ 데이터베이스 설계

### 1. `admin_users` 컬렉션 (관리자 계정)
```json
{
  "_id": ObjectId,
  "username": "admin",
  "password": "$2b$10$...", // bcrypt 해시
  "createdAt": ISODate,
  "lastLogin": ISODate
}
```

### 2. `admin_settings` 컬렉션 (관리자 설정)
```json
{
  "_id": ObjectId,
  "coupangLink": "https://link.coupang.com/a/...",
  "updatedAt": ISODate,
  "updatedBy": "admin"
}
```

### 3. `analytics_visitors` 컬렉션 (방문자 추적)
```json
{
  "_id": ObjectId,
  "visitorId": "uuid-xxx", // 브라우저 고유 ID
  "visitDate": "2025-01-07",
  "visitTime": ISODate,
  "visitHour": 14, // 시간대 (0~23)
  "visitDay": "화요일",
  "userAgent": "...",
  "isReturning": false // 재방문 여부
}
```

### 4. `analytics_coupang_clicks` 컬렉션 (쿠팡 클릭 추적)
```json
{
  "_id": ObjectId,
  "visitorId": "uuid-xxx",
  "clickDate": "2025-01-07",
  "clickTime": ISODate,
  "clickHour": 14,
  "referrer": "..."
}
```

### 5. `analytics_ticket_usage` 컬렉션 (이용권 사용 추적)
```json
{
  "_id": ObjectId,
  "visitorId": "uuid-xxx",
  "feature": "사주팔자", // 기능명
  "usageDate": "2025-01-07",
  "usageTime": ISODate,
  "usageHour": 14
}
```

### 6. `system_logs` 컬렉션 (시스템 로그)
```json
{
  "_id": ObjectId,
  "level": "error", // info, warning, error
  "message": "...",
  "timestamp": ISODate,
  "source": "server"
}
```

---

## 📁 파일 구조

```
운세플랫폼/
├── backend/
│   ├── routes/
│   │   └── admin.js           ← 새로 생성 (관리자 API)
│   ├── middleware/
│   │   └── auth.js             ← 새로 생성 (인증 미들웨어)
│   ├── models/
│   │   ├── AdminUser.js        ← 새로 생성
│   │   ├── AdminSettings.js    ← 새로 생성
│   │   └── Analytics.js        ← 새로 생성
│   └── utils/
│       └── analytics.js        ← 새로 생성 (통계 수집 유틸)
│
├── frontend/
│   ├── admin/
│   │   ├── login.html          ← 새로 생성 (관리자 로그인)
│   │   ├── dashboard.html      ← 새로 생성 (대시보드)
│   │   ├── css/
│   │   │   └── admin.css       ← 새로 생성
│   │   └── js/
│   │       ├── admin-auth.js   ← 새로 생성
│   │       ├── dashboard.js    ← 새로 생성
│   │       └── notifications.js ← 새로 생성 (알림)
│   │
│   ├── utils/
│   │   └── analytics-tracker.js ← 새로 생성 (방문자 추적)
│   │
│   └── index.html               ← 수정 필요 (추적 코드 추가)
│
└── server.js                    ← 수정 필요 (라우터 추가)
```

---

## 🛠️ 단계별 작업 가이드

### Phase 1: 데이터베이스 초기화 (10분)

#### 작업 내용:
1. MongoDB에 컬렉션 생성
2. 관리자 계정 생성 (비밀번호 해시)
3. 초기 설정 저장

#### 파일: `backend/scripts/init-admin.js`
```javascript
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

async function initAdmin() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('fortune_platform');
  
  // 1. 관리자 계정 생성
  const hashedPassword = await bcrypt.hash('dkssud11@@', 10);
  await db.collection('admin_users').insertOne({
    username: 'admin',
    password: hashedPassword,
    createdAt: new Date()
  });
  
  // 2. 초기 설정
  await db.collection('admin_settings').insertOne({
    coupangLink: 'https://link.coupang.com/기존링크',
    updatedAt: new Date()
  });
  
  console.log('✅ 관리자 초기화 완료');
  client.close();
}

initAdmin();
```

**실행:**
```bash
cd C:\xampp\htdocs\mysite\운세플랫폼\backend
node scripts/init-admin.js
```

---

### Phase 2: 통계 수집 시스템 (30분)

#### 2.1. 방문자 추적 (프론트엔드)

**파일: `frontend/utils/analytics-tracker.js`**
```javascript
// 방문자 고유 ID 생성/가져오기
function getVisitorId() {
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36);
    localStorage.setItem('visitorId', visitorId);
  }
  return visitorId;
}

// 방문 기록
async function trackVisit() {
  const visitorId = getVisitorId();
  
  await fetch('http://localhost:3000/api/analytics/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      userAgent: navigator.userAgent
    })
  });
}

// 쿠팡 클릭 추적
async function trackCoupangClick() {
  const visitorId = getVisitorId();
  
  await fetch('http://localhost:3000/api/analytics/coupang-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId })
  });
}

// 이용권 사용 추적
async function trackTicketUsage(feature) {
  const visitorId = getVisitorId();
  
  await fetch('http://localhost:3000/api/analytics/ticket-usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId, feature })
  });
}

// 페이지 로드 시 자동 실행
document.addEventListener('DOMContentLoaded', trackVisit);
```

#### 2.2. 추적 코드 통합

**수정 파일: `frontend/index.html`**
```html
<!-- <head> 안에 추가 -->
<script src="utils/analytics-tracker.js"></script>
```

**수정 파일: `frontend/utils/ticket-system.js`**
```javascript
// 기존 쿠팡 게이트 이동 함수 수정
function goToCoupangGate() {
  trackCoupangClick(); // 추가
  window.location.href = 'pages/coupang-gate.html';
}

// 기존 이용권 사용 함수 수정
function useTicket(featureName) {
  if (canUseTicket()) {
    trackTicketUsage(featureName); // 추가
    decrementTicket();
    return true;
  }
  return false;
}
```

---

### Phase 3: 백엔드 API 개발 (40분)

#### 3.1. 인증 미들웨어

**파일: `backend/middleware/auth.js`**
```javascript
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key-change-this'; // 변경 필요!

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '인증 필요' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: '유효하지 않은 토큰' });
  }
}

module.exports = { authMiddleware, SECRET_KEY };
```

#### 3.2. 관리자 API 라우터

**파일: `backend/routes/admin.js`**
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMiddleware, SECRET_KEY } = require('../middleware/auth');
const router = express.Router();

// MongoDB 연결 (기존 연결 사용)
const { db } = require('../db'); // 기존 DB 연결

// 1. 로그인 API
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await db.collection('admin_users').findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: '잘못된 인증 정보' });
    }
    
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: '잘못된 인증 정보' });
    }
    
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
    
    // 마지막 로그인 시간 업데이트
    await db.collection('admin_users').updateOne(
      { username },
      { $set: { lastLogin: new Date() } }
    );
    
    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. 실시간 대시보드 통계
router.get('/stats/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 오늘 방문자 수
    const visitorsToday = await db.collection('analytics_visitors')
      .countDocuments({ visitDate: today });
    
    // 오늘 쿠팡 클릭 수
    const clicksToday = await db.collection('analytics_coupang_clicks')
      .countDocuments({ clickDate: today });
    
    // 오늘 이용권 사용 횟수
    const usageToday = await db.collection('analytics_ticket_usage')
      .countDocuments({ usageDate: today });
    
    // 전일 데이터 (증감률 계산)
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const visitorsYesterday = await db.collection('analytics_visitors')
      .countDocuments({ visitDate: yesterday });
    const clicksYesterday = await db.collection('analytics_coupang_clicks')
      .countDocuments({ clickDate: yesterday });
    
    res.json({
      visitorsToday,
      clicksToday,
      usageToday,
      visitorsChange: ((visitorsToday - visitorsYesterday) / visitorsYesterday * 100).toFixed(1),
      clicksChange: ((clicksToday - clicksYesterday) / clicksYesterday * 100).toFixed(1),
      conversionRate: (clicksToday / visitorsToday * 100).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. 방문자 통계
router.get('/stats/visitors', authMiddleware, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    // 일별 방문자 (최근 N일)
    const dailyVisitors = await db.collection('analytics_visitors').aggregate([
      {
        $match: {
          visitDate: {
            $gte: new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: '$visitDate',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    // 시간대별 방문 분포
    const hourlyDistribution = await db.collection('analytics_visitors').aggregate([
      {
        $group: {
          _id: '$visitHour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    // 요일별 패턴
    const weeklyPattern = await db.collection('analytics_visitors').aggregate([
      {
        $group: {
          _id: '$visitDay',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    // 총 방문자
    const totalVisitors = await db.collection('analytics_visitors').countDocuments();
    
    res.json({
      totalVisitors,
      dailyVisitors,
      hourlyDistribution,
      weeklyPattern
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. 쿠팡 클릭 통계
router.get('/stats/coupang', authMiddleware, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    // 일별 클릭 수
    const dailyClicks = await db.collection('analytics_coupang_clicks').aggregate([
      {
        $match: {
          clickDate: {
            $gte: new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: '$clickDate',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    // 총 클릭 수
    const totalClicks = await db.collection('analytics_coupang_clicks').countDocuments();
    
    res.json({ totalClicks, dailyClicks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. 기능별 이용권 사용 통계
router.get('/stats/features', authMiddleware, async (req, res) => {
  try {
    // 기능별 총 사용량
    const featureUsage = await db.collection('analytics_ticket_usage').aggregate([
      {
        $group: {
          _id: '$feature',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    // 기능별 일별 사용량 (최근 7일)
    const featureDaily = await db.collection('analytics_ticket_usage').aggregate([
      {
        $match: {
          usageDate: {
            $gte: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: { feature: '$feature', date: '$usageDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]).toArray();
    
    res.json({ featureUsage, featureDaily });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. 쿠팡 링크 조회
router.get('/settings/coupang-link', authMiddleware, async (req, res) => {
  try {
    const settings = await db.collection('admin_settings').findOne();
    res.json({ coupangLink: settings?.coupangLink || '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. 쿠팡 링크 수정
router.put('/settings/coupang-link', authMiddleware, async (req, res) => {
  try {
    const { coupangLink } = req.body;
    
    // URL 유효성 검증
    if (!coupangLink.startsWith('http')) {
      return res.status(400).json({ error: '유효하지 않은 URL' });
    }
    
    await db.collection('admin_settings').updateOne(
      {},
      {
        $set: {
          coupangLink,
          updatedAt: new Date(),
          updatedBy: req.admin.username
        }
      },
      { upsert: true }
    );
    
    res.json({ success: true, coupangLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. 데이터 내보내기 (CSV)
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // 방문자 데이터
    const visitors = await db.collection('analytics_visitors')
      .find({
        visitDate: { $gte: startDate, $lte: endDate }
      })
      .toArray();
    
    // CSV 생성
    const csv = visitors.map(v => 
      `${v.visitDate},${v.visitTime},${v.visitorId}`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
    res.send('날짜,시간,방문자ID\n' + csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### 3.3. 분석 API (추적용)

**파일: `backend/routes/analytics.js`**
```javascript
const express = require('express');
const router = express.Router();
const { db } = require('../db');

// 방문 기록
router.post('/visit', async (req, res) => {
  try {
    const { visitorId, userAgent } = req.body;
    const now = new Date();
    
    await db.collection('analytics_visitors').insertOne({
      visitorId,
      visitDate: now.toISOString().split('T')[0],
      visitTime: now,
      visitHour: now.getHours(),
      visitDay: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][now.getDay()],
      userAgent,
      isReturning: false // TODO: 재방문 로직
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 쿠팡 클릭 기록
router.post('/coupang-click', async (req, res) => {
  try {
    const { visitorId } = req.body;
    const now = new Date();
    
    await db.collection('analytics_coupang_clicks').insertOne({
      visitorId,
      clickDate: now.toISOString().split('T')[0],
      clickTime: now,
      clickHour: now.getHours()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 이용권 사용 기록
router.post('/ticket-usage', async (req, res) => {
  try {
    const { visitorId, feature } = req.body;
    const now = new Date();
    
    await db.collection('analytics_ticket_usage').insertOne({
      visitorId,
      feature,
      usageDate: now.toISOString().split('T')[0],
      usageTime: now,
      usageHour: now.getHours()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### 3.4. server.js 수정

**수정 파일: `backend/server.js`**
```javascript
// 기존 코드에 추가

const adminRouter = require('./routes/admin');
const analyticsRouter = require('./routes/analytics');

// 라우터 등록
app.use('/api/admin', adminRouter);
app.use('/api/analytics', analyticsRouter);
```

---

### Phase 4: 관리자 페이지 UI (50분)

#### 4.1. 로그인 페이지

**파일: `frontend/admin/login.html`**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>관리자 로그인</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Malgun Gothic', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .login-container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    
    .login-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
      text-align: center;
    }
    
    .login-subtitle {
      font-size: 14px;
      color: #999;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-label {
      display: block;
      margin-bottom: 8px;
      color: #666;
      font-size: 14px;
      font-weight: bold;
    }
    
    .form-input {
      width: 100%;
      padding: 15px;
      border: 2px solid #f0f0f0;
      border-radius: 10px;
      font-size: 16px;
      transition: border-color 0.3s;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .login-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .login-btn:hover {
      transform: translateY(-2px);
    }
    
    .login-btn:active {
      transform: translateY(0);
    }
    
    .error-message {
      color: #ff6b6b;
      font-size: 14px;
      margin-top: 10px;
      text-align: center;
      display: none;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-title">🔐 관리자 로그인</div>
    <div class="login-subtitle">운세플랫폼 관리자 대시보드</div>
    
    <form id="loginForm">
      <div class="form-group">
        <label class="form-label">아이디</label>
        <input type="text" class="form-input" id="username" value="admin" readonly>
      </div>
      
      <div class="form-group">
        <label class="form-label">비밀번호</label>
        <input type="password" class="form-input" id="password" placeholder="비밀번호를 입력하세요">
      </div>
      
      <button type="submit" class="login-btn">로그인</button>
      
      <div class="error-message" id="errorMessage"></div>
    </form>
  </div>
  
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorMessage = document.getElementById('errorMessage');
      
      try {
        const response = await fetch('http://localhost:3000/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // 토큰 저장
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminUsername', data.username);
          
          // 대시보드로 이동
          window.location.href = 'dashboard.html';
        } else {
          errorMessage.textContent = data.error;
          errorMessage.style.display = 'block';
        }
      } catch (error) {
        errorMessage.textContent = '서버 연결 실패';
        errorMessage.style.display = 'block';
      }
    });
  </script>
</body>
</html>
```

#### 4.2. 대시보드 페이지

**파일: `frontend/admin/dashboard.html`** (1/3)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>관리자 대시보드</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Malgun Gothic', sans-serif;
      background: #f5f7fa;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header-title {
      font-size: 24px;
      font-weight: bold;
    }
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
    
    .logout-btn {
      padding: 10px 20px;
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      font-weight: bold;
    }
    
    .logout-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .stat-label {
      font-size: 14px;
      color: #999;
      margin-bottom: 10px;
    }
    
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      color: #333;
    }
    
    .stat-change {
      font-size: 12px;
      margin-top: 5px;
    }
    
    .stat-change.positive {
      color: #4caf50;
    }
    
    .stat-change.negative {
      color: #f44336;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #333;
    }
    
    .chart-container {
      background: white;
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .settings-panel {
      background: white;
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .input-group {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    .input-field {
      flex: 1;
      padding: 12px;
      border: 2px solid #f0f0f0;
      border-radius: 8px;
      font-size: 14px;
    }
    
    .save-btn {
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .save-btn:hover {
      opacity: 0.9;
    }
    
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      display: none;
      z-index: 1000;
    }
    
    .notification.show {
      display: block;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-title">📊 관리자 대시보드</div>
    <div class="header-actions">
      <span id="lastUpdate">마지막 업데이트: 로딩 중...</span>
      <button class="logout-btn" onclick="logout()">로그아웃</button>
    </div>
  </div>
  
  <div class="container">
    <!-- 실시간 통계 -->
    <div class="section-title">🔴 실시간 통계 (자동 갱신)</div>
    <div class="dashboard-grid">
      <div class="stat-card">
        <div class="stat-label">오늘 방문자</div>
        <div class="stat-value" id="visitorsToday">-</div>
        <div class="stat-change" id="visitorsChange"></div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">오늘 쿠팡 클릭</div>
        <div class="stat-value" id="clicksToday">-</div>
        <div class="stat-change" id="clicksChange"></div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">전환율</div>
        <div class="stat-value" id="conversionRate">-</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">오늘 이용권 사용</div>
        <div class="stat-value" id="usageToday">-</div>
      </div>
    </div>
    
    <!-- 쿠팡 링크 관리 -->
    <div class="settings-panel">
      <div class="section-title">🔗 쿠팡 링크 관리</div>
      <div class="input-group">
        <input type="text" class="input-field" id="coupangLink" placeholder="쿠팡 링크 입력">
        <button class="save-btn" onclick="saveCoupangLink()">저장</button>
      </div>
    </div>
    
    <!-- 방문자 통계 그래프 -->
    <div class="chart-container">
      <div class="section-title">📈 일별 방문자 추이 (최근 7일)</div>
      <canvas id="visitorsChart"></canvas>
    </div>
    
    <!-- 쿠팡 클릭 그래프 -->
    <div class="chart-container">
      <div class="section-title">🔗 일별 쿠팡 클릭 추이 (최근 7일)</div>
      <canvas id="coupangChart"></canvas>
    </div>
    
    <!-- 기능별 사용 통계 -->
    <div class="chart-container">
      <div class="section-title">🎯 기능별 이용권 사용 순위</div>
      <canvas id="featuresChart"></canvas>
    </div>
    
    <!-- 시간대별 방문 분포 -->
    <div class="chart-container">
      <div class="section-title">⏰ 시간대별 방문 분포</div>
      <canvas id="hourlyChart"></canvas>
    </div>
  </div>
  
  <!-- 알림 -->
  <div class="notification" id="notification">
    <div id="notificationMessage"></div>
  </div>
  
  <script src="js/dashboard.js"></script>
</body>
</html>
```

#### 4.3. 대시보드 JavaScript

**파일: `frontend/admin/js/dashboard.js`**
```javascript
// 인증 확인
function checkAuth() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return token;
}

const token = checkAuth();

// API 호출 헤더
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// 로그아웃
function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUsername');
  window.location.href = 'login.html';
}

// 알림 표시
function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notificationMessage');
  
  notificationMessage.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// 실시간 통계 업데이트
async function updateRealtimeStats() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats/today', { headers });
    const data = await response.json();
    
    // 방문자
    document.getElementById('visitorsToday').textContent = data.visitorsToday;
    const visitorsChangeEl = document.getElementById('visitorsChange');
    visitorsChangeEl.textContent = `전일 대비 ${data.visitorsChange}%`;
    visitorsChangeEl.className = `stat-change ${data.visitorsChange >= 0 ? 'positive' : 'negative'}`;
    
    // 클릭
    document.getElementById('clicksToday').textContent = data.clicksToday;
    const clicksChangeEl = document.getElementById('clicksChange');
    clicksChangeEl.textContent = `전일 대비 ${data.clicksChange}%`;
    clicksChangeEl.className = `stat-change ${data.clicksChange >= 0 ? 'positive' : 'negative'}`;
    
    // 전환율
    document.getElementById('conversionRate').textContent = `${data.conversionRate}%`;
    
    // 이용권 사용
    document.getElementById('usageToday').textContent = data.usageToday;
    
    // 마지막 업데이트 시간
    document.getElementById('lastUpdate').textContent = 
      `마지막 업데이트: ${new Date().toLocaleTimeString('ko-KR')}`;
    
    // 알림 체크 (방문자 100명 이상)
    if (data.visitorsToday >= 100 && !window.notified100) {
      showNotification('🎉 오늘 방문자 100명 달성!');
      window.notified100 = true;
    }
  } catch (error) {
    console.error('실시간 통계 업데이트 실패:', error);
  }
}

// 쿠팡 링크 로드
async function loadCoupangLink() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/settings/coupang-link', { headers });
    const data = await response.json();
    document.getElementById('coupangLink').value = data.coupangLink;
  } catch (error) {
    console.error('쿠팡 링크 로드 실패:', error);
  }
}

// 쿠팡 링크 저장
async function saveCoupangLink() {
  const coupangLink = document.getElementById('coupangLink').value;
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/settings/coupang-link', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ coupangLink })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showNotification('✅ 쿠팡 링크가 저장되었습니다!');
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('저장 실패: ' + error.message);
  }
}

// 방문자 통계 차트
async function loadVisitorsChart() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats/visitors?days=7', { headers });
    const data = await response.json();
    
    const ctx = document.getElementById('visitorsChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.dailyVisitors.map(d => d._id),
        datasets: [{
          label: '방문자 수',
          data: data.dailyVisitors.map(d => d.count),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  } catch (error) {
    console.error('방문자 차트 로드 실패:', error);
  }
}

// 쿠팡 클릭 차트
async function loadCoupangChart() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats/coupang?days=7', { headers });
    const data = await response.json();
    
    const ctx = document.getElementById('coupangChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.dailyClicks.map(d => d._id),
        datasets: [{
          label: '클릭 수',
          data: data.dailyClicks.map(d => d.count),
          backgroundColor: '#ff6b6b'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  } catch (error) {
    console.error('쿠팡 차트 로드 실패:', error);
  }
}

// 기능별 사용 차트
async function loadFeaturesChart() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats/features', { headers });
    const data = await response.json();
    
    const ctx = document.getElementById('featuresChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.featureUsage.map(f => f._id),
        datasets: [{
          data: data.featureUsage.map(f => f.count),
          backgroundColor: [
            '#667eea', '#764ba2', '#f093fb', '#ff6b6b',
            '#4caf50', '#ffc107', '#00bcd4', '#ff9800'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  } catch (error) {
    console.error('기능 차트 로드 실패:', error);
  }
}

// 시간대별 차트
async function loadHourlyChart() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats/visitors', { headers });
    const data = await response.json();
    
    const ctx = document.getElementById('hourlyChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({length: 24}, (_, i) => `${i}시`),
        datasets: [{
          label: '방문자 수',
          data: data.hourlyDistribution.map(h => h.count),
          backgroundColor: '#4caf50'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  } catch (error) {
    console.error('시간대별 차트 로드 실패:', error);
  }
}

// 초기 로드
document.addEventListener('DOMContentLoaded', () => {
  updateRealtimeStats();
  loadCoupangLink();
  loadVisitorsChart();
  loadCoupangChart();
  loadFeaturesChart();
  loadHourlyChart();
  
  // 5초마다 실시간 통계 갱신
  setInterval(updateRealtimeStats, 5000);
});
```

---

### Phase 5: 테스트 및 배포 (20분)

#### 5.1. 초기 데이터 생성 (테스트용)
```bash
cd C:\xampp\htdocs\mysite\운세플랫폼\backend
node scripts/init-admin.js
```

#### 5.2. 서버 재시작
```bash
cd C:\xampp\htdocs\mysite\운세플랫폼\backend
npm start
```

#### 5.3. 관리자 페이지 접속
```
http://localhost:3000/admin/login.html
```

**로그인 정보:**
- ID: `admin`
- 비밀번호: `dkssud11@@`

---

## 🎯 작업 체크리스트

### Phase 1: 데이터베이스
- [ ] `init-admin.js` 작성
- [ ] 스크립트 실행
- [ ] 관리자 계정 생성 확인

### Phase 2: 통계 수집
- [ ] `analytics-tracker.js` 작성
- [ ] `index.html`에 추적 코드 추가
- [ ] `ticket-system.js` 수정

### Phase 3: 백엔드 API
- [ ] `auth.js` 미들웨어 작성
- [ ] `admin.js` 라우터 작성
- [ ] `analytics.js` 라우터 작성
- [ ] `server.js` 수정

### Phase 4: 프론트엔드
- [ ] `login.html` 작성
- [ ] `dashboard.html` 작성
- [ ] `dashboard.js` 작성

### Phase 5: 테스트
- [ ] 로그인 테스트
- [ ] 대시보드 접속 테스트
- [ ] 실시간 통계 확인
- [ ] 쿠팡 링크 수정 테스트
- [ ] 차트 표시 확인

---

## 🔒 보안 주의사항

1. **JWT SECRET_KEY 변경 필수**
   - `backend/middleware/auth.js`의 `SECRET_KEY` 변경

2. **CORS 설정 확인**
   - 프로덕션 환경에서는 특정 도메인만 허용

3. **비밀번호 해시 검증**
   - bcrypt 사용 확인

4. **HTTPS 사용 권장**
   - 프로덕션 배포 시 필수

---

## 📊 예상 작업 시간

- Phase 1: 10분
- Phase 2: 30분
- Phase 3: 40분
- Phase 4: 50분
- Phase 5: 20분

**총 예상 시간: 약 2.5시간**

---

## 💡 추가 개선 아이디어

1. **대시보드 필터링**
   - 기간별 조회 (일/주/월)
   
2. **엑셀 다운로드 고도화**
   - 그래프 포함 리포트

3. **이메일 알림**
   - 일일 리포트 자동 발송

4. **모바일 최적화**
   - 반응형 대시보드

5. **더 많은 통계**
   - 사용자 체류 시간
   - 이탈률 분석

---

## 🆘 문제 해결

### 문제 1: MongoDB 연결 실패
```
해결: MongoDB 서버 실행 확인
net start MongoDB
```

### 문제 2: CORS 에러
```javascript
// server.js에 추가
const cors = require('cors');
app.use(cors());
```

### 문제 3: 차트가 안 보임
```
해결: Chart.js CDN 확인
https://cdn.jsdelivr.net/npm/chart.js
```

---

## 📝 작업 완료 후

1. **GitHub에 커밋**
```bash
git add .
git commit -m "feat: 관리자 대시보드 구현"
git push origin main
```

2. **문서 업데이트**
   - `docs/project_plan.md`에 완료 기록

3. **테스트 데이터 생성**
   - 방문자/클릭/사용 데이터 테스트

---

**작업 시작 전 이 문서를 정독하고 단계별로 진행하세요!** 🚀
