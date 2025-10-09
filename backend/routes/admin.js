const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMiddleware, SECRET_KEY } = require('../middleware/auth');
const router = express.Router();

// MongoDB 연결 (기존 DB 연결 사용)
let db;

// DB 초기화 함수 (server.js에서 호출)
router.initDB = (database) => {
  db = database;
};

/**
 * ==========================================
 * 1️⃣ 로그인 API
 * POST /api/admin/login
 * ==========================================
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 입력 검증
    if (!username || !password) {
      return res.status(400).json({ error: '아이디와 비밀번호를 입력하세요' });
    }
    
    // 관리자 계정 조회
    const admin = await db.collection('admin_users').findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: '잘못된 인증 정보입니다' });
    }
    
    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: '잘못된 인증 정보입니다' });
    }
    
    // JWT 토큰 생성 (24시간 유효)
    const token = jwt.sign(
      { username: admin.username },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    // 마지막 로그인 시간 업데이트
    await db.collection('admin_users').updateOne(
      { username },
      { $set: { lastLogin: new Date() } }
    );
    
    console.log(`✅ 관리자 로그인 성공: ${username}`);
    
    res.json({ 
      token, 
      username,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

/**
 * ==========================================
 * 2️⃣ 실시간 대시보드 통계
 * GET /api/admin/stats/today
 * ==========================================
 */
router.get('/stats/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // 오늘 방문자 수
    const visitorsToday = await db.collection('analytics_visitors')
      .countDocuments({ visitDate: today });
    
    // 오늘 쿠팡 클릭 수
    const clicksToday = await db.collection('analytics_coupang_clicks')
      .countDocuments({ clickDate: today });
    
    // 오늘 이용권 사용 횟수
    const usageToday = await db.collection('analytics_ticket_usage')
      .countDocuments({ usageDate: today });
    
    // 전일 데이터 (증감률 계산용)
    const visitorsYesterday = await db.collection('analytics_visitors')
      .countDocuments({ visitDate: yesterday });
    const clicksYesterday = await db.collection('analytics_coupang_clicks')
      .countDocuments({ clickDate: yesterday });
    
    // 증감률 계산 (0으로 나누기 방지)
    const visitorsChange = visitorsYesterday === 0 
      ? 0 
      : ((visitorsToday - visitorsYesterday) / visitorsYesterday * 100).toFixed(1);
      
    const clicksChange = clicksYesterday === 0 
      ? 0 
      : ((clicksToday - clicksYesterday) / clicksYesterday * 100).toFixed(1);
    
    // 전환율 (방문자 대비 클릭률)
    const conversionRate = visitorsToday === 0 
      ? 0 
      : (clicksToday / visitorsToday * 100).toFixed(1);
    
    res.json({
      visitorsToday,
      clicksToday,
      usageToday,
      visitorsChange: parseFloat(visitorsChange),
      clicksChange: parseFloat(clicksChange),
      conversionRate: parseFloat(conversionRate)
    });
  } catch (error) {
    console.error('실시간 통계 에러:', error);
    res.status(500).json({ error: '통계 조회 실패' });
  }
});

/**
 * ==========================================
 * 3️⃣ 방문자 통계
 * GET /api/admin/stats/visitors?days=7
 * ==========================================
 */
