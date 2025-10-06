# -*- coding: utf-8 -*-
"""
사용자 정보 표시 자동 수정 스크립트 (완전판)
모든 HTML 파일을 타로카드 스타일로 통일

실행 방법:
python AUTO_FIX_USER_INFO_COMPLETE.py
"""

import os
import shutil
import re
from datetime import datetime

# 기본 경로
BASE_DIR = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"
BACKUP_DIR = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\backup_" + datetime.now().strftime("%Y%m%d_%H%M%S")

def create_backup(filepath):
    """백업 파일 생성"""
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
    
    filename = os.path.basename(filepath)
    backup_path = os.path.join(BACKUP_DIR, filename)
    shutil.copy2(filepath, backup_path)
    return backup_path

def fix_daily_fortune(filepath):
    """오늘의 운세 수정"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 패턴 1: loadUserInfo 함수 내부
    pattern1 = r"const display = `\${data\.gender} \${data\.year}\. \${data\.month}\. \${data\.day} \(\${data\.calendarType}\)`;"
    replacement1 = "const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`;"
    
    if re.search(pattern1, content):
        content = re.sub(pattern1, replacement1, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def fix_horoscope(filepath):
    """별자리 운세 수정"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # loadUserInfo 함수 찾기
    pattern = r"(function loadUserInfo\(\)[^}]*\{[^}]*)(document\.getElementById\('userInfoDisplay'\)\.textContent = `\${[^`]+}`)(;[^}]*\})"
    
    def replacer(match):
        before = match.group(1)
        old_line = match.group(2)
        after = match.group(3)
        
        # 새로운 라인 생성
        new_line = "document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`"
        
        return before + new_line + after
    
    new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def fix_dream(filepath):
    """꿈해몽 수정 (사용자 정보가 있는 경우만)"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # userInfoDisplay가 있는지 확인
    if 'userInfoDisplay' not in content:
        return None  # 사용자 정보 없음
    
    # 있으면 수정
    pattern = r"document\.getElementById\('userInfoDisplay'\)\.textContent = `\${[^`]+}`"
    replacement = "document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`"
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def fix_compatibility(filepath):
    """궁합 테스트 수정"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 두 사람의 정보 표시 패턴 찾기
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
    """토정비결 수정"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # userInfoDisplay 업데이트 패턴
    pattern = r"document\.getElementById\('userInfoDisplay'\)\.textContent = `\${data\.year}\. \${data\.month}\. \${data\.day}( \([^)]+\))?`"
    replacement = "document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`"
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def fix_lotto(filepath):
    """로또 번호 수정"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # userInfoDisplay 업데이트 패턴
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
    print(" " * 15 + "사용자 정보 표시 자동 수정")
    print("=" * 70)
    print()
    
    # 수정할 파일 목록
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
            print(f"[건너뜀] {name} - 파일 없음")
            results.append((name, "파일없음"))
            continue
        
        try:
            # 백업 생성
            backup_path = create_backup(filepath)
            print(f"[백업] {name} -> {os.path.basename(backup_path)}")
            
            # 수정 실행
            result = fix_func(filepath)
            
            if result is True:
                print(f"[성공] {name} - 수정 완료")
                results.append((name, "성공"))
            elif result is False:
                print(f"[건너뜀] {name} - 수정할 내용 없음")
                results.append((name, "건너뜀"))
            elif result is None:
                print(f"[건너뜀] {name} - 사용자 정보 없음")
                results.append((name, "정보없음"))
            
        except Exception as e:
            print(f"[오류] {name} - {str(e)}")
            results.append((name, "오류"))
    
    # 요약
    print()
    print("=" * 70)
    print("수정 결과 요약")
    print("=" * 70)
    
    success = sum(1 for _, status in results if status == "성공")
    skipped = sum(1 for _, status in results if status in ["건너뜀", "정보없음", "파일없음"])
    errors = sum(1 for _, status in results if status == "오류")
    
    for name, status in results:
        emoji = "✅" if status == "성공" else "⏭️" if status in ["건너뜀", "정보없음"] else "❌"
        print(f"{emoji} {name}: {status}")
    
    print()
    print(f"총 {len(results)}개 파일 - 성공: {success} | 건너뜀: {skipped} | 오류: {errors}")
    print(f"백업 위치: {BACKUP_DIR}")
    print("=" * 70)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n작업이 중단되었습니다.")
    except Exception as e:
        print(f"\n\n오류 발생: {str(e)}")
