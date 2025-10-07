import requests
import json

# 꿈해몽 API 테스트 (가장 간단)
print("=" * 70)
print("[TEST] Dream API")
print("=" * 70)

url = "http://localhost:3000/api/dream"
params = {"q": "뱀"}

print("\n[REQUEST] GET", url)
print("params:", params)

try:
    response = requests.get(url, params=params, timeout=10)
    
    print(f"\n[STATUS] {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\n[SUCCESS]")
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(f"\n[ERROR] {response.text}")
        
except Exception as e:
    print(f"\n[EXCEPTION] {e}")

print("\n" + "=" * 70)
