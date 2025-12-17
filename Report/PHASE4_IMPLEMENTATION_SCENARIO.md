# Phase 4 구현 시나리오: 인증 강화

## 📋 개요

**목표**: 인증 시스템을 강화하여 보안과 사용성을 개선

**범위**: 토큰 갱신, 권한 검증 확인, 비밀번호 정책 검증

**예상 소요 시간**: 2-3시간

---

## 🎯 구현 목표

### 1. 토큰 갱신 기능 구현
- **최소 목표**: 기본적인 토큰 갱신 기능 구현
- **방법**: 간단한 방식 (refresh token 별도 저장 없이 access token 재발급)
- **제외**: 복잡한 refresh token 관리, 토큰 블랙리스트

### 2. 권한 검증 미들웨어 강화
- **최소 목표**: 이미 구현된 기능 확인 및 개선
- **방법**: 기존 `authorize()` 미들웨어 확인 및 에러 코드 개선
- **제외**: 복잡한 권한 체계 (이미 충분)

### 3. 비밀번호 정책 검증
- **최소 목표**: 회원가입 시 비밀번호 정책 검증
- **방법**: Zod 스키마에 비밀번호 검증 추가
- **제외**: 복잡한 정책, 비밀번호 히스토리

---

## 📝 상세 구현 계획

### Step 1: 토큰 갱신 기능 구현 (60분)

#### 1.1 간단한 토큰 갱신 방식
- **접근 방식**: Access token을 refresh token으로도 사용 (간소화)
- **로직**:
  1. 요청에서 토큰 받기 (Authorization header 또는 body)
  2. 토큰 검증 (만료된 토큰도 허용 - refresh용)
  3. 사용자 정보 추출
  4. 새 access token 발급
  5. 응답에 새 토큰 포함

**파일**: `backend/src/controllers/auth.controller.ts` (refresh 함수)

```typescript
// 예시 로직
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Get token from header or body
  // 2. Verify token (allow expired tokens)
  // 3. Get user from DB
  // 4. Generate new token
  // 5. Return new token
}
```

#### 1.2 토큰 검증 유틸리티
- 만료된 토큰도 검증 가능하도록 함수 분리
- 사용자 정보 추출

**파일**: `backend/src/utils/authUtils.ts` (신규, 선택적)

---

### Step 2: 권한 검증 미들웨어 확인 및 개선 (30분)

#### 2.1 현재 상태 확인
- **현재**: `authorize()` 미들웨어 이미 구현됨
- **확인 사항**:
  - ADMIN 역할 검증 작동 확인
  - 403 에러 코드 확인
  - 에러 메시지 확인

#### 2.2 에러 코드 개선
- 403 에러에 명확한 에러 코드 추가
- 에러 메시지 개선

**파일**: `backend/src/middleware/auth.middleware.ts` (수정)

```typescript
// 개선 사항
- AppError에 'FORBIDDEN' 코드 추가
- 에러 메시지: "Access denied. Admin role required."
```

---

### Step 3: 비밀번호 정책 검증 (60분)

#### 3.1 Zod 스키마에 비밀번호 검증 추가
- **요구사항**:
  - 최소 길이: 8자 이상
  - 대문자 포함
  - 소문자 포함
  - 숫자 포함
  - 특수문자 포함

**파일**: `backend/src/schemas/auth.schema.ts` (신규)

```typescript
// 예시
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
```

#### 3.2 회원가입 스키마 생성
- email, password, name 검증
- 비밀번호 정책 적용

#### 3.3 로그인 스키마 생성
- email, password 검증 (비밀번호 정책은 적용하지 않음)

#### 3.4 라우트에 검증 미들웨어 적용
- signup, login 라우트에 `validateRequest()` 적용

**파일**:
- `backend/src/schemas/auth.schema.ts` (신규)
- `backend/src/routes/auth.routes.ts` (수정)

---

## 🔍 구현 범위 및 제한사항

### ✅ 포함되는 것
1. 토큰 갱신 기능 (간단한 방식)
2. 권한 검증 확인 및 에러 코드 개선
3. 비밀번호 정책 검증 (회원가입)
4. 입력 검증 스키마 (회원가입, 로그인)

### ❌ 제외되는 것 (Phase 5로 연기)
1. 별도 refresh token 저장 (DB 또는 Redis)
2. 토큰 블랙리스트
3. 토큰 만료 시간 세분화 (access/refresh 분리)
4. 비밀번호 히스토리
5. 비밀번호 복잡도 점수 시스템
6. 다단계 인증 (2FA)

---

## 📊 예상 결과

### Before (현재 상태)
```
❌ 토큰 갱신: 빈 구현 (토큰 반환 안 함)
✅ 권한 검증: 이미 구현됨 (확인 필요)
❌ 비밀번호 정책: 검증 없음
```

### After (구현 후)
```
✅ 토큰 갱신: 새 토큰 발급 및 반환
✅ 권한 검증: 에러 코드 개선
✅ 비밀번호 정책: 회원가입 시 검증
⚠️  토큰 갱신: 간소화된 방식 (Phase 5에서 개선)
```

