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


// --- Social Sharing Functions ---

// Kakao Init Flag
let isKakaoInitialized = false;

function initKakao() {
    if (isKakaoInitialized) return;
    if (typeof Kakao !== 'undefined') {
        if (!Kakao.isInitialized()) {
            Kakao.init('8c78a44cbc45fec0aa35705516f1a082'); // User's API Key
        }
        isKakaoInitialized = true;
    }
}

// Share to KakaoTalk
function shareToKakao() {
    initKakao();
    if (!isKakaoInitialized) {
        alert('카카오톡 공유 기능을 불러오지 못했습니다.');
        return;
    }

    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '🤑 AI가 분석한 로또 1등 당첨 번호는?',
            description: '20년치 빅데이터 분석! 이번 주 내 행운의 번호를 지금 확인해보세요.',
            imageUrl: 'https://publiclensk.org/lotto_logo.png', // Fallback to PNG for now
            link: {
                mobileWebUrl: 'https://publiclensk.org',
                webUrl: 'https://publiclensk.org',
            },
        },
        buttons: [
            {
                title: '💰 내 번호 확인하기',
                link: {
                    mobileWebUrl: 'https://publiclensk.org',
                    webUrl: 'https://publiclensk.org',
                },
            },
        ],
    });
}

// Share to Twitter (X)
function shareToTwitter() {
    const text = "💰 로또 1등의 꿈, AI가 분석해드립니다! 이번 주 당첨 번호 미리 확인하세요. #로또명당 #AI로또 #동행복권";
    const url = "https://publiclensk.org";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

// Share to Facebook
function shareToFacebook() {
    const url = "https://publiclensk.org";
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

// Copy URL to Clipboard
async function copyUrl() {
    try {
        await navigator.clipboard.writeText("https://publiclensk.org");
        showToast("링크가 복사되었습니다! 친구에게 공유해보세요.");
    } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = "https://publiclensk.org";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast("링크가 복사되었습니다!");
    }
}

// Toast Notification
function showToast(message) {
    // Create toast element if not exists
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 1000;
            font-size: 0.95rem;
            transition: opacity 0.3s;
            opacity: 0;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}
