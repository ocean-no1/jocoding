# 조코딩 프로젝트 저장소

멀티 프로젝트 구조로 관리되는 조코딩 프로젝트 모음입니다.

## 📂 프로젝트 목록

### [프로젝트1 - 로또 & 연금복권 자동화](./프로젝트1/)
로또 6/45와 연금복권 720+의 당첨번호를 자동으로 크롤링하고 AI 기반 통계 분석을 제공하는 웹 애플리케이션입니다.

**주요 기능:**
- ✅ 로또 6/45 최신 당첨번호 자동 업데이트
- ✅ 연금복권 720+ 최신 당첨번호 자동 업데이트
- ✅ GitHub Actions를 통한 자동화된 데이터 갱신 (매주 토/목)
- ✅ S_score 알고리즘 기반 AI 번호 추천
- ✅ 사주팔자 & 관상 분석 행운의 번호

**기술 스택:**
- Python 3.10 (requests, beautifulsoup4)
- JavaScript (ES6+)
- HTML/CSS
- GitHub Actions

[📖 상세 문서 보기](./프로젝트1/README.md)

---

### 프로젝트2
(프로젝트 설명 추가 예정)

---

## 🚀 빠른 시작

각 프로젝트는 독립된 가상환경을 사용합니다.

### 프로젝트1 설정
```bash
cd 프로젝트1
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 로컬 실행
```bash
cd 프로젝트1
python3 scripts/update_lotto_naver.py
# 또는 웹 서버 실행
python3 -m http.server 8000
```

## ⚙️ GitHub Actions 자동화

이 저장소는 GitHub Actions를 통해 자동으로 데이터를 업데이트합니다:

- **로또 6/45**: 매주 토요일 21:30 KST
- **연금복권 720+**: 매주 목요일 21:00 KST

자동화 워크플로우는 `.github/workflows/`에 정의되어 있습니다.

## 📁 디렉토리 구조

```
jocoding/
├── .github/
│   └── workflows/
│       └── update-lottery.yml    # 자동화 워크플로우
├── .gitignore                    # Git 제외 파일 설정
├── requirements.txt              # (삭제됨, 각 프로젝트별 관리)
├── README.md                     # 이 파일
├── 프로젝트1/
│   ├── requirements.txt         # 프로젝트1 전용 의존성
│   ├── README.md                # 프로젝트1 상세 문서
│   ├── scripts/                 # Python 크롤링 스크립트
│   ├── js/                      # JavaScript 파일
│   ├── css/                     # CSS 파일
│   └── *.html                   # HTML 페이지
└── 프로젝트2/
    └── README.md
```

## 🛠 개발 환경

- **Python**: 3.10+
- **Node.js**: (선택사항, 웹 서버용)
- **Git**: 2.0+

## 📝 커밋 컨벤션

- `feat:` 새로운 기능 추가
- `fix:` 버그 수정  
- `refactor:` 코드 리팩토링
- `chore:` 자동 업데이트, 설정 변경
- `docs:` 문서 업데이트

## 🤝 기여

이 프로젝트는 개인 학습 및 연구 목적으로 제작되었습니다.

## 📄 라이선스

MIT License

---

**Created by 조코딩** | 1인 창업가 프로젝트
