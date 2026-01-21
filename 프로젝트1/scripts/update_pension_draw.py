#!/usr/bin/env python3
"""
연금복권 720+ 당첨번호 크롤링 (네이버 기반)
- 동행복권 공식 사이트 차단(WAF) 대응으로 네이버 검색 결과 사용
- fallback-data.js 업데이트
"""

import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime, timedelta

def fetch_pension_lottery(round_no):
    """네이버 검색에서 연금복권 당첨번호 크롤링"""
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
        
        # 정규식으로 당첨번호 추출
        lottery_match = re.search(r'(?:당첨번호|1등\s*당첨번호)[^\d]*(\d+)조\s*(\d{6})', text)
        if not lottery_match:
            lottery_match = re.search(r'(\d+)조\s*(\d{6})', text)
        
        if lottery_match:
            group = int(lottery_match.group(1))
            number_str = lottery_match.group(2)
            numbers = [int(d) for d in number_str]
            
            # 날짜 계산 (298회 = 2026-01-15 기준)
            base_date = datetime(2026, 1, 15)
            date = (base_date - timedelta(weeks=(298 - round_no))).strftime('%Y-%m-%d')
            
            # 보너스 번호는 네이버에서 신뢰할 수 있는 파싱이 어려워 0으로 처리 (숨김)
            bonus = [0, 0, 0, 0, 0, 0]
            
            return {
                'round': round_no,
                'date': date,
                'group': group,
                'numbers': numbers,
                'bonus': bonus
            }
            
        return None
        
    except Exception as e:
        print(f"❌ 크롤링 실패: {e}")
        return None

def update_fallback_pension(pension_data):
    """fallback-data.js의 연금복권 데이터 업데이트"""
    file_path = 'js/fallback-data.js'
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # FALLBACK_PENSION_DATA 블록 찾기 및 교체
        pension_block = f'''const FALLBACK_PENSION_DATA = {{
    round: {pension_data['round']},
    date: "{pension_data['date']}",
    group: {pension_data['group']},
    numbers: {pension_data['numbers']},
    bonus: {pension_data['bonus']}
}};'''
        
        pattern = r'const FALLBACK_PENSION_DATA = \{[^}]+\};'
        content = re.sub(pattern, pension_block, content, flags=re.DOTALL)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {file_path} 연금복권 데이터 업데이트 완료")
        return True
        
    except Exception as e:
        print(f"❌ 파일 업데이트 실패: {e}")
        return False

def main():
    print("=" * 60)
    print("🎰 연금복권 720+ 당첨번호 업데이트 (네이버 소스)")
    print("=" * 60)
    
    # 최신 회차 추정
    start_date = datetime(2020, 5, 7)
    today = datetime.now()
    weeks = (today - start_date).days // 7
    estimated_round = weeks + 1
    
    # 사용자 입력 또는 자동 (CI 환경 고려하여 자동 우선)
    target_round = estimated_round
    # 만약 오늘이 목요일이고 아직 추첨 전이면 -1 (대략적)
    # 여기서는 최신 회차 시도하고 실패하면 -1 시도 로직을 넣을 수도 있지만,
    # 일단 예상 회차로 시도
    
    print(f"\n📡 {target_round}회 당첨번호 조회 중...")
    pension_data = fetch_pension_lottery(target_round)
    
    if not pension_data:
        print(f"❌ {target_round}회 데이터 없음, 이전 회차({target_round-1}) 시도...")
        target_round -= 1
        pension_data = fetch_pension_lottery(target_round)
    
    if not pension_data:
        print("❌ 당첨번호를 가져올 수 없습니다.")
        return False
    
    print(f"\n✅ {pension_data['round']}회 당첨번호 확인:")
    print(f"   조: {pension_data['group']}조")
    print(f"   번호: {'-'.join(map(str, pension_data['numbers']))}")
    
    print(f"\n📝 fallback-data.js 업데이트 중...")
    if not update_fallback_pension(pension_data):
        return False
    
    print("\n✅ 업데이트 완료")
    return True

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
