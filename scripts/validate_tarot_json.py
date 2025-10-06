# -*- coding: utf-8 -*-
import json

# JSON 파일 읽기
with open(r'C:\xampp\htdocs\mysite\운세플랫폼\engines\data\tarot-cards-complete.json', encoding='utf-8') as f:
    data = json.load(f)

# 통계 출력
print("=" * 60)
print("Tarot Cards JSON Validation")
print("=" * 60)
print(f"Total cards: {len(data['cards'])}")
print(f"Major Arcana: {len([c for c in data['cards'] if c['arcana_type'] == 'major'])}")
print(f"Minor Arcana: {len([c for c in data['cards'] if c['arcana_type'] == 'minor'])}")
print("\nMinor Arcana by suit:")
print(f"  Wands: {len([c for c in data['cards'] if c.get('suit') == 'wands'])}")
print(f"  Cups: {len([c for c in data['cards'] if c.get('suit') == 'cups'])}")
print(f"  Swords: {len([c for c in data['cards'] if c.get('suit') == 'swords'])}")
print(f"  Pentacles: {len([c for c in data['cards'] if c.get('suit') == 'pentacles'])}")
print("\nJSON is valid!")
print("=" * 60)
