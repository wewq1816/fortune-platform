# -*- coding: utf-8 -*-
"""
펜타클 카드에 total 카테고리 추가 스크립트
"""

import json
import sys
import codecs

# 윈도우 콘솔 인코딩 설정
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

file_path = r"C:\xampp\htdocs\mysite\운세플랫폼\engines\data\tarot-cards-meanings.json"

print("=" * 60)
print("펜타클 카드 total 카테고리 추가 작업 시작")
print("=" * 60)

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 펜타클 카드 total 의미
pentacles_total = {
    "pentacles_01": {"upright": "새로운 재정적 기회나 물질적 시작이 있습니다.", "reversed": "기회 상실이나 재정 어려움이 있습니다."},
    "pentacles_02": {"upright": "재정적 균형을 유지하며 안정적입니다.", "reversed": "재정 불균형이나 혼란이 있습니다."},
    "pentacles_03": {"upright": "협력하여 물질적 성과를 이룹니다.", "reversed": "협력 실패나 품질 문제가 있습니다."},
    "pentacles_04": {"upright": "재물을 안정적으로 관리하고 보존합니다.", "reversed": "지나친 절약이나 집착이 문제입니다."},
    "pentacles_05": {"upright": "재정적 어려움이나 물질적 손실이 있습니다.", "reversed": "어려움에서 회복하고 안정을 찾습니다."},
    "pentacles_06": {"upright": "공정하게 나누고 도움을 주고받습니다.", "reversed": "불공정한 분배나 불균형이 있습니다."},
    "pentacles_07": {"upright": "인내심을 가지고 장기적 성과를 기다립니다.", "reversed": "조급함이나 성과 부족으로 실망합니다."},
    "pentacles_08": {"upright": "성실하게 일하며 기술을 연마합니다.", "reversed": "게으름이나 불성실함이 문제입니다."},
    "pentacles_09": {"upright": "독립적으로 성공하고 풍요롭습니다.", "reversed": "성공에도 불만족하거나 고립됩니다."},
    "pentacles_10": {"upright": "가족이 함께 풍요롭고 안정적입니다.", "reversed": "재정 문제나 가족 갈등이 있습니다."},
    "pentacles_11": {"upright": "성실하게 배우고 기술을 익힙니다.", "reversed": "게으름이나 학습 거부가 문제입니다."},
    "pentacles_12": {"upright": "책임감 있게 일하고 관리합니다.", "reversed": "과도한 신중함이나 게으름이 있습니다."},
    "pentacles_13": {"upright": "실용적이고 안정적으로 생활합니다.", "reversed": "물질주의나 융통성 부족이 문제입니다."},
    "pentacles_14": {"upright": "물질적 성공과 풍요를 이룹니다.", "reversed": "탐욕이나 부정직함이 문제입니다."},
}

# total 카테고리 추가
count = 0
for card_id, total_meaning in pentacles_total.items():
    if card_id in data["meanings"]:
        data["meanings"][card_id]["upright"]["total"] = total_meaning["upright"]
        data["meanings"][card_id]["reversed"]["total"] = total_meaning["reversed"]
        count += 1
        print(f"[추가] {card_id}")

# 파일 저장
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n✅ {count} 개 카드에 total 카테고리 추가 완료!")
print("=" * 60)
