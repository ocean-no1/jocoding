#!/usr/bin/env python3
"""
최신 로또 당첨번호 자동 업데이트 스크립트
- 동행복권 공식 API에서 최신 당첨번호 가져오기
- fallback-data.js 자동 업데이트
- Git commit & push 자동화
"""

import requests
import json
import re
from datetime import datetime

def fetch_latest_draw():
    """최신 회차 번호 가져오기 (User-Agent 헤더 포함)"""
    from datetime import datetime
    start_date = datetime(2002, 12, 7)
    today = datetime.now()
    weeks = (today - start_date).days // 7
    estimated_draw = weeks + 1
    
    # 브라우저 헤더 추가 (API 차단 방지)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.dhlottery.co.kr/'
    }
    
    # 최신 3개 회차 시도
    for draw_no in range(estimated_draw, estimated_draw - 3, -1):
        try:
            url = f"https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo={draw_no}"
            response = requests.get(url, headers=headers, timeout=10)
            
            # JSON 파싱 전에 응답 확인
            if response.status_code != 200:
                print(f"⚠️ Draw {draw_no}: HTTP {response.status_code}")
                continue
                
            data = response.json()
            
            if data.get('returnValue') == 'success':
                return {
                    'drwNo': data['drwNo'],
                    'drwNoDate': data['drwNoDate'],
                    'drwtNo1': data['drwtNo1'],
                    'drwtNo2': data['drwtNo2'],
                    'drwtNo3': data['drwtNo3'],
                    'drwtNo4': data['drwtNo4'],
                    'drwtNo5': data['drwtNo5'],
                    'drwtNo6': data['drwtNo6'],
                    'bnusNo': data['bnusNo'],
                    'firstWinamnt': data.get('firstWinamnt', 0),
                    'firstPrzwnerCo': data.get('firstPrzwnerCo', 0)
                }
        except requests.exceptions.RequestException as e:
            print(f"❌ Draw {draw_no} network error: {e}")
            continue
        except json.JSONDecodeError as e:
            print(f"❌ Draw {draw_no} JSON parse error: {e}")
            continue
        except Exception as e:
            print(f"❌ Draw {draw_no} unexpected error: {e}")
            continue
    
    return None

def update_fallback_file(draw_data):
    """fallback-data.js 파일 업데이트"""
    file_path = 'js/fallback-data.js'
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 현재 날짜 업데이트
        today = datetime.now().strftime('%Y-%m-%d')
        content = re.sub(
            r'// Updated: .*',
            f'// Updated: {today} (자동 업데이트)',
            content
        )
        
        # 각 필드 업데이트
        updates = {
            'drwNo': draw_data['drwNo'],
            'drwNoDate': draw_data['drwNoDate'],
            'drwtNo1': draw_data['drwtNo1'],
            'drwtNo2': draw_data['drwtNo2'],
            'drwtNo3': draw_data['drwtNo3'],
            'drwtNo4': draw_data['drwtNo4'],
            'drwtNo5': draw_data['drwtNo5'],
            'drwtNo6': draw_data['drwtNo6'],
            'bnusNo': draw_data['bnusNo'],
            'firstWinamnt': draw_data['firstWinamnt'],
            'firstPrzwnerCo': draw_data['firstPrzwnerCo']
        }
        
        for key, value in updates.items():
            if isinstance(value, str):
                pattern = f'{key}: ".*?"'
                replacement = f'{key}: "{value}"'
            else:
                pattern = f'{key}: \\d+'
                replacement = f'{key}: {value}'
            content = re.sub(pattern, replacement, content)
        
        # 파일 저장
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {file_path} 업데이트 완료")
        return True
        
    except Exception as e:
        print(f"❌ 파일 업데이트 실패: {e}")
        return False

def main():
    print("=" * 60)
    print("🎰 로또 당첨번호 자동 업데이트 시작")
    print("=" * 60)
    
    # 1. 최신 당첨번호 가져오기
    print("\n📡 최신 당첨번호 조회 중...")
    draw_data = fetch_latest_draw()
    
    if not draw_data:
        print("❌ 최신 당첨번호를 가져올 수 없습니다.")
        return False
    
    print(f"\n✅ {draw_data['drwNo']}회 당첨번호 확인:")
    print(f"   날짜: {draw_data['drwNoDate']}")
    print(f"   번호: {draw_data['drwtNo1']}, {draw_data['drwtNo2']}, {draw_data['drwtNo3']}, "
          f"{draw_data['drwtNo4']}, {draw_data['drwtNo5']}, {draw_data['drwtNo6']}")
    print(f"   보너스: {draw_data['bnusNo']}")
    
    # 2. fallback-data.js 업데이트
    print("\n📝 fallback-data.js 업데이트 중...")
    if not update_fallback_file(draw_data):
        return False
    
    print("\n✅ 자동 업데이트 완료!")
    print("\n💡 다음 명령어로 Git에 반영하세요:")
    print(f'   git add js/fallback-data.js')
    print(f'   git commit -m "chore: {draw_data["drwNo"]}회 당첨번호 자동 업데이트"')
    print(f'   git push origin main')
    
    return True

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
