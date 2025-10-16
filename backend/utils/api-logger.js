// ============================================
// API Logger - Windows Safe (No Emoji)
// ============================================

const fs = require('fs');
const path = require('path');

// 로그 디렉토리 생성
const LOG_DIR = path.join(__dirname, '../../logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 현재 날짜 문자열 (YYYY-MM-DD)
function getDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 현재 시간 문자열 (HH:MM:SS)
function getTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// 로그 파일 경로
function getLogFilePath(type = 'general') {
  const dateStr = getDateString();
  return path.join(LOG_DIR, `${type}-${dateStr}.log`);
}

// 파일에 로그 쓰기 (동기식 - 안전)
function writeToFile(filePath, message) {
  try {
    // UTF-8로 저장 (한글 지원)
    fs.appendFileSync(filePath, message + '\n', { encoding: 'utf8' });
  } catch (error) {
    console.error('[LOG ERROR] 파일 쓰기 실패:', error.message);
  }
}

// ============================================
// 로그 함수들
// ============================================

// API 요청 로그
function logApiRequest(req, endpoint) {
  const timestamp = `[${getDateString()} ${getTimeString()}]`;
  const method = req.method;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             'unknown';
  
  const logMessage = `${timestamp} [REQUEST] ${method} ${endpoint} | IP: ${ip}`;
  
  // 콘솔 출력
  console.log(logMessage);
  
  // 파일 저장
  writeToFile(getLogFilePath('api'), logMessage);
  
  // Body가 있으면 기록 (비밀번호 제외)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '****';
    
    const bodyMessage = `${timestamp} [BODY] ${JSON.stringify(sanitizedBody, null, 2)}`;
    console.log(bodyMessage);
    writeToFile(getLogFilePath('api'), bodyMessage);
  }
}

// API 응답 로그 (성공)
function logApiSuccess(endpoint, statusCode, data) {
  const timestamp = `[${getDateString()} ${getTimeString()}]`;
  const logMessage = `${timestamp} [SUCCESS] ${endpoint} | Status: ${statusCode}`;
  
  console.log(logMessage);
  writeToFile(getLogFilePath('api'), logMessage);
  
  // 응답 데이터 일부 기록 (너무 길면 생략)
  const dataStr = JSON.stringify(data);
  if (dataStr.length < 500) {
    const dataMessage = `${timestamp} [RESPONSE] ${dataStr}`;
    console.log(dataMessage);
    writeToFile(getLogFilePath('api'), dataMessage);
  }
}

// API 오류 로그 (중요!)
function logApiError(endpoint, error, req = null) {
  const timestamp = `[${getDateString()} ${getTimeString()}]`;
  const ip = req ? (req.headers['x-forwarded-for']?.split(',')[0] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress || 
                    'unknown') : 'unknown';
  
  // 오류 메시지
  const errorMessage = `${timestamp} [ERROR] ${endpoint} | IP: ${ip}`;
  const errorDetail = `${timestamp} [ERROR DETAIL] ${error.message}`;
  const errorStack = `${timestamp} [STACK] ${error.stack}`;
  
  // 콘솔 출력 (빨간색)
  console.error('='.repeat(80));
  console.error(errorMessage);
  console.error(errorDetail);
  console.error(errorStack);
  console.error('='.repeat(80));
  
  // 파일 저장 (error 전용 파일)
  const errorLogPath = getLogFilePath('error');
  writeToFile(errorLogPath, '='.repeat(80));
  writeToFile(errorLogPath, errorMessage);
  writeToFile(errorLogPath, errorDetail);
  writeToFile(errorLogPath, errorStack);
  
  // Request Body도 기록 (디버깅용)
  if (req && req.body && Object.keys(req.body).length > 0) {
    const bodyMessage = `${timestamp} [ERROR REQUEST BODY] ${JSON.stringify(req.body, null, 2)}`;
    writeToFile(errorLogPath, bodyMessage);
  }
  
  writeToFile(errorLogPath, '='.repeat(80));
  writeToFile(errorLogPath, ''); // 빈 줄
}

// Claude API 호출 로그
function logClaudeApiCall(endpoint, prompt, tokens = 0) {
  const timestamp = `[${getDateString()} ${getTimeString()}]`;
  const logMessage = `${timestamp} [CLAUDE API] ${endpoint} | Tokens: ${tokens}`;
  
  console.log(logMessage);
  writeToFile(getLogFilePath('claude'), logMessage);
  
  // 프롬프트 일부 기록 (처음 200자만)
  const promptPreview = prompt.substring(0, 200) + (prompt.length > 200 ? '...' : '');
  const promptMessage = `${timestamp} [PROMPT] ${promptPreview}`;
  writeToFile(getLogFilePath('claude'), promptMessage);
}

// 일반 정보 로그
function logInfo(message, type = 'general') {
  const timestamp = `[${getDateString()} ${getTimeString()}]`;
  const logMessage = `${timestamp} [INFO] ${message}`;
  
  console.log(logMessage);
  writeToFile(getLogFilePath(type), logMessage);
}

// 경고 로그
function logWarning(message, type = 'general') {
  const timestamp = `[${getDateString()} ${getTimeString()}]`;
  const logMessage = `${timestamp} [WARNING] ${message}`;
  
  console.warn(logMessage);
  writeToFile(getLogFilePath(type), logMessage);
}

// ============================================
// 로그 파일 자동 정리 (7일 이상 된 로그 삭제)
// ============================================
function cleanOldLogs() {
  try {
    const files = fs.readdirSync(LOG_DIR);
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(LOG_DIR, file);
      const stats = fs.statSync(filePath);
      
      // 7일 이상 된 파일 삭제
      if (stats.mtimeMs < sevenDaysAgo) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });
    
    if (deletedCount > 0) {
      logInfo(`오래된 로그 파일 ${deletedCount}개 삭제 완료`, 'system');
    }
  } catch (error) {
    console.error('[LOG CLEANUP ERROR]', error.message);
  }
}

// 서버 시작 시 1회 실행
cleanOldLogs();

// 매일 자정에 실행 (24시간마다)
setInterval(cleanOldLogs, 24 * 60 * 60 * 1000);

// ============================================
// Export
// ============================================
module.exports = {
  logApiRequest,
  logApiSuccess,
  logApiError,
  logClaudeApiCall,
  logInfo,
  logWarning
};
