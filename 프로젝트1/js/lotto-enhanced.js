// Enhanced lotto.html JavaScript with card UI and progressive face reading
// This file contains all the interactive logic for the improved UI

// Global variables for face reading
let faceReadingData = {
    shape: '',
    forehead: '',
    nose: '',
    eyebrow: ''
};
let currentStep = 1;
let selectedTime = '';
let fortuneCompleted = false; // Track fortune analysis completion

// Time card selection handler
document.addEventListener('DOMContentLoaded', function () {
    // Time card selection
    const timeCards = document.querySelectorAll('.time-card');
    timeCards.forEach(card => {
        card.addEventListener('click', function () {
            timeCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = this.dataset.time;
        });
    });

    // Disable face reading section initially
    disableFaceReading();
});

// Progressive face reading selection
function selectFaceFeature(type, value, element) {
    // Save the selection
    faceReadingData[type] = value;

    // Visual feedback
    const parent = element.parentElement;
    parent.querySelectorAll('.face-card, .face-option').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.add('selected');

    // Move to next step after a short delay
    setTimeout(() => {
        if (currentStep < 4) {
            moveToNextStep();
        } else {
            // All steps completed, analyze
            analyzeFaceReading();
        }
    }, 500);
}

function moveToNextStep() {
    // Hide current step
    document.getElementById(`step-${currentStep}`).style.display = 'none';

    // Mark current step as completed
    const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    currentStepEl.classList.remove('active');
    currentStepEl.classList.add('completed');

    // Move to next step
    currentStep++;

    // Show next step
    document.getElementById(`step-${currentStep}`).style.display = 'block';

    // Mark next step as active
    const nextStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    nextStepEl.classList.add('active');
}

async function analyzeFaceReading() {
    // Hide all steps
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step-${i}`).style.display = 'none';
    }

    // Show progress bar
    const progressContainer = document.getElementById('face-progress');
    progressContainer.classList.add('show');

    const progressFill = document.getElementById('progress-fill');

    // Animate progress
    const steps = [
        { percent: 25, text: '얼굴형 분석 중...' },
        { percent: 50, text: '이마 특징 분석 중...' },
        { percent: 75, text: '코와 눈썹 분석 중...' },
        { percent: 100, text: 'AI 번호 생성 중...' }
    ];

    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        progressFill.style.width = step.percent + '%';
        progressFill.textContent = step.percent + '% - ' + step.text;
    }

    // Generate numbers based on face reading
    await new Promise(resolve => setTimeout(resolve, 500));

    const seed =
        faceReadingData.shape.charCodeAt(0) * 1000 +
        faceReadingData.forehead.charCodeAt(0) * 100 +
        faceReadingData.nose.charCodeAt(0) * 10 +
        faceReadingData.eyebrow.charCodeAt(0);

    const numbers = generateLuckyNumbers(seed, 6);

    // Build description
    const shapeMessages = {
        round: '둥근 얼굴형은 원만한 대인관계와 재물운을 상징합니다.',
        square: '사각 얼굴형은 강한 의지력과 리더십을 나타냅니다.',
        oval: '계란형 얼굴은 균형잡힌 운세와 조화를 의미합니다.',
        triangle: '역삼각형 얼굴은 예리한 지성과 창의력을 뜻합니다.'
    };

    const foreheadMessages = {
        wide: '넓은 이마는 풍부한 지혜와 재물운을 상징합니다.',
        narrow: '좁은 이마는 집중력과 실행력이 뛰어남을 나타냅니다.',
        high: '높은 이마는 고귀한 기운과 명예운을 의미합니다.'
    };

    const noseMessages = {
        straight: '곧은 코는 정직함과 성실함을 의미합니다.',
        round: '둥근 코는 온화한 성격과 재물운을 나타냅니다.',
        sharp: '오똑한 코는 강한 의지와 추진력을 상징합니다.'
    };

    const eyebrowMessages = {
        thick: '진한 눈썹은 강한 생명력과 활력을 의미합니다.',
        thin: '얇은 눈썹은 섬세함과 예술적 감각을 나타냅니다.',
        arched: '아치형 눈썹은 리더십과 카리스마를 상징합니다.'
    };

    document.getElementById('face-description').innerHTML = `
        <strong>종합 관상 분석:</strong><br>
        ${shapeMessages[faceReadingData.shape]}<br>
        ${foreheadMessages[faceReadingData.forehead]}<br>
        ${noseMessages[faceReadingData.nose]}<br>
        ${eyebrowMessages[faceReadingData.eyebrow]}<br><br>
        AI가 당신의 관상을 종합 분석하여 최적의 행운의 번호를 추천합니다.
    `;

    document.getElementById('face-numbers').innerHTML = renderBalls(numbers, false);

    // Hide progress, show result
    progressContainer.classList.remove('show');
    document.getElementById('face-result').classList.add('show');

    // Reset for next use
    setTimeout(() => {
        resetFaceReading();
    }, 10000);
}

function resetFaceReading() {
    currentStep = 1;
    faceReadingData = { shape: '', forehead: '', nose: '', eyebrow: '' };

    // Reset steps
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) step.classList.add('active');
    });

    // Show first step
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step-${i}`).style.display = i === 1 ? 'block' : 'none';
    }

    // Clear selections
    document.querySelectorAll('.face-card, .face-option').forEach(el => {
        el.classList.remove('selected');
    });
}

