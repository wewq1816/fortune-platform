# Vercel + Render 분업 구조 완벽 가이드

작성일: 2025-01-11
목적: 프론트엔드(Vercel)와 백엔드(Render) 완전 분리 배포

---

## 목차
1. [현재 문제 상황](#1-현재-문제-상황)
2. [목표 구조](#2-목표-구조)
3. [작업 순서](#3-작업-순서)
4. [Phase 1: Render 백엔드 설정](#phase-1-render-백엔드-설정)
5. [Phase 2: 프론트엔드 코드 수정](#phase-2-프론트엔드-코드-수정)
6. [Phase 3: Vercel 배포](#phase-3-vercel-배포)
7. [Phase 4: 테스트](#phase-4-테스트)
8. [체크리스트](#체크리스트)
9. [트러블슈팅](#트러블슈팅)

---

## 1. 현재 문제 상황

### 문제
- Render: 전체 앱 배포 (프론트+백엔드) → 타로 이미지 정상
- Vercel: 전체 앱 배포 (프론트+백엔드) → 타로 이미지 깨짐
- 같은 코드를 두 번 배포 (중복 배포)

### 원인
Vercel이 Serverless로 변환하면서 express.static()이 제대로 작동하지 않음

### 해결책
진짜 분업 구조로 변경:
- Vercel: 프론트엔드만 (정적 파일 CDN)
- Render: 백엔드만 (API 서버)

---

## 2. 목표 구조

### Before (중복 배포)
```
Render: frontend/ + backend/ (전체)
Vercel: frontend/ + backend/ (전체)
```

### After (분업 구조)
```
Vercel: frontend/ (프론트엔드만)
  - HTML, CSS, JS
  - 타로 이미지 (완벽 표시!)
  - 초고속 CDN

Render: backend/ (백엔드만)
  - Express API 서버
  - MongoDB 연결
  - Claude API 호출
```

### 연결
```
Vercel 프론트엔드
  |
  | fetch('https://fortune-platform.onrender.com/api/saju')
  v
Render 백엔드
```

---

## 3. 작업 순서

```
1. Render 백엔드 설정 (15분)
   - Root Directory 설정
   - CORS 추가
   - API 테스트

2. 프론트엔드 코드 수정 (30분)
   - API_URL 변수 추가
   - 8개 HTML 파일 수정
   - ticket-system.js 수정

3. Vercel 배포 (10분)
   - vercel.json 생성
   - Git 푸시
   - 자동 배포

4. 테스트 (10분)
   - 타로 이미지 확인
   - API 연결 확인
   - CORS 확인
```

---

## Phase 1: Render 백엔드 설정

### Step 1-1: Render 대시보드 설정

```
1. Render 대시보드 접속
   https://dashboard.render.com

2. fortune-platform 서비스 선택

3. Settings > Build & Deploy

4. Root Directory 설정:
   현재: (비어있음)
   변경: backend

5. Build Command:
   npm install

6. Start Command:
   node server.js

7. [Save Changes] 클릭
```

### Step 1-2: CORS 설정 (필수!)

파일: backend/server.js

```javascript
// CORS 설정 추가 (파일 상단, app 생성 직후)
const cors = require('cors');

app.use(cors({
  origin: [
    'https://fortune-platform.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

주의: 이모지 절대 금지! 주석도 한글 또는 영어만 사용

### Step 1-3: 환경 변수 확인

```
Render 대시보드 > Environment

필수 환경 변수:
- MONGO_URL: MongoDB 연결 문자열
- CLAUDE_API_KEY: Claude API 키
- JWT_SECRET: JWT 비밀 키
- MASTER_CODE: 마스터 코드
- PORT: 3000 (Render 자동 설정)
```

### Step 1-4: 재배포

```
Manual Deploy > Deploy latest commit
```

### Step 1-5: API 테스트

PowerShell에서:
```powershell
Invoke-WebRequest -Uri "https://fortune-platform.onrender.com/api/tickets/check"
```

예상 응답:
```json
{
  "success": true,
  "tickets": 2,
  "charged": false,
  "date": "2025-01-11"
}
```

체크:
- [ ] Render Root Directory: backend
- [ ] CORS 설정 완료
- [ ] 환경 변수 확인
- [ ] API 테스트 성공

---

## Phase 2: 프론트엔드 코드 수정

### 중요 규칙
1. UTF-8 인코딩 필수
2. 이모지 절대 금지
3. 주석은 한글 또는 영어만
4. BOM 없는 UTF-8 사용

### Step 2-1: API 설정 변수 추가

각 HTML 파일 상단 script 태그 내부에 추가:

```javascript
// API URL 설정 (개발/배포 자동 전환)
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://fortune-platform.onrender.com';

console.log('API URL:', API_URL);
```

### Step 2-2: 수정할 파일 목록 (8개)

```
frontend/pages/daily-fortune-test.html
frontend/pages/tarot-mock.html
frontend/pages/saju-test.html
frontend/pages/tojeong-test.html
frontend/pages/dream.html
frontend/pages/horoscope.html
frontend/pages/compatibility-test.html
frontend/utils/ticket-system.js
```

### Step 2-3: 파일별 수정 방법

#### 1. daily-fortune-test.html

찾기:
```javascript
fetch('http://localhost:3000/api/daily-fortune'
```
또는
```javascript
fetch('/api/daily-fortune'
```

변경:
```javascript
fetch(`${API_URL}/api/daily-fortune`
```

#### 2. tarot-mock.html

찾기:
```javascript
fetch('http://localhost:3000/api/tarot'
```
또는
```javascript
fetch('/api/tarot'
```

변경:
```javascript
fetch(`${API_URL}/api/tarot`
```

#### 3. saju-test.html

saju-api-functions.js 파일 수정:

찾기:
```javascript
fetch('http://localhost:3000/api/saju'
```

변경:
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://fortune-platform.onrender.com';

fetch(`${API_URL}/api/saju`
```

#### 4. tojeong-test.html

찾기:
```javascript
fetch('http://localhost:3000/api/tojeong'
```

변경:
```javascript
fetch(`${API_URL}/api/tojeong`
```

#### 5. dream.html

찾기:
```javascript
fetch('http://localhost:3000/api/dream/interpret'
```

변경:
```javascript
fetch(`${API_URL}/api/dream/interpret`
```

#### 6. horoscope.html

찾기:
```javascript
fetch('http://localhost:3000/api/horoscope'
```

변경:
```javascript
fetch(`${API_URL}/api/horoscope`
```

#### 7. compatibility-test.html

찾기:
```javascript
fetch('http://localhost:3000/api/compatibility'
```

변경:
```javascript
fetch(`${API_URL}/api/compatibility`
```

#### 8. frontend/utils/ticket-system.js

찾기:
```javascript
fetch('http://localhost:3000/api/tickets/charge'
fetch('http://localhost:3000/api/tickets/check'
```

변경:
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://fortune-platform.onrender.com';

fetch(`${API_URL}/api/tickets/charge`
fetch(`${API_URL}/api/tickets/check`
```

### Step 2-4: 타로 이미지 경로 확인

파일: frontend/pages/tarot-mock.html

타로 이미지 경로가 올바른지 확인:
```javascript
// 올바른 경로 예시
const imagePath = `/images/tarot/${card.id}.jpg`;
```

또는
```javascript
const imagePath = `../public/images/tarot/${card.id}.jpg`;
```

현재 구조:
```
frontend/
  public/
    images/
      tarot/
        00_fool.jpg
        01_magician.jpg
        ...
        21_world.jpg
```

### Step 2-5: 인코딩 확인

모든 파일을 UTF-8 (BOM 없음)으로 저장:

VS Code에서:
1. 파일 열기
2. 하단 상태바에서 인코딩 확인
3. "UTF-8" 클릭
4. "Save with Encoding" 선택
5. "UTF-8" 선택 (BOM 없음)

체크:
- [ ] 8개 HTML 파일 수정 완료
- [ ] ticket-system.js 수정 완료
- [ ] 모든 파일 UTF-8 인코딩
- [ ] 이모지 없음
- [ ] 타로 이미지 경로 확인

---

## Phase 3: Vercel 배포

### Step 3-1: vercel.json 생성

파일: vercel.json (프로젝트 루트)

```json
{
  "version": 2,
  "name": "fortune-platform-frontend",
  "buildCommand": "echo 'Static site'",
  "outputDirectory": "frontend",
  "cleanUrls": true,
  "trailingSlash": false,
  "routes": [
    {
      "src": "/images/(.*)",
      "dest": "/images/$1"
    },
    {
      "src": "/pages/(.*)",
      "dest": "/pages/$1"
    },
    {
      "src": "/css/(.*)",
      "dest": "/css/$1"
    },
    {
      "src": "/js/(.*)",
      "dest": "/js/$1"
    },
    {
      "src": "/utils/(.*)",
      "dest": "/utils/$1"
    },
    {
      "src": "/components/(.*)",
      "dest": "/components/$1"
    },
    {
      "src": "/public/(.*)",
      "dest": "/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

주의: JSON 파일에는 주석 불가

### Step 3-2: .gitignore 확인

파일: .gitignore

```
node_modules/
.env
.DS_Store
*.log
.vercel
```

### Step 3-3: Git 커밋 및 푸시

```bash
git add .
git commit -m "Vercel+Render separation: API URL updated"
git push origin main
```

### Step 3-4: Vercel 자동 배포 확인

```
1. Vercel 대시보드 접속
   https://vercel.com/dashboard

2. fortune-platform 프로젝트 선택

3. Deployments 탭
   - 새 배포 진행 중 확인
   - Build Logs 확인

4. 배포 완료 대기 (2-3분)

5. Visit 버튼 클릭
   https://fortune-platform.vercel.app
```

체크:
- [ ] vercel.json 생성
- [ ] Git 푸시 완료
- [ ] Vercel 배포 성공
- [ ] 배포 URL 접속 가능

---

## Phase 4: 테스트

### Test 1: 프론트엔드 로딩

```
1. https://fortune-platform.vercel.app 접속

2. 메인 페이지 로딩 확인
   - 8개 메뉴 표시
   - CSS 스타일 적용
   - 이미지 로딩

3. F12 개발자 도구 > Console 탭
   - 에러 없음 확인
   - "API URL: https://fortune-platform.onrender.com" 출력 확인
```

### Test 2: 타로 이미지 확인 (중요!)

```
1. 타로 카드 메뉴 클릭
   https://fortune-platform.vercel.app/pages/tarot-mock.html

2. 카드 이미지 로딩 확인
   - 78장 타로 카드 모두 표시
   - 이미지 깨짐 없음

3. Network 탭에서 이미지 경로 확인
   - /images/tarot/00_fool.jpg
   - Status: 200 OK
```

### Test 3: 이용권 시스템

```
1. 쿠팡 게이트 방문
   https://fortune-platform.vercel.app/pages/coupang-gate.html

2. "충전하기" 버튼 클릭

3. F12 > Network 탭
   - Request URL: https://fortune-platform.onrender.com/api/tickets/charge
   - Status: 200 OK
   - Response: {"success":true,"tickets":2}

4. 알림창 확인: "이용권 2개가 충전되었습니다!"
```

### Test 4: 사주팔자 API 연결

```
1. 사주팔자 메뉴 클릭
   https://fortune-platform.vercel.app/pages/saju-test.html

2. 생년월일 입력:
   - 연도: 1990
   - 월: 1
   - 일: 1
   - 시간: 12
   - 성별: 남자

3. "확인" 버튼 클릭

4. Network 탭 확인:
   - Request URL: https://fortune-platform.onrender.com/api/saju
   - Method: POST
   - Status: 200 OK

5. 사주 결과 표시 확인
```

### Test 5: CORS 확인

```
F12 > Console 탭

나쁜 예:
  "Access-Control-Allow-Origin" error
  CORS policy 오류

좋은 예:
  에러 없음
  API 호출 성공
```

### Test 6: 전체 기능 테스트

```
각 기능별로 테스트:

1. 오늘의 운세
   - 생년월일 입력
   - 결과 표시 확인

2. 타로 카드
   - 카드 이미지 로딩
   - 카드 선택
   - 해석 결과

3. 사주팔자
   - 사주 계산
   - 십성 표시
   - 대운 표시

4. 토정비결
   - 음력 변환
   - 괘 결과

5. 꿈 해몽
   - 키워드 검색
   - AI 해석

6. 별자리 운세
   - 별자리 계산
   - 운세 표시

7. 궁합 보기
   - 두 사람 입력
   - 궁합 결과

8. 로또 번호
   - 번호 생성
```

체크:
- [ ] 프론트엔드 로딩 성공
- [ ] 타로 이미지 완벽 표시
- [ ] 이용권 충전 성공
- [ ] 사주팔자 API 연결
- [ ] CORS 에러 없음
- [ ] 8개 기능 모두 작동

---

## 체크리스트

### Render 백엔드
- [ ] Root Directory: backend
- [ ] CORS 설정 완료
- [ ] 환경 변수 설정
- [ ] 재배포 완료
- [ ] API 테스트 성공

### 프론트엔드 코드
- [ ] API_URL 변수 추가
- [ ] daily-fortune-test.html 수정
- [ ] tarot-mock.html 수정
- [ ] saju-test.html 수정
- [ ] tojeong-test.html 수정
- [ ] dream.html 수정
- [ ] horoscope.html 수정
- [ ] compatibility-test.html 수정
- [ ] ticket-system.js 수정
- [ ] UTF-8 인코딩 확인
- [ ] 이모지 제거 확인

### Vercel 배포
- [ ] vercel.json 생성
- [ ] Git 커밋 및 푸시
- [ ] Vercel 자동 배포
- [ ] 배포 URL 접속

### 테스트
- [ ] 프론트엔드 로딩
- [ ] 타로 이미지 표시
- [ ] 이용권 시스템
- [ ] 사주팔자 연결
- [ ] CORS 확인
- [ ] 전체 기능 테스트

---

## 트러블슈팅

### 문제 1: Vercel에서 타로 이미지 안 보임

원인:
- 이미지 경로 문제
- vercel.json 설정 문제

해결:
```
1. 이미지 경로 확인:
   /images/tarot/00_fool.jpg (절대 경로)

2. vercel.json에 routes 추가:
   {
     "src": "/images/(.*)",
     "dest": "/images/$1"
   }

3. 실제 파일 위치 확인:
   frontend/public/images/tarot/
```

### 문제 2: CORS 에러

원인:
- Render 백엔드에서 Vercel 도메인 허용 안 함

해결:
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://fortune-platform.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

재배포 필수!

### 문제 3: API 404 Not Found

원인:
- API URL이 잘못됨
- Render 서버 안 떠있음

해결:
```
1. API_URL 확인:
   console.log('API URL:', API_URL);
   
2. Render 서버 상태 확인:
   https://dashboard.render.com
   
3. Render 로그 확인:
   Logs 탭에서 에러 확인
```

### 문제 4: 한글 깨짐

원인:
- 인코딩 문제

해결:
```
1. 모든 파일 UTF-8 (BOM 없음) 저장

2. HTML meta 태그 확인:
   <meta charset="UTF-8">

3. server.js에 인코딩 설정:
   app.use(express.json({ charset: 'utf-8' }));
```

### 문제 5: 이용권 충전 안 됨

원인:
- ticket-system.js에서 API URL 안 바뀜

해결:
```javascript
// frontend/utils/ticket-system.js 확인
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://fortune-platform.onrender.com';

// 모든 fetch() 확인
fetch(`${API_URL}/api/tickets/charge`, {...})
fetch(`${API_URL}/api/tickets/check`, {...})
```

---

## 최종 확인

### 성공 기준

1. Vercel 프론트엔드:
   - 메인 페이지 로딩
   - 타로 이미지 완벽 표시
   - CSS 스타일 적용

2. Render 백엔드:
   - API 정상 응답
   - CORS 허용
   - 24시간 운영

3. 연결:
   - API 호출 성공
   - 이용권 시스템 작동
   - 8개 기능 모두 정상

### 배포 완료 후

```
메인 URL: https://fortune-platform.vercel.app
API URL: https://fortune-platform.onrender.com

사용자는 Vercel URL만 알면 됨
Render URL은 내부적으로만 사용
```

---

작성일: 2025-01-11
작성자: 운세플랫폼 개발팀
버전: 1.0
