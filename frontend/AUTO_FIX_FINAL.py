# -*- coding: utf-8 -*-
import os
import sys
import shutil
import re
from datetime import datetime

# UTF-8 출력 강제
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

# 기본 경로
BASE_DIR = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"
BACKUP_DIR = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\backup_" + datetime.now().strftime("%Y%m%d_%H%M%S")

def create_backup(filepath):
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
    filename = os.path.basename(filepath)
    backup_path = os.path.join(BACKUP_DIR, filename)
    shutil.copy2(filepath, backup_path)
    return backup_path

def fix_daily_fortune(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r"const display = `\${data\.gender} \${data\.year}\. \${data\.month}\. \${data\.day} \(\${data\.calendarType}\)`;"
    replacement = "const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`;"
    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def fix_horoscope(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r"(function loadUserInfo\(\)[^}]*\{[^}]*)(document\.getElementById\('userInfoDisplay'\)\.textContent = `\${[^`]+}`)(;[^}]*\})"
    def replacer(match):
        before = match.group(1)
        old_line = match.group(2)
        after = match.group(3)
        new_line = "document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`"
        return before + new_line + after
    new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def fix_dream(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'userInfoDisplay' not in content:
        return None
    pattern = r"document\.getElementById\('userInfoDisplay'\)\.textContent = `\${[^`]+}`"
    replacement = "document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`"
    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def fix_compatibility(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    patterns = [
        (r"const display1 = `\${person1\.gender} \${person1\.year}\. \${person1\.month}\. \${person1\.day}`",
         "const display1 = `${person1.gender} ${person1.year}. ${person1.month}. ${person1.day} (${person1.calendarType}) 태어난 시간 : ${person1.birthTime}`"),
        (r"const display2 = `\${person2\.gender} \${person2\.year}\. \${person2\.month}\. \${person2\.day}`",
         "const display2 = `${person2.gender} ${person2.year}. ${person2.month}. ${person2.day} (${person2.calendarType}) 태어난 시간 : ${person2.birthTime}`"),
    ]
    modified = False
    for pattern, replacement in patterns:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            modified = True
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def fix_tojeong(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r"document\.getElementById\('userInfoDisplay'\)\.textContent = `\${data\.year}\. \${data\.month}\. \${data\.day}( \([^)]+\))?`"
    replacement = "document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`"
    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def fix_lotto(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r"document\.getElementById\('userInfoDisplay'\)\.textContent = `\${data\.gender} \${data\.year}\. \${data\.month}\. \${data\.day}( \([^)]+\))?`"
    replacement = "document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`"
    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    print("=" * 70)
    print("사용자 정보 표시 자동 수정")
    print("=" * 70)
    print()
    
    files_to_fix = [
        ("daily-fortune-test.html", "오늘의 운세", fix_daily_fortune),
        ("horoscope.html", "별자리 운세", fix_horoscope),
        ("dream.html", "꿈해몽", fix_dream),
        ("compatibility-test.html", "궁합 테스트", fix_compatibility),
        ("tojeong-test.html", "토정비결", fix_tojeong),
        ("lotto.html", "로또 번호", fix_lotto),
    ]
    
    results = []
    
    for filename, name, fix_func in files_to_fix:
        filepath = os.path.join(BASE_DIR, filename)
        
        if not os.path.exists(filepath):
            print(f"[SKIP] {name} - File not found")
            results.append((name, "SKIP"))
            continue
        
        try:
            backup_path = create_backup(filepath)
            print(f"[BACKUP] {name}")
            
            result = fix_func(filepath)
            
            if result is True:
                print(f"[OK] {name}")
                results.append((name, "OK"))
            elif result is False:
                print(f"[SKIP] {name} - No changes needed")
                results.append((name, "SKIP"))
            elif result is None:
                print(f"[SKIP] {name} - No user info")
                results.append((name, "SKIP"))
            
        except Exception as e:
            print(f"[ERROR] {name} - {str(e)}")
            results.append((name, "ERROR"))
    
    print()
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    success = sum(1 for _, status in results if status == "OK")
    skipped = sum(1 for _, status in results if status == "SKIP")
    errors = sum(1 for _, status in results if status == "ERROR")
    
    for name, status in results:
        print(f"{status}: {name}")
    
    print()
    print(f"Total: {len(results)} | OK: {success} | SKIP: {skipped} | ERROR: {errors}")
    print(f"Backup: {BACKUP_DIR}")
    print("=" * 70)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterrupted by user")
    except Exception as e:
        print(f"\nError: {str(e)}")
