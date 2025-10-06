# -*- coding: utf-8 -*-
"""
펜타클 카드에 personality 카테고리 추가 스크립트
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
print("펜타클 카드 personality 카테고리 추가 작업 시작")
print("=" * 60)

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 펜타클 카드 personality 의미
pentacles_personality = {
    "pentacles_01": {"upright": "실용적이고 안정을 추구하는 성격입니다. 재정적으로 신중하고 계획적입니다.", "reversed": "불안정하거나 비현실적인 경향이 있습니다. 계획성이 부족합니다."},
    "pentacles_02": {"upright": "균형 잡히고 유연한 성격입니다. 여러 일을 잘 조율합니다.", "reversed": "불균형하거나 우선순위를 정하지 못하는 성격입니다."},
    "pentacles_03": {"upright": "협력적이고 기술을 중시하는 성격입니다. 품질에 집중합니다.", "reversed": "협력이 부족하거나 기술 습득을 게을리합니다."},
    "pentacles_04": {"upright": "보수적이고 관리를 잘하는 성격입니다. 재물을 소중히 여깁니다.", "reversed": "지나치게 인색하거나 집착하는 성격입니다."},
    "pentacles_05": {"upright": "어려움을 견디고 회복하는 성격입니다. 불굴의 의지가 있습니다.", "reversed": "어려움에 쉽게 굴복하거나 고립되는 성격입니다."},
    "pentacles_06": {"upright": "공정하고 나누기를 좋아하는 성격입니다. 균형 감각이 있습니다.", "reversed": "불공정하거나 이기적인 성격입니다."},
    "pentacles_07": {"upright": "인내심이 강하고 장기적 안목이 있는 성격입니다.", "reversed": "조급하고 인내심이 부족한 성격입니다."},
    "pentacles_08": {"upright": "성실하고 기술을 익히려는 성격입니다. 장인 정신이 있습니다.", "reversed": "게으르거나 불성실한 성격입니다."},
    "pentacles_09": {"upright": "독립적이고 자립적인 성격입니다. 풍요를 추구합니다.", "reversed": "의존적이거나 불만족스러운 성격입니다."},
    "pentacles_10": {"upright": "가족을 중시하고 안정을 추구하는 성격입니다. 전통을 소중히 여깁니다.", "reversed": "가족 갈등이 있거나 재정 관리가 부족한 성격입니다."},
    "pentacles_11": {"upright": "학습을 좋아하고 성실한 성격입니다. 기술 습득에 열심입니다.", "reversed": "게으르거나 배우기를 거부하는 성격입니다."},
    "pentacles_12": {"upright": "책임감 있고 신중한 성격입니다. 꼼꼼하게 관리합니다.", "reversed": "과도하게 신중하거나 게으른 성격입니다."},
    "pentacles_13": {"upright": "실용적이고 안정적인 성격입니다. 물질적 안정을 중시합니다.", "reversed": "물질주의적이거나 융통성이 없는 성격입니다."},
    "pentacles_14": {"upright": "풍요롭고 성공을 이루는 성격입니다. 실용적 지혜가 있습니다.", "reversed": "탐욕스럽거나 부정직한 성격입니다."},
}

# personality 카테고리 추가
count = 0
for card_id, personality_meaning in pentacles_personality.items():
    if card_id in data["meanings"]:
        data["meanings"][card_id]["upright"]["personality"] = personality_meaning["upright"]
        data["meanings"][card_id]["reversed"]["personality"] = personality_meaning["reversed"]
        count += 1
        print(f"[추가] {card_id}")

# 파일 저장
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n✅ {count} 개 카드에 personality 카테고리 추가 완료!")
print("=" * 60)
