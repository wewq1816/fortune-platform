# -*- coding: utf-8 -*-
"""
짧은 taekil 의미 보완 스크립트
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
print("짧은 taekil 의미 보완 작업 시작")
print("=" * 60)

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 짧은 의미를 보완
fixes = {
    "swords_09": {
        "reversed": "평화를 찾으세요."  # 9자 → 보완
    },
    "pentacles_02": {
        "reversed": "균형을 잡으세요."  # 9자 → 보완
    },
    "pentacles_09": {
        "reversed": "균형을 찾으세요."  # 9자 → 보완
    },
    "pentacles_11": {
        "reversed": "열심히 배우세요."  # 9자 → 보완
    },
    "pentacles_12": {
        "reversed": "균형을 찾으세요."  # 9자 → 보완
    }
}

# 더 나은 의미로 교체
better_meanings = {
    "swords_09": {
        "reversed": "평화를 찾고 안정을 되찾으세요."
    },
    "pentacles_02": {
        "reversed": "우선순위를 정하고 균형을 잡으세요."
    },
    "pentacles_09": {
        "reversed": "성공과 관계의 균형을 찾으세요."
    },
    "pentacles_11": {
        "reversed": "게으름을 버리고 열심히 배우세요."
    },
    "pentacles_12": {
        "reversed": "과도한 신중함을 버리고 행동하세요."
    }
}

count = 0
for card_id, meanings in better_meanings.items():
    if card_id in data["meanings"]:
        for direction, meaning in meanings.items():
            if direction in data["meanings"][card_id]:
                old_meaning = data["meanings"][card_id][direction].get("taekil", "")
                data["meanings"][card_id][direction]["taekil"] = meaning
                print(f"[수정] {card_id}.{direction}.taekil")
                print(f"  이전: {old_meaning}")
                print(f"  변경: {meaning}")
                count += 1

# 파일 저장
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n✅ {count}개 의미 보완 완료!")
print("=" * 60)
