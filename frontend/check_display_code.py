# 각 파일의 실제 표시 코드 추출
import os
import re

BASE = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"

files = {
    "daily-fortune-test.html": "오늘의 운세",
    "tarot-mock.html": "타로 카드",
    "tojeong-test.html": "토정비결",
    "dream.html": "꿈해몽",
    "horoscope.html": "별자리 운세",
    "lotto.html": "로또 번호",
    "compatibility-test.html": "궁합"
}

print("="*70)
print("실제 표시 코드 확인")
print("="*70)
print()

for filename, name in files.items():
    filepath = os.path.join(BASE, filename)
    
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"[{name}] {filename}")
        print("-"*70)
        
        # textContent 패턴 찾기
        patterns = re.findall(r'textContent\s*=\s*`[^`]+birthTime[^`]*`', content)
        
        if patterns:
            for p in patterns[:2]:  # 최대 2개만
                # 깔끔하게 정리
                clean = p.replace('\n', '').replace('  ', ' ')
                print(f"  {clean[:100]}...")
        else:
            # birthTime 없는 패턴 찾기
            no_birth = re.findall(r'textContent\s*=\s*`[^`]+\$\{data\.[^}]+\}`', content)
            if no_birth:
                print(f"  ⚠️ birthTime 없음!")
                for p in no_birth[:1]:
                    clean = p.replace('\n', '').replace('  ', ' ')
                    print(f"  현재: {clean[:100]}")
            else:
                print(f"  ℹ️ 패턴을 찾을 수 없음 (JS 파일 분리 가능)")
        
        print()

print("="*70)
