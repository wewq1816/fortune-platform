# -*- coding: utf-8 -*-
"""
job (직업추천) 카테고리 추가 스크립트
78장 × 2방향 = 156개 job 의미 자동 생성
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
print("Tarot Cards - job (직업추천) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# job 데이터 정의
print("\n[2/4] job 데이터 생성 중...")

job_data = {
    "major_00": {"upright": "프리랜서, 여행 가이드, 모험가, 스타트업 창업자", "reversed": "안정적인 직장이 필요합니다. 계획을 세우고 준비하세요."},
    "major_01": {"upright": "영업사원, 강사, 마케터, 컨설턴트, CEO", "reversed": "독단적 업무는 피하세요. 팀워크가 필요한 직업을 찾으세요."},
    "major_02": {"upright": "상담사, 심리치료사, 예술가, 점술가, 영성 지도자", "reversed": "실용적 기술이 필요한 직업을 찾으세요."},
    "major_03": {"upright": "교사, 간호사, 육아 전문가, 사회복지사, 요리사", "reversed": "돌봄 과잉 직업은 피하세요. 균형 잡힌 직업을 찾으세요."},
    "major_04": {"upright": "관리자, 회계사, 변호사, 건축가, 공무원", "reversed": "창의적이고 유연한 직업을 찾으세요."},
    "major_05": {"upright": "교수, 성직자, 전통 문화 전문가, 멘토, 교육자", "reversed": "혁신적이고 현대적인 직업을 찾으세요."},
    "major_06": {"upright": "상담사, 중재자, 디자이너, 예술가, 큐레이터", "reversed": "결정적이고 명확한 직업을 찾으세요."},
    "major_07": {"upright": "경영자, 운동선수, 영업 관리자, 프로젝트 매니저", "reversed": "협력적이고 유연한 직업을 찾으세요."},
    "major_08": {"upright": "연구원, 의사, 수련사, 코치, 트레이너", "reversed": "빠르고 역동적인 직업을 찾으세요."},
    "major_09": {"upright": "작가, 연구원, 명상 지도자, 철학자, 분석가", "reversed": "사회적이고 활동적인 직업을 찾으세요."},
    "major_10": {"upright": "컨설턴트, 기획자, 트렌드 분석가, 변화관리 전문가", "reversed": "안정적이고 예측 가능한 직업을 찾으세요."},
    "major_11": {"upright": "판사, 변호사, 중재자, 감사관, 규정 전문가", "reversed": "유연하고 창의적인 직업을 찾으세요."},
    "major_12": {"upright": "사회복지사, 자원봉사자, 의료인, 상담사", "reversed": "자기 가치를 인정하는 직업을 찾으세요."},
    "major_13": {"upright": "컨설턴트, 변화관리 전문가, 재편 전문가, 혁신가", "reversed": "안정적이고 지속적인 직업을 찾으세요."},
    "major_14": {"upright": "중재자, 상담사, 디자이너, 조화 전문가", "reversed": "명확하고 결정적인 직업을 찾으세요."},
    "major_15": {"upright": "영업사원, 마케터, 협상가, 설득 전문가", "reversed": "윤리적이고 투명한 직업을 찾으세요."},
    "major_16": {"upright": "위기관리 전문가, 응급구조사, 혁신가, 파괴적 혁신가", "reversed": "안정적이고 점진적인 직업을 찾으세요."},
    "major_17": {"upright": "예술가, 상담사, 힐러, 영감 제공자", "reversed": "현실적이고 구체적인 직업을 찾으세요."},
    "major_18": {"upright": "예술가, 심리학자, 창작자, 감성 전문가", "reversed": "논리적이고 명확한 직업을 찾으세요."},
    "major_19": {"upright": "엔터테이너, 교육자, 영업사원, 긍정 전문가", "reversed": "현실적이고 신중한 직업을 찾으세요."},
    "major_20": {"upright": "평가자, 감사관, 컨설턴트, 재평가 전문가", "reversed": "미래 지향적이고 혁신적인 직업을 찾으세요."},
    "major_21": {"upright": "프로젝트 매니저, 총괄 책임자, 종합 전문가, 완성 전문가", "reversed": "시작과 과정에 집중하는 직업을 찾으세요."},
    "wands_01": {"upright": "창업가, 기획자, 마케터, 혁신가", "reversed": "실행력이 필요한 직업을 찾으세요."},
    "wands_02": {"upright": "전략가, 컨설턴트, 투자자, 기획 전문가", "reversed": "실행 중심의 직업을 찾으세요."},
    "wands_03": {"upright": "영업사원, 무역상, 네트워커, 확장 전문가", "reversed": "안정적이고 지역적인 직업을 찾으세요."},
    "wands_04": {"upright": "이벤트 플래너, 기획자, 축제 전문가", "reversed": "안정적이고 지속적인 직업을 찾으세요."},
    "wands_05": {"upright": "운동선수, 경쟁 전문가, 영업 경쟁자", "reversed": "협력적이고 평화로운 직업을 찾으세요."},
    "wands_06": {"upright": "관리자, 리더, 영업 관리자, 성취 전문가", "reversed": "기초부터 배우는 직업을 찾으세요."},
    "wands_07": {"upright": "보안 전문가, 수비 전문가, 법률가", "reversed": "편안하고 스트레스 없는 직업을 찾으세요."},
    "wands_08": {"upright": "물류 전문가, 응급구조사, 빠른 서비스 제공자", "reversed": "천천히 진행하는 직업을 찾으세요."},
    "wands_09": {"upright": "보안 전문가, 위기관리 전문가, 수비수", "reversed": "휴식과 균형이 있는 직업을 찾으세요."},
    "wands_10": {"upright": "프로젝트 매니저, 관리자, 총괄 책임자", "reversed": "책임이 적고 위임 가능한 직업을 찾으세요."},
    "wands_11": {"upright": "학습자, 탐구자, 신기술 전문가", "reversed": "전문성과 깊이가 필요한 직업을 찾으세요."},
    "wands_12": {"upright": "영업사원, 탐험가, 운동선수, 모험가", "reversed": "계획적이고 전략적인 직업을 찾으세요."},
    "wands_13": {"upright": "창업가, 리더, 혁신가, 독립 전문가", "reversed": "협력적이고 팀 중심의 직업을 찾으세요."},
    "wands_14": {"upright": "CEO, 경영자, 리더, 비전 제시자", "reversed": "협력적이고 책임 분담하는 직업을 찾으세요."},
    "cups_01": {"upright": "상담사, 예술가, 힐러, 감성 전문가", "reversed": "논리적이고 분석적인 직업을 찾으세요."},
    "cups_02": {"upright": "협상가, 중재자, 파트너십 전문가", "reversed": "독립적이고 자율적인 직업을 찾으세요."},
    "cups_03": {"upright": "이벤트 플래너, 호스피탈리티, 엔터테이너", "reversed": "진지하고 깊이 있는 직업을 찾으세요."},
    "cups_04": {"upright": "명상 지도자, 심리학자, 철학자", "reversed": "활동적이고 사교적인 직업을 찾으세요."},
    "cups_05": {"upright": "상담사, 치유 전문가, 지원 전문가", "reversed": "긍정적이고 미래 지향적인 직업을 찾으세요."},
    "cups_06": {"upright": "문화 전문가, 교육자, 보존 전문가", "reversed": "현대적이고 혁신적인 직업을 찾으세요."},
    "cups_07": {"upright": "창작자, 기획자, 혁신가, 상상력 전문가", "reversed": "현실적이고 실용적인 직업을 찾으세요."},
    "cups_08": {"upright": "컨설턴트, 전환 전문가, 변화관리 전문가", "reversed": "안정적이고 지속적인 직업을 찾으세요."},
    "cups_09": {"upright": "서비스 전문가, 환대 전문가, 만족도 전문가", "reversed": "성장과 발전이 있는 직업을 찾으세요."},
    "cups_10": {"upright": "가족 상담사, 커뮤니티 전문가, 힐링 전문가", "reversed": "갈등 해결 전문가, 조정 전문가를 찾으세요."},
    "cups_11": {"upright": "예술가, 디자이너, 창작자", "reversed": "성숙하고 전문적인 직업을 찾으세요."},
    "cups_12": {"upright": "예술가, 상담사, 영성 지도자", "reversed": "현실적이고 구체적인 직업을 찾으세요."},
    "cups_13": {"upright": "상담사, 치유 전문가, 케어 전문가", "reversed": "안정성과 균형이 필요한 직업을 찾으세요."},
    "cups_14": {"upright": "상담사, 중재자, 힐링 전문가", "reversed": "투명하고 진정성 있는 직업을 찾으세요."},
    "swords_01": {"upright": "변호사, 분석가, 저널리스트, 판단 전문가", "reversed": "명료함과 집중력이 필요한 직업을 찾으세요."},
    "swords_02": {"upright": "중재자, 협상가, 결정 전문가", "reversed": "명확하고 결정적인 직업을 찾으세요."},
    "swords_03": {"upright": "상담사, 치료사, 지원 전문가", "reversed": "치유와 회복 전문가를 찾으세요."},
    "swords_04": {"upright": "휴양 전문가, 명상 지도자, 재충전 전문가", "reversed": "활동적이고 역동적인 직업을 찾으세요."},
    "swords_05": {"upright": "협상가, 경쟁 전문가, 전략가", "reversed": "협력적이고 평화로운 직업을 찾으세요."},
    "swords_06": {"upright": "변화관리 전문가, 이동 전문가, 전환 전문가", "reversed": "안정적이고 지속적인 직업을 찾으세요."},
    "swords_07": {"upright": "전략가, 기획자, 협상가", "reversed": "정직하고 투명한 직업을 찾으세요."},
    "swords_08": {"upright": "컨설턴트, 문제해결 전문가, 혁신가", "reversed": "자유롭고 제약 없는 직업을 찾으세요."},
    "swords_09": {"upright": "상담사, 심리 전문가, 지원 전문가", "reversed": "평화롭고 안정적인 직업을 찾으세요."},
    "swords_10": {"upright": "위기관리 전문가, 회복 전문가, 재건 전문가", "reversed": "희망과 가능성이 있는 직업을 찾으세요."},
    "swords_11": {"upright": "저널리스트, 소통 전문가, 진실 추구자", "reversed": "부드럽고 공감적인 직업을 찾으세요."},
    "swords_12": {"upright": "영업사원, 액션 전문가, 빠른 대응자", "reversed": "신중하고 계획적인 직업을 찾으세요."},
    "swords_13": {"upright": "분석가, 독립 전문가, 결정 전문가", "reversed": "따뜻하고 공감적인 직업을 찾으세요."},
    "swords_14": {"upright": "법률가, 판단 전문가, 리더", "reversed": "공감과 감성이 필요한 직업을 찾으세요."},
    "pentacles_01": {"upright": "재정 전문가, 투자자, 사업가", "reversed": "안정적이고 계획적인 직업을 찾으세요."},
    "pentacles_02": {"upright": "다중업무 전문가, 조정자, 균형 전문가", "reversed": "집중력과 우선순위가 필요한 직업을 찾으세요."},
    "pentacles_03": {"upright": "기술자, 협업 전문가, 장인", "reversed": "학습과 성장이 필요한 직업을 찾으세요."},
    "pentacles_04": {"upright": "재정관리자, 보안 전문가, 관리 전문가", "reversed": "개방적이고 유연한 직업을 찾으세요."},
    "pentacles_05": {"upright": "사회복지사, 지원 전문가, 회복 전문가", "reversed": "안정적이고 지원받는 직업을 찾으세요."},
    "pentacles_06": {"upright": "자선 활동가, 나눔 전문가, 공정거래 전문가", "reversed": "공정하고 균형 잡힌 직업을 찾으세요."},
    "pentacles_07": {"upright": "평가자, 심사자, 장기투자 전문가", "reversed": "빠르고 역동적인 직업을 찾으세요."},
    "pentacles_08": {"upright": "장인, 기술 전문가, 전문가", "reversed": "근면하고 성실한 직업을 찾으세요."},
    "pentacles_09": {"upright": "사업가, 독립 전문가, 자립 전문가", "reversed": "협력적이고 균형 잡힌 직업을 찾으세요."},
    "pentacles_10": {"upright": "부동산 전문가, 유산 관리자, 가족사업 경영자", "reversed": "안정성과 기초가 필요한 직업을 찾으세요."},
    "pentacles_11": {"upright": "학습자, 훈련생, 기술 습득자", "reversed": "열심히 배우고 노력하는 직업을 찾으세요."},
    "pentacles_12": {"upright": "관리자, 책임 전문가, 신중한 업무 전문가", "reversed": "균형 잡히고 적극적인 직업을 찾으세요."},
    "pentacles_13": {"upright": "재정 전문가, 관리자, 안정적 사업가", "reversed": "유연하고 개방적인 직업을 찾으세요."},
    "pentacles_14": {"upright": "경영자, 투자자, 부동산 전문가", "reversed": "정직하고 윤리적인 직업을 찾으세요."},
}

print(f"[OK] job 데이터 생성 완료: {len(job_data)} 장")

# job 추가
print("\n[3/4] 카드에 job 추가 중...")
count = 0
for card_id, job in job_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["job"] = job["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["job"] = job["reversed"]
        count += 1

print(f"[OK] job 추가 완료: {count} 장")

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
print(f"[OK] job 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] job (직업추천) 카테고리 추가 작업 완료!")
print("=" * 60)

