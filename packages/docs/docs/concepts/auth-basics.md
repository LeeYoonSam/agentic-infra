---
sidebar_position: 4
---

# 인증과 권한 관리 이해하기

## 인증(Authentication) vs 인가(Authorization)

이 두 용어는 자주 혼동됩니다. 명확하게 구분해봅시다.

### 인증 (Authentication)

**"당신이 정말 그 사람인가?"를 확인하는 것**

```
사용자: "저는 Alice입니다"
시스템: "증거를 보여주세요"
사용자: "이메일과 비밀번호입니다"
시스템: "검증 완료. 당신은 확실히 Alice입니다"
```

실생활 예제:
- 은행: ID 카드 확인
- 공항: 여권 확인
- 웹사이트: 로그인

### 인가 (Authorization)

**"당신이 뭘 할 수 있는지"를 확인하는 것**

```
Alice (인증됨): "내 게시물을 삭제해주세요"
시스템: "당신이 그 게시물의 소유자인가요?"
시스템: "네, 당신이 작성했습니다. 삭제 권한이 있습니다"

Bob (인증됨): "Alice의 게시물을 삭제해주세요"
시스템: "당신이 그 게시물의 소유자인가요?"
시스템: "아니요, 삭제 권한이 없습니다"
```

실생활 예제:
- 은행: 계좌 소유자만 돈을 인출할 수 있음
- 도서관: 회원만 책을 빌릴 수 있음
- 웹사이트: 관리자만 다른 사용자를 삭제할 수 있음

### 정리

```
인증 (Authentication)  →  "당신이 누구인가?"
인가 (Authorization)   →  "당신이 뭘 할 수 있는가?"

인증이 먼저 → 인가는 나중에
```

## 세션 기반 인증 vs 토큰 기반 인증

### 세션 기반 인증

**작동 원리**

```
1. 사용자: 로그인 요청 (이메일 + 비밀번호)
2. 서버: 비밀번호 확인
3. 서버: 세션 생성 (메모리나 데이터베이스에 저장)
4. 서버: 세션 ID를 쿠키로 응답
5. 브라우저: 쿠키 저장 (자동으로 모든 요청에 포함)
6. 사용자: 페이지 이동
7. 브라우저: 요청과 함께 쿠키(세션 ID) 전송
8. 서버: 세션 ID 확인 후 요청 처리
```

**코드 예제 (Express.js)**

```javascript
const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));

// 로그인
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // 비밀번호 확인
  if (isValidPassword(email, password)) {
    // 세션 생성
    req.session.userId = getUserId(email);
    req.session.email = email;
    
    res.json({ message: '로그인 성공' });
  } else {
    res.status(401).json({ message: '로그인 실패' });
  }
});

// 보호된 라우트
app.get('/user/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: '인증 필요' });
  }
  
  // 세션이 있으면 사용자 정보 반환
  res.json({
    userId: req.session.userId,
    email: req.session.email
  });
});

// 로그아웃
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: '로그아웃 실패' });
    res.json({ message: '로그아웃 완료' });
  });
});
```

**장점**
- 간단함
- 구현이 쉬움
- 서버에서 완전히 제어 가능 (로그아웃 시 즉시 무효화)

**단점**
- 서버 메모리 사용 (사용자가 많으면 부담)
- 확장성 낮음 (여러 서버에서 세션 공유 어려움)
- CSRF(Cross-Site Request Forgery) 공격에 취약

### 토큰 기반 인증

**작동 원리**

```
1. 사용자: 로그인 요청 (이메일 + 비밀번호)
2. 서버: 비밀번호 확인
3. 서버: JWT 토큰 생성
4. 서버: 토큰을 응답으로 반환 (쿠키 아님)
5. 클라이언트: 토큰 저장 (로컬 스토리지 등)
6. 사용자: 페이지 이동
7. 클라이언트: 요청의 Authorization 헤더에 토큰 포함
8. 서버: 토큰 검증 후 요청 처리
```

**코드 예제 (Express.js + JWT)**

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'my-secret-key';

// 로그인
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // 비밀번호 확인
  if (isValidPassword(email, password)) {
    const userId = getUserId(email);
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { userId, email },
      SECRET_KEY,
      { expiresIn: '24h' }  // 24시간 유효
    );
    
    res.json({ token });
  } else {
    res.status(401).json({ message: '로그인 실패' });
  }
});

