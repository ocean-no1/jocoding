import requests
from bs4 import BeautifulSoup

url = "https://www.dhlottery.co.kr/store.do?method=topStoreRank&rank=1"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

try:
    # Try POST request
    url = "https://www.dhlottery.co.kr/store.do?method=topStoreRank&rank=1" # URL usually has method in it even for POST
    data = {
        'method': 'topStoreRank',
        'rank': '1'
    }
    # Headers usually need Referer and Content-Type for POST
    headers['Referer'] = 'https://www.dhlottery.co.kr/store.do?method=topStoreRank&rank=1'
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    
    print(f"Testing POST to {url}")
    response = requests.post(url, headers=headers, data=data, timeout=10)
    
    # Check encoding
    print(f"Encoding (Apparent): {response.apparent_encoding}")
    response.encoding = response.apparent_encoding
    
    soup = BeautifulSoup(response.text, 'html.parser')
    print(f"Page Title: {soup.title.text.strip() if soup.title else 'No Title'}")

    with open('debug_utf8.html', 'w', encoding='utf-8') as f:
        f.write(response.text)
    
    # Check for specific text
    if "판매점" in response.text:
       print("Found '판매점' in text")
    
    # 테이블 찾기
    tables = soup.find_all('table')
    print(f"Tables found: {len(tables)}")
    
    if tables:
        rows = tables[0].select('tbody tr')
        print(f"Rows in first table: {len(rows)}")
        if rows:
            print("First row content:")
            print(rows[0].text.strip())
    else:
        print("No tables found. Printing first 500 chars of body:")
        print(soup.body.text.strip()[:500] if soup.body else "No body")
            
    with open('debug.html', 'w', encoding='utf-8') as f:
        f.write(response.text)
        
    print("HTML saved to debug.html")

except Exception as e:
    print(f"Error: {e}")
