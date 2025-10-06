# 🎯 운세 플랫폼 사용자 정보 표시 통일 가이드

**작성일**: 2025-01-06  
**목적**: 8개 페이지의 사용자 정보를 타로카드처럼 "풀로 다 보이게" 통일

---

## 📋 수정 대상 파일 (7개)

### ✅ 건너뛰기
- `tarot-test.html` - 사용자 정보 표시 없음

### 🔄 수정 필요
1. `daily-fortune-test.html` (오늘의 운세)
2. `saju-test.html` + `saju-main.js` (사주팔자) 
3. `horoscope.html` (별자리 운세)
4. `dream.html` (꿈해몽)
5. `compatibility-test.html` (궁합 테스트)
6. `tojeong-test.html` (토정비결)
7. `lotto.html` (로또 번호)

---

## 🎨 통일된 표시 형식 (타로카드 스타일)

```
남성 1993. 4. 16 (음력(평달)) 태어난 시간 : 未(13:31~15:30)
```

**핵심**: localStorage에서 읽어온 **모든 정보를 전부 표시**

---

## 📝 파일별 수정 방법

### **1️⃣ 오늘의 운세 (daily-fortune-test.html)**

#### 📍 파일 위치
```
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\daily-fortune-test.html
```

#### 🔍 찾을 코드 (약 382번째 줄)
```javascript
const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType})`;
```

#### ✅ 바꿀 코드
```javascript
const display = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`;
```

---

### **2️⃣ 사주팔자 (saju-main.js)**

#### 📍 파일 위치
```
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\saju-main.js
```

#### ✅ 상태
**이미 완벽함!** 수정 불필요

#### 현재 코드 (참고용)
```javascript
display.textContent = `${savedData.gender} ${savedData.year}. ${savedData.month}. ${savedData.day} (${savedData.calendarType}) ${savedData.birthTime}`;
```

---

### **3️⃣ 별자리 운세 (horoscope.html)**

#### 📍 파일 위치
```
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\horoscope.html
```

#### 🔍 찾을 코드
JavaScript `<script>` 태그 내부에서 다음을 찾으세요:
```javascript
function loadUserInfo() {
  const data = localStorage.getItem('fortuneUserData');
  if (data) {
    const parsed = JSON.parse(data);
    // 이 부분에서 userInfoDisplay 업데이트하는 코드 찾기
    document.getElementById('userInfoDisplay').textContent = `${parsed.gender} ${parsed.year}. ${parsed.month}. ${parsed.day}`;
  }
}
```

#### ✅ 바꿀 코드
```javascript
document.getElementById('userInfoDisplay').textContent = `${parsed.gender} ${parsed.year}. ${parsed.month}. ${parsed.day} (${parsed.calendarType}) 태어난 시간 : ${parsed.birthTime}`;
```

---

### **4️⃣ 꿈해몽 (dream.html)**

#### 📍 파일 위치
```
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\dream.html
```

#### ⚠️ 특이사항
꿈해몽은 사용자 정보가 **필요 없을 수 있음** (꿈 내용만 입력)

#### 🔍 확인 방법
1. `dream.html` 파일 열기
2. `userInfoDisplay` 또는 `loadUserInfo` 검색
3. 있으면 아래와 같이 수정

#### ✅ 수정 (있는 경우만)
```javascript
// 있다면 이렇게 수정
document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`;
```

---

### **5️⃣ 궁합 테스트 (compatibility-test.html)**

#### 📍 파일 위치
```
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\compatibility-test.html
```

#### 🔍 찾을 코드
궁합은 **두 사람의 정보**를 표시합니다:
```javascript
// 사용자 1
const display1 = `${person1.gender} ${person1.year}. ${person1.month}. ${person1.day}`;

// 사용자 2  
const display2 = `${person2.gender} ${person2.year}. ${person2.month}. ${person2.day}`;
```

#### ✅ 바꿀 코드
```javascript
// 사용자 1
const display1 = `${person1.gender} ${person1.year}. ${person1.month}. ${person1.day} (${person1.calendarType}) 태어난 시간 : ${person1.birthTime}`;

