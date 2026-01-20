import json
import os

def main():
    # 1. Read raw data
    try:
        with open('lotto_history_raw.json', 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
    except FileNotFoundError:
        print("Error: lotto_history_raw.json not found.")
        return

    # 2. Process data
    lotto_history = {}
    frequencies = {i: 0 for i in range(1, 46)}
    last_appearance = {i: 0 for i in range(1, 46)}
    
    # Sort data by draw_no just in case
    raw_data.sort(key=lambda x: x['draw_no'])
    
    latest_draw = raw_data[-1]
    
    for draw in raw_data:
        draw_no = draw['draw_no']
        numbers = sorted(draw['numbers'])
        bonus = draw['bonus_no']
        date = draw['date'].split('T')[0] # '2002-12-07T00:00:00Z' -> '2002-12-07'
        
        lotto_history[draw_no] = {
            "numbers": numbers,
            "bonus": bonus,
            "date": date
        }
        
        # Update frequencies
        for num in numbers:
            frequencies[num] += 1
            last_appearance[num] = draw_no
            
        # Bonus freq? usually not counted in main freq for 6/45 stats often, 
        # but let's stick to main numbers for S_score as per common logic.
        
    
    # 3. Read existing logic from stats-data.js
    logic_code = ""
    try:
        with open('js/stats-data.js', 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for i, line in enumerate(lines):
                if "// 빠른 조회를 위한 헬퍼 함수" in line:
                    logic_code = "".join(lines[i:])
                    break
    except FileNotFoundError:
        print("Error: js/stats-data.js not found.")
        return

    if not logic_code:
        print("Warning: Could not find logic part in stats-data.js. Using default logic?")
        # This shouldn't happen based on our previous step, but for safety
        return

    # 4. Generate JS content
    
    # LOTTO_STATS_BASE
    stats_base_js = "const LOTTO_STATS_BASE = {\n"
    stats_base_js += f"    total_draws: {latest_draw['draw_no']},\n"
    stats_base_js += "    frequencies: {\n"
    
    freq_items = []
    for i in range(1, 46):
        freq_items.append(f"{i}: {frequencies[i]}")
        if i % 10 == 0: # Newline every 10 for readability
            stats_base_js += "        " + ", ".join(freq_items) + ",\n"
            freq_items = []
    if freq_items:
        stats_base_js += "        " + ", ".join(freq_items) + "\n"
        
    stats_base_js += "    },\n"
    stats_base_js += "    latest: {\n"
    stats_base_js += f"        drwNo: {latest_draw['draw_no']},\n"
    stats_base_js += f"        numbers: {sorted(latest_draw['numbers'])},\n"
    stats_base_js += f"        bonus: {latest_draw['bonus_no']},\n"
    stats_base_js += f"        date: '{latest_draw['date'].split('T')[0]}'\n"
    stats_base_js += "    }\n"
    stats_base_js += "};\n\n"
    
    # LAST_APPEARANCE
    last_app_js = "const LAST_APPEARANCE = {\n"
    last_items = []
    for i in range(1, 46):
        last_items.append(f"{i}: {last_appearance[i]}")
        if i % 10 == 0:
            last_app_js += "    " + ", ".join(last_items) + ",\n"
            last_items = []
    if last_items:
        last_app_js += "    " + ", ".join(last_items) + "\n"
    last_app_js += "};\n\n"
    
    # LOTTO_HISTORY
    history_js = "const LOTTO_HISTORY = {\n"
    # To avoid huge file size in one line, we can pretty print or compact print
    # Let's compact print each draw per line
    draw_keys = sorted(lotto_history.keys(), reverse=True) # Latest first
    
    for draw_no in draw_keys:
        data = lotto_history[draw_no]
        history_js += f"    {draw_no}: {{ numbers: {data['numbers']}, bonus: {data['bonus']}, date: '{data['date']}' }},\n"
        
    history_js += "};\n\n"
    
    # Combine all
    final_content = (
        "// 로또 6/45 역대 당첨 번호 데이터 및 통계 엔진\n"
        "// 1회부터 최신 회차까지의 전체 데이터\n\n"
        + stats_base_js
        + last_app_js
        + history_js
        + logic_code
    )
    
    # 5. Write to file
    with open('js/stats-data.js', 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    print(f"Successfully generated js/stats-data.js with {len(lotto_history)} draws.")

if __name__ == "__main__":
    main()
