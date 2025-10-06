# -*- coding: utf-8 -*-
"""
move (이동운) 카테고리 추가 스크립트
78장 × 2방향 = 156개 move 의미 자동 생성
"""

import json
import os
import sys

# 윈도우 콘솔 인코딩 설정
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# 파일 경로
file_path = r"C:\xampp\htdocs\mysite\운세플랫폼\engines\data\tarot-cards-meanings.json"

print("=" * 60)
print("Tarot Cards - move (이동운) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# move 데이터 정의
print("\n[2/4] move 데이터 생성 중...")

move_data = {
    "major_00": {"upright": "새로운 장소로 이사하거나 이동할 기회가 옵니다. 모험적으로 도전하세요.", "reversed": "무계획한 이동이나 준비 부족으로 어려움을 겪습니다. 신중하게 계획하세요."},
    "major_01": {"upright": "강한 의지로 이동을 결정하고 성공적으로 정착합니다.", "reversed": "독단적 결정이나 과신으로 문제가 생깁니다. 조언을 구하세요."},
    "major_02": {"upright": "직관을 따라 이동 결정을 내립니다. 내면의 목소리를 들으세요.", "reversed": "정보 부족이나 불확실성으로 혼란스럽습니다. 충분히 알아보세요."},
    "major_03": {"upright": "편안하고 풍요로운 새 보금자리를 찾습니다. 안정적으로 정착하세요.", "reversed": "과잉보호나 의존적 태도로 이동이 어렵습니다. 독립적으로 결정하세요."},
    "major_04": {"upright": "체계적이고 안정적인 이사 계획을 세웁니다. 철저하게 준비하세요.", "reversed": "경직성이나 융통성 부족으로 이동이 지연됩니다. 유연하게 대처하세요."},
    "major_05": {"upright": "전통적인 방법이나 전문가의 도움으로 이동합니다.", "reversed": "낡은 방식에 얽매이거나 조언을 거부합니다. 새로운 방법을 시도하세요."},
    "major_06": {"upright": "이동할지 말지 중요한 선택의 기로에 섰습니다. 신중하게 결정하세요.", "reversed": "잘못된 선택이나 유혹에 빠집니다. 가치관에 따라 결정하세요."},
    "major_07": {"upright": "강한 의지로 이동을 추진하고 성공합니다.", "reversed": "통제력 상실이나 방향 상실로 실패합니다. 재정비하세요."},
    "major_08": {"upright": "인내심과 자제력으로 이동 준비를 완료합니다.", "reversed": "자제력 부족이나 충동적 이동으로 문제가 생깁니다. 차분하게 준비하세요."},
    "major_09": {"upright": "혼자 깊이 생각하고 이동을 계획합니다. 내면의 지혜를 활용하세요.", "reversed": "고립되거나 조언을 거부합니다. 소통하고 협력하세요."},
    "major_10": {"upright": "운명적인 이동 기회가 옵니다. 흐름에 맡기고 받아들이세요.", "reversed": "이동 계획이 좌절되거나 불운이 계속됩니다. 인내하세요."},
    "major_11": {"upright": "공정한 계약과 정당한 조건으로 이동합니다.", "reversed": "불공정한 계약이나 법적 문제가 생깁니다. 신중하게 검토하세요."},
    "major_12": {"upright": "이동을 위해 희생이나 대기가 필요합니다. 인내하고 새 관점을 찾으세요.", "reversed": "불필요한 희생이나 지연입니다. 행동하고 변화를 시작하세요."},
    "major_13": {"upright": "완전한 환경 변화와 새로운 시작입니다. 과거를 버리고 재탄생하세요.", "reversed": "변화를 두려워하고 현재에 머뭅니다. 용기를 내세요."},
    "major_14": {"upright": "균형 잡힌 이동 계획으로 안정적으로 정착합니다.", "reversed": "불균형이나 극단적 선택이 문제입니다. 중용을 지키세요."},
    "major_15": {"upright": "현재 장소에 대한 집착을 인식하세요. 자유로워지세요.", "reversed": "집착에서 벗어나 이동합니다."},
    "major_16": {"upright": "갑작스러운 이동이나 충격적인 환경 변화입니다.", "reversed": "최악의 위기를 넘기고 안정을 찾습니다."},
    "major_17": {"upright": "이동에 대한 희망과 가능성이 밝습니다.", "reversed": "희망을 잃거나 실망합니다. 긍정적 태도를 회복하세요."},
    "major_18": {"upright": "이동 여부가 불확실하고 혼란스럽습니다.", "reversed": "진실이 드러나고 상황이 명료해집니다."},
    "major_19": {"upright": "성공적인 이동과 새로운 환경에서의 빛나는 시작입니다.", "reversed": "일시적 후퇴나 과도한 기대입니다."},
    "major_20": {"upright": "중요한 이동 결정이나 재평가의 시기입니다.", "reversed": "과거 이동 실패에 얽매입니다. 용서하고 앞으로 나아가세요."},
    "major_21": {"upright": "이동 목표 달성과 완벽한 정착입니다.", "reversed": "마지막 단계에서 장애물이 있습니다. 끝까지 완수하세요."},
    "wands_01": {"upright": "새로운 장소로의 이동이 시작됩니다. 열정적으로 도전하세요.", "reversed": "동기 부족이나 이동 지연입니다."},
    "wands_02": {"upright": "장기 이동 계획을 세우고 목적지를 정합니다.", "reversed": "계획이 불분명하거나 우유부단합니다."},
    "wands_03": {"upright": "이동 준비가 잘 진행되고 긍정적입니다.", "reversed": "진행 지연이나 장애물이 있습니다."},
    "wands_04": {"upright": "안정적이고 조화로운 새 거처를 찾습니다.", "reversed": "불안정하거나 갈등이 있습니다."},
    "wands_05": {"upright": "이동 과정에서 경쟁이나 갈등이 있습니다.", "reversed": "갈등이 해소되고 협력합니다."},
    "wands_06": {"upright": "성공적인 이동과 인정을 받습니다.", "reversed": "이동 실패나 기대에 못 미칩니다."},
    "wands_07": {"upright": "이동 과정의 어려움을 견디고 버팁니다.", "reversed": "압도되거나 포기하고 싶습니다."},
    "wands_08": {"upright": "빠른 이동이나 급격한 환경 변화입니다.", "reversed": "이동이 지연되거나 너무 서둘러 문제가 생깁니다."},
    "wands_09": {"upright": "거의 이동이 완료되었습니다. 끝까지 집중하세요.", "reversed": "소진되거나 지쳤습니다. 휴식을 취하세요."},
    "wands_10": {"upright": "과도한 짐과 부담으로 이동이 힘듭니다.", "reversed": "부담을 줄이고 가벼워집니다."},
    "wands_11": {"upright": "새로운 장소에 호기심과 열정이 있습니다.", "reversed": "조급하거나 불성실합니다."},
    "wands_12": {"upright": "적극적이고 모험적으로 이동합니다.", "reversed": "무모하거나 계획 없이 이동합니다."},
    "wands_13": {"upright": "열정적이고 독립적으로 이동합니다.", "reversed": "과열되거나 불균형합니다."},
    "wands_14": {"upright": "강력한 의지로 이동을 주도하고 성공합니다.", "reversed": "독재적이거나 무책임합니다."},
    "cups_01": {"upright": "새로운 장소에서 감정적 만족과 행복을 찾습니다.", "reversed": "감정적 공허로 이동 동기가 없습니다."},
    "cups_02": {"upright": "파트너와 함께 이동하고 조화롭습니다.", "reversed": "불균형하거나 갈등이 있습니다."},
    "cups_03": {"upright": "친구들과 함께 즐겁게 이동합니다.", "reversed": "과도한 사교로 이동 준비가 부족합니다."},
    "cups_04": {"upright": "현재 장소에 무관심하거나 이동에 관심 없습니다.", "reversed": "새로운 기회에 관심을 가집니다."},
    "cups_05": {"upright": "이동 실패나 장소 선택 실망입니다.", "reversed": "실망에서 회복하고 다시 도전합니다."},
    "cups_06": {"upright": "과거 살던 곳이나 추억을 그리워합니다.", "reversed": "과거에 얽매여 이동하지 못합니다."},
    "cups_07": {"upright": "많은 장소 중 선택하기 어렵습니다.", "reversed": "명료함을 얻고 결정합니다."},
    "cups_08": {"upright": "현재 장소를 떠나 더 나은 곳을 찾습니다.", "reversed": "변화를 두려워하고 현재에 머뭅니다."},
    "cups_09": {"upright": "이동 소원이 이루어지고 만족합니다.", "reversed": "이동했지만 만족하지 못합니다."},
    "cups_10": {"upright": "가족과 함께 행복하게 이동합니다.", "reversed": "가족 갈등으로 이동이 어렵습니다."},
    "cups_11": {"upright": "창의적으로 새로운 장소를 꿈꿉니다.", "reversed": "비현실적이거나 미성숙한 계획입니다."},
    "cups_12": {"upright": "이상적인 장소를 낭만적으로 추구합니다.", "reversed": "현실 도피나 불안정합니다."},
    "cups_13": {"upright": "성숙하고 안정적으로 이동합니다.", "reversed": "감정 불안정이 이동에 영향을 줍니다."},
    "cups_14": {"upright": "감정적 균형으로 지혜롭게 이동합니다.", "reversed": "감정 조종이나 불안정입니다."},
    "swords_01": {"upright": "명확한 사고로 이동을 결정합니다.", "reversed": "혼란이나 잘못된 판단입니다."},
    "swords_02": {"upright": "이동할지 말지 어려운 선택입니다.", "reversed": "결정을 내리고 행동합니다."},
    "swords_03": {"upright": "이동 과정에서 고통이나 스트레스를 겪습니다.", "reversed": "고통에서 회복하고 치유됩니다."},
    "swords_04": {"upright": "이동 전 휴식과 재충전이 필요합니다.", "reversed": "휴식에서 벗어나 이동을 시작합니다."},
    "swords_05": {"upright": "이동 과정에서 갈등이나 불공정이 있습니다.", "reversed": "갈등이 해소되고 공정해집니다."},
    "swords_06": {"upright": "어려움에서 벗어나 이동합니다.", "reversed": "변화가 지연되거나 정체됩니다."},
    "swords_07": {"upright": "전략적이지만 부정직한 방법을 쓸 수 있습니다.", "reversed": "정직해지고 올바른 방법을 씁니다."},
    "swords_08": {"upright": "제약받거나 이동이 막힌 느낌입니다.", "reversed": "제약에서 벗어나 자유롭게 이동합니다."},
    "swords_09": {"upright": "이동 불안과 걱정에 시달립니다.", "reversed": "불안에서 벗어나 평화를 찾습니다."},
    "swords_10": {"upright": "최악의 이동 상황이나 강제 이동입니다.", "reversed": "최악에서 회복하고 안정을 찾습니다."},
    "swords_11": {"upright": "명확한 정보와 정직한 계약으로 이동합니다.", "reversed": "허위 정보나 부정직한 계약입니다."},
    "swords_12": {"upright": "열정적이지만 성급하게 이동합니다.", "reversed": "무모하거나 충동적입니다."},
    "swords_13": {"upright": "독립적이고 명확하게 이동 결정을 내립니다.", "reversed": "냉담하거나 고립됩니다."},
    "swords_14": {"upright": "지적 판단과 전략으로 이동합니다.", "reversed": "독단적이거나 권위적입니다."},
    "pentacles_01": {"upright": "새로운 안정적인 거처나 재정적 기회가 있습니다.", "reversed": "기회 상실이나 재정 문제입니다."},
    "pentacles_02": {"upright": "이사와 다른 일의 균형을 잡습니다.", "reversed": "균형을 잃고 혼란스럽습니다."},
    "pentacles_03": {"upright": "협력하여 성공적으로 이동합니다.", "reversed": "협력 실패나 문제가 있습니다."},
    "pentacles_04": {"upright": "현재 장소를 지나치게 통제하거나 집착합니다.", "reversed": "집착에서 벗어나 이동합니다."},
    "pentacles_05": {"upright": "재정 어려움으로 이동이 힘듭니다.", "reversed": "어려움에서 회복하고 이동합니다."},
    "pentacles_06": {"upright": "공정하게 비용을 분담하며 이동합니다.", "reversed": "불균형하거나 일방적입니다."},
    "pentacles_07": {"upright": "인내심을 가지고 이동 결과를 기다립니다.", "reversed": "조급해하거나 결과가 부족합니다."},
    "pentacles_08": {"upright": "성실하게 이동을 준비하고 실행합니다.", "reversed": "게으르거나 불성실합니다."},
    "pentacles_09": {"upright": "독립적이고 성공적으로 이동합니다.", "reversed": "성공에도 외롭거나 불안합니다."},
    "pentacles_10": {"upright": "가족과 함께 장기적으로 안정된 곳으로 이동합니다.", "reversed": "가족 문제로 이동이 어렵습니다."},
    "pentacles_11": {"upright": "성실하게 이동 정보를 배우고 준비합니다.", "reversed": "게으르거나 준비 거부입니다."},
    "pentacles_12": {"upright": "책임감 있고 꾸준히 이동을 준비합니다.", "reversed": "게으르거나 과도하게 신중합니다."},
    "pentacles_13": {"upright": "실용적이고 안정적으로 이동합니다.", "reversed": "물질주의나 집착이 문제입니다."},
    "pentacles_14": {"upright": "실용적 지혜로 최적의 장소로 이동합니다.", "reversed": "탐욕이나 부정직입니다."},
}

print(f"[OK] move 데이터 생성 완료: {len(move_data)} 장")

# move 추가
print("\n[3/4] 카드에 move 추가 중...")
count = 0
for card_id, move in move_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["move"] = move["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["move"] = move["reversed"]
        count += 1

print(f"[OK] move 추가 완료: {count} 장")

# 파일 저장
print("\n[4/4] 파일 저장 중...")
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"[OK] 파일 저장 완료: {file_path}")

# 완성 통계
print("\n" + "=" * 60)
print("작업 완료!")
print("=" * 60)
print(f"[OK] 전체 카드: {len(data['meanings'])} 장")
print(f"[OK] move 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] move (이동운) 카테고리 추가 작업 완료!")
print("=" * 60)
