---
sidebar_position: 3
---

# 데이터베이스 용어

## SQL (Structured Query Language)

**한줄 정의:** 관계형 데이터베이스에서 데이터를 조회하고 수정하는 언어

**쉬운 비유:** 데이터베이스와 대화하는 영어입니다. 물어보는 방식이 정해져 있습니다.

```sql
SELECT name, email FROM users WHERE age > 20;
INSERT INTO users (name, email) VALUES ('홍길동', 'hong@example.com');
UPDATE users SET age = 25 WHERE id = 1;
DELETE FROM users WHERE id = 1;
```

**관련 용어:** [PostgreSQL](#postgresql), [스키마](#스키마), [쿼리](#쿼리)

---

## NoSQL

**한줄 정의:** 관계형이 아닌 데이터베이스. JSON 같은 형식으로 자유로운 데이터 저장

**쉬운 비유:** 도서관의 분류법이 아니라, 메모장에 자유롭게 적으면 나중에 검색하는 방식입니다.

```json
// NoSQL 문서 예시
{
  "userId": "123",
  "name": "홍길동",
  "tags": ["developer", "android"],
  "metadata": { "lastLogin": "2026-04-04" }
}
```

**관련 용어:** [DynamoDB](#dynamodb), [MongoDB](#mongodb)

---

## PostgreSQL

**한줄 정의:** 가장 신뢰할 수 있고 강력한 관계형 데이터베이스 (오픈소스)

**쉬운 비유:** 견고한 은행 금고입니다. 데이터를 매우 안전하게 관리합니다.

```typescript
// Node.js에서 PostgreSQL 사용 예시
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://user:password@localhost/dbname' });
const result = await pool.query('SELECT * FROM users');
```

**관련 용어:** [SQL](#sql), [데이터베이스](#데이터베이스)

---

## DynamoDB

**한줄 정의:** AWS의 관리형 NoSQL 데이터베이스. 자동 확장이 가능합니다.

**쉬운 비유:** 탄력 있는 종이입니다. 필요하면 늘어나고, 안 필요하면 줄어듭니다.

```typescript
// DynamoDB 사용 예시
const docClient = new DynamoDBDocumentClient();
const result = await docClient.get({
  TableName: 'Users',
  Key: { userId: '123' }
});
```

**관련 용어:** [NoSQL](#nosql), [클라우드 데이터베이스](#클라우드-데이터베이스)

---

## 마이그레이션 (Migration)

**한줄 정의:** 데이터베이스의 구조를 변경할 때 이전 버전에서 새 버전으로 안전하게 업그레이드하는 과정

**쉬운 비유:** 사무실 이전입니다. 집기류를 옮기고, 새 위치에 맞게 배치합니다.

```typescript
// Knex 마이그레이션 예시
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id');
    table.string('name');
    table.string('email');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
```

**관련 용어:** [스키마](#스키마), [버전 관리](#버전-관리)

---

## 스키마 (Schema)

**한줄 정의:** 데이터베이스 테이블의 구조를 정의하는 것 (어떤 컬럼이 있고, 어떤 타입인지)

**쉬운 비유:** 설문지의 양식입니다. "이름은 텍스트, 나이는 숫자" 같이 정해놓습니다.

```sql
-- PostgreSQL 스키마 예시
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  age INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**관련 용어:** [데이터베이스](#데이터베이스), [마이그레이션](#마이그레이션-migration)

---

## 인덱스 (Index)

**한줄 정의:** 데이터베이스에서 검색을 빠르게 하기 위해 만드는 색인

**쉬운 비유:** 책의 목차입니다. 책 전체를 읽지 않고 목차에서 원하는 장을 찾아 이동합니다.

```sql
-- 인덱스 생성
CREATE INDEX idx_email ON users(email);

-- 이제 이메일로 검색할 때 매우 빠릅니다
SELECT * FROM users WHERE email = 'hong@example.com';
```

**관련 용어:** [쿼리](#쿼리), [성능](#성능)

---

## ORM (Object-Relational Mapping)

**한줄 정의:** 데이터베이스 테이블을 프로그래밍 언어의 객체처럼 다룰 수 있게 해주는 도구

**쉬운 비유:** 데이터베이스와 프로그래밍 언어를 연결하는 번역기입니다.

```typescript
// Prisma ORM으로 users 테이블과 상호작용
const user = await prisma.user.create({
  data: {
    name: '홍길동',
    email: 'hong@example.com'
  }
});
```

**관련 용어:** [SQL](#sql), [데이터베이스](#데이터베이스)

---

## 트랜잭션 (Transaction)

**한줄 정의:** 여러 데이터베이스 작업을 하나의 묶음으로 취급하는 것. 모두 성공하거나 모두 실패합니다.

**쉬운 비유:** ATM에서 송금할 때 "A 계좌에서 출금 + B 계좌에 입금"이 모두 성공하거나 모두 실패해야 합니다.

```typescript
// 트랜잭션 예시
try {
  await database.transaction(async (trx) => {
    await trx('accounts').update({ balance: balance - 100 }).where({ id: 1 });
    await trx('accounts').update({ balance: balance + 100 }).where({ id: 2 });
  });
} catch (error) {
  // 둘 다 롤백됨
}
```

**관련 용어:** [데이터베이스](#데이터베이스), [ACID](#acid)

---

## RLS (Row Level Security)

**한줄 정의:** 각 사용자가 볼 수 있는 행(Row)을 데이터베이스 레벨에서 제한하는 보안 기능

**쉬운 비유:** 병원의 의료 기록입니다. 의사는 자신의 환자 기록만 보고, 다른 의사의 환자 기록은 못 봅니다.

```sql
-- PostgreSQL RLS 정책 예시
CREATE POLICY user_policy ON users
  USING (auth.uid() = user_id);
```

**관련 용어:** [보안](#보안), [권한](#권한)

---

## 정규화 (Normalization)

**한줄 정의:** 데이터베이스의 중복을 최소화하고 데이터 무결성을 높이는 설계 원칙

**쉬운 비유:** 중복 없이 깔끔하게 정리된 서류함입니다. 같은 정보를 여러 곳에 반복해서 저장하지 않습니다.

```sql
-- 정규화되지 않은 데이터 (나쁜 예)
id | name | city | country
1  | 홍길동 | 서울 | 한국

-- 정규화된 데이터 (좋은 예)
users: id | name | city_id
cities: city_id | city | country_id
countries: country_id | country
```

**관련 용어:** [스키마](#스키마), [데이터 무결성](#데이터-무결성)

---

## ACID

**한줄 정의:** 데이터베이스 트랜잭션이 안전하기 위한 4가지 특성 (Atomicity, Consistency, Isolation, Durability)

**쉬운 비유:** 계약서의 법적 효력입니다. 모두가 지켜야 하고, 한 번 서명하면 돌이킬 수 없습니다.

- **Atomicity (원자성):** 모두 성공하거나 모두 실패
- **Consistency (일관성):** 데이터가 항상 일치 상태 유지
- **Isolation (격리성):** 여러 트랜잭션이 동시에 실행되어도 간섭 없음
- **Durability (내구성):** 한 번 저장되면 절대 손실되지 않음

**관련 용어:** [트랜잭션](#트랜잭션-transaction), [데이터베이스](#데이터베이스)
