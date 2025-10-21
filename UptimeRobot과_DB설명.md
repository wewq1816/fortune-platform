# 🔥 명확한 설명: UptimeRobot과 DB 사용 현황

## 1️⃣ UptimeRobot이 뭐냐? (Cold Start 문제 해결)

### 문제 상황
```
무료 플랜의 Render.com:
- 15분 동안 요청이 없으면 → 서버 자동 슬립 😴
- 슬립 후 첫 요청 → 30-60초 대기 (서버 깨우는 시간)
- 이후 요청 → 즉시 응답 ✅

예시:
1. 09:00 - 사용자 A 접속 → 빠름 ✅
2. 09:05 - 사용자 B 접속 → 빠름 ✅
3. 09:20 - (15분간 아무도 없음)
4. 09:35 - 사용자 C 접속 → 30초 대기... 😱💢
5. 09:36 - 사용자 D 접속 → 빠름 ✅
```

### UptimeRobot 해결 방법
```
UptimeRobot = 자동으로 서버를 5분마다 깨워주는 봇

작동 원리:
1. UptimeRobot이 5분마다 서버에 요청
   → https://fortune-platform.onrender.com/ 에 자동 접속
   
2. 서버가 절대 15분 이상 비어있지 않음
   → 슬립 없음 ✅
   
3. 모든 사용자가 항상 빠른 응답 받음
   → 30초 대기 없음 ✅
```

### UptimeRobot 설정 방법 (3분)
```bash
1. https://uptimerobot.com 접속
2. 무료 가입
3. "Add New Monitor" 클릭
4. 설정:
   - Monitor Type: HTTP(s)
   - URL: https://fortune-platform.onrender.com
   - Monitoring Interval: 5 minutes
5. "Create Monitor" 클릭 → 끝!
```

**비용: 완전 무료** ✅
**효과: Cold Start 완전 제거** ✅

---

## 2️⃣ MongoDB에 뭘 저장하냐?

### 현재 프로젝트가 실제로 저장하는 데이터

#### A. 이용권 시스템 (tickets 컬렉션)
```javascript
// 각 디바이스(사용자)당 하루 이용권 정보
{
  deviceId: "device_a6a7f223...",  // 사용자 식별자
  date: "2025-10-21",              // 오늘 날짜
  tickets: 8,                       // 남은 이용권 개수
  charged: true,                    // 충전 했는지 여부
  usedFeatures: ["사주", "타로"],   // 사용한 기능들
  createdAt: Date,
  expiresAt: Date                   // 자정에 자동 삭제
}

매일 저장량:
- 1,000명 방문 × 1KB = 1MB/일
- 자정 자동 삭제 (TTL) → 다음날 초기화 ✅
```

**포인트: 자정에 자동으로 삭제됨! 누적 안 됨!**

#### B. 관리자 계정 (admins 컬렉션)
```javascript
{
  username: "cooal",
  password: "해시된비밀번호",
  createdAt: Date,
  lastLogin: Date
}

저장량: 1개 × 0.5KB = 0.5KB (고정)
```

#### C. 관리자 설정 (settings 컬렉션)
```javascript
{
  coupangLink: "https://link.coupang.com/...",
  updatedAt: Date,
  createdBy: "admin"
}

저장량: 1개 × 0.3KB = 0.3KB (고정)
```

#### D. 방문자 통계 (visitors 컬렉션)
```javascript
{
  deviceId: "device_xxx",
  page: "/pages/saju-test.html",
  timestamp: Date,
  userAgent: "..."
}

매일 저장량:
- 1,000명 × 3페이지 = 3,000건
- 3,000건 × 0.5KB = 1.5MB/일
```

#### E. 쿠팡 링크 클릭 로그 (coupang_clicks 컬렉션)
```javascript
{
  deviceId: "device_xxx",
  timestamp: Date,
  link: "https://link.coupang.com/..."
}

매일 저장량:
- 100번 클릭 × 0.3KB = 0.03MB/일
```

---

## 📊 실제 MongoDB 사용량 계산

### 일별 저장량
```
이용권 데이터: 1MB (자정 삭제 ✅)
방문자 로그: 1.5MB
쿠팡 클릭: 0.03MB
관리자 설정: 0.0008MB (고정)
━━━━━━━━━━━━━━━━━━━━━
일별 순 증가량: 1.5MB (이용권은 자동 삭제되므로 제외)
```

