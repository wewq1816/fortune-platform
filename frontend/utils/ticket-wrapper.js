/**
 * 🎫 이용권 시스템 - 공통 래퍼 함수
 * 
 * 모든 페이지에서 사용 가능한 범용 이용권 체크 함수
 */

// 🎫 이용권 체크 후 원래 함수 실행
function checkTicketAndExecute(originalFunction) {
  console.log('🎯 기능 실행 클릭');
  
  // 마스터 모드는 바로 실행
  if (isMasterMode()) {
    console.log('🔓 Master Mode - 바로 실행');
    originalFunction();
    return;
  }
  
  // 이용권 사용 가능 여부 확인
  const check = canUseFortune();
  console.log('이용권 체크 결과:', check);
  
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
    showChargeTicketModal(() => {
      console.log('✅ 쿠팡 방문 동의');
      const chargeResult = chargeTickets();
      if (chargeResult.success) {
        console.log('✅ 이용권 충전 완료:', chargeResult);
        const COUPANG_LINK = "https://www.coupang.com/?src=fortune-platform";
        window.open(COUPANG_LINK, '_blank');
        setTimeout(() => {
          alert('🎫 이용권 2개가 충전되었습니다!\n이제 다시 버튼을 눌러주세요.');
        }, 500);
      } else {
        alert('⚠️ ' + chargeResult.error);
      }
    }, () => {
      console.log('❌ 쿠팡 방문 거부');
    });
    
  } else if (check.reason === 'already_used') {
    // 이용권 없음 - 이미 사용함
    showComeTomorrowModal(() => {
      console.log('✅ 내일 다시 오세요 확인');
    });
  }
}
