import requests

def save_html(round_no):
    url = f'https://search.naver.com/search.naver?query=연금복권+{round_no}회'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        with open('naver_298.html', 'w', encoding='utf-8') as f:
            f.write(response.text)
        print("Saved naver_298.html")
    except Exception as e:
        print(f"Error: {e}")

save_html(298)