// Enhanced fortune numbers with time card support
function generateFortuneNumbers() {
    const birthDate = document.getElementById('birth-date').value;

    if (!birthDate || !selectedTime) {
        alert('생년월일과 태어난 시간을 모두 선택해주세요.');
        return;
    }

    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const timeSeeds = {
        dawn: 100,
        morning: 200,
        noon: 300,
        afternoon: 400,
        evening: 500,
        night: 600
    };

    const seed = year + month * 100 + day * 10000 + timeSeeds[selectedTime];
    const numbers = generateLuckyNumbers(seed, 6);

    const elements = ['금(金)', '목(木)', '수(水)', '화(火)', '토(土)'];
    const element = elements[year % 5];

    const timeMessages = {
        dawn: '새벽의 고요함 속에서 깊은 통찰력을',
        morning: '아침의 맑은 기운으로 새로운 시작을',
        noon: '한낮의 왕성한 에너지로 활력을',
        afternoon: '오후의 안정된 기운으로 균형을',
        evening: '저녁의 따뜻한 기운으로 풍요를',
        night: '밤의 신비로운 기운으로 행운을'
    };

    document.getElementById('fortune-description').innerHTML = `
        <strong>오행:</strong> ${element}<br>
        <strong>해석:</strong> ${year}년생은 ${element} 기운이 강합니다. 
        ${month}월 ${day}일생은 ${getFortuneMessage(month, day)}
        ${timeMessages[selectedTime]} 가져올 행운의 번호를 추천합니다.
    `;

    document.getElementById('fortune-numbers').innerHTML = renderBalls(numbers, false);
    document.getElementById('fortune-result').classList.add('show');

    // Enable face reading after fortune completion
    fortuneCompleted = true;
    enableFaceReading();
}

