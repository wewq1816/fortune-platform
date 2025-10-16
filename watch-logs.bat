@echo off
chcp 65001 > nul
echo ============================================================
echo API 로그 실시간 모니터링
echo ============================================================
echo.
echo [1] 오류 로그 (error-*.log) - 가장 중요!
echo [2] API 로그 (api-*.log) - 모든 요청/응답
echo [3] Claude API 로그 (claude-*.log) - Claude 호출
echo [4] 시스템 로그 (system-*.log) - 서버 시작/종료
echo.
set /p choice="선택 (1-4): "

cd /d "%~dp0logs"

if "%choice%"=="1" (
    echo.
    echo 오류 로그 실시간 모니터링 중...
    echo Ctrl+C로 종료하세요.
    echo.
    for /f %%f in ('dir /b error-*.log 2^>nul ^| sort /r') do (
        powershell -Command "Get-Content '%%f' -Wait"
        goto :end
    )
    echo 오류 로그 파일이 없습니다.
)

if "%choice%"=="2" (
    echo.
    echo API 로그 실시간 모니터링 중...
    echo Ctrl+C로 종료하세요.
    echo.
    for /f %%f in ('dir /b api-*.log 2^>nul ^| sort /r') do (
        powershell -Command "Get-Content '%%f' -Wait"
        goto :end
    )
    echo API 로그 파일이 없습니다.
)

if "%choice%"=="3" (
    echo.
    echo Claude API 로그 실시간 모니터링 중...
    echo Ctrl+C로 종료하세요.
    echo.
    for /f %%f in ('dir /b claude-*.log 2^>nul ^| sort /r') do (
        powershell -Command "Get-Content '%%f' -Wait"
        goto :end
    )
    echo Claude API 로그 파일이 없습니다.
)

if "%choice%"=="4" (
    echo.
    echo 시스템 로그 실시간 모니터링 중...
    echo Ctrl+C로 종료하세요.
    echo.
    for /f %%f in ('dir /b system-*.log 2^>nul ^| sort /r') do (
        powershell -Command "Get-Content '%%f' -Wait"
        goto :end
    )
    echo 시스템 로그 파일이 없습니다.
)

:end
pause