---

## 🧪 테스트 시나리오

### 시나리오 1: 토큰 갱신
```bash
POST /api/v1/auth/refresh
Headers: Authorization: Bearer <token>
# 또는
Body: { "token": "<token>" }

# 예상 결과
✅ 200 OK
✅ success: true
✅ data.token: 새 토큰 반환
```

### 시나리오 2: 비밀번호 정책 검증
```bash
POST /api/v1/auth/signup
Body: {
  "email": "test@example.com",
  "password": "weak",  // 너무 짧음
  "name": "Test User"
}

# 예상 결과
✅ 400 Bad Request
✅ code: "VALIDATION_ERROR"
✅ errors: [{ field: "password", message: "..." }]
```

### 시나리오 3: 권한 검증 (이미 작동)
```bash
GET /api/v1/admin/dashboard
Headers: Authorization: Bearer <customer-token>

# 예상 결과
✅ 403 Forbidden
✅ code: "FORBIDDEN"
✅ message: "Access denied. Admin role required."
```

---

## ⚠️ 주의사항 및 고려사항

### 1. 토큰 갱신 방식
- **현재 방식**: Access token을 refresh token으로도 사용 (간소화)
- **장점**: 구현 간단, 추가 저장소 불필요
- **단점**: 보안 수준 낮음 (토큰 탈취 시 위험)
- **Phase 5 개선**: 별도 refresh token 저장 및 관리

### 2. 토큰 만료 처리
- **현재**: 만료된 토큰도 refresh 가능하도록 처리
- **방법**: `jwt.verify()`의 `ignoreExpiration` 옵션 사용
- **주의**: 보안상 만료된 토큰도 검증 필요

### 3. 비밀번호 정책
- **요구사항**: 최소 8자, 대소문자, 숫자, 특수문자
- **적용 범위**: 회원가입만 (로그인은 기존 비밀번호 사용)
- **에러 메시지**: 명확한 피드백 제공

### 4. 권한 검증
- **현재 상태**: 이미 구현됨
- **개선 사항**: 에러 코드 및 메시지 개선만
- **확인 필요**: 모든 관리자 라우트에 적용 확인

### 5. 에러 코드 표준화
- `FORBIDDEN`: 권한 없음 (403)
- `UNAUTHORIZED`: 인증 실패 (401)
- `VALIDATION_ERROR`: 입력 검증 실패 (400)

---

## 📁 생성/수정될 파일 목록

### 신규 생성
1. `backend/src/schemas/auth.schema.ts` - 인증 관련 스키마

### 수정
1. `backend/src/controllers/auth.controller.ts` - refresh 함수 구현
2. `backend/src/middleware/auth.middleware.ts` - 에러 코드 개선
3. `backend/src/routes/auth.routes.ts` - 검증 미들웨어 적용

---

## 📝 구현 순서

1. **Step 1**: 비밀번호 정책 검증 스키마 생성
   - auth.schema.ts 생성
   - signup, login 스키마 정의

2. **Step 2**: 라우트에 검증 미들웨어 적용
   - signup, login 라우트 수정

3. **Step 3**: 토큰 갱신 기능 구현
   - refresh 함수 구현
   - 토큰 검증 및 새 토큰 발급

4. **Step 4**: 권한 검증 미들웨어 개선
   - 에러 코드 추가
   - 에러 메시지 개선

---

## ✅ 승인 체크리스트

구현 전 확인 사항:
- [ ] 시나리오 검토 완료
- [ ] 구현 범위 이해 (최소 단위)
- [ ] 토큰 갱신 간소화 방식 수용
- [ ] 제외 사항 이해 (Phase 5로 연기)
- [ ] 비밀번호 정책 요구사항 확인
- [ ] 예상 결과 수용 가능
- [ ] 주의사항 확인

---

## 🚀 다음 단계 (Phase 5)

Phase 4 완료 후:
1. 별도 refresh token 저장 (DB 또는 Redis)
2. 토큰 블랙리스트 구현
3. Access/Refresh token 분리
4. 토큰 만료 시간 세분화
5. 비밀번호 히스토리
6. 다단계 인증 (2FA)

---

## 🔍 토큰 갱신 구현 방식 상세

### 옵션 1: 간단한 방식 (권장 - 최소 단위)
- Access token을 refresh token으로도 사용
- 만료된 토큰도 검증하여 새 토큰 발급
- **장점**: 구현 간단, 추가 저장소 불필요
- **단점**: 보안 수준 낮음

### 옵션 2: 별도 refresh token (Phase 5)
- DB에 refresh token 저장
- Access token과 분리
- **장점**: 보안 수준 높음
- **단점**: 구현 복잡, DB 스키마 변경 필요

**Phase 4에서는 Option 1 사용**

---

**작성일**: 2024-12-16  
**버전**: 1.0  
**상태**: 승인 대기

