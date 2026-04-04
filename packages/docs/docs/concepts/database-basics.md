---
sidebar_position: 3
---

# 데이터베이스 기초 (SQL vs NoSQL)

## 데이터베이스가 왜 필요한가?

### 메모리 vs 저장소

프로그램을 실행할 때 메모리(RAM)에 데이터를 저장할 수 있습니다:

```javascript
let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
```

하지만 프로그램이 종료되면 데이터가 사라집니다. 다음 번에 프로그램을 실행하면 데이터를 다시 입력해야 합니다.

**데이터베이스는 영구적으로 데이터를 저장합니다.**

### 데이터베이스의 역할

```
사용자가 정보 입력
    ↓
서버가 데이터 처리
    ↓
데이터베이스에 저장 (영구 저장)
    ↓
사용자가 나중에 정보 요청
    ↓
데이터베이스에서 조회
```

### Android와의 비유

Android 앱에서 Room 데이터베이스나 SQLite를 사용해본 경험이 있나요?

```kotlin
@Entity
data class User(
  @PrimaryKey val id: Int,
  val name: String,
  val email: String
)

@Dao
interface UserDao {
  @Query("SELECT * FROM user WHERE id = :id")
  suspend fun getUser(id: Int): User
  
  @Insert
  suspend fun insertUser(user: User)
}
```

웹 서버도 동일한 개념입니다. 데이터를 구조화되게 저장하고 빠르게 조회합니다.

## SQL vs NoSQL: 근본적인 차이

### SQL (관계형 데이터베이스)

**구조: 표 (Table)**

데이터를 표 형태로 저장합니다 (Excel처럼):

```
users 테이블
┌────┬───────────┬──────────────────┐
│ id │ name      │ email            │
├────┼───────────┼──────────────────┤
│ 1  │ Alice     │ alice@example.com│
│ 2  │ Bob       │ bob@example.com  │
│ 3  │ Charlie   │ charlie@example  │
└────┴───────────┴──────────────────┘
```

**특징**

1. **스키마**: 미리 정의된 구조
   ```
   각 열은 반드시 정해진 타입을 가져야 함
   name은 문자열, age는 숫자
   ```

2. **관계**: 테이블 간의 관계
   ```
   users 테이블과 posts 테이블의 관계
   
   users: id, name
   posts: id, content, user_id (user_id는 users.id를 참조)
   ```

3. **ACID 보장**: 데이터 무결성
   ```
   송금 거래:
   - 계좌1에서 $100 차감
   - 계좌2에 $100 추가
   둘 다 성공하거나 둘 다 실패해야 함
   ```

**예: PostgreSQL**

```sql
-- 테이블 생성
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  age INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 데이터 삽입
INSERT INTO users (name, email, age) VALUES
('Alice', 'alice@example.com', 30),
('Bob', 'bob@example.com', 25);

-- 데이터 조회
SELECT * FROM users WHERE age > 25;

-- 데이터 업데이트
UPDATE users SET age = 31 WHERE name = 'Alice';

-- 데이터 삭제
DELETE FROM users WHERE id = 1;
```

### NoSQL (비관계형 데이터베이스)

**구조: 문서 (Document)**

데이터를 JSON 형태로 저장합니다:

```json
{
  "_id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "SF"
  },
  "hobbies": ["reading", "coding"]
}
```

**특징**

1. **유연한 스키마**: 문서마다 다른 구조 가능
   ```json
   // 문서1 (주소 있음)
   { id: 1, name: "Alice", address: {...} }
   
   // 문서2 (주소 없음)
   { id: 2, name: "Bob", phone: "123-456-7890" }
   ```

2. **중첩된 구조**: 관계를 표현하기 쉬움
   ```json
   {
     "id": 1,
     "name": "Alice",
     "posts": [
       { "id": 1, "content": "Hello" },
       { "id": 2, "content": "World" }
     ]
   }
   ```

3. **확장성**: 대규모 데이터 처리에 최적화
   ```
   여러 서버에 분산하여 저장 가능
   ```

**예: MongoDB**

```javascript
// 컬렉션에 문서 삽입
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  age: 30
});

// 데이터 조회
db.users.find({ age: { $gt: 25 } });

// 데이터 업데이트
db.users.updateOne(
  { name: "Alice" },
  { $set: { age: 31 } }
);

// 데이터 삭제
db.users.deleteOne({ _id: 1 });
```