// Helper to enable/disable face reading
function disableFaceReading() {
    const section = document.querySelector('.face-reading-section');
    if (!section) return;

    if (!document.querySelector('.disabled-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'disabled-overlay';
        overlay.innerHTML = `
            <div class="disabled-message">
                <p>🔒 관상 분석 잠금</p>
                <small>먼저 사주팔자 행운의 번호를 생성해주세요.<br>관상 분석이 활성화됩니다.</small>
            </div>
        `;
        section.appendChild(overlay);
        section.classList.add('disabled');
    }
}

function enableFaceReading() {
    const section = document.querySelector('.face-reading-section');
    if (!section) return;

    const overlay = document.querySelector('.disabled-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            section.classList.remove('disabled');

            // Show notification
            const notice = document.createElement('div');
            notice.className = 'activation-notice';
            notice.innerHTML = '✨ 관상 분석 기능이 활성화되었습니다!';
            section.insertBefore(notice, section.querySelector('.section-title').nextSibling);

            // Scroll to section
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
}


function getFortuneMessage(month, day) {
    if (month <= 3) return '봄의 기운으로 새로운 시작을 의미합니다.';
    if (month <= 6) return '여름의 열정으로 왕성한 활동력을 나타냅니다.';
    if (month <= 9) return '가을의 결실로 풍요로움을 상징합니다.';
    return '겨울의 지혜로 깊은 사색을 뜻합니다.';
}

// Generate lucky numbers based on seed
function generateLuckyNumbers(seed, count) {
    const numbers = new Set();
    let current = seed;

    while (numbers.size < count) {
        current = (current * 1103515245 + 12345) & 0x7fffffff;
        const num = (current % 45) + 1;
        numbers.add(num);
    }

    return Array.from(numbers).sort((a, b) => a - b);
}

// ============================================
// 지도 관련 함수 (map.html에서 사용)
// ============================================

// 로드뷰 객체를 전역(싱글톤)으로 관리하여 중복 생성 방지
let roadviewObject = null;

/**
 * 로드뷰 초기화 및 표시
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 */
function initRoadview(lat, lng) {
    if (typeof kakao === 'undefined' || !kakao.maps) {
        console.error('Kakao Maps API가 로드되지 않았습니다.');
        return;
    }

    const roadviewContainer = document.getElementById('roadview');

    // 로드뷰 객체가 없으면 최초 1회 생성
    if (!roadviewObject) {
        roadviewObject = new kakao.maps.Roadview(roadviewContainer);
    }

    const roadviewClient = new kakao.maps.RoadviewClient();
    const position = new kakao.maps.LatLng(lat, lng);

    // 반경 50m 내에서 가장 가까운 로드뷰 파노라마 ID 검색
    roadviewClient.getNearestPanoId(position, 50, function (panoId) {
        if (panoId === null) {
            alert('해당 위치 근처에 로드뷰 정보가 없습니다.');
        } else {
            // 컨테이너를 먼저 표시 (렌더링을 위해 필수)
            roadviewContainer.style.display = 'block';

            // 닫기 버튼 표시
            const closeBtn = document.getElementById('roadview-close');
            if (closeBtn) closeBtn.style.display = 'block';

            // PanoId 설정하여 뷰어 실행
            // setPanoId는 비동기적으로 로드뷰를 갱신합니다.
            // 컨테이너가 visible 상태여야 정상적으로 캔버스 크기가 잡힙니다.
            roadviewObject.setPanoId(panoId, position);

            console.log('로드뷰 실행:', lat, lng);
        }
    });
}

/**
 * 주변 마커 강조
 * @param {number} centerLat - 중심 위도
 * @param {number} centerLng - 중심 경도
 * @param {number} radius - 반경 (km)
 * @param {Array} markers - 마커 배열
 * @param {Array} storeData - 판매점 데이터
 */
function highlightNearbyMarkers(centerLat, centerLng, radius, markers, storeData) {
    if (typeof isWithinRadius !== 'function') {
        logger.error('isWithinRadius 함수를 찾을 수 없습니다.');
        return;
    }

    markers.forEach((marker, index) => {
        const store = storeData[index];
        if (!store) return;

        const isNearby = isWithinRadius(centerLat, centerLng, store.lat, store.lng, radius);

        // 마커 강조 효과 (스케일 및 애니메이션)
        // kakao.maps.Marker는 scale 속성이 없으므로, 이미지 변경이나 ZIndex로 효과를 줍니다.
        if (isNearby) {
            marker.setZIndex(100);
            marker.setOpacity(1.0);

            // 기존 이미지를 유지하며 크기만 키우려면 새로 이미지를 설정해야 하는데
            // 여기서는 간단히 opacity와 ZIndex만 조절합니다. 
            // Marker는 setStyle이 없습니다.
        } else {
            marker.setZIndex(store.first >= 3 ? 10 : 1);
            marker.setOpacity(0.7);
        }
    });

    logger.log(`${radius}km 반경 내 마커 강조 완료`);
}

/**
 * 키워드 검색 및 지도 이동
 * @param {string} keyword - 검색 키워드
 * @param {object} map - 카카오맵 객체
 * @param {Array} markers - 마커 배열
 * @param {Array} storeData - 판매점 데이터
 */
function searchAndMove(keyword, map, markers, storeData) {
    if (typeof kakao === 'undefined' || !kakao.maps || !kakao.maps.services) {
        logger.error('Kakao Maps Services API가 로드되지 않았습니다.');
        alert('검색 기능을 사용할 수 없습니다. 페이지를 새로고침해주세요.');
        return;
    }

    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(keyword, function (data, status) {
        if (status === kakao.maps.services.Status.OK) {
            const place = data[0];
            const moveLatLon = new kakao.maps.LatLng(place.y, place.x);

            // 지도 이동 (panTo)
            map.panTo(moveLatLon);

            // 주변 마커 강조 (1km 반경)
            highlightNearbyMarkers(place.y, place.x, 1, markers, storeData);

            logger.log('검색 완료:', keyword, '→', place.place_name);

            // 검색 결과 알림
            alert(`📍 "${place.place_name}"(으)로 이동했습니다.\n주변 1km 이내의 명당을 확인하세요!`);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 없습니다. 다른 키워드를 입력해주세요.');
        } else {
            alert('검색 중 오류가 발생했습니다.');
        }
    });
}


// ============================================
// 고급 통계 분석 도구 함수 (Advanced Stats Tools)
// ============================================

// 1. 미출현 번호 로드 및 생성
let missingNumbers = [];

function loadMissingNumbers() {
    // 실제 데이터가 없으면 랜덤으로 시뮬레이션
    if (missingNumbers.length === 0) {
        // 1~45 중 5~10개를 랜덤으로 미출현 번호로 가정
        const allNums = Array.from({ length: 45 }, (_, i) => i + 1);
        // Shuffle
        for (let i = allNums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allNums[i], allNums[j]] = [allNums[j], allNums[i]];
        }
        missingNumbers = allNums.slice(0, 8).sort((a, b) => a - b);
    }

    // UI 업데이트
    const container = document.getElementById('missingNumbersList');
    if (container) {
        container.innerHTML = missingNumbers.map(n =>
            `<div style="background:#FFF0F0; border:1px solid #FFCDD2; color:#D32F2F; padding:8px; border-radius:6px; text-align:center; font-weight:700;">${n}</div>`
        ).join('');
    }
}

function generateFromMissing() {
    if (missingNumbers.length === 0) loadMissingNumbers();

    // 미출현 번호 중 2개 선택
    const selectedMissing = [];
    const tempMissing = [...missingNumbers];

    // Randomly pick 2 from missing
    for (let i = 0; i < 2; i++) {
        const idx = Math.floor(Math.random() * tempMissing.length);
        selectedMissing.push(tempMissing[idx]);
        tempMissing.splice(idx, 1);
    }

    // 나머지 4개는 전체에서 랜덤 선택 (중복 제외)
    const result = [...selectedMissing];
    while (result.length < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!result.includes(num)) {
            result.push(num);
        }
    }

    result.sort((a, b) => a - b);
    displayGeneratorResult('missingResult', result, '미출현 번호 ' + selectedMissing.join(', ') + ' 포함');
}


