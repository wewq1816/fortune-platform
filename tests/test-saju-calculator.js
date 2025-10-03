const { calculateSaju } = require('../engines/utils/saju-calculator');

console.log('='.repeat(60));
console.log('사주팔자 계산 테스트');
console.log('='.repeat(60));

// 테스트 케이스 1: 1990년 3월 15일 오전 7시생 (양력)
console.log('\n📅 테스트 1: 1990년 3월 15일 오전 7시생 (양력)');
console.log('-'.repeat(60));

const saju1 = calculateSaju({
  year: 1990,
  month: 3,
  day: 15,
  hour: 7,
  isLunar: false
});

console.log('✅ 계산 성공:', saju1.success);
console.log('\n📋 사주 8글자:');
console.log('   한글:', saju1.sajuString);
console.log('   한자:', saju1.sajuHanja);

console.log('\n🎯 4주 상세:');
console.log(`   년주(年柱): ${saju1.yearColumn.korean}(${saju1.yearColumn.hanja}) - ${saju1.yearColumn.cheongan}(${saju1.yearColumn.cheonganElement}) ${saju1.yearColumn.jiji}(${saju1.yearColumn.jijiElement})`);
console.log(`   월주(月柱): ${saju1.monthColumn.korean}(${saju1.monthColumn.hanja}) - ${saju1.monthColumn.cheongan}(${saju1.monthColumn.cheonganElement}) ${saju1.monthColumn.jiji}(${saju1.monthColumn.jijiElement})`);
console.log(`   일주(日柱): ${saju1.dayColumn.korean}(${saju1.dayColumn.hanja}) - ${saju1.dayColumn.cheongan}(${saju1.dayColumn.cheonganElement}) ${saju1.dayColumn.jiji}(${saju1.dayColumn.jijiElement})`);
console.log(`   시주(時柱): ${saju1.hourColumn.korean}(${saju1.hourColumn.hanja}) - ${saju1.hourColumn.cheongan}(${saju1.hourColumn.cheonganElement}) ${saju1.hourColumn.jiji}(${saju1.hourColumn.jijiElement})`);

console.log('\n⭐ 일간 (나를 나타내는 글자):');
console.log(`   ${saju1.ilgan}(${saju1.ilganHanja}) - ${saju1.ilganElement}(오행)`);

// 테스트 케이스 2: 1985년 10월 20일 오후 3시생 (양력)
console.log('\n\n📅 테스트 2: 1985년 10월 20일 오후 3시생 (양력)');
console.log('-'.repeat(60));

const saju2 = calculateSaju({
  year: 1985,
  month: 10,
  day: 20,
  hour: 15,
  isLunar: false
});

console.log('✅ 계산 성공:', saju2.success);
console.log('\n📋 사주 8글자:');
console.log('   한글:', saju2.sajuString);
console.log('   한자:', saju2.sajuHanja);

console.log('\n🎯 4주 상세:');
console.log(`   년주(年柱): ${saju2.yearColumn.korean}(${saju2.yearColumn.hanja})`);
console.log(`   월주(月柱): ${saju2.monthColumn.korean}(${saju2.monthColumn.hanja})`);
console.log(`   일주(日柱): ${saju2.dayColumn.korean}(${saju2.dayColumn.hanja})`);
console.log(`   시주(時柱): ${saju2.hourColumn.korean}(${saju2.hourColumn.hanja})`);

console.log('\n⭐ 일간:', saju2.ilgan, '-', saju2.ilganElement);

// 테스트 케이스 3: 음력 날짜
console.log('\n\n📅 테스트 3: 1990년 음력 2월 19일 자시생');
console.log('-'.repeat(60));

const saju3 = calculateSaju({
  year: 1990,
  month: 2,
  day: 19,
  hour: 0,
  isLunar: true
});

console.log('✅ 계산 성공:', saju3.success);
console.log('🔄 변환된 양력:', `${saju3.birthDate.year}년 ${saju3.birthDate.month}월 ${saju3.birthDate.day}일`);
console.log('\n📋 사주 8글자:');
console.log('   한글:', saju3.sajuString);
console.log('   한자:', saju3.sajuHanja);
console.log('\n⭐ 일간:', saju3.ilgan, '-', saju3.ilganElement);

console.log('\n' + '='.repeat(60));
console.log('✅ 모든 테스트 완료!');
console.log('='.repeat(60));
