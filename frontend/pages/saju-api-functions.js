// saju-api-functions.js
// 사주 API 호출 함수들

// ============================================
// 사주 계산 (실제 API 호출)
// ============================================
async function calculateSaju() {
    // savedData에서 직접 읽기 (다른 기능들과 동일하게)
    if (!savedData) {
        alert('사주 정보를 먼저 입력해주세요!');
        openModal();
        return;
    }

    const year = savedData.year;
    const month = savedData.month;
    const day = savedData.day;
    const gender = savedData.gender;
    const birthTime = savedData.birthTime;

    if (!year || !month || !day || !birthTime || birthTime === '태어난 시간') {
        alert('사주 정보가 완전하지 않습니다. 다시 입력해주세요!');
        openModal();
        return;
    }

    // 시간 파싱
    let hour = 12;
    if (birthTime.includes('子')) hour = 0;
    else if (birthTime.includes('丑')) hour = 1;
    else if (birthTime.includes('寅')) hour = 3;
    else if (birthTime.includes('卯')) hour = 5;
    else if (birthTime.includes('辰')) hour = 7;
    else if (birthTime.includes('巳')) hour = 9;
    else if (birthTime.includes('午')) hour = 11;
    else if (birthTime.includes('未')) hour = 13;
    else if (birthTime.includes('申')) hour = 15;
    else if (birthTime.includes('酉')) hour = 17;
    else if (birthTime.includes('戌')) hour = 19;
    else if (birthTime.includes('亥')) hour = 21;

    const isLunar = savedData.calendarType && savedData.calendarType.includes('음력');

    // 로딩 표시
    const inputSection = document.getElementById('inputSection');
    const loading = document.getElementById('loading');
    if (inputSection) inputSection.style.display = 'none';
    if (loading) loading.classList.add('show');

    try {
        const response = await fetchWithDeviceId(API_BASE_URL + '/api/saju', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day),
                hour: hour,
                isLunar: isLunar,
                gender: gender,
                category: selectedCategory || 'total'
            })
        });

        if (!response.ok) {
            throw new Error('API 호출 실패');
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || '사주 계산 실패');
        }

        // 전역 변수에 저장
        sajuData = {
            saju: data.saju,
            elements: data.elements,
            strength: data.strength,
            yongsin: data.yongsin,
            tenStars: data.tenStars,
            gender: gender,
            birthInfo: { year, month, day, hour: hour },
            interpretations: {}
        };

        if (data.interpretation) {
            sajuData.interpretations[selectedCategory || 'total'] = data.interpretation;
        }

        // 결과 표시
        if (typeof displayResult === 'function') {
            displayResult(data);
        }
        
        if (loading) loading.classList.remove('show');
        
        const resultContainer = document.getElementById('resultContainer');
        if (resultContainer) resultContainer.classList.add('show');

    } catch (error) {
        console.error('오류:', error);
        alert('사주 계산 중 오류가 발생했습니다: ' + error.message);
        if (loading) loading.classList.remove('show');
        if (inputSection) inputSection.style.display = 'block';
    }
}

// ============================================
// 카테고리 전환 (API 호출)
// ============================================
async function showCategory(category) {
    if (!sajuData || !sajuData.birthInfo) {
        alert('먼저 사주를 계산해주세요!');
        return;
    }

    currentCategory = category;
    
    // 탭 활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // 이미 로드된 해석이 있으면 표시
    if (sajuData.interpretations[category]) {
        const interpretationEl = document.getElementById('interpretation');
        if (interpretationEl) {
            interpretationEl.textContent = sajuData.interpretations[category];
        }
        return;
    }

    // 로딩 표시
    const interpretationEl = document.getElementById('interpretation');
    if (interpretationEl) {
        interpretationEl.innerHTML = '<div style="text-align: center; padding: 20px;">로딩 중...</div>';
    }

    try {
        const response = await fetchWithDeviceId(API_BASE_URL + '/api/saju', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                year: parseInt(sajuData.birthInfo.year),
                month: parseInt(sajuData.birthInfo.month),
                day: parseInt(sajuData.birthInfo.day),
                hour: sajuData.birthInfo.hour,
                isLunar: savedData && savedData.calendarType && savedData.calendarType.includes('음력'),
                gender: sajuData.gender,
                category: category
            })
        });

        if (!response.ok) {
            throw new Error('API 호출 실패');
        }

        const data = await response.json();
        
        if (data.success && data.interpretation) {
            sajuData.interpretations[category] = data.interpretation;
            if (interpretationEl) {
                interpretationEl.textContent = data.interpretation;
            }
        } else {
            if (interpretationEl) {
                interpretationEl.textContent = '해석을 가져오는데 실패했습니다.';
            }
        }

    } catch (error) {
        console.error('카테고리 로드 오류:', error);
        if (interpretationEl) {
            interpretationEl.textContent = '오류가 발생했습니다: ' + error.message;
        }
    }
}
