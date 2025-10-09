# 🔐 운세플랫폼 보안 가이드

📅 작성일: 2025-01-07  
🎯 목적: 배포 전 보안 체크리스트 및 설정 가이드

---

## ✅ **적용된 보안 조치 (7가지)**

### 1️⃣ **환경 변수 보호**
- ✅ `.env` 파일이 `.gitignore`에 포함됨
- ✅ `.env.example` 템플릿 생성 (API 키 제외)
- ✅ Git에 API 키 노출 방지

**확인 방법**:
```bash
git status  # .env가 Untracked에 있는지 확인
```

---

### 2️⃣ **JWT Secret 검증**
- ✅ `JWT_SECRET` 환경 변수 필수화
- ✅ 최소 32자 이상 권장 경고

**배포 전 필수 작업**:
```bash
# .env 파일에서 JWT_SECRET 변경!
JWT_SECRET=프로덕션용_랜덤하고_긴_문자열_최소32자이상
```

---

### 3️⃣ **CORS 설정 강화**
- ✅ 허용 도메인 제한 (`ALLOWED_ORIGINS`)
- ✅ 허용 메서드 제한 (GET, POST, PUT, DELETE만)
- ✅ 차단 로그 기록

**배포 전 필수 작업**:
```bash
# .env 파일에서 실제 도메인 추가
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

---

### 4️⃣ **Rate Limiting 추가**
- ✅ Claude API: 15분당 30회 제한
- ✅ 일반 API: 15분당 100회 제한
- ✅ 초과 시 에러 메시지 반환

**제한 대상**:
- `/api/tarot` (타로)
- `/api/daily-fortune` (오늘의 운세)
- `/api/saju` (사주팔자)
- `/api/horoscope` (별자리)
- `/api/tojeong` (토정비결)
- `/api/compatibility` (궁합)
- `/api/dream/interpret` (꿈해몽 AI)

---

### 5️⃣ **입력 검증 추가**
- ✅ 사주팔자 API에 입력 검증 적용
- ✅ 연도: 1900~2100
- ✅ 월: 1~12
- ✅ 일: 1~31
- ✅ 시간: 0~23
- ✅ 성별: 남자/여자만 허용

---

### 6️⃣ **관리자 비밀번호 보안**
- ✅ 비밀번호 변경 스크립트 생성
- ✅ bcrypt 해싱 (10 rounds)

**비밀번호 변경 방법**:
```bash
node backend/scripts/change-admin-password.js
```

**초기 비밀번호**: `dkssud11@@` → **즉시 변경 필수!**

---

### 7️⃣ **패키지 추가**
- ✅ `express-rate-limit` 추가

**설치 명령**:
```bash
npm install
```

---

## 🚀 **배포 전 체크리스트**

### 필수 작업
- [ ] `.env` 파일이 Git에 포함되지 않았는지 확인
- [ ] `JWT_SECRET` 프로덕션용으로 변경
- [ ] `ALLOWED_ORIGINS`에 실제 도메인 추가
- [ ] 관리자 비밀번호 변경 (`node backend/scripts/change-admin-password.js`)
- [ ] `npm install` 실행 (Rate Limiting 패키지 설치)

### 권장 작업
- [ ] `NODE_ENV=production` 설정
- [ ] Claude API 월 예산 확인 (`CLAUDE_MONTHLY_BUDGET`)
- [ ] MongoDB 연결 문자열 확인 (`MONGO_URL`)

---

## 📌 **프로덕션 배포 시 .env 설정 예시**

```env
# Claude API
CLAUDE_API_KEY=프로덕션용_API_키
CLAUDE_MODEL=claude-3-haiku-20240307
CLAUDE_MONTHLY_BUDGET=50000

# JWT Secret (랜덤하고 긴 문자열!)
JWT_SECRET=프로덕션용_매우_랜덤한_비밀키_최소32자이상_1234567890abcdef

# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/fortune_platform?retryWrites=true&w=majority
DB_NAME=fortune_platform

# CORS (실제 도메인)
ALLOWED_ORIGINS=https://yourdomain.com

# Session Secret
SESSION_SECRET=프로덕션용_세션_비밀키_최소32자이상_abcdef1234567890

# 프로덕션 모드
NODE_ENV=production
PORT=3000
```

---

## 🔍 **보안 점검 명령**

### 1. .env 파일 Git 노출 확인
```bash
git status
# .env가 Untracked files에 있어야 함
```

### 2. JWT Secret 길이 확인
```bash
node -e "console.log(require('dotenv').config().parsed.JWT_SECRET.length)"
# 32 이상이어야 함
```

### 3. Rate Limiting 작동 확인
```bash
# 같은 API를 15분에 30회 이상 호출 시 에러 발생 확인
curl -X POST http://localhost:3000/api/saju -H "Content-Type: application/json" -d '{...}'
```

---

## ⚠️ **주의사항**

### Claude API 키 노출 시
1. 즉시 https://console.anthropic.com/settings/keys 에서 키 삭제
2. 새 키 발급
3. `.env` 파일 업데이트
4. Git 히스토리 확인 (노출된 키 제거)

### 관리자 로그인 실패 시
```bash
# 비밀번호 재설정
node backend/scripts/change-admin-password.js
```

### Rate Limiting 해제 필요 시
```javascript
// server.js에서 해당 라인 주석 처리
// app.use('/api/saju', claudeApiLimiter);
```

---

## 📞 **문의 및 지원**

보안 이슈 발견 시:
1. `.env` 파일 즉시 확인
2. 관리자 비밀번호 변경
3. API 키 교체

---

**작성일**: 2025-01-07  
**버전**: 1.0  
**관리자**: cooal
