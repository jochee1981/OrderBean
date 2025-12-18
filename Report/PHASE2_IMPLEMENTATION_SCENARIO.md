# Phase 2 구현 시나리오: 핵심 비즈니스 로직 (주문 생성)

## 📋 개요

**목표**: 주문 생성 기능의 핵심 비즈니스 로직을 최소 단위로 구현하여 테스트를 통과시키기

**범위**: 주문 생성 API의 핵심 기능만 구현 (결제, 고급 재고 관리 등은 제외)

**예상 소요 시간**: 4-5시간

---

## 🎯 구현 목표

### 1. 주문 생성 기능 완전 구현
- **최소 목표**: 테스트를 통과시키는 수준의 기본 구현
- **방법**: 핵심 로직만 구현, 복잡한 부분은 간소화
- **제외**: 결제 처리, 고급 재고 관리, 복잡한 할인 로직

### 2. 주문 재시도 기능
- **최소 목표**: 기본적인 재시도 로직만 구현
- **방법**: 이전 주문 복사 및 재생성
- **제외**: 복잡한 재시도 정책, 결제 재처리

---

## 📝 상세 구현 계획

### Step 1: 주문 번호 생성 유틸리티 (30분)

#### 1.1 주문 번호 생성 함수
- **형식**: `ORD-YYYYMMDD-XXXX` (예: `ORD-20241216-0001`)
- **로직**: 날짜 + 일련번호 (간단한 카운터)
- **고유성**: DB에서 최대값 조회 후 +1

**파일**: `backend/src/utils/orderUtils.ts` (신규)

```typescript
// 예시
generateOrderNumber(): Promise<string>
// ORD-20241216-0001 형식
```

---

### Step 2: 가격 계산 로직 (60분)

#### 2.1 가격 계산 함수
- **입력**: 메뉴 ID, 수량, 선택된 옵션들
- **처리**:
  1. 메뉴 기본 가격 조회
  2. 선택된 옵션들의 가격 조정값 합산
  3. (기본 가격 + 옵션 가격) × 수량 = 소계
  4. 모든 항목 소계 합 = 총액
  5. 할인은 Phase 3에서 구현 (현재는 0)

**파일**: `backend/src/utils/orderUtils.ts` (확장)

```typescript
// 예시
async calculateItemPrice(
  menuId: string,
  quantity: number,
  selectedOptions: Array<{ optionGroupId: string; selectedOptionId: string }>
): Promise<{ unitPrice: number; subtotal: number }>

async calculateOrderTotal(items: OrderItem[]): Promise<number>
```

---

### Step 3: 메뉴 및 옵션 검증 (90분)

#### 3.1 메뉴 존재 확인
- 메뉴 ID로 DB 조회
- 메뉴가 존재하고 활성화되어 있는지 확인
- 존재하지 않으면 400 에러

#### 3.2 필수 옵션 검증
- 메뉴의 필수 옵션 그룹 조회
- 선택된 옵션과 비교
- 필수 옵션이 누락되면 `INVALID_OPTIONS` 에러

#### 3.3 옵션 유효성 검증
- 선택된 옵션이 해당 메뉴의 옵션인지 확인
- 옵션 그룹과 옵션 ID 매칭 확인

**파일**: `backend/src/utils/orderUtils.ts` (확장)

```typescript
// 예시
async validateMenu(menuId: string): Promise<Menu>
async validateRequiredOptions(
  menuId: string,
  selectedOptions: Array<{ optionGroupId: string; selectedOptionId: string }>
): Promise<void>
```

---

### Step 4: 재고 확인 로직 (60분)

#### 4.1 재고 확인 (간소화 버전)
- **최소 구현**: 메뉴에 재고 필드가 있다면 확인
- **현재 스키마**: Menu에 재고 필드가 없을 수 있음
- **대안**: 
  - Option 1: Menu 스키마에 `stock` 필드 추가 (간단)
  - Option 2: 재고 확인 로직은 스킵하고 항상 통과 (Phase 3에서 구현)
- **권장**: Option 1 (최소한의 스키마 변경)

