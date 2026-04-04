---
sidebar_position: 5
---

# 서버리스 아키텍처란?

## 서버리스란?

"서버리스(Serverless)"는 "서버가 없다"는 뜻이 아닙니다. **서버를 관리할 필요가 없다**는 의미입니다.

### 이름의 혼동

```
전통적: 서버를 직접 관리
  ↓
        서버 구매, 설치, 유지보수, 확장

서버리스: 서버 관리는 클라우드 제공자가 함
  ↓
        코드만 작성하면 됨
```

## 전통적 서버 vs 서버리스

### 전통적 서버 (예: EC2)

**구조**

```
AWS EC2 인스턴스
├── OS
├── Node.js 런타임
├── 라이브러리
└── 당신의 애플리케이션
```

**관리할 것들**

```
1. 서버 구매
   - CPU, 메모리, 스토리지 선택
   - 인스턴스 생성

2. 운영체제 설정
   - OS 선택 (Linux, Windows)
   - 보안 패치 적용

3. 런타임 설정
   - Node.js, Python 등 설치
   - 라이브러리 설치

4. 코드 배포
   - 서버에 코드 업로드
   - 시작 명령 실행

5. 모니터링
   - CPU, 메모리 사용량 확인
   - 로그 확인

6. 확장
   - 사용자 증가 시 더 강력한 서버로 업그레이드
   - 또는 여러 서버 운영
```

**비용**

```
서버를 항상 실행하므로 비용을 항상 지불합니다.

예: t3.micro 인스턴스
월 약 $10 (항상)
```

### 서버리스 (예: AWS Lambda)

**구조**

```
AWS Lambda 함수
└── 당신의 코드만 작성
    (OS, 런타임 등은 AWS가 관리)
```

**관리할 것들**

```
1. 코드만 작성
   - JavaScript, Python, Go 등으로 함수 작성

2. 함수 업로드
   - AWS 콘솔이나 CLI로 업로드

3. 트리거 설정
   - API 호출, 이벤트, 스케줄 등

4. 끝!
```

**비용**

```
실행한 만큼만 비용을 지불합니다.

예: 1초마다 1개 요청, 월 300만 개 요청
월 약 $0.60 (매우 저렴함)
```

## AWS Lambda 동작 원리

### Lambda 함수

```javascript
// 간단한 Lambda 함수
exports.handler = async (event, context) => {
  console.log('이벤트:', event);
  
  // 처리
  const result = event.body ? JSON.parse(event.body) : {};
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      data: result
    })
  };
};
```

**parameter 설명**

- `event`: 함수를 실행하게 한 데이터
  ```
  API 호출: HTTP 요청 정보
  S3 이벤트: 파일 업로드 정보
  DynamoDB: 데이터베이스 변경 정보
  ```

- `context`: 함수 실행 환경 정보
  ```
  함수 이름, 실행 시간, 메모리 제한 등
  ```

### 함수 실행 흐름

```
1. 개발자가 코드 작성
   ↓
2. Lambda에 업로드
   ↓
3. 트리거 발생 (예: API 호출)
   ↓
4. AWS가 컨테이너 생성 (첫 실행만)
   ↓
5. 코드 실행
   ↓
6. 결과 반환
   ↓
7. 사용하지 않으면 컨테이너 삭제
   (또는 대기 중)
```

### 실제 예제: API Gateway + Lambda

```javascript
// Lambda 함수
exports.handler = async (event) => {
  // API Gateway에서 받은 요청
  const { httpMethod, path, body } = event;
  
  if (httpMethod === 'POST' && path === '/users') {
    // 사용자 생성
    const data = JSON.parse(body);
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: Date.now(),
        ...data
      })
    };
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ message: '엔드포인트 없음' })
  };
};
```

**배포 및 사용**

```
1. AWS Lambda 콘솔에서 함수 생성
2. 위 코드 붙여넣기
3. API Gateway 생성
4. Lambda와 연결
5. 테스트

URL: https://abc123.execute-api.us-east-1.amazonaws.com/prod/users

POST /users
{
  "name": "Alice",
  "email": "alice@example.com"
}

응답:
{
  "id": 1234567890,
  "name": "Alice",
  "email": "alice@example.com"
}
```

## Supabase Edge Functions 동작 원리

### Edge Functions란?

Lambda는 미국 데이터센터에서만 실행되어 지연 시간(Latency)이 있을 수 있습니다.

**Edge Functions**는 전 세계의 여러 서버에서 사용자 가까이 있는 곳에서 실행됩니다:

```
서울에 있는 사용자 → 서울 근처 서버에서 함수 실행 (빠름)
런던에 있는 사용자 → 런던 근처 서버에서 함수 실행 (빠름)
```

