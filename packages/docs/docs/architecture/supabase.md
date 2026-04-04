---
sidebar_position: 1
---

# Supabase 아키텍처

## 전체 구조

```mermaid
graph TB
    Client[클라이언트<br/>Web/Android] --> Auth[Supabase Auth<br/>인증/인가]
    Client --> API[Edge Functions<br/>서버리스 API]
    Client --> Realtime[Realtime<br/>실시간 구독]
    Client --> Storage[Storage<br/>파일 저장소]
    
    Auth --> DB[(PostgreSQL<br/>데이터베이스)]
    API --> DB
    Realtime --> DB
    
    DB --> RLS{RLS 정책<br/>행 수준 보안}
    
    style Client fill:#3b82f6,color:#fff
    style DB fill:#22c55e,color:#fff
    style Auth fill:#f59e0b,color:#fff
```

## 데이터 흐름

```mermaid
sequenceDiagram
    participant C as 클라이언트
    participant A as Supabase Auth
    participant E as Edge Function
    participant D as PostgreSQL
    
    C->>A: 1. 로그인 요청
    A-->>C: 2. JWT 토큰 반환
    C->>E: 3. API 호출 (JWT 포함)
    E->>D: 4. 데이터 조회 (RLS 적용)
    D-->>E: 5. 필터링된 결과
    E-->>C: 6. JSON 응답
```

## 컴포넌트 설명

### PostgreSQL 데이터베이스
Supabase의 핵심입니다. 모든 데이터가 PostgreSQL에 저장되며, Row Level Security(RLS)로 행 수준의 접근 제어를 합니다.

### Supabase Auth
이메일/비밀번호, Google, GitHub 등 다양한 인증 방식을 지원합니다. JWT 토큰을 발행하여 API 호출 시 사용합니다.

### Edge Functions
Deno 기반의 서버리스 함수입니다. 복잡한 비즈니스 로직을 서버에서 처리할 때 사용합니다.

### Realtime
PostgreSQL의 변경사항을 실시간으로 클라이언트에 전달합니다. 채팅, 알림 등에 적합합니다.

### Storage
파일 업로드/다운로드를 위한 S3 호환 스토리지입니다. 이미지, 문서 등을 저장합니다.

## 장점과 단점

| 장점 | 단점 |
|------|------|
| 빠른 시작 (5분 만에 백엔드 구축) | 복잡한 비즈니스 로직 처리 제한적 |
| PostgreSQL의 강력한 기능 활용 | Edge Functions 콜드 스타트 |
| RLS로 보안 정책 DB 레벨 적용 | 자체 호스팅 시 운영 부담 |
| 실시간 기능 내장 | vendor lock-in |
| 무료 티어 제공 | 대규모 트래픽 시 비용 증가 |
