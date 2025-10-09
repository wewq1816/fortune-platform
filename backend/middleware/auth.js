const jwt = require('jsonwebtoken');

// JWT Secret 환경 변수 검증
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('❌ JWT_SECRET 환경 변수가 설정되지 않았습니다! .env 파일을 확인하세요.');
}

if (SECRET_KEY.length < 32) {
  console.warn('⚠️ JWT_SECRET이 너무 짧습니다. 최소 32자 이상을 권장합니다.');
}

/**
 * 관리자 인증 미들웨어
 * - Authorization 헤더에서 JWT 토큰 검증
 * - 유효한 토큰이면 req.admin에 사용자 정보 저장
 */
function authMiddleware(req, res, next) {
  // Authorization 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: '인증이 필요합니다',
      code: 'NO_TOKEN'
    });
  }
  
  // Bearer 토큰 형식 검증
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      error: '잘못된 토큰 형식입니다',
      code: 'INVALID_TOKEN_FORMAT'
    });
  }
  
  const token = parts[1];
  
  try {
    // JWT 토큰 검증
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // 토큰에서 추출한 사용자 정보를 req.admin에 저장
    req.admin = decoded;
    
    // 다음 미들웨어로 진행
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: '토큰이 만료되었습니다',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({ 
      error: '유효하지 않은 토큰입니다',
      code: 'INVALID_TOKEN'
    });
  }
}

module.exports = { 
  authMiddleware, 
  SECRET_KEY 
};
