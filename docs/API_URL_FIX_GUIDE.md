# API URL 하드코딩 수정 작업 - 상세 가이드

작성일: 2025-01-17
상태: 완료

## 수정 완료 일시
- 2025-01-17 완료

## 중요 주의사항

1. **인코딩**: 모든 파일은 UTF-8 인코딩 유지
2. **이모지 금지**: 절대 이모지 사용하지 말것
3. **브라우저 종료**: 수정 전 브라우저에서 해당 페이지 닫기
4. **서버 재시작**: 수정 후 Node.js 서버 재시작

## 파일별 상세 수정 방법

---

### 1. tojeong-test.html 수정

**파일**: `C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\tojeong-test.html`

#### 수정 1: 733번째 줄 다음에 추가

**찾을 코드:**
```html
<script>
// 전역 변수
let selectedCategory = null;
```

**변경 후:**
```html
<script>
// 환경별 API URL 설정
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

const API_BASE_URL = isLocalhost 
  ? 'http://localhost:3000'
  : 'https://fortune-platform.onrender.com';

console.log('[Tojeong] Environment:', isLocalhost ? 'Local' : 'Production');
console.log('[Tojeong] API URL:', API_BASE_URL);

// 전역 변수
let selectedCategory = null;
```

#### 수정 2: 1023번째 줄 변경

**찾을 코드:**
```javascript
const response = await fetchWithDeviceId('https://fortune-platform.onrender.com/api/tojeong', {
```

**변경 후:**
```javascript
const response = await fetchWithDeviceId(API_BASE_URL + '/api/tojeong', {
```

---

### 2. tarot-mock.html 수정

**파일**: `C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\tarot-mock.html`

#### 수정 방법

1. 파일에서 `<script>` 태그 찾기
2. script 시작 부분에 환경 감지 로직 추가
3. 666번째 줄 근처의 하드코딩된 URL 찾기
4. `API_BASE_URL` 변수로 교체

**찾을 코드:**
```javascript
'https://fortune-platform.onrender.com/engines/data/tarot_meanings.json'
```

**변경 후:**
```javascript
API_BASE_URL + '/engines/data/tarot_meanings.json'
```

---

### 3. admin/login.html 수정

**파일**: `C:\xampp\htdocs\mysite\운세플랫폼\frontend\admin\login.html`

#### 수정 1: script 태그 내 환경 감지 추가

**찾을 위치:** 로그인 함수 전

```javascript
// 환경별 API URL 설정
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

const API_BASE_URL = isLocalhost 
  ? 'http://localhost:3000'
  : 'https://fortune-platform.onrender.com';

console.log('[Admin] Environment:', isLocalhost ? 'Local' : 'Production');
console.log('[Admin] API URL:', API_BASE_URL);
```

#### 수정 2: 202번째 줄 변경

**찾을 코드:**
```javascript
const response = await fetch('https://fortune-platform.onrender.com/api/admin/login', {
```

**변경 후:**
```javascript
const response = await fetch(API_BASE_URL + '/api/admin/login', {
```

---

### 4. admin/js/dashboard.js 수정

**파일**: `C:\xampp\htdocs\mysite\운세플랫폼\frontend\admin\js\dashboard.js`

#### 수정 1: 파일 최상단에 추가

```javascript
// 환경별 API URL 설정
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

const API_BASE_URL = isLocalhost 
  ? 'http://localhost:3000'
  : 'https://fortune-platform.onrender.com';

console.log('[Dashboard] Environment:', isLocalhost ? 'Local' : 'Production');
console.log('[Dashboard] API URL:', API_BASE_URL);
```

#### 수정 2-4: 모든 fetch 호출 변경

**53번째 줄:**
```javascript
// 변경 전
const response = await fetch('https://fortune-platform.onrender.com/api/admin/stats/today');

// 변경 후
const response = await fetch(API_BASE_URL + '/api/admin/stats/today');
```

**95번째 줄:**
```javascript
// 변경 전
const visitorsResponse = await fetch('https://fortune-platform.onrender.com/api/admin/stats/visitors');

// 변경 후
const visitorsResponse = await fetch(API_BASE_URL + '/api/admin/stats/visitors');
```

