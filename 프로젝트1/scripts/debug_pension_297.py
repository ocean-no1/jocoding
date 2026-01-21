#!/usr/bin/env python3
"""
네이버 연금복권 검색 결과 디버깅
"""
import requests
from bs4 import BeautifulSoup
import re

round_no = 298

url = f'https://search.naver.com/search.naver?query=연금복권+{round_no}회'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

response = requests.get(url, headers=headers, timeout=10)
soup = BeautifulSoup(response.text, 'html.parser')
text = soup.get_text()

print(f"=== {round_no}회 검색 결과 텍스트 ===\n")

# 회차번호 근처 텍스트 추출
pattern = f'{round_no}회'
idx = text.find(pattern)
if idx != -1:
    start = max(0, idx - 100)
    end = min(len(text), idx + 200)
    context = text[start:end]
    print(f"회차번호 주변 텍스트:\n{context}\n")
    print("=" * 60)

# 날짜 패턴 모두 찾기
dates = re.findall(r'(\d{4})\.(\d{1,2})\.(\d{1,2})', text)
print(f"\n발견된 모든 날짜 패턴:")
for i, (y, m, d) in enumerate(dates[:10], 1):
    print(f"{i}. {y}-{m.zfill(2)}-{d.zfill(2)}")
