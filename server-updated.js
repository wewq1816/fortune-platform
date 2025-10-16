// 사주팔자 API - 수정된 버전 (API 성공 후 이용권 소모)
// 기존 server.js의 app.post('/api/saju') 부분을 이것으로 교체하세요

app.post('/api/saju', checkTicketMiddleware, async (req, res) => {
  logApiRequest(req, '/api/saju');
  try {
    const { year, month, day, hour, isLunar, gender, category } = req.body;
    
    console.log('사주팔자 요청:', { year, month, day, hour, gender, category });
    
    // 입력 검증
    if (!year || !month || !day || hour === undefined) {
      return res.status(400).json({
        success: false,
        error: '생년월일시를 모두 입력해주세요'
      });
    }
    
    // 성별 정규화
    const normalizedGender = gender === '남성' ? '남자' : gender === '여성' ? '여자' : gender;
    
    // 1. 사주 엔진 계산
    const sajuEngine = new SajuEngine();
    const saju = sajuEngine.calculateSaju({ year, month, day, hour, isLunar });
    const elements = sajuEngine.calculateElements(saju);
    const strength = sajuEngine.calculateStrength(saju, elements);
    const yongsin = sajuEngine.findYongsin(strength, elements, saju.ilgan);
    const tenStars = sajuEngine.calculateTenStars(saju);
    
    const engineResult = { saju, ilgan: saju.ilgan, elements, strength, yongsin, tenStars };
    
    // 2. 카테고리별 추가 계산
    const options = { gender: normalizedGender };
    if (category === 'daeun') {
      options.daeunList = SajuEngineExtended.calculateDaeun(year, month, day, hour, normalizedGender, isLunar);
      options.currentAge = calculateAge(year, month, day);
    }
    if (category === 'sinsal' || category === 'move' || category === 'travel') {
      options.sinsal = SajuEngineExtended.calculateSinsal(saju);
    }
    if (category === 'taekil') {
      const today = new Date();
      options.taekilResults = SajuEngineExtended.calculateTaekil(today.getFullYear(), today.getMonth() + 1, saju, req.body.purpose || 'general');
      options.purpose = req.body.purpose || 'general';
    }
    
    // 3. 프롬프트 생성
    const prompt = getSajuPrompt(category, engineResult, options);
    
    // 4. Claude API 호출 (try-catch로 감싸서 실패 시 이용권 소모 안함)
    let message, interpretation, cost;
    try {
      message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2500,
        messages: [{ role: 'user', content: prompt }]
      });
      
      interpretation = message.content[0].text;
      cost = (message.usage.input_tokens / 1000 * 0.00025 + message.usage.output_tokens / 1000 * 0.00125).toFixed(6);
      
      console.log('Claude API 성공 - 비용:', cost);
      
    } catch (apiError) {
      // API 호출 실패 시 이용권 소모 안함!
      console.error('Claude API 실패 - 이용권 소모 안함:', apiError.message);
      throw apiError;
    }
    
    // 5. API 성공 후 이용권 소모
    const ticketResult = await useTicket(req, '사주팔자');
    if (!ticketResult.success && !req.isMasterMode) {
      console.warn('이용권 소모 실패 - 이미 API 호출 완료');
    }
    
    // 6. 결과 반환
    res.json({
      success: true,
      saju: { year: saju.year, month: saju.month, day: saju.day, hour: saju.hour, ilgan: saju.ilgan },
      elements,
      strength,
      yongsin,
      tenStars,
      interpretation,
      cost
    });
    
    console.log('사주팔자 응답 완료!');
    
  } catch (error) {
    console.error('사주팔자 오류:', error.message);
    res.status(500).json({
      success: false,
      error: `사주 계산 오류: ${error.message}`
    });
  }
});
