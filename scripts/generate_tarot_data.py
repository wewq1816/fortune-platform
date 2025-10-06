# -*- coding: utf-8 -*-
"""
타로 카드 78장 기본 데이터 생성 스크립트
각 카드의 기본 정보, 키워드, 의미를 JSON으로 생성
"""

import json
from pathlib import Path

# 저장 경로
OUTPUT_DIR = Path(r"C:\xampp\htdocs\mysite\운세플랫폼\engines\data")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 메이저 아르카나 22장 데이터
MAJOR_ARCANA = [
    {
        "id": "major_00",
        "number": 0,
        "name": "The Fool",
        "name_ko": "바보",
        "arcana_type": "major",
        "image": "/images/tarot/00-TheFool.png",
        "keywords_upright": ["새로운 시작", "순수함", "자유", "모험", "순진무구"],
        "keywords_reversed": ["무모함", "경솔함", "리스크", "준비 부족", "방황"],
        "meaning_upright": "새로운 여정의 시작입니다. 두려움 없이 앞으로 나아가세요. 순수한 마음으로 세상을 바라보며, 모험을 즐기는 시기입니다. 자유롭고 제약 없는 선택이 가능합니다.",
        "meaning_reversed": "무모한 결정이나 준비 없는 행동을 조심하세요. 현실을 직시하지 못하고 있거나, 경솔한 선택으로 인해 어려움을 겪을 수 있습니다. 신중함이 필요한 시기입니다.",
        "element": "Air",
        "astrology": "Uranus",
        "symbols": ["절벽", "개", "보따리", "태양", "하얀 장미", "산"]
    },
    {
        "id": "major_01",
        "number": 1,
        "name": "The Magician",
        "name_ko": "마법사",
        "arcana_type": "major",
        "image": "/images/tarot/01-TheMagician.png",
        "keywords_upright": ["창조력", "의지력", "기술", "자원 활용", "실행력"],
        "keywords_reversed": ["조작", "속임수", "재능 낭비", "우유부단", "무기력"],
        "meaning_upright": "당신에게는 목표를 이룰 모든 도구와 능력이 있습니다. 창조적 에너지가 넘치고 의지력이 강한 시기입니다. 계획을 실행에 옮기고 자원을 효과적으로 활용하세요.",
        "meaning_reversed": "재능을 낭비하거나 능력을 잘못된 방향으로 사용하고 있습니다. 타인을 조종하려 들거나 자신을 속이고 있을 수 있습니다. 진정한 목적을 재확인하세요.",
        "element": "Air",
        "astrology": "Mercury",
        "symbols": ["무한대 기호", "지팡이", "4원소", "장미", "백합", "뱀"]
    },
    {
        "id": "major_02",
        "number": 2,
        "name": "The High Priestess",
        "name_ko": "여사제",
        "arcana_type": "major",
        "image": "/images/tarot/02-TheHighPriestess.png",
        "keywords_upright": ["직관", "잠재의식", "신비", "내면의 지혜", "비밀"],
        "keywords_reversed": ["무시된 직관", "표면적 지식", "감춰진 동기", "비밀의 폭로"],