### 월별 누적량
```
1.5MB × 30일 = 45MB/월
```

### 무료 플랜 512MB 도달 시간
```
512MB ÷ 45MB = 11.4개월 (약 1년)

✅ 1년은 무료로 사용 가능!
```

---

## 🤔 "다 초기화시키면 업그레이드 필요 없지 않아?"

### 맞는 말씀입니다만...

#### 방법 1: 매월 수동 초기화
```bash
장점:
✅ MongoDB 무료 플랜 계속 사용

단점:
❌ 매월 수동으로 DB 초기화 필요
❌ 통계 데이터 손실
❌ 사용자 패턴 분석 불가
❌ 실수로 깜빡하면 서비스 중단
```

#### 방법 2: 자동 정리 스크립트
```javascript
// 30일 이상 오래된 로그 자동 삭제
setInterval(async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  await db.collection('visitors').deleteMany({
    timestamp: { $lt: thirtyDaysAgo }
  });
  
  console.log('✅ 오래된 로그 삭제 완료');
}, 86400000); // 매일 실행

결과:
- 최근 30일 데이터만 유지
- 저장량: 45MB 고정
- 무료 플랫폼 영구 사용 가능 ✅
```

---

## 🎯 실전 권장 전략

### 옵션 A: 완전 무료 영구 사용 (추천) ⭐
```bash
1. 자동 정리 스크립트 구현 (30분)
2. 30일치 데이터만 유지
3. MongoDB 무료 플랫폼 영구 사용
4. Render 무료 + UptimeRobot

월 비용: $108 (Claude API만)
```

#### 구현 방법:
```javascript
// server.js에 추가
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// 매일 자정 3시에 오래된 로그 삭제
setInterval(async () => {
  try {
    const db = getDB();
    const cutoffDate = new Date(Date.now() - THIRTY_DAYS_MS);
    
    // 30일 이상 오래된 방문자 로그 삭제
    const result1 = await db.collection('visitors').deleteMany({
      timestamp: { $lt: cutoffDate }
    });
    
    // 30일 이상 오래된 쿠팡 클릭 삭제
    const result2 = await db.collection('coupang_clicks').deleteMany({
      timestamp: { $lt: cutoffDate }
    });
    
    console.log(`✅ 자동 정리 완료: 방문 ${result1.deletedCount}건, 클릭 ${result2.deletedCount}건 삭제`);
  } catch (error) {
    console.error('❌ 자동 정리 오류:', error);
  }
}, 86400000); // 24시간마다
```

### 옵션 B: 통계 중요하면 유료
```bash
통계/분석이 중요한 경우:
- MongoDB M10: $9/월
- 10GB 저장 공간
- 최소 5년 데이터 보관 가능

월 비용: $124 (Claude $108 + Render $7 + MongoDB $9)
```

---

## 💡 최종 결론

### UptimeRobot
```
설정: 3분 소요
비용: 무료
효과: Cold Start 완전 제거
필수도: ⭐⭐⭐⭐⭐ (필수!)
```

### MongoDB 업그레이드
```
필요성: 선택사항
대안: 자동 정리 스크립트 (30분 구현)
무료 플랜 지속 가능: ✅ 가능!

추천:
1. 처음 1년: 자동 정리 스크립트 + 무료 플랫폼
2. 통계 중요해지면: M10 업그레이드
```

---

## 📋 실행 체크리스트

### 지금 당장 할 일 (무료)
```bash
✅ 1. UptimeRobot 설정 (3분) - 필수!
✅ 2. 자동 정리 스크립트 추가 (30분) - 권장
□ 3. 캐싱 시스템 구현 (1시간) - 비용 45% 절감
```

### 나중에 생각할 일
```bash
□ MongoDB M10 업그레이드 ($9/월)
  → 통계 분석 중요해지면
  → 또는 자동 정리가 귀찮으면
```

---

**핵심 요약:**
- **UptimeRobot**: 반드시 설정! (Cold Start 제거)
- **MongoDB**: 자동 정리 스크립트로 영구 무료 가능!
- **월 비용**: $108만 나옴 (Claude API만)