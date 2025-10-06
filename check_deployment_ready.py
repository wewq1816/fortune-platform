# -*- coding: utf-8 -*-
import os
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

ACTIVE_FILES = [
    'daily-fortune-test.html',
    'tarot-mock.html',
    'saju-test.html',
    'tojeong-test.html',
    'dream.html',
    'horoscope.html',
    'lotto.html',
    'compatibility-test.html'
]

pages_dir = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"

print("=" * 80)
print("🚀 운세플랫폼 배포 준비도 검증")
print("=" * 80)
print()

results = {}

for filename in ACTIVE_FILES:
    filepath = os.path.join(pages_dir, filename)
    
    if not os.path.exists(filepath):
        continue
    
    print(f"\n{'='*80}")
    print(f"📄 {filename}")
    print('='*80)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    analysis = {
        'file': filename,
        'ready': True,
        'issues': [],
        'scores': {}
    }
    
    # ============================================
    # 1. 사용자 플로우 체크
    # ============================================
    print("\n🔄 1. 사용자 플로우")
    print("-" * 80)
    
    has_input = bool(re.search(r'(input|select|textarea)', content, re.IGNORECASE))
    has_button = bool(re.search(r'(button|onclick|addEventListener)', content, re.IGNORECASE))
    has_result = bool(re.search(r'(result|fortune|해석|결과)', content, re.IGNORECASE))
    
    flow_score = sum([has_input, has_button, has_result])
    analysis['scores']['flow'] = flow_score
    
    print(f"  입력 UI: {'✅' if has_input else '❌'}")
    print(f"  버튼/액션: {'✅' if has_button else '❌'}")
    print(f"  결과 표시: {'✅' if has_result else '❌'}")
    print(f"  점수: {flow_score}/3")
    
    if flow_score < 3:
        analysis['issues'].append(f"사용자 플로우 불완전 ({flow_score}/3)")
        analysis['ready'] = False
    
    # ============================================
    # 2. Claude 프롬프트 분석
    # ============================================
    print("\n💬 2. Claude 프롬프트")
    print("-" * 80)
    
    # 프롬프트 찾기
    prompt_patterns = [
        r'prompt\s*[:=]\s*[`"\'](.{50,}?)[`"\']',
        r'systemPrompt\s*[:=]\s*[`"\'](.{50,}?)[`"\']',
        r'message\s*[:=]\s*[`"\'](.{50,}?)[`"\']'
    ]
    
    prompts = []
    for pattern in prompt_patterns:
        matches = re.findall(pattern, content, re.DOTALL)
        prompts.extend(matches)
    
    if prompts:
        print(f"  ✅ 프롬프트 발견: {len(prompts)}개")
        for i, p in enumerate(prompts[:2], 1):  # 처음 2개만
            preview = p[:100].replace('\n', ' ')
            print(f"  #{i}: {preview}...")
        analysis['scores']['prompt'] = len(prompts)
    else:
        print(f"  ⚠️  프롬프트 없음 (또는 다른 방식)")
        analysis['scores']['prompt'] = 0
    
    # ============================================
    # 3. API 연동 준비도
    # ============================================
    print("\n🔌 3. API 연동 준비")
    print("-" * 80)
    
    has_fetch = 'fetch(' in content
    has_async = 'async' in content and 'await' in content
    has_api_call = bool(re.search(r'(callAPI|fetchAPI|getResult|getClaude)', content))
    
    api_score = sum([has_fetch, has_async, has_api_call])
    analysis['scores']['api'] = api_score
    
    print(f"  fetch() 사용: {'✅' if has_fetch else '❌'}")
    print(f"  async/await: {'✅' if has_async else '❌'}")
    print(f"  API 호출 함수: {'✅' if has_api_call else '❌'}")
    print(f"  점수: {api_score}/3")
    
    if api_score < 2:
        analysis['issues'].append(f"API 연동 준비 부족 ({api_score}/3)")
    
    # ============================================
    # 4. 이용권 시스템 통합
    # ============================================
    print("\n🎫 4. 이용권 시스템")
    print("-" * 80)
    
    has_ticket_system = 'ticket-system.js' in content
    has_ticket_modal = 'TicketModal.jsx' in content
    has_master_mode = 'checkMasterModeFromURL' in content
    has_ticket_check = bool(re.search(r'(canUseFortune|useTicket|getRemainingTickets)', content))
    
    ticket_score = sum([has_ticket_system, has_ticket_modal, has_master_mode, has_ticket_check])
    analysis['scores']['ticket'] = ticket_score
    
    print(f"  ticket-system.js: {'✅' if has_ticket_system else '❌'}")
    print(f"  TicketModal.jsx: {'✅' if has_ticket_modal else '❌'}")
    print(f"  마스터 모드: {'✅' if has_master_mode else '❌'}")
    print(f"  이용권 체크: {'✅' if has_ticket_check else '❌'}")
    print(f"  점수: {ticket_score}/4")
    
    if ticket_score < 3:
        analysis['issues'].append(f"이용권 시스템 불완전 ({ticket_score}/4)")
        analysis['ready'] = False
    
    # ============================================
    # 5. 에러 핸들링
    # ============================================
    print("\n⚠️  5. 에러 핸들링")
    print("-" * 80)
    
    has_try_catch = bool(re.search(r'try\s*{', content))
    has_catch = bool(re.search(r'\.catch\(', content))
    has_error_message = bool(re.search(r'(alert.*오류|alert.*실패|오류가|실패했)', content))
    
    error_score = sum([has_try_catch, has_catch, has_error_message])
    analysis['scores']['error'] = error_score
    
    print(f"  try-catch: {'✅' if has_try_catch else '❌'}")
    print(f"  .catch(): {'✅' if has_catch else '❌'}")
    print(f"  에러 메시지: {'✅' if has_error_message else '❌'}")
    print(f"  점수: {error_score}/3")
    
    if error_score < 1:
        analysis['issues'].append(f"에러 핸들링 부족 ({error_score}/3)")
    
    # ============================================
    # 6. 데이터 구조
    # ============================================
    print("\n📦 6. 데이터 처리")
    print("-" * 80)
    
    has_localstorage = 'localStorage' in content
    has_json = bool(re.search(r'(JSON\.parse|JSON\.stringify)', content))
    has_data_validation = bool(re.search(r'(if.*length|if.*null|if.*undefined)', content))
    
    data_score = sum([has_localstorage, has_json, has_data_validation])
    analysis['scores']['data'] = data_score
    
    print(f"  LocalStorage: {'✅' if has_localstorage else '❌'}")
    print(f"  JSON 처리: {'✅' if has_json else '❌'}")
    print(f"  데이터 검증: {'✅' if has_data_validation else '❌'}")
    print(f"  점수: {data_score}/3")
    
    # ============================================
    # 총점 계산
    # ============================================
    total_score = sum(analysis['scores'].values())
    max_score = 19  # 3+3+4+3+3+3
    percentage = (total_score / max_score) * 100
    
    print(f"\n{'='*80}")
    print(f"📊 총점: {total_score}/{max_score} ({percentage:.1f}%)")
    
    if percentage >= 80:
        status = "✅ 배포 준비 완료"
        analysis['ready'] = True
    elif percentage >= 60:
        status = "⚠️  배포 가능 (개선 권장)"
    else:
        status = "❌ 배포 준비 부족"
        analysis['ready'] = False
    
    print(f"상태: {status}")
    
    if analysis['issues']:
        print(f"\n⚠️  발견된 이슈:")
        for issue in analysis['issues']:
            print(f"  - {issue}")
    
    results[filename] = analysis

# ============================================
# 전체 요약
# ============================================
print("\n\n")
print("=" * 80)
print("📊 전체 요약")
print("=" * 80)

ready_count = sum(1 for r in results.values() if r['ready'])
total_count = len(results)

print(f"\n배포 준비 완료: {ready_count}/{total_count} ({ready_count/total_count*100:.0f}%)")
print()

for filename, analysis in results.items():
    status = "✅" if analysis['ready'] else "❌"
    total = sum(analysis['scores'].values())
    print(f"{status} {filename}: {total}/19점")

print("\n" + "=" * 80)

if ready_count == total_count:
    print("✅ 모든 기능이 배포 준비 완료!")
    print("   → API만 연결하면 바로 배포 가능합니다.")
else:
    print("⚠️  일부 기능에 추가 작업이 필요합니다.")
    print(f"   → {total_count - ready_count}개 파일 개선 필요")

print("=" * 80)
