import requests
from bs4 import BeautifulSoup

def debug_fetch(round_no):
    url = f'https://m.search.naver.com/search.naver?query=연금복권+{round_no}회'
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    }
    
    print(f"Fetch Mobile Naver Round {round_no}")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text()
        
        # print(f"Text Snippet: {text[:1000]}")
        
        if '보너스' in text:
            print("Found '보너스' keyword in Mobile")
            idx = text.find('보너스')
            print(f"Context: {text[idx:idx+200]}")
        
        # Check for specific bonus number 492845
        if '492845' in text:
             print("Found Bonus Number 492845 in text")
        
    except Exception as e:
        print(f"Error: {e}")

debug_fetch(298)
