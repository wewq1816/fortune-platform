@echo off
chcp 65001 > nul
echo ===============================================
echo 프론트엔드 useTicket() 제거 스크립트
echo ===============================================
echo.

cd /d C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages

echo [1/6] daily-fortune-test.html 수정 중...
powershell -Command "(Get-Content daily-fortune-test.html) -replace 'const result = useTicket\(''오늘의 운세''\);[\s\S]*?getDailyFortune\(\);[\s\S]*?} else \{[\s\S]*?alert\(''⚠️ 이용권 소모 실패: '' \+ result\.error\);[\s\S]*?}', 'getDailyFortune();' | Set-Content daily-fortune-test.html"

echo [2/6] saju-test.html 수정 중...
powershell -Command "(Get-Content saju-test.html) -replace 'const result = useTicket\(''사주팔자''\);[\s\S]*?generateSaju\(\);[\s\S]*?} else \{[\s\S]*?alert\(''⚠️ 이용권 소모 실패: '' \+ result\.error\);[\s\S]*?}', 'generateSaju();' | Set-Content saju-test.html"

echo [3/6] tarot-mock.html 수정 중...
powershell -Command "(Get-Content tarot-mock.html) -replace 'const result = useTicket\(''타로 카드''\);[\s\S]*?startTarotReading\(\);[\s\S]*?} else \{[\s\S]*?alert\(''⚠️ 이용권 소모 실패: '' \+ result\.error\);[\s\S]*?}', 'startTarotReading();' | Set-Content tarot-mock.html"

echo [4/6] tojeong-test.html 수정 중...
powershell -Command "(Get-Content tojeong-test.html) -replace 'const result = useTicket\(''토정비결''\);[\s\S]*?getTojeongCore\(\);[\s\S]*?} else \{[\s\S]*?alert\(''⚠️ 이용권 소모 실패: '' \+ result\.error\);[\s\S]*?}', 'getTojeongCore();' | Set-Content tojeong-test.html"

echo [5/6] compatibility-test.html 수정 중...
powershell -Command "(Get-Content compatibility-test.html) -replace 'const result = useTicket\(''궁합 보기''\);[\s\S]*?checkCompatibilityCore\(\);[\s\S]*?} else \{[\s\S]*?alert\(''⚠️ 이용권 소모 실패: '' \+ result\.error\);[\s\S]*?}', 'checkCompatibilityCore();' | Set-Content compatibility-test.html"

echo [6/6] lotto.html 수정 중...
powershell -Command "(Get-Content lotto.html) -replace 'const result = useTicket\(''로또 번호''\);[\s\S]*?generateLottoCore\(\);[\s\S]*?} else \{[\s\S]*?alert\(''⚠️ 이용권 소모 실패: '' \+ result\.error\);[\s\S]*?}', 'generateLottoCore();' | Set-Content lotto.html"

echo.
echo ===============================================
echo ✅ 모든 파일 수정 완료!
echo ===============================================
echo.
pause
