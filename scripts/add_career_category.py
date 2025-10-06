# -*- coding: utf-8 -*-
"""
career (직업운) 카테고리 추가 스크립트
78장 × 2방향 = 156개 career 의미 자동 생성
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
print("Tarot Cards - career (직업운) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# career 데이터 정의
print("\n[2/4] career 데이터 생성 중...")

career_data = {
    "major_00": {"upright": "새로운 직업이나 프로젝트를 시작하기 좋은 시기입니다. 모험적으로 도전하고 창의적으로 접근하세요.", "reversed": "무계획하거나 준비 부족으로 실패할 수 있습니다. 신중하게 계획하세요."},
    "major_01": {"upright": "강력한 리더십과 실행력으로 성공합니다. 자신감 있게 결단하고 추진하세요.", "reversed": "권위 남용이나 독단적 결정이 문제입니다. 협력하고 경청하세요."},
    "major_02": {"upright": "직관과 통찰력으로 올바른 결정을 내립니다. 내면의 목소리를 따르세요.", "reversed": "정보 부족이나 비밀로 인해 혼란스럽습니다. 투명하게 소통하세요."},
    "major_03": {"upright": "창의성과 양육하는 태도로 프로젝트를 성공시킵니다. 팀을 보살피세요.", "reversed": "과잉보호나 창의성 부족이 문제입니다. 독립성을 키우세요."},
    "major_04": {"upright": "체계적이고 안정적인 관리로 성공합니다. 구조와 규칙을 세우세요.", "reversed": "경직되거나 유연성 부족으로 기회를 놓칩니다. 변화를 받아들이세요."},
    "major_05": {"upright": "전통적 방법과 경험이 도움이 됩니다. 조언을 구하고 배우세요.", "reversed": "낡은 방식에 얽매이거나 권위에 반발합니다. 균형을 찾으세요."},
    "major_06": {"upright": "중요한 선택의 기로에 섰습니다. 가치관에 따라 결정하세요.", "reversed": "잘못된 선택이나 유혹에 빠집니다. 진지하게 고민하세요."},
    "major_07": {"upright": "강한 의지로 목표를 달성하고 경쟁에서 승리합니다.", "reversed": "통제력 상실이나 방향 상실입니다. 속도를 늦추고 재정비하세요."},
    "major_08": {"upright": "인내심과 자제력으로 어려움을 극복합니다. 차분하게 대처하세요.", "reversed": "자제력 상실이나 의지 부족입니다. 용기를 내고 힘을 키우세요."},
    "major_09": {"upright": "혼자 깊이 생각하고 전략을 세웁니다. 내면의 지혜를 찾으세요.", "reversed": "고립되거나 조언을 거부합니다. 소통하고 협력하세요."},
    "major_10": {"upright": "큰 행운과 긍정적 변화가 옵니다. 흐름에 맡기고 받아들이세요.", "reversed": "불운이나 정체가 계속됩니다. 인내하고 다른 방법을 시도하세요."},
    "major_11": {"upright": "공정한 평가와 정당한 보상을 받습니다. 정직하게 일하세요.", "reversed": "불공정한 대우나 법적 문제가 생깁니다. 권리를 주장하세요."},
    "major_12": {"upright": "희생이나 대기가 필요합니다. 새로운 관점으로 바라보세요.", "reversed": "불필요한 희생이나 지연입니다. 행동하고 변화를 시작하세요."},
    "major_13": {"upright": "완전한 변화와 새로운 시작입니다. 과거를 버리고 재탄생하세요.", "reversed": "변화를 두려워하고 저항합니다. 용기를 내고 받아들이세요."},
    "major_14": {"upright": "균형과 절제로 안정적으로 성장합니다. 극단을 피하세요.", "reversed": "불균형이나 극단적 태도가 문제입니다. 중용을 지키세요."},
    "major_15": {"upright": "물질적 집착이나 중독을 인식하세요. 자유로워지세요.", "reversed": "집착에서 벗어나 진정한 가치를 찾습니다."},
    "major_16": {"upright": "갑작스러운 위기나 충격적인 변화가 옵니다. 재건하세요.", "reversed": "최악의 위기를 넘기고 회복합니다."},
    "major_17": {"upright": "희망과 영감이 가득합니다. 미래가 밝고 가능성이 열립니다.", "reversed": "희망을 잃거나 실망합니다. 긍정적 태도를 회복하세요."},
    "major_18": {"upright": "불확실하고 혼란스럽습니다. 직관을 믿되 신중하세요.", "reversed": "진실이 드러나고 명료해집니다. 혼란에서 벗어납니다."},
    "major_19": {"upright": "큰 성공과 인정을 받습니다. 자신감 있게 빛나세요.", "reversed": "일시적 후퇴나 과도한 자신감입니다. 겸손하세요."},
    "major_20": {"upright": "중요한 결정이나 재평가의 시기입니다. 과거를 정리하세요.", "reversed": "과거에 얽매이거나 후회합니다. 용서하고 앞으로 나아가세요."},
    "major_21": {"upright": "목표 달성과 완성입니다. 성공을 축하하고 다음을 준비하세요.", "reversed": "미완성이나 마지막 장애물입니다. 끝까지 완수하세요."},
    "wands_01": {"upright": "새로운 프로젝트나 기회가 시작됩니다. 열정적으로 도전하세요.", "reversed": "동기 부족이나 시작 지연입니다. 에너지를 회복하세요."},
    "wands_02": {"upright": "장기 계획을 세우고 큰 그림을 그립니다. 자신감 있게 준비하세요.", "reversed": "계획이 불분명하거나 우유부단합니다. 결단하세요."},
    "wands_03": {"upright": "진행 중인 일이 잘 풀리고 성과가 보입니다.", "reversed": "진행 지연이나 장애물이 있습니다. 인내하세요."},
    "wands_04": {"upright": "안정적이고 조화로운 작업 환경입니다. 현재를 즐기세요.", "reversed": "불안정하거나 갈등이 있습니다. 균형을 회복하세요."},
    "wands_05": {"upright": "경쟁이나 갈등이 있습니다. 건설적으로 대처하세요.", "reversed": "갈등이 해소되고 협력합니다."},
    "wands_06": {"upright": "성공과 인정을 받습니다. 승리를 축하하되 겸손하세요.", "reversed": "실패나 인정받지 못합니다. 다시 도전하세요."},
    "wands_07": {"upright": "방어하고 경쟁에서 버팁니다. 끈기 있게 대처하세요.", "reversed": "압도되거나 포기하고 싶습니다. 도움을 구하세요."},
    "wands_08": {"upright": "빠른 진행과 급격한 발전이 있습니다.", "reversed": "지연되거나 너무 서둘러 문제가 생깁니다."},
    "wands_09": {"upright": "거의 목표에 도달했습니다. 경계를 늦추지 마세요.", "reversed": "소진되거나 방어적입니다. 휴식을 취하세요."},
    "wands_10": {"upright": "과도한 책임과 부담입니다. 위임하고 우선순위를 정하세요.", "reversed": "부담을 내려놓고 가벼워집니다."},
    "wands_11": {"upright": "열정적이고 호기심 많은 태도로 배웁니다.", "reversed": "조급하거나 불성실합니다."},
    "wands_12": {"upright": "모험적이고 적극적으로 일합니다.", "reversed": "무모하거나 충동적입니다."},
    "wands_13": {"upright": "열정적이고 카리스마 있게 리드합니다.", "reversed": "과열되거나 불균형합니다."},
    "wands_14": {"upright": "강력한 리더십과 비전으로 이끕니다.", "reversed": "독재적이거나 무책임합니다."},
    "cups_01": {"upright": "새로운 감정적 만족과 창의적 시작입니다.", "reversed": "감정적 공허나 창의성 부족입니다."},
    "cups_02": {"upright": "협력과 파트너십이 좋습니다.", "reversed": "불균형하거나 갈등이 있습니다."},
    "cups_03": {"upright": "팀워크와 축하의 시간입니다.", "reversed": "과도한 사교나 시간 낭비입니다."},
    "cups_04": {"upright": "현재에 무관심하거나 새로운 기회를 거부합니다.", "reversed": "새로운 기회를 받아들입니다."},
    "cups_05": {"upright": "실망이나 손실이 있습니다.", "reversed": "실망에서 회복하고 앞으로 나아갑니다."},
    "cups_06": {"upright": "과거 경험이나 향수를 느낍니다.", "reversed": "과거에 얽매여 현재를 놓칩니다."},
    "cups_07": {"upright": "많은 선택지가 있지만 불명확합니다.", "reversed": "명료함을 얻고 결정합니다."},
    "cups_08": {"upright": "현재를 버리고 더 나은 것을 찾습니다.", "reversed": "변화를 두려워합니다."},
    "cups_09": {"upright": "만족과 성취감을 느낍니다.", "reversed": "물질적 성공에도 공허함을 느낍니다."},
    "cups_10": {"upright": "가족적 분위기와 행복한 팀입니다.", "reversed": "갈등이나 불화가 있습니다."},
    "cups_11": {"upright": "창의적이고 상상력이 풍부합니다.", "reversed": "비현실적이거나 미성숙합니다."},
    "cups_12": {"upright": "이상주의적이고 낭만적으로 일합니다.", "reversed": "현실 도피나 불안정합니다."},
    "cups_13": {"upright": "감정적으로 성숙하고 안정적입니다.", "reversed": "감정 불안정이 일에 영향을 줍니다."},
    "cups_14": {"upright": "감정적 지혜로 균형 있게 일합니다.", "reversed": "감정 조종이나 불안정입니다."},
    "swords_01": {"upright": "명확한 사고와 새로운 아이디어입니다.", "reversed": "혼란이나 잘못된 판단입니다."},
    "swords_02": {"upright": "어려운 결정이나 딜레마입니다.", "reversed": "결정을 내리고 행동합니다."},
    "swords_03": {"upright": "고통스러운 진실이나 배신입니다.", "reversed": "고통에서 회복하고 치유됩니다."},
    "swords_04": {"upright": "휴식과 재충전이 필요합니다.", "reversed": "휴식에서 벗어나 활동을 재개합니다."},
    "swords_05": {"upright": "갈등이나 불공정한 승리입니다.", "reversed": "갈등이 해소되고 화해합니다."},
    "swords_06": {"upright": "어려움에서 벗어나 이동합니다.", "reversed": "변화가 지연되거나 저항합니다."},
    "swords_07": {"upright": "전략적이지만 부정직할 수 있습니다.", "reversed": "속임수가 드러나고 정직해집니다."},
    "swords_08": {"upright": "제약받거나 갇힌 느낌입니다.", "reversed": "제약에서 벗어나 자유로워집니다."},
    "swords_09": {"upright": "걱정과 불안에 시달립니다.", "reversed": "불안에서 벗어나 평화를 찾습니다."},
    "swords_10": {"upright": "최악의 상황이나 끝입니다.", "reversed": "최악에서 회복하고 재시작합니다."},
    "swords_11": {"upright": "명확한 소통과 정직한 메시지입니다.", "reversed": "비판이나 허위 정보입니다."},
    "swords_12": {"upright": "열정적이지만 성급합니다.", "reversed": "무모하거나 충동적입니다."},
    "swords_13": {"upright": "독립적이고 명확하게 판단합니다.", "reversed": "냉담하거나 고립됩니다."},
    "swords_14": {"upright": "지적 권위와 현명한 결정입니다.", "reversed": "독단적이거나 권위 남용입니다."},
    "pentacles_01": {"upright": "새로운 기회나 안정적인 시작입니다.", "reversed": "기회 상실이나 불안정입니다."},
    "pentacles_02": {"upright": "여러 일의 균형을 잡습니다.", "reversed": "균형을 잃고 혼란스럽습니다."},
    "pentacles_03": {"upright": "협력과 팀워크로 성과를 냅니다.", "reversed": "협력 실패나 품질 문제입니다."},
    "pentacles_04": {"upright": "재정이나 자원을 지나치게 통제합니다.", "reversed": "집착에서 벗어나 관대해집니다."},
    "pentacles_05": {"upright": "재정적 어려움이나 실직 위기입니다.", "reversed": "어려움에서 회복하고 안정을 찾습니다."},
    "pentacles_06": {"upright": "관대하게 주고받으며 공정합니다.", "reversed": "불균형하거나 일방적입니다."},
    "pentacles_07": {"upright": "인내심을 가지고 결과를 기다립니다.", "reversed": "조급해하거나 결과가 부족합니다."},
    "pentacles_08": {"upright": "성실하게 일하고 기술을 연마합니다.", "reversed": "게으르거나 불성실합니다."},
    "pentacles_09": {"upright": "독립적이고 성공적으로 일합니다.", "reversed": "성공에도 외롭거나 불안합니다."},
    "pentacles_10": {"upright": "장기적 성공과 풍요를 누립니다.", "reversed": "재정 문제나 가족 갈등입니다."},
    "pentacles_11": {"upright": "성실하게 배우고 실천합니다.", "reversed": "게으르거나 학습 거부입니다."},
    "pentacles_12": {"upright": "책임감 있고 꾸준히 일합니다.", "reversed": "게으르거나 과도하게 신중합니다."},
    "pentacles_13": {"upright": "실용적이고 안정적으로 일합니다.", "reversed": "일중독이나 물질주의입니다."},
    "pentacles_14": {"upright": "실용적 지혜로 성공을 이룹니다.", "reversed": "탐욕이나 부정직입니다."},
}

print(f"[OK] career 데이터 생성 완료: {len(career_data)} 장")

# career 추가
print("\n[3/4] 카드에 career 추가 중...")
count = 0
for card_id, career in career_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["career"] = career["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["career"] = career["reversed"]
        count += 1

print(f"[OK] career 추가 완료: {count} 장")

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
print(f"[OK] career 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] career (직업운) 카테고리 추가 작업 완료!")
print("=" * 60)
