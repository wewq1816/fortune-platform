/**
 * 🎫 이용권 시스템 - 공통 래퍼 함수
 * 
 * 모든 페이지에서 사용 가능한 범용 이용권 체크 함수
 */

// 🎫 이용권 체크 후 원래 함수 실행
async function checkTicketAndExecute(originalFunction) {
  console.log('🎯 기능 실행 클릭');
  
  // 마스터 모드는 바로 실행
  if (isMasterMode()) {
    console.log('🔓 Master Mode - 바로 실행');
    originalFunction();
    return;
  }
  
  // 이용권 사용 가능 여부 확인
  const check = await canUseFortune();
  console.log('[Ticket Wrapper] 이용권 체크 결과:', check);
  console.log('[Ticket Wrapper] check.reason:', check.reason);
  console.log('[Ticket Wrapper] check.tickets:', check.tickets);
  console.log('[Ticket Wrapper] check.canUse:', check.canUse);
  
  if (check.reason === 'has_tickets') {
    // 이용권 있음 - 소모 확인 모달
    showUseTicketModal(check.tickets, () => {
      const result = useTicket();
      if (result.success) {
        console.log('✅ 이용권 소모 성공:', result);
        originalFunction();
      } else {
        alert('⚠️ 이용권 소모 실패: ' + result.error);
      }
    }, () => {
      console.log('❌ 사용 취소');
    });
    
  } else if (check.reason === 'need_charge') {
    // 이용권 없음 - 충전 유도 모달
    showChargeTicketModal(async () => {
      console.log('쿠팡 방문 동의');
      
      // 관리자가 설정한 쿠팡 링크 가져오기
      let COUPANG_LINK = "https://link.coupang.com/a/cVLo9u"; // 기본값
      try {
        const response = await fetch(API_BASE_URL + '/api/public/coupang-link');
        const data = await response.json();
        if (data.coupangLink) {
          COUPANG_LINK = data.coupangLink;
          console.log('[Ticket Wrapper] 쿠팡 링크 로드:', COUPANG_LINK);
        }
      } catch (error) {
        console.warn('[Ticket Wrapper] 쿠팡 링크 로드 실패, 기본값 사용:', error);
      }
      
      // 백엔드에 리다이렉트 로그 전송
      try {
        await fetch(API_BASE_URL + '/api/analytics/coupang-redirect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            link: COUPANG_LINK,
            timestamp: new Date().toISOString()
          }),
          keepalive: true
        });
        
        // 로그 전송 완료 후 짧은 대기
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('[Ticket Wrapper] 로그 전송 실패:', error);
      }
      
      const chargeResult = await chargeTickets();
      console.log('[Ticket Wrapper] 충전 결과:', chargeResult);
      
      if (chargeResult.success) {
        console.log('이용권 충전 완료:', chargeResult);
        window.open(COUPANG_LINK, '_blank');
        setTimeout(() => {
          alert('이용권 2개가 충전되었습니다!\n이제 다시 버튼을 눌러주세요.');
        }, 500);
      } else {
        alert(chargeResult.error || '충전 실패');
      }
    }, () => {
      console.log('쿠팡 방문 거부');
    });
    
  } else if (check.reason === 'already_used') {
    // 이용권 없음 - 이미 사용함
    showComeTomorrowModal(() => {
      console.log('✅ 내일 다시 오세요 확인');
    });
  }
}
