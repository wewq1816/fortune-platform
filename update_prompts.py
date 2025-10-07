import os

# 사주 프롬프트 파일들 일괄 수정
prompt_dir = r'C:\xampp\htdocs\mysite\운세플랫폼\backend\prompts\saju'

files = [
    'personality-prompt.js', 'daeun-prompt.js', 'career-prompt.js',
    'study-prompt.js', 'promotion-prompt.js', 'move-prompt.js',
    'travel-prompt.js', 'parents-prompt.js', 'siblings-prompt.js',
    'children-prompt.js', 'spouse-prompt.js', 'social-prompt.js',
    'aptitude-prompt.js', 'job-recommend-prompt.js', 'business-prompt.js',
    'sinsal-prompt.js', 'taekil-prompt.js'
]

for filename in files:
    filepath = os.path.join(prompt_dir, filename)
    
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 100~150자 → 100~350자로 변경
        content = content.replace('100~150자로 간단명료하게', '100~350자로 자세하게')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'OK {filename} 수정 완료')
    else:
        print(f'ERROR {filename} 파일 없음')

print('\n완료!')
