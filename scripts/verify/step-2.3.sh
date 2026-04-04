#!/bin/bash
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 2.3: 하이브리드 템플릿 Verification ==="

check "hybrid-generator.ts 존재" "$([ -f packages/cli/src/generators/hybrid-generator.ts ] && echo true || echo false)"
check "generateHybrid export" "$(grep -q 'export.*generateHybrid' packages/cli/src/generators/hybrid-generator.ts && echo true || echo false)"
check "webhook-handler.ts.ejs 존재" "$([ -f packages/cli/src/templates/hybrid/webhook-handler.ts.ejs ] && echo true || echo false)"
check "webhook에 INSERT/UPDATE/DELETE" "$(grep -q 'INSERT.*UPDATE.*DELETE' packages/cli/src/templates/hybrid/webhook-handler.ts.ejs && echo true || echo false)"
check "unified-client.ts.ejs 존재" "$([ -f packages/cli/src/templates/hybrid/unified-client.ts.ejs ] && echo true || echo false)"
check "unified에 db + api" "$(grep -q 'export const db' packages/cli/src/templates/hybrid/unified-client.ts.ejs && grep -q 'export const api' packages/cli/src/templates/hybrid/unified-client.ts.ejs && echo true || echo false)"
check "project-generator에서 hybrid 호출" "$(grep -q 'hybrid-generator' packages/cli/src/generators/project-generator.ts && echo true || echo false)"
check "TypeScript 컴파일" "$(cd packages/cli && npx tsc --noEmit 2>&1 && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
