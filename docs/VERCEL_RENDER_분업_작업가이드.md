1. 쿠팡 게이트 접속:
```
https://fortune-platform.vercel.app/pages/coupang-gate.html
```

2. [충전하기] 버튼 클릭

3. F12 -> Network 탭 확인:
```
Request URL: https://fortune-platform.onrender.com/api/tickets/charge
Method: POST
Status: 200 OK
Response: {"success": true, "tickets": 2, "message": "이용권 2개가 충전되었습니다"}
```

#### Step 7-2: 사주팔자 테스트

1. 사주팔자 페이지 접속:
```
https://fortune-platform.vercel.app/pages/saju-test.html
```

2. 생년월일 입력:
- 년: 1990
- 월: 1
- 일: 1
- 시: 12
- 성별: 남자

3. [확인] 버튼 클릭

4. Network 탭 확인:
```
Request URL: https://fortune-platform.onrender.com/api/saju
Method: POST
Status: 200 OK
Response Time: 3-5초 (Claude API 호출 시간)
```

5. Console 탭 확인:
```
[API] 사주팔자 분석 요청
[API] 사용 URL: https://fortune-platform.onrender.com
[API] 응답 상태: 200
```

주의: 이모지 없는 로그 확인

#### Step 7-3: 타로 카드 테스트

1. 타로 페이지에서 카드 5장 선택

2. [해석 보기] 클릭

3. Network 탭 확인:
```
Request URL: https://fortune-platform.onrender.com/api/tarot
Method: POST
Status: 200 OK
```

4. Console 탭 확인:
```
[API] 타로 카드 해석 요청
[API] 응답 상태: 200
```

#### Step 7-4: CORS 오류 확인

Console 탭에서 CORS 오류 없어야 함:

좋은 예:
```
(오류 없음)
[API] 호출 성공
```

나쁜 예:
```
Access-Control-Allow-Origin error
CORS policy blocked
```

CORS 오류 발생 시:
- backend/server.js의 CORS 설정 확인
- Vercel 도메인 정확히 입력했는지 확인
- Render 재배포

체크리스트:
- [ ] 이용권 충전 API 성공
- [ ] 사주팔자 API 성공
- [ ] 타로 카드 API 성공
- [ ] CORS 오류 없음
- [ ] Console 로그 정상 (이모지 없음)

---

### Phase 8: 전체 기능 테스트 (15분)

#### 테스트 목록

**1. 오늘의 운세**
- URL: /pages/daily-fortune-test.html
- 입력: 생년월일, 성별
- 확인: API 호출 성공, 결과 표시

**2. 타로 카드**
- URL: /pages/tarot-mock.html
- 확인: 이미지 78장 로딩, 카드 선택, API 호출

**3. 사주팔자**
- URL: /pages/saju-test.html
- 확인: 8개 카테고리, API 호출, 결과 표시

**4. 토정비결**
- URL: /pages/tojeong-test.html
- 확인: 음력 변환, API 호출

**5. 꿈 해몽**
- URL: /pages/dream.html
- 확인: 키워드 검색, AI 해석

**6. 별자리 운세**
- URL: /pages/horoscope.html
- 확인: 별자리 계산, 운세 표시

**7. 로또 번호**
- URL: /pages/lotto.html
- 확인: 번호 생성 (API 불필요, 프론트엔드 완결)

**8. 궁합 보기**
- URL: /pages/compatibility-test.html
- 확인: 두 사람 정보 입력, API 호출

체크리스트:
- [ ] 오늘의 운세 작동
- [ ] 타로 카드 작동 (이미지 포함)
- [ ] 사주팔자 작동
- [ ] 토정비결 작동
- [ ] 꿈 해몽 작동
- [ ] 별자리 운세 작동
- [ ] 로또 번호 작동
- [ ] 궁합 보기 작동

---

## 트러블슈팅

### 문제 1: 타로 이미지가 안 보임

원인:
- 이미지 경로 오류
- Vercel 배포 시 이미지 누락

해결:
1. frontend/public/images/tarot/ 폴더 확인
2. Git에 이미지 커밋 확인:
```bash
git status
git add frontend/public/images/tarot/
git commit -m "타로 이미지 추가"
git push
```

3. .gitignore 확인:
```
# 이미지는 제외되면 안 됨!
# *.jpg (이 줄이 있으면 삭제)
# *.png (이 줄이 있으면 삭제)
```

### 문제 2: API 호출 실패 (CORS)

증상:
```
Access-Control-Allow-Origin error
```

원인:
- Render의 CORS 설정 누락
- 도메인 오타

해결:
1. backend/server.js 확인:
```javascript
app.use(cors({
  origin: [
    'https://fortune-platform.vercel.app',  // 정확한 도메인
    'http://localhost:3000'
  ]
}));
```

2. Render 재배포

3. 브라우저 캐시 삭제 (Ctrl + Shift + Delete)

### 문제 3: API 응답 느림

증상:
- API 호출 10초 이상 소요
- Timeout 오류

원인:
- Render의 Cold Start (무료 플랜)
- Claude API 응답 지연

해결:
1. Render 유료 플랜 고려
2. 첫 API 호출은 느릴 수 있음 (정상)
3. 두 번째 호출부터 빠름 (1-3초)

### 문제 4: 인코딩 오류