// 2. 홀짝 비율 생성
function generateFromOddEven() {
    const ratioStr = document.getElementById('oddEvenRatio').value;
    const [oddCount, evenCount] = ratioStr.split('-').map(Number);

    const result = [];
    const odds = [];
    const evens = [];

    // Generate required odds
    while (odds.length < oddCount) {
        const num = Math.floor(Math.random() * 23) * 2 + 1; // 1, 3, ..., 45
        if (num <= 45 && !odds.includes(num)) {
            odds.push(num);
        }
    }

    // Generate required evens
    while (evens.length < evenCount) {
        const num = Math.floor(Math.random() * 22) * 2 + 2; // 2, 4, ..., 44
        if (num <= 45 && !evens.includes(num)) {
            evens.push(num);
        }
    }

    result.push(...odds, ...evens);
    result.sort((a, b) => a - b);

    displayGeneratorResult('oddEvenResult', result, `홀수 ${oddCount}개 : 짝수 ${evenCount}개 조합`);
}


// 3. 연속 번호 생성
function generateWithConsecutive() {
    const count = parseInt(document.getElementById('consecutiveCount').value);
    const result = [];

    if (count > 0) {
        // Generate consecutive start
        const start = Math.floor(Math.random() * (46 - count)) + 1;
        for (let i = 0; i < count; i++) {
            result.push(start + i);
        }
    }

    // Fill rest
    while (result.length < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!result.includes(num)) {
            result.push(num);
        }
    }

    result.sort((a, b) => a - b);
    displayGeneratorResult('consecutiveResult', result, count > 0 ? `${count}연속 번호 포함` : '연속 번호 없음');
}


