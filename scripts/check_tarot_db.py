# -*- coding: utf-8 -*-
import json
import sys
import codecs

# 윈도우 콘솔 인코딩 설정
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

file_path = r"C:\xampp\htdocs\mysite\운세플랫폼\engines\data\tarot-cards-meanings.json"

print("=" * 60)
print("타로 카드 의미 DB 점검")
print("=" * 60)

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"\n[메타데이터]")
print(f"총 카드: {len(data['meanings'])} 장")

# 샘플 카드 분석
sample_card = list(data['meanings'].values())[0]
upright_categories = list(sample_card['upright'].keys())
reversed_categories = list(sample_card['reversed'].keys())

print(f"\n[카테고리]")
print(f"정방향 카테고리: {len(upright_categories)} 개")
print(f"역방향 카테고리: {len(reversed_categories)} 개")

print(f"\n[카테고리 목록]")
for i, cat in enumerate(upright_categories, 1):
    print(f"{i}. {cat}")

# 총 의미 개수
total_meanings = len(data['meanings']) * 2 * len(upright_categories)
print(f"\n[총 의미]")
print(f"{total_meanings} 개 (78장 × 2방향 × {len(upright_categories)}카테고리)")

# 완전성 검증
print(f"\n[완전성 검증]")
incomplete_cards = []
for card_id, card_data in data['meanings'].items():
    upright = card_data.get('upright', {})
    reversed = card_data.get('reversed', {})
    
    if len(upright) != len(upright_categories):
        incomplete_cards.append(f"{card_id} (정방향: {len(upright)}/{len(upright_categories)})")
    if len(reversed) != len(reversed_categories):
        incomplete_cards.append(f"{card_id} (역방향: {len(reversed)}/{len(reversed_categories)})")

if incomplete_cards:
    print(f"⚠️ 불완전한 카드: {len(incomplete_cards)} 개")
    for card in incomplete_cards[:10]:  # 최대 10개만 표시
        print(f"  - {card}")
else:
    print("✅ 모든 카드가 완전합니다!")

print("\n" + "=" * 60)
print("점검 완료!")
print("=" * 60)
