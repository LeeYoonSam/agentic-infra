---
sidebar_position: 1
---

# 웹 서비스는 어떻게 동작하는가?

## 개요

웹 서비스의 핵심은 **클라이언트(Client)** 와 **서버(Server)** 의 상호작용입니다. Android 앱을 만들어본 경험이 있다면, 이미 이 개념을 부분적으로 이해하고 있습니다. 이 가이드에서는 웹 서비스가 작동하는 기본 원리를 자세히 설명합니다.

## 클라이언트-서버 모델이란?

### 기본 개념

**클라이언트-서버 모델**은 컴퓨터 네트워크에서 가장 기본적인 아키텍처입니다:

- **클라이언트**: 사용자의 브라우저, Android 앱, 모바일 앱 등 정보를 요청하는 프로그램
- **서버**: 정보를 저장하고 클라이언트의 요청에 응답하는 원격 컴퓨터

### Android 앱과의 비유

Android 앱을 개발할 때, 다음과 같은 상황을 생각해봅시다:

1. 사용자가 "사용자 정보 조회" 버튼을 클릭
2. 앱이 네트워크 요청을 보냄
3. 서버가 데이터를 처리하고 응답
4. 앱이 응답을 받아 UI를 업데이트

웹 서비스도 동일한 원리입니다:

1. 사용자가 웹 브라우저에서 버튼을 클릭
2. JavaScript가 서버에 요청을 보냄
3. 서버가 데이터를 처리하고 응답
4. 웹 페이지가 응답을 받아 화면을 업데이트

## 요청(Request)과 응답(Response) 흐름

### HTTP 통신 주기

웹 서비스는 **HTTP(HyperText Transfer Protocol)** 를 사용하여 통신합니다. 모든 통신은 요청-응답 주기를 따릅니다:

```
클라이언트 ─────────────────────────► 서버
        (HTTP Request 요청)

서버 ──────────────────────────► 클라이언트
   (HTTP Response 응답)
```

### 요청의 구성 요소

HTTP 요청은 다음 요소들로 구성됩니다:

**1. 요청 메서드(HTTP Method)**
- `GET`: 서버에서 데이터를 가져옴 (데이터 조회)
- `POST`: 서버로 데이터를 보냄 (데이터 생성)
- `PUT`: 기존 데이터를 업데이트
- `DELETE`: 데이터를 삭제

**2. URL(엔드포인트)**
```
https://api.example.com/users/123
```
- `https://`: 프로토콜 (암호화된 연결)
- `api.example.com`: 서버 주소
- `/users/123`: 리소스 경로

**3. 헤더(Headers)**
요청에 대한 메타정보:
```
Content-Type: application/json
Authorization: Bearer token123
```

**4. 본문(Body)**
`POST`, `PUT` 요청에 포함되는 데이터:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 응답의 구성 요소

HTTP 응답도 유사한 구조를 가집니다:

**1. 상태 코드(Status Code)**
- `2xx`: 성공 (예: 200 OK)
- `3xx`: 리다이렉트 (예: 301 Moved Permanently)
- `4xx`: 클라이언트 오류 (예: 404 Not Found)
- `5xx`: 서버 오류 (예: 500 Internal Server Error)

**2. 헤더(Headers)**
응답에 대한 메타정보:
```
Content-Type: application/json
Cache-Control: max-age=3600
```

