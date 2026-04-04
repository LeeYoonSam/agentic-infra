#!/bin/bash
# Verification: Step 0.1 - .gitignore 설정
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 0.1: .gitignore Verification ==="

check ".gitignore 파일 존재" "$([ -f .gitignore ] && echo true || echo false)"
check "node_modules/ 포함" "$(grep -q 'node_modules/' .gitignore && echo true || echo false)"
check ".env 포함" "$(grep -q '^\.env$' .gitignore && echo true || echo false)"
check ".turbo/ 포함" "$(grep -q '\.turbo/' .gitignore && echo true || echo false)"
check "dist/ 포함" "$(grep -q 'dist/' .gitignore && echo true || echo false)"
check ".DS_Store 포함" "$(grep -q '\.DS_Store' .gitignore && echo true || echo false)"
check "coverage/ 포함" "$(grep -q 'coverage/' .gitignore && echo true || echo false)"
check ".supabase/ 포함" "$(grep -q '\.supabase/' .gitignore && echo true || echo false)"
check "cdk.out/ 포함" "$(grep -q 'cdk\.out/' .gitignore && echo true || echo false)"
check ".docusaurus/ 포함" "$(grep -q '\.docusaurus/' .gitignore && echo true || echo false)"
check ".next/ 포함" "$(grep -q '\.next/' .gitignore && echo true || echo false)"
check ".omc/state/ 포함" "$(grep -q '\.omc/state/' .gitignore && echo true || echo false)"
check "12+ 섹션 존재" "$([ $(grep -c '^# ===' .gitignore) -ge 12 ] && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
