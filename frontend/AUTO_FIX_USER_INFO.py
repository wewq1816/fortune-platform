# -*- coding: utf-8 -*-
"""
사용자 정보 표시 자동 수정 스크립트
모든 HTML 파일을 타로카드 스타일로 통일
"""

import os
import shutil
from datetime import datetime

# 기본 경로
BASE_DIR = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"
BACKUP_DIR = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\backup_" + datetime.now().strftime("%Y%m%d_%H%M%S")

# 수정할 파일들과 패턴
FIXES = [
    {
        "file": "daily-fortune-test.html",
        "find": 'const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType})`;',
        "replace": 'const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`;'
    },
    # 사주팔자는 이미 완벽하므로 건너뜀
]

def create_backup(filepath):
    """백업 파일 생성"""
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
    
    filename = os.path.basename(filepath)
    backup_path = os.path.join(BACKUP_DIR, filename)
    shutil.copy2(filepath, backup_path)
    print(f"[BACKUP] {filename}")

def fix_file(filepath, find_text, replace_text):
    """파일 수정"""
    try:
        # 백업 생성
        create_backup(filepath)
        
        # 파일 읽기
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 텍스트 찾기 & 바꾸기
        if find_text in content:
            content = content.replace(find_text, replace_text)
            
            # 파일 쓰기
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"[OK] {os.path.basename(filepath)}")
            return True
        else:
            print(f"[SKIP] {os.path.basename(filepath)} - Not found")
            return False
            
    except Exception as e:
        print(f"[ERROR] {os.path.basename(filepath)} - {str(e)}")
        return False

def main():
    print("=" * 60)
    print("사용자 정보 표시 자동 수정")
    print("=" * 60)
    print()
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for fix in FIXES:
        filepath = os.path.join(BASE_DIR, fix["file"])
        
        if not os.path.exists(filepath):
            print(f"[ERROR] File not found: {fix['file']}")
            error_count += 1
            continue
        
        result = fix_file(filepath, fix["find"], fix["replace"])
        
        if result:
            success_count += 1
        elif result is False:
            skip_count += 1
        else:
            error_count += 1
    
    print()
    print("=" * 60)
    print(f"성공: {success_count} | 건너뜀: {skip_count} | 오류: {error_count}")
    print(f"백업 위치: {BACKUP_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
