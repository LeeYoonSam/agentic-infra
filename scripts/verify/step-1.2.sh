#!/bin/bash
# Verification: Step 1.2 - CLI 패키지 기본 구조
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 1.2: CLI 패키지 기본 구조 Verification ==="

# US-001: 패키지 설정
check "packages/cli/package.json 존재" "$([ -f packages/cli/package.json ] && echo true || echo false)"
check "packages/cli/tsconfig.json 존재" "$([ -f packages/cli/tsconfig.json ] && echo true || echo false)"
check "package.json name이 agentic-infra" "$(grep -q '\"name\": \"agentic-infra\"' packages/cli/package.json && echo true || echo false)"
check "package.json type이 module" "$(grep -q '\"type\": \"module\"' packages/cli/package.json && echo true || echo false)"
check "bin 필드 존재" "$(grep -q '\"bin\"' packages/cli/package.json && echo true || echo false)"
check "commander 의존성" "$(grep -q 'commander' packages/cli/package.json && echo true || echo false)"
check "@inquirer/prompts 의존성" "$(grep -q '@inquirer/prompts' packages/cli/package.json && echo true || echo false)"
check "chalk 의존성" "$(grep -q 'chalk' packages/cli/package.json && echo true || echo false)"
check "ora 의존성" "$(grep -q 'ora' packages/cli/package.json && echo true || echo false)"
check "ejs 의존성" "$(grep -q 'ejs' packages/cli/package.json && echo true || echo false)"
check "tsconfig extends base" "$(grep -q 'tsconfig.base.json' packages/cli/tsconfig.json && echo true || echo false)"

# US-002: CLI 진입점
check "src/index.ts 존재" "$([ -f packages/cli/src/index.ts ] && echo true || echo false)"
check "src/commands/init.ts 존재" "$([ -f packages/cli/src/commands/init.ts ] && echo true || echo false)"
check "index.ts에 commander import" "$(grep -q 'commander' packages/cli/src/index.ts && echo true || echo false)"
check "init 명령어 등록" "$(grep -q 'command.*init' packages/cli/src/index.ts && echo true || echo false)"

# US-003: 프롬프트 모듈
check "stack-selector.ts 존재" "$([ -f packages/cli/src/prompts/stack-selector.ts ] && echo true || echo false)"
check "feature-selector.ts 존재" "$([ -f packages/cli/src/prompts/feature-selector.ts ] && echo true || echo false)"
check "client-selector.ts 존재" "$([ -f packages/cli/src/prompts/client-selector.ts ] && echo true || echo false)"
check "selectStack 함수 export" "$(grep -q 'export.*selectStack' packages/cli/src/prompts/stack-selector.ts && echo true || echo false)"
check "selectFeatures 함수 export" "$(grep -q 'export.*selectFeatures' packages/cli/src/prompts/feature-selector.ts && echo true || echo false)"
check "selectClient 함수 export" "$(grep -q 'export.*selectClient' packages/cli/src/prompts/client-selector.ts && echo true || echo false)"
check "@inquirer/prompts import (stack)" "$(grep -q '@inquirer/prompts' packages/cli/src/prompts/stack-selector.ts && echo true || echo false)"

# US-004: 빌드 및 검증
check "build 스크립트 존재" "$(grep -q '\"build\"' packages/cli/package.json && echo true || echo false)"
check "dev 스크립트 존재" "$(grep -q '\"dev\"' packages/cli/package.json && echo true || echo false)"
check "clean 스크립트 존재" "$(grep -q '\"clean\"' packages/cli/package.json && echo true || echo false)"

# TypeScript 컴파일 확인
check "TypeScript 컴파일 성공 (noEmit)" "$(cd packages/cli && npx tsc --noEmit 2>&1 && echo true || echo false)"

# CLI 동작 확인
check "CLI --help 실행 성공" "$(npx tsx packages/cli/src/index.ts --help 2>&1 | grep -q 'agentic-infra' && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