**3. 본문(Body)**
실제 데이터:
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15"
}
```

## 프론트엔드 vs 백엔드

### 역할 분담

웹 서비스는 두 부분으로 나뉩니다:

**프론트엔드 (Frontend)**
- 사용자가 보는 부분
- HTML, CSS, JavaScript로 작성
- 브라우저에서 실행됨
- 사용자 인터페이스와 상호작용 처리
- 예: React, Vue, Angular

**백엔드 (Backend)**
- 사용자가 보지 못하는 부분
- 서버에서 실행됨
- 데이터베이스와 상호작용
- 비즈니스 로직 처리
- API 제공
- 예: Node.js, Python, Java, Go

### 예시: SNS 게시물 조회

사용자가 소셜 미디어에서 게시물을 조회하는 과정:

1. **프론트엔드**: 사용자가 "새로고침" 버튼을 클릭
2. **프론트엔드**: JavaScript가 백엔드로 `/posts` 요청을 보냄
3. **백엔드**: 데이터베이스에서 게시물을 조회
4. **백엔드**: 게시물 목록을 JSON으로 응답
5. **프론트엔드**: JavaScript가 응답을 받아 HTML로 변환
6. **프론트엔드**: 웹 페이지에 게시물 표시

## URL 구조 이해하기

### URL의 각 부분

```
https://api.example.com:8080/v1/users/123?status=active&limit=10
```

**1. 프로토콜 (Protocol)**
```
https://
```
- `https`: 암호화된 연결
- `http`: 암호화되지 않은 연결 (보안이 낮음)

**2. 도메인 (Domain)**
```
api.example.com
```
- 서버의 주소
- DNS를 통해 IP 주소로 변환됨

**3. 포트 (Port)**
```
:8080
```
- 서버의 특정 포트를 지정
- HTTP: 기본값 80
- HTTPS: 기본값 443
- 개발 중에는 3000, 8000, 8080 등을 사용

**4. 경로 (Path)**
```
/v1/users/123
```
- `/v1`: API 버전
- `/users`: 리소스 유형
- `/123`: 특정 리소스의 ID

**5. 쿼리 문자열 (Query String)**
```
?status=active&limit=10
```
- 필터링, 정렬, 페이지네이션 등의 옵션 전달
- `?`로 시작
- `&`로 여러 개 연결

### 실제 예제

```
https://api.github.com/users/torvalds/repos?per_page=10&sort=updated

프로토콜: https
도메인: api.github.com
경로: /users/torvalds/repos
쿼리: per_page=10&sort=updated
```

이 URL은 "Linus Torvalds의 저장소 목록을 조회하되, 페이지당 10개씩 보여주고 업데이트 시간순으로 정렬하라"는 의미입니다.

## HTTP 상태 코드

### 2xx - 성공

**200 OK**
```
요청이 성공적으로 처리됨
일반적인 성공 응답
```

**201 Created**
```
새로운 리소스가 생성됨
POST 요청의 성공적인 응답
```

**204 No Content**
```
요청은 성공했지만 응답 본문이 없음
DELETE 요청의 응답 등
```

### 4xx - 클라이언트 오류

**400 Bad Request**
```
요청이 잘못되었음
필수 필드가 누락되었거나 잘못된 형식
```

**401 Unauthorized**
```
인증이 필요함
로그인하지 않았거나 토큰이 없음
```

**403 Forbidden**
```
권한이 없음
인증은 되었지만 접근 권한이 없음
```

**404 Not Found**
```
요청한 리소스를 찾을 수 없음
URL이 잘못되었거나 리소스가 삭제됨
```

### 5xx - 서버 오류

**500 Internal Server Error**
```
서버에서 예상하지 못한 오류 발생
백엔드 코드의 버그
```

**502 Bad Gateway**
```
게이트웨이 오류
서버가 응답하지 않음
```

**503 Service Unavailable**
```
서버가 일시적으로 사용 불가능
서버 유지보수 중
```

## 코드 예제: Fetch API

### GET 요청 (데이터 조회)

```javascript
// 사용자 정보 조회
fetch('https://api.example.com/users/123')
  .then(response => response.json())
  .then(data => {
    console.log('사용자:', data);
    // 응답 데이터를 사용하여 UI 업데이트
  })
  .catch(error => {
    console.error('오류:', error);
  });
```

### POST 요청 (데이터 생성)

```javascript
// 새 사용자 생성
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('생성된 사용자:', data);
  })
  .catch(error => {
    console.error('오류:', error);
  });
