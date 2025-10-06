# -*- coding: utf-8 -*-
import os
import re
import sys

# UTF-8 출력 설정
sys.stdout.reconfigure(encoding='utf-8')

# 실제 사용 중인 파일들
ACTIVE_FILES = [
    'daily-fortune-test.html',
    'tarot-mock.html',
    'saju-test.html',
    'tojeong-test.html',
    'dream.html',
    'horoscope.html',
    'lotto.html',
    'compatibility-test.html',
    'coupang-gate.html'
]

pages_dir = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"

print("=" * 80)
print("🔍 운세플랫폼 기능 완성도 검증")
print("=" * 80)
print()

total_issues = 0

for filename in ACTIVE_FILES:
    filepath = os.path.join(pages_dir, filename)
    
    if not os.path.exists(filepath):
        print(f"❌ {filename} - 파일 없음!")
        continue
    
    print(f"📄 {filename}")
    print("-" * 80)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.split('\n')
        
        issues = []
        
        # 1. 개발 중 마커 찾기
        todo_pattern = r'(TODO|FIXME|XXX|HACK|NOTE|임시|테스트용|test)'
        for i, line in enumerate(lines, 1):
            if re.search(todo_pattern, line, re.IGNORECASE):
                issues.append(f"  Line {i}: 개발 마커 발견 - {line.strip()[:60]}...")
        
        # 2. console.log 찾기 (개발용 디버그 코드)
        console_pattern = r'console\.(log|error|warn|debug)'
        console_count = len(re.findall(console_pattern, content))
        if console_count > 0:
            issues.append(f"  ⚠️  console.log/error 발견: {console_count}개")
        
        # 3. alert 테스트 코드 찾기
        alert_pattern = r"alert\(['\"]test|alert\(['\"]디버그"
        if re.search(alert_pattern, content, re.IGNORECASE):
            issues.append(f"  ⚠️  테스트용 alert 발견")
        
        # 4. 필수 컴포넌트 체크
        checks = {
            'ticket-system.js': 'ticket-system.js' in content,
            'TicketModal.jsx': 'TicketModal.jsx' in content,
            'checkMasterModeFromURL': 'checkMasterModeFromURL' in content,
            '뒤로가기 버튼': '뒤로가기' in content or 'back-btn' in content,
        }
        
        missing = [k for k, v in checks.items() if not v and filename != 'coupang-gate.html']
        if missing:
            issues.append(f"  ❌ 누락: {', '.join(missing)}")
        
        # 5. 에러 핸들링 체크
        has_try_catch = 'try {' in content and 'catch' in content
        has_error_handling = '.catch(' in content or 'onerror' in content
        
        if not (has_try_catch or has_error_handling):
            issues.append(f"  ⚠️  에러 핸들링 없음")
        
        # 6. 로딩 상태 체크
        has_loading = 'loading' in content.lower() or '로딩' in content or 'spinner' in content.lower()
        if not has_loading:
            issues.append(f"  ⚠️  로딩 상태 표시 없음")
        
        # 결과 출력
        if issues:
            print("  ⚠️  발견된 이슈:")
            for issue in issues[:10]:  # 최대 10개만 표시
                print(issue)
            if len(issues) > 10:
                print(f"  ... 외 {len(issues) - 10}개 이슈")
            total_issues += len(issues)
        else:
            print("  ✅ 이슈 없음")
        
        # 기본 정보
        print(f"  📊 라인 수: {len(lines)}")
        print(f"  📊 파일 크기: {len(content)} bytes")
        
    except Exception as e:
        print(f"  ❌ 분석 실패: {e}")
    
    print()

print("=" * 80)
print(f"총 {total_issues}개 이슈 발견")
print("=" * 80)
print()

if total_issues == 0:
    print("✅ 모든 파일이 프로덕션 준비 완료!")
else:
    print("⚠️  일부 파일에 개선이 필요합니다.")
    print()
    print("💡 권장 조치:")
    print("  1. console.log 제거 또는 주석 처리")
    print("  2. TODO/FIXME 마커 해결")
    print("  3. 테스트용 코드 제거")
    print("  4. 에러 핸들링 추가")
    print("  5. 로딩 상태 표시 추가")
