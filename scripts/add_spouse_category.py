# -*- coding: utf-8 -*-
"""
spouse (배우자운) 카테고리 추가 스크립트
78장 × 2방향 = 156개 spouse 의미 자동 생성
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
print("Tarot Cards - spouse (배우자운) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# spouse 데이터 정의
print("\n[2/4] spouse 데이터 생성 중...")

spouse_data = {
    "major_00": {"upright": "배우자와의 새로운 시작이나 관계 개선이 있습니다. 순수한 마음으로 다가가세요.", "reversed": "무계획한 접근이나 경솔한 행동으로 갈등이 생깁니다. 신중하게 대화하세요."},
    "major_01": {"upright": "강한 의지로 배우자와의 문제를 해결합니다. 주도적으로 소통하세요.", "reversed": "독단적 태도나 권위적 접근이 문제입니다. 평등하게 대화하세요."},
    "major_02": {"upright": "직관으로 배우자의 속마음을 이해합니다. 내면의 목소리를 따르세요.", "reversed": "소통 부족이나 오해로 관계가 어렵습니다. 솔직하게 대화하세요."},
    "major_03": {"upright": "따뜻하고 보살피는 관계를 유지합니다. 서로를 돌보세요.", "reversed": "과잉간섭이나 의존적 관계가 문제입니다. 독립성을 존중하세요."},
    "major_04": {"upright": "안정적이고 체계적인 결혼 생활을 유지합니다. 규칙과 경계를 존중하세요.", "reversed": "경직된 관계나 융통성 부족이 문제입니다. 유연하게 접근하세요."},
    "major_05": {"upright": "전통적 부부 가치관을 중요하게 여깁니다. 전통을 이어가세요.", "reversed": "가치관 충돌이나 세대 차이가 있습니다. 서로를 이해하세요."},
    "major_06": {"upright": "배우자와의 관계에서 중요한 선택을 해야 합니다. 신중하게 결정하세요.", "reversed": "잘못된 선택이나 갈등이 있습니다. 균형을 찾으세요."},
    "major_07": {"upright": "강한 의지로 배우자와의 갈등을 극복합니다.", "reversed": "통제력 상실이나 관계 악화입니다. 재정비하세요."},
    "major_08": {"upright": "인내심과 자제력으로 배우자를 이해합니다.", "reversed": "자제력 부족이나 감정 폭발로 관계가 나빠집니다. 차분하게 대처하세요."},
    "major_09": {"upright": "혼자 배우자와의 관계를 깊이 성찰합니다.", "reversed": "고립되거나 소통을 거부합니다. 대화를 시도하세요."},
    "major_10": {"upright": "배우자와의 관계가 긍정적으로 변화합니다.", "reversed": "관계 악화나 불운이 계속됩니다. 인내하세요."},
    "major_11": {"upright": "공정하고 균형 잡힌 부부 관계를 유지합니다.", "reversed": "불공정하거나 편파적 대우가 있습니다. 객관적으로 보세요."},
    "major_12": {"upright": "배우자를 위해 희생하거나 기다립니다.", "reversed": "불필요한 희생이나 관계 정체입니다. 균형을 찾으세요."},
    "major_13": {"upright": "배우자와의 관계가 완전히 변화합니다. 과거를 버리고 새롭게 시작하세요.", "reversed": "변화를 두려워하고 과거에 머뭅니다. 용기를 내세요."},
    "major_14": {"upright": "균형과 절제로 안정적인 결혼 생활을 유지합니다.", "reversed": "극단적 태도나 불균형이 문제입니다. 중용을 지키세요."},
    "major_15": {"upright": "배우자에 대한 집착이나 의존을 인식하세요.", "reversed": "집착에서 벗어나 건강한 관계를 만듭니다."},
    "major_16": {"upright": "갑작스러운 갈등이나 충격적인 사건이 발생합니다.", "reversed": "최악의 위기를 넘기고 회복합니다."},
    "major_17": {"upright": "배우자와의 관계에 희망과 가능성이 있습니다.", "reversed": "희망을 잃거나 실망합니다. 긍정적 태도를 회복하세요."},
    "major_18": {"upright": "배우자와의 관계가 불확실하고 혼란스럽습니다.", "reversed": "진실이 드러나고 상황이 명료해집니다."},
    "major_19": {"upright": "배우자와의 관계가 빛나고 행복합니다.", "reversed": "일시적 후퇴나 과도한 기대입니다."},
    "major_20": {"upright": "배우자와의 관계를 재평가하고 중요한 결정을 내립니다.", "reversed": "과거에 얽매여 앞으로 나아가지 못합니다. 용서하세요."},
    "major_21": {"upright": "배우자와의 완전한 화해와 이해를 이룹니다.", "reversed": "마지막 단계에서 장애물이 있습니다. 끝까지 노력하세요."},
    "wands_01": {"upright": "배우자와의 새로운 열정이나 프로젝트가 시작됩니다.", "reversed": "동기 부족이나 시작 지연입니다."},
    "wands_02": {"upright": "배우자와의 장기 계획을 세웁니다.", "reversed": "계획이 불분명하거나 우유부단합니다."},
    "wands_03": {"upright": "배우자와의 협력이 잘 진행되고 성공적입니다.", "reversed": "진행 지연이나 장애물이 있습니다."},
    "wands_04": {"upright": "안정적이고 조화로운 결혼 생활을 유지합니다.", "reversed": "불안정하거나 갈등이 있습니다."},
    "wands_05": {"upright": "배우자와의 경쟁이나 다툼이 있습니다.", "reversed": "갈등이 해소되고 협력합니다."},
    "wands_06": {"upright": "배우자로부터 인정과 칭찬을 받습니다.", "reversed": "인정받지 못하거나 실망합니다."},
    "wands_07": {"upright": "배우자와의 갈등을 견디고 자신의 입장을 지킵니다.", "reversed": "압도되거나 포기하고 싶습니다."},
    "wands_08": {"upright": "배우자와의 관계가 빠르게 개선됩니다.", "reversed": "개선이 지연되거나 너무 서둘러 문제가 생깁니다."},
    "wands_09": {"upright": "거의 해결 단계에 도달했습니다. 끝까지 노력하세요.", "reversed": "소진되거나 지쳤습니다. 휴식을 취하세요."},
    "wands_10": {"upright": "배우자에 대한 과도한 책임과 부담이 있습니다.", "reversed": "부담을 줄이고 균형을 찾습니다."},
    "wands_11": {"upright": "배우자를 이해하려는 열정과 호기심이 있습니다.", "reversed": "조급하거나 불성실합니다."},
    "wands_12": {"upright": "적극적으로 배우자와 소통합니다.", "reversed": "무모하거나 계획 없이 대화합니다."},
    "wands_13": {"upright": "열정적이고 독립적으로 관계를 유지합니다.", "reversed": "과열되거나 불균형합니다."},
    "wands_14": {"upright": "강력한 리더십으로 가정을 이끕니다.", "reversed": "독재적이거나 무책임합니다."},
    "cups_01": {"upright": "배우자와의 새로운 사랑과 감정적 연결이 시작됩니다.", "reversed": "감정적 공허나 거리감이 있습니다."},
    "cups_02": {"upright": "배우자와 균형 잡힌 조화로운 관계입니다.", "reversed": "불균형하거나 일방적 관계입니다."},
    "cups_03": {"upright": "배우자와 함께 즐겁게 시간을 보냅니다.", "reversed": "과도한 모임으로 피곤합니다."},
    "cups_04": {"upright": "배우자에게 무관심하거나 거리를 둡니다.", "reversed": "관심을 회복하고 가까워집니다."},
    "cups_05": {"upright": "배우자와의 관계에서 실망이나 상실이 있습니다.", "reversed": "실망에서 회복하고 화해합니다."},
    "cups_06": {"upright": "과거 배우자와의 좋은 추억을 떠올립니다.", "reversed": "과거에 얽매여 현재를 놓칩니다."},
    "cups_07": {"upright": "배우자와의 관계에서 여러 선택지가 있지만 혼란스럽습니다.", "reversed": "명료함을 얻고 결정합니다."},
    "cups_08": {"upright": "현재 관계를 떠나 거리를 둡니다.", "reversed": "변화를 두려워하고 현재에 머뭅니다."},
    "cups_09": {"upright": "배우자와의 관계 소원이 이루어집니다.", "reversed": "만족하지 못하거나 공허함을 느낍니다."},
    "cups_10": {"upright": "부부가 행복하고 조화롭습니다.", "reversed": "부부 갈등이나 불화가 있습니다."},
    "cups_11": {"upright": "창의적으로 배우자와의 관계를 개선합니다.", "reversed": "비현실적이거나 미성숙한 접근입니다."},
    "cups_12": {"upright": "이상적인 배우자 관계를 꿈꿉니다.", "reversed": "현실 도피나 불안정합니다."},
    "cups_13": {"upright": "성숙하고 안정적으로 배우자를 대합니다.", "reversed": "감정 불안정이 관계에 영향을 줍니다."},
    "cups_14": {"upright": "감정적 균형으로 지혜롭게 배우자를 대합니다.", "reversed": "감정 조종이나 불안정입니다."},
    "swords_01": {"upright": "명확한 소통과 이해로 관계가 개선됩니다.", "reversed": "혼란이나 오해가 있습니다."},
    "swords_02": {"upright": "배우자와의 관계에서 어려운 선택을 해야 합니다.", "reversed": "결정을 내리고 행동합니다."},
    "swords_03": {"upright": "배우자로 인한 고통이나 상처가 있습니다.", "reversed": "고통에서 회복하고 치유됩니다."},
    "swords_04": {"upright": "배우자와의 관계에서 휴식이 필요합니다.", "reversed": "휴식에서 벗어나 소통을 재개합니다."},
    "swords_05": {"upright": "배우자와의 갈등이나 다툼이 있습니다.", "reversed": "갈등이 해소되고 화해합니다."},
    "swords_06": {"upright": "배우자와의 어려움에서 벗어납니다.", "reversed": "변화가 지연되거나 정체됩니다."},
    "swords_07": {"upright": "전략적이지만 부정직하게 배우자를 대할 수 있습니다.", "reversed": "정직해지고 올바르게 대합니다."},
    "swords_08": {"upright": "배우자로 인해 제약받거나 갇힌 느낌입니다.", "reversed": "제약에서 벗어나 자유로워집니다."},
    "swords_09": {"upright": "배우자에 대한 불안과 걱정이 있습니다.", "reversed": "불안에서 벗어나 평화를 찾습니다."},
    "swords_10": {"upright": "배우자와의 최악의 관계나 단절입니다.", "reversed": "최악에서 회복하고 화해합니다."},
    "swords_11": {"upright": "명확하고 정직하게 배우자와 소통합니다.", "reversed": "비판이나 오해가 있습니다."},
    "swords_12": {"upright": "열정적이지만 성급하게 배우자를 대합니다.", "reversed": "무모하거나 충동적입니다."},
    "swords_13": {"upright": "독립적이고 명확하게 배우자와의 경계를 정합니다.", "reversed": "냉담하거나 고립됩니다."},
    "swords_14": {"upright": "지적으로 배우자를 이해하고 현명하게 대합니다.", "reversed": "독단적이거나 권위적입니다."},
    "pentacles_01": {"upright": "배우자와 함께하는 새로운 재정적 기회가 있습니다.", "reversed": "기회 상실이나 재정 갈등입니다."},
    "pentacles_02": {"upright": "배우자와 함께 재정의 균형을 잡습니다.", "reversed": "균형을 잃고 혼란스럽습니다."},
    "pentacles_03": {"upright": "배우자와 협력하여 문제를 해결합니다.", "reversed": "협력 실패나 갈등이 있습니다."},
    "pentacles_04": {"upright": "재산이나 자원을 지나치게 독점합니다.", "reversed": "독점에서 벗어나 공정하게 나눕니다."},
    "pentacles_05": {"upright": "배우자의 재정 어려움이나 건강 문제가 있습니다.", "reversed": "어려움에서 회복하고 안정을 찾습니다."},
    "pentacles_06": {"upright": "공정하게 배우자를 돕고 도움받습니다.", "reversed": "불균형하거나 일방적입니다."},
    "pentacles_07": {"upright": "인내심을 가지고 배우자와의 관계 개선을 기다립니다.", "reversed": "조급해하거나 결과가 부족합니다."},
    "pentacles_08": {"upright": "성실하게 배우자와 협력하고 돕습니다.", "reversed": "게으르거나 불성실합니다."},
    "pentacles_09": {"upright": "독립적으로 성공하고 배우자와 조화롭습니다.", "reversed": "성공에도 배우자와의 관계가 소원합니다."},
    "pentacles_10": {"upright": "부부가 함께 풍요롭고 안정적입니다.", "reversed": "재산 분쟁이나 갈등이 있습니다."},
    "pentacles_11": {"upright": "성실하게 배우자로부터 배우고 실천합니다.", "reversed": "게으르거나 배우기를 거부합니다."},
    "pentacles_12": {"upright": "책임감 있게 배우자를 돌봅니다.", "reversed": "게으르거나 과도하게 신중합니다."},
    "pentacles_13": {"upright": "실용적으로 배우자를 안정적으로 돕습니다.", "reversed": "물질주의나 집착이 문제입니다."},
    "pentacles_14": {"upright": "실용적 지혜로 배우자와 안정적인 관계를 유지합니다.", "reversed": "탐욕이나 부정직입니다."},
}

print(f"[OK] spouse 데이터 생성 완료: {len(spouse_data)} 장")

# spouse 추가
print("\n[3/4] 카드에 spouse 추가 중...")
count = 0
for card_id, spouse in spouse_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["spouse"] = spouse["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["spouse"] = spouse["reversed"]
        count += 1

print(f"[OK] spouse 추가 완료: {count} 장")

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
print(f"[OK] spouse 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] spouse (배우자운) 카테고리 추가 작업 완료!")
print("=" * 60)

