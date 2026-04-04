#!/bin/bash
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 3.4: 아키텍처 다이어그램 Verification ==="

for f in supabase aws hybrid; do
  check "$f.md 존재" "$([ -f packages/docs/docs/architecture/$f.md ] && echo true || echo false)"
  check "$f.md에 mermaid 다이어그램" "$(grep -q 'mermaid' packages/docs/docs/architecture/$f.md && echo true || echo false)"
done

# 다이어그램 개수 (최소 6개: 각 파일 2개씩)
MERMAID_COUNT=$(grep -r -c 'mermaid' packages/docs/docs/architecture/*.md 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')
check "총 6개 이상 다이어그램 ($MERMAID_COUNT개)" "$([ "$MERMAID_COUNT" -ge 6 ] && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
