// 연금복권 최신 4회차 데이터
// 자동 생성: 2026-01-22 01:02
const PENSION_RECENT_DATA = {
    "296": {
        "round": 296,
        "date": "2026-01-01",
        "group": 1,
        "numbers": [
            6,
            6,
            7,
            9,
            7,
            5
        ],
        "bonus": [
            0,
            0,
            0,
            0,
            0,
            0
        ]
    },
    "297": {
        "round": 297,
        "date": "2026-01-08",
        "group": 1,
        "numbers": [
            3,
            9,
            4,
            7,
            7,
            9
        ],
        "bonus": [
            0,
            0,
            0,
            0,
            0,
            0
        ]
    },
    "298": {
        "round": 298,
        "date": "2026-01-15",
        "group": 3,
        "numbers": [
            9,
            6,
            0,
            2,
            1,
            1
        ],
        "bonus": [
            0,
            0,
            0,
            0,
            0,
            0
        ]
    },
    "299": {
        "round": 299,
        "date": "2026-01-22",
        "group": 1,
        "numbers": [
            6,
            6,
            0,
            4,
            5,
            9
        ],
        "bonus": [
            0,
            0,
            0,
            0,
            0,
            0
        ]
    }
};

function getPensionRecentData(round) {
    return PENSION_RECENT_DATA[round.toString()] || null;
}
