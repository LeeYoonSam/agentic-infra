---
sidebar_position: 2
---

# AWS 아키텍처

## 전체 구조

```mermaid
graph TB
    Client[클라이언트<br/>Web/Android] --> CloudFront[CloudFront<br/>CDN/정적 자산]
    Client --> APIGateway[API Gateway<br/>REST/WebSocket]
    
    APIGateway --> Lambda[Lambda<br/>비즈니스 로직]
    Lambda --> DynamoDB[(DynamoDB<br/>NoSQL DB)]
    Lambda --> RDS[(RDS<br/>PostgreSQL)]
    Lambda --> S3[S3<br/>파일 저장소]
    
    Client --> Cognito[Cognito<br/>인증/인가]
    APIGateway --> Cognito
    
    Lambda --> SNS[SNS<br/>메시지 발행]
    SNS --> SQS[SQS<br/>메시지 큐]
    SQS --> Lambda2[Lambda<br/>배경 작업]
    
    Lambda --> CloudWatch[CloudWatch<br/>로그/모니터링]
    Lambda2 --> CloudWatch
    
    style Client fill:#3b82f6,color:#fff
    style APIGateway fill:#f59e0b,color:#fff
    style Lambda fill:#f59e0b,color:#fff
    style Lambda2 fill:#f59e0b,color:#fff
    style DynamoDB fill:#22c55e,color:#fff
    style RDS fill:#22c55e,color:#fff
```

## 인증 플로우

```mermaid
sequenceDiagram
    participant C as 클라이언트
    participant CG as Cognito
    participant AG as API Gateway
    participant L as Lambda
    participant DB as 데이터베이스
    
    C->>CG: 1. 로그인 요청<br/>(사용자명/비밀번호)
    CG-->>C: 2. ID Token + Access Token 반환
    C->>AG: 3. API 호출<br/>(Access Token 포함)
    AG->>AG: 4. Token 검증<br/>(Cognito 공개키)
    AG->>L: 5. Lambda 호출<br/>(인증된 요청)
    L->>DB: 6. 데이터 조회
    DB-->>L: 7. 결과 반환
    L-->>AG: 8. JSON 응답
    AG-->>C: 9. 응답 전달
```

## 배포 플로우

```mermaid
graph LR
    Code[소스 코드<br/>Git Push] --> CDK[AWS CDK<br/>Infrastructure as Code]
    CDK --> CF[CloudFormation<br/>Stack 정의]
    CF --> IAM[IAM 역할<br/>권한 설정]
    CF --> Provision[리소스 프로비저닝]
    
    Provision --> APIGW[API Gateway 배포]
    Provision --> LambdaFn[Lambda 함수 배포]
    Provision --> DB_Deploy[DB 마이그레이션]
    Provision --> S3_Deploy[S3 버킷 생성]
    
    APIGW --> Prod[프로덕션 환경]
    LambdaFn --> Prod
    DB_Deploy --> Prod
    S3_Deploy --> Prod
    
    style Code fill:#3b82f6,color:#fff
    style CDK fill:#f59e0b,color:#fff
    style CF fill:#f59e0b,color:#fff
    style Prod fill:#22c55e,color:#fff
```

## 컴포넌트 설명

### API Gateway
클라이언트의 모든 API 요청의 진입점입니다. REST API와 WebSocket을 지원하며, 요청 검증, 인증, 속도 제한 등을 처리합니다.

### Lambda
서버리스 컴퓨팅입니다. API 요청에 대한 비즈니스 로직을 처리하고, 이벤트 기반으로 자동 실행됩니다.

### Cognito
사용자 인증과 권한 관리를 담당합니다. 사용자 풀과 ID 풀을 통해 복잡한 인증 정책을 구현할 수 있습니다.

### DynamoDB
NoSQL 데이터베이스입니다. 확장성이 뛰어나고, 실시간 데이터 처리에 적합합니다.

### RDS
관계형 데이터베이스(PostgreSQL, MySQL 등)입니다. 복잡한 쿼리와 트랜잭션이 필요할 때 사용합니다.

### S3
객체 스토리지입니다. 파일 업로드, 정적 웹사이트 호스팅, 백업 등에 사용됩니다.

### SNS/SQS
메시지 큐와 발행-구독 패턴을 지원합니다. Lambda 함수 간의 비동기 통신에 사용됩니다.

### CloudWatch
로그, 메트릭, 알람을 관리하는 모니터링 서비스입니다.

## 장점과 단점

| 장점 | 단점 |
|------|------|
| 무한한 확장성과 안정성 | 학습 곡선이 가파름 |
| 다양한 서비스 조합 가능 | 비용 계산이 복잡함 |
| 엔터프라이즈 수준의 보안 | 구성이 복잡할 수 있음 |
| IAM을 통한 세밀한 권한 제어 | vendor lock-in |
| 글로벌 인프라 | 무료 티어 제한적 |
| 24/7 기술 지원 | Cold start 지연 (Lambda) |
