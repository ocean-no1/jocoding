/**
 * 로깅 유틸리티
 * 프로덕션 환경에서는 디버그 로그를 비활성화하고,
 * 개발 환경에서만 활성화합니다.
 */

// 개발 환경 감지
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';

// 조건부 로거
const logger = {
    log: isDevelopment ? console.log.bind(console) : () => {},
    warn: console.warn.bind(console),  // 경고는 항상 표시
    error: console.error.bind(console), // 에러는 항상 표시
    info: isDevelopment ? console.info.bind(console) : () => {}
};

/**
 * 통화 포맷팅
 */
function formatCurrency(amount) {
    return amount.toLocaleString('ko-KR') + '원';
}

/**
 * 로또 번호에 따른 볼 색상 결정
 */
function getBallType(number) {
    if (number <= 10) return 'ball-yellow';
    if (number <= 20) return 'ball-blue';
    if (number <= 30) return 'ball-red';
    if (number <= 40) return 'ball-gray';
    return 'ball-green';
}

/**
 * 로또 볼 HTML 생성
 */
function createBallHTML(number, isBonus = false) {
    const ballClass = isBonus ? 'ball bonus' : 'ball';
    return `<span class="${ballClass}" data-n="${getBallType(number)}">${number}</span>`;
}

/**
 * 여러 로또 볼 HTML 생성
 */
function renderBalls(numbers, isBonus = false) {
    return numbers.map(n => createBallHTML(n, isBonus)).join('');
}

/**
 * 최신 회차 계산 (2002-12-07 기준)
 */
function calculateLatestDrawNo() {
    const firstDrawDate = new Date('2002-12-07');
    const today = new Date();
    const diffTime = Math.abs(today - firstDrawDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    return diffWeeks + 1;
}

/**
 * 두 좌표 사이의 거리 계산 (Haversine formula)
 * @param {number} lat1 - 첫 번째 위도
 * @param {number} lng1 - 첫 번째 경도
 * @param {number} lat2 - 두 번째 위도
 * @param {number} lng2 - 두 번째 경도
 * @returns {number} 거리 (km)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * 특정 반경 내에 있는지 확인
 * @param {number} centerLat - 중심 위도
 * @param {number} centerLng - 중심 경도
 * @param {number} targetLat - 대상 위도
 * @param {number} targetLng - 대상 경도
 * @param {number} radius - 반경 (km)
 * @returns {boolean} 반경 내에 있으면 true
 */
function isWithinRadius(centerLat, centerLng, targetLat, targetLng, radius) {
    const distance = calculateDistance(centerLat, centerLng, targetLat, targetLng);
    return distance <= radius;
}
