# -*- coding: utf-8 -*-
"""
health (건강운) 카테고리 추가 스크립트
78장 × 2방향 = 156개 health 의미 자동 생성
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
print("Tarot Cards - health (건강운) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# health 데이터 정의 (간략화)
print("\n[2/4] health 데이터 생성 중...")

health_data = {
    "major_00": {"upright": "새로운 건강 습관을 시작하기 좋은 시기입니다.", "reversed": "무모한 건강 관리로 몸을 해칠 수 있습니다."},
    "major_01": {"upright": "강한 의지로 건강 목표를 달성합니다.", "reversed": "건강을 과신하거나 몸의 신호를 무시합니다."},
    "major_02": {"upright": "직관을 따라 몸의 신호를 듣고 이해하세요.", "reversed": "몸의 신호를 무시하거나 건강 문제를 숨깁니다."},
    "major_03": {"upright": "풍요롭고 건강한 신체를 유지합니다.", "reversed": "과식이나 자기 관리 소홀로 건강이 나빠집니다."},
    "major_04": {"upright": "규칙적이고 안정적인 건강 관리가 효과적입니다.", "reversed": "지나친 통제로 스트레스를 받습니다."},
    "major_05": {"upright": "전통적인 의학이나 검증된 치료법이 효과적입니다.", "reversed": "낡은 건강 습관에 얽매입니다."},
    "major_06": {"upright": "건강한 선택의 기로에 섰습니다.", "reversed": "건강에 해로운 선택을 반복합니다."},
    "major_07": {"upright": "강한 의지로 건강을 회복합니다.", "reversed": "과로나 스트레스로 건강이 악화됩니다."},
    "major_08": {"upright": "부드러운 힘으로 건강을 회복합니다.", "reversed": "자제력을 잃고 충동적으로 행동합니다."},
    "major_09": {"upright": "혼자만의 시간으로 휴식하고 회복합니다.", "reversed": "고립되거나 도움을 거부합니다."},
    "major_10": {"upright": "건강 운이 좋아지고 긍정적인 변화가 옵니다.", "reversed": "건강 악화나 불운이 반복됩니다."},
    "major_11": {"upright": "공정한 진단과 균형 잡힌 치료를 받습니다.", "reversed": "오진이나 불공정한 치료를 받습니다."},
    "major_12": {"upright": "건강을 위해 희생하거나 기다려야 합니다.", "reversed": "불필요한 희생이나 치료 지연이 있습니다."},
    "major_13": {"upright": "건강 상태가 완전히 바뀝니다.", "reversed": "변화를 두려워하고 나쁜 습관을 고수합니다."},
    "major_14": {"upright": "균형 잡힌 생활과 절제가 건강의 핵심입니다.", "reversed": "극단적인 건강 관리나 불균형이 문제입니다."},
    "major_15": {"upright": "중독이나 나쁜 습관을 직시해야 합니다.", "reversed": "중독에서 벗어나 건강을 회복합니다."},
    "major_16": {"upright": "갑작스러운 건강 위기나 충격적인 진단을 받습니다.", "reversed": "최악의 위기를 넘기고 회복합니다."},
    "major_17": {"upright": "건강에 대한 희망과 낙관이 가득합니다.", "reversed": "건강 회복 희망을 잃거나 실망합니다."},
    "major_18": {"upright": "건강 상태가 불확실하고 혼란스럽습니다.", "reversed": "건강 문제의 진실이 드러나고 명료해집니다."},
    "major_19": {"upright": "건강이 크게 개선되고 활력이 넘칩니다.", "reversed": "일시적 피로나 에너지 부족이 있습니다."},
    "major_20": {"upright": "건강에 대한 각성과 새로운 기회가 옵니다.", "reversed": "과거 건강 문제에 얽매입니다."},
    "major_21": {"upright": "건강의 완성과 최적 상태를 이룹니다.", "reversed": "건강 목표가 미완성입니다."},
    "wands_01": {"upright": "새로운 운동이나 건강 프로그램을 시작하기 좋습니다.", "reversed": "동기 부족이나 에너지 부족입니다."},
    "wands_02": {"upright": "장기 건강 계획을 세웁니다.", "reversed": "계획이 불분명하거나 우유부단합니다."},
    "wands_03": {"upright": "건강이 개선되고 회복이 진행됩니다.", "reversed": "회복이 지연됩니다."},
    "wands_04": {"upright": "건강하고 안정적인 상태를 유지합니다.", "reversed": "건강 불안정이 있습니다."},
    "wands_05": {"upright": "스트레스로 건강에 영향을 받습니다.", "reversed": "스트레스를 줄이고 평화를 찾습니다."},
    "wands_06": {"upright": "건강 목표를 달성하고 인정받습니다.", "reversed": "기대에 못 미칩니다."},
    "wands_07": {"upright": "강하게 버티고 건강을 지킵니다.", "reversed": "지치거나 방어력이 약해집니다."},
    "wands_08": {"upright": "빠른 회복이나 급격한 개선이 있습니다.", "reversed": "회복이 지연됩니다."},
    "wands_09": {"upright": "거의 회복 단계에 도달했습니다.", "reversed": "소진되거나 방어적입니다."},
    "wands_10": {"upright": "과도한 부담으로 건강이 악화됩니다.", "reversed": "부담을 내려놓고 회복합니다."},
    "wands_11": {"upright": "새로운 건강 방법에 호기심을 가집니다.", "reversed": "조급하거나 불성실합니다."},
    "wands_12": {"upright": "적극적으로 건강을 관리합니다.", "reversed": "무모하거나 충동적입니다."},
    "wands_13": {"upright": "독립적이고 열정적으로 건강을 관리합니다.", "reversed": "과열이나 지나친 열정이 문제입니다."},
    "wands_14": {"upright": "강력한 에너지로 건강을 이끕니다.", "reversed": "독재적이거나 무책임합니다."},
    "cups_01": {"upright": "감정적 치유와 새로운 건강 시작입니다.", "reversed": "감정적 공허가 신체 건강에 영향을 줍니다."},
    "cups_02": {"upright": "균형 잡힌 건강과 조화로운 몸과 마음입니다.", "reversed": "불균형하거나 갈등으로 건강이 나빠집니다."},
    "cups_03": {"upright": "사회적 활동이 건강에 좋습니다.", "reversed": "과도한 사교로 피곤합니다."},
    "cups_04": {"upright": "현재 건강에 무관심하거나 지루합니다.", "reversed": "건강의 중요성을 깨닫습니다."},
    "cups_05": {"upright": "실망이나 슬픔이 건강에 영향을 줍니다.", "reversed": "슬픔을 극복하고 건강을 회복합니다."},
    "cups_06": {"upright": "과거 건강 방법을 다시 시도합니다.", "reversed": "과거에 얽매여 현재를 소홀히 합니다."},
    "cups_07": {"upright": "여러 건강 방법 중 선택하기 어렵습니다.", "reversed": "명료함을 얻고 올바른 선택을 합니다."},
    "cups_08": {"upright": "현재 방법을 버리고 더 나은 것을 찾습니다.", "reversed": "변화를 두려워하고 현재에 머뭅니다."},
    "cups_09": {"upright": "건강 소원이 이루어집니다.", "reversed": "물질적으로는 만족하지만 정신적으로 공허합니다."},
    "cups_10": {"upright": "가족과 함께 건강하고 행복합니다.", "reversed": "가족 문제로 스트레스를 받습니다."},
    "cups_11": {"upright": "창의적인 치유 방법을 시도합니다.", "reversed": "비현실적 기대나 미성숙한 접근입니다."},
    "cups_12": {"upright": "이상주의적이고 낭만적으로 건강을 관리합니다.", "reversed": "현실 도피나 불안정한 태도입니다."},
    "cups_13": {"upright": "감정적으로 성숙하고 안정적으로 건강을 관리합니다.", "reversed": "감정 불안정이 건강에 영향을 줍니다."},
    "cups_14": {"upright": "감정적 지혜로 균형 잡힌 건강을 유지합니다.", "reversed": "감정 조종이나 불안정이 문제입니다."},
    "swords_01": {"upright": "명확한 진단과 치료 계획을 세웁니다.", "reversed": "혼란스럽거나 오진이 있습니다."},
    "swords_02": {"upright": "치료 방법 사이에서 선택해야 합니다.", "reversed": "결정을 내리고 치료를 시작합니다."},
    "swords_03": {"upright": "고통이나 심한 증상이 있습니다.", "reversed": "고통에서 회복하고 치유됩니다."},
    "swords_04": {"upright": "휴식과 회복이 필요합니다.", "reversed": "휴식에서 벗어나 활동을 재개합니다."},
    "swords_05": {"upright": "갈등이나 스트레스로 건강이 나빠집니다.", "reversed": "갈등이 해소되고 건강이 회복됩니다."},
    "swords_06": {"upright": "문제에서 벗어나 회복합니다.", "reversed": "변화가 지연되거나 문제가 계속됩니다."},
    "swords_07": {"upright": "전략적으로 건강을 관리하되 정직해야 합니다.", "reversed": "부정직하거나 속임수가 드러납니다."},
    "swords_08": {"upright": "제약받는 느낌이지만 스스로 만든 제약입니다.", "reversed": "제약에서 벗어나 자유로워집니다."},
    "swords_09": {"upright": "건강 불안과 걱정에 시달립니다.", "reversed": "불안에서 벗어나 평화를 찾습니다."},
    "swords_10": {"upright": "심각한 건강 문제나 최악의 상황입니다.", "reversed": "최악의 상황에서 회복합니다."},
    "swords_11": {"upright": "명확한 소통과 정확한 진단이 도움이 됩니다.", "reversed": "비판이나 허위 정보가 문제입니다."},
    "swords_12": {"upright": "열정적으로 건강을 추구하지만 성급하지 마세요.", "reversed": "무모하거나 충동적입니다."},
    "swords_13": {"upright": "독립적이고 명확하게 건강을 관리합니다.", "reversed": "냉담하거나 고립됩니다."},
    "swords_14": {"upright": "지적 권위로 건강을 관리하고 현명하게 결정합니다.", "reversed": "독단적이거나 권위를 남용합니다."},
    "pentacles_01": {"upright": "새로운 건강 습관이나 치료법을 시작하기 좋습니다.", "reversed": "불안정하거나 계획이 실행되지 않습니다."},
    "pentacles_02": {"upright": "일과 건강 사이에서 균형을 잡습니다.", "reversed": "균형을 잃고 혼란스럽습니다."},
    "pentacles_03": {"upright": "함께 노력하여 건강을 개선합니다.", "reversed": "협력 실패나 노력 부족으로 정체됩니다."},
    "pentacles_04": {"upright": "건강에 지나치게 집착하거나 통제합니다.", "reversed": "집착에서 벗어나 자유로워집니다."},
    "pentacles_05": {"upright": "경제적 어려움이 건강에 영향을 줍니다.", "reversed": "어려움에서 회복하고 안정을 찾습니다."},
    "pentacles_06": {"upright": "관대하게 주고받으며 건강을 지킵니다.", "reversed": "불균형하거나 일방적입니다."},
    "pentacles_07": {"upright": "인내심을 가지고 건강이 개선되길 기다립니다.", "reversed": "조급해하거나 결과가 기대에 못 미칩니다."},
    "pentacles_08": {"upright": "성실하게 건강을 관리하고 꾸준히 노력합니다.", "reversed": "게으르거나 불성실해집니다."},
    "pentacles_09": {"upright": "독립적이고 건강하게 자신을 돌봅니다.", "reversed": "성공에도 외롭거나 공허합니다."},
    "pentacles_10": {"upright": "가족과 함께 건강하고 풍요롭게 살아갑니다.", "reversed": "가족 문제로 스트레스를 받습니다."},
    "pentacles_11": {"upright": "성실하게 건강 지식을 배우고 실천합니다.", "reversed": "게으르거나 배우지 않습니다."},
    "pentacles_12": {"upright": "책임감 있고 꾸준하게 건강을 관리합니다.", "reversed": "게으르거나 과도하게 신중합니다."},
    "pentacles_13": {"upright": "실용적이고 안정적으로 건강을 관리합니다.", "reversed": "일중독이나 물질주의가 문제입니다."},
    "pentacles_14": {"upright": "실용적 지혜로 안정적인 건강을 유지합니다.", "reversed": "탐욕이나 물질주의가 건강을 해칩니다."},
}

print(f"[OK] health 데이터 생성 완료: {len(health_data)} 장")

# health 추가
print("\n[3/4] 카드에 health 추가 중...")
count = 0
for card_id, health in health_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["health"] = health["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["health"] = health["reversed"]
        count += 1

print(f"[OK] health 추가 완료: {count} 장")

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
print(f"[OK] health 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] health (건강운) 카테고리 추가 작업 완료!")
print("=" * 60)
