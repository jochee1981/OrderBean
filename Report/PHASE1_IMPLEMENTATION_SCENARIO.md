# Phase 1 구현 시나리오: 테스트 환경 및 기본 인프라

## 📋 개요

**목표**: GREEN 단계를 시작하기 위한 최소한의 테스트 환경 구축 및 기본 입력 검증 구현

**범위**: Phase 1의 핵심 기능만 최소 단위로 구현 (MVP 수준)

**예상 소요 시간**: 2-3시간

---

## 🎯 구현 목표

### 1. 테스트용 데이터베이스 설정
- **최소 목표**: 테스트 실행 시 DB 연결 오류 해결
- **방법**: `.env.test` 파일 생성 및 테스트 DB URL 설정
- **대안**: 실제 DB 없이도 테스트 가능하도록 기본 구조만 마련

### 2. 테스트 격리 구현
- **최소 목표**: 각 테스트가 독립적으로 실행 가능
- **방법**: `beforeEach`/`afterEach`에서 기본적인 DB 정리
- **범위**: 필수적인 테스트만 격리 (전체 테스트 격리는 Phase 2)

### 3. 입력 검증 스키마 (Zod)
- **최소 목표**: 주문 생성 API의 기본 입력 검증만 구현
- **방법**: Zod 스키마 생성 및 미들웨어 적용
- **범위**: 주문 생성 요청만 (회원가입/로그인은 Phase 2)

---

## 📝 상세 구현 계획

### Step 1: 테스트 환경 변수 설정 (30분)

#### 1.1 `.env.test` 파일 생성
```env
# Test Environment Variables
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/orderbean_test
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/orderbean_test
JWT_SECRET=test_jwt_secret_key_for_testing_only
JWT_EXPIRES_IN=24h
REDIS_URL=
```

#### 1.2 `setup.ts` 개선
- `.env.test` 파일이 없을 경우 기본값 사용
- DB 연결 실패 시 graceful handling
- 테스트 환경 감지 로직 추가

**파일**: `backend/src/__tests__/setup.ts`

---

### Step 2: 테스트 격리 기본 구조 (45분)

#### 2.1 테스트 헬퍼 함수 추가
- `cleanupDatabase()`: 테스트 후 DB 정리
- `seedTestData()`: 기본 테스트 데이터 생성
- `resetDatabase()`: DB 초기화 (선택적)

**파일**: `backend/src/__tests__/helpers/testHelpers.ts` (확장)

#### 2.2 기본 테스트 격리 적용
- `order.controller.test.ts`에 `beforeEach`/`afterEach` 추가
- 가장 간단한 방법: 각 테스트 전에 관련 테이블만 정리
- 트랜잭션 롤백은 Phase 2에서 구현

**적용 대상**: 
- `backend/src/__tests__/order.controller.test.ts` (우선)
- 다른 테스트 파일은 Phase 2에서 확장

---

### Step 3: Zod 입력 검증 스키마 (60분)

#### 3.1 Zod 스키마 디렉토리 생성
```
backend/src/
  schemas/
    order.schema.ts      # 주문 관련 스키마
    common.schema.ts     # 공통 스키마 (에러 응답 등)
```

#### 3.2 주문 생성 스키마 구현
```typescript
// order.schema.ts
- createOrderSchema: 주문 생성 요청 검증
  - cafeId: string (UUID 형식)
  - items: array (최소 1개)
    - menuId: string
    - quantity: number (1 이상)
    - selectedOptions: array (optional)
    - notes: string (optional)
  - pickupTime: string (ISO date, 미래 시간)
```

#### 3.3 검증 미들웨어 생성
```typescript
// middleware/validation.middleware.ts
- validateRequest(schema): Express 미들웨어
  - 요청 body 검증
  - 실패 시 400 에러 반환
  - 표준화된 에러 응답 형식
```

#### 3.4 주문 라우트에 적용
- `POST /api/v1/orders`에 검증 미들웨어 추가
- 기존 컨트롤러는 그대로 유지 (검증만 추가)

**파일**:
- `backend/src/schemas/order.schema.ts` (신규)
- `backend/src/middleware/validation.middleware.ts` (신규)
- `backend/src/routes/order.routes.ts` (수정)

---

## 🔍 구현 범위 및 제한사항

### ✅ 포함되는 것
1. `.env.test` 파일 생성
2. 테스트 격리 기본 구조 (order 테스트만)
3. 주문 생성 API의 Zod 검증
4. 표준화된 에러 응답 형식