// 인증 미들웨어
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: '토큰 필요' });
  }
  
  // "Bearer token" 형식에서 토큰 추출
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ message: '토큰 검증 실패' });
  }
}

// 보호된 라우트
app.get('/user/profile', verifyToken, (req, res) => {
  res.json({
    userId: req.userId,
    email: req.email
  });
});

// 로그아웃 (클라이언트에서 토큰 삭제하면 됨)
app.post('/logout', (req, res) => {
  // 서버 측에서 할 것은 없음
  res.json({ message: '로그아웃 완료' });
});
```

**클라이언트에서 사용**

```javascript
// 로그인
async function login(email, password) {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const { token } = await response.json();
  
  // 토큰 저장
  localStorage.setItem('token', token);
  
  return token;
}

// API 요청 시 토큰 포함
async function fetchUserProfile() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
}

// 로그아웃
function logout() {
  // 토큰 삭제
  localStorage.removeItem('token');
}
```

**장점**
- 확장성 높음 (여러 서버에서 토큰 검증 가능)
- 서버 메모리 사용 안 함
- 모바일 앱에 적합
- CORS 친화적

**단점**
- 토큰이 탈취되면 즉시 무효화 어려움
- 토큰 크기가 세션 ID보다 큼

### 비교표

| 항목 | 세션 | 토큰 |
|------|------|------|
| 저장소 | 서버 | 클라이언트 |
| 보안 | 높음 (서버 제어) | 낮음 (클라이언트 보관) |
| 확장성 | 낮음 | 높음 |
| 메모리 | 사용함 | 사용 안 함 |
| 로그아웃 | 즉시 | 느림 |
| 모바일 | 어려움 | 쉬움 |

## JWT (JSON Web Token) 구조와 작동 원리

### JWT란?

JWT는 자체 정보를 담고 있는 암호화된 토큰입니다.

### JWT 구조

JWT는 세 부분으로 구성됩니다:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**1. Header (헤더)**

```json
{
  "alg": "HS256",  // 서명 알고리즘
  "typ": "JWT"     // 토큰 타입
}

// Base64 인코딩됨
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

**2. Payload (페이로드)**

```json
{
  "sub": "1234567890",  // 주제 (사용자 ID)
  "name": "John Doe",   // 이름
  "iat": 1516239022,    // 발급 시간
  "exp": 1516325422     // 만료 시간
}

// Base64 인코딩됨
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
```

**3. Signature (서명)**

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)

// 결과
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### JWT 검증 과정

```
클라이언트가 토큰을 보냄
    ↓
1. Signature 검증
   - Header.Payload를 다시 계산
   - 계산한 값과 Signature 비교
   - 일치하면 변조 안 된 것

2. Expiration 확인
   - exp 클레임 확인
   - 현재 시간보다 크면 유효

3. 데이터 추출
   - Payload에서 userId, email 등 추출
   - 요청 처리
```

**코드 예제**

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const decoded = jwt.verify(token, SECRET_KEY);
console.log(decoded);
// {
//   sub: '1234567890',
//   name: 'John Doe',
//   iat: 1516239022,
//   exp: 1516325422
// }
```

### JWT vs Session 토큰

JWT는 일반적인 세션 토큰(세션 ID)과 다릅니다:

```
세션 토큰:
abc123def456  ← 의미 없는 문자열
(서버에서 의미 저장)

JWT:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0...
↑ 자체적으로 데이터 포함
```

## OAuth 2.0 플로우 (소셜 로그인)

### 개념

사용자가 다른 서비스 (Google, GitHub 등)의 계정으로 앱에 로그인하는 방식입니다.

### 작동 원리

```
사용자
  ↓
클라이언트 앱 → "Google로 로그인" 버튼
  ↓
1. 사용자가 Google 로그인 버튼 클릭
  ↓
2. 앱이 Google 로그인 페이지로 리다이렉트
  ↓
3. 사용자가 Google 계정으로 인증
  ↓
4. Google이 인증 코드 발급
  ↓
5. 앱 백엔드로 리다이렉트 (코드 포함)
  ↓
6. 앱이 코드를 토큰으로 교환
  ↓
7. 앱이 토큰으로 사용자 정보 조회
  ↓