### SQL vs NoSQL 비교표

| 항목 | SQL | NoSQL |
|------|-----|-------|
| 데이터 구조 | 표 (행과 열) | 문서 (JSON) |
| 스키마 | 엄격함 | 유연함 |
| 관계 | 외래키로 표현 | 중첩 구조 |
| 확장성 | 수직 확장 (더 강력한 서버) | 수평 확장 (더 많은 서버) |
| ACID | 기본 보장 | 보장하지 않음 (일부는 지원) |
| 사용 사례 | 정형 데이터 (사용자, 주문 등) | 비정형 데이터 (로그, 메타데이터 등) |

## PostgreSQL 기초 (SQL)

### 기본 개념

**테이블 (Table)**

```
users 테이블
┌──┬────────┬────────────────┐
│id│ name   │ email          │
├──┼────────┼────────────────┤
│1 │ Alice  │ alice@...      │
│2 │ Bob    │ bob@...        │
└──┴────────┴────────────────┘
```

**행 (Row)**
```
한 사람의 데이터: { id: 1, name: "Alice", email: "alice@..." }
```

**열 (Column)**
```
모든 사람의 이름: ["Alice", "Bob", ...]
```

### CREATE TABLE

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,           -- 자동 증가하는 고유 ID
  name VARCHAR(255) NOT NULL,      -- 문자열, 필수
  email VARCHAR(255) UNIQUE,       -- 고유한 이메일
  age INT,                         -- 정수
  active BOOLEAN DEFAULT true,     -- 기본값 true
  created_at TIMESTAMP DEFAULT NOW() -- 생성 시간 자동 기록
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,            -- 사용자 ID (외래키)
  content TEXT,                    -- 긴 텍스트
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) -- 관계 설정
);
```

### SELECT (조회)

**전체 조회**
```sql
SELECT * FROM users;
```

**특정 열 조회**
```sql
SELECT name, email FROM users;
```

**조건 조회**
```sql
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE name LIKE 'A%';  -- A로 시작하는 이름
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
```

**정렬**
```sql
SELECT * FROM users ORDER BY age DESC;  -- 나이 역순
SELECT * FROM users ORDER BY created_at;  -- 생성 시간 순
```

**개수 제한**
```sql
SELECT * FROM users LIMIT 10 OFFSET 20;  -- 21~30번째 행 (페이지네이션)
```

**집계**
```sql
SELECT COUNT(*) FROM users;                    -- 사용자 수
SELECT AVG(age) FROM users;                    -- 평균 나이
SELECT MAX(age), MIN(age) FROM users;          -- 최대, 최소 나이
```

**조인 (Join)**
```sql
-- users와 posts를 연결
SELECT users.name, posts.content
FROM users
JOIN posts ON users.id = posts.user_id
WHERE users.name = 'Alice';
```

### INSERT (삽입)

```sql
INSERT INTO users (name, email, age) VALUES
('Alice', 'alice@example.com', 30);

-- 여러 행 삽입
INSERT INTO users (name, email, age) VALUES
('Alice', 'alice@example.com', 30),
('Bob', 'bob@example.com', 25),
('Charlie', 'charlie@example.com', 28);
```

### UPDATE (업데이트)

```sql
UPDATE users SET age = 31 WHERE name = 'Alice';
UPDATE users SET active = false WHERE age < 18;
UPDATE users SET email = 'new@example.com' WHERE id = 1;
```

### DELETE (삭제)

```sql
DELETE FROM users WHERE id = 1;
DELETE FROM users WHERE age > 100;
-- 주의: WHERE 없으면 모든 데이터 삭제!
```

## DynamoDB 기초 (NoSQL)

### 핵심 개념

**테이블 (Table)**

```json
{
  "TableName": "Users",
  "Items": [
    {
      "id": { "S": "user-123" },
      "name": { "S": "Alice" },
      "email": { "S": "alice@example.com" },
      "age": { "N": "30" }
    }
  ]
}
```

**Partition Key (파티션 키)**

데이터를 여러 서버에 분산하기 위한 핵심:

```
Partition Key: user_id

