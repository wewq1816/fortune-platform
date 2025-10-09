# 🔍 운세플랫폼 전체 시스템 점검 문서 (체크포인트 방식)

📅 작성일: 2025-01-09  
🎯 목적: 배포 전 전체 시스템 감사 (코드/정확도/중복/오류/의도 검증)  
⚠️ **중요**: 점검만 하고 수정은 하지 않음 (발견사항 기록만)

---

## 📋 목차

- [사용 방법](#사용-방법)
- [체크포인트 1: 환경 설정 및 보안](#체크포인트-1-환경-설정-및-보안)
- [체크포인트 2: 파일 구조 및 중복](#체크포인트-2-파일-구조-및-중복)
- [체크포인트 3: 프론트엔드 - 오늘의 운세](#체크포인트-3-프론트엔드---오늘의-운세)
- [체크포인트 4: 프론트엔드 - 타로 카드](#체크포인트-4-프론트엔드---타로-카드)
- [체크포인트 5: 프론트엔드 - 사주팔자](#체크포인트-5-프론트엔드---사주팔자)
- [체크포인트 6: 프론트엔드 - 토정비결](#체크포인트-6-프론트엔드---토정비결)
- [체크포인트 7: 프론트엔드 - 꿈 해몽](#체크포인트-7-프론트엔드---꿈-해몽)
- [체크포인트 8: 프론트엔드 - 별자리 운세](#체크포인트-8-프론트엔드---별자리-운세)
- [체크포인트 9: 프론트엔드 - 로또 번호](#체크포인트-9-프론트엔드---로또-번호)
- [체크포인트 10: 프론트엔드 - 궁합 보기](#체크포인트-10-프론트엔드---궁합-보기)
- [체크포인트 11: 백엔드 엔진 점검](#체크포인트-11-백엔드-엔진-점검)
- [체크포인트 12: API 라우터 점검](#체크포인트-12-api-라우터-점검)
- [체크포인트 13: 데이터 정확도 검증](#체크포인트-13-데이터-정확도-검증)
- [체크포인트 14: 이용권 시스템](#체크포인트-14-이용권-시스템)
- [체크포인트 15: 관리자 시스템](#체크포인트-15-관리자-시스템)
- [체크포인트 16: 에러 처리](#체크포인트-16-에러-처리)
- [체크포인트 17: 성능 및 최적화](#체크포인트-17-성능-및-최적화)
- [체크포인트 18: 최종 종합 보고서](#체크포인트-18-최종-종합-보고서)

---

## 사용 방법

### 📌 점검 규칙
1. **순서대로 진행**: 체크포인트 1부터 18까지 순차 진행
2. **발견사항 기록**: 문제 발견 시 [발견사항] 섹션에 기록
3. **수정 금지**: 절대 코드 수정하지 않음 (발견만)
4. **체크박스 표시**: 완료된 항목은 `[ ]` → `[✓]`로 변경
5. **Claude에게 지시**: "체크포인트 N 시작" 이라고 명령

### 📊 진행 상황 추적
```
전체 진행률: 1/18 (5.6%)

✓ = 완료
○ = 진행 중
□ = 미시작

✓ 체크포인트 1: 환경 설정 및 보안 (완료: 2025-01-09)
□ 체크포인트 2: 파일 구조 및 중복
□ 체크포인트 3: 오늘의 운세
□ 체크포인트 4: 타로 카드
□ 체크포인트 5: 사주팔자
□ 체크포인트 6: 토정비결
□ 체크포인트 7: 꿈 해몽
□ 체크포인트 8: 별자리 운세
□ 체크포인트 9: 로또 번호
□ 체크포인트 10: 궁합 보기
□ 체크포인트 11: 백엔드 엔진
□ 체크포인트 12: API 라우터
□ 체크포인트 13: 데이터 정확도
□ 체크포인트 14: 이용권 시스템
□ 체크포인트 15: 관리자 시스템
□ 체크포인트 16: 에러 처리
□ 체크포인트 17: 성능 최적화
□ 체크포인트 18: 최종 종합
```

---

## 체크포인트 1: 환경 설정 및 보안

**목적**: 환경 변수, 보안 설정, 인증 시스템 점검

### 점검 항목

#### 1.1 환경 변수 (.env)
- [ ] `.env` 파일 존재 확인
- [ ] `CLAUDE_API_KEY` 설정 및 형식 (sk-ant-로 시작)
- [ ] `MONGO_URL` 연결 문자열 형식
- [ ] `JWT_SECRET` 길이 (32자 이상)
- [ ] `SESSION_SECRET` 길이 (32자 이상)
- [ ] `MASTER_CODE` 설정
- [ ] `PORT` 설정
- [ ] `NODE_ENV` 설정 (development/production)
- [ ] `ALLOWED_ORIGINS` CORS 설정

**점검 방법**:
```bash
type .env
# 또는
cat .env
```

#### 1.2 보안 취약점
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] 기본 비밀번호 사용 여부 (change-in-production 같은 문구)
- [ ] API 키가 코드에 하드코딩되어 있는가?
- [ ] 민감한 정보가 로그에 출력되는가?

**점검 방법**:
```bash
# .gitignore 확인
type .gitignore | findstr .env

# 코드에서 하드코딩 검색
findstr /S /I "sk-ant-" *.js *.html
```

#### 1.3 인증 시스템
- [ ] JWT 토큰 만료 시간 설정 (24시간)
- [ ] bcrypt salt rounds (10 이상)
- [ ] 관리자 비밀번호 해싱 여부
- [ ] 세션 보안 설정 (httpOnly, secure)

**점검 파일**:
- `backend/middleware/auth.js`
- `backend/routes/admin.js`
- `backend/scripts/init-admin.js`

### 발견사항

#### 🔴 치명적 (Critical)
> 없음 (수정 완료)

#### 🟠 높음 (High)
> **수정 완료 (2025-01-09)**
> 1. JWT_SECRET을 강력한 랜덤 문자열로 변경 ✅
> 2. SESSION_SECRET을 강력한 랜덤 문자열로 변경 ✅
> 3. 관리자 비밀번호를 환경 변수로 이동 ✅
> 4. bcrypt salt rounds를 10에서 12로 증가 ✅

#### 🟡 중간 (Medium)
> **남은 작업 (배포 시 수정 필요)**
> 1. CORS 도메인 설정: 프로덕션 도메인 추가 필요

#### 🟢 낮음 (Low)
> 없음

### 완료 여부
- [✓] 체크포인트 1 완료 (2025-01-09)

---

## 체크포인트 2: 파일 구조 및 중복

**목적**: 파일 중복, 미사용 파일, 구조 문제 점검

### 점검 항목

#### 2.1 중복 파일 확인
- [ ] HTML 파일 중복 (예: `saju-test.html` vs `saju-test-new.html`)
- [ ] JavaScript 파일 중복
- [ ] CSS 파일 중복
- [ ] 백업 파일/폴더 (`backup_*`, `*_backup.*`, `*_old.*`)

**점검 방법**:
```bash
# HTML 파일 중복 검색
dir /S frontend\pages\*.html | findstr /I "test new old backup"

# JavaScript 중복
dir /S frontend\pages\*.js | findstr /I "test new old backup"
```

#### 2.2 미사용 파일 (파일구조_연결관계_정확한매핑.md 기준)
- [ ] `frontend/pages/daily-fortune.html` (구버전)
- [ ] `frontend/pages/tarot-mock-complete.html`
- [ ] `frontend/pages/tarot-test.html`
- [ ] `frontend/pages/saju-test-improved.html`
- [ ] `frontend/pages/saju-test-new.html`
- [ ] `frontend/pages/saju-test-old-backup.html`
- [ ] `frontend/pages/tojeong.html`
- [ ] `frontend/pages/compatibility.html`
- [ ] `frontend/pages/compatibility_fixed.html`
- [ ] `frontend/pages/saju-basic-calculator.js`
- [ ] `frontend/pages/saju-extended-calculator.js`
- [ ] `frontend/pages/saju-interpretations.js`

**점검 방법**:
```bash
# 파일 존재 여부 확인
Test-Path frontend\pages\daily-fortune.html
```

#### 2.3 필수 파일 누락 확인
- [ ] `frontend/index.html` (메인)
- [ ] `frontend/pages/daily-fortune-test.html`
- [ ] `frontend/pages/tarot-mock.html`
- [ ] `frontend/pages/saju-test.html`
- [ ] `frontend/pages/tojeong-test.html`
- [ ] `frontend/pages/dream.html`
- [ ] `frontend/pages/horoscope.html`
- [ ] `frontend/pages/lotto.html`
- [ ] `frontend/pages/compatibility-test.html`
- [ ] `frontend/pages/coupang-gate.html`
- [ ] `frontend/utils/ticket-system.js`
- [ ] `frontend/components/common/TicketModal.jsx`

#### 2.4 파일명 일관성
- [ ] 파일명 규칙 통일 (kebab-case vs camelCase)
- [ ] HTML 파일명에 `-test` suffix 일관성
- [ ] 엔진 파일명 규칙 (`*-engine.js`)

### 발견사항

#### 중복 파일 목록
> 발견 시 파일 경로 나열

#### 미사용 파일 목록
> 실제 존재하는 미사용 파일

#### 누락 파일 목록
> 있어야 하는데 없는 파일

#### 구조 문제
> 파일 위치, 네이밍 등 구조적 문제

### 완료 여부
- [ ] 체크포인트 2 완료

---

## 체크포인트 3: 프론트엔드 - 오늘의 운세

**목적**: 오늘의 운세 기능 코드 정확도 및 의도 검증

### 점검 항목

#### 3.1 파일 기본 정보
```
파일: frontend/pages/daily-fortune-test.html
연결 API: POST /api/daily-fortune
백엔드 엔진: engines/core/daily-engine.js
프롬프트: engines/prompts/daily-fortune-prompt.js
```

#### 3.2 HTML 구조
- [ ] DOCTYPE 선언
- [ ] meta 태그 (charset, viewport)
- [ ] title 태그
- [ ] 이용권 시스템 통합 여부
- [ ] 사주 정보 불러오기 기능

#### 3.3 입력 폼 검증
- [ ] 생년월일 입력 필드 (type="date")
- [ ] 시간 선택 (select, 0~23시)
- [ ] 성별 선택 (radio/select)
- [ ] 필수 입력 검증 (JavaScript)
- [ ] 날짜 유효성 검사 (미래 날짜 차단 등)

#### 3.4 API 호출 로직
- [ ] fetch API 사용
- [ ] 엔드포인트 정확성 (`http://localhost:3000/api/daily-fortune`)
- [ ] HTTP 메서드 (POST)
- [ ] Content-Type 헤더 (application/json)
- [ ] 요청 바디 구조:
  ```json
  {
    "year": 1990,
    "month": 1,
    "day": 1,
    "hour": 12,
    "gender": "남자"
  }
  ```

#### 3.5 이용권 시스템 통합
- [ ] ticket-system.js import
- [ ] 이용권 확인 (`hasTickets()`)
- [ ] 이용권 차감 (`useTicket()`)
- [ ] 이용권 부족 시 모달 표시
- [ ] 모달에서 충전 페이지 이동

#### 3.6 사주 정보 저장/불러오기
- [ ] localStorage 사용
- [ ] 키 이름: `savedSajuInfo` 또는 `saju_info`
- [ ] 저장 시점: API 호출 전
- [ ] 불러오기 시점: 페이지 로드 시
- [ ] 자동 입력 기능

#### 3.7 UI/UX
- [ ] 로딩 애니메이션 (스피너)
- [ ] 에러 메시지 표시
- [ ] 결과 표시 영역
- [ ] 사주 사신주 표시
- [ ] 오행 분석 표시
- [ ] 종합 운세 표시
- [ ] 인쇄/PDF 다운로드 기능

#### 3.8 에러 처리
- [ ] try-catch 블록
- [ ] fetch 에러 처리
- [ ] 서버 에러 응답 처리 (4xx, 5xx)
- [ ] 사용자 친화적 에러 메시지

#### 3.9 코드 품질
- [ ] 주석 적절성
- [ ] 함수 분리 (역할별)
- [ ] 전역 변수 최소화
- [ ] 매직 넘버 상수화
- [ ] 코드 중복 여부

### 발견사항

#### 정확도 문제
> API 요청/응답 구조 불일치 등

#### 중복 코드
> 다른 페이지와 중복되는 코드

#### 의도와 다른 동작
> 예상과 다르게 작동하는 부분

#### 오류 (버그)
> 명확한 버그나 오류

#### 개선 제안
> 더 나은 구현 방법

### 완료 여부
- [ ] 체크포인트 3 완료

---

## 체크포인트 4: 프론트엔드 - 타로 카드

**목적**: 타로 카드 기능 코드 정확도 및 의도 검증

### 점검 항목

#### 4.1 파일 기본 정보
```
파일: frontend/pages/tarot-mock.html
연결 API: POST /api/tarot
백엔드 엔진: engines/core/tarot-engine.js
데이터: engines/data/tarot-cards-complete.json (78장)
프롬프트: engines/prompts/tarot-prompt.js
```

#### 4.2 타로 카드 데이터
- [ ] 78장 카드 데이터 내장 (메이저 22장 + 마이너 56장)
- [ ] 카드 구조:
  ```javascript
  {
    id: "fool",
    name: "바보",
    name_en: "The Fool",
    number: 0,
    arcana: "major",
    keywords: [],
    upright: "...",
    reversed: "...",
    image: "..."
  }
  ```
- [ ] 이미지 경로 정확성
- [ ] 한글/영문 이름 모두 존재

#### 4.3 카드 선택 UI
- [ ] 카드 덱 표시 (78장 모두)
- [ ] 카드 뒤집기 애니메이션
- [ ] 선택된 카드 표시 (3장 또는 5장)
- [ ] 카드 선택 제한 (3/5/10장)
- [ ] 이미 선택한 카드 재선택 방지

#### 4.4 카테고리 선택
- [ ] 종합 운세
- [ ] 애정 운
- [ ] 직업 운
- [ ] 금전 운
- [ ] 건강 운
- [ ] 기타 카테고리

#### 4.5 API 호출
- [ ] 엔드포인트: `/api/tarot`
- [ ] 요청 구조:
  ```json
  {
    "cards": [
      { "id": "fool", "name": "바보", "position": "upright" },
      { "id": "magician", "name": "마법사", "position": "reversed" }
    ],
    "category": "종합 운세"
  }
  ```
- [ ] 정방향/역방향 구분

#### 4.6 결과 표시
- [ ] 선택한 카드 목록
- [ ] 카드별 의미 (정방향/역방향)
- [ ] Claude AI 종합 해석
- [ ] 카드 이미지 표시

#### 4.7 PDF/인쇄 기능
- [ ] PDF 다운로드 버튼
- [ ] 인쇄 기능
- [ ] 공유 기능 (선택)

### 발견사항

#### 카드 데이터 문제
> 누락, 오타, 형식 오류 등

#### UI/UX 문제
> 카드 선택, 애니메이션 등

#### API 연동 문제
> 요청/응답 구조 불일치

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 4 완료

---

## 체크포인트 5: 프론트엔드 - 사주팔자

**목적**: 사주팔자 기능 코드 정확도 및 의도 검증 (가장 중요!)

### 점검 항목

#### 5.1 파일 구조
```
메인 HTML: frontend/pages/saju-test.html
필수 JS 모듈:
  - saju-main.js (메인 로직)
  - saju-ui-controller.js (UI 제어)
  - saju-api-functions.js (API 호출)
  - ten-stars-calculator.js (십성 계산)

백엔드 엔진:
  - engines/core/saju-engine.js (메인)
  - engines/core/saju-engine-extended.js (대운/신살)
  
핵심 유틸:
  - engines/utils/saju-calculator.js ⭐ (만년력 계산)
  - engines/utils/ganzi-calculator.js (간지 계산)
  - engines/utils/daeun-calculator.js (대운)
  - engines/utils/ten-stars-calculator.js (십성)
  - engines/utils/element-analyzer.js (오행)
  - engines/utils/strength-calculator.js (강약)
  - engines/utils/yongsin-finder.js (용신)
  - engines/utils/sinsal-calculator.js (신살)
  
데이터:
  - engines/data/ganzi-60.json ⭐ (60갑자)
  - engines/data/five-elements.json
  - engines/data/ten-stars-data.json
```

#### 5.2 프론트엔드 - 입력 검증
- [ ] 생년월일 입력 (type="date")
- [ ] 출생 시간 (select, 0~23시)
- [ ] 성별 선택 (남자/여자)
- [ ] 카테고리 선택:
  - [ ] 종합
  - [ ] 성격
  - [ ] 적성
  - [ ] 직업
  - [ ] 재물
  - [ ] 건강
  - [ ] 애정
  - [ ] 결혼
  - [ ] 승진
  - [ ] 학업
  - [ ] 이사
  - [ ] 부모
  - [ ] 자녀
  - [ ] 형제
  - [ ] 사회
  - [ ] 여행
  - [ ] 대운
  - [ ] 신살
  - [ ] 택일

#### 5.3 프론트엔드 - API 호출
- [ ] 엔드포인트: `/api/saju`
- [ ] 요청 구조:
  ```json
  {
    "year": 1990,
    "month": 1,
    "day": 1,
    "hour": 12,
    "gender": "남자",
    "category": "total"
  }
  ```

#### 5.4 프론트엔드 - Mock 데이터 사용 여부
- [ ] `saju-basic-calculator.js` 사용 여부 (더미 데이터)
- [ ] `saju-extended-calculator.js` 사용 여부 (미사용)
- [ ] `saju-interpretations.js` 사용 여부 (미사용)
- [ ] **중요**: Mock 데이터 대신 백엔드 API 호출하는가?

#### 5.5 백엔드 - 만년력 계산 정확도 (⭐ 가장 중요!)
**점검 파일**: `engines/utils/saju-calculator.js`

- [ ] 입력: 양력 생년월일 + 시간
- [ ] 출력: 사주 사신주 (년주, 월주, 일주, 시주)

**예시 테스트 케이스**:
```
입력: 1990년 1월 1일 12시 (남자)

예상 출력:
년주: 기사(己巳)
월주: 병자(丙子)
일주: 경인(庚寅)
시주: 임오(壬午)
```

**검증 방법**:
1. 기존 사주 프로그램과 비교 (만세력 사이트)
2. 여러 날짜로 테스트 (1900~2025년)
3. 윤달 처리 확인
4. 자시(23:00~01:00) 처리 확인

#### 5.6 백엔드 - 60갑자 데이터 정확도
**점검 파일**: `engines/data/ganzi-60.json`

- [ ] 60갑자 모두 존재 (갑자부터 계해까지)
- [ ] 천간(天干) 10개: 갑을병정무기경신임계
- [ ] 지지(地支) 12개: 자축인묘진사오미신유술해
- [ ] 오행 정보 정확성
- [ ] 음양 정보 정확성

**검증 방법**:
```javascript
// ganzi-60.json 구조 확인
[
  {
    "index": 0,
    "ganzi": "갑자",
    "gan": "갑",
    "ji": "자",
    "ganElement": "목",
    "jiElement": "수",
    "yin": false
  },
  // ... 60개
]
```

#### 5.7 백엔드 - 십성 계산
**점검 파일**: `engines/utils/ten-stars-calculator.js`

- [ ] 일간 기준으로 십성 계산
- [ ] 10가지 십성:
  - [ ] 비견(比肩)
  - [ ] 겁재(劫財)
  - [ ] 식신(食神)
  - [ ] 상관(傷官)
  - [ ] 편재(偏財)
  - [ ] 정재(正財)
  - [ ] 편관(偏官, 七殺)
  - [ ] 정관(正官)
  - [ ] 편인(偏印, 梟神)
  - [ ] 정인(正印)

**검증 로직**:
```
일간이 '갑목'일 때:
- 갑/을(목) → 비견/겁재
- 병/정(화) → 식신/상관
- 무/기(토) → 편재/정재
- 경/신(금) → 편관/정관
- 임/계(수) → 편인/정인
```

#### 5.8 백엔드 - 대운 계산
**점검 파일**: `engines/utils/daeun-calculator.js`

- [ ] 성별에 따른 대운 방향 (남양여음/남음여양)
- [ ] 대운 시작 나이 계산 (입운 연도)
- [ ] 10년 단위 대운 간지
- [ ] 최소 80~100세까지

**예시**:
```
남자, 기사년생 (양년)
→ 순행 대운
→ 1세~10세: 정축(丁丑)
→ 11세~20세: 무인(戊寅)
→ ...
```

#### 5.9 백엔드 - 오행 분석
**점검 파일**: `engines/utils/element-analyzer.js`

- [ ] 오행 개수 계산 (목화토금수)
- [ ] 오행 균형 분석
- [ ] 부족한 오행 파악
- [ ] 과한 오행 파악

#### 5.10 백엔드 - 강약 분석
**점검 파일**: `engines/utils/strength-calculator.js`

- [ ] 일간 강약 계산
- [ ] 월지 왕상휴수사 고려
- [ ] 계절별 강약
- [ ] 통근 여부

#### 5.11 백엔드 - 용신 파악
**점검 파일**: `engines/utils/yongsin-finder.js`

- [ ] 용신 선택 로직
- [ ] 희신, 기신, 구신 파악

#### 5.12 백엔드 - 신살 계산
**점검 파일**: `engines/utils/sinsal-calculator.js`

- [ ] 기본 신살:
  - [ ] 역마(驛馬)
  - [ ] 도화(桃花)
  - [ ] 화개(華蓋)
  - [ ] 백호(白虎)
  - [ ] 공망(空亡)
  - [ ] 원진(怨嗔)
  - [ ] 귀문관(鬼門關)
  - [ ] 기타

#### 5.13 Claude AI 해석
**점검 파일**: `engines/prompts/saju/` 디렉토리

- [ ] 카테고리별 프롬프트 존재
- [ ] 프롬프트 품질
- [ ] 한국어 자연스러움
- [ ] 전문 용어 정확성

### 발견사항

#### 🔴 만년력 계산 오류
> 정확도 문제, 특정 날짜 계산 오류 등

#### 🔴 십성 계산 오류
> 십성 잘못 계산되는 경우

#### 🔴 대운 계산 오류
> 대운 순역, 나이 계산 오류

#### 🟠 데이터 정확도
> 60갑자, 오행 데이터 오류

#### 🟠 로직 문제
> 알고리즘 오류, 의도와 다른 동작

#### 🟡 UI/UX 문제
> 프론트엔드 표시 오류

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 5 완료

---

## 체크포인트 6: 프론트엔드 - 토정비결

**목적**: 토정비결 기능 코드 정확도 및 의도 검증

### 점검 항목

#### 6.1 파일 기본 정보
```
파일: frontend/pages/tojeong-test.html
연결 API: POST /api/tojeong
백엔드 엔진: engines/core/tojeong-engine.js
데이터: engines/data/tojeong-gua-144.json (144괘)
프롬프트: engines/prompts/tojeong-prompt.js
음력 변환: lunar-javascript 라이브러리
```

#### 6.2 입력 처리
- [ ] 양력 생년월일 입력
- [ ] 음력 변환 자동 처리
- [ ] 음력 표시 (사용자 확인용)

#### 6.3 144괘 데이터
**점검 파일**: `engines/data/tojeong-gua-144.json`

- [ ] 144개 괘 모두 존재
- [ ] 괘 구조:
  ```json
  {
    "gua_number": 1,
    "title": "건위천(乾爲天)",
    "text": "원문...",
    "meaning": "해석..."
  }
  ```
- [ ] 원문 정확성
- [ ] 한자 표기

#### 6.4 괘 선택 로직
- [ ] 음력 날짜 기반 계산
- [ ] 알고리즘 정확성
- [ ] 같은 날짜 → 같은 괘 (일관성)

#### 6.5 음력 변환
**라이브러리**: `lunar-javascript`

- [ ] 설치 확인 (`engines/node_modules/`)
- [ ] import 구문
- [ ] 변환 정확성 테스트

**테스트 케이스**:
```
양력 1990-01-01 → 음력 1989-12-05
양력 2025-01-09 → 음력 2024-12-10
```

#### 6.6 결과 표시
- [ ] 음력 날짜
- [ ] 괘 번호 및 이름
- [ ] 원문 표시
- [ ] Claude AI 현대 해석

### 발견사항

#### 음력 변환 문제
> 변환 오류, 윤달 처리 등

#### 괘 데이터 문제
> 오타, 누락, 형식 오류

#### 로직 문제
> 괘 선택 알고리즘 오류

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 6 완료

---

## 체크포인트 7: 프론트엔드 - 꿈 해몽

**목적**: 꿈 해몽 기능 코드 정확도 및 의도 검증

### 점검 항목

#### 7.1 파일 기본 정보
```
파일: frontend/pages/dream.html
연결 API: POST /api/dream
백엔드 엔진: engines/core/dream-engine.js
데이터베이스: engines/data/dream-db.json
프롬프트: engines/prompts/dream-prompt.js
알고리즘: Jaro-Winkler 유사도
```

#### 7.2 꿈 데이터베이스
**점검 파일**: `engines/data/dream-db.json`

- [ ] 꿈 데이터 개수 (최소 200개 이상)
- [ ] 데이터 구조:
  ```json
  {
    "keyword": "뱀",
    "category": "동물",
    "meaning": "전통 해석...",
    "detailed": "상세 해석..."
  }
  ```
- [ ] 한글 키워드 정확성
- [ ] 카테고리 분류 (동물, 자연, 사물, 행동 등)

#### 7.3 검색 알고리즘
- [ ] Jaro-Winkler 유사도 사용
- [ ] 라이브러리: `string-similarity`
- [ ] 유사도 임계값 (예: 0.7 이상)
- [ ] Top N 결과 반환 (예: 5개)

**테스트 케이스**:
```
검색어: "뱀" → "뱀", "뱀을 보다", "뱀에게 물리다" (유사도 높은 순)
검색어: "물" → "물", "물에 빠지다", "물을 마시다"
```

#### 7.4 AI 해석
- [ ] Claude AI 추가 해석
- [ ] 프롬프트 품질
- [ ] 전통 해석 + 현대 심리학적 해석

#### 7.5 UI/UX
- [ ] 키워드 입력 필드
- [ ] 자동완성 (선택)
- [ ] 검색 결과 목록
- [ ] 유사도 표시
- [ ] 결과 없을 때 안내

### 발견사항

#### 데이터베이스 품질
> 꿈 데이터 부족, 오류 등

#### 검색 정확도
> 유사도 알고리즘 문제

#### AI 해석 품질
> 프롬프트 개선 필요

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 7 완료

---

## 체크포인트 8: 프론트엔드 - 별자리 운세

**목적**: 별자리 운세 기능 코드 정확도 및 의도 검증

### 점검 항목

#### 8.1 파일 기본 정보
```
파일: frontend/pages/horoscope.html
연결 API: POST /api/horoscope
백엔드 엔진: engines/core/horoscope-engine.js
데이터: engines/data/horoscope.json
프롬프트: engines/prompts/horoscope-prompt.js
```

#### 8.2 별자리 계산
**점검 파일**: `engines/utils/zodiac-calculator.js`

- [ ] 생년월일 → 별자리 자동 계산
- [ ] 12개 별자리:
  - [ ] 양자리 (3/21~4/19)
  - [ ] 황소자리 (4/20~5/20)
  - [ ] 쌍둥이자리 (5/21~6/21)
  - [ ] 게자리 (6/22~7/22)
  - [ ] 사자자리 (7/23~8/22)
  - [ ] 처녀자리 (8/23~9/22)
  - [ ] 천칭자리 (9/23~10/22)
  - [ ] 전갈자리 (10/23~11/22)
  - [ ] 사수자리 (11/23~12/21)
  - [ ] 염소자리 (12/22~1/19)
  - [ ] 물병자리 (1/20~2/18)
  - [ ] 물고기자리 (2/19~3/20)

**경계일 테스트**:
```
3월 21일 → 양자리 (정확한가?)
4월 19일 → 양자리
4월 20일 → 황소자리
```

#### 8.3 별자리 특성 데이터
**점검 파일**: `engines/data/horoscope.json`

- [ ] 12개 별자리 모두 존재
- [ ] 데이터 구조:
  ```json
  {
    "sign": "aries",
    "name": "양자리",
    "element": "fire",
    "traits": ["열정적", "용감한"],
    "lucky_color": "빨강",
    "lucky_number": 9
  }
  ```

#### 8.4 운세 종류
- [ ] 오늘의 운세
- [ ] 이번 주 운세
- [ ] 이번 달 운세
- [ ] 올해 운세 (선택)

#### 8.5 AI 해석
- [ ] Claude API 호출
- [ ] 별자리 특성 반영
- [ ] 자연스러운 한국어

### 발견사항

#### 별자리 계산 오류
> 경계일 처리 오류

#### 데이터 품질
> 특성, 색상 등 정확도

#### AI 해석 품질
> 프롬프트 개선 필요

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 8 완료

---

## 체크포인트 9: 프론트엔드 - 로또 번호

**목적**: 로또 번호 생성 기능 점검

### 점검 항목

#### 9.1 파일 기본 정보
```
파일: frontend/pages/lotto.html
특징: API 불필요 (프론트엔드에서 완결)
선택 엔진: engines/core/lotto-engine.js (통계 기반, 선택 기능)
```

#### 9.2 기본 로또 생성
- [ ] 1~45 범위
- [ ] 6개 숫자
- [ ] 중복 없음
- [ ] 오름차순 정렬
- [ ] 매번 다른 번호 (랜덤)

**테스트**: 10번 생성 → 모두 다른 번호?

#### 9.3 UI/UX
- [ ] [행운의 번호 생성] 버튼
- [ ] 여러 세트 생성 (1~5세트)
- [ ] 결과 표시 (큰 글씨, 보기 쉽게)
- [ ] 다시 생성 버튼

#### 9.4 이용권 시스템
- [ ] **중요**: 로또는 이용권 불필요 (무료)
- [ ] 이용권 확인 안 함
- [ ] 무제한 생성 가능

#### 9.5 통계 기반 생성 (선택 기능)
- [ ] 최근 당첨 번호 통계
- [ ] 자주 나온 번호
- [ ] 드문 번호
- [ ] 연속 번호 회피 등

### 발견사항

#### 로직 문제
> 중복, 범위 오류 등

#### UI/UX 문제
> 표시, 사용성 등

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 9 완료

---

## 체크포인트 10: 프론트엔드 - 궁합 보기

**목적**: 궁합 보기 기능 코드 정확도 및 의도 검증

### 점검 항목

#### 10.1 파일 기본 정보
```
파일: frontend/pages/compatibility-test.html
연결 API: POST /api/compatibility
백엔드 엔진: engines/core/compatibility-engine.js
프롬프트: engines/prompts/compatibility-prompt.js
```

#### 10.2 입력 폼
- [ ] 나의 정보:
  - [ ] 생년월일
  - [ ] 시간
  - [ ] 성별
- [ ] 상대 정보:
  - [ ] 생년월일
  - [ ] 시간
  - [ ] 성별

#### 10.3 API 요청 구조
```json
{
  "person1": {
    "year": 1990,
    "month": 1,
    "day": 1,
    "hour": 12,
    "gender": "남자"
  },
  "person2": {
    "year": 1992,
    "month": 5,
    "day": 15,
    "hour": 14,
    "gender": "여자"
  }
}
```

#### 10.4 궁합 계산 로직
**점검 파일**: `engines/core/compatibility-engine.js`

- [ ] 양쪽 사주 계산 (saju-calculator 사용)
- [ ] 오행 궁합 분석
- [ ] 십성 궁합 분석
- [ ] 띠 궁합 분석
- [ ] 종합 점수 (0~100%)

#### 10.5 띠 궁합
**점검 파일**: `engines/data/zodiac-animals.json`

- [ ] 12띠 데이터:
  - [ ] 쥐, 소, 호랑이, 토끼, 용, 뱀
  - [ ] 말, 양, 원숭이, 닭, 개, 돼지
- [ ] 띠별 궁합표
- [ ] 상극, 상생 관계

#### 10.6 결과 표시
- [ ] 나의 사주
- [ ] 상대 사주
- [ ] 오행 궁합 점수
- [ ] 띠 궁합 점수
- [ ] 종합 점수
- [ ] Claude AI 해석
- [ ] 조언 및 제안

### 발견사항

#### 궁합 계산 정확도
> 알고리즘 오류

#### 점수 산정
> 점수 계산 로직 문제

#### AI 해석 품질
> 프롬프트 개선 필요

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 10 완료

---

## 체크포인트 11: 백엔드 엔진 점검

**목적**: 백엔드 엔진 파일들의 코드 품질 및 정확도 검증

### 점검 항목

#### 11.1 엔진 파일 목록
```
engines/core/
├── daily-engine.js (오늘의 운세)
├── tarot-engine.js (타로)
├── saju-engine.js (사주 메인)
├── saju-engine-extended.js (사주 확장)
├── tojeong-engine.js (토정비결)
├── dream-engine.js (꿈)
├── horoscope-engine.js (별자리)
├── compatibility-engine.js (궁합)
└── lotto-engine.js (로또, 선택)
```

#### 11.2 각 엔진별 점검

**daily-engine.js**:
- [ ] saju-calculator 사용 여부
- [ ] 오행 분석 정확성
- [ ] Claude API 호출
- [ ] 에러 처리

**tarot-engine.js**:
- [ ] tarot-cards-complete.json 로드
- [ ] 카드 선택 로직
- [ ] 정방향/역방향 처리
- [ ] Claude API 호출

**saju-engine.js**:
- [ ] saju-calculator 사용 ⭐
- [ ] 십성 계산
- [ ] 오행 분석
- [ ] Claude API 호출
- [ ] 카테고리별 처리

**saju-engine-extended.js**:
- [ ] 대운 계산 (daeun-calculator)
- [ ] 신살 계산 (sinsal-calculator)
- [ ] 강약 분석 (strength-calculator)
- [ ] 용신 파악 (yongsin-finder)

**tojeong-engine.js**:
- [ ] lunar-javascript 사용
- [ ] 144괘 데이터 로드
- [ ] 괘 선택 로직
- [ ] Claude API 호출

**dream-engine.js**:
- [ ] dream-db.json 로드
- [ ] Jaro-Winkler 유사도
- [ ] Top N 검색
- [ ] Claude API 호출

**horoscope-engine.js**:
- [ ] zodiac-calculator 사용
- [ ] horoscope.json 로드
- [ ] Claude API 호출

**compatibility-engine.js**:
- [ ] 양쪽 saju-calculator 호출
- [ ] 오행 궁합 계산
- [ ] 띠 궁합 계산
- [ ] 종합 점수 산정
- [ ] Claude API 호출

#### 11.3 공통 점검 사항
- [ ] try-catch 에러 처리
- [ ] 입력 검증 (필수 필드)
- [ ] Claude API 키 확인
- [ ] 응답 형식 통일:
  ```json
  {
    "success": true/false,
    "data": {...},
    "error": "..." (실패 시)
  }
  ```

#### 11.4 코드 품질
- [ ] 주석 적절성
- [ ] 함수 분리
- [ ] 매직 넘버 상수화
- [ ] 중복 코드 최소화

### 발견사항

#### 로직 오류
> 알고리즘 문제

#### 코드 중복
> 여러 엔진에서 중복되는 코드

#### 에러 처리 부족
> try-catch 누락

#### Claude API 문제
> API 호출 오류, 프롬프트 문제

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 11 완료

---

## 체크포인트 12: API 라우터 점검

**목적**: server.js 및 API 라우터 점검

### 점검 항목

#### 12.1 server.js 기본 구조
- [ ] Express 앱 생성
- [ ] 포트 설정 (process.env.PORT)
- [ ] CORS 설정
- [ ] body-parser (JSON)
- [ ] Rate Limiting
- [ ] IP 이용권 미들웨어

#### 12.2 API 엔드포인트 매핑
- [ ] POST `/api/daily-fortune` → daily-engine.js
- [ ] POST `/api/tarot` → tarot-engine.js
- [ ] POST `/api/saju` → saju-engine.js
- [ ] POST `/api/tojeong` → tojeong-engine.js
- [ ] POST `/api/dream` → dream-engine.js
- [ ] POST `/api/horoscope` → horoscope-engine.js
- [ ] POST `/api/compatibility` → compatibility-engine.js
- [ ] POST `/api/lotto` → lotto-engine.js (선택)

#### 12.3 이용권 API
- [ ] POST `/api/tickets/charge` (충전)
- [ ] GET `/api/tickets/check` (조회)

#### 12.4 관리자 API
- [ ] POST `/api/admin/login` (로그인)
- [ ] GET `/api/admin/stats/today` (통계)
- [ ] GET `/api/admin/stats/visitors`
- [ ] GET `/api/admin/stats/coupang`
- [ ] GET `/api/admin/stats/features`
- [ ] GET `/api/admin/settings/coupang-link`
- [ ] PUT `/api/admin/settings/coupang-link`

#### 12.5 미들웨어 적용
- [ ] Rate Limiting: 모든 API
- [ ] IP 이용권 체크: Claude API 사용하는 7개
  - [ ] /api/daily-fortune ✓
  - [ ] /api/tarot ✓
  - [ ] /api/saju ✓
  - [ ] /api/tojeong ✓
  - [ ] /api/dream ✓
  - [ ] /api/horoscope ✓
  - [ ] /api/compatibility ✓
- [ ] JWT 인증: 관리자 API

#### 12.6 에러 처리
- [ ] 글로벌 에러 핸들러
- [ ] 404 핸들러
- [ ] 500 핸들러

#### 12.7 정적 파일 제공
- [ ] `/` → `frontend/index.html`
- [ ] `/pages/*` → `frontend/pages/*`
- [ ] `/admin/*` → `frontend/admin/*`
- [ ] `/images/*` → 이미지 폴더

### 발견사항

#### 라우팅 오류
> 엔드포인트 불일치

#### 미들웨어 문제
> 적용 순서, 누락 등

#### 에러 처리 부족
> 핸들러 누락

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 12 완료

---

## 체크포인트 13: 데이터 정확도 검증

**목적**: 핵심 데이터 파일들의 정확도 검증

### 점검 항목

#### 13.1 60갑자 데이터
**파일**: `engines/data/ganzi-60.json`

**수동 검증**:
```
갑자(0) → 을축(1) → 병인(2) → ... → 계해(59)
```

- [ ] 60개 모두 존재
- [ ] 순서 정확
- [ ] 천간 10개 반복 (갑을병정무기경신임계)
- [ ] 지지 12개 반복 (자축인묘진사오미신유술해)
- [ ] 오행 정확

**샘플 검증**:
```json
{
  "index": 0,
  "ganzi": "갑자",
  "gan": "갑",
  "ji": "자",
  "ganElement": "목",
  "jiElement": "수"
}
```

#### 13.2 오행 데이터
**파일**: `engines/data/five-elements.json`

- [ ] 5개 오행 (목화토금수)
- [ ] 상생 관계 정확
- [ ] 상극 관계 정확
- [ ] 계절별 왕상휴수사

#### 13.3 십성 데이터
**파일**: `engines/data/ten-stars-data.json`

- [ ] 10개 십성
- [ ] 한자 표기
- [ ] 의미 설명
- [ ] 길흉 구분

#### 13.4 타로 카드 데이터
**파일**: `engines/data/tarot-cards-complete.json`

- [ ] 78장 (메이저 22 + 마이너 56)
- [ ] 메이저 아르카나:
  - [ ] 0번 바보부터 21번 세계까지
- [ ] 마이너 아르카나:
  - [ ] 완드(Wands) 14장
  - [ ] 컵(Cups) 14장
  - [ ] 소드(Swords) 14장
  - [ ] 펜타클(Pentacles) 14장
- [ ] 각 슈트: 에이스~10, 페이지, 나이트, 퀸, 킹
- [ ] 이미지 경로 정확

#### 13.5 토정비결 144괘
**파일**: `engines/data/tojeong-gua-144.json`

- [ ] 144개 괘 모두 존재
- [ ] 괘 번호 1~144
- [ ] 제목(한자)
- [ ] 원문
- [ ] 해석

#### 13.6 꿈 데이터베이스
**파일**: `engines/data/dream-db.json`

- [ ] 최소 200개 이상
- [ ] 키워드 중복 없음
- [ ] 카테고리 분류
- [ ] 의미 설명

#### 13.7 별자리 데이터
**파일**: `engines/data/horoscope.json`

- [ ] 12개 별자리
- [ ] 날짜 범위 정확
- [ ] 원소 (화/지/풍/수)
- [ ] 특성 설명

#### 13.8 띠 데이터
**파일**: `engines/data/zodiac-animals.json`

- [ ] 12띠
- [ ] 궁합 관계
- [ ] 특성 설명

### 발견사항

#### 데이터 오류
> 오타, 누락, 중복 등

#### 형식 오류
> JSON 구조 문제

#### 내용 부정확
> 의미, 해석 오류

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 13 완료

---

## 체크포인트 14: 이용권 시스템

**목적**: 이용권 시스템 전반 점검

### 점검 항목

#### 14.1 프론트엔드 - ticket-system.js
**파일**: `frontend/utils/ticket-system.js`

- [ ] localStorage 사용
- [ ] 키: `fortune_tickets`
- [ ] 데이터 구조:
  ```json
  {
    "date": "2025-01-09",
    "count": 2,
    "charged": true
  }
  ```

**주요 함수**:
- [ ] `getTodayString()` - 오늘 날짜
- [ ] `loadTickets()` - 이용권 로드
- [ ] `hasTickets()` - 이용권 있는지 확인
- [ ] `useTicket()` - 이용권 사용
- [ ] `chargeTickets()` - 이용권 충전 (2개)
- [ ] `checkMasterMode()` - 마스터 모드 확인 (?unlock=cooal)

#### 14.2 백엔드 - ticket-check.js
**파일**: `backend/middleware/ticket-check.js`

**IP 기반 이용권 시스템**:
- [ ] Map 사용 (메모리 저장)
- [ ] IP 주소 추출 함수
- [ ] 이용권 검증 미들웨어
- [ ] 이용권 소모 함수
- [ ] 자정 자동 초기화 스케줄러

**주요 함수**:
- [ ] `getClientIP(req)` - IP 추출
- [ ] `checkTicketMiddleware` - 미들웨어
- [ ] `useTicket(req, featureName)` - 이용권 소모
- [ ] `chargeTicketsEndpoint` - 충전 API
- [ ] `getTicketsEndpoint` - 조회 API
- [ ] `startAutoCleanup()` - 자정 초기화

#### 14.3 이용권 시스템 통합
- [ ] 7개 기능에 적용:
  - [ ] 오늘의 운세
  - [ ] 타로 카드
  - [ ] 사주팔자
  - [ ] 토정비결
  - [ ] 꿈 해몽
  - [ ] 별자리 운세
  - [ ] 궁합 보기
- [ ] 로또는 제외 (무료)

#### 14.4 쿠팡 게이트
**파일**: `frontend/pages/coupang-gate.html`

- [ ] 쿠팡 파트너스 링크
- [ ] [이용권 충전하기] 버튼
- [ ] 충전 API 호출
- [ ] 충전 성공 메시지

#### 14.5 마스터 모드
- [ ] URL 파라미터: `?unlock=cooal`
- [ ] 헤더: `X-Master-Code: cooal`
- [ ] 환경 변수: `MASTER_CODE`
- [ ] 무제한 사용 가능
- [ ] 서버 로그 기록

### 발견사항

#### localStorage 조작 방어
> 프론트엔드 조작해도 백엔드에서 차단되는가?

#### IP 기반 시스템
> IP 추출, 검증, 소모 로직 정확한가?

#### 자정 초기화
> 스케줄러 작동하는가?

#### 통합 문제
> 일부 기능에서 이용권 체크 누락?

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 14 완료

---

## 체크포인트 15: 관리자 시스템

**목적**: 관리자 시스템 전반 점검

### 점검 항목

#### 15.1 로그인 페이지
**파일**: `frontend/admin/login.html`

- [ ] ID/PW 입력 폼
- [ ] 기본 계정: cooal / dkssud11@@
- [ ] API 호출: POST `/api/admin/login`
- [ ] JWT 토큰 저장 (localStorage: `adminToken`)
- [ ] 자동 대시보드 이동

#### 15.2 대시보드
**파일**: `frontend/admin/dashboard.html`

**기능**:
- [ ] 실시간 통계 (5초 자동 갱신)
  - [ ] 오늘 방문자
  - [ ] 오늘 클릭
  - [ ] 오늘 이용권 사용
  - [ ] 전일 대비 증감률
- [ ] 누적 통계
  - [ ] 총 방문자
  - [ ] 총 클릭
- [ ] 방문자 추이 차트 (7일)
- [ ] 시간대별 방문 차트
- [ ] 기능별 이용권 사용 통계
- [ ] 쿠팡 링크 수정 기능
- [ ] 로그아웃

#### 15.3 백엔드 API
**파일**: `backend/routes/admin.js`

**엔드포인트**:
- [ ] POST `/api/admin/login` - 로그인
- [ ] GET `/api/admin/stats/today` - 오늘 통계
- [ ] GET `/api/admin/stats/visitors` - 방문자 통계
- [ ] GET `/api/admin/stats/coupang` - 쿠팡 클릭
- [ ] GET `/api/admin/stats/features` - 기능별 통계
- [ ] GET `/api/admin/settings/coupang-link` - 링크 조회
- [ ] PUT `/api/admin/settings/coupang-link` - 링크 수정
- [ ] GET `/api/admin/export` - CSV 내보내기

#### 15.4 인증 미들웨어
**파일**: `backend/middleware/auth.js`

- [ ] JWT 토큰 검증
- [ ] Authorization 헤더 확인
- [ ] Bearer 토큰 추출
- [ ] 만료 시간 확인

#### 15.5 MongoDB 컬렉션
- [ ] `admin_users` - 관리자 계정
- [ ] `admin_settings` - 시스템 설정
- [ ] `analytics_visitors` - 방문자 기록
- [ ] `analytics_coupang_clicks` - 쿠팡 클릭
- [ ] `analytics_ticket_usage` - 이용권 사용

#### 15.6 초기화 스크립트
**파일**: `backend/scripts/init-admin.js`

- [ ] 관리자 계정 생성
- [ ] 비밀번호 bcrypt 해싱
- [ ] 초기 설정 저장
- [ ] 인덱스 생성

### 발견사항

#### 인증 문제
> JWT, bcrypt 등

#### 통계 정확도
> 집계 로직 오류

#### UI/UX 문제
> 대시보드 표시 오류

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 15 완료

---

## 체크포인트 16: 에러 처리

**목적**: 전반적인 에러 처리 점검

### 점검 항목

#### 16.1 프론트엔드 에러 처리
- [ ] try-catch 블록 사용
- [ ] fetch 에러 처리
- [ ] 사용자 친화적 메시지
- [ ] 에러 로깅 (console.error)

**체크할 파일**:
- 모든 `*-test.html` 파일
- `ticket-system.js`

#### 16.2 백엔드 에러 처리
- [ ] try-catch 블록
- [ ] 입력 검증 (필수 필드)
- [ ] 에러 응답 형식 통일:
  ```json
  {
    "success": false,
    "error": "에러 메시지"
  }
  ```
- [ ] HTTP 상태 코드 적절
  - [ ] 400 (Bad Request)
  - [ ] 401 (Unauthorized)
  - [ ] 403 (Forbidden)
  - [ ] 404 (Not Found)
  - [ ] 500 (Internal Server Error)

**체크할 파일**:
- `server.js`
- 모든 `engines/core/*-engine.js`

#### 16.3 글로벌 에러 핸들러
**파일**: `server.js`

- [ ] 404 핸들러
- [ ] 500 핸들러
- [ ] 에러 로깅

#### 16.4 Claude API 에러 처리
- [ ] API 키 없음
- [ ] 할당량 초과
- [ ] 네트워크 에러
- [ ] 타임아웃
- [ ] 응답 파싱 에러

### 발견사항

#### 에러 처리 누락
> try-catch 없는 부분

#### 에러 메시지 불친절
> 기술적 용어 사용

#### 로깅 부족
> 에러 로그 미기록

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 16 완료

---

## 체크포인트 17: 성능 및 최적화

**목적**: 성능 이슈 및 최적화 가능 부분 점검

### 점검 항목

#### 17.1 로딩 시간
- [ ] 메인 페이지 로딩 (< 2초)
- [ ] 기능 페이지 로딩 (< 2초)
- [ ] API 응답 시간 (< 5초)
- [ ] Claude API 응답 (3~8초 예상)

#### 17.2 캐싱
- [ ] Claude API 응답 캐싱 (선택)
- [ ] 사주 계산 결과 캐싱 (선택)
- [ ] 정적 파일 캐싱 (브라우저)

#### 17.3 코드 최적화
- [ ] 중복 코드 제거
- [ ] 불필요한 계산 제거
- [ ] 비동기 처리 (async/await)

#### 17.4 메모리 사용
- [ ] IP 이용권 Map 크기 (1000명 = 100KB)
- [ ] 자정 초기화로 메모리 정리
- [ ] 메모리 누수 없음

#### 17.5 Rate Limiting
- [ ] 15분당 10,000회 (현재 설정)
- [ ] 너무 높거나 낮은지 검토

### 발견사항

#### 성능 병목
> 느린 부분

#### 최적화 가능
> 개선 가능한 부분

#### 메모리 문제
> 메모리 누수, 과다 사용

#### 기타 발견사항
> 기타 문제점

### 완료 여부
- [ ] 체크포인트 17 완료

---

## 체크포인트 18: 최종 종합 보고서

**목적**: 전체 점검 결과 종합 및 배포 준비

### 종합 통계

```
체크포인트 완료: __/18 (___%)

✅ 완료: __개
⚠️  경고: __개
❌ 실패: __개
```

### 발견사항 요약

#### 🔴 치명적 (Critical) - 즉시 수정 필요
> 배포 전 반드시 수정해야 할 문제

1. 
2. 
3. 

#### 🟠 높음 (High) - 우선 수정 권장
> 배포 후 빠르게 수정해야 할 문제

1. 
2. 
3. 

#### 🟡 중간 (Medium) - 수정 권장
> 시간 날 때 수정하면 좋은 문제

1. 
2. 
3. 

#### 🟢 낮음 (Low) - 개선 제안
> 선택적으로 개선 가능한 부분

1. 
2. 
3. 

### 기능별 완성도

```
오늘의 운세: ___% (✓/⚠/✗)
타로 카드: ___% (✓/⚠/✗)
사주팔자: ___% (✓/⚠/✗) ⭐ 가장 중요
토정비결: ___% (✓/⚠/✗)
꿈 해몽: ___% (✓/⚠/✗)
별자리 운세: ___% (✓/⚠/✗)
로또 번호: ___% (✓/⚠/✗)
궁합 보기: ___% (✓/⚠/✗)

이용권 시스템: ___% (✓/⚠/✗)
관리자 시스템: ___% (✓/⚠/✗)
```

### 배포 준비 상태

- [ ] 모든 치명적 문제 해결
- [ ] 높음 우선순위 문제 해결 (또는 인지)
- [ ] 환경 변수 프로덕션 설정
- [ ] 보안 설정 완료
- [ ] 파일 정리 완료
- [ ] 테스트 완료
- [ ] 문서화 완료
- [ ] 백업 설정

### 배포 가능 여부

**판단 기준**:
- 🔴 치명적 0개 + 🟠 높음 < 5개 → ✅ 배포 가능
- 🔴 치명적 1개 이상 → ❌ 배포 불가
- 🟠 높음 5개 이상 → ⚠️ 신중히 검토

**최종 판정**: ___

### 다음 단계

**배포 가능 시**:
1. [ ] 프로덕션 환경 변수 설정
2. [ ] 서버 배포
3. [ ] DNS 설정
4. [ ] HTTPS 적용
5. [ ] 모니터링 시작

**배포 불가 시**:
1. [ ] 치명적 문제 수정
2. [ ] 높음 우선순위 문제 해결
3. [ ] 재점검
4. [ ] 배포 재시도

### 완료 여부
- [ ] 체크포인트 18 완료
- [ ] 전체 점검 완료

---

## 📝 점검 진행 방법

### Claude에게 명령하는 방법

**시작**:
```
"체크포인트 1 시작"
```

**Claude 작업**:
1. 해당 체크포인트의 모든 항목 점검
2. 파일 읽기, 코드 분석
3. 발견사항 기록 (수정 안함!)
4. 체크박스 표시
5. 완료 보고

**다음 단계**:
```
"체크포인트 2 시작"
```

**중간에 멈추려면**:
```
"일시 중지"
```

**재개**:
```
"체크포인트 N에서 계속"
```

### 진행 상황 저장

각 체크포인트 완료 시:
1. 이 문서 업데이트
2. 발견사항 기록
3. 체크박스 표시
4. Git commit (선택)

---

## 🎯 점검 완료 후

### 수정 우선순위 결정
1. 치명적 문제 목록 작성
2. 높음 우선순위 목록 작성
3. 수정 계획 수립

### 수정 진행
```
"[문제 이름] 수정해줘"
```

**예시**:
```
"사주 만년력 계산 오류 수정해줘"
"타로 카드 데이터 오타 수정해줘"
```

---

**작성일**: 2025-01-09  
**버전**: 1.0  
**상태**: 점검 준비 완료

**명령어**: "체크포인트 1 시작" 으로 점검 시작!