**파일**: 
- `backend/prisma/schema.prisma` (Menu 모델에 stock 필드 추가)
- `backend/src/utils/orderUtils.ts` (재고 확인 함수)

```typescript
// 예시
async checkStock(menuId: string, quantity: number): Promise<void>
// 재고 부족 시 OUT_OF_STOCK 에러
```

---

### Step 5: 주문 데이터 생성 (120분)

#### 5.1 트랜잭션 내 주문 생성
- Prisma 트랜잭션 사용
- 순서:
  1. Order 레코드 생성
  2. OrderItem 레코드들 생성
  3. OrderItemOption 레코드들 생성
  4. 커밋

#### 5.2 주문 번호 생성 및 저장
- 고유한 주문 번호 생성
- Order 테이블에 저장

#### 5.3 상태 초기화
- status: `PENDING`
- created_at: 현재 시간
- pickup_time: 요청에서 받은 값 또는 null

**파일**: `backend/src/controllers/order.controller.ts` (수정)

```typescript
// createOrder 함수 구현
// 1. 입력 검증 (이미 Zod로 완료)
// 2. 메뉴 및 옵션 검증
// 3. 재고 확인
// 4. 가격 계산
// 5. 트랜잭션으로 주문 생성
// 6. 응답 반환
```

---

### Step 6: 응답 데이터 구성 (30분)

#### 6.1 응답 형식
- 테스트에서 기대하는 형식에 맞춤
- 포함 항목:
  - orderId
  - orderNumber
  - status
  - totalAmount
  - finalAmount
  - items (주문 항목 목록)

**파일**: `backend/src/controllers/order.controller.ts` (수정)

---

### Step 7: 주문 재시도 기능 (60분)

#### 7.1 기본 재시도 로직
- 이전 주문 조회
- 주문 항목 및 옵션 복사
- 새 주문 생성 (간단한 복사 로직)

**파일**: `backend/src/controllers/order.controller.ts` (retryOrder 함수)

---

## 🔍 구현 범위 및 제한사항

### ✅ 포함되는 것
1. 주문 번호 생성 (간단한 형식)
2. 가격 계산 (기본 가격 + 옵션 가격)
3. 메뉴 존재 확인
4. 필수 옵션 검증
5. 재고 확인 (간소화 버전, stock 필드 추가 필요)
6. 트랜잭션으로 주문 생성
7. 표준 응답 형식
8. 기본 재시도 로직

### ❌ 제외되는 것 (Phase 3로 연기)
1. 결제 처리 (Toss Payments 연동)
2. 복잡한 할인 로직 (쿠폰, 포인트 등)
3. 고급 재고 관리 (예약 재고, 동시성 제어 등)
4. 주문 알림 (WebSocket, 이메일 등)
5. 복잡한 재시도 정책 (실패 처리, 재결제 등)
6. 주문 예상 시간 계산

---

## 📊 예상 결과

### Before (현재 상태)
```
❌ 주문 생성 API: 빈 응답만 반환
❌ 테스트 실패: 10개 테스트 모두 실패
❌ 가격 계산 없음
❌ 재고 확인 없음
❌ 필수 옵션 검증 없음
```

### After (구현 후)
```
✅ 주문 생성 API: 실제 주문 데이터 생성
✅ 기본 테스트 통과: 정상적인 주문 생성 테스트 통과
✅ 가격 계산: 기본 가격 + 옵션 가격 계산
✅ 재고 확인: 기본적인 재고 확인 (stock 필드 필요)
✅ 필수 옵션 검증: 필수 옵션 누락 시 에러
⚠️  결제 처리: 미구현 (Phase 3)
⚠️  고급 기능: 미구현 (Phase 3)
```

---

## 🧪 테스트 시나리오

### 시나리오 1: 정상적인 주문 생성
```bash
POST /api/v1/orders
Body: {
  "cafeId": "valid-cafe-id",
  "items": [{
    "menuId": "valid-menu-id",
    "quantity": 2,
    "selectedOptions": [...]
  }]
}

# 예상 결과
✅ 201 Created
✅ orderId, orderNumber 반환
✅ totalAmount, finalAmount 계산됨
✅ DB에 주문 저장됨
```

