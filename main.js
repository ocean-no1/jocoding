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
// 2. 차트 그리기 (Chart.js 설정)
// =========================================

// 공통 옵션
const commonOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
};

// 1) 월별 조회수 (Line Chart)
new Chart(document.getElementById('viewChart'), {
    type: 'line',
    data: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
        datasets: [{
            label: '조회수',
            data: [12000, 19000, 30000, 50000, 65000, 84000],
            borderColor: '#4a90e2',
            tension: 0.3,
            fill: true
        }]
    },
    options: commonOptions
});

// 2) 인기 콘텐츠 (Bar Chart)
new Chart(document.getElementById('contentChart'), {
    type: 'bar',
    data: {
        labels: ['ChatGPT 앱 만들기', '코딩 기초 강의', 'IT 트렌드 분석', '개발자 취업 현실', 'AI 이미지 생성'],
        datasets: [{
            label: '조회수',
            data: [5000, 4200, 3800, 2900, 1500],
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
        }]
    },
    options: commonOptions
});

// 3) 국가 분포 (Doughnut Chart)
new Chart(document.getElementById('countryChart'), {
    type: 'doughnut',
    data: {
        labels: ['한국', '미국', '일본', '기타'],
        datasets: [{
            data: [70, 15, 10, 5],
            backgroundColor: ['#36a2eb', '#ff6384', '#ffce56', '#e7e9ed']
        }]
    },
    options: commonOptions
});

// 4) 채널 성과 (Radar Chart)
new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
        labels: ['구독전환율', '클릭률', '시청시간', '댓글수', '공유수'],
        datasets: [{
            label: '조코딩 채널',
            data: [80, 90, 70, 60, 85],
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.2)'
        }]
    },
    options: commonOptions
});