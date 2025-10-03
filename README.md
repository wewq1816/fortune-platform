# 운세 플랫폼 프로젝트

## 프로젝트 개요
자체 운세 엔진 + AI 번역가 모델로 저비용 고품질 운세 서비스 구축

**핵심 아키텍처**: Engine + AI Translator
- 엔진: 정확한 사주/오행 계산 (무료)
- AI: 계산 결과를 자연어로 번역 (저비용)

---

## 현재 구현 상태

### ✅ 완료된 엔진 (4개)
- [x] **로또 번호 생성기** (lotto-engine.js)
  - 해시 기반 재현 가능한 번호 생성
  
- [x] **오늘의 운세** (daily-engine.js)
  - 사주 8글자 기반 정통 운세
  - 오행 상생상극 계산 (25가지 조합)
  - Claude API 연동 (6가지 운세 생성)
  
- [x] **별자리 운세** (horoscope-engine.js)
  - 12별자리 자동 판별
  - 날짜 기반 운세 계산

- [x] **사주 8글자 시스템** (saju-calculator.js)
  - 생년월일시 → 8글자 간지 계산
  - 일간 추출 및 오행 분석

### ⬜ 구현 예정 엔진 (4개)
- [ ] **사주팔자 상세** (saju-engine.js)
  - 용신/희신/기신 분석
  - 신강/신약 판단
  - 대운 계산

- [ ] **타로 카드** (tarot-engine.js)
  - 78장 타로 카드 데이터
  - 5장 선택 시스템 (사용자 1장 + 자동 4장)

- [ ] **토정비결** (tojeong-engine.js)
  - 과수 계산
  - 12개월 운세

- [ ] **궁합** (compatibility-engine.js)
  - 두 사주 비교
  - 상생상극 분석

---

## 폴더 구조

```
운세플랫폼/
├── engines/
│   ├── core/           # 7개 엔진 파일
│   ├── data/           # JSON 데이터 파일
│   ├── prompts/        # Claude 프롬프트
│   └── utils/          # 유틸리티 함수
│
├── frontend/           # React 프론트엔드
├── backend/            # Firebase Functions (예정)
├── tests/              # 테스트 파일
├── server.js           # Express 개발 서버
└── README.md           # 현재 문서
```

---

## 개발 서버 실행

```bash
# 서버 시작
cd C:\xampp\htdocs\mysite\운세플랫폼
node server.js

# 접속
http://localhost:3000
```

---

## 테스트 방법

```bash
# 엔진 테스트
node tests/engine-test.js

# 사주 계산 테스트
node tests/test-saju-calculator.js

# 오늘의 운세 테스트
node tests/test-daily-engine-updated.js

# Claude API 연동 테스트
node tests/test-claude-api-daily-fortune.js
```

---

## API 엔드포인트

### 오늘의 운세
```
POST /api/daily-fortune

Request:
{
  "year": 1990,
  "month": 5,
  "day": 15,
  "hour": 14,
  "isLunar": false
}

Response:
{
  "success": true,
  "saju": { ... },
  "today": { ... },
  "relationship": "상생",
  "score": 95,
  "level": "대길",
  "fortune": {
    "총운": "...",
    "애정운": "...",
    "금전운": "...",
    "건강운": "...",
    "가정운": "...",
    "여행운": "..."
  },
  "cost": "0.002"
}
```

---

## 주요 기술 스택

- **백엔드**: Node.js + Express
- **AI**: Claude 3 Haiku
- **프론트엔드**: React (예정)
- **배포**: Vercel + Firebase Functions (예정)

---

## 개발 일정

### Phase 1: 엔진 구축 (Week 1-4) - **60% 완료**
- [x] Week 1-2: 기본 엔진 구축
- [x] Week 2: 오늘의 운세 시스템 완성
- [ ] Week 3: 타로 카드 시스템
- [ ] Week 4: 토정비결 & 궁합

### Phase 2: AI 연동 (Week 5-6) - **대기 중**
- [ ] Week 5: Claude API 최적화
- [ ] Week 6: 프론트엔드 UI 구현

### Phase 3: 배포 (Week 7-8) - **대기 중**
- [ ] Week 7: 캐싱 시스템
- [ ] Week 8: 최종 배포

---

## 최근 업데이트 (2025-01-02)

### ✅ 코드 정리
- 불필요한 "무료 버전" 코드 삭제
- 사주 8글자 기반 단일 버전으로 통일
- 코드 간결화 완료

### ✅ 오늘의 운세 시스템 완성
- 60갑자 일진 계산
- 오행 상생상극 25가지 조합
- Claude API 연동 (6가지 운세)

---

## 다음 단계

1. **타로 카드 78장 데이터 생성**
   - 메이저 아르카나 22장
   - 마이너 아르카나 56장

2. **타로 5장 선택 시스템 구현**
   - 사용자 1장 선택
   - 자동 4장 뽑기
   - 정/역방향 결정

3. **토정비결 엔진 구현**
   - 과수 데이터 수집
   - 12개월 운세 계산

---

## 참고 문서

- `docs/CHECKPOINT_현재상황.md` - 상세 진행 상황
- `docs/운세_플랫폼_폴더구조.md` - 전체 폴더 구조 (메인 docs)
- `README_SAJU_SYSTEM.md` - 사주 시스템 설명

---

**📌 프로젝트 루트**: `C:\xampp\htdocs\mysite\운세플랫폼\`