### 시나리오 2: 필수 옵션 누락
```bash
POST /api/v1/orders
Body: {
  "cafeId": "valid-cafe-id",
  "items": [{
    "menuId": "menu-with-required-options",
    "quantity": 1
    // required option missing
  }]
}

# 예상 결과
✅ 400 Bad Request
✅ code: "INVALID_OPTIONS"
```

### 시나리오 3: 재고 부족
```bash
POST /api/v1/orders
Body: {
  "cafeId": "valid-cafe-id",
  "items": [{
    "menuId": "out-of-stock-menu-id",
    "quantity": 100
  }]
}

# 예상 결과
✅ 400 Bad Request
✅ code: "OUT_OF_STOCK"
```

---

## ⚠️ 주의사항 및 고려사항

### 1. 데이터베이스 스키마 변경
- **필요**: Menu 모델에 `stock` 필드 추가
- **타입**: `Int?` (nullable, 기본값 null)
- **마이그레이션**: `prisma migrate dev` 필요

### 2. 트랜잭션 처리
- Prisma의 `$transaction` 사용
- 모든 주문 관련 데이터를 원자적으로 생성
- 실패 시 자동 롤백

### 3. 주문 번호 고유성
- 간단한 구현: 날짜 + 시퀀스
- 동시성 문제: Phase 3에서 개선 (분산 락 등)
- 현재는 기본 구현만

### 4. 재고 확인 범위
- **Phase 2**: 기본적인 재고 확인만
- **제외**: 예약 재고, 동시성 제어, 재고 예약 등
- **Phase 3**: 고급 재고 관리 구현

### 5. 에러 처리
- 표준화된 에러 코드 사용
- `OUT_OF_STOCK`: 재고 부족
- `INVALID_OPTIONS`: 필수 옵션 누락
- `MENU_NOT_FOUND`: 메뉴 없음
- `CAFE_NOT_FOUND`: 카페 없음

---

## 📁 생성/수정될 파일 목록

### 신규 생성
1. `backend/src/utils/orderUtils.ts` - 주문 관련 유틸리티 함수

### 수정
1. `backend/src/controllers/order.controller.ts` - createOrder, retryOrder 구현
2. `backend/prisma/schema.prisma` - Menu 모델에 stock 필드 추가 (선택적)

---

## 🔄 데이터베이스 마이그레이션

### Menu 모델 변경 (선택적)
```prisma
model Menu {
  // ... 기존 필드들
  stock Int? // 재고 (nullable, 선택적)
}
```

**마이그레이션 명령어**:
```bash
cd backend
npx prisma migrate dev --name add_menu_stock
```

---

## ✅ 승인 체크리스트

구현 전 확인 사항:
- [ ] 시나리오 검토 완료
- [ ] 구현 범위 이해 (최소 단위)
- [ ] 제외 사항 이해 (Phase 3로 연기)
- [ ] 스키마 변경 필요성 확인 (stock 필드)
- [ ] 예상 결과 수용 가능
- [ ] 주의사항 확인

---

## 🚀 다음 단계 (Phase 3)

Phase 2 완료 후:
1. 결제 처리 (Toss Payments 연동)
2. 복잡한 할인 로직
3. 고급 재고 관리
4. 주문 알림 시스템
5. 주문 예상 시간 계산
6. 동시성 제어 개선

---

## 📝 구현 순서

1. **Step 1**: 주문 번호 생성 유틸리티
2. **Step 2**: 가격 계산 로직
3. **Step 3**: 메뉴 및 옵션 검증
4. **Step 4**: 재고 확인 로직 (스키마 변경 포함)
5. **Step 5**: 주문 데이터 생성 (트랜잭션)
6. **Step 6**: 응답 데이터 구성
7. **Step 7**: 주문 재시도 기능

---

**작성일**: 2024-12-16  
**버전**: 1.0  
**상태**: 승인 대기

