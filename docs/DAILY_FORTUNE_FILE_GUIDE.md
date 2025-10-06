# 오늘의 운세 파일 정리 가이드

생성일: 2025-01-05
목적: 실제 사용 파일과 불필요 파일 구분

---

## 실제 사용 파일 (유지 필수)

### 엔진
1. engines/core/daily-engine.js
   - 역할: 오늘의 운세 계산 엔진
   - 상태: 2025-01-05 수정 완료 (월건법, 시간변환 적용)
   - 사용처: server.js API

2. engines/prompts/daily-fortune-prompt.js
   - 역할: Claude API 프롬프트 생성
   - 상태: 정상 (수정 불필요)
   - 사용처: server.js API

### 프론트엔드
3. frontend/pages/daily-fortune.html
   - 역할: 실제 사용 페이지 (실제 API 호출)
   - 상태: 정상
   - 특징: 백엔드 API 연동

4. frontend/pages/daily-fortune-test.html
   - 역할: 테스트 페이지 (Mock API 사용)
   - 상태: 정상
   - 특징: Mock 데이터로 빠른 테스트 가능
   - 용도: 개발/디버깅용

5. frontend/images/daily.png
   - 역할: 아이콘
   - 상태: 정상

---

## 테스트 파일 (유지 권장)

### tests/ 폴더 (나중에 필요할 수 있음)
1. tests/test-daily-engine-upgraded.js
   - 역할: 엔진 테스트
   - 삭제 가능 여부: 유지 권장 (검증용)

2. tests/test-daily-engine-updated.js
   - 역할: 엔진 테스트 (중복?)
   - 삭제 가능 여부: 확인 필요

3. tests/test-claude-api-daily-fortune.js
   - 역할: Claude API 연동 테스트
   - 삭제 가능 여부: 유지 권장

---

## 중복 파일 (삭제 후보)

1. frontend/test-daily-fortune.html
   - 역할: 테스트 페이지 (중복)
   - 삭제 이유: daily-fortune-test.html과 중복
   - 확인 필요: 내용 비교 후 삭제

---

## 수정 내역

### 2025-01-05 수정
- engines/core/daily-engine.js
  - SajuEngine 클래스 사용으로 변경
  - minute 파라미터 지원 추가
  - 정확한 사주 계산 적용

---

## 의존성 구조

```
daily-fortune.html (실제 사용)
    |
    v
server.js API (/api/daily-fortune)
    |
    v
daily-engine.js
    |
    +-- SajuEngine (사주 계산)
    |       |
    |       +-- saju-calculator.js (수정됨)
    |
    +-- ganzi-calculator.js (일진)
    +-- element-calculator.js (오행)
    +-- daily-fortune-prompt.js (프롬프트)
```

---

## 프롬프트 수정 필요 여부

현재 프롬프트는 수정 불필요합니다.

이유:
- 사주 8글자 (saju.string) 사용
- 일간 (saju.ilgan) 사용  
- 오행 관계 (relationship) 사용
- 점수/등급 (score/level) 사용

수정된 엔진이 더 정확한 사주를 계산하므로,
프롬프트는 그대로 사용해도 더 좋은 결과가 나옵니다.

---

## 향후 작업

1. 중복 파일 확인 및 삭제
   - frontend/test-daily-fortune.html vs daily-fortune-test.html 비교
   - tests/ 폴더의 중복 테스트 파일 정리

2. 절기 계산 추가 (선택사항)
   - lunar-javascript 라이브러리 사용
   - 24절기 데이터 추가
   - 월주 계산 시 절입 시각 고려

---

## 결론

핵심 파일: 5개
- daily-engine.js (수정됨)
- daily-fortune-prompt.js
- daily-fortune.html
- daily-fortune-test.html  
- daily.png

테스트 파일: 3-4개 (유지 권장)
삭제 후보: 1개 (test-daily-fortune.html)
