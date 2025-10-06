# Check if files already have birthTime
import os

BASE = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"
files = [
    "daily-fortune-test.html",
    "horoscope.html",
    "dream.html",
    "compatibility-test.html",
    "tojeong-test.html",
    "lotto.html"
]

print("="*50)
print("birthTime 포함 여부 확인")
print("="*50)

for f in files:
    path = os.path.join(BASE, f)
    if os.path.exists(path):
        content = open(path, 'r', encoding='utf-8').read()
        has_birthtime = 'birthTime' in content
        has_userinfo = 'userInfoDisplay' in content
        
        status = "OK" if has_birthtime else "NEED FIX"
        if not has_userinfo:
            status = "NO USER INFO"
        
        print(f"{status}: {f}")
    else:
        print(f"NOT FOUND: {f}")

print("="*50)
