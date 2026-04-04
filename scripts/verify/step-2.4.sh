#!/bin/bash
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 2.4: API 클라이언트 생성기 Verification ==="

check "api-client-generator.ts 존재" "$([ -f packages/cli/src/generators/api-client-generator.ts ] && echo true || echo false)"
check "generateApiClient export" "$(grep -q 'export.*generateApiClient' packages/cli/src/generators/api-client-generator.ts && echo true || echo false)"
check "api-client-ts.ejs 존재" "$([ -f packages/cli/src/templates/shared/api-client-ts.ejs ] && echo true || echo false)"
check "TS 클라이언트에 ApiResult 타입" "$(grep -q 'ApiResult' packages/cli/src/templates/shared/api-client-ts.ejs && echo true || echo false)"
check "TS 클라이언트에 에러 핸들링" "$(grep -q 'ApiError' packages/cli/src/templates/shared/api-client-ts.ejs && echo true || echo false)"
check "TS 클라이언트에 인증 토큰" "$(grep -q 'authToken' packages/cli/src/templates/shared/api-client-ts.ejs && echo true || echo false)"
check "api-client-kotlin.ejs 존재" "$([ -f packages/cli/src/templates/shared/api-client-kotlin.ejs ] && echo true || echo false)"
check "Kotlin에 suspend 함수" "$(grep -q 'suspend' packages/cli/src/templates/shared/api-client-kotlin.ejs && echo true || echo false)"
check "Kotlin에 sealed class" "$(grep -q 'sealed class' packages/cli/src/templates/shared/api-client-kotlin.ejs && echo true || echo false)"
check "project-generator에서 api-client 호출" "$(grep -q 'generateApiClient' packages/cli/src/generators/project-generator.ts && echo true || echo false)"
check "TypeScript 컴파일" "$(cd packages/cli && npx tsc --noEmit 2>&1 && echo true || echo false)"

# 통합 테스트
TEST_DIR="/tmp/agentic-phase2-test-$$"
rm -rf "$TEST_DIR"

SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cat > /tmp/agentic-test-run.mjs << EOJS
import { generateProject } from '${SCRIPT_DIR}/packages/cli/src/generators/project-generator.js';
const config = { name: 'test-hybrid', stack: 'hybrid', client: 'both', features: ['auth', 'database', 'storage', 'realtime'], deploy: 'vercel' };
await generateProject(config, '${TEST_DIR}');
EOJS
npx tsx /tmp/agentic-test-run.mjs 2>/dev/null

check "통합: 프로젝트 생성됨" "$([ -d "$TEST_DIR" ] && echo true || echo false)"
check "통합: supabase/config.toml" "$([ -f "$TEST_DIR/supabase/config.toml" ] && echo true || echo false)"
check "통합: lambda/index.ts" "$([ -f "$TEST_DIR/lambda/index.ts" ] && echo true || echo false)"
check "통합: unified-client.ts" "$([ -f "$TEST_DIR/src/lib/unified-client.ts" ] && echo true || echo false)"
check "통합: api/client.ts (TS)" "$([ -f "$TEST_DIR/src/api/client.ts" ] && echo true || echo false)"
check "통합: ApiClient.kt (Kotlin)" "$([ -f "$TEST_DIR/android/app/src/main/kotlin/api/ApiClient.kt" ] && echo true || echo false)"
check "통합: web 디렉토리" "$([ -d "$TEST_DIR/web" ] && echo true || echo false)"
check "통합: vercel.json" "$([ -f "$TEST_DIR/vercel.json" ] && echo true || echo false)"

rm -rf "$TEST_DIR"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
