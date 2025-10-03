require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const { getDailyFortuneBySaju } = require('../engines/core/daily-engine');
const { generateDailyFortunePrompt } = require('../engines/prompts/daily-fortune-prompt');

// Claude API 클라이언트 초기화
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

console.log('='.repeat(70));
console.log('🔮 오늘의 운세 - Claude API 연동 테스트');
console.log('='.repeat(70));

async function testDailyFortuneWithClaude() {
  try {
    console.log('\n📋 Step 1: 사주 8글자 계산');
    console.log('-'.repeat(70));
    
    // 1. 사주 계산
    const birthInfo = {
      year: 1990,
      month: 3,
      day: 15,
      hour: 7,
      isLunar: false
    };
    
    const fortuneData = getDailyFortuneBySaju(birthInfo);
    
    if (!fortuneData.success) {
      throw new Error('사주 계산 실패: ' + fortuneData.message);
    }
    
    console.log('✅ 사주 계산 완료');
    console.log(`   사주: ${fortuneData.saju.string}`);
    console.log(`   일간: ${fortuneData.saju.ilgan}(${fortuneData.saju.ilganElement})`);
    console.log(`   오늘: ${fortuneData.today.ganzi}`);
    console.log(`   관계: ${fortuneData.relationship}`);
    console.log(`   점수: ${fortuneData.score}점`);
    
    // 2. 프롬프트 생성
    console.log('\n📝 Step 2: Claude API 프롬프트 생성');
    console.log('-'.repeat(70));
    
    const prompt = generateDailyFortunePrompt(fortuneData);
    console.log('✅ 프롬프트 생성 완료');
    console.log(`   길이: ${prompt.length}자`);
    console.log(`   예상 토큰: 약 ${Math.ceil(prompt.length / 4)}개`);
    
    // 3. Claude API 호출
    console.log('\n🤖 Step 3: Claude Haiku API 호출');
    console.log('-'.repeat(70));
    console.log('⏳ API 호출 중... (약 5-10초 소요)');
    
    const startTime = Date.now();
    
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ API 호출 완료! (${duration}초)`);
    
    // 4. 응답 파싱
    console.log('\n📊 Step 4: 응답 파싱');
    console.log('-'.repeat(70));
    
    const responseText = message.content[0].text;
    console.log('✅ 응답 받음');
    console.log(`   응답 길이: ${responseText.length}자`);
    
    // JSON 추출 시도
    let fortuneResult;
    try {
      // JSON만 추출 (```json ... ``` 제거)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        fortuneResult = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON 파싱 성공');
      } else {
        console.log('⚠️  JSON 형식 아님, 원문 그대로 사용');
        fortuneResult = { 원문: responseText };
      }
    } catch (e) {
      console.log('⚠️  JSON 파싱 실패, 원문 그대로 사용');
      fortuneResult = { 원문: responseText };
    }
    
    // 5. 결과 출력
    console.log('\n🎯 Step 5: 최종 결과');
    console.log('='.repeat(70));
    
    console.log('\n📅 사주 정보:');
    console.log(`   생년월일시: ${birthInfo.year}년 ${birthInfo.month}월 ${birthInfo.day}일 ${birthInfo.hour}시`);
    console.log(`   사주 8글자: ${fortuneData.saju.string} (${fortuneData.saju.hanja})`);
    console.log(`   일간: ${fortuneData.saju.ilgan}(${fortuneData.saju.ilganElement})`);
    console.log(`   오늘 일진: ${fortuneData.today.ganzi} (${fortuneData.today.element})`);
    console.log(`   오행 관계: ${fortuneData.relationship} (${fortuneData.relationshipDesc})`);
    console.log(`   점수: ${fortuneData.score}점 / 등급: ${fortuneData.level}`);
    
    console.log('\n🔮 오늘의 운세:');
    console.log('-'.repeat(70));
    
    if (fortuneResult.총운) {
      console.log('\n📌 총운:');
      console.log(fortuneResult.총운);
      
      console.log('\n💕 애정운:');
      console.log(fortuneResult.애정운);
      
      console.log('\n💰 금전운:');
      console.log(fortuneResult.금전운);
      
      console.log('\n💼 직장운:');
      console.log(fortuneResult.직장운);
      
      console.log('\n📚 학업운:');
      console.log(fortuneResult.학업운);
      
      console.log('\n🏥 건강운:');
      console.log(fortuneResult.건강운);
    } else {
      console.log(responseText);
    }
    
    // 6. 비용 계산
    console.log('\n💰 Step 6: 비용 계산');
    console.log('='.repeat(70));
    
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const inputCost = (inputTokens / 1000) * 0.00025;
    const outputCost = (outputTokens / 1000) * 0.00125;
    const totalCost = inputCost + outputCost;
    
    console.log(`   입력 토큰: ${inputTokens}개`);
    console.log(`   출력 토큰: ${outputTokens}개`);
    console.log(`   입력 비용: $${inputCost.toFixed(6)}`);
    console.log(`   출력 비용: $${outputCost.toFixed(6)}`);
    console.log(`   총 비용: $${totalCost.toFixed(6)} (약 ${Math.ceil(totalCost * 1300)}원)`);
    console.log(`   응답 시간: ${duration}초`);
    
    console.log('\n✅ 테스트 완료!');
    console.log('='.repeat(70));
    
    return {
      success: true,
      fortuneData: fortuneData,
      aiResponse: fortuneResult,
      usage: message.usage,
      cost: totalCost,
      duration: duration
    };
    
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    console.error('상세:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 테스트 실행
testDailyFortuneWithClaude();
