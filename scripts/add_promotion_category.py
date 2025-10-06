# -*- coding: utf-8 -*-
"""
promotion (승진운) 카테고리 추가 스크립트
78장 × 2방향 = 156개 promotion 의미 자동 생성
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
print("Tarot Cards - promotion (승진운) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# promotion 데이터 정의
print("\n[2/4] promotion 데이터 생성 중...")

promotion_data = {
    "major_00": {"upright": "새로운 직책이나 역할로 승진할 기회가 옵니다. 대담하게 도전하세요.", "reversed": "준비 부족이나 성급한 승진 시도가 실패합니다. 신중하게 준비하세요."},
    "major_01": {"upright": "강력한 리더십으로 승진에 성공합니다. 자신감 있게 능력을 보여주세요.", "reversed": "권위 남용이나 독단적 태도가 승진을 방해합니다. 협력하세요."},
    "major_02": {"upright": "직관과 통찰력으로 승진 기회를 포착합니다. 내면의 지혜를 따르세요.", "reversed": "정보 부족이나 비밀로 인해 기회를 놓칩니다. 투명하게 소통하세요."},
    "major_03": {"upright": "창의성과 팀을 돌보는 태도로 승진합니다. 양육하는 리더십을 보이세요.", "reversed": "과잉보호나 창의성 부족이 문제입니다. 독립성을 키우세요."},
    "major_04": {"upright": "체계적이고 안정적인 관리로 승진합니다. 구조와 규칙을 잘 운영하세요.", "reversed": "경직성이나 유연성 부족으로 승진이 어렵습니다. 변화에 적응하세요."},
    "major_05": {"upright": "전통적 경로와 멘토의 도움으로 승진합니다. 조언을 구하세요.", "reversed": "낡은 방식이나 권위에 대한 반발이 문제입니다. 균형을 찾으세요."},
    "major_06": {"upright": "승진이나 이직 사이에서 중요한 선택을 해야 합니다. 신중하게 결정하세요.", "reversed": "잘못된 선택이나 유혹에 빠집니다. 가치관에 따라 선택하세요."},
    "major_07": {"upright": "강한 의지로 승진 경쟁에서 승리합니다. 결단력 있게 추진하세요.", "reversed": "통제력 상실이나 방향 상실로 실패합니다. 재정비하세요."},
    "major_08": {"upright": "인내심과 자제력으로 승진 장애물을 극복합니다. 차분하게 대처하세요.", "reversed": "자제력 부족이나 의지 약화로 기회를 놓칩니다. 힘을 키우세요."},
    "major_09": {"upright": "혼자 전략을 세우고 준비합니다. 깊이 사고하고 계획하세요.", "reversed": "고립되거나 조언을 거부합니다. 소통하고 협력하세요."},
    "major_10": {"upright": "큰 행운으로 예상치 못한 승진 기회가 옵니다. 기회를 잡으세요.", "reversed": "승진 정체나 불운이 계속됩니다. 인내하고 다른 방법을 시도하세요."},
    "major_11": {"upright": "공정한 평가로 정당하게 승진합니다. 정직하게 일한 결과입니다.", "reversed": "불공정한 대우나 정치적 문제로 승진이 좌절됩니다. 권리를 주장하세요."},
    "major_12": {"upright": "승진을 위해 희생이나 대기가 필요합니다. 인내하고 새 관점을 찾으세요.", "reversed": "불필요한 희생이나 지연입니다. 행동하고 변화를 요구하세요."},
    "major_13": {"upright": "완전한 역할 변화와 새로운 시작입니다. 과거를 버리고 재탄생하세요.", "reversed": "변화를 두려워하고 현재에 머뭅니다. 용기를 내세요."},
    "major_14": {"upright": "균형과 절제로 안정적으로 승진합니다. 극단을 피하세요.", "reversed": "불균형이나 극단적 태도가 문제입니다. 중용을 지키세요."},
    "major_15": {"upright": "권력이나 물질에 대한 집착을 인식하세요. 진정한 가치를 찾으세요.", "reversed": "집착에서 벗어나 의미 있는 승진을 추구합니다."},
    "major_16": {"upright": "갑작스러운 조직 변화나 충격적인 인사이동입니다. 재건하세요.", "reversed": "최악의 위기를 넘기고 회복합니다."},
    "major_17": {"upright": "승진에 대한 희망과 가능성이 밝습니다. 긍정적으로 준비하세요.", "reversed": "희망을 잃거나 실망합니다. 긍정적 태도를 회복하세요."},
    "major_18": {"upright": "승진 가능성이 불확실하고 혼란스럽습니다. 신중하게 판단하세요.", "reversed": "진실이 드러나고 상황이 명료해집니다."},
    "major_19": {"upright": "큰 성공과 승진을 이룹니다. 자신감 있게 빛나세요.", "reversed": "일시적 후퇴나 과도한 자신감입니다. 겸손하세요."},
    "major_20": {"upright": "중요한 경력 결정이나 재평가의 시기입니다. 과거를 정리하세요.", "reversed": "과거 실패에 얽매입니다. 용서하고 앞으로 나아가세요."},
    "major_21": {"upright": "승진 목표 달성과 완성입니다. 성공을 축하하고 다음을 준비하세요.", "reversed": "마지막 단계에서 장애물이 있습니다. 끝까지 완수하세요."},
    "wands_01": {"upright": "새로운 직책이나 프로젝트 리더 역할이 시작됩니다.", "reversed": "동기 부족이나 기회 지연입니다."},
    "wands_02": {"upright": "장기 승진 계획을 세우고 전략을 준비합니다.", "reversed": "계획이 불분명하거나 우유부단합니다."},
    "wands_03": {"upright": "승진 절차가 잘 진행되고 긍정적 신호가 보입니다.", "reversed": "진행 지연이나 장애물이 있습니다."},
    "wands_04": {"upright": "안정적인 위치에서 다음 승진을 준비합니다.", "reversed": "불안정하거나 현 위치에 불만족합니다."},
    "wands_05": {"upright": "승진 경쟁이 치열합니다. 건설적으로 경쟁하세요.", "reversed": "경쟁에서 벗어나 협력적으로 접근합니다."},
    "wands_06": {"upright": "승진에 성공하고 인정받습니다. 승리를 축하하세요.", "reversed": "승진 실패나 인정받지 못합니다."},
    "wands_07": {"upright": "승진 경쟁에서 방어하고 버팁니다. 끈기 있게 대처하세요.", "reversed": "압도되거나 포기하고 싶습니다."},
    "wands_08": {"upright": "빠른 승진이나 급격한 진급이 있습니다.", "reversed": "승진이 지연되거나 너무 서둘러 문제가 생깁니다."},
    "wands_09": {"upright": "거의 승진에 도달했습니다. 경계를 늦추지 마세요.", "reversed": "소진되거나 지쳤습니다. 휴식을 취하세요."},
    "wands_10": {"upright": "과도한 책임과 부담입니다. 승진 후 적응이 어렵습니다.", "reversed": "부담을 줄이고 균형을 찾습니다."},
    "wands_11": {"upright": "새로운 역할에 열정적이고 호기심 많습니다.", "reversed": "조급하거나 준비 부족입니다."},
    "wands_12": {"upright": "적극적이고 모험적으로 승진 기회를 추구합니다.", "reversed": "무모하거나 계획 없이 시도합니다."},
    "wands_13": {"upright": "열정적이고 카리스마로 승진합니다.", "reversed": "과열되거나 불균형합니다."},
    "wands_14": {"upright": "강력한 리더십으로 고위직에 오릅니다.", "reversed": "독재적이거나 무책임합니다."},
    "cups_01": {"upright": "새로운 역할에 감정적 만족과 열정이 있습니다.", "reversed": "감정적 공허로 승진 동기가 없습니다."},
    "cups_02": {"upright": "파트너십이나 협력으로 승진합니다.", "reversed": "불균형하거나 갈등이 있습니다."},
    "cups_03": {"upright": "팀의 지지로 승진하고 축하받습니다.", "reversed": "과도한 사교로 본질을 놓칩니다."},
    "cups_04": {"upright": "현재 직급에 무관심하거나 승진에 관심 없습니다.", "reversed": "새로운 기회에 관심을 가집니다."},
    "cups_05": {"upright": "승진 실패로 실망합니다.", "reversed": "실망에서 회복하고 다시 도전합니다."},
    "cups_06": {"upright": "과거 직급이나 역할을 그리워합니다.", "reversed": "과거에 얽매여 현재 기회를 놓칩니다."},
    "cups_07": {"upright": "여러 승진 기회 중 선택하기 어렵습니다.", "reversed": "명료함을 얻고 방향을 정합니다."},
    "cups_08": {"upright": "현재 직급을 떠나 더 나은 기회를 찾습니다.", "reversed": "변화를 두려워하고 현재에 머뭅니다."},
    "cups_09": {"upright": "승진 목표가 이루어지고 만족합니다.", "reversed": "승진했지만 만족하지 못합니다."},
    "cups_10": {"upright": "가족의 지원으로 승진에 성공합니다.", "reversed": "가족 문제로 승진에 집중하기 어렵습니다."},
    "cups_11": {"upright": "창의적인 방식으로 승진 기회를 만듭니다.", "reversed": "비현실적이거나 미성숙한 접근입니다."},
    "cups_12": {"upright": "이상주의적으로 승진을 추구합니다.", "reversed": "현실 도피나 불안정합니다."},
    "cups_13": {"upright": "성숙하고 안정적으로 승진합니다.", "reversed": "감정 불안정이 승진에 영향을 줍니다."},
    "cups_14": {"upright": "감정적 균형으로 지혜롭게 승진합니다.", "reversed": "감정 조종이나 정치적 문제입니다."},
    "swords_01": {"upright": "명확한 사고와 전략으로 승진 기회를 잡습니다.", "reversed": "혼란이나 잘못된 판단으로 실패합니다."},
    "swords_02": {"upright": "어려운 선택이나 딜레마가 있습니다.", "reversed": "결정을 내리고 행동합니다."},
    "swords_03": {"upright": "승진 과정에서 배신이나 고통을 겪습니다.", "reversed": "고통에서 회복하고 치유됩니다."},
    "swords_04": {"upright": "승진 준비를 위해 휴식과 재충전이 필요합니다.", "reversed": "휴식에서 벗어나 적극적으로 추진합니다."},
    "swords_05": {"upright": "승진 경쟁에서 갈등이나 불공정이 있습니다.", "reversed": "갈등이 해소되고 공정해집니다."},
    "swords_06": {"upright": "어려운 상황에서 벗어나 승진합니다.", "reversed": "변화가 지연되거나 정체됩니다."},
    "swords_07": {"upright": "전략적이지만 부정직한 방법을 쓸 수 있습니다.", "reversed": "정직해지고 올바른 방법을 씁니다."},
    "swords_08": {"upright": "제약받거나 승진이 막힌 느낌입니다.", "reversed": "제약에서 벗어나 자유롭게 승진합니다."},
    "swords_09": {"upright": "승진 불안과 걱정에 시달립니다.", "reversed": "불안에서 벗어나 평화를 찾습니다."},
    "swords_10": {"upright": "최악의 승진 실패나 좌절입니다.", "reversed": "최악에서 회복하고 재도전합니다."},
    "swords_11": {"upright": "명확한 평가와 정직한 승진입니다.", "reversed": "비판이나 불공정한 평가입니다."},
    "swords_12": {"upright": "열정적이지만 성급하게 승진을 추구합니다.", "reversed": "무모하거나 충동적입니다."},
    "swords_13": {"upright": "독립적이고 명확하게 승진 목표를 추구합니다.", "reversed": "냉담하거나 고립됩니다."},
    "swords_14": {"upright": "지적 권위와 전문성으로 승진합니다.", "reversed": "독단적이거나 권위 남용입니다."},
    "pentacles_01": {"upright": "새로운 승진 기회나 안정적인 진급이 옵니다.", "reversed": "기회 상실이나 불안정입니다."},
    "pentacles_02": {"upright": "여러 역할의 균형을 잡으며 승진합니다.", "reversed": "균형을 잃고 혼란스럽습니다."},
    "pentacles_03": {"upright": "협력과 팀워크로 승진합니다.", "reversed": "협력 실패나 품질 문제입니다."},
    "pentacles_04": {"upright": "권력이나 자원을 지나치게 통제합니다.", "reversed": "통제에서 벗어나 공유합니다."},
    "pentacles_05": {"upright": "재정 문제로 승진이 어렵습니다.", "reversed": "어려움에서 회복하고 안정을 찾습니다."},
    "pentacles_06": {"upright": "공정하게 인정받고 승진합니다.", "reversed": "불균형하거나 일방적입니다."},
    "pentacles_07": {"upright": "인내심을 가지고 승진 결과를 기다립니다.", "reversed": "조급해하거나 결과가 부족합니다."},
    "pentacles_08": {"upright": "성실하게 일한 결과로 승진합니다.", "reversed": "게으르거나 노력 부족입니다."},
    "pentacles_09": {"upright": "독립적으로 성공하고 승진합니다.", "reversed": "성공에도 외롭거나 불안합니다."},
    "pentacles_10": {"upright": "장기적 성공과 최고 직급에 오릅니다.", "reversed": "승진 부담이나 가족 문제입니다."},
    "pentacles_11": {"upright": "성실하게 배우고 승진 준비를 합니다.", "reversed": "게으르거나 준비 거부입니다."},
    "pentacles_12": {"upright": "책임감 있고 꾸준히 승진을 추구합니다.", "reversed": "게으르거나 과도하게 신중합니다."},
    "pentacles_13": {"upright": "실용적이고 안정적으로 승진합니다.", "reversed": "일중독이나 물질주의입니다."},
    "pentacles_14": {"upright": "실용적 지혜와 경험으로 고위직에 오릅니다.", "reversed": "탐욕이나 부정직입니다."},
}

print(f"[OK] promotion 데이터 생성 완료: {len(promotion_data)} 장")

# promotion 추가
print("\n[3/4] 카드에 promotion 추가 중...")
count = 0
for card_id, promotion in promotion_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["promotion"] = promotion["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["promotion"] = promotion["reversed"]
        count += 1

print(f"[OK] promotion 추가 완료: {count} 장")

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
print(f"[OK] promotion 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] promotion (승진운) 카테고리 추가 작업 완료!")
print("=" * 60)
