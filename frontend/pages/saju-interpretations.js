// saju-interpretations.js
// 21개 카테고리 해석 생성

const SajuInterpretations = {
  // 오행별 음식
  getElementFood(element) {
    const foods = {
      목: '푸른 채소, 신맛 음식',
      화: '붉은 과일, 쓴맛 음식',
      토: '곡물, 단맛 음식',
      금: '견과류, 매운맛 음식',
      수: '해산물, 짠맛 음식'
    };
    return foods[element];
  },

  // 오행별 색상
  getElementColor(element) {
    const colors = {
      목: '녹색, 청색',
      화: '적색, 주황색',
      토: '황색, 갈색',
      금: '백색, 금색',
      수: '흑색, 남색'
    };
    return colors[element];
  },

  // 오행별 주의 장기
  getWeakOrgan(element) {
    const organs = {
      목: '간, 담',
      화: '심장, 소장',
      토: '비장, 위',
      금: '폐, 대장',
      수: '신장, 방광'
    };
    return organs[element];
  },

  // 전체 해석 생성
  generate(basicResult, extendedResult, userGender) {
    const { ilgan, elements, strength, yongsin } = basicResult;
    const { daeun, sinsal } = extendedResult;

    return {
      total: this.generateTotal(ilgan, elements, strength, yongsin),
      personality: this.generatePersonality(ilgan, strength),
      daeun: this.generateDaeun(daeun, 30),
      wealth: this.generateWealth(strength, yongsin),
      love: this.generateLove(userGender, strength),
      health: this.generateHealth(yongsin),
      career: this.generateCareer(strength),
      study: this.generateStudy(ilgan),
      promotion: this.generatePromotion(strength),
      move: this.generateMove(sinsal),
      travel: this.generateTravel(sinsal, yongsin),
      parents: this.generateParents(),
      siblings: this.generateSiblings(),
      children: this.generateChildren(),
      spouse: this.generateSpouse(),
      social: this.generateSocial(),
      aptitude: this.generateAptitude(),
      job: this.generateJob(yongsin),
      business: this.generateBusiness(strength),
      sinsal: this.generateSinsal(sinsal),
      taekil: this.generateTaekil()
    };
  },

  generateTotal(ilgan, elements, strength, yongsin) {
    return `일간이 ${ilgan}인 사람은 특별한 성격을 가지고 있습니다. ${strength} 사주로서, 자신만의 확고한 가치관을 지니고 있습니다. 오행 분포는 목${elements.목}개, 화${elements.화}개, 토${elements.토}개, 금${elements.금}개, 수${elements.수}개로 나타나며, 이는 당신의 인생에서 균형과 조화를 의미합니다. 용신인 ${yongsin} 오행을 활용하면 더욱 풍요로운 삶을 살 수 있습니다.`;
  },

  generatePersonality(ilgan, strength) {
    return `일간 ${ilgan}의 특성을 보면 온화하고 배려심이 깊습니다. ${strength} 사주는 ${strength === '신강' ? '독립적이고 주관이 뚜렷하며' : '협력적이고 융통성이 있으며'}, 타인과의 관계에서 ${strength === '신강' ? '리더십을 발휘' : '조화를 중시'}합니다. 장점은 빠른 적응력과 창의적 문제 해결 능력이며, 때로 우유부단할 수 있으니 자신의 의견을 명확히 표현하는 연습이 필요합니다.`;
  },

  generateDaeun(daeunList, currentAge) {
    const currentDaeun = daeunList.find(d => {
      const [start, end] = d.age.split('-').map(a => parseInt(a.replace('세', '')));
      return currentAge >= start && currentAge <= end;
    }) || daeunList[0];
    
    return `현재 ${currentDaeun.age} 대운 시기입니다. 대운 간지는 ${currentDaeun.ganzi}로, 이 시기는 인생의 중요한 전환점이 될 수 있습니다. 천간 ${currentDaeun.cheongan}과 지지 ${currentDaeun.jiji}의 조화를 활용하여 새로운 기회를 잡고, 장기적인 목표를 설정하는 것이 좋습니다. 이 시기 동안 꾸준한 노력과 인내가 성공의 열쇠입니다.`;
  },

  generateWealth(strength, yongsin) {
    return `재성의 배치를 보면 ${strength === '신강' ? '적극적인 투자보다는 안정적인 저축이 유리' : '꾸준한 노력으로 재물을 모을 수 있음'}합니다. 용신 ${yongsin}과 관련된 사업이나 투자를 고려해보세요. 무리한 투자는 피하고, 장기적인 관점에서 재테크를 하는 것이 좋습니다.`;
  },

  generateLove(gender, strength) {
    if (gender === '여성') {
      return `관성의 배치를 보면 ${strength === '신강' ? '강한 성격으로 배우자와 조화를 이루려 노력이 필요' : '부드러운 성격으로 좋은 배우자운'}합니다. 결혼 후에는 상대방의 의견을 존중하고, 소통을 중시하면 행복한 가정을 꾸릴 수 있습니다.`;
    } else {
      return `재성의 배치를 보면 안정적인 가정을 꾸릴 수 있습니다. ${strength} 사주는 배우자에게 ${strength === '신강' ? '리더십을 발휘' : '배려심을 보이며'}하게 됩니다. 가정을 소중히 여기고, 배우자와의 대화를 중요하게 생각하면 원만한 부부 관계를 유지할 수 있습니다.`;
    }
  },

  generateHealth(yongsin) {
    return `오행 분포를 보면 균형을 맞추기 위해 ${yongsin} 기운을 보충하는 것이 좋습니다. ${yongsin}에 해당하는 음식(${this.getElementFood(yongsin)})과 색상(${this.getElementColor(yongsin)})을 활용하면 건강에 도움이 됩니다. 규칙적인 생활과 충분한 휴식이 중요하며, 특히 ${this.getWeakOrgan(yongsin)} 부위를 주의해야 합니다.`;
  },

  generateCareer(strength) {
    return `직장 생활이 사업보다 유리합니다. ${strength === '신강' ? '리더십을 발휘할 수 있는 관리직' : '팀워크가 중요한 협업 직무'}에서 능력을 발휘하며, 금융, 교육, 공공 부문에서 좋은 성과를 기대할 수 있습니다.`;
  },

  generateStudy(ilgan) {
    return `일간 ${ilgan}의 특성상 학습 능력이 우수하며 특히 인문학과 예술 분야에 재능이 있습니다. 꾸준한 실력을 쌓는 학습법이 잘 맞으며, 집중력을 높이기 위해 규칙적인 학습 시간을 정하는 것이 좋습니다.`;
  },

  generatePromotion(strength) {
    return `승진운은 중간 정도입니다. ${strength === '신강' ? '본인의 능력을 적극적으로 어필' : '타인과의 협력과 꾸준한 업무 처리'}로 좋은 평가를 받을 수 있습니다. 상사와의 원만한 관계 유지가 승진의 열쇠입니다.`;
  },

  generateMove(sinsal) {
    const hasYeokma = sinsal.yeokma;
    return `이동운은 ${hasYeokma ? '매우 좋습니다. 역마살이 있어 이동과 변화를 즐기며' : '보통 수준입니다.'} 새로운 환경에 적응력이 빠릅니다. 이사나 이직 시 신중하게 결정하면 좋은 결과를 얻을 수 있습니다.`;
  },

  generateTravel(sinsal, yongsin) {
    const hasYeokma = sinsal.yeokma;
    return `여행운은 ${hasYeokma ? '매우 ' : ''}좋은 편입니다. ${yongsin} 방향의 여행이 특히 좋으며, 가족이나 친구와 함께하는 여행이 추천됩니다. 여행을 통해 새로운 기운을 얻고 재충전할 수 있습니다.`;
  },

  generateParents() {
    return `부모님과의 인연은 깊습니다. 효도의 마음이 강하며 부모님의 건강을 항상 체크하는 것이 중요합니다. 정기적인 연락과 방문으로 가족 간의 유대를 돈독히 하세요.`;
  },

  generateSiblings() {
    return `형제자매와의 관계는 우애가 깊습니다. 서로 도움을 주고받는 관계를 유지하며, 가족 행사 시 중심 역할을 합니다. 때로는 의견 차이가 있을 수 있으나 대화로 풀어가세요.`;
  },

  generateChildren() {
    return `자녀와의 인연은 깊으며 자녀가 효성이 깊습니다. 자녀 교육에 관심이 많으며 좋은 교육 결과를 기대할 수 있습니다. 자녀의 의견을 존중하고 격려하는 것이 중요합니다.`;
  },

  generateSpouse() {
    return `배우자와의 궁합은 좋은 편입니다. 서로를 존중하고 배려하는 관계로 행복한 결혼 생활을 영위할 수 있습니다. 작은 갈등도 대화로 풀어가며 신뢰를 쌓아가세요.`;
  },

  generateSocial() {
    return `대인관계운은 좋습니다. 사교성이 좋고 많은 사람들과 좋은 관계를 유지합니다. 다만 너무 많은 관계보다 진정성 있는 관계에 집중하는 것이 좋습니다. 인맥 관리에 시간을 투자하세요.`;
  },

  generateAptitude() {
    return `직업 적성은 소통과 교육, 상담 분야에 강점이 있습니다. 창의적인 분야와 분석적인 분야 모두 가능하며, 사람들과 함께 일하는 것을 즐깁니다. 꾸준한 자기 계발이 성공의 열쇠입니다.`;
  },

  generateJob(yongsin) {
    const jobs = {
      목: '교사, 환경 관련, 목재 관련, 출판',
      화: '요식업, 예술, 엔터테인먼트, 전기 관련',
      토: '부동산, 건축, 농업, 금융',
      금: '법조인, 의료, 기계, 금속 관련',
      수: '무역, 운송, 유통, 수산업'
    };
    return `추천 직업은 ${jobs[yongsin]}, 공무원, 상담사 등이 잘 어울립니다. 용신 ${yongsin}과 관련된 분야에서 특히 성공 가능성이 높습니다.`;
  },

  generateBusiness(strength) {
    return `사업 성공 가능성은 ${strength === '신강' ? '높은' : '중간'} 편입니다. ${strength === '신강' ? '독립적인 사업도 가능하나' : '공동 창업이나 파트너십 사업이 유리하며'}, 서비스업이나 교육 사업을 추천합니다. 초기 자본 관리와 인력 운용이 중요합니다.`;
  },

  generateSinsal(sinsal) {
    const list = [];
    if (sinsal.dohwa) list.push('도화살(이성운 강함)');
    if (sinsal.yeokma) list.push('역마살(이동과 변화)');
    if (sinsal.hwagae) list.push('화개살(예술적 재능)');
    if (sinsal.cheonEulGuiIn) list.push('천을귀인(귀인의 도움)');
    
    if (list.length === 0) {
      return '특별한 신살은 없으나 안정적인 삶을 살 수 있습니다. 꾸준한 노력으로 목표를 이루어가세요.';
    }
    
    return `보유 신살: ${list.join(', ')}. 각 신살의 특성을 이해하고 긍정적으로 활용하면 인생에 큰 도움이 됩니다. ${sinsal.yeokma ? '역마살이 있어 여행이나 이동이 길하며, ' : ''}${sinsal.cheonEulGuiIn ? '위기 시 귀인의 도움을 받을 수 있습니다.' : ''}`;
  },

  generateTaekil() {
    return `2025년 10월 길일은 5일(대길일, 95점), 10일(길일, 90점), 15일(길일, 85점)입니다. 특히 5일은 모든 일에 좋으며, 10일은 결혼과 이사에 길합니다. 중요한 일을 계획할 때 이 날짜들을 참고하세요.`;
  }
};
