import requests
import json
import time
import os

# Configuration
START_DRAW = 1
END_DRAW = 1207  # Update this to the latest draw if needed
OUTPUT_FILE = 'lotto_history.json'
BASE_URL = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo={}'

def fetch_draw(draw_no):
    try:
        target_url = BASE_URL.format(draw_no)
        # Use AllOrigins proxy
        proxy_url = f'https://api.allorigins.win/get?url={requests.utils.quote(target_url)}'
        
        response = requests.get(proxy_url, timeout=10)
        response.raise_for_status()
        proxy_data = response.json()
        
        if 'contents' in proxy_data:
            data = json.loads(proxy_data['contents'])
            
            if data.get('returnValue') == 'success':
        
        if data.get('returnValue') == 'success':
            return {
                'drwNo': data['drwNo'],
                'numbers': [
                    data['drwtNo1'], data['drwtNo2'], data['drwtNo3'], 
                    data['drwtNo4'], data['drwtNo5'], data['drwtNo6']
                ],
                'bonus': data['bnusNo'],
                'date': data['drwNoDate'],
                'prize': data['firstWinamnt']
            }
        else:
            print(f"Failed to fetch draw {draw_no}: {data}")
            return None
    except Exception as e:
        print(f"Error fetching draw {draw_no}: {e}")
        return None

def main():
    history = {}
    print(f"Fetching Lotto history from {START_DRAW} to {END_DRAW}...")
    
    for draw_no in range(START_DRAW, END_DRAW + 1):
        if draw_no % 10 == 0:
            print(f"Progress: {draw_no}/{END_DRAW}")
        
        result = fetch_draw(draw_no)
        if result:
            history[draw_no] = {
                'numbers': result['numbers'],
                'bonus': result['bonus'],
                'date': result['date']
            }
        
        # Be nice to the server
        time.sleep(0.1)

    # Save to JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=4)
    
    print(f"Successfully saved {len(history)} draws to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
