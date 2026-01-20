#!/usr/bin/env python3
"""
연금복권 웹사이트 HTML 구조 디버깅 스크립트
"""
import requests
from bs4 import BeautifulSoup

url = 'https://dhlottery.co.kr/gameResult.do?method=win720'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
}

response = requests.get(url, headers=headers, timeout=10)
soup = BeautifulSoup(response.text, 'html.parser')

# HTML 구조 출력
print("=" * 80)
print("HTML 구조 분석")
print("=" * 80)

# 회차 정보
print("\n1. 회차 정보:")
titles = soup.select('h4')
for i, title in enumerate(titles[:3]):
    print(f"   {i}: {title.get_text(strip=True)}")

# 조 번호
print("\n2. 조 번호 (badge):")
badges = soup.select('.badge')
for i, badge in enumerate(badges[:5]):
    print(f"   {i}: {badge.get_text(strip=True)}")

# 숫자들
print("\n3. 숫자 표시:")
numbers = soup.select('span.ball')
for i, num in enumerate(numbers[:20]):
    print(f"   {i}: {num.get_text(strip=True)}")

# win_result 전체 구조
print("\n4. win_result 구조:")
win_results = soup.select('.win_result')
print(f"   총 {len(win_results)}개 섹션")
if win_results:
    print("   첫 번째 섹션 텍스트:")
    print(win_results[0].get_text()[:300])
