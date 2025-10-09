#!/usr/bin/env node

/**
 * 배포 전 자동 점검 스크립트
 * 실행: node deployment-checker.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// 컬러 출력 (Windows 호환)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}${colors.reset}\n`)
};

// 점검 결과 저장
const results = {
  passed: [],
  failed: [],
  warnings: []
};

/**
 * 1. 환경 설정 점검
 */
async function checkEnvironment() {
  log.section('1️⃣ 환경 설정 점검');

  try {
    // .env 파일 존재 확인
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      log.error('.env 파일이 없습니다');
      results.failed.push('환경 변수 파일 없음');
      return;
    }
    log.success('.env 파일 존재');

    // .env 파일 읽기
    const envContent = fs.readFileSync(envPath, 'utf-8');
    
    // 필수 환경 변수 확인
    const required = [
      'CLAUDE_API_KEY',
      'MONGO_URL',
      'JWT_SECRET',
      'MASTER_CODE',
      'PORT'
    ];

    const missing = [];
    for (const key of required) {
      if (!envContent.includes(`${key}=`)) {
        missing.push(key);
      } else {
        log.success(`${key} 설정됨`);
      }
    }

    if (missing.length > 0) {
      log.error(`누락된 환경 변수: ${missing.join(', ')}`);
      results.failed.push(`환경 변수 누락: ${missing.join(', ')}`);
    } else {
      results.passed.push('환경 변수 설정 완료');
    }

    // 프로덕션 경고
    if (envContent.includes('NODE_ENV=production')) {
      log.info('프로덕션 모드 설정됨');
      
      // 프로덕션용 Secret 변경 확인
      if (envContent.includes('change-in-production')) {
        log.warning('JWT_SECRET 또는 SESSION_SECRET이 기본값입니다. 반드시 변경하세요!');
        results.warnings.push('프로덕션용 Secret 미변경');
      }
    } else {
      log.warning('개발 모드로 설정되어 있습니다');
      results.warnings.push('개발 모드 설정');
    }

  } catch (error) {
    log.error(`환경 설정 점검 실패: ${error.message}`);
    results.failed.push('환경 설정 점검 실패');
  }
}

/**
 * 2. 필수 파일 존재 확인
 */
async function checkFiles() {
  log.section('2️⃣ 필수 파일 존재 확인');

  const requiredFiles = [
    // 프론트엔드
    'frontend/index.html',
    'frontend/pages/daily-fortune-test.html',
    'frontend/pages/tarot-mock.html',
    'frontend/pages/saju-test.html',
    'frontend/pages/tojeong-test.html',
    'frontend/pages/dream.html',
    'frontend/pages/horoscope.html',
    'frontend/pages/lotto.html',
    'frontend/pages/compatibility-test.html',
    'frontend/pages/coupang-gate.html',
    'frontend/utils/ticket-system.js',
    
    // 백엔드
    'server.js',
    'engines/core/daily-engine.js',
    'engines/core/tarot-engine.js',
    'engines/core/saju-engine.js',
    'engines/core/tojeong-engine.js',
    'engines/core/dream-engine.js',
    'engines/core/horoscope-engine.js',
    'engines/core/compatibility-engine.js',
    'engines/utils/saju-calculator.js',
    'engines/data/ganzi-60.json',
    
    // 관리자
    'frontend/admin/login.html',
    'frontend/admin/dashboard.html',
    'backend/routes/admin.js',
    'backend/middleware/auth.js',
    'backend/middleware/ticket-check.js'
  ];

  let missingFiles = [];
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      log.success(file);
    } else {
      log.error(`${file} - 파일 없음`);
      missingFiles.push(file);
    }
  }

  if (missingFiles.length === 0) {
    results.passed.push('필수 파일 모두 존재');
  } else {
    results.failed.push(`누락된 파일 ${missingFiles.length}개`);
  }
}

/**
 * 3. Node 모듈 확인
 */
