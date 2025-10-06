/**
 * 🎫 이용권 시스템 - 모달 컴포넌트
 * 
 * 3가지 모달:
 * 1. 이용권 소모 확인 (이용권 있을 때)
 * 2. 쿠팡 방문 유도 (이용권 없고, 아직 충전 안 함)
 * 3. 내일 다시 오세요 (이용권 없고, 이미 사용함)
 */

// ============================================
// 🎨 모달 스타일
// ============================================
const modalStyles = `
  <style>
    .ticket-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-out;
    }
    
    .ticket-modal {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease-out;
    }
    
    .ticket-modal-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .ticket-modal-icon {
      font-size: 60px;
      margin-bottom: 15px;
    }
    
    .ticket-modal-title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    
    .ticket-modal-subtitle {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
    }
    
    .ticket-modal-content {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 15px;
    }
    
    .ticket-count {
      font-size: 48px;
      font-weight: bold;
      color: #FF6B6B;
      margin: 10px 0;
    }
    
    .ticket-info {
      font-size: 16px;
      color: #666;
    }
    
    .ticket-modal-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
    }
    
    .ticket-modal-btn {
      padding: 15px 40px;
      font-size: 18px;
      font-weight: bold;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .ticket-modal-btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .ticket-modal-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
    
    .ticket-modal-btn-secondary {
      background: white;
      color: #666;
      border: 2px solid #ddd;
    }
    
    .ticket-modal-btn-secondary:hover {
      background: #f8f9fa;
      border-color: #bbb;
    }
    
    .ticket-modal-btn-single {
      width: 100%;
      max-width: 300px;
    }
    
    .timer-text {
      font-size: 18px;
      color: #FF6B6B;
      font-weight: bold;
      margin-top: 15px;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
`;

// ============================================
// 🎯 모달 1: 이용권 소모 확인
// ============================================

/**
 * 이용권 있을 때 - 소모 확인 모달
 * 
 * @param {number} remainingTickets - 남은 이용권 개수
 * @param {function} onConfirm - 확인 버튼 클릭 시 콜백
 * @param {function} onCancel - 취소 버튼 클릭 시 콜백
 */
function showUseTicketModal(remainingTickets, onConfirm, onCancel) {
  const modalHTML = `
    ${modalStyles}
    <div class="ticket-modal-overlay" id="ticketModal">
      <div class="ticket-modal">
        <div class="ticket-modal-header">
          <div class="ticket-modal-icon">🎫</div>
          <div class="ticket-modal-title">이용권 1장을 소모하시겠습니까?</div>
        </div>
        
        <div class="ticket-modal-content">
          <div class="ticket-info">현재 남은 이용권</div>
          <div class="ticket-count">${remainingTickets}개</div>
        </div>
        
        <div class="ticket-modal-buttons">
          <button class="ticket-modal-btn ticket-modal-btn-primary" id="confirmBtn">
            확인
          </button>
          <button class="ticket-modal-btn ticket-modal-btn-secondary" id="cancelBtn">
            취소
          </button>
        </div>
      </div>
    </div>
  `;
  
  // 모달 삽입
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);
  
  // 이벤트 리스너
  document.getElementById('confirmBtn').addEventListener('click', () => {
    removeModal();
    if (onConfirm) onConfirm();
  });
  
  document.getElementById('cancelBtn').addEventListener('click', () => {
    removeModal();
    if (onCancel) onCancel();
  });
  
  // 오버레이 클릭 시 닫기
  document.getElementById('ticketModal').addEventListener('click', (e) => {
    if (e.target.id === 'ticketModal') {
      removeModal();
      if (onCancel) onCancel();
    }
  });
}

// ============================================
// 🎯 모달 2: 쿠팡 방문 유도
// ============================================

/**
 * 이용권 없을 때 - 쿠팡 방문 유도 모달
 * 
 * @param {function} onConfirm - 예 버튼 클릭 시 콜백 (쿠팡 게이트로 이동)
 * @param {function} onCancel - 아니요 버튼 클릭 시 콜백
 */
function showChargeTicketModal(onConfirm, onCancel) {
  const modalHTML = `
    ${modalStyles}
    <div class="ticket-modal-overlay" id="ticketModal">
      <div class="ticket-modal">
        <div class="ticket-modal-header">
          <div class="ticket-modal-icon">😊</div>
          <div class="ticket-modal-title">쿠팡 방문하고 이용권 2개 얻기</div>
        </div>
        
        <div class="ticket-modal-content">
          <div class="ticket-modal-subtitle">
            무료로 운세를 보려면 쿠팡 파트너스<br>
            링크를 한 번 방문해주세요!
          </div>
        </div>
        
        <div class="ticket-modal-buttons">
          <button class="ticket-modal-btn ticket-modal-btn-primary" id="confirmBtn">
            예
          </button>
          <button class="ticket-modal-btn ticket-modal-btn-secondary" id="cancelBtn">
            아니요
          </button>
        </div>
      </div>
    </div>
  `;
  
  // 모달 삽입
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);
  
  // 이벤트 리스너
  document.getElementById('confirmBtn').addEventListener('click', () => {
    removeModal();
    if (onConfirm) onConfirm();
  });
  
  document.getElementById('cancelBtn').addEventListener('click', () => {
    removeModal();
    if (onCancel) onCancel();
  });
  
  // 오버레이 클릭 시 닫기
  document.getElementById('ticketModal').addEventListener('click', (e) => {
    if (e.target.id === 'ticketModal') {
      removeModal();
      if (onCancel) onCancel();
    }
  });
}

// ============================================
// 🎯 모달 3: 내일 다시 오세요
// ============================================

/**
 * 이용권 없을 때 - 이미 사용함 (내일 다시 오세요)
 * 
 * @param {function} onClose - 확인 버튼 클릭 시 콜백
 */
function showComeTomorrowModal(onClose) {
  // 자정까지 남은 시간 계산
  const { hours, minutes } = getTimeUntilMidnight();
  const timeText = `⏰ 자정까지: ${hours}시간 ${minutes}분`;
  
  const modalHTML = `
    ${modalStyles}
    <div class="ticket-modal-overlay" id="ticketModal">
      <div class="ticket-modal">
        <div class="ticket-modal-header">
          <div class="ticket-modal-icon">😴</div>
          <div class="ticket-modal-title">내일 다시 오세요!</div>
        </div>
        
        <div class="ticket-modal-content">
          <div class="ticket-modal-subtitle">
            오늘은 이미 2번 사용하셨어요.
          </div>
          <div class="timer-text">${timeText}</div>
        </div>
        
        <div class="ticket-modal-buttons">
          <button class="ticket-modal-btn ticket-modal-btn-primary ticket-modal-btn-single" id="confirmBtn">
            확인
          </button>
        </div>
      </div>
    </div>
  `;
  
  // 모달 삽입
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);
  
  // 이벤트 리스너
  document.getElementById('confirmBtn').addEventListener('click', () => {
    removeModal();
    if (onClose) onClose();
  });
  
  // 오버레이 클릭 시 닫기
  document.getElementById('ticketModal').addEventListener('click', (e) => {
    if (e.target.id === 'ticketModal') {
      removeModal();
      if (onClose) onClose();
    }
  });
}

// ============================================
// 🛠️ 헬퍼 함수
// ============================================

/**
 * 모달 제거
 */
function removeModal() {
  const modal = document.getElementById('ticketModal');
  if (modal) {
    modal.parentElement.remove();
  }
}

/**
 * 자정까지 남은 시간 계산
 */
function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  
  const diff = midnight - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes };
}
