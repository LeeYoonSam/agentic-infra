---
sidebar_position: 4
---

# 인증/보안 용어

## OAuth

**한줄 정의:** Google이나 GitHub 같은 다른 서비스의 계정으로 로그인할 수 있게 하는 표준

**쉬운 비유:** 신분증으로 위장을 대신하는 것입니다. 처음 방문하는 은행에서 운전면허로 신원을 증명합니다.

```typescript
// OAuth 로그인 플로우
// 1. "Google로 로그인" 버튼 클릭
// 2. Google 로그인 페이지로 이동
// 3. 로그인 후 우리 앱으로 돌아옴
// 4. 사용자 정보 받음
```

**관련 용어:** [JWT](#jwt), [SSO](#sso), [로그인](#로그인)

---

## JWT (JSON Web Token)

**한줄 정의:** 사용자 정보를 암호화해서 담은 토큰. 로그인 상태를 유지하는 데 사용

**쉬운 비유:** 테마파크의 팔찌입니다. 로그인하면 팔찌(토큰)를 받고, 이 팔찌로 아무데서나 증명할 수 있습니다.

```typescript
// JWT 토큰 예시
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJuYW1lIjoi7JWc6rWA7Kac6q2i4IiB3aDc4OAsiLCJpYXQiOjE1OTE3MzQ1MDN9.aY4oZKzqYZx...

// 디코딩하면
{
  "userId": "123",
  "name": "홍길동",
  "iat": 1591734503
}
```

**관련 용어:** [Access Token](#access-token), [Refresh Token](#refresh-token)

---

## Session

**한줄 정의:** 서버가 로그인한 사용자를 기억하는 방식. 매번 사용자 정보를 저장해뒀다가 확인

**쉬운 비유:** 카페에서 단골 손님을 기억하는 것입니다. "아, 홍길동 손님이구나" 서버가 기억합니다.

```typescript
// Express Session 예시
app.use(session({
  secret: 'my-secret',
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1일
}));

app.post('/login', (req, res) => {
  req.session.userId = 123; // 세션에 저장
  res.send('로그인되었습니다');
});
```

**관련 용어:** [Cookie](#cookie), [JWT](#jwt)

---

## Cookie

**한줄 정의:** 브라우저가 서버로부터 받아서 저장하는 작은 데이터. 매 요청마다 서버로 자동 전송

**쉬운 비유:** 학교에서 학생증입니다. 학생이 항상 가지고 다니고, 필요할 때마다 보여줍니다.

```typescript
// 쿠키 설정 예시
res.cookie('sessionId', '12345', {
  httpOnly: true,        // 자바스크립트에서 접근 불가
  secure: true,          // HTTPS만
  sameSite: 'strict'     // CSRF 공격 방지
});
```

**관련 용어:** [Session](#session), [보안](#보안)

---

## RBAC (Role-Based Access Control)

**한줄 정의:** 역할(Role)에 따라 접근 권한을 다르게 주는 방식

**쉬운 비유:** 회사의 직급입니다. 인턴/사원/과장/부장마다 갈 수 있는 곳이 다릅니다.

```typescript
// RBAC 예시
function canDeleteUser(user) {
  return user.role === 'admin';
}

app.delete('/api/users/:id', (req, res) => {
  if (!canDeleteUser(req.user)) {
    return res.status(403).send('권한 없음');
  }
  // 삭제 진행
});
```

**관련 용어:** [권한](#권한), [보안](#보안)

---

## MFA (Multi-Factor Authentication)

**한줄 정의:** 로그인할 때 비밀번호 외에 추가적으로 본인 확인하는 방식 (문자, 지문, 보안 코드 등)

**쉬운 비유:** 은행 ATM입니다. 카드(1단계)와 비밀번호(2단계) 둘 다 필요합니다.

```typescript
// 2FA (MFA의 한 종류) 예시
// 1단계: 비밀번호로 로그인
// 2단계: 휴대폰으로 받은 6자리 코드 입력
const verified = verifyTwoFactorCode(user.email, userInput);
```

**관련 용어:** [보안](#보안), [로그인](#로그인)

---

## Access Token

**한줄 정의:** 로그인 후 API를 호출할 때 전달하는 토큰. 유효 기간이 짧음

**쉬운 비유:** 하루 이용권입니다. 유효 기간이 짧아서 자주 갱신해야 합니다.

```typescript
// Access Token 사용 예시
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**관련 용어:** [Refresh Token](#refresh-token), [JWT](#jwt)

---

## Refresh Token

**한줄 정의:** 만료된 Access Token을 새로 발급받기 위한 토큰. 유효 기간이 김

**쉬운 비유:** 장기 회원권입니다. 매년 갱신하면 됩니다 (Access Token은 매일 갱신하지만).

```typescript
// Refresh Token으로 새 Access Token 받기
const newAccessToken = await fetch('/api/refresh', {
  method: 'POST',
  body: JSON.stringify({ refreshToken })
});
```

**관련 용어:** [Access Token](#access-token), [JWT](#jwt)

---

## SSO (Single Sign-On)

**한줄 정의:** 한 번 로그인하면 여러 서비스에서 인증 없이 접근할 수 있는 방식

**쉬운 비유:** 테마파크의 입장권입니다. 한 번 산 입장권으로 모든 놀이기구를 탈 수 있습니다.

**관련 용어:** [OAuth](#oauth), [로그인](#로그인)

---

## CORS (보안 관점)

**한줄 정의:** 다른 도메인의 API 호출을 제어하는 보안 메커니즘

**쉬운 비유:** 국경입니다. 어느 나라의 사람이 우리 나라에 들어올 수 있는지 통제합니다.

```typescript
// 서버에서 CORS 설정
const corsOptions = {
  origin: 'https://myapp.com',        // 이 도메인만 허용
  credentials: true,                   // 쿠키 포함 허용
  methods: ['GET', 'POST', 'PUT']
};

app.use(cors(corsOptions));
```

**관련 용어:** [보안](#보안), [권한](#권한)

---

## 로그인 (Login)

**한줄 정의:** 사용자가 자신의 계정으로 서비스에 접근 권한을 얻는 과정

**쉬운 비유:** 집에 들어가기 위해 열쇠를 사용하는 것입니다.

```typescript
// 기본적인 로그인 플로우
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  
  if (user && await verifyPassword(password, user.passwordHash)) {
    const token = generateJWT(user);
    res.json({ token });
  } else {
    res.status(401).send('인증 실패');
  }
});
```

**관련 용어:** [인증](#인증), [JWT](#jwt)

---

## 인증 (Authentication)

**한줄 정의:** 사용자가 자신이 주장하는 사람이 맞는지 확인하는 과정

**쉬운 비유:** 비행장의 신원 확인입니다. 여권을 보여주고 "맞습니다"라고 증명합니다.

**관련 용어:** [권한](#권한), [로그인](#로그인)

---

## 권한 (Authorization)

**한줄 정의:** 인증된 사용자가 어떤 작업을 할 수 있는지 결정하는 과정

**쉬운 비유:** 비행장에 들어간 후, 게이트A는 갈 수 있지만 게이트B는 못 가는 것입니다.

**관련 용어:** [인증](#인증), [RBAC](#rbac-role-based-access-control)
