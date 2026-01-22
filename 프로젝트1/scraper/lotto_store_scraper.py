#!/usr/bin/env python3
"""
로또 명당 데이터 수집 스크립트

동행복권 공식 사이트에서 당첨 판매점 정보를 크롤링하고
Kakao Geocoding API로 위도/경도를 추가합니다.
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import time
import json

# Kakao REST API 키 (카카오 개발자 센터에서 발급)
KAKAO_API_KEY = "8c78a44cbc45fec0aa35705516f1a082"  # 기존 JavaScript 키

def get_coordinates(address):
    """
    Kakao Geocoding API로 주소 → 위도/경도 변환
    """
    url = "https://dapi.kakao.com/v2/local/search/address.json"
    headers = {"Authorization": f"KakaoAK {KAKAO_API_KEY}"}
    params = {"query": address}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            result = response.json()
            if result['documents']:
                x = result['documents'][0]['x']  # 경도
                y = result['documents'][0]['y']  # 위도
                return float(y), float(x)
        
        print(f"⚠️  좌표 변환 실패: {address}")
        return None, None
        
    except Exception as e:
        print(f"❌ API 오류: {e}")
        return None, None

def get_lotto_stores(rank=1):
    """
    동행복권에서 당첨 판매점 정보 크롤링
    rank 1: 1등 배출점, rank 2: 2등 배출점
    """
    url = f"https://www.dhlottery.co.kr/store.do?method=topStoreRank&rank={rank}"
    
    try:
        response = requests.get(url)
        response.encoding = 'euc-kr'  # 한글 인코딩
        soup = BeautifulSoup(response.text, 'html.parser')
        
        stores = []
        rows = soup.select("table tbody tr")
        
        for row in rows:
            cols = row.find_all('td')
            if len(cols) > 3:
                name = cols[1].text.strip()
                count = cols[2].text.strip()
                address = cols[3].text.strip()
                
                stores.append({
                    'name': name,
                    'address': address,
                    'count': int(count) if count.isdigit() else 0
                })
        
        return stores
        
    except Exception as e:
        print(f"❌ 크롤링 오류: {e}")
        return []

def merge_store_data(first_stores, second_stores):
    """
    1등/2등 데이터를 합치기
    """
    merged = {}
    
    # 1등 데이터 추가
    for store in first_stores:
        key = store['address']
        merged[key] = {
            'name': store['name'],
            'address': store['address'],
            'first': store['count'],
            'second': 0
        }
    
    # 2등 데이터 추가
    for store in second_stores:
        key = store['address']
        if key in merged:
            merged[key]['second'] = store['count']
        else:
            merged[key] = {
                'name': store['name'],
                'address': store['address'],
                'first': 0,
                'second': store['count']
            }
    
    return list(merged.values())

def add_coordinates(stores):
    """
    모든 판매점에 위도/경도 추가
    """
    total = len(stores)
    for i, store in enumerate(stores, 1):
        print(f"📍 [{i}/{total}] {store['name']} 좌표 조회 중...")
        
        lat, lng = get_coordinates(store['address'])
        store['lat'] = lat
        store['lng'] = lng
        store['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
        
        # API 호출 제한 방지 (초당 10회 제한)
        time.sleep(0.15)
    
    return stores

def save_to_csv(stores, filename='lottery_stores.csv'):
    """
    CSV 파일로 저장 (Google Sheets 업로드용)
    """
    df = pd.DataFrame(stores)
    
    # 좌표가 없는 행 제거
    df = df.dropna(subset=['lat', 'lng'])
    
    # 컬럼 순서 정리
    df = df[['name', 'address', 'lat', 'lng', 'first', 'second', 'lastUpdated']]
    
    df.to_csv(filename, index=False, encoding='utf-8-sig')
    print(f"\n✅ 저장 완료: {filename}")
    print(f"📊 총 {len(df)}개 판매점 수집")
    
    return df

def main():
    """
    메인 실행 함수
    """
    print("=" * 60)
    print("🎯 로또 명당 데이터 크롤링 시작!")
    print("=" * 60)
    
    # 1등/2등 데이터 수집
    print("\n1️⃣  1등 배출점 크롤링 중...")
    first_stores = get_lotto_stores(rank=1)
    print(f"   → {len(first_stores)}개 발견")
    
    print("\n2️⃣  2등 배출점 크롤링 중...")
    second_stores = get_lotto_stores(rank=2)
    print(f"   → {len(second_stores)}개 발견")
    
    # 데이터 합치기
    print("\n3️⃣  데이터 병합 중...")
    merged_stores = merge_store_data(first_stores, second_stores)
    print(f"   → 총 {len(merged_stores)}개 판매점")
    
    # 좌표 추가 (상위 20개만)
    print("\n4️⃣  좌표 정보 추가 중...")
    print("   ⚠️  API 제한으로 상위 20개만 처리합니다.")
    top_stores = merged_stores[:20]
    stores_with_coords = add_coordinates(top_stores)
    
    # CSV 저장
    print("\n5️⃣  CSV 파일 저장 중...")
    df = save_to_csv(stores_with_coords)
    
    # 미리보기
    print("\n" + "=" * 60)
    print("📋 데이터 미리보기:")
    print("=" * 60)
    print(df.head(5).to_string())
    
    print("\n" + "=" * 60)
    print("✅ 완료! Google Sheets에 업로드하세요!")
    print("=" * 60)

if __name__ == "__main__":
    main()
