# 🎫 이용권 시스템 추가 스크립트

나머지 5개 페이지에 추가할 표준 코드입니다.

## 1. HTML 파일 끝부분에 추가 (</ body> 전)

```html
<!-- 🎫 이용권 시스템 스크립트 -->
<script src="../utils/ticket-system.js"></script>
<script src="../components/common/TicketModal.jsx"></script>

<script>
  // 🎫 페이지 로드 시 마스터 모드 체크
  checkMasterModeFromURL();

  // 🎫 이용권 체크 함수
  function checkTicketAndExecute(originalFunction) {
    console.log('🎯 기능 실행 클릭');
    
    if (isMasterMode()) {
      console.log('🔓 Master Mode - 바로 실행');
      originalFunction();
      return;
    }
    
    const check = canUseFortune();
    console.log('이용권 체크 결과:', check);
    
    if (check.reason === 'has_tickets') {
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
      showComeTomorrowModal(() => {
        console.log('✅ 내일 다시 오세요 확인');
      });
    }
  }
</script>
```

## 2. 각 페이지별 수정 내용

### tojeong-test.html
- 버튼: `<button onclick="getTojeongFortune()">`
- 변경: `<button onclick="checkTicketAndExecute(getTojeongFortune)">`

### dream.html
- 버튼: `<button onclick="searchDream()">`
- 변경: `<button onclick="checkTicketAndExecute(searchDream)">`

### horoscope.html  
- 버튼: `<button onclick="getHoroscope()">`
- 변경: `<button onclick="checkTicketAndExecute(getHoroscope)">`

### lotto.html
- 버튼: `<button onclick="generateLotto()">`
- 변경: `<button onclick="checkTicketAndExecute(generateLotto)">`

### compatibility-test.html
- 버튼: `<button onclick="checkCompatibility()">`
- 변경: `<button onclick="checkTicketAndExecute(checkCompatibility)">`

---

**완료 체크리스트:**
- [x] daily-fortune-test.html
- [x] tarot-mock.html
- [x] saju-test.html
- [ ] tojeong-test.html
- [ ] dream.html
- [ ] horoscope.html
- [ ] lotto.html
- [ ] compatibility-test.html
