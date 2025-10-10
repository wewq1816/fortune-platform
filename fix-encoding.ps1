# UTF-8 인코딩 수정 스크립트
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "인코딩 수정 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 수정할 HTML 파일 목록
$files = @(
    "frontend\pages\daily-fortune-test.html",
    "frontend\pages\tarot-mock.html",
    "frontend\pages\saju-test.html",
    "frontend\pages\tojeong-test.html",
    "frontend\pages\dream.html",
    "frontend\pages\horoscope.html",
    "frontend\pages\lotto.html",
    "frontend\pages\compatibility-test.html",
    "frontend\pages\coupang-gate.html",
    "frontend\index.html"
)

$count = 0
foreach ($file in $files) {
    $fullPath = "C:\xampp\htdocs\mysite\운세플랫폼\$file"
    
    if (Test-Path $fullPath) {
        try {
            Write-Host "`n처리중: $file" -ForegroundColor Yellow
            
            # 파일을 바이트로 읽기 (인코딩 상관없이)
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            
            # UTF-8로 디코딩 시도
            $utf8 = [System.Text.Encoding]::UTF8
            $content = $utf8.GetString($bytes)
            
            # UTF-8 BOM 없이 저장
            $utf8NoBOM = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($fullPath, $content, $utf8NoBOM)
            
            Write-Host "✅ 성공: $file" -ForegroundColor Green
            $count++
        }
        catch {
            Write-Host "❌ 실패: $file - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠️ 파일 없음: $file" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "완료: $count 개 파일 처리됨" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
