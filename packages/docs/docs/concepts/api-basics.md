---
sidebar_position: 2
---

# API란 무엇이고 왜 필요한가?

## API의 개념

### API란?

**API(Application Programming Interface)** 는 두 소프트웨어가 서로 통신하는 방법을 정의한 규칙 또는 약속입니다.

**일상적인 비유:**

자동차의 대시보드를 생각해봅시다. 운전자는 핸들, 페달, 버튼 등으로 자동차를 제어합니다. 운전자는 자동차의 내부 엔진 구조를 몰라도 됩니다. 다시 말해:

- **인터페이스**: 핸들, 페달, 버튼 등
- **내부 구현**: 엔진, 변속기, 제동 시스템
- **약속**: 페달을 밟으면 속도가 줄어든다

API도 동일합니다:

- **인터페이스**: HTTP 엔드포인트
- **내부 구현**: 데이터베이스 쿼리, 비즈니스 로직
- **약속**: `/users/123` 요청을 보내면 사용자 정보를 받는다

### 왜 API가 필요한가?

**1. 분리 (Separation of Concerns)**

백엔드와 프론트엔드가 독립적으로 개발될 수 있습니다:

```
백엔드 팀: 데이터 처리와 저장소 관리
  ↕ (API를 통한 통신)
프론트엔드 팀: UI 구현 및 사용자 경험
```

**2. 재사용성 (Reusability)**

하나의 API는 여러 클라이언트에서 사용할 수 있습니다:

```
웹 브라우저
모바일 앱 (iOS)
모바일 앱 (Android)
데스크톱 애플리케이션
  ↓ (모두 같은 API 사용)
백엔드 서버
```

**3. 보안 (Security)**

서버의 내부 구현을 숨길 수 있습니다:

```
// 클라이언트는 이것만 알면 됨
POST /users
{ "email": "user@example.com", "password": "..." }

// 백엔드는 내부 구현을 비공개로 유지
- 비밀번호 해싱 방식
- 데이터베이스 구조
- 서버 인프라
```

**4. 확장성 (Scalability)**

API를 통한 명확한 계약으로 시스템을 확장할 수 있습니다:

```
v1.0: 기본 기능
  ↓
v1.1: 새로운 기능 추가 (API 확장)
  ↓
v2.0: 구조 변경 (새 API 엔드포인트 제공)
```

## REST API 설계 원칙

REST(Representational State Transfer)는 API 설계의 표준입니다.

### 리소스 (Resource)

REST의 중심은 **리소스** 입니다. 리소스는 데이터의 집합을 나타냅니다:

```
사용자 (Users)
게시물 (Posts)
댓글 (Comments)
주문 (Orders)
```

리소스는 **명사**로 표현합니다:

```
좋음: /users, /posts, /comments
나쁨: /getUsers, /createPost, /deleteComment (동사 사용)
```

### HTTP 메서드 (HTTP Methods)

리소스에 대한 작업은 **HTTP 메서드**로 표현합니다:

| 메서드 | 목적 | 예제 |
|--------|------|------|
| GET | 읽기 | `GET /users/123` - 사용자 조회 |
| POST | 생성 | `POST /users` - 새 사용자 생성 |
| PUT | 전체 업데이트 | `PUT /users/123` - 사용자 정보 전체 변경 |
| PATCH | 부분 업데이트 | `PATCH /users/123` - 사용자 이름만 변경 |
| DELETE | 삭제 | `DELETE /users/123` - 사용자 삭제 |

### 실제 예제

**사용자 관리 API**

```
GET    /users              - 모든 사용자 목록
GET    /users/123          - ID 123인 사용자 조회
POST   /users              - 새 사용자 생성
PUT    /users/123          - ID 123인 사용자 정보 변경
PATCH  /users/123          - ID 123인 사용자의 특정 필드만 변경
DELETE /users/123          - ID 123인 사용자 삭제
```

**게시물 관리 API**

```
GET    /posts              - 모든 게시물 목록
GET    /posts/456          - ID 456인 게시물 조회
POST   /posts              - 새 게시물 작성
PUT    /posts/456          - ID 456인 게시물 수정
DELETE /posts/456          - ID 456인 게시물 삭제
GET    /posts/456/comments - ID 456인 게시물의 댓글 목록
```

