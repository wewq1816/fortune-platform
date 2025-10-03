const { 
  getElementRelationship, 
  calculateFortuneByElements,
  getElementCharacteristics 
} = require('../engines/utils/element-calculator');

console.log('=== 오행 상생상극 계산 테스트 ===\n');

// 1. 상생 관계 테스트
console.log('1. 상생 관계 (5가지):');
const sangseong = [
  ['수', '목', '수생목'],
  ['목', '화', '목생화'],
  ['화', '토', '화생토'],
  ['토', '금', '토생금'],
  ['금', '수', '금생수']
];

sangseong.forEach(([e1, e2, name]) => {
  const rel = getElementRelationship(e1, e2);
  console.log(`   ${name}: ${rel.type} (점수: ${rel.score}, ${rel.level})`);
});
console.log('');

// 2. 상극 관계 테스트
console.log('2. 상극 관계 (5가지):');
const sanggeuk = [
  ['수', '화', '수극화'],
  ['화', '금', '화극금'],
  ['금', '목', '금극목'],
  ['목', '토', '목극토'],
  ['토', '수', '토극수']
];

sanggeuk.forEach(([e1, e2, name]) => {
  const rel = getElementRelationship(e1, e2);
  console.log(`   ${name}: ${rel.type} (점수: ${rel.score}, ${rel.level})`);
});
console.log('');

// 3. 같은 오행 (비화)
console.log('3. 같은 오행 (비화):');
['목', '화', '토', '금', '수'].forEach(element => {
  const rel = getElementRelationship(element, element);
  console.log(`   ${element}-${element}: ${rel.type} (점수: ${rel.score})`);
});
console.log('');

// 4. 실제 운세 계산 예시
console.log('4. 실제 운세 계산 예시:');
console.log('   쥐띠(수) + 일진 갑오(목-화):');
const fortune1 = calculateFortuneByElements('수', '목');
console.log(`   → ${fortune1.relationship}: ${fortune1.level} (${fortune1.score}점)`);
console.log(`   → ${fortune1.description}`);
console.log(`   → ${fortune1.detail}`);
console.log('');

console.log('   말띠(화) + 일진 임자(수-수):');
const fortune2 = calculateFortuneByElements('화', '수');
console.log(`   → ${fortune2.relationship}: ${fortune2.level} (${fortune2.score}점)`);
console.log(`   → ${fortune2.description}`);
console.log(`   → ${fortune2.detail}`);
console.log('');

// 5. 오행 특성 조회
console.log('5. 오행별 특성:');
['목', '화', '토', '금', '수'].forEach(element => {
  const char = getElementCharacteristics(element);
  console.log(`   ${char.name}: ${char.character}`);
  console.log(`      방향: ${char.direction}, 계절: ${char.season}`);
});
console.log('');

// 6. 점수 분포 확인
console.log('6. 점수 분포 확인:');
const scores = {
  '상생': 95,
  '피생': 85,
  '비화': 70,
  '상극': 60,
  '피극': 50
};
Object.entries(scores).forEach(([type, score]) => {
  console.log(`   ${type}: ${score}점`);
});

console.log('\n✅ 테스트 완료!');
