---
sidebar_position: 1
---

# 네트워크 용어

## API (Application Programming Interface)

**한줄 정의:** 서로 다른 소프트웨어가 대화하는 방법을 정해놓은 약속

**쉬운 비유:** 레스토랑의 메뉴판과 같습니다. 메뉴판(API)을 보고 주문(요청)하면, 주방(서버)에서 음식(응답)을 만들어 줍니다.

```typescript
// API 호출 예시
const response = await fetch('https://api.example.com/users');
const users = await response.json();
```

**관련 용어:** [REST](#rest), [HTTP 메서드](#http-메서드), [GraphQL](#graphql)

---

## REST (Representational State Transfer)

**한줄 정의:** 웹에서 데이터를 주고받는 가장 널리 쓰이는 API 설계 방식

**쉬운 비유:** 도서관의 분류 체계와 같습니다. 책(리소스)마다 고유 번호(URL)가 있고, 빌리기(GET)/반납(DELETE)/등록(POST) 같은 정해진 행동이 있습니다.

```
GET    /api/users      → 사용자 목록 조회
POST   /api/users      → 새 사용자 생성
GET    /api/users/123   → 특정 사용자 조회
PUT    /api/users/123   → 사용자 정보 수정
DELETE /api/users/123   → 사용자 삭제
```

**관련 용어:** [API](#api-application-programming-interface), [HTTP 메서드](#http-메서드)

---

## HTTP 메서드

**한줄 정의:** 웹 요청의 종류를 나타내는 동사 (GET, POST, PUT, DELETE 등)

**쉬운 비유:** 편의점에서의 행동: 물건 보기(GET), 새 물건 놓기(POST), 물건 교체하기(PUT), 물건 버리기(DELETE)

```typescript
// GET - 데이터 조회
await fetch('/api/users');

// POST - 데이터 생성
await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: '홍길동' })
});
```

**관련 용어:** [REST](#rest), [API](#api-application-programming-interface)

---

## GraphQL

**한줄 정의:** 필요한 데이터만 정확히 요청할 수 있는 쿼리 언어

**쉬운 비유:** 뷔페(REST)에서 모든 음식이 나오는 대신, 주문서(GraphQL)에 원하는 것만 적어서 딱 그것만 받는 방식

```graphql
query {
  user(id: "123") {
    name
    email
    posts {
      title
    }
  }
}
```

**관련 용어:** [REST](#rest), [API](#api-application-programming-interface)

---

## WebSocket

**한줄 정의:** 서버와 클라이언트가 실시간으로 양방향 통신할 수 있는 프로토콜

**쉬운 비유:** 전화 통화와 같습니다. HTTP가 편지(보내고 답장 기다리기)라면, WebSocket은 전화(계속 연결된 상태에서 바로 대화)

```typescript
const ws = new WebSocket('wss://example.com/chat');
ws.onmessage = (event) => console.log('받은 메시지:', event.data);
ws.send('안녕하세요!');
```

**관련 용어:** [HTTP 메서드](#http-메서드), 실시간

---

## DNS (Domain Name System)

**한줄 정의:** 도메인 이름(google.com)을 IP 주소(142.250.196.110)로 변환해주는 시스템

**쉬운 비유:** 인터넷의 전화번호부입니다. "홍길동"(도메인)을 검색하면 전화번호(IP 주소)를 알려줍니다.

**관련 용어:** [CDN](#cdn-content-delivery-network), [SSL/TLS](#ssltls)

---

## CDN (Content Delivery Network)

**한줄 정의:** 전 세계에 분산된 서버 네트워크로, 사용자와 가까운 곳에서 콘텐츠를 제공

**쉬운 비유:** 프랜차이즈 편의점 체인입니다. 본사(원본 서버)에서 멀어도, 내 동네 지점(CDN 엣지 서버)에서 빠르게 물건을 받을 수 있습니다.

**관련 용어:** [DNS](#dns-domain-name-system)

---

## SSL/TLS

**한줄 정의:** 인터넷 통신을 암호화하여 안전하게 만드는 보안 프로토콜

**쉬운 비유:** 편지를 보낼 때 봉투에 넣고 자물쇠를 채우는 것. HTTPS의 'S'가 바로 이것.

**관련 용어:** [DNS](#dns-domain-name-system)

---

## JSON (JavaScript Object Notation)

**한줄 정의:** 데이터를 주고받을 때 가장 많이 사용하는 텍스트 형식

**쉬운 비유:** 국제 공용 양식처럼, 어떤 프로그래밍 언어에서든 읽고 쓸 수 있는 데이터 형식

```json
{
  "name": "홍길동",
  "age": 30,
  "skills": ["TypeScript", "Kotlin"]
}
```

**관련 용어:** [API](#api-application-programming-interface), [REST](#rest)

---

## CORS (Cross-Origin Resource Sharing)

**한줄 정의:** 다른 도메인에서 API를 호출할 수 있도록 허용하는 보안 메커니즘

**쉬운 비유:** 아파트 출입문의 방문자 허용 목록. 등록된 방문자(허용된 도메인)만 들어올 수 있습니다.

```typescript
// 서버측 CORS 설정 예시
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://myapp.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};
```

**관련 용어:** [HTTP 메서드](#http-메서드), [API](#api-application-programming-interface)
