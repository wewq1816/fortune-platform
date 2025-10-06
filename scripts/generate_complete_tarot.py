# -*- coding: utf-8 -*-
"""
타로 카드 78장 완전한 데이터 생성
메이저 아르카나 22장 + 마이너 아르카나 56장
"""

import json
from pathlib import Path

# 저장 경로
OUTPUT_FILE = Path(r"C:\xampp\htdocs\mysite\운세플랫폼\engines\data\tarot-cards-complete.json")
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

# 메이저 아르카나 22장 완전한 데이터
MAJOR_ARCANA_DATA = [
    {
        "id": "major_00", "number": 0, "name": "The Fool", "name_ko": "바보",
        "image": "/images/tarot/00-TheFool.png",
        "keywords_upright": ["새로운 시작", "순수함", "자유", "모험", "순진무구"],
        "keywords_reversed": ["무모함", "경솔함", "리스크", "준비 부족", "방황"],
        "meaning_upright": "새로운 여정의 시작입니다. 두려움 없이 앞으로 나아가세요. 순수한 마음으로 세상을 바라보며, 모험을 즐기는 시기입니다.",
        "meaning_reversed": "무모한 결정이나 준비 없는 행동을 조심하세요. 현실을 직시하지 못하고 있거나, 경솔한 선택으로 인해 어려움을 겪을 수 있습니다."
    },
    {
        "id": "major_01", "number": 1, "name": "The Magician", "name_ko": "마법사",
        "image": "/images/tarot/01-TheMagician.png",
        "keywords_upright": ["창조력", "의지력", "기술", "자원 활용", "실행력"],
        "keywords_reversed": ["조작", "속임수", "재능 낭비", "우유부단", "무기력"],
        "meaning_upright": "목표를 이룰 모든 도구와 능력이 있습니다. 창조적 에너지가 넘치고 의지력이 강한 시기입니다.",
        "meaning_reversed": "재능을 낭비하거나 능력을 잘못된 방향으로 사용하고 있습니다. 진정한 목적을 재확인하세요."
    },
