#!/bin/bash
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 3.2: 용어 백과사전 Verification ==="

check "network.md 존재" "$([ -f packages/docs/docs/glossary/network.md ] && echo true || echo false)"
check "backend.md 존재" "$([ -f packages/docs/docs/glossary/backend.md ] && echo true || echo false)"
check "database.md 존재" "$([ -f packages/docs/docs/glossary/database.md ] && echo true || echo false)"
check "auth.md 존재" "$([ -f packages/docs/docs/glossary/auth.md ] && echo true || echo false)"
check "infra.md 존재" "$([ -f packages/docs/docs/glossary/infra.md ] && echo true || echo false)"

# 용어 수 확인 (## 으로 시작하는 제목 개수)
for f in network backend database auth infra; do
  COUNT=$(grep -c '^## ' "packages/docs/docs/glossary/$f.md" 2>/dev/null || echo 0)
  check "$f.md에 10개 이상 용어 ($COUNT개)" "$([ "$COUNT" -ge 10 ] && echo true || echo false)"
done

# 총 용어 수
TOTAL=$(grep -r '^## ' packages/docs/docs/glossary/*.md 2>/dev/null | wc -l)
check "총 50개 이상 용어 ($TOTAL개)" "$([ "$TOTAL" -ge 50 ] && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
