#!/bin/bash
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 3.3: 핵심 개념 가이드 Verification ==="

for f in client-server api-basics database-basics auth-basics serverless; do
  check "$f.md 존재" "$([ -f packages/docs/docs/concepts/$f.md ] && echo true || echo false)"
  LINES=$(wc -l < "packages/docs/docs/concepts/$f.md" 2>/dev/null || echo 0)
  check "$f.md 100줄 이상 ($LINES줄)" "$([ "$LINES" -ge 100 ] && echo true || echo false)"
done

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