8. 앱이 자신의 토큰 발급
  ↓
9. 사용자 로그인 완료
```

### 코드 예제

**프론트엔드 (클라이언트)**

```javascript
// Google OAuth 라이브러리 로드
<script src="https://accounts.google.com/gsi/client" async defer></script>

// 로그인 버튼
function handleCredentialResponse(response) {
  // response.credential은 Google이 발급한 JWT 토큰
  const token = response.credential;
  
  // 백엔드로 토큰 전송
  fetch('/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
    .then(res => res.json())
    .then(data => {
      // 앱의 토큰 저장
      localStorage.setItem('token', data.token);
      // 로그인 성공
      window.location.href = '/dashboard';
    });
}

window.onload = function() {
  google.accounts.id.initialize({
    client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
    callback: handleCredentialResponse
  });
  
  google.accounts.id.renderButton(
    document.getElementById('buttonDiv'),
    { theme: 'outline', size: 'large' }
  );
};
```

**백엔드 (서버)**

```javascript
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
  'YOUR_CLIENT_ID.apps.googleusercontent.com'
);

app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  
  try {
    // Google 토큰 검증
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
    });
    
    const payload = ticket.getPayload();
    const userId = payload['sub'];  // Google 사용자 ID
    const email = payload['email'];
    const name = payload['name'];
    
    // 또는 새 사용자 생성
    let user = await User.findByGoogleId(userId);
    if (!user) {
      user = await User.create({
        googleId: userId,
        email,
        name
      });
    }
    
    // 앱의 JWT 토큰 생성
    const appToken = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.json({ token: appToken });
  } catch (error) {
    res.status(401).json({ message: '인증 실패' });
  }
});
```

## Supabase Auth vs Cognito

### Supabase Auth

**특징**
- PostgreSQL 기반
- JWT 토큰 사용
- 오픈소스 (자체 호스팅 가능)
- 간단한 API

**설정**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_KEY'
);

// 회원가입
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// 로그인
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// 로그아웃
await supabase.auth.signOut();

// 사용자 정보
const { data: { user } } = await supabase.auth.getUser();
```

### Cognito

**특징**
- AWS 관리 서비스
- 복잡하지만 강력함
- 엔터프라이즈급 기능
- 비용이 더 들 수 있음

**설정**

```javascript
import { Amplify, Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'YOUR_USER_POOL_ID',
    userPoolWebClientId: 'YOUR_CLIENT_ID'
  }
});

// 회원가입
try {
  const { user } = await Auth.signUp({
    username: 'user@example.com',
    password: 'TempPassword123!',
    attributes: {
      email: 'user@example.com'
    }
  });
} catch (error) {
  console.error(error);
}

// 로그인
try {
  const user = await Auth.signIn(username, password);
} catch (error) {
  console.error(error);
}

// 로그아웃
await Auth.signOut();
```

### 비교표

| 항목 | Supabase Auth | Cognito |
|------|---------------|---------|
| 설정 | 간단함 | 복잡함 |
| 비용 | 저렴함 | 비쌈 |
| 학습 곡선 | 낮음 | 높음 |
| 확장성 | 중간 | 높음 |
| 커스터마이징 | 제한적 | 강력함 |

## 보안 모범 사례

### 1. 비밀번호 저장

**절대 금지: 평문으로 저장**

```javascript
// 위험!
user.password = 'password123';
```

**권장: 해싱**

```javascript
const bcrypt = require('bcrypt');

// 비밀번호 해싱 (비용 인수 10)
const hashedPassword = await bcrypt.hash('password123', 10);

// 데이터베이스에 저장
user.password = hashedPassword;

// 로그인 시 확인
const isMatch = await bcrypt.compare('password123', hashedPassword);
if (isMatch) {
  // 비밀번호 일치
}
```

### 2. HTTPS 사용

토큰과 비밀번호는 항상 HTTPS(암호화)를 통해 전송합니다:

```javascript
// 안전한 연결
fetch('https://api.example.com/login', { ... })

// 안전하지 않은 연결 (사용 금지)
fetch('http://api.example.com/login', { ... })
```

### 3. 토큰 만료 시간

토큰은 만료 시간을 설정하여 탈취 피해를 최소화합니다:

