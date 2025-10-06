# -*- coding: utf-8 -*-
"""
study (학업운) 카테고리 추가 스크립트
78장 × 2방향 = 156개 study 의미 자동 생성
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
print("Tarot Cards - study (학업운) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# study 데이터 정의
print("\n[2/4] study 데이터 생성 중...")

study_data = {
    "major_00": {"upright": "새로운 학습이나 과목을 시작하기 좋은 시기입니다. 호기심을 가지고 탐험하세요.", "reversed": "무계획하거나 집중력 부족으로 어려움을 겪습니다. 체계적으로 준비하세요."},
    "major_01": {"upright": "강한 의지와 집중력으로 학업 목표를 달성합니다. 자신감 있게 공부하세요.", "reversed": "자만심이나 독단적 태도가 문제입니다. 겸손하게 배우세요."},
    "major_02": {"upright": "직관과 통찰력으로 깊이 이해합니다. 내면의 지혜를 활용하세요.", "reversed": "정보 부족이나 이해 부족입니다. 더 공부하고 질문하세요."},
    "major_03": {"upright": "창의적이고 양육하는 방식으로 학습합니다. 즐기며 배우세요.", "reversed": "과잉보호나 의존적 태도입니다. 독립적으로 공부하세요."},
    "major_04": {"upright": "체계적이고 규칙적인 학습이 효과적입니다. 계획을 세우고 실행하세요.", "reversed": "경직되거나 융통성 부족입니다. 유연하게 접근하세요."},
    "major_05": {"upright": "전통적 학습법과 스승의 가르침이 도움이 됩니다. 조언을 구하세요.", "reversed": "낡은 방법에 얽매이거나 권위에 반발합니다. 새로운 방법을 시도하세요."},
    "major_06": {"upright": "학업 경로나 전공 선택의 기로에 섰습니다. 신중하게 결정하세요.", "reversed": "잘못된 선택이나 유혹에 빠집니다. 진지하게 고민하세요."},
    "major_07": {"upright": "강한 의지로 학업 목표를 달성하고 경쟁에서 승리합니다.", "reversed": "통제력 상실이나 방향 상실입니다. 재정비하세요."},
    "major_08": {"upright": "인내심과 자제력으로 어려운 과목을 극복합니다. 끈기 있게 공부하세요.", "reversed": "자제력 부족이나 나태함입니다. 의지를 강화하세요."},
    "major_09": {"upright": "혼자 깊이 생각하고 이해합니다. 고독 속에서 깨달음을 얻으세요.", "reversed": "고립되거나 도움을 거부합니다. 협력하고 질문하세요."},
    "major_10": {"upright": "학업 운이 좋아지고 긍정적 변화가 옵니다. 기회를 잡으세요.", "reversed": "학업 정체나 불운이 계속됩니다. 인내하고 방법을 바꾸세요."},
    "major_11": {"upright": "공정한 평가와 정당한 성적을 받습니다. 정직하게 공부하세요.", "reversed": "불공정한 평가나 부정행위 문제입니다. 올바르게 행동하세요."},
    "major_12": {"upright": "희생이나 대기가 필요합니다. 새로운 관점으로 학습하세요.", "reversed": "불필요한 희생이나 지연입니다. 행동하고 변화하세요."},
    "major_13": {"upright": "완전한 학습 방법 변화입니다. 과거를 버리고 새롭게 시작하세요.", "reversed": "변화를 두려워하고 낡은 방법을 고수합니다. 용기를 내세요."},
    "major_14": {"upright": "균형과 절제로 안정적으로 학습합니다. 극단을 피하세요.", "reversed": "불균형이나 극단적 공부가 문제입니다. 중용을 지키세요."},
    "major_15": {"upright": "나쁜 학습 습관이나 집착을 인식하세요. 자유로워지세요.", "reversed": "집착에서 벗어나 건강하게 공부합니다."},
    "major_16": {"upright": "갑작스러운 학업 위기나 충격적인 결과입니다. 재건하세요.", "reversed": "최악의 위기를 넘기고 회복합니다."},
    "major_17": {"upright": "학업에 대한 희망과 영감이 가득합니다. 긍정적으로 공부하세요.", "reversed": "희망을 잃거나 실망합니다. 긍정적 태도를 회복하세요."},
    "major_18": {"upright": "학습 방향이 불확실하고 혼란스럽습니다. 신중하게 선택하세요.", "reversed": "명료해지고 방향이 명확해집니다."},
    "major_19": {"upright": "큰 학업 성공과 인정을 받습니다. 자신감 있게 빛나세요.", "reversed": "일시적 후퇴나 과도한 자신감입니다. 겸손하세요."},
    "major_20": {"upright": "중요한 학업 결정이나 재평가의 시기입니다. 과거를 정리하세요.", "reversed": "과거 실패에 얽매입니다. 용서하고 앞으로 나아가세요."},
    "major_21": {"upright": "학업 목표 달성과 완성입니다. 성공을 축하하고 다음을 준비하세요.", "reversed": "미완성이나 마지막 장애물입니다. 끝까지 완수하세요."},
    "wands_01": {"upright": "새로운 과목이나 학습 프로젝트를 시작합니다. 열정적으로 도전하세요.", "reversed": "동기 부족이나 시작 지연입니다. 에너지를 회복하세요."},
    "wands_02": {"upright": "장기 학습 계획을 세우고 목표를 설정합니다.", "reversed": "계획이 불분명하거나 우유부단합니다."},
    "wands_03": {"upright": "학업이 잘 진행되고 성과가 보입니다.", "reversed": "진행 지연이나 장애물이 있습니다."},
    "wands_04": {"upright": "안정적이고 조화로운 학습 환경입니다.", "reversed": "불안정하거나 집중하기 어렵습니다."},
    "wands_05": {"upright": "경쟁이나 토론에서 배웁니다.", "reversed": "경쟁에서 벗어나 협력합니다."},
    "wands_06": {"upright": "시험이나 발표에서 성공하고 인정받습니다.", "reversed": "실패나 인정받지 못합니다."},
    "wands_07": {"upright": "학업 압박을 견디고 방어합니다.", "reversed": "압도되거나 포기하고 싶습니다."},
    "wands_08": {"upright": "빠른 학습 진행과 급격한 이해가 있습니다.", "reversed": "이해가 지연되거나 너무 서둘러 실수합니다."},
    "wands_09": {"upright": "거의 목표에 도달했습니다. 끝까지 집중하세요.", "reversed": "소진되거나 지쳤습니다. 휴식을 취하세요."},
    "wands_10": {"upright": "과도한 학업 부담과 스트레스입니다. 우선순위를 정하세요.", "reversed": "부담을 줄이고 균형을 찾습니다."},
    "wands_11": {"upright": "열정적이고 호기심 많게 배웁니다.", "reversed": "조급하거나 불성실합니다."},
    "wands_12": {"upright": "적극적이고 모험적으로 학습합니다.", "reversed": "무모하거나 계획 없이 공부합니다."},
    "wands_13": {"upright": "열정적이고 독립적으로 공부합니다.", "reversed": "과열되거나 불균형합니다."},
    "wands_14": {"upright": "강력한 학습 리더십과 동기를 가집니다.", "reversed": "독단적이거나 무책임합니다."},
    "cups_01": {"upright": "학습에 대한 새로운 사랑과 열정이 시작됩니다.", "reversed": "감정적 공허로 학습 동기가 없습니다."},
    "cups_02": {"upright": "스터디 파트너십이나 협력 학습이 좋습니다.", "reversed": "불균형하거나 갈등이 있습니다."},
    "cups_03": {"upright": "그룹 스터디나 협력 학습이 즐겁습니다.", "reversed": "과도한 사교로 학습 시간이 부족합니다."},
    "cups_04": {"upright": "현재 학습에 무관심하거나 지루합니다.", "reversed": "새로운 관심을 찾고 동기를 회복합니다."},
    "cups_05": {"upright": "학업 실망이나 좌절이 있습니다.", "reversed": "실망에서 회복하고 다시 도전합니다."},
    "cups_06": {"upright": "과거 학습 방법이나 추억을 떠올립니다.", "reversed": "과거에 얽매여 현재를 놓칩니다."},
    "cups_07": {"upright": "많은 선택지가 있지만 결정하기 어렵습니다.", "reversed": "명료함을 얻고 방향을 정합니다."},
    "cups_08": {"upright": "현재 학습 방법을 버리고 더 나은 것을 찾습니다.", "reversed": "변화를 두려워하고 현재에 머뭅니다."},
    "cups_09": {"upright": "학업 목표가 이루어지고 만족합니다.", "reversed": "성적은 좋지만 만족하지 못합니다."},
    "cups_10": {"upright": "가족의 지원으로 행복하게 공부합니다.", "reversed": "가족 문제로 학업에 집중하기 어렵습니다."},
    "cups_11": {"upright": "창의적이고 상상력으로 학습합니다.", "reversed": "비현실적이거나 미성숙한 접근입니다."},
    "cups_12": {"upright": "이상주의적으로 학문을 추구합니다.", "reversed": "현실 도피나 불안정합니다."},
    "cups_13": {"upright": "성숙하고 안정적으로 학습합니다.", "reversed": "감정 불안정이 학업에 영향을 줍니다."},
    "cups_14": {"upright": "감정적 균형으로 지혜롭게 공부합니다.", "reversed": "감정 조종이나 불안정입니다."},
    "swords_01": {"upright": "명확한 사고와 새로운 아이디어로 학습합니다.", "reversed": "혼란이나 잘못된 이해입니다."},
    "swords_02": {"upright": "어려운 선택이나 딜레마가 있습니다.", "reversed": "결정을 내리고 집중합니다."},
    "swords_03": {"upright": "학업 스트레스나 고통스러운 경험입니다.", "reversed": "고통에서 회복하고 치유됩니다."},
    "swords_04": {"upright": "휴식과 재충전이 필요합니다.", "reversed": "휴식에서 벗어나 학습을 재개합니다."},
    "swords_05": {"upright": "경쟁이나 갈등이 있습니다.", "reversed": "갈등이 해소되고 협력합니다."},
    "swords_06": {"upright": "어려움에서 벗어나 나아갑니다.", "reversed": "변화가 지연되거나 정체됩니다."},
    "swords_07": {"upright": "전략적이지만 부정직할 수 있습니다.", "reversed": "정직해지고 올바르게 공부합니다."},
    "swords_08": {"upright": "제약받거나 갇힌 느낌입니다.", "reversed": "제약에서 벗어나 자유롭게 학습합니다."},
    "swords_09": {"upright": "시험 불안과 걱정에 시달립니다.", "reversed": "불안에서 벗어나 평화를 찾습니다."},
    "swords_10": {"upright": "최악의 학업 위기나 실패입니다.", "reversed": "최악에서 회복하고 재시작합니다."},
    "swords_11": {"upright": "명확한 이해와 정직한 평가입니다.", "reversed": "비판이나 오해가 있습니다."},
    "swords_12": {"upright": "열정적이지만 성급하게 공부합니다.", "reversed": "무모하거나 충동적입니다."},
    "swords_13": {"upright": "독립적이고 명확하게 학습합니다.", "reversed": "냉담하거나 고립됩니다."},
    "swords_14": {"upright": "지적 권위와 현명한 학습 전략입니다.", "reversed": "독단적이거나 권위 남용입니다."},
    "pentacles_01": {"upright": "새로운 학습 기회나 장학금이 옵니다.", "reversed": "기회 상실이나 재정 문제입니다."},
    "pentacles_02": {"upright": "여러 과목의 균형을 잡습니다.", "reversed": "균형을 잃고 혼란스럽습니다."},
    "pentacles_03": {"upright": "협력하여 좋은 성과를 냅니다.", "reversed": "협력 실패나 품질 문제입니다."},
    "pentacles_04": {"upright": "지식이나 자료를 지나치게 통제합니다.", "reversed": "공유하고 관대해집니다."},
    "pentacles_05": {"upright": "재정 어려움으로 학업에 지장이 있습니다.", "reversed": "어려움에서 회복하고 지원을 받습니다."},
    "pentacles_06": {"upright": "지식을 나누고 가르치며 배웁니다.", "reversed": "불균형하거나 일방적입니다."},
    "pentacles_07": {"upright": "인내심을 가지고 결과를 기다립니다.", "reversed": "조급해하거나 결과가 부족합니다."},
    "pentacles_08": {"upright": "성실하게 공부하고 기술을 연마합니다.", "reversed": "게으르거나 불성실합니다."},
    "pentacles_09": {"upright": "독립적이고 성공적으로 학습합니다.", "reversed": "성공에도 외롭거나 불안합니다."},
    "pentacles_10": {"upright": "장기적 학업 성공과 안정을 누립니다.", "reversed": "학업 부담이나 가족 압박이 있습니다."},
    "pentacles_11": {"upright": "성실하게 배우고 실천하는 학생입니다.", "reversed": "게으르거나 학습 거부입니다."},
    "pentacles_12": {"upright": "책임감 있고 꾸준히 공부합니다.", "reversed": "게으르거나 과도하게 신중합니다."},
    "pentacles_13": {"upright": "실용적이고 안정적으로 학습합니다.", "reversed": "공부 중독이나 완벽주의입니다."},
    "pentacles_14": {"upright": "실용적 지혜로 학업 성공을 이룹니다.", "reversed": "탐욕이나 부정직입니다."},
}

print(f"[OK] study 데이터 생성 완료: {len(study_data)} 장")

# study 추가
print("\n[3/4] 카드에 study 추가 중...")
count = 0
for card_id, study in study_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["study"] = study["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["study"] = study["reversed"]
        count += 1

print(f"[OK] study 추가 완료: {count} 장")

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
print(f"[OK] study 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] study (학업운) 카테고리 추가 작업 완료!")
print("=" * 60)