### 계층 구조 (Nested Resources)

관련된 리소스는 계층 구조로 표현합니다:

```
사용자 123의 게시물들:
GET /users/123/posts

사용자 123의 게시물 456의 댓글들:
GET /users/123/posts/456/comments

사용자 123의 게시물 456에 댓글 789를 좋아요:
POST /users/123/posts/456/comments/789/likes
```

### 쿼리 매개변수 (Query Parameters)

필터링, 정렬, 페이지네이션은 쿼리 매개변수로 처리합니다:

```
모든 게시물 (페이지 2, 페이지당 10개):
GET /posts?page=2&limit=10

특정 상태의 주문들 (정렬):
GET /orders?status=completed&sort=created_at&order=desc

검색:
GET /users?search=john&role=admin
```

### 상태 코드 (Status Codes)

응답의 상태는 **HTTP 상태 코드**로 나타냅니다:

```
성공:
200 OK                - 요청 성공
201 Created           - 리소스 생성 성공
204 No Content        - 요청 성공 (응답 본문 없음)

실패:
400 Bad Request       - 잘못된 요청
401 Unauthorized      - 인증 필요
403 Forbidden         - 권한 없음
404 Not Found         - 리소스 없음
500 Internal Server   - 서버 오류
```

## JSON 데이터 형식

### JSON이란?

**JSON (JavaScript Object Notation)** 은 데이터를 표현하는 텍스트 형식입니다.

API에서 클라이언트와 서버는 JSON을 통해 데이터를 주고받습니다.

### JSON 구조

**객체 (Object)**

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "active": true
}
```

**배열 (Array)**

```json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" },
  { "id": 3, "name": "Charlie" }
]
```

**중첩된 구조**

```json
{
  "id": 123,
  "name": "John Doe",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "zip": "94102"
  },
  "posts": [
    { "id": 1, "title": "First Post" },
    { "id": 2, "title": "Second Post" }
  ]
}
```

### JSON의 데이터 타입

```json
{
  "string": "텍스트",
  "number": 42,
  "float": 3.14,
  "boolean": true,
  "null": null,
  "object": { "key": "value" },
  "array": [1, 2, 3]
}
```

## API 인증 방법

### API Key

가장 간단한 방식입니다:

```
Authorization: X-API-Key: abc123def456
```

사용 예:

```javascript
fetch('https://api.example.com/users', {
  headers: {
    'X-API-Key': 'abc123def456'
  }
})
```

장점: 간단함
단점: 보안이 낮음 (키가 노출되면 위험)

### Bearer Token (JWT)

더 안전한 방식입니다:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

사용 예:

```javascript
fetch('https://api.example.com/users', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
```

JWT 토큰의 구조:

```
Header.Payload.Signature

Header: 토큰의 타입과 알고리즘
Payload: 사용자 정보 (클레임)
Signature: 토큰의 유효성 검증용
```

### OAuth 2.0

소셜 로그인 (Google, GitHub 등)에 사용됩니다:

```
1. 사용자가 "Google로 로그인" 클릭
2. 사용자가 Google 로그인 페이지로 리다이렉트
3. 사용자가 Google 계정으로 인증
4. Google이 토큰을 앱으로 반환
5. 앱이 토큰을 사용하여 사용자 정보 조회
```

## Postman/curl로 API 테스트하기

### curl 사용하기

**GET 요청**

```bash
curl https://api.example.com/users/123
```

**POST 요청**

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

**인증 헤더 포함**

```bash
curl https://api.example.com/users/123 \
  -H "Authorization: Bearer token123"
```

**PUT 요청 (업데이트)**

```bash
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane"}'
```

**DELETE 요청**

```bash
curl -X DELETE https://api.example.com/users/123
```

### Postman 사용하기

Postman은 GUI 기반 API 테스트 도구입니다:

1. Postman 다운로드 (https://www.postman.com/downloads/)
2. 요청 생성:
   - 메서드 선택 (GET, POST 등)
   - URL 입력
   - 헤더 추가
   - 본문 입력
3. Send 버튼 클릭
4. 응답 확인

## 코드 예제: TypeScript + Fetch API

### 기본 설정

타입 안전성을 위해 데이터 타입을 정의합니다:

```typescript
// API 응답 타입 정의
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

### GET 요청

```typescript
async function getUser(userId: number): Promise<User | null> {
  try {
    const response = await fetch(
      `https://api.example.com/users/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<User> = await response.json();
    return data.data;
  } catch (error) {
    console.error('사용자 조회 실패:', error);
    return null;
  }
}
```

### POST 요청

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

async function createUser(userData: CreateUserRequest): Promise<User | null> {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<User> = await response.json();
    return data.data;
  } catch (error) {
    console.error('사용자 생성 실패:', error);
    return null;
  }
}
```

