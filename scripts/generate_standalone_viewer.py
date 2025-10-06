import json

# JSON 데이터 읽기
with open(r'C:\xampp\htdocs\mysite\운세플랫폼\engines\data\tarot-cards-complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 이미지 경로 수정
for card in data['cards']:
    # /images/tarot/ -> ../public/images/tarot/
    card['image'] = card['image'].replace('/images/tarot/', '../public/images/tarot/')

# HTML 템플릿 (이미지 포함 버전)
html = '''<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>타로 카드 뷰어 - 78장</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Noto Sans KR', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin-bottom: 30px; text-align: center; }
        .header h1 { color: #667eea; font-size: 2.5em; margin-bottom: 10px; }
        .header p { color: #666; font-size: 1.1em; }
        .stats { display: flex; justify-content: center; gap: 30px; margin-top: 20px; }
        .stat-item { text-align: center; }
        .stat-item .number { font-size: 2em; font-weight: bold; color: #667eea; }
        .stat-item .label { color: #999; font-size: 0.9em; }
        .filters { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 30px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .filter-btn { padding: 10px 25px; border: 2px solid #667eea; background: white; color: #667eea; border-radius: 25px; cursor: pointer; font-size: 1em; font-weight: 500; transition: all 0.3s ease; }
        .filter-btn:hover { background: #667eea; color: white; transform: translateY(-2px); }
        .filter-btn.active { background: #667eea; color: white; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; margin-bottom: 50px; }
        .card-item { background: white; border-radius: 15px; padding: 15px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .card-item:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
        .card-item img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 10px; background: #f0f0f0; }
        .card-name { font-weight: bold; color: #333; margin-bottom: 5px; text-align: center; font-size: 0.9em; }
        .card-name-ko { color: #999; font-size: 0.85em; text-align: center; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto; }
        .modal.active { display: flex; justify-content: center; align-items: center; }
        .modal-content { background: white; border-radius: 20px; padding: 40px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative; }
        .close-btn { position: absolute; top: 20px; right: 20px; background: #ff4757; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.5em; }
        .modal-card-image { width: 100%; max-width: 300px; height: 400px; object-fit: cover; margin: 0 auto 30px; display: block; border-radius: 15px; background: #f0f0f0; }
        .modal-title { font-size: 2em; color: #667eea; margin-bottom: 5px; text-align: center; }
        .modal-subtitle { font-size: 1.2em; color: #999; margin-bottom: 30px; text-align: center; }
        .meaning-section { margin-bottom: 30px; }
        .meaning-section h3 { color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #667eea; }
        .keywords { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px; }
        .keyword-tag { background: #f0f0f0; padding: 5px 15px; border-radius: 15px; font-size: 0.9em; color: #666; }
        .meaning-text { color: #555; line-height: 1.8; font-size: 1.05em; }
        .upright { color: #27ae60; }
        .reversed { color: #e74c3c; }
        .note { background: #d4edda; border: 1px solid #28a745; border-radius: 10px; padding: 15px; margin: 20px 0; text-align: center; color: #155724; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎴 타로 카드 뷰어</h1>
            <p>Rider-Waite Tarot - 78장 전체</p>
            <div class="note">✅ 서버 없이 바로 실행 가능! (이미지 포함)</div>
            <div class="stats">
                <div class="stat-item"><div class="number">78</div><div class="label">전체 카드</div></div>
                <div class="stat-item"><div class="number">22</div><div class="label">메이저 아르카나</div></div>
                <div class="stat-item"><div class="number">56</div><div class="label">마이너 아르카나</div></div>
            </div>
        </div>
        <div class="filters">
            <button class="filter-btn active" data-filter="all">전체 (78장)</button>
            <button class="filter-btn" data-filter="major">메이저 아르카나</button>
            <button class="filter-btn" data-filter="wands">완드</button>
            <button class="filter-btn" data-filter="cups">컵</button>
            <button class="filter-btn" data-filter="swords">소드</button>
            <button class="filter-btn" data-filter="pentacles">펜타클</button>
        </div>
        <div class="cards-grid" id="cardsGrid"></div>
    </div>
    <div class="modal" id="modal">
        <div class="modal-content">
            <button class="close-btn" onclick="closeModal()">&times;</button>
            <img class="modal-card-image" id="modalImage" src="" alt="">
            <h2 class="modal-title" id="modalTitle"></h2>
            <p class="modal-subtitle" id="modalSubtitle"></p>
            <div class="meaning-section">
                <h3 class="upright">✅ 정방향 (Upright)</h3>
                <div class="keywords" id="keywordsUpright"></div>
                <p class="meaning-text" id="meaningUpright"></p>
            </div>
            <div class="meaning-section">
                <h3 class="reversed">🔄 역방향 (Reversed)</h3>
                <div class="keywords" id="keywordsReversed"></div>
                <p class="meaning-text" id="meaningReversed"></p>
            </div>
        </div>
    </div>
    <script>
        const allCards = ''' + json.dumps(data['cards'], ensure_ascii=False) + ''';
        
        function displayCards(cards) {
            const grid = document.getElementById('cardsGrid');
            grid.innerHTML = '';
            cards.forEach(card => {
                const div = document.createElement('div');
                div.className = 'card-item';
                div.innerHTML = `<img src="${card.image}" alt="${card.name}" onerror="this.style.display='none'"><div class="card-name">${card.name}</div><div class="card-name-ko">${card.name_ko}</div>`;
                div.onclick = () => showCardDetail(card);
                grid.appendChild(div);
            });
        }

        function showCardDetail(card) {
            document.getElementById('modalImage').src = card.image;
            document.getElementById('modalTitle').textContent = card.name;
            document.getElementById('modalSubtitle').textContent = card.name_ko;
            
            const ku = document.getElementById('keywordsUpright');
            ku.innerHTML = '';
            card.keywords_upright.forEach(k => {
                const tag = document.createElement('span');
                tag.className = 'keyword-tag';
                tag.textContent = k;
                ku.appendChild(tag);
            });

            const kr = document.getElementById('keywordsReversed');
            kr.innerHTML = '';
            card.keywords_reversed.forEach(k => {
                const tag = document.createElement('span');
                tag.className = 'keyword-tag';
                tag.textContent = k;
                kr.appendChild(tag);
            });

            document.getElementById('meaningUpright').textContent = card.meaning_upright;
            document.getElementById('meaningReversed').textContent = card.meaning_reversed;
            document.getElementById('modal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('modal').classList.remove('active');
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;
                let filtered = allCards;
                if (filter === 'major') filtered = allCards.filter(c => c.arcana_type === 'major');
                else if (filter !== 'all') filtered = allCards.filter(c => c.suit === filter);
                displayCards(filtered);
            });
        });

        document.getElementById('modal').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        // 초기 로드
        displayCards(allCards);
    </script>
</body>
</html>'''

# HTML 파일 저장
output_path = r'C:\xampp\htdocs\mysite\운세플랫폼\frontend\타로카드뷰어.html'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("OK! Generated:", output_path)
print("Total cards:", len(data['cards']))
