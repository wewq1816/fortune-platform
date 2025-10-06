@echo off
chcp 65001 >nul
echo ================================================================================
echo 🗑️ 운세플랫폼 미사용 파일 정리 스크립트
echo ================================================================================
echo.
echo 📋 작업 내용:
echo    1. 백업 폴더 2개 삭제
echo    2. 미사용 HTML 파일 9개 삭제
echo.
echo ⚠️ 주의: 이 작업은 되돌릴 수 없습니다!
echo    삭제 전에 반드시 Git commit을 먼저 하세요.
echo.
pause

cd /d "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"

echo.
echo ================================================================================
echo 📂 1단계: 백업 폴더 삭제
echo ================================================================================
echo.

if exist "backup_20251006_191341" (
    echo 🗑️ backup_20251006_191341 삭제 중...
    rd /s /q "backup_20251006_191341"
    echo    ✅ 완료
) else (
    echo    ⚠️ 폴더 없음 (이미 삭제됨)
)

if exist "backup_20251006_191424" (
    echo 🗑️ backup_20251006_191424 삭제 중...
    rd /s /q "backup_20251006_191424"
    echo    ✅ 완료
) else (
    echo    ⚠️ 폴더 없음 (이미 삭제됨)
)

echo.
echo ================================================================================
echo 📄 2단계: 미사용 HTML 파일 삭제
echo ================================================================================
echo.

echo [오늘의 운세]
if exist "daily-fortune.html" (
    del /f /q "daily-fortune.html"
    echo    ✅ daily-fortune.html 삭제
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo [타로 카드]
if exist "tarot-mock-complete.html" (
    del /f /q "tarot-mock-complete.html"
    echo    ✅ tarot-mock-complete.html 삭제
) else (
    echo    ⚠️ 파일 없음
)

if exist "tarot-test.html" (
    del /f /q "tarot-test.html"
    echo    ✅ tarot-test.html 삭제
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo [사주팔자]
if exist "saju-test-improved.html" (
    del /f /q "saju-test-improved.html"
    echo    ✅ saju-test-improved.html 삭제
) else (
    echo    ⚠️ 파일 없음
)

if exist "saju-test-new.html" (
    del /f /q "saju-test-new.html"
    echo    ✅ saju-test-new.html 삭제
) else (
    echo    ⚠️ 파일 없음
)

if exist "saju-test-old-backup.html" (
    del /f /q "saju-test-old-backup.html"
    echo    ✅ saju-test-old-backup.html 삭제
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo [토정비결]
if exist "tojeong.html" (
    del /f /q "tojeong.html"
    echo    ✅ tojeong.html 삭제
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo [궁합 보기]
if exist "compatibility.html" (
    del /f /q "compatibility.html"
    echo    ✅ compatibility.html 삭제
) else (
    echo    ⚠️ 파일 없음
)

if exist "compatibility_fixed.html" (
    del /f /q "compatibility_fixed.html"
    echo    ✅ compatibility_fixed.html 삭제
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo ================================================================================
echo ✅ 정리 완료!
echo ================================================================================
echo.
echo 📊 결과:
dir /b *.html | find /c /v "" > temp.txt
set /p count=<temp.txt
del temp.txt
echo    남은 HTML 파일: %count%개
echo.
echo 💡 다음 단계:
echo    1. 삭제된 파일 확인: git status
echo    2. 문제없으면 커밋: git add . && git commit -m "Remove unused files"
echo.
pause