async function checkNodeModules() {
  log.section('3️⃣ Node 모듈 확인');

  try {
    // package.json 확인
    const packagePath = path.join(__dirname, 'package.json');
    if (!fs.existsSync(packagePath)) {
      log.error('package.json 파일이 없습니다');
      results.failed.push('package.json 없음');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    log.info(`총 ${Object.keys(dependencies).length}개 모듈`);

    // node_modules 존재 확인
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      log.error('node_modules 폴더가 없습니다. npm install을 실행하세요');
      results.failed.push('node_modules 없음');
      return;
    }

    // 필수 모듈 확인
    const required = [
      'express',
      '@anthropic-ai/sdk',
      'mongodb',
      'jsonwebtoken',
      'bcryptjs',
      'dotenv',
      'cors'
    ];

    for (const mod of required) {
      const modPath = path.join(nodeModulesPath, mod);
      if (fs.existsSync(modPath)) {
        log.success(mod);
      } else {
        log.error(`${mod} 모듈 없음`);
        results.failed.push(`${mod} 모듈 없음`);
      }
    }

    results.passed.push('Node 모듈 확인 완료');

  } catch (error) {
    log.error(`Node 모듈 점검 실패: ${error.message}`);
    results.failed.push('Node 모듈 점검 실패');
  }
}

/**
 * 4. API 키 유효성 간단 확인
 */
async function checkAPIKey() {
  log.section('4️⃣ Claude API 키 확인');

  try {
    require('dotenv').config();
    
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      log.error('CLAUDE_API_KEY가 설정되지 않았습니다');
      results.failed.push('Claude API 키 없음');
      return;
    }

    // API 키 형식 확인
    if (!apiKey.startsWith('sk-ant-')) {
      log.error('Claude API 키 형식이 올바르지 않습니다 (sk-ant-로 시작해야 함)');
      results.failed.push('Claude API 키 형식 오류');
      return;
    }

    log.success('Claude API 키 형식 확인');
    log.info('실제 API 연결 테스트는 서버 실행 후 진행하세요');
    results.passed.push('Claude API 키 형식 확인');

  } catch (error) {
    log.error(`API 키 점검 실패: ${error.message}`);
    results.failed.push('API 키 점검 실패');
  }
}

/**
 * 5. 보안 설정 확인
 */
async function checkSecurity() {
  log.section('5️⃣ 보안 설정 확인');

  try {
    require('dotenv').config();

    // JWT Secret 강도 확인
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      log.warning('JWT_SECRET이 너무 짧습니다 (32자 이상 권장)');
      results.warnings.push('JWT Secret 너무 짧음');
    } else {
      log.success('JWT Secret 길이 충분');
    }

    // 마스터 코드 확인
    const masterCode = process.env.MASTER_CODE;
    if (masterCode === 'cooal' && process.env.NODE_ENV === 'production') {
      log.warning('프로덕션에서 기본 마스터 코드를 사용 중입니다. 변경하세요!');
      results.warnings.push('기본 마스터 코드 사용');
    } else {
      log.success('마스터 코드 설정됨');
    }

    // Rate Limiting 확인
    const serverPath = path.join(__dirname, 'server.js');
    if (fs.existsSync(serverPath)) {
      const serverContent = fs.readFileSync(serverPath, 'utf-8');
      if (serverContent.includes('express-rate-limit')) {
        log.success('Rate Limiting 설정됨');
      } else {
        log.warning('Rate Limiting이 설정되지 않았습니다');
        results.warnings.push('Rate Limiting 미설정');
      }

      // IP 이용권 시스템 확인
      if (serverContent.includes('ticket-check')) {
        log.success('IP 이용권 시스템 활성화됨');
        results.passed.push('보안 시스템 활성화');
      } else {
        log.warning('IP 이용권 시스템이 활성화되지 않았습니다');
        results.warnings.push('이용권 시스템 미활성화');
      }
    }

  } catch (error) {
    log.error(`보안 점검 실패: ${error.message}`);
    results.failed.push('보안 점검 실패');
  }
}

/**
 * 6. 삭제 대상 파일 확인
 */
async function checkUnusedFiles() {
  log.section('6️⃣ 삭제 대상 파일 확인');

  const toDelete = [
    'frontend/pages/daily-fortune.html',
    'frontend/pages/tarot-mock-complete.html',
    'frontend/pages/tarot-test.html',
    'frontend/pages/saju-test-improved.html',
    'frontend/pages/saju-test-new.html',
    'frontend/pages/saju-test-old-backup.html',
    'frontend/pages/tojeong.html',
    'frontend/pages/compatibility.html',
    'frontend/pages/compatibility_fixed.html',
    'frontend/pages/saju-basic-calculator.js',
    'frontend/pages/saju-extended-calculator.js',
    'frontend/pages/saju-interpretations.js'
  ];

  let foundUnused = [];
  for (const file of toDelete) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      log.warning(`${file} - 삭제 권장`);
      foundUnused.push(file);
    }
  }

  if (foundUnused.length === 0) {
    log.success('삭제 대상 파일 없음 (정리 완료)');
    results.passed.push('파일 정리 완료');
  } else {
    log.warning(`${foundUnused.length}개 파일이 아직 남아있습니다`);
    results.warnings.push(`미정리 파일 ${foundUnused.length}개`);
  }
}

