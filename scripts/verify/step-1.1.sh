#!/bin/bash
# Verification: Step 1.1 - 모노레포 초기 설정
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 1.1: 모노레포 초기 설정 Verification ==="

# 파일 존재 확인
check "package.json 존재" "$([ -f package.json ] && echo true || echo false)"
check "pnpm-workspace.yaml 존재" "$([ -f pnpm-workspace.yaml ] && echo true || echo false)"
check "turbo.json 존재" "$([ -f turbo.json ] && echo true || echo false)"
check "tsconfig.base.json 존재" "$([ -f tsconfig.base.json ] && echo true || echo false)"
check ".nvmrc 존재" "$([ -f .nvmrc ] && echo true || echo false)"
check "CLAUDE.md 존재" "$([ -f CLAUDE.md ] && echo true || echo false)"

# package.json 내용 확인
check "package.json에 workspaces 관련 설정" "$(grep -q 'turbo' package.json && echo true || echo false)"
check "package.json에 private:true" "$(grep -q '\"private\": true' package.json && echo true || echo false)"

# pnpm-workspace.yaml 내용 확인
check "workspace에 packages/* 포함" "$(grep -q 'packages/\*' pnpm-workspace.yaml && echo true || echo false)"

# turbo.json 내용 확인
check "turbo.json에 build task" "$(grep -q '\"build\"' turbo.json && echo true || echo false)"
check "turbo.json에 dev task" "$(grep -q '\"dev\"' turbo.json && echo true || echo false)"

# tsconfig.base.json 내용 확인
check "tsconfig strict 모드" "$(grep -q '\"strict\": true' tsconfig.base.json && echo true || echo false)"
check "tsconfig target ES2022" "$(grep -q 'ES2022' tsconfig.base.json && echo true || echo false)"

# .nvmrc 내용 확인
check ".nvmrc에 Node 20" "$(grep -q '20' .nvmrc && echo true || echo false)"

# pnpm install 성공 여부
check "pnpm install 성공" "$(pnpm install 2>&1 >/dev/null && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
