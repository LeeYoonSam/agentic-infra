# Contributing Guide - Agentic Infra

이 문서는 프로젝트의 작업 프로세스를 표준화합니다.

---

## 1. 커밋 단위 작업 규칙

| 규칙 | 설명 |
|------|------|
| 1 Task = 1 Commit | 마스터 플랜의 각 Step/Task 완료 시 개별 커밋 |
| 커밋 메시지 형식 | `<type>(<scope>): <설명>` (Conventional Commits) |
| 플랜 태그 | 커밋 메시지에 `[Plan: Step X.Y complete]` 태그 추가 |

### 커밋 타입

| type | 용도 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `chore` | 빌드, 설정 등 기타 변경 |
| `test` | 테스트 추가/수정 |
| `refactor` | 코드 리팩토링 |

### scope 예시

`cli`, `templates`, `docs`, `monorepo`, `gitignore`, `config`

### 커밋 메시지 예시

```
feat(monorepo): pnpm workspace + Turborepo 초기 설정 [Plan: Step 1.1 complete]
```

---

## 2. 플랜 상태 추적 규칙

마스터 플랜(`.omc/plans/agentic-infra-master-plan.md`)의 체크박스를 작업 상태와 동기화합니다.

### 상태 표시

| 상태 | 표시 | 의미 |
|------|------|------|
| 미착수 | `- [ ]` | 아직 시작하지 않음 |
| 진행중 | `- [~]` | 작업 중 (현재 진행) |
| 완료 | `- [x]` | 구현 + 검증 테스트 통과 |
| 차단 | `- [!]` | 선행 작업 또는 외부 의존성으로 차단됨 |

### 동기화 규칙

1. 각 Task 커밋 시, 마스터 플랜의 해당 항목 체크박스를 `[x]`로 업데이트
2. 플랜 업데이트도 같은 커밋에 포함 (코드 변경 + 플랜 상태 업데이트 = 1 커밋)
3. 커밋 메시지에 `[Plan: Step X.Y complete]` 태그 추가

---

## 3. 검증 테스트 작성 규칙 (TDD-lite)

모든 Task는 다음 사이클을 따릅니다:

```
1. 검증 스크립트 작성 (test first)
   └─ scripts/verify/<step-id>.sh 생성

2. 구현
   └─ 코드 작성/수정

3. 검증 실행
   └─ bash scripts/verify/<step-id>.sh

4. 실패 시 → 2번으로 돌아가 수정
   성공 시 → 플랜 상태 업데이트 + 커밋
```

### 검증 스크립트 규칙

- **위치**: `scripts/verify/<step-id>.sh` (예: `scripts/verify/step-1.1.sh`)
- **출력**: 각 검증 항목별 `PASS` / `FAIL` 표시
- **종료 코드**: 모든 항목 통과 시 `exit 0`, 하나라도 실패 시 `exit 1`

### 검증 스크립트 템플릿

```bash
#!/bin/bash
# Verification: Step X.Y - <설명>
# Acceptance Criteria 기반 자동 검증

PASS=0
FAIL=0

check() {
  local desc="$1"
  local result="$2"
  if [ "$result" = "true" ]; then
    echo "  PASS: $desc"
    ((PASS++))
  else
    echo "  FAIL: $desc"
    ((FAIL++))
  fi
}

echo "=== Step X.Y Verification ==="

# 검증 항목들...
check "항목 설명" "$([ 조건 ] && echo true || echo false)"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
```

---

## 4. 작업 흐름 요약

```
┌─────────────────────────────────────────┐
│  1. 검증 스크립트 작성 (scripts/verify/) │
│         ↓                                │
│  2. 구현 작업                            │
│         ↓                                │
│  3. 검증 스크립트 실행                    │
│         ↓                                │
│    FAIL? → 2번으로 돌아감                 │
│    PASS? ↓                               │
│  4. 마스터 플랜 체크박스 업데이트          │
│         ↓                                │
│  5. 커밋 (코드 + 플랜 상태 + 검증스크립트)│
│         ↓                                │
│  6. 다음 Task로 이동                     │
└─────────────────────────────────────────┘
```
