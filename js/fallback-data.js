// Fallback data for when API calls fail
// Updated: 2026-01-20 (실제 공식 당첨번호 반영)
const FALLBACK_LOTTO_DATA = {
    drwNo: 1207,
    drwNoDate: "2026-01-17",
    drwtNo1: 10,
    drwtNo2: 22,
    drwtNo3: 24,
    drwtNo4: 27,
    drwtNo5: 38,
    drwtNo6: 45,
    bnusNo: 11,
    firstWinamnt: 29460000000,
    firstPrzwnerCo: 12,
    returnValue: "success"
};

const FALLBACK_PENSION_DATA = {
    round: 298,
    date: "2026-01-15",
    group: 3,
    numbers: [9, 6, 0, 2, 1, 1],  // 실제 공식 당첨번호
    bonus: [0, 0, 0, 0, 0, 0]     // 보너스 각조
};

// Get fallback data - check LocalStorage first for latest successful fetch
function getFallbackLottoData() {
    try {
        const latestFallback = localStorage.getItem('latest_fallback_lotto');
        if (latestFallback) {
            const { data, timestamp } = JSON.parse(latestFallback);
            // Use LocalStorage fallback if it's less than 7 days old
            if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
                console.log('📦 Using LocalStorage fallback data');
                return data;
            }
        }
    } catch (e) {
        console.warn('Failed to read LocalStorage fallback:', e);
    }

    // Use hardcoded fallback as last resort
    console.log('📦 Using hardcoded fallback data');
    return JSON.parse(JSON.stringify(FALLBACK_LOTTO_DATA));
}

function getFallbackPensionData() {
    return JSON.parse(JSON.stringify(FALLBACK_PENSION_DATA));
}
