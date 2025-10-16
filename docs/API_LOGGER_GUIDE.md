# API 로그 시스템 적용 가이드

## 1단계: server.js 상단에 로거 추가

파일: C:\xampp\htdocs\mysite\운세플랫폼\server.js
위치: 6번 줄 (require('dotenv').config(); 다음)

```javascript
// ============================================
// API Logger
// ============================================
const {
  logApiRequest,
  logApiSuccess,
  logApiError,
  logClaudeApiCall,
  logInfo,
  logWarning
} = require('./backend/utils/api-logger');

logInfo('서버 시작 준비 중...', 'system');
```

---

## 2단계: 사주팔자 API에 로거 적용 (예시)

기존 코드를 찾아서:

```javascript
app.post('/api/saju', checkTicketMiddleware, async (req, res) => {
  try {
    // 기존 코드...
```

다음으로 변경:

```javascript
app.post('/api/saju', checkTicketMiddleware, async (req, res) => {
  // [추가] 요청 로그
  logApiRequest(req, '/api/saju');
  
  try {
    // 기존 코드...
```

그리고 성공 응답 부분을:

```javascript
    res.json({
      success: true,
      result: interpretation
    });
```

다음으로 변경:

```javascript
    const responseData = {
      success: true,
      result: interpretation
    };
    
    // [추가] 성공 로그
    logApiSuccess('/api/saju', 200, responseData);
    
    res.json(responseData);
```

오류 처리 부분을:

```javascript
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
```

다음으로 변경:

```javascript
  } catch (error) {
    // [추가] 오류 로그
    logApiError('/api/saju', error, req);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
```

---

## 3단계: Claude API 호출 부분에 로거 적용

Claude API 호출 직전:

```javascript
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  messages: [{ role: 'user', content: fullPrompt }]
});
```

다음으로 변경:

```javascript
// [추가] Claude API 호출 로그
logClaudeApiCall('/api/saju', fullPrompt, 4096);

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  messages: [{ role: 'user', content: fullPrompt }]
});
```

---

## 4단계: 모든 API에 적용

다음 API들에 위와 동일한 패턴으로 로거 추가:

1. /api/tarot
2. /api/daily-fortune
3. /api/horoscope
4. /api/tojeong
5. /api/compatibility
6. /api/dream/interpret
7. /api/dream/ai-interpret

---

## 5단계: 서버 시작

```bash
node server.js
```

---

## 로그 파일 위치

생성되는 로그 파일들:

```
C:\xampp\htdocs\mysite\운세플랫폼\logs\
├── api-2025-01-08.log         # 모든 API 요청/응답
├── error-2025-01-08.log       # 오류 전용 (중요!)
├── claude-2025-01-08.log      # Claude API 호출 기록
└── system-2025-01-08.log      # 시스템 로그
```

---

## 오류 확인 방법

### 방법 1: 실시간 확인 (PowerShell)
```powershell
Get-Content C:\xampp\htdocs\mysite\운세플랫폼\logs\error-2025-01-08.log -Wait
```

### 방법 2: 파일 열기
```
메모장이나 VSCode로 error-2025-01-08.log 파일 열기
```

### 방법 3: 마지막 10줄 확인
```powershell
Get-Content C:\xampp\htdocs\mysite\운세플랫폼\logs\error-2025-01-08.log -Tail 10
```

---

## 빠른 적용 스크립트

수동으로 하기 번거로우면 이 스크립트를 사용하세요:

파일: apply-logger-to-server.js

```javascript
const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server.js');
let content = fs.readFileSync(serverPath, 'utf8');

// 1. 로거 import 추가
if (!content.includes('api-logger')) {
  content = content.replace(
    "require('dotenv').config();",
    "require('dotenv').config();\n\n" +
    "// API Logger\n" +
    "const {\n" +
    "  logApiRequest,\n" +
    "  logApiSuccess,\n" +
    "  logApiError,\n" +
    "  logClaudeApiCall,\n" +
    "  logInfo,\n" +
    "  logWarning\n" +
    "} = require('./backend/utils/api-logger');\n\n" +
    "logInfo('서버 시작 준비 중...', 'system');"
  );
}

// 2. 각 API에 로거 추가 (예: /api/saju)
content = content.replace(
  /app\.post\('\/api\/saju'.*?async \(req, res\) => \{/s,
  (match) => {
    return match + '\n  logApiRequest(req, \'/api/saju\');\n';
  }
);

fs.writeFileSync(serverPath, content, 'utf8');
console.log('로거 적용 완료!');
```

실행:
```bash
node apply-logger-to-server.js
```

---

## 테스트

1. 서버 시작
2. 브라우저에서 http://localhost:3000 접속
3. 사주팔자 기능 사용
4. logs/error-2025-01-08.log 파일 확인

오류가 발생하면 자동으로 로그에 기록됩니다!
