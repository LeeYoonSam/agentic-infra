---
sidebar_position: 2
---

# 백엔드 용어

## 서버 (Server)

**한줄 정의:** 클라이언트(사용자 기기)의 요청을 받아서 처리하고 응답하는 컴퓨터

**쉬운 비유:** 식당의 주방입니다. 손님(클라이언트)의 주문을 받으면 음식을 준비해서 제공합니다.

```typescript
// Node.js 서버 예시
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ users: [{ id: 1, name: '홍길동' }] });
});

app.listen(3000);
```

**관련 용어:** [클라이언트](#클라이언트), [API Gateway](#api-gateway)

---

## 클라이언트 (Client)

**한줄 정의:** 서버에 요청을 보내서 서비스를 받는 쪽 (웹 브라우저, 모바일 앱 등)

**쉬운 비유:** 식당에서 주문하는 손님입니다. 필요한 것을 요청하고 응답을 받습니다.

**관련 용어:** [서버](#서버-server), [API](#api)

---

## 서버리스 (Serverless)

**한줄 정의:** 서버를 직접 관리하지 않고도 코드를 실행할 수 있는 환경

**쉬운 비유:** 배달앱입니다. 주방(서버)을 직접 소유할 필요 없이, 음식 만드는 것만 집중합니다.

```typescript
// AWS Lambda 함수 예시 (서버리스)
export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: '안녕하세요!' })
  };
};
```

**관련 용어:** [Lambda](#lambda), [Edge Function](#edge-function)

---

## Lambda

**한줄 정의:** AWS의 서버리스 컴퓨팅 서비스. 필요한 순간만 코드를 실행하고 요금을 낸다.

**쉬운 비유:** 택배 기사처럼 일할 때만 돈을 버는 것. 항상 대기할 필요 없습니다.

**관련 용어:** [서버리스](#서버리스-serverless), [API Gateway](#api-gateway)

---

## Edge Function

**한줄 정의:** 사용자와 가까운 엣지 위치에서 실행되는 경량 함수

**쉬운 비유:** 편의점의 편의점입니다. 멀리 있는 본사에 가지 않고, 가까운 지점에서 바로 처리합니다.

```typescript
// Vercel Edge Function 예시
export default function handler(request) {
  return new Response('안녕하세요!');
}
```

**관련 용어:** [CDN](#cdn), [서버리스](#서버리스-serverless)

---

## 미들웨어 (Middleware)

**한줄 정의:** 요청이 최종 처리기에 도달하기 전에 중간에서 요청/응답을 처리하는 코드

**쉬운 비유:** 보안 검사대입니다. 손님이 식당에 들어오기 전에 신원 확인과 짐 검사를 합니다.

```typescript
// Express 미들웨어 예시
app.use((req, res, next) => {
  console.log('요청이 도착했습니다');
  req.userId = 123; // 다음 핸들러에서 사용 가능
  next(); // 다음 미들웨어로 넘김
});
```

**관련 용어:** [서버](#서버-server), [API Gateway](#api-gateway)

---

## ORM (Object-Relational Mapping)

**한줄 정의:** 데이터베이스의 테이블을 객체처럼 다룰 수 있게 해주는 도구

**쉬운 비유:** 외국어 통역사입니다. 데이터베이스의 언어(SQL)를 프로그래머가 이해하는 언어(객체)로 번역해줍니다.

```typescript
// Prisma ORM 예시
const user = await prisma.user.findUnique({
  where: { id: 1 }
});
```

**관련 용어:** [데이터베이스](#데이터베이스), [SQL](#sql)

---

## 마이크로서비스 (Microservices)

**한줄 정의:** 큰 애플리케이션을 작고 독립적인 서비스들로 나눠서 운영하는 아키텍처

**쉬운 비유:** 대형 쇼핑몰입니다. 각 가게(서비스)가 독립적으로 운영되지만, 모두 같은 건물 안에 있습니다.

**관련 용어:** [모놀리식](#모놀리식-monolith), [API Gateway](#api-gateway)

---

## 모놀리식 (Monolith)

**한줄 정의:** 모든 기능이 하나의 큰 애플리케이션으로 묶여 있는 아키텍처

**쉬운 비유:** 작은 가게입니다. 옷, 신발, 모자 모두 한 곳에서 팜니다.

**관련 용어:** [마이크로서비스](#마이크로서비스-microservices)

---

## API Gateway

**한줄 정의:** 클라이언트의 모든 요청을 받아서 적절한 서비스로 라우팅하는 관문

**쉬운 비유:** 병원의 접수처입니다. 환자가 접수처에서 진료과를 배정받고 이동합니다.

```typescript
// API Gateway의 라우팅 예시
GET /api/users → User Service
POST /api/orders → Order Service
GET /api/products → Product Service
```

**관련 용어:** [마이크로서비스](#마이크로서비스-microservices), [서버리스](#서버리스-serverless)

---

## 환경변수 (Environment Variables)

**한줄 정의:** 코드에 하드코딩하지 않고 실행 환경에서 제공하는 설정값

**쉬운 비유:** 사무실의 환경설정입니다. 겨울에는 난방을 켜고, 여름에는 에어컨을 킵니다. 같은 건물인데 계절에 따라 다르게 설정됩니다.

```typescript
// 환경변수 사용 예시
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production') {
  // 프로덕션 전용 설정
}
```

**관련 용어:** [배포](#배포), [보안](#보안)

---

## 캐싱 (Caching)

**한줄 정의:** 자주 사용되는 데이터를 빠르게 접근할 수 있는 임시 저장소에 보관

**쉬운 비유:** 책상 서랍입니다. 자주 쓰는 물건은 책상 서랍에, 자주 안 쓰는 물건은 창고에 보관합니다.

```typescript
// Redis 캐싱 예시
const cachedUser = await redis.get(`user:${id}`);
if (!cachedUser) {
  const user = await database.getUser(id);
  await redis.set(`user:${id}`, user, 'EX', 3600); // 1시간 저장
}
```

**관련 용어:** [Redis](#redis), [성능](#성능)

---

## 비동기 처리 (Asynchronous Processing)

**한줄 정의:** 시간이 오래 걸리는 작업을 기다리지 않고 다른 일을 계속하는 방식

**쉬운 비유:** 카페에서 음료를 주문합니다. 만들어질 때까지 기다리지 말고, 다른 손님을 받습니다.

```typescript
// async/await 예시
async function getUser(id) {
  const user = await database.query(`SELECT * FROM users WHERE id = ${id}`);
  return user;
}
```

**관련 용어:** [Promise](#promise), [이벤트 루프](#이벤트-루프)
