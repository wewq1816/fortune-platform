# 쿠팡 링크 로그 미표시 문제

## 현재 상황

- 사용자가 이용권 2개 받음
- Render 서버 로그에 쿠팡 링크 표시 안 됨
- trust proxy 오류만 표시됨

## 문제 분석 필요

### 1. 확인해야 할 코드

#### server.js (Line 1369-1389)
```javascript
// 쿠팡 링크 조회 공개 API
app.get('/api/public/coupang-link', async (req, res) => {
  // 로그 출력 코드 있음
  console.log('========================================');
  console.log('[Coupang Link Request]');
  console.log('Time:', new Date().toLocaleString('ko-KR'));
  console.log('IP:', clientIP);
  console.log('Link:', finalLink);
  console.log('========================================');
});
```

#### backend/routes/analytics.js (Line 139-168)
```javascript
// 쿠팡 리다이렉트 로그 API
router.post('/coupang-redirect', async (req, res) => {
  // 로그 출력 코드 있음
  console.log('========================================');
  console.log('[Coupang Redirect]');
  console.log('Time:', new Date().toLocaleString('ko-KR'));
  console.log('IP:', clientIP);
  console.log('Link:', link);
  console.log('========================================');
});
```

#### frontend/pages/coupang-gate.html (Line 101-137)
```javascript
// 쿠팡으로 이동 함수
async function goToCoupang() {
  // 백엔드에 로그 전송
  await fetch(API_BASE_URL + '/api/analytics/coupang-redirect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      link: COUPANG_LINK,
      timestamp: new Date().toISOString()
    })
  });
}
```

### 2. 가능한 원인

1. API 호출 안 됨
   - coupang-gate.html에서 API 호출 실패
   - fetch 에러 발생

2. 로그 출력 안 됨
   - console.log가 Render 로그에 안 보임
   - 로그 레벨 문제

3. API 라우터 등록 안 됨
   - server.js에서 analytics 라우터 등록 확인 필요

### 3. 디버깅 단계

1. Render 로그에서 확인:
   - "[Coupang Link Request]" 검색
   - "[Coupang Redirect]" 검색

2. 브라우저 F12 콘솔 확인:
   - coupang-gate.html 접속
   - fetch 에러 확인
   - API 응답 확인

3. API 테스트:
   ```
   curl -X POST https://fortune-platform.onrender.com/api/analytics/coupang-redirect \
     -H "Content-Type: application/json" \
     -d '{"link":"https://www.coupang.com/test","timestamp":"2025-10-20T10:00:00Z"}'
   ```

### 4. 수정 필요 사항

확인 후 결정

## 복사 붙여넣기 명령

```
다음 문서 읽고 분석해:
C:\xampp\htdocs\mysite\운세플랫폼\docs\COUPANG_LINK_LOG_ISSUE.md

문제:
- 사용자가 쿠팡 링크 통해 이용권 받음
- Render 서버 로그에 쿠팡 링크 표시 안 됨
- trust proxy 오류만 뜸

확인할 것:
1. server.js Line 1369-1389 (공개 API)
2. backend/routes/analytics.js Line 139-168 (리다이렉트 로그)
3. frontend/pages/coupang-gate.html Line 101-137 (fetch 호출)

분석하고 문제점 찾아서 수정해
```

## 참고 정보

- 배포 서버: https://fortune-platform.onrender.com
- 프론트엔드: https://fortune-platform.vercel.app
- 로그 위치: Render Dashboard > fortune-platform > Logs
