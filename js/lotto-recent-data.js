// 로또 6/45 최신 4회차 데이터
// 자동 생성: 2026-01-21 02:28
const LOTTO_RECENT_DATA = {
    "1204": {
        "round": 1204,
        "date": "",
        "numbers": [
            8,
            16,
            28,
            30,
            31,
            44
        ],
        "bonus": 27,
        "prize": 30000000000,
        "winners": 10
    },
    "1205": {
        "round": 1205,
        "date": "",
        "numbers": [
            1,
            4,
            16,
            23,
            31,
            41
        ],
        "bonus": 2,
        "prize": 30000000000,
        "winners": 10
    },
    "1206": {
        "round": 1206,
        "date": "",
        "numbers": [
            1,
            3,
            17,
            26,
            27,
            42
        ],
        "bonus": 23,
        "prize": 30000000000,
        "winners": 10
    },
    "1207": {
        "round": 1207,
        "date": "",
        "numbers": [
            10,
            22,
            24,
            27,
            38,
            45
        ],
        "bonus": 11,
        "prize": 30000000000,
        "winners": 10
    }
};

function getLottoRecentData(round) {
    return LOTTO_RECENT_DATA[round.toString()] || null;
}
