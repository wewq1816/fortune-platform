// 환경별 API URL 설정
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

const API_BASE_URL = isLocalhost 
  ? 'http://localhost:3000'
  : 'https://fortune-platform.onrender.com';

console.log('[Dashboard] Environment:', isLocalhost ? 'Local' : 'Production');
console.log('[Dashboard] API URL:', API_BASE_URL);

// ========================================
// 인증 확인
// ========================================
function checkAuth() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
    return false;
  }
  return token;
}

const token = checkAuth();

// API 호출 헤더
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// ========================================
// 로그아웃
// ========================================
function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = 'login.html';
  }
}

// ========================================
// 알림 표시
// ========================================
function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notificationMessage');
  
  notificationMessage.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// ========================================
// 실시간 통계 업데이트
// ========================================
async function updateRealtimeStats() {
  try {
    const response = await fetch(API_BASE_URL + '/api/admin/stats/today', { headers });
    
    if (!response.ok) {
      throw new Error('통계 조회 실패');
    }
    
    const data = await response.json();
    
    // 오늘 방문자
    document.getElementById('visitorsToday').textContent = data.visitorsToday || 0;
    const visitorsChangeEl = document.getElementById('visitorsChange');
    const visitorsChange = data.visitorsChange || 0;
    visitorsChangeEl.textContent = `전일 대비 ${visitorsChange >= 0 ? '+' : ''}${visitorsChange}%`;
    visitorsChangeEl.className = `stat-change ${visitorsChange >= 0 ? 'positive' : 'negative'}`;
    
    // 오늘 클릭
    document.getElementById('clicksToday').textContent = data.clicksToday || 0;
    const clicksChangeEl = document.getElementById('clicksChange');
    const clicksChange = data.clicksChange || 0;
    clicksChangeEl.textContent = `전일 대비 ${clicksChange >= 0 ? '+' : ''}${clicksChange}%`;
    clicksChangeEl.className = `stat-change ${clicksChange >= 0 ? 'positive' : 'negative'}`;
    
    // 전환율
    document.getElementById('conversionRate').textContent = `${data.conversionRate || 0}%`;
    
    // 이용권 사용
    document.getElementById('usageToday').textContent = data.usageToday || 0;
    
    // 마지막 업데이트 시간
    document.getElementById('lastUpdate').textContent = 
      `업데이트: ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
  } catch (error) {
    console.error('실시간 통계 업데이트 실패:', error);
  }
}

// ========================================
// 누적 통계 로드
// ========================================
async function loadTotalStats() {
  try {
    // 방문자 통계
    const visitorsResponse = await fetch(API_BASE_URL + '/api/admin/stats/visitors', { headers });
    const visitorsData = await visitorsResponse.json();
    document.getElementById('visitorsTotal').textContent = visitorsData.totalVisitors || 0;
    
    // 쿠팡 클릭 통계
    const coupangResponse = await fetch(API_BASE_URL + '/api/admin/stats/coupang', { headers });
    const coupangData = await coupangResponse.json();
    document.getElementById('clicksTotal').textContent = coupangData.totalClicks || 0;
    
    // 방문자 추이 차트
    createVisitorsChart(visitorsData.dailyVisitors || []);
    
    // 시간대별 차트
    createHourlyChart(visitorsData.hourlyDistribution || []);
    
  } catch (error) {
    console.error('누적 통계 로드 실패:', error);
  }
}

// ========================================
// 기능별 이용권 사용 통계
// ========================================
async function loadFeatureStats() {
  try {
    const response = await fetch('https://fortune-platform.onrender.com/api/admin/stats/features', { headers });
    const data = await response.json();
    
    const featureList = document.getElementById('featureList');
    
    if (!data.featureUsage || data.featureUsage.length === 0) {
      featureList.innerHTML = '<div class="loading">데이터 없음</div>';
      return;
    }
    
    featureList.innerHTML = data.featureUsage.map(item => `
      <div class="feature-item">
        <span class="feature-name">${item._id}</span>
        <span class="feature-count">${item.count}회</span>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('기능별 통계 로드 실패:', error);
    document.getElementById('featureList').innerHTML = '<div class="loading">로드 실패</div>';
  }
}

// ========================================
// 방문자 추이 차트
// ========================================
let visitorsChart;
function createVisitorsChart(data) {
  const ctx = document.getElementById('visitorsChart').getContext('2d');
  
  if (visitorsChart) {
    visitorsChart.destroy();
  }
  
  const labels = data.map(d => {
    const date = new Date(d._id);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  const values = data.map(d => d.count);
  
  visitorsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '방문자',
        data: values,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#667eea'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 11 }
          }
        },
        x: {
          ticks: {
            font: { size: 10 }
          }
        }
      }
    }
  });
}

// ========================================
// 시간대별 방문 차트
// ========================================
let hourlyChart;
function createHourlyChart(data) {
  const ctx = document.getElementById('hourlyChart').getContext('2d');
  
  if (hourlyChart) {
    hourlyChart.destroy();
  }
  
  // 0~23시 배열 생성
  const hourlyData = new Array(24).fill(0);
  data.forEach(item => {
    hourlyData[item._id] = item.count;
  });
  
  const labels = Array.from({length: 24}, (_, i) => `${i}시`);
  
  hourlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '방문',
        data: hourlyData,
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
        borderColor: '#667eea',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 11 }
          }
        },
        x: {
          ticks: {
            font: { size: 9 }
          }
        }
      }
    }
  });
}

// ========================================
// 쿠팡 링크 로드
// ========================================
async function loadCoupangLink() {
  try {
    const response = await fetch('https://fortune-platform.onrender.com/api/admin/settings/coupang-link', { headers });
    const data = await response.json();
    document.getElementById('coupangLink').value = data.coupangLink || '';
  } catch (error) {
    console.error('쿠팡 링크 로드 실패:', error);
  }
}

// ========================================
// 쿠팡 링크 저장
// ========================================
async function saveCoupangLink() {
  const coupangLink = document.getElementById('coupangLink').value.trim();
  
  if (!coupangLink) {
    alert('링크를 입력해주세요.');
    return;
  }
  
  if (!coupangLink.startsWith('http')) {
    alert('올바른 URL 형식이 아닙니다.');
    return;
  }
  
  try {
    const response = await fetch('https://fortune-platform.onrender.com/api/admin/settings/coupang-link', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ coupangLink })
    });
    
    if (response.ok) {
      showNotification('✅ 링크가 저장되었습니다!');
    } else {
      alert('저장 실패');
    }
  } catch (error) {
    console.error('링크 저장 실패:', error);
    alert('저장 실패');
  }
}

// ========================================
// 초기 로드 및 자동 갱신
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // 초기 데이터 로드
  updateRealtimeStats();
  loadTotalStats();
  loadFeatureStats();
  loadCoupangLink();
  
  // 5초마다 실시간 통계 자동 갱신
  setInterval(updateRealtimeStats, 5000);
});
