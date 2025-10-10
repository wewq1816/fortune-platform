# 인코딩 점검 스크립트
$results = @()

# 점검할 디렉토리
$directories = @(
    "frontend/pages",
    "frontend/admin",
    "frontend/utils",
    "engines/core",
    "engines/utils",
    "engines/prompts",
    "backend/routes",
    "backend/middleware"
)

# 점검할 파일 확장자
$extensions = @("*.html", "*.js", "*.json")

Write-Host "🔍 인코딩 점검 시작..." -ForegroundColor Cyan
Write-Host ""

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "📁 검사 중: $dir" -ForegroundColor Yellow
        
        foreach ($ext in $extensions) {
            $files = Get-ChildItem -Path $dir -Filter $ext -File
            
            foreach ($file in $files) {
                $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
                
                # 한글 깨짐 패턴 확인
                $hasGarbled = $content -match '\?[�-�]{3,}'
                
                if ($hasGarbled) {
                    $results += [PSCustomObject]@{
                        Status = "❌"
                        File = $file.FullName.Replace((Get-Location).Path + "\", "")
                        Issue = "인코딩 깨짐 발견"
                    }
                    Write-Host "  ❌ $($file.Name) - 인코딩 깨짐" -ForegroundColor Red
                } else {
                    # 한글이 포함되어 있는지 확인
                    $hasKorean = $content -match '[가-힣]+'
                    if ($hasKorean) {
                        $results += [PSCustomObject]@{
                            Status = "✅"
                            File = $file.FullName.Replace((Get-Location).Path + "\", "")
                            Issue = "정상"
                        }
                        Write-Host "  ✅ $($file.Name) - 정상" -ForegroundColor Green
                    }
                }
            }
        }
        Write-Host ""
    }
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "📊 점검 결과 요약" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$normal = ($results | Where-Object { $_.Status -eq "✅" }).Count
$error = ($results | Where-Object { $_.Status -eq "❌" }).Count
$total = $results.Count

Write-Host "✅ 정상: $normal 개" -ForegroundColor Green
Write-Host "❌ 오류: $error 개" -ForegroundColor Red
Write-Host "📁 전체: $total 개" -ForegroundColor White
Write-Host ""

if ($error -gt 0) {
    Write-Host "⚠️ 인코딩 오류가 있는 파일:" -ForegroundColor Yellow
    $results | Where-Object { $_.Status -eq "❌" } | ForEach-Object {
        Write-Host "  - $($_.File)" -ForegroundColor Red
    }
} else {
    Write-Host "🎉 모든 파일이 정상입니다!" -ForegroundColor Green
}

Write-Host ""
Write-Host "상세 결과를 파일로 저장하시겠습니까? (Y/N)" -ForegroundColor Yellow
$save = Read-Host

if ($save -eq "Y" -or $save -eq "y") {
    $results | Export-Csv -Path "encoding-check-result.csv" -NoTypeInformation -Encoding UTF8
    Write-Host "✅ encoding-check-result.csv 저장 완료" -ForegroundColor Green
}
