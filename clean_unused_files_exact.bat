@echo off
chcp 65001 >nul
echo ================================================================================
echo 🗑️ 운세플랫폼 불필요한 파일 정리 스크립트 (정확한 버전)
echo ================================================================================
echo.
echo 📋 삭제 대상:
echo    - Mock JS 파일: 3개
echo    - 중복 HTML 파일: 9개  
echo    - 백업 폴더: 2개
echo.
echo    총 14개 파일 + 2개 폴더 삭제
echo.
echo ⚠️ 주의: 이 작업은 되돌릴 수 없습니다!
echo    삭제 전에 반드시 Git commit을 먼저 하세요.
echo.
pause

echo.
echo ================================================================================
echo 📂 1단계: 백업 폴더 삭제
echo ================================================================================
echo.

if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\backup_20251006_191341" (
    echo 🗑️ backup_20251006_191341 삭제 중...
    rd /s /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\backup_20251006_191341"
    echo    ✅ 완료
) else (
    echo    ⚠️ 폴더 없음
)

if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\backup_20251006_191424" (
    echo 🗑️ backup_20251006_191424 삭제 중...
    rd /s /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\backup_20251006_191424"
    echo    ✅ 완료
) else (
    echo    ⚠️ 폴더 없음
)

echo.
echo ================================================================================
echo 🟡 2단계: Mock JS 파일 삭제 (프론트엔드)
echo ================================================================================
echo.

echo [Mock 데이터 파일 - 백엔드에 정확한 계산 있음]

if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-basic-calculator.js" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-basic-calculator.js"
    echo    ✅ saju-basic-calculator.js 삭제
) else (
    echo    ⚠️ 파일 없음
)

if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-extended-calculator.js" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-extended-calculator.js"
    echo    ✅ saju-extended-calculator.js 삭제
) else (
    echo    ⚠️ 파일 없음
)

if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-interpretations.js" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-interpretations.js"
    echo    ✅ saju-interpretations.js 삭제
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo ================================================================================
echo 📄 3단계: 중복 HTML 파일 삭제
echo ================================================================================
echo.

echo [오늘의 운세]
if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\daily-fortune.html" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\daily-fortune.html"
    echo    ✅ daily-fortune.html 삭제 (대체: daily-fortune-test.html)
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo [타로 카드]
if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\tarot-mock-complete.html" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\tarot-mock-complete.html"
    echo    ✅ tarot-mock-complete.html 삭제 (대체: tarot-mock.html)
) else (
    echo    ⚠️ 파일 없음
)

if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\tarot-test.html" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\tarot-test.html"
    echo    ✅ tarot-test.html 삭제 (대체: tarot-mock.html)
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo [사주팔자]
if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-test-improved.html" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-test-improved.html"
    echo    ✅ saju-test-improved.html 삭제 (대체: saju-test.html)
) else (
    echo    ⚠️ 파일 없음
)

if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-test-new.html" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-test-new.html"
    echo    ✅ saju-test-new.html 삭제 (대체: saju-test.html)
) else (
    echo    ⚠️ 파일 없음
)

if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-test-old-backup.html" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-test-old-backup.html"
    echo    ✅ saju-test-old-backup.html 삭제 (대체: saju-test.html)
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo [토정비결]
if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\tojeong.html" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\tojeong.html"
    echo    ✅ tojeong.html 삭제 (대체: tojeong-test.html)
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo [궁합 보기]
if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\compatibility.html" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\compatibility.html"
    echo    ✅ compatibility.html 삭제 (대체: compatibility-test.html)
) else (
    echo    ⚠️ 파일 없음
)

if exist "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\compatibility_fixed.html" (
    del /f /q "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\compatibility_fixed.html"
    echo    ✅ compatibility_fixed.html 삭제 (대체: compatibility-test.html)
) else (
    echo    ⚠️ 파일 없음
)

echo.
echo ================================================================================
echo ✅ 정리 완료!
echo ================================================================================
echo.
echo 📊 결과 확인 중...
echo.

cd /d "C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"

dir /b *.html 2>nul | find /c /v "" > temp_html.txt
set /p html_count=<temp_html.txt
del temp_html.txt

dir /b *.js 2>nul | find /c /v "" > temp_js.txt
set /p js_count=<temp_js.txt
del temp_js.txt

echo    HTML 파일: %html_count%개 (예상: 9개)
echo    JS 파일: %js_count%개 (예상: 4개)
echo.

echo ✅ 유지된 핵심 파일:
echo.
echo [HTML 파일 9개]
echo    1. daily-fortune-test.html
echo    2. tarot-mock.html
echo    3. saju-test.html
echo    4. tojeong-test.html
echo    5. dream.html
echo    6. horoscope.html
echo    7. lotto.html
echo    8. compatibility-test.html
echo    9. coupang-gate.html
echo.
echo [JS 파일 4개]
echo    1. saju-main.js
echo    2. saju-ui-controller.js
echo    3. saju-api-functions.js
echo    4. ten-stars-calculator.js
echo.

echo 💡 다음 단계:
echo    1. Git 상태 확인: git status
echo    2. 변경사항 커밋: git add . ^&^& git commit -m "불필요한 파일 삭제"
echo    3. 백엔드 API 연결 작업 시작
echo.
pause
