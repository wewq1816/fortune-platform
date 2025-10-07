import requests
import json

# Tarot API - Claude API 호출 테스트
print("=" * 70)
print("[TEST] Tarot API - Claude AI Integration")
print("=" * 70)

# 1단계: 타로 세션 시작
print("\n[STEP 1] Start Tarot Session")
url_start = "http://localhost:3000/api/tarot/start"
data_start = {"category": "love"}

response = requests.post(url_start, json=data_start, timeout=10)
print(f"Status: {response.status_code}")

if response.status_code != 200:
    print(f"ERROR: {response.text}")
    exit(1)

result = response.json()
print(json.dumps(result, indent=2, ensure_ascii=False))

session_id = result['sessionId']
cards = result['cards']

print(f"\nSession ID: {session_id}")
print(f"Available Cards: {len(cards)}")

# 2단계: 카드 5장 선택
print("\n[STEP 2-6] Select 5 Cards")
url_next = "http://localhost:3000/api/tarot/next"

for i in range(5):
    selected_card = cards[0]  # 첫 번째 카드 선택
    data_next = {
        "sessionId": session_id,
        "selectedCard": selected_card
    }
    
    response = requests.post(url_next, json=data_next, timeout=10)
    print(f"\nRound {i+1} Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"ERROR: {response.text}")
        exit(1)
    
    result = response.json()
    
    if 'finished' in result and result['finished']:
        print("Selection Complete!")
        break
    else:
        cards = result['cards']
        print(f"Selected: {selected_card['name']}")
        print(f"Remaining: {len(cards)} cards")

# 3단계: Claude AI 해석
print("\n[STEP 7] Get Claude AI Interpretation")
url_interpret = "http://localhost:3000/api/tarot/interpret"
data_interpret = {"sessionId": session_id}

response = requests.post(url_interpret, json=data_interpret, timeout=30)
print(f"Status: {response.status_code}")

if response.status_code != 200:
    print(f"ERROR: {response.text}")
    exit(1)

result = response.json()

print("\n[SUCCESS]")
print(f"\nCategory: {result.get('category', 'N/A')}")
print(f"Selected Cards: {len(result.get('selectedCards', []))}")

if 'interpretation' in result:
    print("\n[CLAUDE AI INTERPRETATION]")
    print(result['interpretation'][:500] + "...")  # 처음 500자만 출력

if 'usage' in result:
    print(f"\n[USAGE]")
    print(f"Input Tokens: {result['usage']['input_tokens']}")
    print(f"Output Tokens: {result['usage']['output_tokens']}")

print("\n" + "=" * 70)
