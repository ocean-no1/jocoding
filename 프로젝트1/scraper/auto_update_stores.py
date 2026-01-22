import requests
from bs4 import BeautifulSoup
import time
import json
import os

# =============================================================================
# 설정 (Configuration)
# =============================================================================

# 1. 카카오 API 키 (REST API Key)
KAKAO_API_KEY = "0600f0c42dfdc296eea82a564bd33a30" 

# 2. Google Apps Script Web App URL
GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztxG09bbt0mNRfErtMiNwtdL8jhXk-L_HPL9Enja-iAbse7YgAkHJKUnEGmO5vmUOQ/exec"

# =============================================================================
# 1. 데이터 수집 (Scraping)
# =============================================================================

def get_lotto_winners_online():
    """
    동행복권 사이트에서 실시간 크롤링 시도
    """
    print("🌐 동행복권 사이트 접속 중...")
    url = "https://www.dhlottery.co.kr/store.do?method=topStoreRank&rank=1"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.encoding = 'euc-kr'
        
        if "판매점" not in response.text:
            print("⚠️  웹사이트 접속 성공했으나 데이터가 보이지 않습니다. (보안 차단 가능성)")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 사용자가 제안한 선택자 등 여러 방식 시도
        rows = soup.select("#article > div:nth-child(2) > table > tbody > tr")
        if not rows:
            rows = soup.select("table.tbl_data tbody tr")
            
        return parse_rows(rows)
        
    except Exception as e:
        print(f"❌ 접속 오류: {e}")
        return []

def get_lotto_winners_from_file(filename="store_source.html"):
    """
    웹사이트 차단 시, 사용자가 저장한 HTML 파일에서 파싱
    """
    print(f"📂 로컬 파일 '{filename}'에서 데이터 읽기 중...")
    if not os.path.exists(filename):
        print(f"⚠️  파일이 없습니다: {filename}")
        print("    (브라우저에서 '1등 배출점' 페이지를 열고 Ctrl+S로 저장해주세요)")
        return []
        
    with open(filename, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        
    rows = soup.select("table tbody tr")
    if not rows:
         rows = soup.select("tr") # 더 단순하게 시도
         
    return parse_rows(rows)

def parse_rows(rows):
    store_list = []
    print(f"🔍 {len(rows)}개 행 분석 중...")
    
    for row in rows:
        tds = row.find_all('td')
        if len(tds) > 3:
            # 순서: 연번, 상호명, 1등당첨횟수, 소재지, 위치보기
            name = tds[1].text.strip()
            count = tds[2].text.strip()
            address = tds[3].text.strip()
            
            # 숫자만 추출
            if not count.isdigit(): continue
            
            store_list.append({
                'name': name,
                'address': address,
                'first': int(count),
                'second': 0 # 2등 데이터는 별도 페이지라 일단 0
            })
            
    print(f"✅ 유효한 판매점 {len(store_list)}개 추출 완료")
    return store_list

# =============================================================================
# 2. 좌표 변환 (Geocoding)
# =============================================================================

def add_coordinates(stores):
    """
    Kakao API로 주소를 좌표로 변환
    """
    print("\n📍 좌표 변환 시작 (Kakao API)...")
    updated_stores = []
    
    for i, store in enumerate(stores):
        address = store['address']
        lat, lng = get_kakao_coords(address)
        
        store['lat'] = lat
        store['lng'] = lng
        
        if lat != 0:
            updated_stores.append(store)
            print(f"   [{i+1}/{len(stores)}] {store['name']} -> 성공")
        else:
            print(f"   [{i+1}/{len(stores)}] {store['name']} -> 좌표 실패 ({address})")
            
        time.sleep(0.1) # Rate limiting
        
    return updated_stores

def get_kakao_coords(address):
    url = "https://dapi.kakao.com/v2/local/search/address.json"
    headers = {"Authorization": f"KakaoAK {KAKAO_API_KEY}"}
    params = {"query": address}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            if data['documents']:
                y = data['documents'][0]['y'] # lat
                x = data['documents'][0]['x'] # lng
                return float(y), float(x)
    except Exception:
        pass
    return 0, 0

# =============================================================================
# 3. Google Sheets 업로드 (Upload)
# =============================================================================

def upload_to_sheets(stores):
    """
    Apps Script Web App으로 데이터 전송 (POST)
    """
    if "ENTER_YOUR_SCRIPT_URL_HERE" in GOOGLE_SCRIPT_URL:
        print("\n❌ 오류: Google Apps Script URL이 설정되지 않았습니다.")
        print("   스크립트 상단의 GOOGLE_SCRIPT_URL 변수를 수정해주세요.")
        return

    print(f"\n🚀 Google Sheets로 데이터 전송 중... ({len(stores)}개)")
    
    payload = {
        "stores": stores
    }
    
    try:
        response = requests.post(GOOGLE_SCRIPT_URL, json=payload)
        
        if response.status_code == 200:
            print("✅ 업로드 성공!")
            print(f"   응답: {response.text}")
        else:
            print(f"❌ 업로드 실패 (Status: {response.status_code})")
            print(f"   내용: {response.text}")
            
    except Exception as e:
        print(f"❌ 연결 오류: {e}")

# =============================================================================
# 메인 실행
# =============================================================================

if __name__ == "__main__":
    # 1. 온라인 크롤링 시도
    stores = get_lotto_winners_online()
    
    # 2. 실패 시 로컬 파일(store_source.html) 시도
    if not stores:
        print("\n🔄 온라인 크롤링에 실패했습니다. 로컬 파일 사용을 시도합니다.")
        stores = get_lotto_winners_from_file()
        
    if stores:
        # 3. 좌표 추가
        stores_with_coords = add_coordinates(stores)
        
        # 4. 업로드
        if stores_with_coords:
            upload_to_sheets(stores_with_coords)
        else:
            print("❌ 좌표 변환된 데이터가 없습니다.")
    else:
        print("\n❌ 데이터를 찾을 수 없습니다.")
        print("💡 해결방법:")
        print("1. 브라우저에서 '동행복권 1등 배출점' 페이지 접속")
        print("2. HTML 파일로 저장 (이름: store_source.html)")
        print("3. 이 폴더에 넣고 다시 실행")
