#!/bin/bash
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 3.1: Docusaurus 초기화 Verification ==="

check "package.json 존재" "$([ -f packages/docs/package.json ] && echo true || echo false)"
check "docusaurus.config.ts 존재" "$([ -f packages/docs/docusaurus.config.ts ] && echo true || echo false)"
check "sidebars.ts 존재" "$([ -f packages/docs/sidebars.ts ] && echo true || echo false)"
check "tsconfig.json 존재" "$([ -f packages/docs/tsconfig.json ] && echo true || echo false)"
check "custom.css 존재" "$([ -f packages/docs/src/css/custom.css ] && echo true || echo false)"
check "한국어 기본 언어" "$(grep -q 'defaultLocale.*ko' packages/docs/docusaurus.config.ts && echo true || echo false)"
check "영어 선택 가능" "$(grep -q "'en'" packages/docs/docusaurus.config.ts && echo true || echo false)"
check "intro/index.md 존재" "$([ -f packages/docs/docs/intro/index.md ] && echo true || echo false)"
check "intro/quick-start.md 존재" "$([ -f packages/docs/docs/intro/quick-start.md ] && echo true || echo false)"
check "intro/installation.md 존재" "$([ -f packages/docs/docs/intro/installation.md ] && echo true || echo false)"
check "static 디렉토리" "$([ -d packages/docs/static/img ] && echo true || echo false)"
check "sidebar에 docsSidebar" "$(grep -q 'docsSidebar' packages/docs/sidebars.ts && echo true || echo false)"
check "pnpm install 성공" "$(pnpm install 2>&1 >/dev/null && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