// 4. 번호합 범위 생성
function generateBySum() {
    const rangeStr = document.getElementById('sumRange').value;
    const [min, max] = rangeStr.split('-').map(Number);

    let result = [];
    let sum = 0;
    let attempts = 0;

    // Try to find a valid combination
    while (attempts < 1000) {
        const temp = new Set();
        while (temp.size < 6) {
            temp.add(Math.floor(Math.random() * 45) + 1);
        }

        const arr = Array.from(temp).sort((a, b) => a - b);
        const currentSum = arr.reduce((a, b) => a + b, 0);

        if (currentSum >= min && currentSum <= max) {
            result = arr;
            sum = currentSum;
            break;
        }
        attempts++;
    }

    if (result.length === 0) {
        alert('해당 범위의 조합을 찾는데 실패했습니다. 다시 시도해주세요.');
        return;
    }

    displayGeneratorResult('sumResult', result, `번호 합계: ${sum}`);
}


// 5. 구간별 생성
function generateByRange() {
    const ranges = [
        { min: 1, max: 10, count: parseInt(document.getElementById('range1').value) },
        { min: 11, max: 20, count: parseInt(document.getElementById('range2').value) },
        { min: 21, max: 30, count: parseInt(document.getElementById('range3').value) },
        { min: 31, max: 40, count: parseInt(document.getElementById('range4').value) },
        { min: 41, max: 45, count: parseInt(document.getElementById('range5').value) }
    ];

    // 총 개수 확인
    const total = ranges.reduce((acc, curr) => acc + curr.count, 0);
    if (total !== 6) {
        alert('총 선택 개수는 정확히 6개여야 합니다. 현재: ' + total + '개');
        return;
    }

    // 번호 생성
    const result = [];
    ranges.forEach(range => {
        const currentRangeNums = [];
        while (currentRangeNums.length < range.count) {
            const num = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            if (!currentRangeNums.includes(num)) {
                currentRangeNums.push(num);
            }
        }
        result.push(...currentRangeNums);
    });

    result.sort((a, b) => a - b);
    displayGeneratorResult('rangeResult', result, '구간별 맞춤 조합 완료');
}


// 공통 결과 표시 함수
function displayGeneratorResult(elementId, numbers, description) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const ballsHtml = renderBalls(numbers, false);

    container.innerHTML = `
        <div style="background:#F8FAFC; padding:15px; border-radius:12px; border:1px solid #E2E8F0; animation: fadeIn 0.5s;">
            <div style="display:flex; justify-content:center; gap:8px; margin-bottom:10px;">
                ${ballsHtml}
            </div>
            <div style="text-align:center; font-size:0.9rem; color:#64748B; font-weight:600;">
                ✨ ${description}
            </div>
        </div>
    `;
}
