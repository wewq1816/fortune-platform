# 🎯 꿈해몽 DB 2,000개 생성 - 간단 명령서

**프로젝트**: C:\xampp\htdocs\mysite\운세플랫폼\  
**작업**: 꿈해몽 DB 2,000개 생성  
**우선순위**: 최우선 🔥

---

## 📋 **만들어야 할 것**

### **1. 생성 스크립트**
```
파일: scripts/generate-dream-db.js
역할: 2,000개 꿈 데이터 자동 생성
```

### **2. 꿈 DB**
```
파일: engines/data/dream-db.json
내용: 2,000개 꿈 해석 데이터
```

---

## 📊 **DB 구조**

```json
[
  {
    "id": 1,
    "category": "동물",
    "title": "뱀이 나오는 꿈",
    "keywords": ["뱀", "구렁이", "큰뱀", "작은뱀", "독사"],
    "meaning": "재물, 지혜, 변화",
    "fortune_type": "길몽",
    "interpretation": "뱀은 동양에서 재물운과 지혜를 상징합니다. 큰 뱀이 나타나면 큰 재물운이 들어올 징조이며, 작은 뱀은 작은 행운을 의미합니다. 뱀에게 물리는 꿈은 건강 문제를 암시할 수 있으니 주의가 필요합니다.",
    "related_ids": [2, 5, 12],
    "created_at": "2025-10-02"
  }
]
```

---

## 📁 **카테고리별 개수**

```
총 2,000개

1. 동물 - 300개
2. 자연 - 300개
3. 사람 - 300개
4. 음식 - 300개
5. 건물 - 300개
6. 교통 - 200개
7. 기타 - 300개
```

---

## 🔧 **각 필드 설명**

```
id              : 1~2000 고유 번호
category        : 7개 중 1개
title           : 꿈 제목 (예: "뱀이 나오는 꿈")
keywords        : 검색용 키워드 5~10개
meaning         : 핵심 의미 한 줄
fortune_type    : 길몽/흉몽/중립
interpretation  : 해석 150~200자
related_ids     : 관련 꿈 3~5개
created_at      : 생성 날짜
```

---

## 🎯 **목적**

### **왜 DB를 만드는가?**
```
싼 Claude Haiku API의 지식 베이스!

사용자: "뱀이 용을 잡아먹는 꿈"
    ↓
시스템: DB에서 "뱀=재물, 용=권력" 찾기
    ↓
AI: DB 지식 참고해서 해석
    ↓
결과: 정확하고 빠른 답변!

비용 절감: Opus $15 → Haiku $0.25 (60배!)
```

---

## ✅ **완료 조건**

```
[ ] scripts/generate-dream-db.js 생성 완료
[ ] engines/data/dream-db.json 생성 완료
[ ] 총 2,000개 꿈 확인
[ ] 카테고리별 개수 맞음
[ ] 모든 필드 정상
[ ] JSON 형식 오류 없음
[ ] 한글 정상 (UTF-8)
```

---

## 🚀 **시작 명령**

다른 Claude 창에 이렇게 말하세요:

```
"C:\xampp\htdocs\mysite\운세플랫폼\ 에서 
꿈해몽 DB 2,000개를 생성해줘.

docs/꿈해몽_DB_생성_명령서.md 파일을 읽고 
scripts/generate-dream-db.js 스크립트를 만들어서
engines/data/dream-db.json 파일을 생성해줘."
```

---

## 📝 **참고 문서**

상세 내용은 여기:
```
C:\xampp\htdocs\mysite\운세플랫폼\docs\꿈해몽_DB_생성_명령서.md
```

---

**끝!** 🎯