// 사용자 2
const display2 = `${person2.gender} ${person2.year}. ${person2.month}. ${person2.day} (${person2.calendarType}) 태어난 시간 : ${person2.birthTime}`;

// 또는 한 줄로 표시
const display = `${person1.gender} ${person1.year}. ${person1.month}. ${person1.day} (${person1.calendarType}) 태어난 시간 : ${person1.birthTime} ♥ ${person2.gender} ${person2.year}. ${person2.month}. ${person2.day} (${person2.calendarType}) 태어난 시간 : ${person2.birthTime}`;
```

---

### **6️⃣ 토정비결 (tojeong-test.html)**

#### 📍 파일 위치
```
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\tojeong-test.html
```

#### 🔍 찾을 코드
JavaScript `<script>` 태그 내부:
```javascript
function loadUserInfo() {
  // ...
  document.getElementById('userInfoDisplay').textContent = `${data.year}. ${data.month}. ${data.day}`;
}
```

#### ✅ 바꿀 코드
```javascript
document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`;
```

---

### **7️⃣ 로또 번호 (lotto.html)**

#### 📍 파일 위치
```
C:\xampp\htdocs\mysite\운세플랫폼\frontend\pages\lotto.html
```

#### 🔍 찾을 코드
```javascript
function loadUserInfo() {
  // ...
  document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day}`;
}
```

#### ✅ 바꿀 코드
```javascript
document.getElementById('userInfoDisplay').textContent = `${data.gender} ${data.year}. ${data.month}. ${data.day} (${data.calendarType}) 태어난 시간 : ${data.birthTime}`;
```

---

## 🔍 수정 방법 (단계별)

### **방법 1: VS Code 사용**

1. VS Code에서 파일 열기
2. `Ctrl + F` (찾기)
3. 위의 "찾을 코드" 복사 → 붙여넣기
4. 찾아진 부분을 "바꿀 코드"로 수정
5. `Ctrl + S` (저장)

### **방법 2: 메모장 사용**

1. 메모장에서 파일 열기
2. `Ctrl + H` (바꾸기)
3. "찾을 내용"에 옛날 코드 입력
4. "바꿀 내용"에 새 코드 입력
5. "모두 바꾸기" 클릭
6. 저장

---

## ✅ 수정 완료 확인

각 HTML 파일을 브라우저에서 열어서 확인:

### **예상 결과**
```
여성 1993. 4. 16 (음력(평달)) 태어난 시간 : 未(13:31~15:30)
```

### **만약 에러가 나면**
- `data.birthTime`이 `undefined`일 수 있음
- localStorage에 `birthTime` 저장 확인 필요

---

## 📊 수정 체크리스트

```
[ ] 1. daily-fortune-test.html (오늘의 운세)
[✅] 2. saju-main.js (사주팔자) - 이미 완벽
[ ] 3. horoscope.html (별자리 운세)
[ ] 4. dream.html (꿈해몽) - 확인 필요
[ ] 5. compatibility-test.html (궁합)
[ ] 6. tojeong-test.html (토정비결)
[ ] 7. lotto.html (로또)
```

---

## ⚠️ 주의사항

1. **백업 필수**: 수정 전 파일 복사해두기
2. **인코딩**: UTF-8로 저장 (한글 깨짐 방지)
3. **괄호**: 백틱(`)과 중괄호({}) 정확히 입력
4. **태어난 시간**: 공백과 콜론(:) 정확히 입력

---

## 🎯 최종 확인

모든 파일 수정 후 각 페이지 테스트:

1. 메인 페이지에서 사주 정보 입력
2. 각 운세 페이지 이동
3. 사용자 정보 표시 확인

**통일된 형식**:
```
남성 1993. 4. 16 (음력(평달)) 태어난 시간 : 未(13:31~15:30)
```

---

**완료 후 이 문서는 삭제하거나 docs/ 폴더로 이동하세요!**
