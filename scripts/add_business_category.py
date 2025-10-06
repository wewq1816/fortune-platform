# -*- coding: utf-8 -*-
"""
business (사업운) 카테고리 추가 스크립트
78장 × 2방향 = 156개 business 의미 자동 생성
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
print("Tarot Cards - business (사업운) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# business 데이터 정의
print("\n[2/4] business 데이터 생성 중...")

business_data = {
    "major_00": {"upright": "새로운 사업 시작에 좋은 시기입니다. 혁신적인 아이디어로 도전하세요.", "reversed": "무계획한 사업 시작은 위험합니다. 철저히 준비하세요."},
    "major_01": {"upright": "강력한 리더십으로 사업을 이끕니다. 전략을 세우고 추진하세요.", "reversed": "독단적 경영은 실패합니다. 팀과 협력하세요."},
    "major_02": {"upright": "직관으로 사업 기회를 포착합니다. 내면의 목소리를 따르세요.", "reversed": "감에만 의존하지 말고 데이터를 분석하세요."},
    "major_03": {"upright": "안정적이고 양육적인 사업 운영이 필요합니다. 고객을 돌보세요.", "reversed": "과잉투자나 의존적 경영이 문제입니다. 독립성을 키우세요."},
    "major_04": {"upright": "체계적이고 안정적인 사업 관리가 필요합니다. 시스템을 구축하세요.", "reversed": "경직된 경영은 실패합니다. 유연하게 대응하세요."},
    "major_05": {"upright": "전통적 방식과 멘토의 조언이 도움이 됩니다.", "reversed": "새로운 방식을 도입하고 혁신하세요."},
    "major_06": {"upright": "사업 파트너십이나 중요한 선택이 필요합니다. 신중하게 결정하세요.", "reversed": "잘못된 파트너십이나 결정이 문제입니다. 재검토하세요."},
    "major_07": {"upright": "강한 의지로 사업 난관을 극복합니다. 추진력을 유지하세요.", "reversed": "통제력 상실이나 경영 실패입니다. 재정비하세요."},
    "major_08": {"upright": "인내심으로 사업을 안정화합니다. 꾸준히 노력하세요.", "reversed": "조급함이나 감정적 결정이 문제입니다. 차분하게 대처하세요."},
    "major_09": {"upright": "사업 전략을 깊이 성찰하고 재평가합니다.", "reversed": "고립되거나 소통이 부족합니다. 외부 조언을 구하세요."},
    "major_10": {"upright": "사업 환경이 크게 변화합니다. 변화에 적응하세요.", "reversed": "변화에 저항하거나 운에만 의존합니다. 전략을 세우세요."},
    "major_11": {"upright": "공정하고 윤리적인 경영이 성공을 가져옵니다.", "reversed": "불공정한 거래나 비윤리적 경영이 문제입니다. 바로잡으세요."},
    "major_12": {"upright": "사업을 위한 희생이나 투자가 필요합니다.", "reversed": "불필요한 희생이나 손실입니다. 균형을 찾으세요."},
    "major_13": {"upright": "사업 구조를 완전히 변화시켜야 합니다. 혁신하세요.", "reversed": "변화를 두려워하고 과거에 집착합니다. 용기를 내세요."},
    "major_14": {"upright": "균형 잡힌 경영으로 안정적인 성장을 이룹니다.", "reversed": "극단적 경영이나 불균형이 문제입니다. 중용을 지키세요."},
    "major_15": {"upright": "매력적인 제안이나 유혹이 있습니다. 신중하게 검토하세요.", "reversed": "함정이나 부정직한 거래에서 벗어나세요."},
    "major_16": {"upright": "갑작스러운 위기나 충격이 발생합니다. 위기관리를 하세요.", "reversed": "최악의 위기를 넘기고 회복합니다."},
    "major_17": {"upright": "사업에 희망과 가능성이 보입니다. 비전을 가지세요.", "reversed": "비현실적인 기대나 실망입니다. 현실적으로 접근하세요."},
    "major_18": {"upright": "사업 환경이 불확실하고 혼란스럽습니다. 신중하게 결정하세요.", "reversed": "혼란이 해소되고 명료해집니다."},
    "major_19": {"upright": "사업이 성공하고 번창합니다. 긍정적으로 추진하세요.", "reversed": "일시적 후퇴나 과도한 낙관입니다. 현실성을 유지하세요."},
    "major_20": {"upright": "사업을 재평가하고 중요한 결정을 내립니다.", "reversed": "과거 방식에 얽매여 전진하지 못합니다. 혁신하세요."},
    "major_21": {"upright": "사업이 완성되고 목표를 달성합니다.", "reversed": "완성 직전 장애물이 있습니다. 끝까지 집중하세요."},
    "wands_01": {"upright": "새로운 사업 아이디어나 기회가 있습니다. 시작하세요.", "reversed": "아이디어만 있고 실행이 부족합니다. 행동하세요."},
    "wands_02": {"upright": "사업 확장이나 해외 진출을 계획합니다.", "reversed": "계획만 하고 실행하지 않습니다. 추진하세요."},
    "wands_03": {"upright": "사업이 순조롭게 확장되고 성장합니다.", "reversed": "확장이 지연되거나 장애물이 있습니다. 인내하세요."},
    "wands_04": {"upright": "사업이 안정되고 성과를 축하합니다.", "reversed": "불안정하거나 기반이 약합니다. 기초를 다지세요."},
    "wands_05": {"upright": "경쟁이 치열하고 갈등이 있습니다. 전략적으로 대응하세요.", "reversed": "경쟁이 완화되고 협력합니다."},
    "wands_06": {"upright": "사업에서 성공하고 인정받습니다.", "reversed": "실패하거나 인정받지 못합니다. 재도전하세요."},
    "wands_07": {"upright": "경쟁에서 방어하고 입지를 지킵니다.", "reversed": "압도되거나 시장을 잃습니다. 재정비하세요."},
    "wands_08": {"upright": "사업이 빠르게 진행되고 성장합니다.", "reversed": "너무 빠른 성장이나 실수가 있습니다. 신중하세요."},
    "wands_09": {"upright": "거의 목표에 도달했습니다. 끝까지 노력하세요.", "reversed": "소진되거나 지쳤습니다. 휴식을 취하세요."},
    "wands_10": {"upright": "과도한 책임과 부담이 있습니다. 위임하세요.", "reversed": "부담을 줄이고 효율화합니다."},
    "wands_11": {"upright": "새로운 사업 기회를 탐색합니다.", "reversed": "조급하거나 준비 부족입니다. 충분히 준비하세요."},
    "wands_12": {"upright": "적극적으로 사업을 추진합니다.", "reversed": "무모하거나 계획 없습니다. 전략을 세우세요."},
    "wands_13": {"upright": "열정적으로 사업을 이끕니다.", "reversed": "과열되거나 독단적입니다. 균형을 유지하세요."},
    "wands_14": {"upright": "비전 있는 리더십으로 사업을 성공시킵니다.", "reversed": "독재적이거나 무책임한 경영입니다. 개선하세요."},
    "cups_01": {"upright": "고객과의 감정적 연결이 중요합니다. 진심으로 서비스하세요.", "reversed": "감정적 공허나 고객과의 거리감이 문제입니다."},
    "cups_02": {"upright": "파트너십이 조화롭고 협력적입니다.", "reversed": "파트너십이 불균형하거나 일방적입니다."},
    "cups_03": {"upright": "팀워크가 좋고 즐겁게 일합니다.", "reversed": "과도한 회식이나 피상적 관계입니다."},
    "cups_04": {"upright": "현재 사업에 무관심하거나 새로운 기회를 놓칩니다.", "reversed": "관심을 회복하고 기회를 잡습니다."},
    "cups_05": {"upright": "사업 실패나 손실이 있습니다.", "reversed": "실패에서 회복하고 재기합니다."},
    "cups_06": {"upright": "과거 성공 경험을 활용합니다.", "reversed": "과거에 얽매여 혁신하지 못합니다."},
    "cups_07": {"upright": "많은 사업 기회가 있지만 선택이 어렵습니다.", "reversed": "명료함을 얻고 최선의 기회를 선택합니다."},
    "cups_08": {"upright": "현재 사업을 떠나 새로운 방향을 모색합니다.", "reversed": "변화를 두려워하고 현재에 머뭅니다."},
    "cups_09": {"upright": "사업 목표가 이루어지고 만족합니다.", "reversed": "목표 달성에도 공허함을 느낍니다."},
    "cups_10": {"upright": "사업이 번창하고 모두가 행복합니다.", "reversed": "내부 갈등이나 불화가 있습니다."},
    "cups_11": {"upright": "창의적인 아이디어로 사업을 개선합니다.", "reversed": "비현실적이거나 미성숙한 접근입니다."},
    "cups_12": {"upright": "이상적인 사업을 꿈꿉니다.", "reversed": "현실 도피하지 말고 실행하세요."},
    "cups_13": {"upright": "성숙하고 안정적으로 사업을 운영합니다.", "reversed": "감정적 불안정이 경영에 영향을 줍니다."},
    "cups_14": {"upright": "감정적 균형으로 지혜롭게 경영합니다.", "reversed": "감정 조종이나 불안정한 경영입니다."},
    "swords_01": {"upright": "명확한 전략과 결단력으로 성공합니다.", "reversed": "혼란스럽거나 결정을 내리지 못합니다."},
    "swords_02": {"upright": "어려운 사업 결정을 해야 합니다.", "reversed": "결정을 내리고 추진합니다."},
    "swords_03": {"upright": "사업으로 인한 고통이나 배신이 있습니다.", "reversed": "고통에서 회복하고 재건합니다."},
    "swords_04": {"upright": "사업 활동을 잠시 멈추고 재충전합니다.", "reversed": "휴식을 끝내고 사업을 재개합니다."},
    "swords_05": {"upright": "불공정한 경쟁이나 갈등이 있습니다.", "reversed": "갈등이 해소되고 공정하게 경쟁합니다."},
    "swords_06": {"upright": "사업 환경이 개선되고 전환합니다.", "reversed": "변화가 지연되거나 정체됩니다."},
    "swords_07": {"upright": "전략적이지만 윤리적 문제가 있을 수 있습니다.", "reversed": "정직하고 투명하게 경영합니다."},
    "swords_08": {"upright": "제약이나 어려움이 있습니다.", "reversed": "제약에서 벗어나 자유롭게 운영합니다."},
    "swords_09": {"upright": "사업에 대한 불안과 걱정이 있습니다.", "reversed": "불안에서 벗어나 안정을 찾습니다."},
    "swords_10": {"upright": "사업 실패나 최악의 상황입니다.", "reversed": "최악에서 회복하고 재기합니다."},
    "swords_11": {"upright": "명확하고 정직한 의사소통으로 성공합니다.", "reversed": "비판적이거나 소통에 문제가 있습니다."},
    "swords_12": {"upright": "열정적으로 사업을 추진합니다.", "reversed": "성급하거나 무모합니다."},
    "swords_13": {"upright": "독립적이고 명확한 경영을 합니다.", "reversed": "냉담하거나 고립됩니다."},
    "swords_14": {"upright": "지적이고 현명한 경영으로 성공합니다.", "reversed": "독단적이거나 권위적 경영입니다."},
    "pentacles_01": {"upright": "새로운 재정적 기회나 투자가 있습니다. 시작하세요.", "reversed": "기회를 놓치거나 투자 실패입니다."},
    "pentacles_02": {"upright": "재정 균형을 잘 유지하며 경영합니다.", "reversed": "재정 불균형이나 현금 흐름 문제입니다."},
    "pentacles_03": {"upright": "협력하여 품질 높은 제품을 만듭니다.", "reversed": "협력 실패나 품질 문제입니다."},
    "pentacles_04": {"upright": "재정을 안정적으로 관리하고 보존합니다.", "reversed": "지나친 절약이나 투자 부족입니다."},
    "pentacles_05": {"upright": "재정 어려움이나 자금 부족이 있습니다.", "reversed": "재정 어려움에서 회복합니다."},
    "pentacles_06": {"upright": "공정하게 이익을 나누고 투자합니다.", "reversed": "불공정한 분배나 이익 독점입니다."},
    "pentacles_07": {"upright": "장기 투자와 인내로 성과를 기다립니다.", "reversed": "조급함이나 성과 부족입니다."},
    "pentacles_08": {"upright": "성실하게 일하며 기술을 연마합니다.", "reversed": "게으름이나 품질 저하입니다."},
    "pentacles_09": {"upright": "독립적으로 성공하고 풍요롭습니다.", "reversed": "성공에도 불만족하거나 고립됩니다."},
    "pentacles_10": {"upright": "사업이 번창하고 유산을 남깁니다.", "reversed": "재정 문제나 가족 갈등입니다."},
    "pentacles_11": {"upright": "성실하게 배우고 기술을 익힙니다.", "reversed": "게으름이나 학습 거부입니다."},
    "pentacles_12": {"upright": "책임감 있게 사업을 운영합니다.", "reversed": "과도한 신중함이나 게으름입니다."},
    "pentacles_13": {"upright": "실용적이고 안정적으로 경영합니다.", "reversed": "물질주의나 융통성 부족입니다."},
    "pentacles_14": {"upright": "풍요롭고 성공적인 사업을 운영합니다.", "reversed": "탐욕이나 부정직한 경영입니다."},
}

print(f"[OK] business 데이터 생성 완료: {len(business_data)} 장")

# business 추가
print("\n[3/4] 카드에 business 추가 중...")
count = 0
for card_id, business in business_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["business"] = business["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["business"] = business["reversed"]
        count += 1

print(f"[OK] business 추가 완료: {count} 장")

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
print(f"[OK] business 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] business (사업운) 카테고리 추가 작업 완료!")
print("=" * 60)

