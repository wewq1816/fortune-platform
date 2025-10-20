const express = require('express');
const router = express.Router();

// MongoDB 연결
let db;

// DB 초기화 함수
router.initDB = (database) => {
  db = database;
};

/**
 * ==========================================
 * 1️⃣ 방문 기록 API
 * POST /api/analytics/visit
 * - 프론트엔드에서 페이지 로드 시 호출
 * ==========================================
 */
router.post('/visit', async (req, res) => {
  try {
    const { visitorId, userAgent } = req.body;
    const now = new Date();
    
    // 입력 검증
    if (!visitorId) {
      return res.status(400).json({ error: '방문자 ID가 필요합니다' });
    }
    
    // 재방문 여부 확인 (이전에 방문 기록이 있는지)
    const previousVisit = await db.collection('analytics_visitors').findOne({ visitorId });
    const isReturning = !!previousVisit;
    
    // 방문 기록 저장
    await db.collection('analytics_visitors').insertOne({
      visitorId,
      visitDate: now.toISOString().split('T')[0], // YYYY-MM-DD
      visitTime: now,
      visitHour: now.getHours(), // 0~23
      visitDay: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][now.getDay()],
      userAgent: userAgent || 'Unknown',
      isReturning
    });
    
    console.log(`📊 방문 기록: ${visitorId} (${isReturning ? '재방문' : '신규'})`);
    
    res.json({ 
      success: true,
      isReturning
    });
  } catch (error) {
    console.error('방문 기록 에러:', error);
    res.status(500).json({ error: '방문 기록 실패' });
  }
});

/**
 * ==========================================
 * 2️⃣ 쿠팡 클릭 기록 API
 * POST /api/analytics/coupang-click
 * - 사용자가 쿠팡 광고 클릭 시 호출
 * ==========================================
 */
router.post('/coupang-click', async (req, res) => {
  try {
    const { visitorId } = req.body;
    const now = new Date();
    
    // 입력 검증
    if (!visitorId) {
      return res.status(400).json({ error: '방문자 ID가 필요합니다' });
    }
    
    // 클릭 기록 저장
    await db.collection('analytics_coupang_clicks').insertOne({
      visitorId,
      clickDate: now.toISOString().split('T')[0],
      clickTime: now,
      clickHour: now.getHours(),
      referrer: req.headers.referer || ''
    });
    
    console.log(`🔗 쿠팡 클릭: ${visitorId}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('쿠팡 클릭 기록 에러:', error);
    res.status(500).json({ error: '클릭 기록 실패' });
  }
});

/**
 * ==========================================
 * 3️⃣ 이용권 사용 기록 API
 * POST /api/analytics/ticket-usage
 * - 사용자가 기능 사용 시 호출
 * ==========================================
 */
router.post('/ticket-usage', async (req, res) => {
  try {
    const { visitorId, feature } = req.body;
    const now = new Date();
    
    // 입력 검증
    if (!visitorId || !feature) {
      return res.status(400).json({ error: '방문자 ID와 기능명이 필요합니다' });
    }
    
    // 유효한 기능명인지 확인
    const validFeatures = [
      '오늘의 운세',
      '타로 카드',
      '사주팔자',
      '토정비결',
      '꿈 해몽',
      '별자리 운세',
      '로또 번호',
      '궁합 보기'
    ];
    
    if (!validFeatures.includes(feature)) {
      return res.status(400).json({ 
        error: '유효하지 않은 기능명입니다',
        validFeatures 
      });
    }
    
    // 사용 기록 저장
    await db.collection('analytics_ticket_usage').insertOne({
      visitorId,
      feature,
      usageDate: now.toISOString().split('T')[0],
      usageTime: now,
      usageHour: now.getHours()
    });
    
    console.log(`🎫 이용권 사용: ${visitorId} - ${feature}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('이용권 사용 기록 에러:', error);
    res.status(500).json({ error: '사용 기록 실패' });
  }
});

/**
 * ==========================================
 * 4. 쿠팡 리다이렉트 로그 API
 * POST /api/analytics/coupang-redirect
 * - 사용자가 실제 쿠팡 링크로 이동할 때 호출
 * ==========================================
 */
router.post('/coupang-redirect', async (req, res) => {
  try {
    const { link, timestamp } = req.body;
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    // 콘솔 로그 출력
    console.log('========================================');
    console.log('[Coupang Redirect]');
    console.log('Time:', new Date().toLocaleString('ko-KR'));
    console.log('IP:', clientIP);
    console.log('Link:', link);
    console.log('User-Agent:', userAgent);
    console.log('========================================');
    
    // DB에도 저장 (선택)
    await db.collection('analytics_coupang_redirects').insertOne({
      link,
      timestamp: timestamp || new Date(),
      clientIP,
      userAgent
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('[Coupang Redirect] 로그 저장 실패:', error);
    res.status(500).json({ error: '로그 저장 실패' });
  }
});

/**
 * ==========================================
 * 관리자용 통계 조회
 * GET /api/analytics/summary
 * ==========================================
 */
router.get('/summary', async (req, res) => {
  try {
    const totalVisitors = await db.collection('analytics_visitors').countDocuments();
    const totalClicks = await db.collection('analytics_coupang_clicks').countDocuments();
    const totalUsage = await db.collection('analytics_ticket_usage').countDocuments();
    
    res.json({
      totalVisitors,
      totalClicks,
      totalUsage,
      conversionRate: totalVisitors === 0 ? 0 : (totalClicks / totalVisitors * 100).toFixed(1)
    });
  } catch (error) {
    console.error('통계 요약 에러:', error);
    res.status(500).json({ error: '통계 조회 실패' });
  }
});

module.exports = router;
