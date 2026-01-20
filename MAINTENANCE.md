# 유지보수 가이드

## 📌 주간 당첨번호 업데이트

매주 토요일 로또 추첨 후, 최신 당첨번호를 반영해야 합니다.

### 자동 업데이트 (추천)

```bash
# 1. 스크립트 실행
python3 scripts/update_latest_draw.py

# 2. Git 반영 (스크립트가 안내하는 명령어 실행)
git add js/fallback-data.js
git commit -m "chore: {회차}회 당첨번호 자동 업데이트"
git push origin main
```

### 수동 업데이트

1. **동행복권 사이트에서 당첨번호 확인**
   - https://dhlottery.co.kr

2. **파일 수정: `js/fallback-data.js`**
   ```javascript
   const FALLBACK_LOTTO_DATA = {
       drwNo: 1207,              // 회차
       drwNoDate: "2026-01-17",  // 추첨일
       drwtNo1: 10,              // 당첨번호 1~6
       drwtNo2: 22,
       drwtNo3: 24,
       drwtNo4: 27,
       drwtNo5: 38,
       drwtNo6: 45,
       bnusNo: 11,               // 보너스 번호
       // ...
   };
   ```

3. **Git 반영**
   ```bash
   git add js/fallback-data.js
   git commit -m "fix: {회차}회 당첨번호 수동 업데이트"
   git push origin main
   ```

## 🔄 20년 통계 데이터 갱신

역대 당첨 데이터를 갱신할 때 (월 1회 권장):

```bash
# 1. 최신 데이터 다운로드
curl -o lotto_history_raw.json https://smok95.github.io/lotto/results/all.json

# 2. stats-data.js 재생성
python3 scripts/convert_data.py

# 3. 임시 파일 삭제
rm lotto_history_raw.json

# 4. Git 반영
git add js/stats-data.js
git commit -m "chore: 역대 통계 데이터 갱신"
git push origin main
```

## 📊 연금복권 업데이트

### 자동 업데이트 (추천)

```bash
# 크롤링 스크립트 실행 (매주 목요일 추첨 후)
python3 scripts/update_pension_draw.py

# Git 반영
git add js/fallback-data.js
git commit -m "chore: {회차}회 연금복권 당첨번호 업데이트"
git push origin main
```

### 수동 업데이트

연금복권 당첨번호는 `js/fallback-data.js`의 `FALLBACK_PENSION_DATA` 수정:

```javascript
const FALLBACK_PENSION_DATA = {
    round: 298,
    date: "2026-01-15",
    group: 3,                    // 조 번호
    numbers: [0, 9, 6, 0, 2, 1], // 당첨번호 6자리
    bonus: [4, 9, 2, 8, 4, 5]    // 보너스 번호 6자리
};
```

## ⚠️ API 차단 문제 해결

동행복권 API가 WSL 또는 일부 환경에서 차단될 수 있습니다.

**해결 방법:**
1. **Windows 네이티브 환경에서 실행** (추천)
   ```powershell
   python scripts\update_latest_draw.py
   ```

2. **수동 업데이트**
   - 동행복권 사이트에서 확인: https://dhlottery.co.kr
   - `js/fallback-data.js` 직접 수정

3. **GitHub Actions 자동화** (향후 구현 가능)
   - 매주 토요일 21:30 자동 실행
   - PR 생성으로 검토 후 병합

## 🚀 배포 전 체크리스트

- [ ] 로컬 서버 테스트: `python3 -m http.server 8000`
- [ ] 브라우저 LocalStorage 초기화 (F12 → Application → Clear)
- [ ] index.html에서 최신 당첨번호 확인
- [ ] lotto.html에서 통계 데이터 정상 로딩 확인
- [ ] Git 푸시 완료 확인

## 📝 Git 커밋 메시지 규칙

```
feat: 새 기능 추가
fix: 버그 수정
chore: 데이터 업데이트, 빌드 설정 등
docs: 문서 수정
style: UI 스타일 변경
refactor: 코드 리팩토링
```

## 🔗 유용한 링크

- 동행복권 공식: https://dhlottery.co.kr
- GitHub 저장소: https://github.com/ocean-no1/jocoding
- API 엔드포인트: `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo={회차}`
