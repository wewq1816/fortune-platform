# -*- coding: utf-8 -*-
"""
타로 카드 이미지 다운로드 스크립트
Internet Archive에서 Rider-Waite 타로 78장 다운로드
"""

import requests
import os
from pathlib import Path
import time

# 저장 경로
SAVE_DIR = Path(r"C:\xampp\htdocs\mysite\운세플랫폼\public\images\tarot")
SAVE_DIR.mkdir(parents=True, exist_ok=True)

# Internet Archive 기본 URL
BASE_URL = "https://archive.org/download/rider-waite-tarot"

# 메이저 아르카나 22장
MAJOR_ARCANA = [
    "major_arcana_fool",
    "major_arcana_magician",
    "major_arcana_high_priestess",
    "major_arcana_empress",
    "major_arcana_emperor",
    "major_arcana_hierophant",
    "major_arcana_lovers",
    "major_arcana_chariot",
    "major_arcana_strength",
    "major_arcana_hermit",
    "major_arcana_wheel_of_fortune",
    "major_arcana_justice",
    "major_arcana_hanged_man",
    "major_arcana_death",
    "major_arcana_temperance",
    "major_arcana_devil",
    "major_arcana_tower",
    "major_arcana_star",
    "major_arcana_moon",
    "major_arcana_sun",
    "major_arcana_judgement",
    "major_arcana_world"
]

# 마이너 아르카나 56장
SUITS = ["wands", "cups", "swords", "pentacles"]
RANKS = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 
         "page", "knight", "queen", "king"]

def download_image(url, save_path):
    """이미지 다운로드"""
    try:
        print("Downloading: {}".format(save_path.name))
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open(save_path, 'wb') as f:
            f.write(response.content)
        
        print("OK: {}".format(save_path.name))
        return True
    except Exception as e:
        print("FAIL: {} - {}".format(save_path.name, e))
        return False

def main():
    """메인 함수"""
    total = 0
    success = 0
    
    print("=" * 60)
    print("Tarot Card Image Download Started")
    print("=" * 60)
    
    # 1. 메이저 아르카나 다운로드
    print("\nDownloading {} Major Arcana cards...".format(len(MAJOR_ARCANA)))
    for idx, card in enumerate(MAJOR_ARCANA):
        url = "{}/{}.png".format(BASE_URL, card)
        save_path = SAVE_DIR / "{:02d}_{}.png".format(idx, card.replace('major_arcana_', ''))
        
        total += 1
        if download_image(url, save_path):
            success += 1
        
        time.sleep(0.5)
    
    # 2. 마이너 아르카나 다운로드
    print("\nDownloading {} Minor Arcana cards...".format(len(SUITS) * len(RANKS)))
    for suit in SUITS:
        for rank in RANKS:
            card_name = "{}_{}".format(suit, rank)
            url = "{}/{}.png".format(BASE_URL, card_name)
            save_path = SAVE_DIR / "{}.png".format(card_name)
            
            total += 1
            if download_image(url, save_path):
                success += 1
            
            time.sleep(0.5)
    
    # 결과 출력
    print("\n" + "=" * 60)
    print("Download Complete!")
    print("Success: {}/{}".format(success, total))
    print("Failed: {}".format(total - success))
    print("Saved to: {}".format(SAVE_DIR))
    print("=" * 60)

if __name__ == "__main__":
    main()
