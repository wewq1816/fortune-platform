# -*- coding: utf-8 -*-
"""
sinsal (신살) 카테고리 추가 스크립트
78장 × 2방향 = 156개 sinsal 의미 자동 생성
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
print("Tarot Cards - sinsal (신살) 카테고리 추가 작업 시작")
print("=" * 60)

# 파일 읽기
print("\n[1/4] 파일 읽는 중...")
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"[OK] 파일 읽기 완료: {len(data['meanings'])} 장의 카드")

# sinsal 데이터 정의
print("\n[2/4] sinsal 데이터 생성 중...")

sinsal_data = {
    "major_00": {"upright": "천을귀인(天乙貴人) - 하늘의 도움과 귀인의 은혜가 있습니다.", "reversed": "공망(空亡) - 노력이 헛되거나 공허함을 느낍니다."},
    "major_01": {"upright": "장성(將星) - 리더십과 권위가 강화됩니다.", "reversed": "역마살(驛馬殺) - 불안정하고 분주합니다."},
    "major_02": {"upright": "문창귀인(文昌貴人) - 학문과 지혜가 발달합니다.", "reversed": "과속살(寡宿殺) - 고독하거나 외로움을 느낍니다."},
    "major_03": {"upright": "복성귀인(福星貴人) - 복과 풍요가 깃듭니다.", "reversed": "도화살(桃花殺) - 감정적 혼란이나 유혹이 있습니다."},
    "major_04": {"upright": "천덕귀인(天德貴人) - 하늘의 덕으로 재난을 면합니다.", "reversed": "겁살(劫殺) - 재물 손실이나 위험이 있습니다."},
    "major_05": {"upright": "월덕귀인(月德貴人) - 달의 덕으로 평안합니다.", "reversed": "원진살(怨嗔殺) - 원한이나 갈등이 생깁니다."},
    "major_06": {"upright": "홍염(紅艶) - 인기와 매력이 상승합니다.", "reversed": "함지살(咸池殺) - 색정이나 스캔들 주의가 필요합니다."},
    "major_07": {"upright": "양인(羊刃) - 강한 추진력과 용기가 있습니다.", "reversed": "백호살(白虎殺) - 다툼이나 사고 위험이 있습니다."},
    "major_08": {"upright": "천의성(天醫星) - 건강과 치유의 운이 있습니다.", "reversed": "상문살(喪門殺) - 슬픔이나 상실이 있을 수 있습니다."},
    "major_09": {"upright": "화개성(華蓋星) - 예술과 학문에 재능이 있습니다.", "reversed": "고신살(孤辰殺) - 고독하거나 외롭습니다."},
    "major_10": {"upright": "천희성(天喜星) - 기쁜 일과 경사가 있습니다.", "reversed": "재살(災殺) - 재난이나 어려움이 있습니다."},
    "major_11": {"upright": "천관성(天官星) - 승진이나 명예가 있습니다.", "reversed": "형살(刑殺) - 법적 문제나 형벌 주의가 필요합니다."},
    "major_12": {"upright": "문곡성(文曲星) - 문학과 예술에 재능이 있습니다.", "reversed": "천라지망(天羅地網) - 막히고 답답합니다."},
    "major_13": {"upright": "해신살(解神殺) - 어려움이 해소되고 풀립니다.", "reversed": "사부살(死符殺) - 건강 주의가 필요합니다."},
    "major_14": {"upright": "천복성(天福星) - 복록과 평안이 있습니다.", "reversed": "육해살(六害殺) - 해로움이나 방해가 있습니다."},
    "major_15": {"upright": "복덕성(福德星) - 복과 덕이 쌓입니다.", "reversed": "도화살(桃花殺) - 이성 문제나 유혹이 있습니다."},
    "major_16": {"upright": "천파성(天破星) - 파괴 후 재건의 기회입니다.", "reversed": "대살(大殺) - 큰 어려움이나 재난 주의가 필요합니다."},
    "major_17": {"upright": "천문성(天文星) - 지혜와 학문이 발달합니다.", "reversed": "백호살(白虎殺) - 재물 손실이나 다툼이 있습니다."},
    "major_18": {"upright": "천예성(天藝星) - 예술적 재능이 있습니다.", "reversed": "암록살(暗祿殺) - 숨은 재물이 있거나 비밀이 있습니다."},
    "major_19": {"upright": "태양성(太陽星) - 밝고 긍정적인 에너지가 있습니다.", "reversed": "음살(陰殺) - 음습하거나 어두운 기운이 있습니다."},
    "major_20": {"upright": "천수성(天壽星) - 장수와 건강이 있습니다.", "reversed": "천애살(天厄殺) - 재난이나 액운 주의가 필요합니다."},
    "major_21": {"upright": "천록성(天祿星) - 재물과 녹봉이 풍족합니다.", "reversed": "탈기살(奪氣殺) - 기운이 빠지거나 소진됩니다."},
    "wands_01": {"upright": "진신귀인(眞神貴人) - 진정한 귀인의 도움이 있습니다.", "reversed": "공망살(空亡殺) - 노력이 헛되거나 공허합니다."},
    "wands_02": {"upright": "화개성(華蓋星) - 예술과 창의성이 발달합니다.", "reversed": "역마살(驛馬殺) - 불안정하고 분주합니다."},
    "wands_03": {"upright": "장성귀인(將星貴人) - 리더십과 권위가 있습니다.", "reversed": "백호살(白虎殺) - 다툼이나 갈등이 있습니다."},
    "wands_04": {"upright": "천희성(天喜星) - 기쁜 일과 경사가 있습니다.", "reversed": "상문살(喪門殺) - 슬픔이나 상실이 있습니다."},
    "wands_05": {"upright": "양인살(羊刃殺) - 강한 추진력이 있습니다.", "reversed": "겁살(劫殺) - 재물 손실이나 위험이 있습니다."},
    "wands_06": {"upright": "천관성(天官星) - 승진이나 명예가 있습니다.", "reversed": "형살(刑殺) - 법적 문제 주의가 필요합니다."},
    "wands_07": {"upright": "천의성(天醫星) - 건강과 치유의 운이 있습니다.", "reversed": "질액살(疾厄殺) - 질병이나 건강 주의가 필요합니다."},
    "wands_08": {"upright": "역마귀인(驛馬貴人) - 이동과 변화에 길합니다.", "reversed": "육해살(六害殺) - 해로움이나 방해가 있습니다."},
    "wands_09": {"upright": "천복성(天福星) - 복록과 평안이 있습니다.", "reversed": "탈기살(奪氣殺) - 기운이 빠지거나 소진됩니다."},
    "wands_10": {"upright": "천록성(天祿星) - 재물과 녹봉이 있습니다.", "reversed": "겁재살(劫財殺) - 재물 손실 주의가 필요합니다."},
    "wands_11": {"upright": "문창성(文昌星) - 학문과 지혜가 발달합니다.", "reversed": "공망살(空亡殺) - 노력이 헛되거나 공허합니다."},
    "wands_12": {"upright": "천마성(天馬星) - 이동과 활동에 길합니다.", "reversed": "역마살(驛馬殺) - 분주하거나 불안정합니다."},
    "wands_13": {"upright": "장성(將星) - 리더십과 권위가 강합니다.", "reversed": "백호살(白虎殺) - 다툼이나 갈등이 있습니다."},
    "wands_14": {"upright": "천권성(天權星) - 권력과 권위가 있습니다.", "reversed": "대살(大殺) - 큰 어려움이나 재난 주의가 필요합니다."},
    "cups_01": {"upright": "홍염귀인(紅艶貴人) - 인기와 사랑운이 좋습니다.", "reversed": "함지살(咸池殺) - 색정이나 스캔들 주의가 필요합니다."},
    "cups_02": {"upright": "천희성(天喜星) - 기쁜 일과 경사가 있습니다.", "reversed": "원진살(怨嗔殺) - 원한이나 갈등이 생깁니다."},
    "cups_03": {"upright": "복덕성(福德星) - 복과 덕이 쌓입니다.", "reversed": "도화살(桃花殺) - 이성 문제나 유혹이 있습니다."},
    "cups_04": {"upright": "화개성(華蓋星) - 예술과 학문에 재능이 있습니다.", "reversed": "고신살(孤辰殺) - 고독하거나 외롭습니다."},
    "cups_05": {"upright": "천의성(天醫星) - 치유와 회복의 운이 있습니다.", "reversed": "상문살(喪門殺) - 슬픔이나 상실이 있습니다."},
    "cups_06": {"upright": "문곡성(文曲星) - 문학과 예술에 재능이 있습니다.", "reversed": "과속살(寡宿殺) - 외롭거나 고독합니다."},
    "cups_07": {"upright": "천예성(天藝星) - 예술적 재능이 뛰어납니다.", "reversed": "암록살(暗祿殺) - 숨은 재물이나 비밀이 있습니다."},
    "cups_08": {"upright": "해신살(解神殺) - 어려움이 해소됩니다.", "reversed": "천라지망(天羅地網) - 막히고 답답합니다."},
    "cups_09": {"upright": "천복성(天福星) - 복록과 평안이 있습니다.", "reversed": "탈기살(奪氣殺) - 기운이 빠집니다."},
    "cups_10": {"upright": "천록성(天祿星) - 재물과 녹봉이 풍족합니다.", "reversed": "겁재살(劫財殺) - 재물 손실 주의가 필요합니다."},
    "cups_11": {"upright": "문창성(文昌星) - 학문과 지혜가 발달합니다.", "reversed": "공망살(空亡殺) - 노력이 헛됩니다."},
    "cups_12": {"upright": "천문성(天文星) - 지혜와 학문이 발달합니다.", "reversed": "암록살(暗祿殺) - 숨은 재물이나 비밀이 있습니다."},
    "cups_13": {"upright": "천덕성(天德星) - 하늘의 덕으로 평안합니다.", "reversed": "육해살(六害殺) - 해로움이나 방해가 있습니다."},
    "cups_14": {"upright": "월덕성(月德星) - 달의 덕으로 평안합니다.", "reversed": "원진살(怨嗔殺) - 원한이나 갈등이 생깁니다."},
    "swords_01": {"upright": "천관성(天官星) - 승진이나 명예가 있습니다.", "reversed": "형살(刑殺) - 법적 문제 주의가 필요합니다."},
    "swords_02": {"upright": "천권성(天權星) - 권력과 권위가 있습니다.", "reversed": "육해살(六害殺) - 해로움이나 방해가 있습니다."},
    "swords_03": {"upright": "천의성(天醫星) - 치유와 회복의 운이 있습니다.", "reversed": "사부살(死符殺) - 건강 주의가 필요합니다."},
    "swords_04": {"upright": "해신살(解神殺) - 어려움이 해소됩니다.", "reversed": "천라지망(天羅地網) - 막히고 답답합니다."},
    "swords_05": {"upright": "양인살(羊刃殺) - 강한 추진력이 있습니다.", "reversed": "백호살(白虎殺) - 다툼이나 갈등이 있습니다."},
    "swords_06": {"upright": "역마귀인(驛馬貴人) - 이동과 변화에 길합니다.", "reversed": "역마살(驛馬殺) - 불안정하고 분주합니다."},
    "swords_07": {"upright": "문창성(文昌星) - 학문과 지혜가 발달합니다.", "reversed": "겁살(劫殺) - 재물 손실이나 위험이 있습니다."},
    "swords_08": {"upright": "해신살(解神殺) - 속박에서 해방됩니다.", "reversed": "천라지망(天羅地網) - 갇히거나 막힙니다."},
    "swords_09": {"upright": "천의성(天醫星) - 치유와 회복이 있습니다.", "reversed": "질액살(疾厄殺) - 질병이나 건강 주의가 필요합니다."},
    "swords_10": {"upright": "해신살(解神殺) - 최악에서 벗어납니다.", "reversed": "대살(大殺) - 큰 어려움이나 재난이 있습니다."},
    "swords_11": {"upright": "천관성(天官星) - 명예와 정의가 있습니다.", "reversed": "형살(刑殺) - 법적 문제나 형벌 주의가 필요합니다."},
    "swords_12": {"upright": "천마성(天馬星) - 빠른 행동과 이동에 길합니다.", "reversed": "역마살(驛馬殺) - 분주하거나 불안정합니다."},
    "swords_13": {"upright": "천권성(天權星) - 권력과 결단력이 있습니다.", "reversed": "백호살(白虎殺) - 다툼이나 갈등이 있습니다."},
    "swords_14": {"upright": "장성(將星) - 리더십과 권위가 있습니다.", "reversed": "대살(大殺) - 큰 어려움 주의가 필요합니다."},
    "pentacles_01": {"upright": "천록성(天祿星) - 재물과 녹봉이 풍족합니다.", "reversed": "겁재살(劫財殺) - 재물 손실 주의가 필요합니다."},
    "pentacles_02": {"upright": "천복성(天福星) - 복록과 평안이 있습니다.", "reversed": "탈기살(奪氣殺) - 기운이 빠지거나 소진됩니다."},
    "pentacles_03": {"upright": "문창성(文昌星) - 기술과 지혜가 발달합니다.", "reversed": "공망살(空亡殺) - 노력이 헛되거나 공허합니다."},
    "pentacles_04": {"upright": "천고성(天庫星) - 재물을 모으고 보관합니다.", "reversed": "겁살(劫殺) - 재물 손실이나 위험이 있습니다."},
    "pentacles_05": {"upright": "천의성(天醫星) - 치유와 회복이 있습니다.", "reversed": "질액살(疾厄殺) - 질병이나 건강 주의가 필요합니다."},
    "pentacles_06": {"upright": "천덕성(天德星) - 덕으로 복을 받습니다.", "reversed": "육해살(六害殺) - 해로움이나 방해가 있습니다."},
    "pentacles_07": {"upright": "천록성(天祿星) - 장기적 재물운이 있습니다.", "reversed": "공망살(空亡殺) - 노력에 비해 성과가 없습니다."},
    "pentacles_08": {"upright": "문창성(文昌星) - 기술과 숙련이 발달합니다.", "reversed": "탈기살(奪氣殺) - 기운이 빠지거나 지칩니다."},
    "pentacles_09": {"upright": "천복성(天福星) - 풍요와 복록이 있습니다.", "reversed": "고신살(孤辰殺) - 외롭거나 고독합니다."},
    "pentacles_10": {"upright": "천록성(天祿星) - 대대로 재물과 복이 이어집니다.", "reversed": "겁재살(劫財殺) - 재산 분쟁이나 손실이 있습니다."},
    "pentacles_11": {"upright": "문창성(文昌星) - 학습과 기술 습득에 길합니다.", "reversed": "공망살(空亡殺) - 배워도 성과가 없습니다."},
    "pentacles_12": {"upright": "천고성(天庫星) - 꾸준히 재물을 모읍니다.", "reversed": "겁살(劫殺) - 재물 손실 주의가 필요합니다."},
    "pentacles_13": {"upright": "천록성(天祿星) - 안정적인 재물운이 있습니다.", "reversed": "탈기살(奪氣殺) - 기운이 빠지거나 소진됩니다."},
    "pentacles_14": {"upright": "천부성(天富星) - 큰 재물과 부를 이룹니다.", "reversed": "겁재살(劫財殺) - 재물 손실이나 탐욕 주의가 필요합니다."},
}

print(f"[OK] sinsal 데이터 생성 완료: {len(sinsal_data)} 장")

# sinsal 추가
print("\n[3/4] 카드에 sinsal 추가 중...")
count = 0
for card_id, sinsal in sinsal_data.items():
    if card_id in data["meanings"]:
        if "upright" in data["meanings"][card_id]:
            data["meanings"][card_id]["upright"]["sinsal"] = sinsal["upright"]
        if "reversed" in data["meanings"][card_id]:
            data["meanings"][card_id]["reversed"]["sinsal"] = sinsal["reversed"]
        count += 1

print(f"[OK] sinsal 추가 완료: {count} 장")

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
print(f"[OK] sinsal 추가: {count} 장")

print("\n" + "=" * 60)
print("[완료] sinsal (신살) 카테고리 추가 작업 완료!")
print("=" * 60)

