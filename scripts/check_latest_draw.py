import json

try:
    with open('lotto_history_raw.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if isinstance(data, list):
        if len(data) > 0:
            latest_draw = data[-1]
            print(f"Latest draw: {latest_draw.get('draw_no')}")
            print(f"Date: {latest_draw.get('date')}")
            print(f"Total draws: {len(data)}")
        else:
            print("Data is empty list")
    else:
        print("Data is not a list")
except Exception as e:
    print(f"Error: {e}")
