# 모든 파일 loadUserInfo 함수 확인
import os

BASE = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"

files = [
    "daily-fortune-test.html",
    "horoscope.html",
    "dream.html",
    "tojeong-test.html",
    "lotto.html",
    "compatibility-test.html"
]

for filename in files:
    filepath = os.path.join(BASE, filename)
    
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"\n{'='*60}")
        print(f"{filename}")
        print('='*60)
        
        # loadUserInfo 함수 찾기
        idx = content.find('function loadUserInfo')
        if idx > 0:
            # 함수 전체 추출 (다음 function까지)
            end_idx = content.find('function', idx + 50)
            if end_idx == -1:
                end_idx = idx + 1000
            
            func_code = content[idx:min(end_idx, idx+800)]
            
            # textContent 부분만 출력
            lines = func_code.split('\n')
            for line in lines:
                if 'textContent' in line or 'innerHTML' in line:
                    print("  " + line.strip()[:100])
        else:
            print("  [NO loadUserInfo function]")

print("\n" + "="*60)
