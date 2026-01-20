#!/usr/bin/env python3
"""
로또 최신 4회차 데이터 추출 (stats-data.js에서)
"""
import re
import json
from datetime import datetime

def extract_lotto_history():
    """stats-data.js에서 LOTTO_HISTORY 추출"""
    try:
        with open('js/stats-data.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # LOTTO_HISTORY 찾기
        match = re.search(r'const LOTTO_HISTORY = (\{[\s\S]+?\n\});', content)
        if match:
            history_str = match.group(1)
            # JavaScript 객체를 Python dict로 변환하기 위해 간단한 파싱
            # 1207: { date: "2026-01-17", ... } 형태
            
            rounds = {}
            for line in history_str.split('\n'):
                round_match = re.search(r'(\d+):\s*\{', line)
                if round_match:
                    current_round = round_match.group(1)
                    rounds[current_round] = {'numbers': [], 'bonus': 0, 'date': ''}
                
                date_match = re.search(r'date:\s*"([^"]+)"', line)
                if date_match and current_round:
                    rounds[current_round]['date'] = date_match.group(1)
                
                numbers_match = re.search(r'numbers:\s*\[([^\]]+)\]', line)
                if numbers_match and current_round:
                    nums = [int(n.strip()) for n in numbers_match.group(1).split(',')]
                    rounds[current_round]['numbers'] = nums
                
                bonus_match = re.search(r'bonus:\s*(\d+)', line)
                if bonus_match and current_round:
                    rounds[current_round]['bonus'] = int(bonus_match.group(1))
            
            return rounds
        
        return None
        
    except Exception as e:
        print(f"❌ stats-data.js 파싱 실패: {e}")
        return None

def main():
    print("=" * 60)
    print("🎰 로또 6/45 최신 4회차 데이터 추출")
    print("=" * 60)
    
    print("\n📡 stats-data.js에서 LOTTO_HISTORY 읽는 중...")
    all_rounds = extract_lotto_history()
    
    if not all_rounds:
        print("❌ 데이터 추출 실패")
        return False
    
    # 최신 4회차 선택
    latest_round = max([int(r) for r in all_rounds.keys()])
    target_rounds = range(latest_round - 3, latest_round + 1)
    
    print(f"📡 최신 회차: {latest_round}회")
    print(f"📡 추출 대상: {latest_round-3}회 ~ {latest_round}회")
    
    lotto_data = {}
    
    for round_no in target_rounds:
        round_str = str(round_no)
        if round_str in all_rounds:
            data = all_rounds[round_str]
            lotto_data[round_str] = {
                'round': round_no,
                'date': data['date'],
                'numbers': data['numbers'],
                'bonus': data['bonus'],
                'prize': 30000000000,  # 기본값
                'winners': 10
            }
            numbers_str = ', '.join(map(str, data['numbers']))
            print(f"✅ {round_no}회: {numbers_str} + {data['bonus']}")
        else:
            print(f"❌ {round_no}회: 데이터 없음")
    
    # JSON 파일로 저장
    if lotto_data:
        output_file = 'js/lotto-recent-data.js'
        
        js_content = f'''// 로또 6/45 최신 4회차 데이터
// 자동 생성: {datetime.now().strftime('%Y-%m-%d %H:%M')}
const LOTTO_RECENT_DATA = {json.dumps(lotto_data, indent=4, ensure_ascii=False)};

function getLottoRecentData(round) {{
    return LOTTO_RECENT_DATA[round.toString()] || null;
}}
'''
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"\n✅ {output_file} 저장 완료")
        print(f"✅ 총 {len(lotto_data)}개 회차 데이터 수집")
        
        return True
    
    print("\n❌ 데이터 없음")
    return False

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
