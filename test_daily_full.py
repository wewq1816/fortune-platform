import requests
import json

# 오늘의 운세 API 테스트 - 전체 응답 확인
print("=" * 70)
print("[TEST] Daily Fortune API - Full Response")
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
    print("\n[Calling Claude API...]")
    response = requests.post(url, json=data, timeout=30)
    
    print(f"\n[STATUS] {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        
        print("\n" + "=" * 70)
        print("[FULL RESPONSE]")
        print("=" * 70)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        print("\n" + "=" * 70)
        print("[SUCCESS] Claude API is working!")
        print("=" * 70)
        
        # 비용 확인
        if 'cost' in result:
            print(f"\nAPI Cost: ${result['cost']}")
        
    else:
        print(f"\n[ERROR] {response.text}")
        
except Exception as e:
    print(f"\n[EXCEPTION] {e}")

print("\n" + "=" * 70)
