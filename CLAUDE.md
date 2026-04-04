# Agentic Infra - Claude Code 설정

## 프로젝트 구조

pnpm + Turborepo 기반 모노레포:

```
agentic-infra/
├── packages/
│   ├── cli/          # 대화형 CLI 도구
│   ├── templates/    # 인프라 템플릿
│   └── docs/         # Docusaurus 문서 사이트
├── scripts/
│   └── verify/       # Step별 검증 스크립트
├── package.json      # 루트 (workspaces)
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

## 코딩 컨벤션

- TypeScript strict 모드 필수
- ESModules 사용 (import/export)
- Prettier 포맷팅 적용
- 함수/변수: camelCase
- 타입/인터페이스: PascalCase
- 파일명: kebab-case

## 커밋 메시지 규칙

Conventional Commits 형식: `<type>(<scope>): <설명>`
- type: feat, fix, docs, chore, test, refactor
- scope: cli, templates, docs, monorepo, config
- 플랜 태그: `[Plan: Step X.Y complete]`

## 테스트 실행

```bash
# 전체 빌드
pnpm build

# 전체 테스트
pnpm test

# Step별 검증
bash scripts/verify/step-<id>.sh
```

## 주요 명령어

```bash
pnpm install          # 의존성 설치
pnpm build            # 전체 빌드
pnpm dev              # 개발 서버
pnpm lint             # 린트 검사
pnpm test             # 테스트 실행
pnpm clean            # 빌드 산출물 제거
```
