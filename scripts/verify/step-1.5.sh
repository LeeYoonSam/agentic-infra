#!/bin/bash
# Verification: Step 1.5 - EJS 기본 템플릿
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 1.5: EJS 기본 템플릿 Verification ==="

# US-001: 템플릿 엔진 + Supabase
check "template-renderer.ts 존재" "$([ -f packages/cli/src/utils/template-renderer.ts ] && echo true || echo false)"
check "renderTemplate export" "$(grep -q 'export.*renderTemplate' packages/cli/src/utils/template-renderer.ts && echo true || echo false)"
check "supabase 템플릿 디렉토리" "$([ -d packages/cli/src/templates/supabase ] && echo true || echo false)"
check "supabase config.toml.ejs" "$([ -f packages/cli/src/templates/supabase/config.toml.ejs ] && echo true || echo false)"
check "supabase client.ts.ejs" "$([ -f packages/cli/src/templates/supabase/client.ts.ejs ] && echo true || echo false)"
check "supabase-generator가 renderTemplate 사용" "$(grep -q 'renderTemplate' packages/cli/src/generators/supabase-generator.ts && echo true || echo false)"

# US-002: AWS + Vercel 템플릿
check "aws 템플릿 디렉토리" "$([ -d packages/cli/src/templates/aws ] && echo true || echo false)"
check "aws lambda-handler.ts.ejs" "$([ -f packages/cli/src/templates/aws/lambda-handler.ts.ejs ] && echo true || echo false)"
check "aws api-client.ts.ejs" "$([ -f packages/cli/src/templates/aws/api-client.ts.ejs ] && echo true || echo false)"
check "vercel 템플릿 디렉토리" "$([ -d packages/cli/src/templates/vercel ] && echo true || echo false)"
check "vercel vercel.json.ejs" "$([ -f packages/cli/src/templates/vercel/vercel.json.ejs ] && echo true || echo false)"
check "vercel next.config.js.ejs" "$([ -f packages/cli/src/templates/vercel/next.config.js.ejs ] && echo true || echo false)"
check "aws-generator가 renderTemplate 사용" "$(grep -q 'renderTemplate' packages/cli/src/generators/aws-generator.ts && echo true || echo false)"
check "vercel-generator가 renderTemplate 사용" "$(grep -q 'renderTemplate' packages/cli/src/generators/vercel-generator.ts && echo true || echo false)"

# US-003: 공통 템플릿
check "shared 템플릿 디렉토리" "$([ -d packages/cli/src/templates/shared ] && echo true || echo false)"
check "shared package.json.ejs" "$([ -f packages/cli/src/templates/shared/package.json.ejs ] && echo true || echo false)"
check "shared README.md.ejs" "$([ -f packages/cli/src/templates/shared/README.md.ejs ] && echo true || echo false)"
check "project-generator가 renderTemplate 사용" "$(grep -q 'renderTemplate' packages/cli/src/generators/project-generator.ts && echo true || echo false)"

# US-004: 컴파일
check "TypeScript 컴파일 성공" "$(cd packages/cli && npx tsc --noEmit 2>&1 && echo true || echo false)"
check "CLI --help 동작" "$(npx tsx packages/cli/src/index.ts --help 2>&1 | grep -q 'agentic-infra' && echo true || echo false)"

# 통합 테스트: /tmp에 프로젝트 생성
TEST_DIR="/tmp/agentic-test-$$"
rm -rf "$TEST_DIR"
TMPSCRIPT="./_integration-test-$$.mts"
cat > "$TMPSCRIPT" << TSEOF
import { generateProject } from './packages/cli/src/generators/project-generator.js';
const config = { name: 'test-proj', stack: 'supabase', client: 'web', features: ['auth', 'database'], deploy: 'vercel' };
await generateProject(config, '$TEST_DIR');
TSEOF
npx tsx "$TMPSCRIPT" 2>/dev/null
rm -f "$TMPSCRIPT"

check "통합: 프로젝트 디렉토리 생성됨" "$([ -d "$TEST_DIR" ] && echo true || echo false)"
check "통합: package.json 생성됨" "$([ -f "$TEST_DIR/package.json" ] && echo true || echo false)"
JSON_VALID=false
if node -e "JSON.parse(require('fs').readFileSync('$TEST_DIR/package.json','utf8'))" 2>/dev/null; then JSON_VALID=true; fi
check "통합: package.json 유효한 JSON" "$JSON_VALID"
check "통합: README.md 생성됨" "$([ -f "$TEST_DIR/README.md" ] && echo true || echo false)"
check "통합: supabase/config.toml 생성됨" "$([ -f "$TEST_DIR/supabase/config.toml" ] && echo true || echo false)"
check "통합: vercel.json 생성됨" "$([ -f "$TEST_DIR/vercel.json" ] && echo true || echo false)"

rm -rf "$TEST_DIR"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
