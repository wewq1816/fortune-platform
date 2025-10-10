# 작업 체크포인트 - Vercel + Render 분업

작업 시작일: 2025-01-11

---

## Checkpoint 1: Render 백엔드 설정 (15분)

시작 시간: ___:___

### 1-1. Render 대시보드 설정
- [ ] Render 대시보드 접속
- [ ] fortune-platform 서비스 선택
- [ ] Settings > Build & Deploy
- [ ] Root Directory: backend
- [ ] Build Command: npm install
- [ ] Start Command: node server.js
- [ ] Save Changes

### 1-2. CORS 설정
- [ ] backend/server.js 열기
- [ ] CORS 코드 추가 (아래 코드)
- [ ] UTF-8 인코딩 확인
- [ ] 이모지 없음 확인
- [ ] 파일 저장

```javascript
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

### 1-3. 환경 변수 확인
- [ ] MONGO_URL 있음
- [ ] CLAUDE_API_KEY 있음
- [ ] JWT_SECRET 있음
- [ ] MASTER_CODE 있음

### 1-4. 재배포
- [ ] Manual Deploy > Deploy latest commit
- [ ] 배포 완료 대기 (2-3분)
- [ ] Logs 확인 (에러 없음)

### 1-5. API 테스트
- [ ] PowerShell 실행
- [ ] 명령어 입력: `Invoke-WebRequest -Uri "https://fortune-platform.onrender.com/api/tickets/check"`
- [ ] Status 200 확인
- [ ] JSON 응답 확인

완료 시간: ___:___
소요 시간: ___ 분

---

## Checkpoint 2: 프론트엔드 코드 수정 (30분)

시작 시간: ___:___

### 2-1. API_URL 변수 추가 (8개 파일)

#### daily-fortune-test.html
- [ ] 파일 열기
- [ ] script 태그 내부에 API_URL 변수 추가
- [ ] fetch() 수정: `${API_URL}/api/daily-fortune`
- [ ] UTF-8 저장
- [ ] 이모지 없음 확인

#### tarot-mock.html
- [ ] 파일 열기
- [ ] script 태그 내부에 API_URL 변수 추가
- [ ] fetch() 수정: `${API_URL}/api/tarot`
- [ ] UTF-8 저장
- [ ] 이모지 없음 확인

#### saju-test.html
- [ ] saju-api-functions.js 열기
- [ ] API_URL 변수 추가
- [ ] fetch() 수정: `${API_URL}/api/saju`
- [ ] UTF-8 저장
- [ ] 이모지 없음 확인

#### tojeong-test.html
- [ ] 파일 열기
- [ ] API_URL 변수 추가
- [ ] fetch() 수정: `${API_URL}/api/tojeong`
- [ ] UTF-8 저장
- [ ] 이모지 없음 확인

#### dream.html
- [ ] 파일 열기
- [ ] API_URL 변수 추가
- [ ] fetch() 수정: `${API_URL}/api/dream/interpret`
- [ ] UTF-8 저장
- [ ] 이모지 없음 확인

#### horoscope.html
- [ ] 파일 열기
- [ ] API_URL 변수 추가
- [ ] fetch() 수정: `${API_URL}/api/horoscope`
- [ ] UTF-8 저장
- [ ] 이모지 없음 확인

#### compatibility-test.html
- [ ] 파일 열기
- [ ] API_URL 변수 추가
- [ ] fetch() 수정: `${API_URL}/api/compatibility`
- [ ] UTF-8 저장
- [ ] 이모지 없음 확인

#### ticket-system.js
- [ ] frontend/utils/ticket-system.js 열기
- [ ] API_URL 변수 추가
- [ ] charge fetch() 수정
- [ ] check fetch() 수정
- [ ] UTF-8 저장
- [ ] 이모지 없음 확인

### 2-2. 타로 이미지 경로 확인
- [ ] frontend/public/images/tarot/ 폴더 존재 확인
- [ ] 타로 카드 이미지 78장 확인
- [ ] tarot-mock.html에서 이미지 경로 확인

### 2-3. 인코딩 최종 확인
- [ ] 8개 HTML 파일 모두 UTF-8 (BOM 없음)
- [ ] ticket-system.js UTF-8 확인
- [ ] 모든 파일에 이모지 없음

완료 시간: ___:___
소요 시간: ___ 분

---

## Checkpoint 3: Vercel 배포 (10분)

시작 시간: ___:___

### 3-1. vercel.json 생성
- [ ] 프로젝트 루트에 vercel.json 파일 생성
- [ ] JSON 코드 복사 (가이드 문서 참조)
- [ ] 파일 저장

### 3-2. Git 커밋 및 푸시
- [ ] `git add .`
- [ ] `git commit -m "Vercel+Render separation: API URL updated"`
- [ ] `git push origin main`
- [ ] 푸시 성공 확인

### 3-3. Vercel 자동 배포
- [ ] Vercel 대시보드 접속
- [ ] fortune-platform 프로젝트 선택
- [ ] Deployments 탭
- [ ] 새 배포 진행 중 확인
- [ ] Build Logs 확인
- [ ] 배포 완료 대기 (2-3분)

### 3-4. 배포 URL 접속
- [ ] Visit 버튼 클릭
- [ ] https://fortune-platform.vercel.app 접속
- [ ] 메인 페이지 로딩 확인

완료 시간: ___:___
소요 시간: ___ 분

---

## Checkpoint 4: 테스트 (10분)

시작 시간: ___:___

### 4-1. 프론트엔드 로딩
- [ ] https://fortune-platform.vercel.app 접속
- [ ] 메인 페이지 표시
- [ ] 8개 메뉴 표시
- [ ] CSS 스타일 적용
- [ ] F12 > Console: 에러 없음
- [ ] Console: "API URL: https://fortune-platform.onrender.com" 출력

### 4-2. 타로 이미지 확인
- [ ] 타로 카드 메뉴 클릭
- [ ] 78장 카드 이미지 로딩
- [ ] 이미지 깨짐 없음
- [ ] Network 탭: 이미지 Status 200

### 4-3. 이용권 시스템
- [ ] 쿠팡 게이트 방문
- [ ] "충전하기" 클릭
- [ ] Network 탭: https://fortune-platform.onrender.com/api/tickets/charge
- [ ] Status 200 확인
- [ ] 알림창: "이용권 2개가 충전되었습니다!"

### 4-4. 사주팔자 API
- [ ] 사주팔자 메뉴 클릭
- [ ] 생년월일 입력 (1990-01-01, 12시, 남자)
- [ ] "확인" 클릭
- [ ] Network 탭: https://fortune-platform.onrender.com/api/saju
- [ ] Status 200 확인
- [ ] 사주 결과 표시

### 4-5. CORS 확인
- [ ] F12 > Console 탭
- [ ] CORS 에러 없음
- [ ] API 호출 모두 성공

### 4-6. 전체 기능 테스트
- [ ] 오늘의 운세 작동
- [ ] 타로 카드 작동
- [ ] 사주팔자 작동
- [ ] 토정비결 작동
- [ ] 꿈 해몽 작동
- [ ] 별자리 운세 작동
- [ ] 궁합 보기 작동
- [ ] 로또 번호 작동

완료 시간: ___:___
소요 시간: ___ 분

---

## 최종 확인

### 배포 완료
- [ ] Vercel: 프론트엔드만 배포
- [ ] Render: 백엔드만 배포
- [ ] API 연결 정상

### 성공 기준
- [ ] 타로 이미지 완벽 표시
- [ ] 모든 API 호출 성공
- [ ] CORS 에러 없음
- [ ] 8개 기능 모두 작동

### URL 정보
```
메인 URL: https://fortune-platform.vercel.app
API URL: https://fortune-platform.onrender.com (내부 사용)
```

---

## 문제 발생 시

### 타로 이미지 안 보임
1. frontend/public/images/tarot/ 폴더 확인
2. vercel.json routes 확인
3. 이미지 경로 확인

### CORS 에러
1. backend/server.js CORS 설정 확인
2. Render 재배포
3. Vercel 도메인 확인

### API 404
1. API_URL 콘솔 출력 확인
2. Render 서버 상태 확인
3. Render 로그 확인

### 한글 깨짐
1. UTF-8 인코딩 확인
2. HTML meta charset 확인
3. 이모지 제거

---

## 작업 완료 서명

작업 시작: _____년 __월 __일 __:__
작업 완료: _____년 __월 __일 __:__
총 소요 시간: ____ 시간 ____ 분

작업자: ________________
확인자: ________________

최종 상태:
- [ ] 성공
- [ ] 부분 성공 (문제 사항: _________________)
- [ ] 실패 (원인: _________________)

---

다음 단계:
- [ ] 모니터링 설정
- [ ] 성능 측정
- [ ] 사용자 피드백 수집
- [ ] 문서 업데이트
