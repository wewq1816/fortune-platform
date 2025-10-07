import requests
import json

# 오늘의 운세 API 테스트 (Claude API 연동)
print("=" * 70)
print("[TEST] Daily Fortune API - Real Claude API")
print("=" * 70)

url = "http://localhost:3000/api/daily-fortune"
data = {
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 10,
    "isLunar": False
}

print("\n[REQUEST]")
print(json.dumps(data, indent=2))

try:
    print("\n[Calling API...]")
    response = requests.post(url, json=data, timeout=30)
    
    print(f"\n[STATUS] {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        
        print("\n" + "=" * 70)
        print("[SUCCESS] Claude API Working!")
        print("=" * 70)
        
        # 사주 정보
        if 'saju' in result:
            print("\n[SAJU INFO]")
            print(f"Year: {result['saju'].get('year', 'N/A')}")
            print(f"Month: {result['saju'].get('month', 'N/A')}")
            print(f"Day: {result['saju'].get('day', 'N/A')}")
            print(f"Hour: {result['saju'].get('hour', 'N/A')}")
        
        # 오늘 정보
        if 'today' in result:
            print(f"\n[TODAY]")
            print(f"Date: {result['today'].get('date', 'N/A')}")
            print(f"Ganzi: {result['today'].get('ganzi', 'N/A')}")
        
        # 오행 관계
        if 'relationship' in result:
            print(f"\n[ELEMENT RELATIONSHIP]")
            print(f"Type: {result['relationship'].get('type', 'N/A')}")
            print(f"Description: {result['relationship'].get('description', 'N/A')}")
        
        # 운세 점수
        if 'score' in result:
            print(f"\n[FORTUNE SCORE]")
            print(f"Score: {result['score']}/100")
            print(f"Level: {result.get('level', 'N/A')}")
        
        # Claude AI 해석
        if 'fortune' in result:
            print("\n" + "=" * 70)
            print("[CLAUDE AI INTERPRETATION]")
            print("=" * 70)
            fortune = result['fortune']
            
            # JSON 형식인 경우
            if isinstance(fortune, dict):
                for key, value in fortune.items():
                    print(f"\n[{key}]")
                    print(value)
            else:
                print(fortune)
        
        # 비용
        if 'cost' in result:
            print(f"\n" + "=" * 70)
            print(f"[COST] ${result['cost']}")
            print("=" * 70)
        
    else:
        print(f"\n[ERROR] {response.text}")
        
except requests.exceptions.Timeout:
    print("\n[TIMEOUT] API call took too long (>30s)")
except Exception as e:
    print(f"\n[EXCEPTION] {e}")

print("\n" + "=" * 70)