### API 클라이언트 클래스

```typescript
class ApiClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
}

// 사용
const api = new ApiClient('https://api.example.com', 'token123');
const user = await api.get<User>('/users/123');
const newUser = await api.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
});
```

## Android의 Retrofit/Ktor과 비교

### Retrofit (REST 클라이언트)

**인터페이스 정의**

```kotlin
interface UserApiService {
  @GET("/users/{id}")
  suspend fun getUser(@Path("id") id: String): User

  @POST("/users")
  suspend fun createUser(@Body user: User): User

  @PUT("/users/{id}")
  suspend fun updateUser(
    @Path("id") id: String,
    @Body user: User
  ): User

  @DELETE("/users/{id}")
  suspend fun deleteUser(@Path("id") id: String)
}
```

**사용 방법**

```kotlin
val retrofit = Retrofit.Builder()
  .baseUrl("https://api.example.com")
  .addConverterFactory(GsonConverterFactory.create())
  .build()

val apiService = retrofit.create(UserApiService::class.java)

// GET 요청
val user = apiService.getUser("123")

// POST 요청
val newUser = apiService.createUser(User(name = "John", email = "john@example.com"))
```

### Ktor Client (더 최신)

**요청 정의**

```kotlin
val client = HttpClient {
  install(JsonFeature) {
    serializer = KotlinxSerializer(Json {
      prettyPrint = true
      isLenient = true
    })
  }
  install(HttpTimeout) {
    requestTimeoutMillis = 15000
  }
}

// GET 요청
val user: User = client.get("https://api.example.com/users/123")

// POST 요청
val newUser: User = client.post("https://api.example.com/users") {
  contentType(ContentType.Application.Json)
  body = User(name = "John", email = "john@example.com")
}
```

### 비교표

| 항목 | Retrofit | Ktor | Fetch API |
|------|----------|------|-----------|
| 언어 | Kotlin | Kotlin | JavaScript |
| 선언 방식 | 인터페이스 | 함수 | 함수 |
| 자동 직렬화 | 예 | 예 | 수동 |
| 타입 안전성 | 컴파일 타임 | 컴파일 타임 | 런타임 |
| 비동기 처리 | suspend 함수 | suspend 함수 | Promise/async-await |

## API 버전 관리

API는 시간이 지남에 따라 변경됩니다:

**v1 (초기)**
```
GET /users - 기본 사용자 정보만 반환
```

**v2 (개선)**
```
GET /users - 추가 정보 포함
GET /users?fields=name,email - 필드 선택 가능
```

이를 지원하기 위해:

```
URL 경로에 버전 포함:
GET /v1/users
GET /v2/users

또는

헤더에 버전 포함:
GET /users
Accept-Version: 2.0
```

## 실제 API 문서 읽기

대부분의 공개 API는 문서를 제공합니다:

**GitHub API**
```
https://docs.github.com/en/rest

GET /repos/{owner}/{repo}/issues - 리포지토리의 이슈 조회
```

**OpenWeather API**
```
https://openweathermap.org/api

GET /data/2.5/weather?q={city}&appid={API_KEY} - 도시 날씨 조회
```

## 정리

API는 웹 서비스의 핵심입니다:

1. **리소스**: 명사로 표현하는 데이터 (사용자, 게시물 등)
2. **메서드**: 동사로 표현하는 작업 (GET, POST, PUT, DELETE)
3. **상태 코드**: 응답의 성공/실패 여부 표현
4. **JSON**: 데이터 형식
5. **인증**: API 사용 권한 확인
6. **REST**: API 설계의 표준

다음 가이드에서는 데이터를 저장하는 방법인 데이터베이스를 다룹니다.
