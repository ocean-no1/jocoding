// 연금복권 최신 4회차 데이터
// 자동 생성: 2026-01-21 02:47
const PENSION_RECENT_DATA = {
    "573": {
        "round": 573,
        "date": "2024-10-18",
        "group": 4,
        "numbers": [
            3,
            7,
            8,
            8,
            6,
            8
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
    "574": {
        "round": 574,
        "date": "2024-11-14",
        "group": 4,
        "numbers": [
            4,
            4,
            4,
            4,
            3,
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
    "575": {
        "round": 575,
        "date": "2024-09-08",
        "group": 5,
        "numbers": [
            0,
            6,
            8,
            5,
            1,
            6
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
    "576": {
        "round": 576,
        "date": "2022-09-29",
        "group": 4,
        "numbers": [
            7,
            7,
            5,
            5,
            3,
            0
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