### Supabase Edge Functions 예제

```typescript
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { name, email } = await req.json()

    // 데이터베이스에 사용자 추가
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email }])
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 201
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
```

**배포**

```bash
# Supabase CLI 설치
npm install -g supabase

# 함수 생성
supabase functions new create_user

# 위 코드 저장

# 배포
supabase functions deploy create_user
```

**사용**

```javascript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/create_user',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      name: 'Alice',
      email: 'alice@example.com'
    })
  }
);

const result = await response.json();
console.log(result);
```

### Lambda vs Supabase Edge Functions

| 항목 | Lambda | Edge Functions |
|------|--------|----------------|
| 속도 | 최대 100ms 지연 가능 | 매우 빠름 (전 세계 위치) |
| 시작 시간 | 느림 (Cold Start) | 빠름 |
| 비용 | 실행 횟수 + 지속 시간 | 더 비쌈 |
| 관리 | AWS 관리 | Supabase 관리 |

## Cold Start 문제와 대응

### Cold Start란?

Lambda 함수가 처음 호출될 때, AWS는:

1. 컨테이너 생성
2. 런타임 초기화
3. 코드 로드
4. 함수 실행

이 과정에서 시간이 걸립니다.

### Cold Start 예제

```
첫 요청 (Cold Start)
|
├─ 컨테이너 생성: ~1초
├─ 런타임 초기화: ~0.5초
├─ 코드 로드: ~0.2초
└─ 함수 실행: ~0.1초
─────────────────
총 시간: ~1.8초 ❌ (느림)

두 번째 요청 (Warm Start)
|
└─ 함수 실행: ~0.1초
─────────────────
총 시간: ~0.1초 ✓ (빠름)

함수를 사용하지 않으면
(약 5분 후 컨테이너 삭제)
|
다시 Cold Start 발생...
```

### Cold Start 대응 방법

**1. 예열 (Provisioned Concurrency)**

```
AWS Lambda에서 항상 함수를 준비된 상태로 유지

비용: 추가 비용 발생
장점: Cold Start 없음
```

**2. 정기적 호출**

```javascript
// CloudWatch Events로 5분마다 함수 호출
exports.handler = (event) => {
  if (event.source === 'aws.events') {
    // 예열용 호출, 실제 처리 안 함
    return { statusCode: 200 };
  }
  
  // 실제 요청 처리
  return handleActualRequest(event);
};
```

**3. 번들 크기 최소화**

```
큰 라이브러리는 로드 시간을 증가시킵니다.

나쁜 예:
- 2MB 라이브러리 5개: Cold Start 길어짐

좋은 예:
- 필요한 것만 포함: Cold Start 단축
```

**4. 레이어 사용**

```
공통 라이브러리를 레이어로 분리

레이어: 공통 라이브러리 (미리 최적화)
함수: 비즈니스 로직만
```

## 서버리스 장단점

### 장점

**1. 비용**
```
사용한 만큼만 비용 지불
유휴 시간에 비용 없음

예: 
  전통 서버: 월 $200 (항상)
  Lambda: 월 $20 (사용한 것만)
```

**2. 확장성**
```
자동으로 확장됨

사용자 100명 → 1000명 → 10000명
개발자가 할 것 없음 (AWS가 처리)
```

**3. 운영 부담 감소**
```
관리할 것:
  전통: OS, 런타임, 보안 패치, 모니터링
  서버리스: 코드만
```

**4. 배포 간단**
```
전통: 코드 작성 → 패키징 → 서버에 배포 → 시작
서버리스: 코드 작성 → 배포 (1단계)
```

### 단점

**1. Cold Start**
```
첫 실행이 느릴 수 있음
실시간 응답이 중요한 경우 문제
```

**2. 시간 제한**
```
Lambda: 최대 15분 실행 시간
장시간 처리 불가능 (배치 작업 등)
```

**3. 상태 저장 불가**
```
함수는 상태를 유지하지 않음
메모리는 함수 실행 동안만 유지
데이터 저장은 데이터베이스에만 가능

나쁜 예:
let counter = 0;
exports.handler = () => {
  counter++;  // 다음 실행에 0으로 리셋됨
  return { count: counter };
};
```

**4. 모니터링 복잡**
```
분산된 함수들
성능 추적이 복잡할 수 있음
```

**5. 보안**
```
함수 내 보안 관리 필요
잘못된 설정으로 공개될 수 있음
```

## 비용 구조 (요청당 과금)

### AWS Lambda 가격

```
Free Tier (매월):
- 100만 요청: 무료
- 400,000 GB-초: 무료

이후:
- 요청당 $0.0000002 (100만 요청당 $0.20)
- 컴퓨팅 시간: GB-초당 $0.0000166667
```