user_id가 1~1000인 데이터 → 서버 A
user_id가 1001~2000인 데이터 → 서버 B
user_id가 2001~3000인 데이터 → 서버 C
```

**Sort Key (정렬 키)**

같은 Partition Key 내에서 데이터를 정렬:

```
Partition Key: user_id
Sort Key: created_at

user_id = 1인 데이터들이:
  created_at = 2024-01-01
  created_at = 2024-01-02
  created_at = 2024-01-03
순서대로 정렬됨
```

### DynamoDB 작업

**테이블 생성**

```javascript
// AWS SDK를 사용하여 테이블 생성
const params = {
  TableName: "Users",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }    // Partition Key
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" }  // String
  ],
  BillingMode: "PAY_PER_REQUEST"  // 요청당 과금
};

dynamodb.createTable(params);
```

**데이터 삽입**

```javascript
const params = {
  TableName: "Users",
  Item: {
    id: "user-123",
    name: "Alice",
    email: "alice@example.com",
    age: 30,
    hobbies: ["reading", "coding"],
    address: {
      street: "123 Main St",
      city: "SF"
    }
  }
};

dynamodb.putItem(params);
```

**데이터 조회**

```javascript
// Primary Key로 조회 (가장 빠름)
const params = {
  TableName: "Users",
  Key: { id: "user-123" }
};

dynamodb.getItem(params);

// 쿼리 (Partition Key + Sort Key)
const params = {
  TableName: "UserPosts",
  KeyConditionExpression: "user_id = :uid AND created_at > :date",
  ExpressionAttributeValues: {
    ":uid": "user-123",
    ":date": "2024-01-01"
  }
};

dynamodb.query(params);

// 스캔 (모든 데이터 검색 - 느림)
const params = {
  TableName: "Users",
  FilterExpression: "age > :age",
  ExpressionAttributeValues: {
    ":age": 25
  }
};

dynamodb.scan(params);
```

**데이터 업데이트**

```javascript
const params = {
  TableName: "Users",
  Key: { id: "user-123" },
  UpdateExpression: "SET age = :age, #status = :status",
  ExpressionAttributeNames: {
    "#status": "status"  // 'status'는 예약어이므로 별칭 사용
  },
  ExpressionAttributeValues: {
    ":age": 31,
    ":status": "active"
  }
};

dynamodb.updateItem(params);
```

**데이터 삭제**

```javascript
const params = {
  TableName: "Users",
  Key: { id: "user-123" }
};

dynamodb.deleteItem(params);
```

## 스키마 설계 기본 원칙

### 1. 정규화 (Normalization) - SQL

중복을 제거하고 데이터를 효율적으로 저장합니다:

**나쁜 설계 (중복 데이터)**

```
posts 테이블
┌───┬────────┬──────────┬──────────────┐
│id │content │ user_id  │ user_name    │  ← 반복됨
├───┼────────┼──────────┼──────────────┤
│1  │Hello   │ 1        │ Alice        │
│2  │World   │ 1        │ Alice        │  ← 같은 사용자
│3  │Test    │ 2        │ Bob          │
└───┴────────┴──────────┴──────────────┘
```

문제:
- 저장 공간 낭비
- 데이터 불일치 (Alice의 이름을 변경하면?)

**좋은 설계 (정규화)**

```
users 테이블
┌───┬──────┐
│id │name  │
├───┼──────┤
│1  │Alice │
│2  │Bob   │
└───┴──────┘

posts 테이블
┌───┬────────┬────────┐
│id │content │user_id │
├───┼────────┼────────┤
│1  │Hello   │ 1      │
│2  │World   │ 1      │
│3  │Test    │ 2      │
└───┴────────┴────────┘
```

장점:
- 저장 공간 효율적
- 데이터 일관성 보장

### 2. 역정규화 (Denormalization) - NoSQL

성능을 위해 의도적으로 데이터를 중복 저장합니다:

```json
{
  "_id": 1,
  "content": "Hello",
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"  // 중복
  },
  "comments": [
    {
      "id": 1,
      "content": "Nice post!",
      "user": {  // 중복
        "id": 2,
        "name": "Bob"
      }
    }
  ]
}
```

장점:
- 조회가 빠름 (join이 필요 없음)
- 한 번의 요청으로 모든 정보 획득

단점:
- 수정이 복잡함 (여러 곳을 수정해야 함)

### 3. 인덱싱 (Indexing)

자주 조회하는 필드에 인덱스를 설정하여 성능을 높입니다:

```sql
-- 이메일로 자주 검색하므로 인덱스 설정
CREATE INDEX idx_email ON users(email);