/**
 * 7. 포트 사용 확인
 */
async function checkPort() {
  log.section('7️⃣ 포트 사용 확인');

  try {
    require('dotenv').config();
    const port = process.env.PORT || 3000;

    log.info(`설정된 포트: ${port}`);

    // Windows에서 포트 사용 확인
    try {
      const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
      if (stdout) {
        log.warning(`포트 ${port}가 이미 사용 중입니다`);
        log.info('사용 중인 프로세스:');
        console.log(stdout.substring(0, 200));
        results.warnings.push(`포트 ${port} 사용 중`);
      } else {
        log.success(`포트 ${port} 사용 가능`);
      }
    } catch (error) {
      // netstat 명령이 결과가 없으면 에러 발생 (정상)
      log.success(`포트 ${port} 사용 가능`);
    }

    results.passed.push('포트 확인 완료');

  } catch (error) {
    log.error(`포트 점검 실패: ${error.message}`);
    results.failed.push('포트 점검 실패');
  }
}

/**
 * 8. Git 상태 확인
 */
async function checkGit() {
  log.section('8️⃣ Git 상태 확인');

  try {
    // .gitignore 확인
    const gitignorePath = path.join(__dirname, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      
      // 필수 항목 확인
      const required = ['.env', 'node_modules'];
      const missing = [];
      
      for (const item of required) {
        if (!gitignoreContent.includes(item)) {
          missing.push(item);
        }
      }

      if (missing.length > 0) {
        log.warning(`.gitignore에 누락: ${missing.join(', ')}`);
        results.warnings.push(`.gitignore 누락 항목: ${missing.join(', ')}`);
      } else {
        log.success('.gitignore 필수 항목 포함');
      }
    } else {
      log.warning('.gitignore 파일이 없습니다');
      results.warnings.push('.gitignore 없음');
    }

    results.passed.push('Git 설정 확인');

  } catch (error) {
    log.error(`Git 점검 실패: ${error.message}`);
    results.failed.push('Git 점검 실패');
  }
}

/**
 * 최종 보고서 출력
 */
function printReport() {
  log.section('📊 최종 점검 보고서');

  console.log(`\n${colors.green}✅ 통과: ${results.passed.length}개${colors.reset}`);
  results.passed.forEach(item => console.log(`  - ${item}`));

  if (results.warnings.length > 0) {
    console.log(`\n${colors.yellow}⚠️  경고: ${results.warnings.length}개${colors.reset}`);
    results.warnings.forEach(item => console.log(`  - ${item}`));
  }

  if (results.failed.length > 0) {
    console.log(`\n${colors.red}❌ 실패: ${results.failed.length}개${colors.reset}`);
    results.failed.forEach(item => console.log(`  - ${item}`));
  }

  console.log('\n' + '='.repeat(50));
  
  if (results.failed.length === 0) {
    log.success('배포 준비 완료! 🎉');
    console.log('\n다음 단계:');
    console.log('1. node server.js - 서버 시작');
    console.log('2. http://localhost:3000 - 브라우저에서 테스트');
    console.log('3. 8개 기능 모두 테스트');
    console.log('4. 관리자 페이지 접속 테스트');
    console.log('5. 프로덕션 배포');
  } else {
    log.error('배포 전 문제를 해결해야 합니다');
    console.log('\n문제 해결 후 다시 실행하세요:');
    console.log('node deployment-checker.js');
  }
}

/**
 * 메인 실행
 */
async function main() {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 운세플랫폼 배포 전 자동 점검 스크립트 🚀        ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);

  await checkEnvironment();
  await checkFiles();
  await checkNodeModules();
  await checkAPIKey();
  await checkSecurity();
  await checkUnusedFiles();
  await checkPort();
  await checkGit();

  printReport();
}

// 실행
main().catch(error => {
  log.error(`스크립트 실행 실패: ${error.message}`);
  process.exit(1);
});
