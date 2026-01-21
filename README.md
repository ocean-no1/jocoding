# 조코딩 프로젝트 저장소

멀티 프로젝트 구조로 관리되는 조코딩 프로젝트 모음입니다.

## 프로젝트 목록

### 프로젝트1 - 로또 & 연금복권 자동화
로또 6/45와 연금복권 720+의 당첨번호를 자동으로 크롤링하고 업데이트하는 웹 애플리케이션입니다.

**주요 기능:**
- 로또 6/45 최신 당첨번호 자동 업데이트
- 연금복권 720+ 최신 당첨번호 자동 업데이트
- GitHub Actions를 통한 자동화된 데이터 갱신
- 네이버 검색 기반 크롤링

**기술 스택:**
- Python 3.10 (requests, beautifulsoup4)
- JavaScript (ES6+)
- HTML/CSS
- GitHub Actions

### 프로젝트2
(프로젝트 설명 추가 예정)

## 개발 환경 설정

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
source .venv/bin/activate
python3 scripts/update_lotto_naver.py
python3 scripts/update_pension_naver.py
```

## 자동화

GitHub Actions를 통해 매주 자동으로 당첨번호를 업데이트합니다:
- **로또 6/45**: 매주 토요일 21:30 KST
- **연금복권 720+**: 매주 목요일 21:00 KST

## 라이선스

이 프로젝트는 개인 학습 및 연구 목적으로 제작되었습니다.