### ❌ 제외되는 것 (Phase 2로 연기)
1. Prisma Mock 설정 (실제 DB 사용)
2. 모든 테스트 파일의 격리 (order만)
3. 회원가입/로그인 스키마 (주문만)
4. 트랜잭션 롤백 격리 (기본 정리만)
5. 테스트 데이터 시드 자동화 (수동 생성)

---

## 📊 예상 결과

### Before (현재 상태)
```
❌ 테스트 실행 시: Can't reach database server at localhost:5432
❌ 입력 검증 없음: 모든 요청이 컨트롤러까지 도달
❌ 테스트 격리 없음: 테스트 간 데이터 충돌 가능
```

### After (구현 후)
```
✅ 테스트 실행 시: .env.test 파일 로드 성공
✅ 주문 생성 API: 기본 입력 검증 동작
✅ Order 테스트: 기본적인 격리 적용
⚠️  다른 테스트: 여전히 DB 연결 필요 (Phase 2에서 해결)
```

---

## 🧪 테스트 시나리오

### 시나리오 1: 테스트 환경 변수 로드
```bash
# 실행
npm test

# 예상 결과
✅ .env.test 파일 로드 성공
✅ TEST_DATABASE_URL 사용
✅ 테스트 환경 감지
```

### 시나리오 2: 주문 생성 입력 검증
```bash
# 테스트 케이스
POST /api/v1/orders
Body: { "cafeId": "", "items": [] }

# 예상 결과
✅ 400 Bad Request
✅ 에러 메시지: "cafeId is required"
✅ 에러 코드: "VALIDATION_ERROR"
```

### 시나리오 3: 테스트 격리
```bash
# 테스트 실행
npm test order.controller.test.ts

# 예상 결과
✅ 각 테스트 전 DB 정리
✅ 테스트 간 데이터 충돌 없음
✅ 테스트 독립성 확보
```

---

## ⚠️ 주의사항 및 고려사항

### 1. 데이터베이스 연결
- **현재**: 실제 PostgreSQL DB 필요
- **Phase 1**: `.env.test` 설정만 추가 (DB는 여전히 필요)
- **Phase 2**: Prisma Mock 또는 테스트용 DB 컨테이너 추가

### 2. 테스트 격리 범위
- **Phase 1**: Order 테스트만 격리
- **이유**: 가장 많은 테스트 실패 (10개)를 가진 영역
- **Phase 2**: 모든 테스트 파일에 확장

### 3. Zod 스키마 범위
- **Phase 1**: 주문 생성만
- **이유**: 가장 복잡한 입력 검증이 필요한 영역
- **Phase 2**: 회원가입, 로그인 등 확장

### 4. 에러 응답 형식
- **표준 형식**:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "errors": [
      { "field": "cafeId", "message": "cafeId is required" }
    ]
  }
  ```

---

## 📁 생성/수정될 파일 목록

### 신규 생성
1. `backend/.env.test` - 테스트 환경 변수
2. `backend/src/schemas/order.schema.ts` - 주문 스키마
3. `backend/src/schemas/common.schema.ts` - 공통 스키마
4. `backend/src/middleware/validation.middleware.ts` - 검증 미들웨어

### 수정
1. `backend/src/__tests__/setup.ts` - 테스트 환경 설정 개선
2. `backend/src/__tests__/helpers/testHelpers.ts` - 격리 헬퍼 추가
3. `backend/src/__tests__/order.controller.test.ts` - 격리 적용
4. `backend/src/routes/order.routes.ts` - 검증 미들웨어 추가

---

## ✅ 승인 체크리스트

구현 전 확인 사항:
- [ ] 시나리오 검토 완료
- [ ] 구현 범위 이해 (최소 단위)
- [ ] 제외 사항 이해 (Phase 2로 연기)
- [ ] 예상 결과 수용 가능
- [ ] 주의사항 확인

---

## 🚀 다음 단계 (Phase 2)

Phase 1 완료 후:
1. 모든 테스트 파일에 격리 적용
2. 회원가입/로그인 스키마 추가
3. Prisma Mock 또는 테스트 DB 컨테이너 설정
4. 트랜잭션 롤백 격리 구현
5. 테스트 데이터 시드 자동화

---

**작성일**: 2024-12-16  
**버전**: 1.0  
**상태**: 승인 대기

