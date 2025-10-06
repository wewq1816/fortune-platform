# -*- coding: utf-8 -*-
"""
travel (여행운) 카테고리 추가 스크립트
78장 × 2방향 = 156개 travel 의미 자동 생성
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
print("Tarot Cards - travel (여행운) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# travel 데이터 정의
print("\n[2/4] travel 데이터 생성 중...")

travel_data = {
    "major_00": {"upright": "새로운 여행이나 모험이 시작됩니다. 자유롭게 떠나세요.", "reversed": "무계획한 여행이나 준비 부족으로 어려움을 겪습니다. 철저히 준비하세요."},
    "major_01": {"upright": "강한 의지로 여행을 계획하고 성공적으로 다녀옵니다.", "reversed": "독단적 계획이나 과신으로 문제가 생깁니다. 동행자와 상의하세요."},
    "major_02": {"upright": "직관을 따라 여행지를 선택합니다. 내면의 목소리를 들으세요.", "reversed": "정보 부족이나 불확실성으로 혼란스럽습니다. 충분히 알아보세요."},
    "major_03": {"upright": "편안하고 풍요로운 여행을 즐깁니다. 여유롭게 즐기세요.", "reversed": "과잉보호나 의존적 태도로 여행이 제한됩니다. 독립적으로 즐기세요."},
    "major_04": {"upright": "체계적이고 계획적인 여행을 합니다. 일정을 철저히 짜세요.", "reversed": "경직된 일정이나 융통성 부족으로 즐기지 못합니다. 유연하게 즐기세요."},
    "major_05": {"upright": "전통적인 관광지나 유명한 곳을 여행합니다.", "reversed": "틀에 박힌 여행에 지루함을 느낍니다. 새로운 곳을 시도하세요."},
    "major_06": {"upright": "여행지를 선택하는 중요한 기로에 섰습니다. 신중하게 결정하세요.", "reversed": "잘못된 선택이나 유혹에 빠집니다. 가치관에 따라 선택하세요."},
    "major_07": {"upright": "강한 의지로 여행 목표를 달성합니다.", "reversed": "통제력 상실이나 방향 상실로 길을 잃습니다. 재정비하세요."},
    "major_08": {"upright": "인내심과 자제력으로 여행의 어려움을 극복합니다.", "reversed": "자제력 부족이나 충동적 행동으로 문제가 생깁니다. 차분하게 대처하세요."},
    "major_09": {"upright": "혼자 깊이 생각하며 여행합니다. 명상적 여행을 즐기세요.", "reversed": "고립되거나 소통을 거부합니다. 현지인이나 여행자와 교류하세요."},
    "major_10": {"upright": "운명적인 여행 기회가 옵니다. 흐름에 맡기고 떠나세요.", "reversed": "여행 계획이 좌절되거나 불운이 계속됩니다. 인내하세요."},
    "major_11": {"upright": "공정한 거래와 정당한 조건으로 여행합니다.", "reversed": "사기나 불공정한 거래를 당합니다. 신중하게 확인하세요."},
    "major_12": {"upright": "여행을 위해 희생이나 대기가 필요합니다. 인내하고 새 관점을 찾으세요.", "reversed": "불필요한 희생이나 지연입니다. 행동하고 떠나세요."},
    "major_13": {"upright": "완전한 변화를 가져오는 여행입니다. 인생이 바뀝니다.", "reversed": "변화를 두려워하고 여행을 미룹니다. 용기를 내세요."},
    "major_14": {"upright": "균형 잡힌 여행 계획으로 안정적으로 다녀옵니다.", "reversed": "불균형이나 극단적 여행이 문제입니다. 중용을 지키세요."},
    "major_15": {"upright": "여행 중독이나 집착을 인식하세요. 균형을 찾으세요.", "reversed": "집착에서 벗어나 건강하게 여행합니다."},
    "major_16": {"upright": "갑작스러운 여행 변경이나 충격적인 사건이 발생합니다.", "reversed": "최악의 위기를 넘기고 안전하게 돌아옵니다."},
    "major_17": {"upright": "여행에 대한 희망과 영감이 가득합니다. 꿈꾸던 여행을 가세요.", "reversed": "희망을 잃거나 실망합니다. 긍정적 태도를 회복하세요."},
    "major_18": {"upright": "여행 계획이 불확실하고 혼란스럽습니다.", "reversed": "진실이 드러나고 상황이 명료해집니다."},
    "major_19": {"upright": "성공적이고 즐거운 여행을 합니다. 밝게 빛나는 경험입니다.", "reversed": "일시적 후퇴나 과도한 기대입니다."},
    "major_20": {"upright": "중요한 여행 결정이나 재평가의 시기입니다.", "reversed": "과거 여행 실패에 얽매입니다. 용서하고 새로운 여행을 계획하세요."},
    "major_21": {"upright": "여행 목표 달성과 완벽한 경험입니다.", "reversed": "마지막 단계에서 장애물이 있습니다. 끝까지 완수하세요."},
    "wands_01": {"upright": "새로운 여행이 시작됩니다. 열정적으로 떠나세요.", "reversed": "동기 부족이나 여행 지연입니다."},
    "wands_02": {"upright": "장기 여행 계획을 세우고 목적지를 정합니다.", "reversed": "계획이 불분명하거나 우유부단합니다."},
    "wands_03": {"upright": "여행 준비가 잘 진행되고 기대됩니다.", "reversed": "진행 지연이나 장애물이 있습니다."},
    "wands_04": {"upright": "안정적이고 편안한 여행을 즐깁니다.", "reversed": "불안정하거나 갈등이 있습니다."},
    "wands_05": {"upright": "여행 중 경쟁이나 갈등이 있습니다.", "reversed": "갈등이 해소되고 협력합니다."},
    "wands_06": {"upright": "성공적인 여행과 좋은 경험을 합니다.", "reversed": "여행 실패나 기대에 못 미칩니다."},
    "wands_07": {"upright": "여행 중 어려움을 견디고 버팁니다.", "reversed": "압도되거나 포기하고 싶습니다."},
    "wands_08": {"upright": "빠른 여행이나 급격한 이동입니다.", "reversed": "여행이 지연되거나 너무 서둘러 피곤합니다."},
    "wands_09": {"upright": "거의 여행이 끝나갑니다. 끝까지 즐기세요.", "reversed": "소진되거나 지쳤습니다. 휴식을 취하세요."},
    "wands_10": {"upright": "과도한 짐과 일정으로 여행이 힘듭니다.", "reversed": "짐을 줄이고 가벼워집니다."},
    "wands_11": {"upright": "새로운 장소에 호기심과 열정이 있습니다.", "reversed": "조급하거나 불성실합니다."},
    "wands_12": {"upright": "적극적이고 모험적으로 여행합니다.", "reversed": "무모하거나 계획 없이 여행합니다."},
    "wands_13": {"upright": "열정적이고 독립적으로 여행합니다.", "reversed": "과열되거나 불균형합니다."},
    "wands_14": {"upright": "강력한 의지로 여행을 주도하고 성공합니다.", "reversed": "독재적이거나 무책임합니다."},
    "cups_01": {"upright": "새로운 여행에서 감정적 만족과 행복을 찾습니다.", "reversed": "감정적 공허로 여행 동기가 없습니다."},
    "cups_02": {"upright": "파트너와 함께 조화로운 여행을 합니다.", "reversed": "불균형하거나 갈등이 있습니다."},
    "cups_03": {"upright": "친구들과 함께 즐겁게 여행합니다.", "reversed": "과도한 사교로 여행을 즐기지 못합니다."},
    "cups_04": {"upright": "현재 여행에 무관심하거나 지루합니다.", "reversed": "새로운 관심을 찾고 즐깁니다."},
    "cups_05": {"upright": "여행 중 실망이나 손실이 있습니다.", "reversed": "실망에서 회복하고 다시 즐깁니다."},
    "cups_06": {"upright": "과거 여행이나 추억을 그리워합니다.", "reversed": "과거에 얽매여 현재 여행을 즐기지 못합니다."},
    "cups_07": {"upright": "많은 여행지 중 선택하기 어렵습니다.", "reversed": "명료함을 얻고 결정합니다."},
    "cups_08": {"upright": "현재 여행을 떠나 더 나은 곳을 찾습니다.", "reversed": "변화를 두려워하고 현재에 머뭅니다."},
    "cups_09": {"upright": "여행 소원이 이루어지고 만족합니다.", "reversed": "여행했지만 만족하지 못합니다."},
    "cups_10": {"upright": "가족과 함께 행복하게 여행합니다.", "reversed": "가족 갈등으로 여행이 어렵습니다."},
    "cups_11": {"upright": "창의적으로 새로운 여행을 꿈꿉니다.", "reversed": "비현실적이거나 미성숙한 계획입니다."},
    "cups_12": {"upright": "이상적인 여행을 낭만적으로 추구합니다.", "reversed": "현실 도피나 불안정합니다."},
    "cups_13": {"upright": "성숙하고 안정적으로 여행합니다.", "reversed": "감정 불안정이 여행에 영향을 줍니다."},
    "cups_14": {"upright": "감정적 균형으로 지혜롭게 여행합니다.", "reversed": "감정 조종이나 불안정입니다."},
    "swords_01": {"upright": "명확한 계획과 사고로 여행을 결정합니다.", "reversed": "혼란이나 잘못된 판단입니다."},
    "swords_02": {"upright": "여행할지 말지 어려운 선택입니다.", "reversed": "결정을 내리고 행동합니다."},
    "swords_03": {"upright": "여행 중 고통이나 스트레스를 겪습니다.", "reversed": "고통에서 회복하고 치유됩니다."},
    "swords_04": {"upright": "여행 전 휴식과 재충전이 필요합니다.", "reversed": "휴식에서 벗어나 여행을 시작합니다."},
    "swords_05": {"upright": "여행 중 갈등이나 불공정이 있습니다.", "reversed": "갈등이 해소되고 공정해집니다."},
    "swords_06": {"upright": "어려움에서 벗어나 여행을 떠납니다.", "reversed": "변화가 지연되거나 정체됩니다."},
    "swords_07": {"upright": "전략적이지만 부정직한 방법을 쓸 수 있습니다.", "reversed": "정직해지고 올바른 방법을 씁니다."},
    "swords_08": {"upright": "제약받거나 여행이 막힌 느낌입니다.", "reversed": "제약에서 벗어나 자유롭게 여행합니다."},
    "swords_09": {"upright": "여행 불안과 걱정에 시달립니다.", "reversed": "불안에서 벗어나 평화를 찾습니다."},
    "swords_10": {"upright": "최악의 여행 상황이나 사고입니다.", "reversed": "최악에서 회복하고 안전하게 돌아옵니다."},
    "swords_11": {"upright": "명확한 정보와 정직한 여행입니다.", "reversed": "허위 정보나 사기를 당합니다."},
    "swords_12": {"upright": "열정적이지만 성급하게 여행합니다.", "reversed": "무모하거나 충동적입니다."},
    "swords_13": {"upright": "독립적이고 명확하게 여행 결정을 내립니다.", "reversed": "냉담하거나 고립됩니다."},
    "swords_14": {"upright": "지적 호기심과 전략으로 여행합니다.", "reversed": "독단적이거나 권위적입니다."},
    "pentacles_01": {"upright": "새로운 안정적인 여행 기회가 있습니다.", "reversed": "기회 상실이나 재정 문제입니다."},
    "pentacles_02": {"upright": "여행과 일의 균형을 잡습니다.", "reversed": "균형을 잃고 혼란스럽습니다."},
    "pentacles_03": {"upright": "협력하여 성공적으로 여행합니다.", "reversed": "협력 실패나 문제가 있습니다."},
    "pentacles_04": {"upright": "여행 예산을 지나치게 통제합니다.", "reversed": "통제에서 벗어나 자유롭게 씁니다."},
    "pentacles_05": {"upright": "재정 어려움으로 여행이 힘듭니다.", "reversed": "어려움에서 회복하고 여행합니다."},
    "pentacles_06": {"upright": "공정하게 비용을 분담하며 여행합니다.", "reversed": "불균형하거나 일방적입니다."},
    "pentacles_07": {"upright": "인내심을 가지고 여행 결과를 기다립니다.", "reversed": "조급해하거나 결과가 부족합니다."},
    "pentacles_08": {"upright": "성실하게 여행을 준비하고 실행합니다.", "reversed": "게으르거나 불성실합니다."},
    "pentacles_09": {"upright": "독립적이고 성공적으로 여행합니다.", "reversed": "성공에도 외롭거나 불안합니다."},
    "pentacles_10": {"upright": "가족과 함께 풍요롭게 여행합니다.", "reversed": "가족 문제로 여행이 어렵습니다."},
    "pentacles_11": {"upright": "성실하게 여행 정보를 배우고 준비합니다.", "reversed": "게으르거나 준비 거부입니다."},
    "pentacles_12": {"upright": "책임감 있고 꾸준히 여행을 준비합니다.", "reversed": "게으르거나 과도하게 신중합니다."},
    "pentacles_13": {"upright": "실용적이고 안정적으로 여행합니다.", "reversed": "물질주의나 집착이 문제입니다."},
    "pentacles_14": {"upright": "실용적 지혜로 최적의 여행을 합니다.", "reversed": "탐욕이나 부정직입니다."},
}

print(f"[OK] travel 데이터 생성 완료: {len(travel_data)} 장")

# travel 추가
print("\n[3/4] 카드에 travel 추가 중...")
count = 0
for card_id, travel in travel_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["travel"] = travel["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["travel"] = travel["reversed"]
        count += 1

print(f"[OK] travel 추가 완료: {count} 장")

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
print(f"[OK] travel 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] travel (여행운) 카테고리 추가 작업 완료!")
print("=" * 60)
