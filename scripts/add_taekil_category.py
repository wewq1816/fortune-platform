# -*- coding: utf-8 -*-
"""
taekil (택일) 카테고리 추가 스크립트
78장 × 2방향 = 156개 taekil 의미 자동 생성
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
print("Tarot Cards - taekil (택일) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# taekil 데이터 정의
print("\n[2/4] taekil 데이터 생성 중...")

taekil_data = {
    "major_00": {"upright": "새로운 시작에 좋은 날입니다. 과감하게 도전하세요.", "reversed": "중요한 일은 미루는 것이 좋습니다. 준비가 필요합니다."},
    "major_01": {"upright": "계약이나 거래에 길합니다. 강하게 추진하세요.", "reversed": "독단적 결정은 피하세요. 협의가 필요합니다."},
    "major_02": {"upright": "직관을 믿고 결정하세요. 내면의 목소리를 따르세요.", "reversed": "중요한 결정은 미루세요. 더 많은 정보가 필요합니다."},
    "major_03": {"upright": "가족 행사나 집안일에 길합니다.", "reversed": "과도한 배려는 피하세요. 독립적으로 진행하세요."},
    "major_04": {"upright": "계약서 작성이나 법적 절차에 길합니다.", "reversed": "융통성 있게 접근하세요. 너무 경직되지 마세요."},
    "major_05": {"upright": "전통 의식이나 격식 있는 행사에 길합니다.", "reversed": "새로운 방식을 시도하세요. 형식에 얽매이지 마세요."},
    "major_06": {"upright": "결혼이나 중요한 선택에 길합니다.", "reversed": "신중하게 재검토하세요. 서두르지 마세요."},
    "major_07": {"upright": "추진력 있게 일을 진행하세요. 강하게 밀어붙이세요.", "reversed": "재정비가 필요합니다. 잠시 멈추세요."},
    "major_08": {"upright": "인내심이 필요한 일에 길합니다. 꾸준히 진행하세요.", "reversed": "감정적 결정은 피하세요. 차분하게 접근하세요."},
    "major_09": {"upright": "혼자 계획을 세우고 성찰하기 좋은 날입니다.", "reversed": "고립되지 말고 조언을 구하세요."},
    "major_10": {"upright": "큰 변화나 전환에 길합니다. 변화를 받아들이세요.", "reversed": "급격한 변화는 피하세요. 점진적으로 진행하세요."},
    "major_11": {"upright": "법적 절차나 공정한 거래에 길합니다.", "reversed": "불공정한 거래는 피하세요. 재검토하세요."},
    "major_12": {"upright": "기다림이나 희생이 필요한 일에 적합합니다.", "reversed": "불필요한 희생은 피하세요. 균형을 찾으세요."},
    "major_13": {"upright": "완전한 변화나 재시작에 길합니다.", "reversed": "변화를 두려워하지 마세요. 용기를 내세요."},
    "major_14": {"upright": "균형 잡힌 결정이나 중재에 길합니다.", "reversed": "극단적 선택은 피하세요. 중용을 지키세요."},
    "major_15": {"upright": "유혹적인 제안을 신중하게 검토하세요.", "reversed": "함정이나 유혹에서 벗어나세요."},
    "major_16": {"upright": "갑작스러운 변화에 대비하세요. 위기관리가 필요합니다.", "reversed": "최악의 시기를 피했습니다. 회복하세요."},
    "major_17": {"upright": "희망을 가지고 계획하기 좋은 날입니다.", "reversed": "비현실적 기대는 피하세요. 현실적으로 접근하세요."},
    "major_18": {"upright": "불확실한 상황에서는 기다리세요.", "reversed": "진실이 드러나면 결정하세요."},
    "major_19": {"upright": "긍정적으로 추진하기 좋은 날입니다.", "reversed": "과도한 낙관은 피하세요. 현실을 직시하세요."},
    "major_20": {"upright": "재평가나 중요한 결정에 길합니다.", "reversed": "과거에 얽매이지 말고 전진하세요."},
    "major_21": {"upright": "완성이나 성취에 길합니다. 마무리하세요.", "reversed": "끝까지 집중하세요. 장애물을 극복하세요."},
    "wands_01": {"upright": "새로운 프로젝트 시작에 길합니다.", "reversed": "아이디어만 있고 준비가 부족합니다. 계획을 세우세요."},
    "wands_02": {"upright": "장기 계획 수립에 좋은 날입니다.", "reversed": "우유부단함을 버리고 결정하세요."},
    "wands_03": {"upright": "확장이나 진출에 길합니다.", "reversed": "확장은 잠시 보류하세요. 기다리세요."},
    "wands_04": {"upright": "축하 행사나 기념일에 길합니다.", "reversed": "불안정한 상황이니 신중하세요."},
    "wands_05": {"upright": "경쟁에 참여하기 좋은 날입니다.", "reversed": "불필요한 갈등은 피하세요."},
    "wands_06": {"upright": "성과 발표나 인정받기 좋은 날입니다.", "reversed": "겸손하게 접근하세요."},
    "wands_07": {"upright": "방어나 입장 고수에 길합니다.", "reversed": "지나치게 고집부리지 마세요."},
    "wands_08": {"upright": "빠른 실행이나 결정에 길합니다.", "reversed": "서두르지 말고 신중하세요."},
    "wands_09": {"upright": "마지막 노력이 필요한 일에 적합합니다.", "reversed": "휴식이 필요합니다. 재충전하세요."},
    "wands_10": {"upright": "책임을 지고 완수하세요.", "reversed": "부담을 나누고 위임하세요."},
    "wands_11": {"upright": "새로운 것을 배우기 좋은 날입니다.", "reversed": "조급하게 서두르지 마세요."},
    "wands_12": {"upright": "적극적으로 행동하기 좋은 날입니다.", "reversed": "무모한 행동은 피하세요."},
    "wands_13": {"upright": "열정적으로 추진하세요.", "reversed": "과열되지 말고 균형을 유지하세요."},
    "wands_14": {"upright": "리더십을 발휘하기 좋은 날입니다.", "reversed": "독재적이지 말고 협력하세요."},
    "cups_01": {"upright": "새로운 관계 시작에 길합니다.", "reversed": "감정적 공허함이 있으니 기다리세요."},
    "cups_02": {"upright": "파트너십이나 협력에 길합니다.", "reversed": "불균형한 관계는 피하세요."},
    "cups_03": {"upright": "축하 행사나 모임에 길합니다.", "reversed": "과도한 모임은 피하세요."},
    "cups_04": {"upright": "혼자 성찰하기 좋은 날입니다.", "reversed": "기회를 놓치지 마세요. 열린 마음을 가지세요."},
    "cups_05": {"upright": "실망한 일은 정리하세요.", "reversed": "회복하고 새롭게 시작하세요."},
    "cups_06": {"upright": "추억을 되새기기 좋은 날입니다.", "reversed": "과거에 얽매이지 말고 현재에 집중하세요."},
    "cups_07": {"upright": "여러 선택지를 검토하세요.", "reversed": "명료함을 얻고 결정하세요."},
    "cups_08": {"upright": "변화나 전환에 길합니다.", "reversed": "현재에 머물러도 괜찮습니다."},
    "cups_09": {"upright": "소원 성취나 만족에 길합니다.", "reversed": "만족하지 못하더라도 감사하세요."},
    "cups_10": {"upright": "가족 행사나 화합에 길합니다.", "reversed": "갈등 해결이 필요합니다."},
    "cups_11": {"upright": "창의적 시도에 길합니다.", "reversed": "현실적으로 접근하세요."},
    "cups_12": {"upright": "꿈과 이상 추구에 좋은 날입니다.", "reversed": "현실로 돌아와 실행하세요."},
    "cups_13": {"upright": "성숙한 결정에 길합니다.", "reversed": "감정 안정이 필요합니다."},
    "cups_14": {"upright": "균형 잡힌 관계 형성에 길합니다.", "reversed": "감정 조종은 피하세요."},
    "swords_01": {"upright": "명확한 결정이나 계약에 길합니다.", "reversed": "혼란스러우니 기다리세요."},
    "swords_02": {"upright": "어려운 선택을 해야 합니다.", "reversed": "결정하고 행동하세요."},
    "swords_03": {"upright": "슬픔을 정리하기 좋은 날입니다.", "reversed": "치유하고 회복하세요."},
    "swords_04": {"upright": "휴식이나 재충전에 길합니다.", "reversed": "휴식을 끝내고 행동하세요."},
    "swords_05": {"upright": "갈등 해결이나 경쟁에 주의하세요.", "reversed": "화해하고 협력하세요."},
    "swords_06": {"upright": "이동이나 전환에 길합니다.", "reversed": "변화가 지연되니 기다리세요."},
    "swords_07": {"upright": "전략적 접근이 필요합니다.", "reversed": "정직하게 접근하세요."},
    "swords_08": {"upright": "제약에서 벗어나기 좋은 날입니다.", "reversed": "제약이 있으니 기다리세요."},
    "swords_09": {"upright": "불안을 해소하세요.", "reversed": "평화를 찾으세요."},
    "swords_10": {"upright": "종결이나 마무리에 길합니다.", "reversed": "회복하고 재시작하세요."},
    "swords_11": {"upright": "진실을 밝히기 좋은 날입니다.", "reversed": "비판적이지 말고 부드럽게 접근하세요."},
    "swords_12": {"upright": "빠른 행동이 필요합니다.", "reversed": "신중하게 접근하세요."},
    "swords_13": {"upright": "독립적 결정에 길합니다.", "reversed": "따뜻하게 접근하세요."},
    "swords_14": {"upright": "현명한 판단이나 결정에 길합니다.", "reversed": "공감하고 이해하세요."},
    "pentacles_01": {"upright": "새로운 투자나 사업 시작에 길합니다.", "reversed": "기회 상실 주의, 신중하게 접근하세요."},
    "pentacles_02": {"upright": "재정 균형 유지에 좋은 날입니다.", "reversed": "균형을 잡으세요."},
    "pentacles_03": {"upright": "협력이나 팀워크에 길합니다.", "reversed": "협력 개선이 필요합니다."},
    "pentacles_04": {"upright": "재정 관리나 저축에 길합니다.", "reversed": "지나친 절약은 피하세요."},
    "pentacles_05": {"upright": "어려움 극복이나 지원 요청에 적합합니다.", "reversed": "회복하고 안정을 찾으세요."},
    "pentacles_06": {"upright": "나눔이나 공정한 거래에 길합니다.", "reversed": "공정함을 지키세요."},
    "pentacles_07": {"upright": "장기 투자나 인내에 길합니다.", "reversed": "조급하지 말고 기다리세요."},
    "pentacles_08": {"upright": "기술 습득이나 학습에 길합니다.", "reversed": "성실하게 노력하세요."},
    "pentacles_09": {"upright": "독립이나 자립에 길합니다.", "reversed": "균형을 찾으세요."},
    "pentacles_10": {"upright": "가족 사업이나 유산 관련 일에 길합니다.", "reversed": "재정 안정이 필요합니다."},
    "pentacles_11": {"upright": "학습이나 훈련 시작에 길합니다.", "reversed": "열심히 배우세요."},
    "pentacles_12": {"upright": "책임 있는 관리에 길합니다.", "reversed": "균형을 찾으세요."},
    "pentacles_13": {"upright": "안정적인 투자나 관리에 길합니다.", "reversed": "유연하게 접근하세요."},
    "pentacles_14": {"upright": "큰 투자나 사업 확장에 길합니다.", "reversed": "정직하고 윤리적으로 접근하세요."},
}

print(f"[OK] taekil 데이터 생성 완료: {len(taekil_data)} 장")

# taekil 추가
print("\n[3/4] 카드에 taekil 추가 중...")
count = 0
for card_id, taekil in taekil_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["taekil"] = taekil["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["taekil"] = taekil["reversed"]
        count += 1

print(f"[OK] taekil 추가 완료: {count} 장")

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
print(f"[OK] taekil 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] taekil (택일) 카테고리 추가 작업 완료!")
print("=" * 60)

