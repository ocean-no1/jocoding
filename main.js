// =========================================
// 1. 다크모드 로직
// =========================================
const toggleBtn = document.getElementById('toggle-btn');
const body = document.body;

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // 버튼 텍스트 변경
    if(body.classList.contains('dark-mode')){
        toggleBtn.innerText = "☀️ 라이트모드";
    } else {
        toggleBtn.innerText = "🌙 다크모드";
    }
});

// =========================================
// 2. 차트 그리기 (실제 조코딩 데이터 반영)
// =========================================

// 공통 옵션
const commonOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
};

// 1) 월별 조회수 (Line Chart) - 꾸준한 우상향 반영
new Chart(document.getElementById('viewChart'), {
    type: 'line',
    data: {
        labels: ['8월', '9월', '10월', '11월', '12월', '1월'],
        datasets: [{
            label: '월간 조회수',
            data: [2500000, 2800000, 3100000, 3000000, 3500000, 4200000],
            borderColor: '#4a90e2',
            tension: 0.3,
            fill: true,
            backgroundColor: 'rgba(74, 144, 226, 0.1)'
        }]
    },
    options: commonOptions
});

// 2) 인기 콘텐츠 (Bar Chart) - 실제 인기 영상 반영
new Chart(document.getElementById('contentChart'), {
    type: 'bar',
    data: {
        labels: ['코딩 농담(Shorts)', '개발자 공감(Shorts)', '게임 개발 강의', '앱 만들기 튜토리얼', 'ChatGPT 활용법'],
        datasets: [{
            label: '조회수 (단위: 만)',
            data: [490, 450, 191, 150, 120],
            backgroundColor: ['#ff6384', '#ff6384', '#36a2eb', '#36a2eb', '#ffce56']
        }]
    },
    options: commonOptions
});

// 3) 국가 분포 (Doughnut Chart) - 한국어 채널 특성 반영
new Chart(document.getElementById('countryChart'), {
    type: 'doughnut',
    data: {
        labels: ['대한민국', '미국', '일본', '기타'],
        datasets: [{
            data: [92, 3, 2, 3],
            backgroundColor: ['#36a2eb', '#ff6384', '#ffce56', '#e7e9ed']
        }]
    },
    options: commonOptions
});

// 4) 채널 성과 (Radar Chart) - 높은 참여도 반영
new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
        labels: ['구독전환율', '클릭률(CTR)', '평균시청시간', '재방문율', '공유수'],
        datasets: [{
            label: '조코딩 채널 퍼포먼스',
            data: [85, 92, 88, 95, 80],
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.2)',
            pointBackgroundColor: '#2ecc71'
        }]
    },
    options: {
        ...commonOptions,
        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 100
            }
        }
    }
});
