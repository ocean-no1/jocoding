#!/usr/bin/env python3
"""
네이버 검색을 통한 연금복권 720+ 당첨번호 크롤링
"""
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime

def fetch_pension_from_naver():
    """네이버 검색에서 연금복권 최신 당첨번호 크롤링"""
    try:
        url = 'https://search.naver.com/search.naver?query=연금복권'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ HTTP {response.status_code}")
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 네이버 로또 정보 영역 찾기
        print("\n🔍 HTML 구조 분석 중...")
        
        # 회차 정보 찾기
        round_elem = soup.find(string=re.compile(r'(\d+)회'))
        if round_elem:
            round_match = re.search(r'(\d+)회', round_elem)
            round_no = int(round_match.group(1)) if round_match else None
            print(f"   회차: {round_no}회")
        else:
            print("   ❌ 회차 정보를 찾을 수 없습니다.")
            return None
        
        # 날짜 찾기
        date_elem = soup.find(string=re.compile(r'\d{4}\.\d{1,2}\.\d{1,2}'))
        if date_elem:
            date_match = re.search(r'(\d{4})\.(\d{1,2})\.(\d{1,2})', date_elem)
            if date_match:
                year, month, day = date_match.groups()
                date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                print(f"   날짜: {date}")
        else:
            date = datetime.now().strftime('%Y-%m-%d')
        
        # 조 번호 및 당첨번호 찾기
        # 네이버 검색 결과에서 "3조 960211" 형태로 표시
        lottery_text = soup.find(string=re.compile(r'(\d+)조\s*(\d{6})'))
        if lottery_text:
            lottery_match = re.search(r'(\d+)조\s*(\d{6})', lottery_text)
            if lottery_match:
                group = int(lottery_match.group(1))
                number_str = lottery_match.group(2)
                numbers = [int(d) for d in number_str]
                print(f"   조: {group}조")
                print(f"   번호: {number_str}")
                
                return {
                    'round': round_no,
                    'date': date,
                    'group': group,
                    'numbers': numbers,
                    'bonus': [0, 0, 0, 0, 0, 0]  # 네이버에서는 보너스 정보 없음
                }
        
        print("   ❌ 당첨번호를 찾을 수 없습니다.")
        return None
        
    except Exception as e:
        print(f"❌ 크롤링 실패: {e}")
        import traceback
        traceback.print_exc()
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
    numbers: {pension_data['numbers']},  // 실제 공식 당첨번호
    bonus: {pension_data['bonus']}     // 보너스 각조
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
    print("🎰 네이버에서 연금복권 720+ 당첨번호 크롤링")
    print("=" * 60)
    
    print("\n📡 네이버 검색 결과 크롤링 중...")
    pension_data = fetch_pension_from_naver()
    
    if not pension_data:
        print("\n❌ 당첨번호를 가져올 수 없습니다.")
        print("💡 수동으로 확인: https://search.naver.com/search.naver?query=연금복권")
        return False
    
    print(f"\n✅ {pension_data['round']}회 당첨번호 확인:")
    print(f"   날짜: {pension_data['date']}")
    print(f"   조: {pension_data['group']}조")
    print(f"   번호: {''.join(map(str, pension_data['numbers']))}")
    
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
