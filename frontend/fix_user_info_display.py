# -*- coding: utf-8 -*-
"""
사용자 정보 표시 방식 수정 스크립트
모든 HTML 파일의 사용자 정보를 타로카드처럼 "풀로 다 보이게" 수정
"""

import os
import re

# 수정할 파일 목록
files = {
    "pages/daily-fortune-test.html": {
        "old": 'const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType})`;',
        "new": 'const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`;'
    }
}

def fix_file(filepath, old_text, new_text):
    """파일에서 텍스트를 찾아 바꾸기"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if old_text in content:
            content = content.replace(old_text, new_text)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ 수정 완료: {filepath}")
            return True
        else:
            print(f"⚠️ 찾을 수 없음: {filepath}")
            return False
    except Exception as e:
        print(f"❌ 오류 발생: {filepath} - {e}")
        return False

def main():
    base_dir = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend"
    
    print("=" * 60)
    print("사용자 정보 표시 수정 시작")
    print("=" * 60)
    
    for rel_path, changes in files.items():
        filepath = os.path.join(base_dir, rel_path)
        print(f"\n처리 중: {rel_path}")
        fix_file(filepath, changes["old"], changes["new"])
    
    print("\n" + "=" * 60)
    print("수정 완료!")
    print("=" * 60)

if __name__ == "__main__":
    main()
