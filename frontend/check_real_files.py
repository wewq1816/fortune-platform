# 메인에서 연결된 실제 페이지 확인
import os

BASE = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"

# index.html에서 연결된 실제 파일들
real_files = {
    "daily-fortune-test.html": "오늘의 운세",
    "tarot-mock.html": "타로 카드",
    "saju-test.html": "사주",
    "tojeong-test.html": "토정비결", 
    "dream.html": "꿈해몽",
    "horoscope.html": "별자리 운세",
    "lotto.html": "로또 번호",
    "compatibility-test.html": "궁합"
}

print("="*60)
print("메인 페이지에서 연결된 실제 파일 확인")
print("="*60)
print()

for filename, name in real_files.items():
    filepath = os.path.join(BASE, filename)
    
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # userInfoDisplay 확인
        has_display = 'userInfoDisplay' in content or 'user-info-display' in content
        
        # birthTime 확인
        has_birthtime = 'birthTime' in content
        
        # 현재 표시 방식 찾기
        if 'const display' in content or 'textContent =' in content:
            # 패턴 찾기
            import re
            patterns = re.findall(r'(textContent|innerHTML)\s*=\s*`[^`]+`', content)
            if patterns:
                status = "HAS DISPLAY"
            else:
                status = "NO PATTERN"
        else:
            status = "NO CODE"
        
        if not has_display:
            status = "NO USER INFO"
        
        print(f"[{status}] {name}")
        print(f"  - File: {filename}")
        print(f"  - userInfo: {has_display}")
        print(f"  - birthTime: {has_birthtime}")
        print()
    else:
        print(f"[NOT FOUND] {name}")
        print(f"  - File: {filename}")
        print()

print("="*60)