-- 조회 속도 개선
SELECT * FROM users WHERE email = 'alice@example.com';
```

### 4. 외래키 (Foreign Key)

테이블 간의 관계를 설정하여 데이터 무결성을 보장합니다:

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE  -- 사용자 삭제 시 게시물도 자동 삭제
);
```

## 마이그레이션이란?

### 마이그레이션의 필요성

데이터베이스 구조가 변경되어야 할 때가 있습니다:

```
v1.0: name 열만 있음
  ↓
v1.1: email 열 추가 필요
  ↓
v2.0: name을 first_name, last_name으로 분리
```

### 마이그레이션 도구

**SQL 마이그레이션 (예: Flyway)**

```sql
-- migrations/V1__Initial_schema.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- migrations/V2__Add_email.sql
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- migrations/V3__Split_name.sql
ALTER TABLE users ADD COLUMN first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN last_name VARCHAR(255);
UPDATE users SET first_name = SUBSTRING_INDEX(name, ' ', 1);
UPDATE users SET last_name = SUBSTRING_INDEX(name, ' ', -1);
ALTER TABLE users DROP COLUMN name;
```

**장점**
- 버전 관리 (어느 단계인지 추적 가능)
- 자동화 (배포 시 자동 실행)
- 되돌리기 가능 (이전 버전으로 롤백)

## Android의 Room/SQLite와 비교

### Room (Android)

```kotlin
@Entity
data class User(
  @PrimaryKey val id: Int,
  val name: String,
  val email: String
)

@Dao
interface UserDao {
  @Query("SELECT * FROM user")
  suspend fun getAllUsers(): List<User>

  @Insert
  suspend fun insertUser(user: User)

  @Update
  suspend fun updateUser(user: User)

  @Delete
  suspend fun deleteUser(user: User)
}

@Database(entities = [User::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
  abstract fun userDao(): UserDao
}
```

### PostgreSQL (웹 백엔드)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://...'
});

async function getAllUsers() {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}

async function insertUser(name, email) {
  const result = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return result.rows[0];
}
```

### 비교

| 항목 | Room | PostgreSQL |
|------|------|-----------|
| 저장소 | 로컬 파일 (앱 내부) | 원격 서버 |
| 범위 | 한 기기 | 모든 사용자 |
| 동기화 | 수동 (API 호출) | 자동 |
| 성능 | 매우 빠름 | 네트워크 지연 있음 |

## 실제 데이터 구조 설계 예제

### SNS 애플리케이션

**SQL 설계 (PostgreSQL)**

```sql
-- 사용자
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 게시물
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 댓글
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES posts(id),
  user_id INT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 좋아요
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id),
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)  -- 한 사용자가 한 게시물에 한 번만 좋아요
);

-- 인덱스
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
```

**NoSQL 설계 (MongoDB)**

```javascript
// posts 컬렉션
db.posts.insertOne({
  _id: ObjectId(),
  user: {
    id: 1,
    username: "alice",
    profileImage: "url..."
  },
  content: "Hello World!",
  likes: [
    { userId: 2, username: "bob" },
    { userId: 3, username: "charlie" }
  ],
  comments: [
    {
      id: 1,
      user: {
        id: 2,
        username: "bob"
      },
      content: "Nice!",
      createdAt: ISODate()
    }
  ],
  createdAt: ISODate(),
  updatedAt: ISODate()
});
```

## 정리

데이터베이스는 웹 서비스의 데이터 저장소입니다:

1. **SQL**: 구조화된 데이터, 관계 중심
   - PostgreSQL, MySQL, SQL Server
   - 은행 거래, 사용자 정보 등

2. **NoSQL**: 유연한 구조, 확장성 중심
   - MongoDB, DynamoDB, Firebase
   - 로그, 메타데이터, 소셜 미디어 등

3. **설계 원칙**: 정규화, 인덱싱, 관계 설정

4. **마이그레이션**: 스키마 변경 관리

다음 가이드에서는 사용자를 안전하게 확인하는 방법인 인증과 권한 관리를 다룹니다.
