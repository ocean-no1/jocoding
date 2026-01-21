#!/usr/bin/env python3
"""
연금복권 720+ 당첨번호 크롤링 및 업데이트 스크립트
- 동행복권 웹사이트에서 최신 당첨번호 크롤링
- fallback-data.js의 FALLBACK_PENSION_DATA 업데이트
"""

import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime

def fetch_pension_lottery(round_no):
    """연금복권 당첨번호 크롤링"""
    try:
        url = 'https://dhlottery.co.kr/gameResult.do?method=win720'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9',
            'Referer': 'https://dhlottery.co.kr/'
        }
        
        payload = {'Round': round_no}
        response = requests.post(url, data=payload, headers=headers, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ HTTP {response.status_code}")
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 회차 확인
        title = soup.select_one('div.win_result h4 strong')
        if not title:
            print("❌ 데이터를 찾을 수 없습니다.")
            return None
        
        # 추첨일 파싱
        date_text = soup.select_one('p.desc').text if soup.select_one('p.desc') else ''
        date_match = re.search(r'(\d{4})년 (\d{1,2})월 (\d{1,2})일', date_text)
        if date_match:
            year, month, day = date_match.groups()
            date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
        else:
            date = datetime.now().strftime('%Y-%m-%d')
        
        # 1등 조 번호
        group_elem = soup.select_one('div.win_result span.badge')
        if not group_elem:
            print("❌ 조 번호를 찾을 수 없습니다.")
            return None
        group = int(group_elem.text.replace('조', ''))
        
        # 당첨번호 6자리
        number_elems = soup.select('div.win_result div.num.win span')
        if len(number_elems) < 6:
            print("❌ 당첨번호가 부족합니다.")
            return None
        numbers = [int(elem.text) for elem in number_elems[:6]]
        
        # 보너스 번호 (2등용)
        bonus_section = soup.select('div.win_result')[1] if len(soup.select('div.win_result')) > 1 else None
        bonus = [0, 0, 0, 0, 0, 0]  # 기본값
        
        if bonus_section:
            bonus_elems = bonus_section.select('div.num span')
            if len(bonus_elems) >= 6:
                bonus = [int(elem.text) for elem in bonus_elems[:6]]
        
        return {
            'round': round_no,
            'date': date,
            'group': group,
            'numbers': numbers,
            'bonus': bonus
        }
        
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
        
        # 정규식으로 기존 블록 교체
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
    print("🎰 연금복권 720+ 당첨번호 자동 업데이트")
    print("=" * 60)
    
    # 최신 회차 추정 (2015년 1월 첫 주 시작, 매주 목요일)
    from datetime import datetime
    start_date = datetime(2015, 1, 8)  # 1회차 추첨일
    today = datetime.now()
    weeks = (today - start_date).days // 7
    estimated_round = weeks + 1
    
    print(f"\n📡 예상 최신 회차: {estimated_round}회")
    
    # 사용자 입력 또는 자동
    user_input = input(f"회차를 입력하세요 (Enter: {estimated_round}회): ").strip()
    target_round = int(user_input) if user_input else estimated_round
    
    print(f"\n📡 {target_round}회 당첨번호 조회 중...")
    pension_data = fetch_pension_lottery(target_round)
    
    if not pension_data:
        print("❌ 당첨번호를 가져올 수 없습니다.")
        return False
    
    print(f"\n✅ {pension_data['round']}회 당첨번호 확인:")
    print(f"   날짜: {pension_data['date']}")
    print(f"   조: {pension_data['group']}조")
    print(f"   번호: {'-'.join(map(str, pension_data['numbers']))}")
    print(f"   보너스: {'-'.join(map(str, pension_data['bonus']))}")
    
    print(f"\n📝 fallback-data.js 업데이트 중...")
    if not update_fallback_pension(pension_data):
        return False
    
    print("\n✅ 자동 업데이트 완료!")
    print("\n💡 Git 반영:")
    print(f'   git add js/fallback-data.js')
    print(f'   git commit -m "chore: {pension_data["round"]}회 연금복권 당첨번호 업데이트"')
    print(f'   git push origin main')
    
    return True

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
