const lunar = require('lunar-javascript');

console.log('lunar-javascript API 상세 테스트\n');

// Solar 객체로 시작
const solar = lunar.Solar.fromYmd(2025, 1, 1);
const lunarDate = solar.getLunar();

console.log('=== Lunar 객체 ===');
console.log('getYear():', lunarDate.getYear());
console.log('getMonth():', lunarDate.getMonth());
console.log('getDay():', lunarDate.getDay());

console.log('\n=== 간지 (한자) ===');
console.log('getYearInGanZhi():', lunarDate.getYearInGanZhi());
console.log('getMonthInGanZhi():', lunarDate.getMonthInGanZhi());
console.log('getDayInGanZhi():', lunarDate.getDayInGanZhi());

console.log('\n=== LunarMonth 객체 ===');
const lunarMonth = lunarDate.getMonth();
const lunarMonthObj = lunar.LunarMonth.fromYm(lunarDate.getYear(), lunarMonth);
console.log('LunarMonth 메서드:', Object.getOwnPropertyNames(Object.getPrototypeOf(lunarMonthObj)));

console.log('\n=== 월 날짜 수 확인 ===');
// getDayCount 메서드 찾기
if (typeof lunarMonthObj.getDayCount === 'function') {
  console.log('getDayCount():', lunarMonthObj.getDayCount());
}
if (typeof lunarMonthObj.getDays === 'function') {
  console.log('getDays():', lunarMonthObj.getDays());
}

console.log('\n=== 모든 Lunar 메서드 ===');
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(lunarDate)));
