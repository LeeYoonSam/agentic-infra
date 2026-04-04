#!/bin/bash
# Verification: Step 1.3 - 대화형 프롬프트 플로우
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 1.3: 대화형 프롬프트 플로우 Verification ==="

# US-001: 타입 + 프로젝트이름
check "types.ts 존재" "$([ -f packages/cli/src/types.ts ] && echo true || echo false)"
check "ProjectConfig 인터페이스" "$(grep -q 'export interface ProjectConfig' packages/cli/src/types.ts && echo true || echo false)"
check "ProjectConfig에 name 필드" "$(grep -q 'name: string' packages/cli/src/types.ts && echo true || echo false)"
check "ProjectConfig에 stack 필드" "$(grep -q 'stack: BackendStack' packages/cli/src/types.ts && echo true || echo false)"
check "ProjectConfig에 deploy 필드" "$(grep -q 'deploy: DeployPlatform' packages/cli/src/types.ts && echo true || echo false)"
check "project-name.ts 존재" "$([ -f packages/cli/src/prompts/project-name.ts ] && echo true || echo false)"
check "inputProjectName export" "$(grep -q 'export.*inputProjectName' packages/cli/src/prompts/project-name.ts && echo true || echo false)"
check "기본값 my-project" "$(grep -q 'my-project' packages/cli/src/prompts/project-name.ts && echo true || echo false)"

# US-002: 배포 선택
check "deploy-selector.ts 존재" "$([ -f packages/cli/src/prompts/deploy-selector.ts ] && echo true || echo false)"
check "selectDeploy export" "$(grep -q 'export.*selectDeploy' packages/cli/src/prompts/deploy-selector.ts && echo true || echo false)"
check "DeployPlatform 타입 (types.ts)" "$(grep -q 'DeployPlatform' packages/cli/src/types.ts && echo true || echo false)"

# US-003: 확인 + 통합
check "confirm.ts 존재" "$([ -f packages/cli/src/prompts/confirm.ts ] && echo true || echo false)"
check "confirmConfig export" "$(grep -q 'export.*confirmConfig' packages/cli/src/prompts/confirm.ts && echo true || echo false)"
check "prompts/index.ts 존재" "$([ -f packages/cli/src/prompts/index.ts ] && echo true || echo false)"
check "runPromptFlow export" "$(grep -q 'export.*runPromptFlow' packages/cli/src/prompts/index.ts && echo true || echo false)"
check "init.ts가 runPromptFlow 호출" "$(grep -q 'runPromptFlow' packages/cli/src/commands/init.ts && echo true || echo false)"

# US-004: 컴파일 + CLI
check "TypeScript 컴파일 성공" "$(cd packages/cli && npx tsc --noEmit 2>&1 && echo true || echo false)"
check "CLI --help 동작" "$(npx tsx packages/cli/src/index.ts --help 2>&1 | grep -q 'agentic-infra' && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