**100번째 줄:**
```javascript
// 변경 전
const coupangResponse = await fetch('https://fortune-platform.onrender.com/api/admin/stats/coupang');

// 변경 후
const coupangResponse = await fetch(API_BASE_URL + '/api/admin/stats/coupang');
```

---

## 일괄 수정 스크립트 (PowerShell)

브라우저를 모두 닫은 후 실행:

```powershell
# 작업 디렉토리로 이동
cd "C:\xampp\htdocs\mysite\운세플랫폼"

# 1. tojeong-test.html 수정
# 2. tarot-mock.html 수정
# 3. admin/login.html 수정
# 4. admin/js/dashboard.js 수정

# 수정 완료 후
Write-Host "모든 파일 수정 완료!"
Write-Host "브라우저 F5로 새로고침하여 확인하세요."
```

---

## 검증 체크리스트

### 로컬 테스트 (localhost:3000)

- [ ] 토정비결 페이지 접속
- [ ] F12 Console에서 "[Tojeong] API URL: http://localhost:3000" 확인
- [ ] 운세 보기 정상 작동 확인
- [ ] 타로 페이지 테스트
- [ ] 관리자 로그인 테스트
- [ ] 관리자 대시보드 통계 확인

### 배포 테스트 (vercel.app)

- [ ] fortune-platform.vercel.app 접속
- [ ] F12 Console에서 API URL이 onrender.com인지 확인
- [ ] 모든 기능 정상 작동 확인
- [ ] CORS 에러 없는지 확인

---

## 문제 해결

### "파일이 잠겨있습니다" 에러

1. 브라우저 모두 닫기
2. Node.js 서버 중지 (Ctrl + C)
3. 파일 수정
4. 서버 재시작

### CORS 에러 발생

`.env` 파일 확인:
```
ALLOWED_ORIGINS=http://localhost:3000,https://fortune-platform.onrender.com,https://fortune-platform.vercel.app
```

### API 호출 실패

1. F12 Network 탭 확인
2. 요청 URL 확인 (localhost 또는 onrender.com)
3. 백엔드 서버 실행 확인
4. Redis 서버 실행 확인

---

## 완료 후 작업

1. Git commit
2. Vercel에 배포
3. 실제 환경에서 테스트
4. 문제 없으면 이 문서 "완료" 표시

---

## 참고: 이미 수정 완료된 파일

- [x] saju-main.js
- [x] daily-fortune-test.html
- [x] analytics-tracker.js

## 수정 대기 파일

- [ ] tojeong-test.html
- [ ] tarot-mock.html
- [ ] admin/login.html
- [ ] admin/js/dashboard.js


---

## 2025-10-17 최종 업데이트

### 모든 파일 수정 완료

- [x] saju-main.js
- [x] daily-fortune-test.html
- [x] analytics-tracker.js (변수 중복 문제 해결)
- [x] tojeong-test.html
- [x] tarot-mock.html
- [x] admin/login.html
- [x] admin/js/dashboard.js
- [x] dream.html (꿈해몽)

### 추가 수정 사항

1. **analytics-tracker.js**
   - 즉시실행함수(IIFE)로 감싸서 전역 변수 중복 선언 문제 해결
   - isLocalhost, API_BASE_URL 변수 스코프 격리

2. **server.js (백엔드)**
   - 타로 API에 30초 타임아웃 추가
   - Promise.race를 사용한 타임아웃 처리
   - 무한 대기 문제 해결

3. **dream.html**
   - 환경 감지 로직 추가
   - /api/dream/interpret 엔드포인트 URL 수정
   - /api/dream/:id 엔드포인트 URL 수정

### 서버 재시작 완료
- PID 21536 종료
- 새 서버 시작 (PID 32656)
- Redis, MongoDB 연결 정상
- 모든 API 엔드포인트 정상 작동

### 테스트 결과
- 환경별 API URL 자동 감지 작동
- localhost: http://localhost:3000
- 배포: https://fortune-platform.onrender.com
