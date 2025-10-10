        // 사주 계산 (실제 API 호출)
        async function calculateSaju() {
            const year = document.getElementById('year').value;
            const month = document.getElementById('month').value;
            const day = document.getElementById('day').value;
            const gender = document.getElementById('gender').value;

            if (!year || !month || !day || !selectedTime) {
                alert('모든 항목을 입력해주세요!');
                return;
            }

            // 로딩 표시
            document.getElementById('input-form').style.display = 'none';
            document.getElementById('loading').classList.add('show');

            try {
                // 실제 API 호출 (디바이스 ID 포함)
                const response = await fetchWithDeviceId('https://fortune-platform.onrender.com/api/saju', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        year: parseInt(year),
                        month: parseInt(month),
                        day: parseInt(day),
                        hour: selectedTime,
                        isLunar: document.getElementById('lunar-type').value === '음력',
                        gender: gender,
                        category: 'total' // 기본적으로 총운
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
                    birthInfo: { year, month, day, hour: selectedTime },
                    interpretations: {
                        total: data.interpretation // 첫 응답은 총운
                    }
                };

                // 결과 표시
                displayResult(sajuData);
                
                document.getElementById('loading').classList.remove('show');
                document.getElementById('result').classList.add('show');

            } catch (error) {
                console.error('오류:', error);
                alert('사주 계산 중 오류가 발생했습니다: ' + error.message);
                document.getElementById('loading').classList.remove('show');
                document.getElementById('input-form').style.display = 'block';
            }
        }

        // 카테고리 전환 (API 호출)
        async function showCategory(category) {
            currentCategory = category;
            
            // 탭 활성화
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            // 이미 로드된 해석이 있으면 표시
            if (sajuData.interpretations[category]) {
                document.getElementById('interpretation').textContent = sajuData.interpretations[category];
                return;
            }

            // 로딩 표시
            const interpretationEl = document.getElementById('interpretation');
            interpretationEl.innerHTML = '<div style="text-align: center; padding: 20px;">로딩 중...</div>';

            try {
                // API 호출
                const response = await fetch('https://fortune-platform.onrender.com/api/saju', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        year: parseInt(sajuData.birthInfo.year),
                        month: parseInt(sajuData.birthInfo.month),
                        day: parseInt(sajuData.birthInfo.day),
                        hour: sajuData.birthInfo.hour,
                        isLunar: false,
                        gender: sajuData.gender,
                        category: category
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    sajuData.interpretations[category] = data.interpretation;
                    interpretationEl.textContent = data.interpretation;
                } else {
                    interpretationEl.textContent = '해석을 가져오는데 실패했습니다.';
                }

            } catch (error) {
                console.error('카테고리 로드 오류:', error);
                interpretationEl.textContent = '오류가 발생했습니다.';
            }
        }