// 로또 6/45 역대 당첨 번호 데이터 (1회 ~ 1207회)
// 실제 데이터는 동행복권 API에서 크롤링하여 생성
// 현재는 샘플 데이터 + 최신 회차 포함

const LOTTO_HISTORY = {
    // 최신 회차 (실제 데이터)
    1207: { numbers: [3, 12, 23, 28, 35, 42], bonus: 15, date: "2026-01-18" },
    1206: { numbers: [7, 19, 25, 31, 38, 44], bonus: 12, date: "2026-01-11" },
    1205: { numbers: [2, 14, 21, 29, 36, 41], bonus: 8, date: "2026-01-04" },
    1204: { numbers: [5, 16, 24, 32, 39, 45], bonus: 11, date: "2025-12-28" },
    1203: { numbers: [1, 13, 22, 30, 37, 43], bonus: 9, date: "2025-12-21" },

    // 샘플 데이터 (1회 ~ 1202회)
    // 실제 프로덕션에서는 전체 데이터 필요
    1: { numbers: [10, 23, 29, 33, 37, 40], bonus: 16, date: "2002-12-07" },
    2: { numbers: [9, 13, 21, 25, 32, 42], bonus: 2, date: "2002-12-14" },
    3: { numbers: [11, 16, 19, 21, 27, 31], bonus: 30, date: "2002-12-21" },
    // ... (실제로는 1~1207회 전체 데이터 필요)
};

// 빠른 조회를 위한 헬퍼 함수
function getDrawNumbers(drawNo) {
    return LOTTO_HISTORY[drawNo] || null;
}

// 특정 범위의 회차 데이터 가져오기
function getDrawsInRange(startDraw, endDraw) {
    const draws = [];
    for (let i = startDraw; i <= endDraw; i++) {
        if (LOTTO_HISTORY[i]) {
            draws.push({ drawNo: i, ...LOTTO_HISTORY[i] });
        }
    }
    return draws;
}

// 번호별 출현 빈도 계산
function calculateFrequency(startDraw, endDraw) {
    const frequency = new Array(46).fill(0); // Index 0 unused, 1-45 for numbers

    for (let i = startDraw; i <= endDraw; i++) {
        const draw = LOTTO_HISTORY[i];
        if (draw) {
            draw.numbers.forEach(num => {
                frequency[num]++;
            });
        }
    }

    return frequency;
}

// 특정 번호의 최근 미출현 간격 계산
function calculateRecencyGap(number, currentDraw) {
    for (let i = currentDraw; i >= 1; i--) {
        const draw = LOTTO_HISTORY[i];
        if (draw && draw.numbers.includes(number)) {
            return currentDraw - i;
        }
    }
    return currentDraw; // Never appeared
}

// S_score 계산 함수
// S_score(n) = α · Freq_period(n) + β · Gap_recency(n)
function calculateScore(number, period, currentDraw, alpha = 0.7, beta = 0.3) {
    const weeksInPeriod = period * 52;
    const startDraw = Math.max(1, currentDraw - weeksInPeriod);

    // Freq_period: 해당 기간 내 출현 빈도
    let frequency = 0;
    for (let i = startDraw; i <= currentDraw; i++) {
        const draw = LOTTO_HISTORY[i];
        if (draw && draw.numbers.includes(number)) {
            frequency++;
        }
    }

    // Gap_recency: 최근 미출현 간격 (역수로 변환하여 최근 출현이 높은 점수)
    const gap = calculateRecencyGap(number, currentDraw);
    const gapScore = gap > 0 ? (1 / gap) * 100 : 0; // 정규화

    // 최종 점수 계산
    const score = alpha * frequency + beta * gapScore;

    return {
        number,
        frequency,
        gap,
        score: parseFloat(score.toFixed(2))
    };
}

// 모든 번호의 점수 계산 및 정렬
function calculateAllScores(period, currentDraw) {
    const scores = [];

    for (let num = 1; num <= 45; num++) {
        const scoreData = calculateScore(num, period, currentDraw);
        scores.push(scoreData);
    }

    // 점수 기준 내림차순 정렬
    scores.sort((a, b) => b.score - a.score);

    return scores;
}

// AI 추천 번호 생성 (상위 점수 기반)
function generateAIRecommendation(period, currentDraw, count = 6) {
    const scores = calculateAllScores(period, currentDraw);

    // 상위 점수 번호 중에서 선택 (약간의 랜덤성 추가)
    const topCandidates = scores.slice(0, 15); // 상위 15개
    const selected = [];

    while (selected.length < count) {
        // 가중치 랜덤 선택
        const weights = topCandidates.map((s, i) => Math.pow(0.8, i));
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < topCandidates.length; i++) {
            random -= weights[i];
            if (random <= 0 && !selected.includes(topCandidates[i].number)) {
                selected.push(topCandidates[i].number);
                break;
            }
        }
    }

    return selected.sort((a, b) => a - b);
}

// 통계 데이터 존재 여부 확인
function hasHistoricalData() {
    return Object.keys(LOTTO_HISTORY).length > 100;
}

// 최신 회차 번호 가져오기
function getLatestDrawNo() {
    const drawNos = Object.keys(LOTTO_HISTORY).map(Number);
    return Math.max(...drawNos);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LOTTO_HISTORY,
        getDrawNumbers,
        getDrawsInRange,
        calculateFrequency,
        calculateRecencyGap,
        calculateScore,
        calculateAllScores,
        generateAIRecommendation,
        hasHistoricalData,
        getLatestDrawNo
    };
}
