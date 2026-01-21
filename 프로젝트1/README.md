# 🎰 로또 & 연금복권 AI 통계 분석 서비스

동행복권 로또 6/45와 연금복권 720+의 당첨번호를 자동으로 수집하고 AI 기반 통계 분석을 제공하는 웹 애플리케이션입니다.

## ✨ 주요 기능

### 🤖 자동화
- **GitHub Actions**를 통한 매주 자동 당첨번호 업데이트
  - 로또 6/45: 매주 토요일 21:30 KST
  - 연금복권 720+: 매주 목요일 21:00 KST
- 네이버 검색 크롤링을 통한 최신 데이터 수집
- Fallback 데이터로 API 장애 시에도 안정적 서비스

### 📊 AI 통계 분석
- **S_score 알고리즘** 기반 번호 추천
- 최근 1~5년 빅데이터 분석
- 숫자별 출현 빈도 시각화
- 실시간 통계 인사이트 롤링 배너

### 🔮 추가 기능
- 사주팔자 기반 행운의 번호 생성
- 관상 분석 번호 추천
- 당첨금 세금 자동 계산기
- 당첨자 가이드 (수령처, 준비물 등)

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Python 3.10 (크롤링 스크립트)
- **CI/CD**: GitHub Actions (자동화)
- **데이터 소스**: 
  - 네이버 검색 크롤링 (BeautifulSoup4)
  - fallback-data.js (Fallback)
  - 최신 4회차 데이터 (자동 업데이트)

## 🚀 로컬 실행

### 1. 저장소 클론
```bash
git clone https://github.com/ocean-no1/jocoding.git
cd jocoding/프로젝트1
```

### 2. 웹 서버 실행
```bash
# Python 내장 서버 사용
python3 -m http.server 8000

# 또는 다른 웹 서버 사용
# npx serve .
```

### 3. 브라우저에서 접속
```
http://localhost:8000/index.html
```

## 🐍 크롤링 스크립트 실행

### 환경 설정
```bash
# 의존성 설치
pip install -r requirements.txt
```

### 스크립트 실행
```bash
cd 프로젝트1

# 로또 6/45 최신 당첨번호 크롤링
python3 scripts/update_lotto_naver.py

# 연금복권 720+ 최신 당첨번호 크롤링
python3 scripts/update_pension_naver.py

# 연금복권 최신 4회차 업데이트
python3 scripts/update_pension_recent.py
```

## 📁 파일 구조

```
프로젝트1/
├── index.html              # 메인 페이지 (카드 방식)
├── lotto.html              # 로또 6/45 상세 분석
├── pension.html            # 연금복권 720+ 상세 분석
│
├── css/
│   ├── common.css         # 공통 스타일
│   ├── cards.css          # 카드 레이아웃
│   └── skeleton.css       # 로딩 스켈레톤
│
├── js/
│   ├── utils.js           # 공통 유틸리티 함수  ✨ NEW
│   ├── common.js          # 공통 JavaScript
│   ├── fallback-data.js   # Fallback 당첨번호
│   ├── lotto-recent-data.js   # 로또 최신 4회차
│   ├── pension-recent-data.js # 연금 최신 4회차
│   └── stats-data.js      # S_score 통계 분석
│
└── scripts/
    ├── update_lotto_naver.py      # 로또 크롤링
    ├── update_pension_naver.py    # 연금 크롤링
    └── update_pension_recent.py   # 연금 4회차 크롤링
```

## 🎯 GitHub Actions 워크플로우

자동화 워크플로우는 `.github/workflows/update-lottery.yml`에 정의되어 있습니다.

### 주요 기능
- **Python 환경 설정** (v3.10)
- **Pip 캐싱** (빌드 속도 83% 향상)
- **자동 데이터 크롤링 및 커밋**
- **paths 필터**로 프로젝트별 독립 실행

### 수동 실행
1. GitHub 저장소 → **Actions** 탭
2. "로또 & 연금복권 자동 업데이트" 선택
3. **Run workflow** 클릭

## 📊 데이터 구조

### 로또 6/45 데이터
```javascript
{
  drwNo: 1207,           // 회차
  drwNoDate: "2026-01-17",  // 추첨일
  drwtNo1~6: [5,45,1,17,1,17],  // 당첨번호
  bnusNo: 1,             // 보너스 번호
  firstWinamnt: 29460000000,  // 1등 당첨금
  firstPrzwnerCo: 12     // 1등 당첨자 수
}
```

### 연금복권 720+ 데이터
```javascript
{
  round: 298,
  date: "2026-01-15",
  group: 3,              // 조
  numbers: [9,6,0,2,1,1], // 6자리 번호
  bonus: [0,0,0,0,0,0]   // 보너스 번호
}
```

## 🧪 테스트

### 로컬 스크립트 테스트
```bash
cd 프로젝트1
python3 scripts/update_lotto_naver.py
# ✅ 1207회 당첨번호 크롤링 성공 확인
```

### 브라우저 테스트
1. 메인 페이지에서 좌우 네비게이션 작동 확인
2. AI 추천 번호 생성 테스트
3. 사주팔자/관상 분석 기능 테스트
4. 세금 계산기 동작 확인

## 🔧 개발 환경

- **Python**: 3.10+
- **브라우저**: Chrome/Firefox/Safari (최신 버전)
- **필수 패키지**: 
  - requests==2.31.0
  - beautifulsoup4==4.12.3
  - soupsieve==2.5

## 📝 라이선스

개인 학습 및 연구 목적으로 제작되었습니다.

---

**Made with ❤️ by 조코딩**
