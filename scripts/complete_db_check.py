# -*- coding: utf-8 -*-
"""
타로 카드 의미 DB 완전 점검 스크립트
- JSON 파싱 오류 확인
- 카드 ID 중복 확인
- 카테고리 일관성 확인
- 의미 내용 검증 (빈 값, 너무 짧은 값 등)
- 정/역방향 대칭성 확인
"""

import json
import sys
import codecs
from collections import Counter

# 윈도우 콘솔 인코딩 설정
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

file_path = r"C:\xampp\htdocs\mysite\운세플랫폼\engines\data\tarot-cards-meanings.json"

print("=" * 80)
print("타로 카드 의미 DB 완전 점검")
print("=" * 80)

# 1. JSON 파싱 테스트
print("\n[1/7] JSON 파싱 테스트...")
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print("✅ JSON 파일 정상적으로 로드됨")
except json.JSONDecodeError as e:
    print(f"❌ JSON 파싱 오류: {e}")
    sys.exit(1)
except FileNotFoundError:
    print(f"❌ 파일을 찾을 수 없음: {file_path}")
    sys.exit(1)

# 2. 기본 구조 확인
print("\n[2/7] 기본 구조 확인...")
if "meanings" not in data:
    print("❌ 'meanings' 키가 없습니다")
    sys.exit(1)

total_cards = len(data["meanings"])
print(f"✅ 총 카드 수: {total_cards}장")

if total_cards != 78:
    print(f"⚠️ 경고: 타로 카드는 78장이어야 하는데 {total_cards}장입니다")

# 3. 카드 ID 중복 확인
print("\n[3/7] 카드 ID 중복 확인...")
card_ids = list(data["meanings"].keys())
duplicates = [item for item, count in Counter(card_ids).items() if count > 1]

if duplicates:
    print(f"❌ 중복된 카드 ID: {duplicates}")
else:
    print("✅ 카드 ID 중복 없음")

# 4. 카테고리 일관성 확인
print("\n[4/7] 카테고리 일관성 확인...")
all_upright_cats = set()
all_reversed_cats = set()
inconsistent_cards = []

for card_id, card_data in data["meanings"].items():
    if "upright" not in card_data or "reversed" not in card_data:
        inconsistent_cards.append(f"{card_id} (upright 또는 reversed 없음)")
        continue
    
    upright_cats = set(card_data["upright"].keys())
    reversed_cats = set(card_data["reversed"].keys())
    
    all_upright_cats.update(upright_cats)
    all_reversed_cats.update(reversed_cats)
    
    # 정/역방향 카테고리 일치 확인
    if upright_cats != reversed_cats:
        missing_in_upright = reversed_cats - upright_cats
        missing_in_reversed = upright_cats - reversed_cats
        if missing_in_upright:
            inconsistent_cards.append(f"{card_id} (upright에 없음: {missing_in_upright})")
        if missing_in_reversed:
            inconsistent_cards.append(f"{card_id} (reversed에 없음: {missing_in_reversed})")

if inconsistent_cards:
    print(f"❌ 카테고리 불일치 카드: {len(inconsistent_cards)}개")
    for card in inconsistent_cards[:10]:
        print(f"   - {card}")
else:
    print("✅ 모든 카드의 정/역방향 카테고리 일치")

print(f"\n카테고리 목록 ({len(all_upright_cats)}개):")
for i, cat in enumerate(sorted(all_upright_cats), 1):
    print(f"  {i}. {cat}")

# 5. 의미 내용 검증
print("\n[5/7] 의미 내용 검증...")
empty_meanings = []
short_meanings = []  # 10자 미만

for card_id, card_data in data["meanings"].items():
    for direction in ["upright", "reversed"]:
        if direction not in card_data:
            continue
        for category, meaning in card_data[direction].items():
            if not meaning or meaning.strip() == "":
                empty_meanings.append(f"{card_id}.{direction}.{category}")
            elif len(meaning.strip()) < 10:
                short_meanings.append(f"{card_id}.{direction}.{category} ({len(meaning)}자)")

if empty_meanings:
    print(f"❌ 빈 의미: {len(empty_meanings)}개")
    for meaning in empty_meanings[:10]:
        print(f"   - {meaning}")
else:
    print("✅ 빈 의미 없음")

if short_meanings:
    print(f"⚠️ 짧은 의미 (10자 미만): {len(short_meanings)}개")
    for meaning in short_meanings[:10]:
        print(f"   - {meaning}")
else:
    print("✅ 모든 의미가 적절한 길이")

# 6. 통계 계산
print("\n[6/7] 통계 계산...")
total_meanings = 0
category_count = len(all_upright_cats)

for card_data in data["meanings"].values():
    total_meanings += len(card_data.get("upright", {}))
    total_meanings += len(card_data.get("reversed", {}))

expected_meanings = total_cards * 2 * category_count
print(f"총 의미 수: {total_meanings}개")
print(f"예상 의미 수: {expected_meanings}개 (78장 × 2방향 × {category_count}카테고리)")

if total_meanings == expected_meanings:
    print("✅ 의미 수 일치")
else:
    print(f"❌ 의미 수 불일치 (차이: {abs(total_meanings - expected_meanings)}개)")

# 7. 예상 카테고리 확인
print("\n[7/7] 예상 카테고리 확인...")
expected_categories = {
    "total", "personality", "daeun", "wealth", "love", "health",
    "career", "study", "promotion", "move", "travel", "parents",
    "siblings", "children", "spouse", "social", "aptitude", "job",
    "business", "sinsal", "taekil"
}

missing_categories = expected_categories - all_upright_cats
extra_categories = all_upright_cats - expected_categories

if missing_categories:
    print(f"❌ 누락된 카테고리: {missing_categories}")
else:
    print("✅ 모든 예상 카테고리 존재")

if extra_categories:
    print(f"⚠️ 추가 카테고리: {extra_categories}")

# 최종 요약
print("\n" + "=" * 80)
print("점검 결과 요약")
print("=" * 80)
print(f"카드 수: {total_cards}장")
print(f"카테고리 수: {category_count}개")
print(f"총 의미 수: {total_meanings}개")
print(f"빈 의미: {len(empty_meanings)}개")
print(f"짧은 의미: {len(short_meanings)}개")
print(f"불일치 카드: {len(inconsistent_cards)}개")

if (len(empty_meanings) == 0 and 
    len(inconsistent_cards) == 0 and 
    total_meanings == expected_meanings and
    len(missing_categories) == 0):
    print("\n✅✅✅ 완벽합니다! DB에 문제가 없습니다! ✅✅✅")
else:
    print("\n⚠️ 일부 문제가 발견되었습니다. 위 내용을 확인하세요.")

print("=" * 80)

