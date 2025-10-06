# -*- coding: utf-8 -*-
import json
import sys
import codecs

# 윈도우 콘솔 인코딩 설정
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

file_path = r"C:\xampp\htdocs\mysite\운세플랫폼\engines\data\tarot-cards-meanings.json"

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# pentacles_01 카드 상세 분석
card_id = "pentacles_01"
card_data = data['meanings'][card_id]

print("=" * 60)
print(f"{card_id} 카드 상세 분석")
print("=" * 60)

print("\n[정방향 카테고리]")
for i, (cat, meaning) in enumerate(card_data['upright'].items(), 1):
    print(f"{i}. {cat}: {meaning[:50]}...")

print("\n[역방향 카테고리]")
for i, (cat, meaning) in enumerate(card_data['reversed'].items(), 1):
    print(f"{i}. {cat}: {meaning[:50]}...")

print("\n" + "=" * 60)

# 모든 카드의 카테고리 수 확인
print("\n펜타클 카드 카테고리 수 확인:")
for i in range(1, 15):
    card_id = f"pentacles_{i:02d}"
    if card_id in data['meanings']:
        upright_count = len(data['meanings'][card_id]['upright'])
        reversed_count = len(data['meanings'][card_id]['reversed'])
        print(f"{card_id}: 정방향={upright_count}, 역방향={reversed_count}")
