#!/bin/bash
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 2.1: Supabase 풀 템플릿 Verification ==="

check "migration.sql.ejs 존재" "$([ -f packages/cli/src/templates/supabase/migration.sql.ejs ] && echo true || echo false)"
check "migration에 users 테이블" "$(grep -q 'CREATE TABLE.*users' packages/cli/src/templates/supabase/migration.sql.ejs && echo true || echo false)"
check "migration에 RLS" "$(grep -q 'ROW LEVEL SECURITY' packages/cli/src/templates/supabase/migration.sql.ejs && echo true || echo false)"
check "auth-config.ts.ejs 존재" "$([ -f packages/cli/src/templates/supabase/auth-config.ts.ejs ] && echo true || echo false)"
check "auth에 signUp" "$(grep -q 'signUp' packages/cli/src/templates/supabase/auth-config.ts.ejs && echo true || echo false)"
check "storage.ts.ejs 존재" "$([ -f packages/cli/src/templates/supabase/storage.ts.ejs ] && echo true || echo false)"
check "storage에 uploadFile" "$(grep -q 'uploadFile' packages/cli/src/templates/supabase/storage.ts.ejs && echo true || echo false)"
check "edge-function.ts.ejs 존재" "$([ -f packages/cli/src/templates/supabase/edge-function.ts.ejs ] && echo true || echo false)"
check "edge에 CRUD" "$(grep -q 'POST' packages/cli/src/templates/supabase/edge-function.ts.ejs && echo true || echo false)"
check "realtime.ts.ejs 존재" "$([ -f packages/cli/src/templates/supabase/realtime.ts.ejs ] && echo true || echo false)"
check "realtime에 subscribe" "$(grep -q 'subscribe' packages/cli/src/templates/supabase/realtime.ts.ejs && echo true || echo false)"
check "generator가 features 조건부" "$(grep -q 'features.includes' packages/cli/src/generators/supabase-generator.ts && echo true || echo false)"
check "TypeScript 컴파일" "$(cd packages/cli && npx tsc --noEmit 2>&1 && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
