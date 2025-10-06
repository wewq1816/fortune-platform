# -*- coding: utf-8 -*-
"""
사용자 정보 표시 방식 수정 스크립트
"""

import os

# 파일 경로
filepath = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\daily-fortune-test.html"

# 찾을 텍스트
old_text = "const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType})`;"

# 바꿀 텍스트  
new_text = "const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`;"

try:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_text in content:
        content = content.replace(old_text, new_text)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("[OK] daily-fortune-test.html")
    else:
        print("[SKIP] Not found in daily-fortune-test.html")
except Exception as e:
    print(f"[ERROR] {e}")
