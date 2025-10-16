@echo off
chcp 65001 > nul
echo ============================================================
echo 최근 오류 로그 확인
echo ============================================================
echo.

cd /d "%~dp0logs"

for /f %%f in ('dir /b error-*.log 2^>nul ^| sort /r') do (
    echo [파일: %%f]
    echo.
    powershell -Command "Get-Content '%%f' -Tail 50"
    echo.
    echo ============================================================
    goto :end
)

echo 오류 로그 파일이 없습니다.
echo 이는 아직 오류가 발생하지 않았다는 의미입니다!

:end
echo.
pause