```javascript
const token = jwt.sign(
  { userId },
  SECRET_KEY,
  { expiresIn: '1h' }  // 1시간 후 만료
);
```

단기 토큰과 장기 토큰 조합:

```javascript
// Access Token (1시간)
const accessToken = jwt.sign(
  { userId },
  ACCESS_SECRET,
  { expiresIn: '1h' }
);

// Refresh Token (7일)
const refreshToken = jwt.sign(
  { userId },
  REFRESH_SECRET,
  { expiresIn: '7d' }
);

// 클라이언트: accessToken 사용
// accessToken 만료 시: refreshToken으로 새 accessToken 획득
```

### 4. CSRF 방지

Cross-Site Request Forgery 공격 방지:

```javascript
// CSRF 토큰 생성
app.get('/form', (req, res) => {
  const csrfToken = csrf.generate();
  res.render('form', { csrfToken });
});

// CSRF 검증
app.post('/form', csrf.verify(), (req, res) => {
  // CSRF 토큰이 유효한 경우만 처리
  res.json({ message: '요청 처리 완료' });
});
```

### 5. Rate Limiting

같은 IP에서 너무 많은 로그인 시도 방지:

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15분
  max: 5,                     // 최대 5회
  message: '로그인 시도 횟수 초과'
});

app.post('/login', loginLimiter, (req, res) => {
  // 로그인 처리
});
```

## 코드 예제: 완전한 로그인 플로우

### 백엔드 (Express + JWT + bcrypt)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgresql://...'
});

const SECRET_KEY = 'your-secret-key';

// 회원가입
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 이미 존재하는 사용자인지 확인
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: '이미 가입한 이메일' });
    }
    
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 사용자 생성
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );
    
    const userId = result.rows[0].id;
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { userId, email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그인
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 사용자 조회
    const result = await pool.query(
      'SELECT id, password FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: '로그인 실패' });
    }
    
    const user = result.rows[0];
    
    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );
    
    if (!isValidPassword) {
      return res.status(401).json({ message: '로그인 실패' });
    }
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 인증 미들웨어
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: '토큰 필요' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ message: '토큰 검증 실패' });
  }
}

// 보호된 라우트
app.get('/user/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email FROM users WHERE id = $1',
      [req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: '사용자 없음' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
});

app.listen(3000, () => {
  console.log('서버 시작됨 (포트 3000)');
});
```

### 클라이언트 (JavaScript)

```javascript
class AuthClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  // 회원가입
  async register(email, password) {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('회원가입 실패');
    }
    
    const { token } = await response.json();
    localStorage.setItem('token', token);
    
    return token;
  }
  
  // 로그인
  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('로그인 실패');
    }
    
    const { token } = await response.json();
    localStorage.setItem('token', token);
    
    return token;
  }
  
  // 프로필 조회
  async getProfile() {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseUrl}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('프로필 조회 실패');
    }
    
    return response.json();
  }
  
  // 로그아웃
  logout() {
    localStorage.removeItem('token');
  }
  
  // 토큰 존재 여부
  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }
}

// 사용
const auth = new AuthClient('http://localhost:3000');

// 회원가입
try {
  await auth.register('user@example.com', 'password123');
  console.log('회원가입 성공');
} catch (error) {
  console.error(error);
}

// 로그인
try {
  await auth.login('user@example.com', 'password123');
  console.log('로그인 성공');
} catch (error) {
  console.error(error);
}

// 프로필 조회
if (auth.isLoggedIn()) {
  const profile = await auth.getProfile();
  console.log('프로필:', profile);
}

// 로그아웃
auth.logout();
```

## 정리

인증과 권한 관리는 웹 서비스의 보안 기초입니다:

1. **인증**: 사용자가 누구인지 확인 (로그인)
2. **인가**: 사용자가 뭘 할 수 있는지 확인 (권한)
3. **세션**: 서버에서 상태 유지
4. **토큰**: 클라이언트가 자체 정보 보관
5. **JWT**: 자체 정보를 담은 암호화된 토큰
6. **OAuth**: 다른 서비스로 로그인
7. **보안**: 비밀번호 해싱, HTTPS, 만료 시간 설정

다음 가이드에서는 서버를 관리하지 않고도 코드를 실행하는 방식인 서버리스 아키텍처를 다룹니다.