**계산 예**

```
월간 500만 요청, 평균 100ms 실행 시간, 128MB 메모리

요청 비용:
  (500만 - 100만) × $0.0000002 = $0.80

컴퓨팅 비용:
  500만 × 0.1초 × 128MB/1024 = 62,500 GB-초
  62,500 × $0.0000166667 = $1.04

총 비용: $1.84/월
```

**전통 서버와 비교**

```
AWS EC2 (t3.micro)
월 약 $10

Lambda
월 약 $1.84 (위 예제 기준)
```

## 언제 서버리스를 쓰면 좋은가?

### 적합한 사용 사례

**1. 이벤트 기반 처리**
```
파일 업로드 시 자동 처리
이메일 전송
알림 발송
```

```javascript
// S3에 파일 업로드되면 자동 실행
exports.handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  
  // 이미지 리사이징, 변환 등
  console.log(`파일 처리: ${bucket}/${key}`);
};
```

**2. API 엔드포인트**
```
간단한 REST API
마이크로서비스
웹훅 처리
```

**3. 배치 작업**
```
매일 밤 데이터 처리
주 1회 리포트 생성
정기적 데이터 정리
```

```javascript
// CloudWatch Events로 매일 자정에 실행
exports.handler = async () => {
  // 하루 데이터 집계
  const stats = await aggregateDailyStats();
  await saveToDatabase(stats);
};
```

**4. 웹훅**
```
GitHub 이벤트 처리
결제 알림 처리
외부 서비스 연동
```

### 부적합한 사용 사례

**1. 장시간 실행**
```
영상 인코딩: 1시간 필요
데이터 분석: 30분 필요
Lambda 제한: 15분
```

**2. 상태 유지 필요**
```
실시간 채팅 (연결 유지)
실시간 게임 서버
```

**3. 높은 예측 가능성**
```
항상 높은 사용량
지속적인 요청

서버리스: 예측 불가능한 부하
전통 서버: 일정한 비용
```

## 코드 예제: Lambda + API Gateway

### Express 스타일 Lambda 함수

```javascript
const serverless = require('serverless-http');
const express = require('express');

const app = express();
app.use(express.json());

// 사용자 목록
app.get('/users', async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

// 사용자 조회
app.get('/users/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  if (!user) {
    return res.status(404).json({ message: '사용자 없음' });
  }
  res.json(user);
});

// 사용자 생성
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await createUser(name, email);
  res.status(201).json(user);
});

// Lambda 핸들러로 변환
exports.handler = serverless(app);

// 헬퍼 함수들
async function getUsers() {
  // 데이터베이스 조회
  return [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
}

async function getUser(id) {
  const users = await getUsers();
  return users.find(u => u.id === parseInt(id));
}

async function createUser(name, email) {
  // 데이터베이스에 저장
  return { id: Date.now(), name, email };
}
```

### Terraform으로 배포

```hcl
provider "aws" {
  region = "us-east-1"
}

# Lambda 함수
resource "aws_lambda_function" "api" {
  filename      = "function.zip"
  function_name = "user-api"
  role          = aws_iam_role.lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
}

# API Gateway
resource "aws_apigatewayv2_api" "api" {
  name          = "user-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "api" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.api.invoke_arn
}

resource "aws_apigatewayv2_route" "api" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.api.id}"
}

# IAM 역할
resource "aws_iam_role" "lambda" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}
```

## Android 개발자를 위한 비유

Android 앱 개발 경험에 비추어 생각해봅시다:

```
전통 서버:
- 자신의 기기에서 앱 실행
- 기기 구매, 충전, 유지보수 (직접)
- 사용하지 않아도 전기료 지불

서버리스:
- 클라우드 기기에서 앱 실행
- 필요할 때만 기기 켜짐 (자동)
- 실행한 만큼만 비용 지불

Room 데이터베이스:
- 로컬 저장소 (앱 내부)
- 데이터는 기기 내부에만 존재

Firestore:
- 클라우드 데이터베이스
- 여러 기기에서 접근 가능

Lambda:
- 클라우드 함수 실행
- 이벤트 발생하면 자동 실행
```

## 정리

서버리스는 현대 백엔드 개발의 중요한 패러다임입니다:

1. **비용**: 사용한 만큼만 지불
2. **확장성**: 자동으로 확장됨
3. **운영**: 코드만 관리하면 됨
4. **Speed**: 배포가 간단함
5. **단점**: Cold Start, 시간 제한
6. **사용처**: 이벤트 기반, API, 배치 작업

서버리스가 모든 상황에 적합하지는 않지만, 올바른 상황에서 사용하면 매우 강력합니다.
