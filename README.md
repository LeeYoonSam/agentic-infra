# Agentic Infra

AI 기반 인프라/백엔드 자동 구성 도구

대화형 프롬프트를 통해 AWS, Vercel, Supabase 등 서비스 인프라를 자동으로 설정하고,
백엔드 API를 생성하며, 클라이언트에서 바로 사용할 수 있는 구조를 만들어주는 프로젝트입니다.

## 주요 기능

- **백엔드 스택 선택** — Supabase, AWS Lambda, 하이브리드(Supabase + AWS) 중 선택
- **클라이언트 코드 생성** — Web(TypeScript), Android(Kotlin) 또는 둘 다 지원
- **기능 모듈** — 인증(Auth), 데이터베이스, 스토리지, 푸시 알림, 결제, 실시간(Realtime) 모듈 조합
- **배포 플랫폼** — Vercel, AWS, 수동 배포 중 선택
- **템플릿 기반 코드 생성** — EJS 템플릿으로 프로젝트 보일러플레이트 자동 생성

## 빠른 시작

### 필수 조건

- **Node.js** 20 이상
- **pnpm** 9 이상

### 설치 없이 실행

```bash
npx agentic-infra init
```

### 전역 설치 후 실행

```bash
npm install -g agentic-infra
agentic-infra init
```

### 프로젝트 생성 흐름

```
$ npx agentic-infra init

🚀 Agentic Infra - 프로젝트 생성기

? 프로젝트 이름: my-app
? 백엔드 스택: Supabase / AWS / 하이브리드
? 클라이언트 유형: Web / Android / 둘 다
? 기능 모듈: Auth, Database, Storage, ...
? 배포 플랫폼: Vercel / AWS / 수동
```

생성이 완료되면 안내에 따라 `cd my-app && npm install && npm run dev`로 바로 시작할 수 있습니다.

## 프로젝트 구조

pnpm + Turborepo 기반 모노레포입니다.

```
agentic-infra/
├── packages/
│   ├── cli/                        # 대화형 CLI 도구
│   │   ├── src/
│   │   │   ├── commands/           # CLI 명령어 (init)
│   │   │   ├── prompts/            # 대화형 프롬프트 (스택, 클라이언트, 기능 선택)
│   │   │   ├── generators/         # 코드 생성기 (AWS, Supabase, Vercel, 클라이언트)
│   │   │   ├── templates/          # EJS 템플릿 파일
│   │   │   ├── utils/              # 유틸리티 (템플릿 렌더러)
│   │   │   ├── types.ts            # 타입 정의
│   │   │   └── index.ts            # CLI 진입점
│   │   └── package.json
│   └── docs/                       # Docusaurus 문서 사이트
│       └── docs/
│           ├── intro/              # 소개, 빠른 시작, 설치 가이드
│           ├── concepts/           # 핵심 개념 (클라이언트-서버, API, DB, 인증, 서버리스)
│           ├── glossary/           # 용어 사전 (인프라, 백엔드, 네트워크, DB, 인증)
│           └── architecture/       # 아키텍처 다이어그램 (AWS, Supabase, 하이브리드)
├── scripts/
│   └── verify/                     # Step별 검증 스크립트
├── package.json                    # 루트 워크스페이스
├── pnpm-workspace.yaml
├── turbo.json                      # Turborepo 파이프라인 설정
└── tsconfig.base.json              # 공유 TypeScript 설정
```

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **언어** | TypeScript (strict 모드, ES2022) |
| **모노레포** | pnpm Workspaces + Turborepo |
| **CLI 프레임워크** | Commander.js |
| **대화형 프롬프트** | @inquirer/prompts |
| **템플릿 엔진** | EJS |
| **UI 피드백** | chalk (컬러 출력), ora (스피너) |
| **문서** | Docusaurus 3 + React 18 |
| **빌드** | tsc (TypeScript Compiler) |
| **코드 스타일** | Prettier |

## 개발 가이드

### 의존성 설치

```bash
pnpm install
```

### 주요 명령어

```bash
pnpm build      # 전체 빌드
pnpm dev        # 개발 서버 (CLI + 문서)
pnpm lint       # 린트 검사
pnpm test       # 전체 테스트
pnpm clean      # 빌드 산출물 제거
pnpm format     # Prettier 포맷팅
```

### Step별 검증

각 구현 단계를 검증하는 스크립트가 준비되어 있습니다:

```bash
bash scripts/verify/step-0.1.sh    # Step 0.1 검증
bash scripts/verify/step-1.1.sh    # Step 1.1 검증
# ...
```

### 코딩 컨벤션

- TypeScript strict 모드 필수
- ESModules 사용 (`import` / `export`)
- 함수/변수: `camelCase`
- 타입/인터페이스: `PascalCase`
- 파일명: `kebab-case`

### 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

```
<type>(<scope>): <설명>
```

- **type**: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`
- **scope**: `cli`, `templates`, `docs`, `monorepo`, `config`

## 문서

`packages/docs/`에 Docusaurus 기반 문서 사이트가 포함되어 있습니다.

### 문서 카테고리

| 카테고리 | 내용 | 경로 |
|---------|------|------|
| **소개** | 프로젝트 소개, 빠른 시작, 설치 가이드 | `docs/intro/` |
| **핵심 개념** | 클라이언트-서버, API 기초, DB 기초, 인증, 서버리스 | `docs/concepts/` |
| **용어 사전** | 인프라, 백엔드, 네트워크, 데이터베이스, 인증 용어 | `docs/glossary/` |
| **아키텍처** | AWS, Supabase, 하이브리드 구조 다이어그램 | `docs/architecture/` |

### 문서 로컬 실행

```bash
cd packages/docs
pnpm start
```

## 지원 스택 상세

### 백엔드 스택

| 스택 | 설명 |
|------|------|
| **Supabase** | PostgreSQL 기반 BaaS — 인증, DB, 스토리지, 실시간 기능 내장 |
| **AWS** | Lambda + API Gateway — 서버리스 백엔드 |
| **하이브리드** | Supabase(DB/인증) + AWS Lambda(커스텀 로직) 조합 |

### 클라이언트

| 유형 | 생성물 |
|------|--------|
| **Web** | TypeScript API 클라이언트 |
| **Android** | Kotlin API 클라이언트 |
| **둘 다** | Web + Android 동시 생성 |

### 배포 플랫폼

| 플랫폼 | 설명 |
|--------|------|
| **Vercel** | Next.js / 정적 사이트 배포 |
| **AWS** | Lambda + API Gateway 배포 |
| **수동** | 수동 배포용 설정 파일 생성 |

## 라이선스

이 프로젝트는 비공개(Private) 프로젝트입니다.