증상:
```
한글이 깨져서 보임
물음표(?)로 표시됨
```

원인:
- UTF-8 인코딩 아님
- BOM 포함된 UTF-8

해결:
1. VS Code에서:
- 파일 열기
- 우측 하단 인코딩 클릭
- "UTF-8" 선택
- "Save with Encoding" 클릭

2. 모든 파일 재저장 (UTF-8 without BOM)

3. Git 커밋 및 푸시

### 문제 5: Vercel 빌드 실패

증상:
```
Build failed
Syntax error in vercel.json
```

원인:
- vercel.json 문법 오류
- JSON에 주석 포함
- 이모지 포함

해결:
1. vercel.json 문법 검사:
```bash
# JSON 유효성 검사 사이트
https://jsonlint.com/
```

2. 주석 제거 (JSON은 주석 불가)

3. 이모지 모두 제거

4. UTF-8 인코딩 확인

---

## 최종 체크리스트

### Render (백엔드)
- [ ] Root Directory: backend
- [ ] CORS 설정 추가 (이모지 없음)
- [ ] 환경 변수 설정 (.env)
- [ ] 배포 성공
- [ ] API 테스트 성공

### 프론트엔드 코드
- [ ] API_URL 변수 추가 (8개 파일)
- [ ] 모든 fetch() 주소 변경
- [ ] console.log 추가 (이모지 없음)
- [ ] UTF-8 인코딩 확인
- [ ] 이모지 완전 제거 확인

### Vercel (프론트엔드)
- [ ] vercel.json 생성 (이모지 없음)
- [ ] .vercelignore 생성
- [ ] 타로 이미지 78장 Git 커밋
- [ ] Git 푸시 완료
- [ ] 자동 배포 성공

### 타로 이미지
- [ ] frontend/public/images/tarot/ 폴더 존재
- [ ] 78장 이미지 파일 확인
- [ ] Git에 커밋됨
- [ ] Vercel에서 정상 로딩
- [ ] 이미지 깨짐 없음

### 기능 테스트
- [ ] 오늘의 운세 API 성공
- [ ] 타로 카드 API 성공 (이미지 포함)
- [ ] 사주팔자 API 성공
- [ ] 토정비결 API 성공
- [ ] 꿈 해몽 API 성공
- [ ] 별자리 운세 API 성공
- [ ] 로또 번호 생성 성공
- [ ] 궁합 보기 API 성공

### CORS 및 네트워크
- [ ] CORS 오류 없음
- [ ] Network 탭에서 200 OK
- [ ] Console 오류 없음
- [ ] API 응답 시간 정상 (3-5초)

### 인코딩 및 코드 품질
- [ ] 모든 파일 UTF-8 인코딩
- [ ] BOM 없는 UTF-8
- [ ] 이모지 완전 제거
- [ ] console.log 정상 (이모지 없음)
- [ ] Git 커밋 메시지 (이모지 없음)

---

## 작업 완료 후 확인

### 성능 체크
```
Vercel 프론트엔드:
- 첫 로딩: 0.5-1초
- 타로 이미지: 즉시 로딩
- CSS/JS: 캐싱됨

Render 백엔드:
- 첫 API 호출: 5-10초 (Cold Start)
- 이후 호출: 1-3초
```

### 최종 확인 URL
```
프론트엔드: https://fortune-platform.vercel.app
백엔드 API: https://fortune-platform.onrender.com

테스트:
1. 메인 페이지 접속
2. 타로 카드 페이지 (이미지 확인)
3. 사주팔자 실행 (API 확인)
4. F12 Console (오류 없음 확인)
5. F12 Network (CORS 없음 확인)
```

---

## 작업 시 주의사항 (다시 한번 강조!)

### 절대 금지
1. 코드에 이모지 사용
2. console.log에 이모지
3. Git 커밋 메시지에 이모지
4. JSON 파일에 주석
5. UTF-8 아닌 인코딩

### 반드시 확인
1. 모든 파일 UTF-8 인코딩 (without BOM)
2. API_URL 변수 추가 (8개 파일)
3. CORS 설정 정확히
4. 타로 이미지 Git 커밋
5. vercel.json 문법 검사

### 테스트 필수
1. 로컬에서 먼저 테스트 (localhost:3000)
2. Vercel 배포 후 테스트
3. 8개 기능 모두 테스트
4. 타로 이미지 78장 확인
5. CORS 오류 없는지 확인

---

## 작업 순서 요약

1. Render 백엔드 설정 (CORS 추가)
2. 프론트엔드 API 주소 변경 (8개 파일)
3. 타로 이미지 Git 커밋 확인
4. vercel.json 생성
5. Git 푸시
6. Vercel 자동 배포 대기
7. 타로 이미지 테스트
8. API 연결 테스트
9. 전체 기능 테스트
10. 최종 확인

작업 예상 시간: 1시간 30분

---

## 참고 문서

관련 문서:
- ADMIN_SYSTEM_GUIDE.md
- 파일구조_연결관계_정확한매핑.md
- 파일구조_한눈에보기.md
- SECURITY_IMPLEMENTATION.md

---

작성 완료
다음 Claude 창에서 이 문서를 참고하여 작업 진행

주의: 이 문서를 읽은 후 반드시 인코딩과 이모지 규칙을 확인하고 작업할 것!