```

### 에러 처리

```javascript
fetch('https://api.example.com/users/999')
  .then(response => {
    // HTTP 상태 코드 확인
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('사용자:', data);
  })
  .catch(error => {
    if (error instanceof TypeError) {
      console.error('네트워크 오류:', error);
    } else {
      console.error('응답 오류:', error);
    }
  });
```

### async/await 사용 (최신 방식)

```javascript
async function fetchUser(userId) {
  try {
    const response = await fetch(
      `https://api.example.com/users/${userId}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('사용자 조회 실패:', error);
    return null;
  }
}

// 사용
const user = await fetchUser(123);
if (user) {
  console.log('사용자:', user);
}
```

## Android의 Retrofit과 비교

### 개념 매핑

Android 개발자라면 Retrofit을 통해 이미 비슷한 작업을 했을 것입니다. 비교해봅시다:

**Retrofit 인터페이스**
```kotlin
interface ApiService {
  @GET("/users/{id}")
  suspend fun getUser(@Path("id") userId: String): User
  
  @POST("/users")
  @Headers("Content-Type: application/json")
  suspend fun createUser(@Body user: User): User
}
```

**JavaScript Fetch API**
```javascript
async function getUser(userId) {
  const response = await fetch(`/users/${userId}`);
  return response.json();
}

async function createUser(user) {
  const response = await fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return response.json();
}
```

### 차이점

| 항목 | Retrofit (Android) | Fetch API (JavaScript) |
|------|-------------------|----------------------|
| 정의 방식 | 인터페이스 + 주석 | 함수 호출 |
| 타입 안전성 | 컴파일 타임 | 런타임 |
| 자동 직렬화 | 기본 제공 | 수동 (`JSON.stringify`) |
| 에러 처리 | 예외 처리 | Promise 체인 또는 try-catch |
| 비동기 처리 | suspend 함수 | Promise/async-await |

### 실제 비교 예제

**Retrofit (Android/Kotlin)**
```kotlin
class UserRepository(private val apiService: ApiService) {
  suspend fun getUser(id: String): User {
    return apiService.getUser(id)
  }
}

// 사용
viewModelScope.launch {
  val user = userRepository.getUser("123")
  updateUI(user)
}
```

**Fetch API (JavaScript)**
```javascript
class UserRepository {
  async getUser(id) {
    const response = await fetch(`/users/${id}`);
    return response.json();
  }
}

// 사용
const user = await userRepository.getUser("123");
updateUI(user);
```

## 실시간 통신 vs 요청-응답

### 폴링 (Polling)

서버에 계속 요청을 보내는 방식:

```javascript
// 3초마다 서버에 새로운 메시지가 있는지 확인
setInterval(async () => {
  const response = await fetch('/messages/new');
  const messages = await response.json();
  updateUI(messages);
}, 3000);
```

문제점:
- 비효율적 (많은 불필요한 요청)
- 실시간성 부족 (3초 지연)

### 웹소켓 (WebSocket)

양방향 실시간 통신:

```javascript
const ws = new WebSocket('wss://api.example.com/messages');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  updateUI(message);
};

// 메시지 전송
ws.send(JSON.stringify({
  type: 'message',
  content: 'Hello!'
}));
```

장점:
- 효율적 (연결 유지)
- 실시간 (즉시 통신)

## 정리

클라이언트-서버 모델은 웹 서비스의 기초입니다:

1. **요청과 응답**: HTTP를 통한 일방향 통신
2. **URL**: 서버의 리소스를 정확하게 식별하는 주소
3. **상태 코드**: 응답의 상태를 나타내는 숫자
4. **프론트엔드**: 사용자 인터페이스 (브라우저)
5. **백엔드**: 비즈니스 로직 (서버)

다음 가이드에서는 API의 설계 원칙과 REST 개념을 자세히 다룹니다.
