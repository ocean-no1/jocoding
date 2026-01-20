#!/usr/bin/env python3
"""
네이버 검색을 통한 로또 6/45 당첨번호 크롤링
"""
import requests
from bs4 import BeautifulSoup
import re

def fetch_lotto_from_naver():
    """네이버 검색에서 로또 최신 당첨번호 크롤링"""
    try:
        url = 'https://search.naver.com/search.naver?query=로또'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ HTTP {response.status_code}")
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
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
            from datetime import datetime
            date = datetime.now().strftime('%Y-%m-%d')
        
        # 당첨번호 찾기 (숫자 6개 + 보너스)
        text = soup.get_text()
        
        # 패턴: 01, 02, ... 45 형태의 숫자들
        numbers_match = re.findall(r'\b\d{1,2}\b', text)
        
        # 로또 번호 범위 (1-45) 필터링
        lotto_numbers = [int(n) for n in numbers_match if 1 <= int(n) <= 45]
        
        if len(lotto_numbers) >= 7:
            numbers = lotto_numbers[:6]
            bonus = lotto_numbers[6]
            print(f"   번호: {', '.join(map(str, numbers))}")
            print(f"   보너스: {bonus}")
            
            return {
                'drwNo': round_no,
                'drwNoDate': date,
                'drwtNo1': numbers[0],
                'drwtNo2': numbers[1],
                'drwtNo3': numbers[2],
                'drwtNo4': numbers[3],
                'drwtNo5': numbers[4],
                'drwtNo6': numbers[5],
                'bnusNo': bonus,
                'returnValue': 'success'
            }
        
        print("   ❌ 당첨번호를 찾을 수 없습니다.")
        return None
        
    except Exception as e:
        print(f"❌ 크롤링 실패: {e}")
        import traceback
        traceback.print_exc()
        return None

def update_fallback_lotto(lotto_data):
    """fallback-data.js의 로또 데이터 업데이트"""
    file_path = 'js/fallback-data.js'
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # FALLBACK_LOTTO_DATA 블록 찾기 및 교체
        lotto_block = f'''const FALLBACK_LOTTO_DATA = {{
    drwNo: {lotto_data['drwNo']},
    drwNoDate: "{lotto_data['drwNoDate']}",
    drwtNo1: {lotto_data['drwtNo1']},
    drwtNo2: {lotto_data['drwtNo2']},
    drwtNo3: {lotto_data['drwtNo3']},
    drwtNo4: {lotto_data['drwtNo4']},
    drwtNo5: {lotto_data['drwtNo5']},
    drwtNo6: {lotto_data['drwtNo6']},
    bnusNo: {lotto_data['bnusNo']},
    firstWinamnt: 29460000000,
    firstPrzwnerCo: 12,
    returnValue: "success"
}};'''
        
        # 정규식으로 기존 블록 교체
        pattern = r'const FALLBACK_LOTTO_DATA = \{[^}]+\};'
        content = re.sub(pattern, lotto_block, content, flags=re.DOTALL)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {file_path} 로또 데이터 업데이트 완료")
        return True
        
    except Exception as e:
        print(f"❌ 파일 업데이트 실패: {e}")
        return False

def main():
    print("=" * 60)
    print("🎰 네이버에서 로또 6/45 당첨번호 크롤링")
    print("=" * 60)
    
    print("\n📡 네이버 검색 결과 크롤링 중...")
    lotto_data = fetch_lotto_from_naver()
    
    if not lotto_data:
        print("\n❌ 당첨번호를 가져올 수 없습니다.")
        print("💡 수동으로 확인: https://search.naver.com/search.naver?query=로또")
        return False
    
    print(f"\n✅ {lotto_data['drwNo']}회 당첨번호 확인:")
    print(f"   날짜: {lotto_data['drwNoDate']}")
    print(f"   번호: {lotto_data['drwtNo1']}, {lotto_data['drwtNo2']}, {lotto_data['drwtNo3']}, {lotto_data['drwtNo4']}, {lotto_data['drwtNo5']}, {lotto_data['drwtNo6']}")
    print(f"   보너스: {lotto_data['bnusNo']}")
    
    print(f"\n📝 fallback-data.js 업데이트 중...")
    if not update_fallback_lotto(lotto_data):
        return False
    
    print("\n✅ 자동 업데이트 완료!")
    print("\n💡 Git 반영:")
    print(f'   git add js/fallback-data.js')
    print(f'   git commit -m "chore: {lotto_data["drwNo"]}회 로또 당첨번호 업데이트"')
    print(f'   git push origin main')
    
    return True

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
