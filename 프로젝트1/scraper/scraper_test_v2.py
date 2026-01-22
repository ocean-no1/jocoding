import requests
from bs4 import BeautifulSoup

def test_scraper():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    })

    print("1. Visiting main page to set cookies...")
    try:
        main_url = "https://www.dhlottery.co.kr/common.do?method=main"
        session.get(main_url, timeout=10)
        print("   Cookies:", session.cookies.get_dict())
    except Exception as e:
        print(f"   Error visiting main page: {e}")

    # Mobile User Agent
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    })

    print("\n2. Requesting MOBILE Top Store Rank (GET)...")
    # Mobile URL assumption
    url = "https://m.dhlottery.co.kr/store.do?method=topStoreRank&rank=1"
    
    try:
        response = session.get(url, timeout=10)
        # Mobile site might use UTF-8
        print(f"   Encoding: {response.encoding}")
        response.encoding = response.apparent_encoding
        print(f"   Status: {response.status_code}")
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Check for ANY list items or tables
        # Mobile sites often use <ul><li> or specific classes
        print(f"   Page Title: {soup.title.text.strip() if soup.title else 'No Title'}")
        
        # Look for store names in common elements
        if "상호명" in response.text:
             print("   Found '상호명' in text - promising!")
        
        # Print first few list items to see if they are stores
        lis = soup.find_all('li')
        print(f"   Total <li> tags: {len(lis)}")
        
        print("   --- List Item Sample (First 10) ---")
        for i, li in enumerate(lis[:10]):
            print(f"   Item {i+1}: {li.text.strip()[:100]}...") # Print first 100 chars
            
        # Check for specific known store names if possible
        if "스파" in response.text or "부일카" in response.text:
            print("   FOUND KNOWN STORE NAME!")

    except Exception as e:
        print(f"   Error: {e}")

    print("\n3. Requesting Top Store Rank (POST)...")
    try:
        data = {'method': 'topStoreRank', 'rank': '1'}
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        response = session.post(url, data=data, headers=headers, timeout=10)
        response.encoding = 'euc-kr'
        print(f"   Status: {response.status_code}")
        soup = BeautifulSoup(response.text, 'html.parser')
        
        table = soup.find('table', {'class': 'tbl_data'})
        if table:
            rows = table.find_all('tr')
            print(f"   SUCCESS! Found table with {len(rows)} rows.")
        else:
            print("   Failed: No table found via POST.")

    except Exception as e:
        print(f"   Error: {e}")

if __name__ == "__main__":
    test_scraper()
