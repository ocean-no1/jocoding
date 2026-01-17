// Common JavaScript functions
const CORS_PROXY = 'https://corsproxy.io/?';

// Calculate latest draw number based on date
function calculateLatestDrawNo() {
    const startDate = new Date('2002-12-07'); // First Lotto draw
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    return diffWeeks + 1;
}

// Get ball type for color
function getBallType(n) {
    if (n <= 10) return 1;
    if (n <= 20) return 2;
    if (n <= 30) return 3;
    if (n <= 40) return 4;
    return 5;
}

// Create ball HTML
function createBallHTML(n, isAnimated = true) {
    const animClass = isAnimated ? 'animate' : '';
    const delay = isAnimated ? `style="animation-delay: ${Math.random() * 0.3}s"` : '';
    return `<span class="ball ${animClass}" data-n="${getBallType(n)}" ${delay}>${n}</span>`;
}

// Render balls array
function renderBalls(numbers, isAnimated = true) {
    return numbers.map(n => createBallHTML(n, isAnimated)).join('');
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
