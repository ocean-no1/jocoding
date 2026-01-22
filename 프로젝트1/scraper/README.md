# 로또 명당 데이터 크롤러

동행복권 공식 사이트에서 당첨 판매점 정보를 자동 수집합니다.

## 🚀 빠른 시작

### 1. 패키지 설치
```bash
pip install -r requirements.txt
```

### 2. 스크립트 실행
```bash
python lotto_store_scraper.py
```

### 3. 결과 확인
- `lottery_stores.csv` 파일 생성됨
- Google Sheets에 복사-붙여넣기

## 📊 출력 형식

| name | address | lat | lng | first | second | lastUpdated |
|------|---------|-----|-----|-------|--------|-------------|
| 판매점명 | 주소 | 위도 | 경도 | 1등횟수 | 2등횟수 | 날짜 |

## ⚙️ 설정

- **API 제한**: 상위 20개 판매점만 처리 (Kakao API 무료 티어)
- **딜레이**: 0.15초/요청 (API 제한 방지)

## 🔑 API 키

Kakao REST API 키가 필요합니다:
https://developers.kakao.com

현재 스크립트에는 카카오맵에서 사용 중인 키가 포함되어 있습니다.