router.get('/stats/visitors', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    
    // 일별 방문자 (최근 N일)
    const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
    
    const dailyVisitors = await db.collection('analytics_visitors').aggregate([
      {
        $match: {
          visitDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$visitDate',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    // 시간대별 방문 분포 (0~23시)
    const hourlyDistribution = await db.collection('analytics_visitors').aggregate([
      {
        $group: {
          _id: '$visitHour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    // 요일별 패턴
    const weeklyPattern = await db.collection('analytics_visitors').aggregate([
      {
        $group: {
          _id: '$visitDay',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    // 총 방문자 수
    const totalVisitors = await db.collection('analytics_visitors').countDocuments();
    
    // 재방문자 수
    const returningVisitors = await db.collection('analytics_visitors')
      .countDocuments({ isReturning: true });
    
    res.json({
      totalVisitors,
      returningVisitors,
      dailyVisitors,
      hourlyDistribution,
      weeklyPattern
    });
  } catch (error) {
    console.error('방문자 통계 에러:', error);
    res.status(500).json({ error: '통계 조회 실패' });
  }
});

/**
 * ==========================================
 * 4️⃣ 쿠팡 클릭 통계
 * GET /api/admin/stats/coupang?days=7
 * ==========================================
 */
router.get('/stats/coupang', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
    
    // 일별 클릭 수
    const dailyClicks = await db.collection('analytics_coupang_clicks').aggregate([
      {
        $match: {
          clickDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$clickDate',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    // 총 클릭 수
    const totalClicks = await db.collection('analytics_coupang_clicks').countDocuments();
    
    // 시간대별 클릭 분포
    const hourlyClicks = await db.collection('analytics_coupang_clicks').aggregate([
      {
        $group: {
          _id: '$clickHour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    res.json({ 
      totalClicks, 
      dailyClicks,
      hourlyClicks
    });
  } catch (error) {
    console.error('쿠팡 통계 에러:', error);
    res.status(500).json({ error: '통계 조회 실패' });
  }
});

/**
 * ==========================================
 * 5️⃣ 기능별 이용권 사용 통계
 * GET /api/admin/stats/features
 * ==========================================
 */
router.get('/stats/features', authMiddleware, async (req, res) => {
  try {
    // 기능별 총 사용량
    const featureUsage = await db.collection('analytics_ticket_usage').aggregate([
      {
        $group: {
          _id: '$feature',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } } // 내림차순 정렬
    ]).toArray();
    
    // 기능별 일별 사용량 (최근 7일)
    const startDate = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    
    const featureDaily = await db.collection('analytics_ticket_usage').aggregate([
      {
        $match: {
          usageDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { 
            feature: '$feature', 
            date: '$usageDate' 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]).toArray();
    
    // 시간대별 사용 패턴
    const hourlyUsage = await db.collection('analytics_ticket_usage').aggregate([
      {
        $group: {
          _id: '$usageHour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    res.json({ 
      featureUsage, 
      featureDaily,
      hourlyUsage
    });
  } catch (error) {
    console.error('기능별 통계 에러:', error);
    res.status(500).json({ error: '통계 조회 실패' });
  }
});

/**
 * ==========================================
 * 6️⃣ 쿠팡 링크 조회
 * GET /api/admin/settings/coupang-link
 * ==========================================
 */
router.get('/settings/coupang-link', authMiddleware, async (req, res) => {
  try {
    const settings = await db.collection('admin_settings').findOne();
    
    res.json({ 
      coupangLink: settings?.coupangLink || '',
      updatedAt: settings?.updatedAt || null,
      updatedBy: settings?.updatedBy || null
    });
  } catch (error) {
    console.error('쿠팡 링크 조회 에러:', error);
    res.status(500).json({ error: '설정 조회 실패' });
  }
});

/**
 * ==========================================
 * 7️⃣ 쿠팡 링크 수정
 * PUT /api/admin/settings/coupang-link
 * ==========================================
 */
router.put('/settings/coupang-link', authMiddleware, async (req, res) => {
  try {
    const { coupangLink } = req.body;
    
    // 입력 검증
    if (!coupangLink) {
      return res.status(400).json({ error: '링크를 입력하세요' });
    }
    
    // URL 유효성 검증
    if (!coupangLink.startsWith('http://') && !coupangLink.startsWith('https://')) {
      return res.status(400).json({ error: '올바른 URL 형식이 아닙니다 (http:// 또는 https://로 시작)' });
    }
    
    // DB 업데이트
    await db.collection('admin_settings').updateOne(
      {},
      {
        $set: {
          coupangLink,
          updatedAt: new Date(),
          updatedBy: req.admin.username
        }
      },
      { upsert: true } // 문서가 없으면 생성
    );
    
    console.log(`✅ 쿠팡 링크 업데이트: ${coupangLink}`);
    
    res.json({ 
      success: true, 
      coupangLink,
      message: '쿠팡 링크가 성공적으로 업데이트되었습니다'
    });
  } catch (error) {
    console.error('쿠팡 링크 수정 에러:', error);
    res.status(500).json({ error: '설정 저장 실패' });
  }
});

/**
 * ==========================================
 * 8️⃣ 데이터 내보내기 (CSV)
 * GET /api/admin/export?startDate=2025-01-01&endDate=2025-01-07&type=visitors
 * ==========================================
 */
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type = 'visitors' } = req.query;
    
    // 입력 검증
    if (!startDate || !endDate) {
      return res.status(400).json({ error: '시작일과 종료일을 지정하세요' });
    }
    
    let data;
    let csvHeader;
    let csvRows;
    
    // 타입별 데이터 조회
    if (type === 'visitors') {
      // 방문자 데이터
      data = await db.collection('analytics_visitors')
        .find({
          visitDate: { $gte: startDate, $lte: endDate }
        })
        .toArray();
      
      csvHeader = '날짜,시간,방문자ID,시간대,요일,재방문';
      csvRows = data.map(v => 
        `${v.visitDate},${v.visitTime},${v.visitorId},${v.visitHour},${v.visitDay},${v.isReturning}`
      ).join('\n');
      
    } else if (type === 'clicks') {
      // 쿠팡 클릭 데이터
      data = await db.collection('analytics_coupang_clicks')
        .find({
          clickDate: { $gte: startDate, $lte: endDate }
        })
        .toArray();
      
      csvHeader = '날짜,시간,방문자ID,시간대';
      csvRows = data.map(c => 
        `${c.clickDate},${c.clickTime},${c.visitorId},${c.clickHour}`
      ).join('\n');
      
    } else if (type === 'usage') {
      // 이용권 사용 데이터
      data = await db.collection('analytics_ticket_usage')
        .find({
          usageDate: { $gte: startDate, $lte: endDate }
        })
        .toArray();
      
      csvHeader = '날짜,시간,방문자ID,기능,시간대';
      csvRows = data.map(u => 
        `${u.usageDate},${u.usageTime},${u.visitorId},${u.feature},${u.usageHour}`
      ).join('\n');
      
    } else {
      return res.status(400).json({ error: '유효하지 않은 타입입니다 (visitors, clicks, usage 중 선택)' });
    }
    
    // CSV 생성
    const csv = csvHeader + '\n' + csvRows;
    
    // CSV 파일 다운로드
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=analytics_${type}_${startDate}_${endDate}.csv`);
    res.send('\uFEFF' + csv); // UTF-8 BOM 추가 (한글 깨짐 방지)
    
    console.log(`✅ 데이터 내보내기: ${type} (${startDate} ~ ${endDate})`);
  } catch (error) {
    console.error('데이터 내보내기 에러:', error);
    res.status(500).json({ error: '데이터 내보내기 실패' });
  }
});

/**
 * ==========================================
 * 관리자 계정 정보 조회 (선택사항)
 * GET /api/admin/profile
 * ==========================================
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const admin = await db.collection('admin_users').findOne(
      { username: req.admin.username },
      { projection: { password: 0 } } // 비밀번호 제외
    );
    
    if (!admin) {
      return res.status(404).json({ error: '관리자를 찾을 수 없습니다' });
    }
    
    res.json(admin);
  } catch (error) {
    console.error('프로필 조회 에러:', error);
    res.status(500).json({ error: '프로필 조회 실패' });
  }
});

module.exports = router;
