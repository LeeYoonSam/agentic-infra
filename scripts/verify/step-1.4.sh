#!/bin/bash
# Verification: Step 1.4 - 프로젝트 생성기
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 1.4: 프로젝트 생성기 Verification ==="

# US-001: 프로젝트 생성기 코어
check "project-generator.ts 존재" "$([ -f packages/cli/src/generators/project-generator.ts ] && echo true || echo false)"
check "generateProject export" "$(grep -q 'export.*generateProject' packages/cli/src/generators/project-generator.ts && echo true || echo false)"

# US-002: 스택별 생성기
check "supabase-generator.ts 존재" "$([ -f packages/cli/src/generators/supabase-generator.ts ] && echo true || echo false)"
check "generateSupabase export" "$(grep -q 'export.*generateSupabase' packages/cli/src/generators/supabase-generator.ts && echo true || echo false)"
check "aws-generator.ts 존재" "$([ -f packages/cli/src/generators/aws-generator.ts ] && echo true || echo false)"
check "generateAws export" "$(grep -q 'export.*generateAws' packages/cli/src/generators/aws-generator.ts && echo true || echo false)"
check "vercel-generator.ts 존재" "$([ -f packages/cli/src/generators/vercel-generator.ts ] && echo true || echo false)"
check "generateVercel export" "$(grep -q 'export.*generateVercel' packages/cli/src/generators/vercel-generator.ts && echo true || echo false)"
check "supabase config.toml 생성 코드" "$(grep -q 'config.toml' packages/cli/src/generators/supabase-generator.ts && echo true || echo false)"
check "supabase.ts 생성 코드" "$(grep -q 'supabase.ts' packages/cli/src/generators/supabase-generator.ts && echo true || echo false)"
check "lambda/index.ts 생성 코드" "$(grep -q 'index.ts' packages/cli/src/generators/aws-generator.ts && echo true || echo false)"
check "api-client.ts 생성 코드" "$(grep -q 'api-client.ts' packages/cli/src/generators/aws-generator.ts && echo true || echo false)"
check "vercel.json 생성 코드" "$(grep -q 'vercel.json' packages/cli/src/generators/vercel-generator.ts && echo true || echo false)"
check "next.config.js 생성 코드" "$(grep -q 'next.config.js' packages/cli/src/generators/vercel-generator.ts && echo true || echo false)"

# US-003: 클라이언트 생성기
check "client-generator.ts 존재" "$([ -f packages/cli/src/generators/client-generator.ts ] && echo true || echo false)"
check "generateClient export" "$(grep -q 'export.*generateClient' packages/cli/src/generators/client-generator.ts && echo true || echo false)"
check "init.ts가 generateProject 호출" "$(grep -q 'generateProject' packages/cli/src/commands/init.ts && echo true || echo false)"

# US-004: 컴파일 + CLI
check "TypeScript 컴파일 성공" "$(cd packages/cli && npx tsc --noEmit 2>&1 && echo true || echo false)"
check "CLI --help 동작" "$(npx tsx packages/cli/src/index.ts --help 2>&1 | grep -q 'agentic-infra' && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
