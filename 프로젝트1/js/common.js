// Common JavaScript functions
// Multiple CORS proxies for fallback
const PROXY_CHAIN = [
    'https://api.allorigins.win/get?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
];

const CACHE_KEY_PREFIX = 'lotto_cache_';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

// Fetch with timeout
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Try multiple proxies with fallback
async function fetchLottoData(drawNo) {
    const cacheKey = CACHE_KEY_PREFIX + drawNo;

    // 1. Check LocalStorage cache
    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
                console.log('📦 Using cached data for draw', drawNo);
                return data;
            }
        }
    } catch (e) {
        console.warn('Cache read failed:', e);
    }

    // 2. Try each proxy in the chain
    const targetUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drawNo}`;

    for (let i = 0; i < PROXY_CHAIN.length; i++) {
        const proxy = PROXY_CHAIN[i];
        try {
            console.log(`🔄 Trying proxy ${i + 1}/${PROXY_CHAIN.length}:`, proxy);
            const proxyUrl = proxy + encodeURIComponent(targetUrl);
            const response = await fetchWithTimeout(proxyUrl, 5000);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const proxyData = await response.json();

            // Different proxies have different response formats
            let data;
            if (proxyData.contents) {
                // AllOrigins format
                data = JSON.parse(proxyData.contents);
            } else if (proxyData.returnValue) {
                // Direct format
                data = proxyData;
            } else {
                throw new Error('Unknown response format');
            }

            if (data.returnValue === 'success') {
                // Cache the successful result
                try {
                    localStorage.setItem(cacheKey, JSON.stringify({
                        data: data,
                        timestamp: Date.now()
                    }));
                } catch (e) {
                    console.warn('Cache write failed:', e);
                }

                console.log('✅ Data fetched successfully via proxy', i + 1);
                return data;
            }
        } catch (error) {
            console.warn(`❌ Proxy ${i + 1} failed:`, error.message);
            // Continue to next proxy
        }
    }

    // 3. All proxies failed - return null to trigger fallback
    console.error('❌ All proxies failed for draw', drawNo);
    return null;
}

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

