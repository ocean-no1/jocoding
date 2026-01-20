// 연금복권 최신 4회차 데이터
// 자동 생성: 2026-01-21 03:17
const PENSION_RECENT_DATA = {
    "295": {
        "round": 295,
        "date": "2025-12-25",
        "group": 3,
        "numbers": [
            7,
            5,
            1,
            2,
            7,
            2
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
    }
};

function getPensionRecentData(round) {
    return PENSION_RECENT_DATA[round.toString()] || null;
}
