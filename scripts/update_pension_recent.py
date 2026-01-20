#!/usr/bin/env python3
"""
연금복권 최신 4회차 크롤링 및 저장
"""
import requests
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime, timedelta

def fetch_pension_round_from_naver(round_no):
    """네이버 검색에서 특정 회차 연금복권 당첨번호 크롤링"""
    try:
        url = f'https://search.naver.com/search.naver?query=연금복권+{round_no}회'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text()
        
        # "3조 960211" 형태로 찾기
        lottery_match = re.search(r'(\d+)조\s*(\d{6})', text)
        if lottery_match:
            group = int(lottery_match.group(1))
            number_str = lottery_match.group(2)
            numbers = [int(d) for d in number_str]
            
            # 날짜 찾기
            date_match = re.search(r'(\d{4})\.(\d{1,2})\.(\d{1,2})', text)
            if date_match:
                year, month, day = date_match.groups()
                date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
            else:
                date = (datetime.now() - timedelta(weeks=(298 - round_no))).strftime('%Y-%m-%d')
            
            return {
                'round': round_no,
                'date': date,
                'group': group,
                'numbers': numbers,
                'bonus': [0, 0, 0, 0, 0, 0]  # 보너스는 별도 크롤링 필요
            }
        
        return None
        
    except Exception as e:
        print(f"❌ {round_no}회 크롤링 실패: {e}")
        return None

def main():
    print("=" * 60)
    print("🎰 연금복권 최신 4회차 일괄 크롤링")
    print("=" * 60)
    
    # 최신 회차 계산
    start_date = datetime(2015, 1, 8)  # 1회차 추첨일
    today = datetime.now()
    weeks = (today - start_date).days // 7
    latest_round = weeks + 1
    
    print(f"\n📡 예상 최신 회차: {latest_round}회")
    print(f"📡 크롤링 대상: {latest_round-3}회 ~ {latest_round}회")
    
    pension_data = {}
    
    for round_no in range(latest_round - 3, latest_round + 1):
        print(f"\n🔍 {round_no}회 크롤링 중...")
        data = fetch_pension_round_from_naver(round_no)
        
        if data:
            print(f"   ✅ {data['group']}조 {''.join(map(str, data['numbers']))}")
            pension_data[str(round_no)] = data
        else:
            print(f"   ❌ 데이터 없음")
    
    # JSON 파일로 저장
    if pension_data:
        output_file = 'js/pension-recent-data.js'
        
        js_content = f'''// 연금복권 최신 4회차 데이터
// 자동 생성: {datetime.now().strftime('%Y-%m-%d %H:%M')}
const PENSION_RECENT_DATA = {json.dumps(pension_data, indent=4, ensure_ascii=False)};

function getPensionRecentData(round) {{
    return PENSION_RECENT_DATA[round.toString()] || null;
}}
'''
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"\n✅ {output_file} 저장 완료")
        print(f"✅ 총 {len(pension_data)}개 회차 데이터 수집")
        
        return True
    
    print("\n❌ 크롤링 실패")
    return False

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
