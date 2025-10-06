# 각 파일의 실제 표시 코드 추출 (간단 버전)
import os
import re

BASE = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"

files = [
    ("daily-fortune-test.html", "오늘의 운세"),
    ("tarot-mock.html", "타로 카드"),
    ("tojeong-test.html", "토정비결"),
    ("dream.html", "꿈해몽"),
    ("horoscope.html", "별자리 운세"),
    ("lotto.html", "로또 번호"),
    ("compatibility-test.html", "궁합")
]

for filename, name in files:
    filepath = os.path.join(BASE, filename)
    
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"\n[{name}]")
        
        # birthTime이 포함된 라인 찾기
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'birthTime' in line and ('textContent' in line or 'innerHTML' in line):
                # 앞뒤 5줄 보기
                start = max(0, i-2)
                end = min(len(lines), i+3)
                
                print("Found at line", i+1)
                for j in range(start, end):
                    marker = ">>>" if j == i else "   "
                    print(f"{marker} {lines[j][:80]}")
                break
        else:
            print("  [NO birthTime in display code]")

print("\n" + "="*70)
