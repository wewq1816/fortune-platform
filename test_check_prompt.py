import requests
import json

# 실제 API 호출 - 프롬프트 확인용
print("=" * 70)
print("[TEST] Daily Fortune - Check Prompt")
print("=" * 70)

# 사용자가 입력할 것으로 예상되는 데이터
data = {
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 10,
    "isLunar": False
}

print("\n[REQUEST DATA]")
print(json.dumps(data, indent=2))

try:
    print("\n[Calling API...]")
    response = requests.post(
        "http://localhost:3000/api/daily-fortune",
        json=data,
        timeout=30
    )
    
    print(f"\n[Response Status] {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        
        print("\n" + "=" * 70)
        print("[RESULT]")
        print("=" * 70)
        
        # 사주 정보
        print("\n[SAJU INFO]")
        print(json.dumps(result.get('saju', {}), indent=2, ensure_ascii=False))
        
        # 오늘 정보
        print("\n[TODAY INFO]")
        print(json.dumps(result.get('today', {}), indent=2, ensure_ascii=False))
        
        # 오행 관계
        print(f"\n[RELATIONSHIP]")
        print(f"Type: {result.get('relationship', 'N/A')}")
        print(f"Score: {result.get('score', 0)}/100")
        print(f"Level: {result.get('level', 'N/A')}")
        
        # Claude AI 응답
        print("\n" + "=" * 70)
        print("[CLAUDE AI RESPONSE]")
        print("=" * 70)
        fortune = result.get('fortune', {})
        
        for key, value in fortune.items():
            print(f"\n[{key}]")
            print(value)
        
        # 비용
        print(f"\n" + "=" * 70)
        print(f"[API COST] ${result.get('cost', '0')}")
        print("=" * 70)
        
    else:
        print(f"\n[ERROR] {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"\n[EXCEPTION] {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)
