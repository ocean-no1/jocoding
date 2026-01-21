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
