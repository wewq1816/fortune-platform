# -*- coding: utf-8 -*-
import os
import re
import sys

# UTF-8 출력 설정
sys.stdout.reconfigure(encoding='utf-8')

# pages 폴더 경로
pages_dir = r"C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages"

# 결과 저장
results = []

# HTML 파일만 분석
for filename in os.listdir(pages_dir):
    if not filename.endswith('.html'):
        continue
    
    filepath = os.path.join(pages_dir, filename)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # <title> 태그 추출
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
        title = title_match.group(1) if title_match else "제목 없음"
        
        # ticket-system.js 포함 여부
        has_ticket = 'ticket-system.js' in content
        
        # TicketModal.jsx 포함 여부
        has_ticket_modal = 'TicketModal.jsx' in content
        
        # checkMasterModeFromURL 포함 여부
        has_master_mode = 'checkMasterModeFromURL' in content
        
        results.append({
            'filename': filename,
            'title': title,
            'has_ticket': has_ticket,
            'has_ticket_modal': has_ticket_modal,
            'has_master_mode': has_master_mode
        })
        
    except Exception as e:
        print(f"Error analyzing {filename}: {e}")

# 결과 출력
print("=" * 80)
print("[Fortune Platform Page Analysis Results]")
print("=" * 80)
print()

for r in sorted(results, key=lambda x: x['filename']):
    ticket_status = "YES" if r['has_ticket'] else "NO"
    modal_status = "YES" if r['has_ticket_modal'] else "NO"
    master_status = "YES" if r['has_master_mode'] else "NO"
    
    print(f"File: {r['filename']}")
    print(f"  Title: {r['title']}")
    print(f"  Ticket System: {ticket_status}")
    print(f"  Modal: {modal_status}")
    print(f"  Master Mode: {master_status}")
    print()

print("=" * 80)
print(f"Total: {len(results)} files analyzed")
print("=" * 80)
