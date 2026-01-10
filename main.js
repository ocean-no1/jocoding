// Chart.js 기본 설정 (폰트 색상 등)
        Chart.defaults.color = '#9a9a9a';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

        // 1. 조회수 추이 (Line Chart)
        new Chart(document.getElementById('viewChart'), {
            type: 'line',
            data: {
                labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
                datasets: [{
                    label: '조회수',
                    data: [15000, 22000, 35000, 48000, 60000, 84000],
                    borderColor: '#1d8cf8', // 파란색
                    backgroundColor: 'rgba(29, 140, 248, 0.2)',
                    fill: true,
                    tension: 0.4 // 곡선 부드럽게
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 2. 인기 콘텐츠 (Bar Chart)
        new Chart(document.getElementById('contentChart'), {
            type: 'bar',
            data: {
                labels: ['서울 부동산 분석', '로또 번호의 비밀', '교통 데이터 시각화', '편의점 꿀조합', '한강 라면 지도'],
                datasets: [{
                    label: '조회수',
                    data: [12000, 19000, 8000, 15000, 9500],
                    backgroundColor: [
                        '#e14eca', '#1d8cf8', '#00f2c3', '#ff8d72', '#ff5b5b'
                    ],
                    borderRadius: 5
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                indexAxis: 'y' // 가로 막대 그래프로 변경
            }
        });

        // 3. 국가 분포 (Doughnut Chart)
        new Chart(document.getElementById('countryChart'), {
            type: 'doughnut',
            data: {
                labels: ['한국', '미국', '일본', '베트남', '기타'],
                datasets: [{
                    data: [65, 15, 10, 5, 5],
                    backgroundColor: ['#1d8cf8', '#e14eca', '#00f2c3', '#ff8d72', '#888'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 4. 성과 지표 (Radar Chart)
        new Chart(document.getElementById('radarChart'), {
            type: 'radar',
            data: {
                labels: ['클릭률', '시청지속시간', '좋아요', '댓글', '공유'],
                datasets: [{
                    label: '내 채널',
                    data: [85, 70, 90, 60, 50],
                    backgroundColor: 'rgba(225, 78, 202, 0.2)',
                    borderColor: '#e14eca',
                    pointBackgroundColor: '#e14eca'
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { r: { suggestMin: 0, suggestMax: 100 } }
            }
        });