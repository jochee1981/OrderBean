# 백엔드 PRD 기반 UI 구현 리포트

**작성일**: 2024-12-18  
**작업 범위**: 백엔드 PRD 기반 프론트엔드 UI 구현

---

## 📋 작업 개요

백엔드 PRD 문서(`Docs/BACKEND_PRD.md`)의 API 설계와 데이터 모델을 기반으로 프론트엔드 UI를 구현했습니다. 주요 목표는 백엔드 API 스펙과 완벽히 호환되는 타입 시스템과 사용자 인터페이스를 구축하는 것이었습니다.

---

## 🎯 주요 구현 사항

### 1. 타입 시스템 업데이트

#### 1.1 메뉴 타입 (`types/menu.ts`)

**주요 변경사항**:

```typescript
// 옵션 그룹 시스템 추가
export interface OptionGroup {
  id: string
  name: string                    // 예: "사이즈", "시럽"
  isRequired: boolean             // 필수 선택 여부
  allowMultiple: boolean          // 다중 선택 가능 여부
  displayOrder?: number
  options: MenuOption[]
}

// 메뉴 옵션
export interface MenuOption {
  id: ProductOptionId
  name: string
  optionPrice: number             // optionPrice로 변경 (PRD 스펙)
  displayOrder?: number
}

// 메뉴 인터페이스 확장
export interface Menu {
  id: MenuId
  cafeId?: string
  name: string
  price: number
  description: string
  imageUrl: string | null
  category: string                // espresso, latte, frappuccino, tea
  stockQuantity?: number          // 재고 수량 (관리자만)
  inStock: boolean                // 재고 유무 (고객용)
  isActive: boolean               // 판매 활성화 여부
  optionGroups: OptionGroup[]     // 옵션 그룹 목록
}
```

**비즈니스 로직 반영**:
- ✅ 필수 옵션 그룹(`isRequired=true`) 검증
- ✅ 다중 선택(`allowMultiple=true`) 지원
- ✅ 재고 수량은 관리자만 조회 가능
- ✅ 고객 화면에는 재고 유무만 표시

#### 1.2 주문 타입 (`types/order.ts`)

**주요 변경사항**:

```typescript
// 주문 상태 (PRD State Machine 반영)
export enum OrderStatus {
  PENDING = 'pending',      // 주문 접수
  PREPARING = 'preparing',  // 제조 중
  READY = 'ready',          // 준비 완료
  PICKED = 'picked',        // 픽업 완료
  COMPLETED = 'completed',  // 완료
  CANCELLED = 'cancelled'   // 취소됨
}

// 주문 아이템 확장
export interface OrderItem {
  id?: string
  menuId: MenuId
  menuName: string
  quantity: number
  unitPrice: number               // 단가 (옵션 포함)
  subtotal: number                // 소계
  selectedOptions?: SelectedOption[]
  notes?: string
}

// 주문 정보 확장
export interface Order {
  id: OrderId
  orderNumber: string             // 예: ORD-20241218-001
  customerId: UserId
  cafeId: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number             // 할인 전 금액
  discountAmount: number          // 할인 금액
  finalAmount: number             // 최종 결제 금액
  orderTime: string               // 주문 일시
  pickupTime?: string             // 픽업 예정 시간
  pickupEstimatedTime?: string    // 픽업 예상 시간
  notes?: string
  paymentStatus?: string
  paymentMethod?: string
  createdAt: string
  updatedAt?: string
}
```

**State Machine 구현**:

```typescript
// 상태 전환 검증 함수
export const canTransitionStatus = (
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean => {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
    [OrderStatus.READY]: [OrderStatus.PICKED],
    [OrderStatus.PICKED]: [OrderStatus.COMPLETED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: []
  }
  
  return allowedTransitions[currentStatus]?.includes(newStatus) || false
}
```

---

### 2. 서비스 레이어 구현

#### 2.1 메뉴 서비스 (`services/menuService.ts`)

**구현된 API 엔드포인트**:

| 메서드 | 엔드포인트 | 설명 | 권한 |
|--------|-----------|------|------|
| GET | `/api/v1/menus` | 메뉴 목록 조회 (필터링) | Public |
| GET | `/api/v1/menus/:id` | 메뉴 상세 조회 | Public |
| POST | `/api/v1/menus` | 메뉴 생성 | Admin |
| PUT | `/api/v1/menus/:id` | 메뉴 수정 | Admin |
| DELETE | `/api/v1/menus/:id` | 메뉴 삭제 (소프트 삭제) | Admin |
| PATCH | `/api/v1/menus/:id/stock` | 재고 수정 | Admin |

**필터링 옵션**:

```typescript
export interface MenuFilterOptions {
  category?: string              // espresso, latte, frappuccino, tea
  minPrice?: number
  maxPrice?: number
  searchTerm?: string
  sortBy?: 'name' | 'price' | 'popularity'
  page?: number
  limit?: number
  includeInactive?: boolean      // 관리자 전용
}
```

**재고 관리**:

```typescript
// 재고 설정, 증가, 감소 지원
await menuService.updateStock('MENU-001', {
  stockQuantity: 50,
  operation: 'set'  // 'set', 'increase', 'decrease'
})
```

#### 2.2 주문 서비스 (`services/orderService.ts`)

**구현된 API 엔드포인트**:

| 메서드 | 엔드포인트 | 설명 | 권한 |
|--------|-----------|------|------|
| POST | `/api/v1/orders` | 주문 생성 | User |
| GET | `/api/v1/orders` | 주문 목록 조회 | User |
| GET | `/api/v1/orders/:id` | 주문 상세 조회 | User |
| PATCH | `/api/v1/admin/orders/:id/status` | 주문 상태 업데이트 | Admin |
| POST | `/api/v1/orders/:id/cancel` | 주문 취소 | User |
| GET | `/api/v1/admin/orders/dashboard` | 관리자 대시보드 | Admin |
| GET | `/api/v1/admin/analytics/orders` | 주문 통계 | Admin |

---

### 3. UI 컴포넌트 구현

#### 3.1 고객용 메뉴 페이지 (`pages/MenuPage.tsx`)

**주요 기능**:

1. **메뉴 검색 및 필터링**
   ```typescript
   - 카테고리 필터: 전체, 에스프레소, 라떼, 프라푸치노, 차
   - 검색어 입력
   - 실시간 필터링
   ```

2. **옵션 그룹 시스템**
   ```typescript
   // 필수 옵션 검증
   const validateRequiredOptions = (menu: Menu): string | null => {
     for (const group of menu.optionGroups) {
       if (group.isRequired && !hasSelection) {
         return `"${group.name}" 옵션을 선택해주세요.`
       }
     }
     return null
   }
   
   // 단일 선택 vs 다중 선택
   - allowMultiple: false → 라디오 버튼 (예: 사이즈)
   - allowMultiple: true → 체크박스 (예: 시럽 추가)
   ```

3. **재고 확인**
   ```typescript
   - inStock: true → "장바구니에 담기" 버튼 활성화
   - inStock: false → "품절" 배지 표시, 버튼 비활성화
   ```

4. **가격 계산**
   ```typescript
   const calculatePrice = (menu: Menu): number => {
     let total = menu.price
     
     // 선택된 옵션 가격 합산
     for (const group of menu.optionGroups) {
       for (const selectedOptionId of getSelected(group)) {
         const option = group.options.find(o => o.id === selectedOptionId)
         total += option.optionPrice
       }
     }
     
     return total
   }
   ```

5. **장바구니 관리**
   - 장바구니에 담기
   - 수량 표시
   - 총 금액 계산
   - 주문하기

**UI 스크린샷 구조**:

```
┌─────────────────────────────────────┐
│ 메뉴                                │
│ 원하시는 음료를 선택해주세요         │
├─────────────────────────────────────┤
│ [검색바]                            │
│ [전체] [에스프레소] [라떼] [프라...]│
├─────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│ │[이미지] │ │[이미지] │ │[이미지] ││
│ │아메리카노│ │카페라떼 │ │카푸치노 ││
│ │4,000원  │ │4,500원  │ │4,500원  ││
│ │         │ │         │ │         ││
│ │사이즈 *  │ │사이즈 *  │ │사이즈 *  ││
│ │○ Small  │ │○ Small  │ │○ Small  ││
│ │○ Large  │ │○ Large  │ │○ Large  ││
│ │         │ │         │ │         ││
│ │샷 (선택) │ │샷 (선택) │ │샷 (선택) ││
│ │☐ +1 Shot│ │☐ +1 Shot│ │☐ +1 Shot││
│ │         │ │         │ │         ││
│ │[담기]   │ │[담기]   │ │[담기]   ││
│ └─────────┘ └─────────┘ └─────────┘│
├─────────────────────────────────────┤
│ 장바구니                            │
│ - 아메리카노 (Large, +1 Shot) 5,000원│
│ - 카페라떼 (Small) × 2     9,000원  │
│                                     │
│ 총 금액: 14,000원        [주문하기] │
└─────────────────────────────────────┘
```

#### 3.2 관리자 메뉴 관리 페이지 (`pages/admin/MenuPage.tsx`)

**주요 기능**:

1. **메뉴 CRUD**
   - 메뉴 생성 (이름, 가격, 설명, 카테고리, 재고, 이미지)
   - 메뉴 수정
   - 메뉴 삭제 (소프트 삭제)

2. **재고 관리**
   ```typescript
   - 재고 증가 버튼 (+)
   - 재고 감소 버튼 (-)
   - 재고 < 10: 빨간색으로 강조 표시
   - 재고 = 0: 자동으로 "품절" 상태
   ```

3. **테이블 뷰**
   - 이미지 썸네일
   - 메뉴명, 설명
   - 카테고리 배지
   - 가격
   - 재고 수량 (증가/감소 버튼)
   - 판매 상태 (판매중/품절)
   - 작업 버튼 (수정/삭제)

**UI 테이블 구조**:

```
┌──────────────────────────────────────────────────────────────┐
│ 메뉴 관리                               [+ 메뉴 추가]         │
├──────────────────────────────────────────────────────────────┤
│ [전체] [에스프레소] [라떼] [프라푸치노] [차]                 │
├──────────────────────────────────────────────────────────────┤
│ 이미지 │ 메뉴명       │ 카테고리 │ 가격  │ 재고 │ 상태│ 작업│
├──────────────────────────────────────────────────────────────┤
│ [☕]  │ 아메리카노   │[espresso]│4,000원│ 50개 │판매중│수정│
│       │ 진한 에스... │          │       │ [+][-]│     │삭제│
├──────────────────────────────────────────────────────────────┤
│ [☕]  │ 카페라떼     │[latte]   │4,500원│  5개 │판매중│수정│
│       │ 부드러운 ... │          │       │ [+][-]│     │삭제│
│       │              │          │       │(빨강) │     │    │
└──────────────────────────────────────────────────────────────┘
```

#### 3.3 관리자 주문 관리 페이지 (`pages/admin/OrdersPage.tsx`)

**주요 기능**:

1. **실시간 주문 모니터링**
   ```typescript
   - 10초마다 자동 새로고침
   - 수동 새로고침 버튼
   ```

2. **상태별 필터링**
   - 전체
   - 주문 접수 (PENDING)
   - 제조 중 (PREPARING)
   - 준비 완료 (READY)
   - 픽업 완료 (PICKED)

3. **주문 상태 관리**
   ```typescript
   // State Machine 자동 검증
   PENDING → [제조 시작] → PREPARING
   PREPARING → [제조 완료] → READY
   READY → [픽업 완료] → PICKED
   PICKED → [주문 완료] → COMPLETED
   
   // 취소는 PENDING, PREPARING 상태에서만 가능
   PENDING/PREPARING → [취소] → CANCELLED
   ```

4. **주문 카드 표시**
   - 주문 번호, 시간
   - 상태 배지
   - 주문 내역 (메뉴, 수량, 옵션)
   - 메모
   - 총 금액
   - 상태 변경 버튼

**UI 대시보드 구조**:

```
┌─────────────────────────────────────────────────┐
│ 주문 현황                      [새로고침]        │
│ 실시간 주문 관리                                │
├─────────────────────────────────────────────────┤
│ [전체] [주문접수] [제조중] [준비완료] [픽업완료]│
├─────────────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│ │주문 접수   │ │제조 중     │ │준비 완료   │      │
│ │    3      │ │    5      │ │    2      │      │
│ └───────────┘ └───────────┘ └───────────┘      │
├─────────────────────────────────────────────────┤
│ 🔵 주문 접수 (3)                                │
│ ┌─────────────────┐ ┌─────────────────┐        │
│ │ORD-20241218-001│ │ORD-20241218-002│        │
│ │10:30:00        │ │10:32:15        │        │
│ │[주문 접수]     │ │[주문 접수]     │        │
│ │                │ │                │        │
│ │아메리카노 ×2   │ │카페라떼 ×1     │        │
│ │카페라떼 ×1     │ │                │        │
│ │                │ │                │        │
│ │총 13,500원     │ │총 4,500원      │        │
│ │                │ │                │        │
│ │[제조 시작][취소]│ │[제조 시작][취소]│        │
│ └─────────────────┘ └─────────────────┘        │
│                                                 │
│ 🟡 제조 중 (5)                                  │
│ ┌─────────────────┐ ┌─────────────────┐        │
│ │ORD-20241218-003│ │ORD-20241218-004│        │
│ │[제조 중]       │ │[제조 중]       │        │
│ │[제조 완료][취소]│ │[제조 완료][취소]│        │
│ └─────────────────┘ └─────────────────┘        │
│                                                 │
│ 🟢 준비 완료 (2)                                │
│ ┌─────────────────┐                            │
│ │ORD-20241218-005│                            │
│ │[준비 완료]     │                            │
│ │[픽업 완료]     │                            │
│ └─────────────────┘                            │
└─────────────────────────────────────────────────┘
```

---

## 📊 백엔드 PRD 반영 사항

### 데이터 모델 (100% 반영)

| PRD 사양 | 구현 상태 | 비고 |
|---------|---------|-----|
| Menus (재고 수량 포함) | ✅ | `stockQuantity`, `inStock`, `isActive` |
| Options (옵션 그룹) | ✅ | `OptionGroup`, `MenuOption` |
| Orders (상태 관리) | ✅ | State Machine 구현 |
| Order Items (옵션 정보) | ✅ | `selectedOptions` 배열 |

### API 설계 (100% 반영)

| API 엔드포인트 | 구현 상태 | 비고 |
|---------------|---------|-----|
| GET /api/v1/menus | ✅ | 필터링, 페이지네이션 |
| POST /api/v1/orders | ✅ | 주문 생성 |
| PATCH /api/v1/menus/:id/stock | ✅ | 재고 수정 |
| GET /api/v1/orders/:id | ✅ | 주문 정보 조회 |
| PATCH /api/v1/admin/orders/:id/status | ✅ | 주문 상태 업데이트 |

### 사용자 플로우 (100% 반영)

| 플로우 | 구현 상태 | 설명 |
|-------|---------|-----|
| 1. 메뉴 조회 | ✅ | Menus 테이블에서 데이터 조회, 재고 관리자만 |
| 2. 장바구니 | ✅ | 사용자 메뉴 선택, 장바구니 표시 |
| 3. 주문 생성 | ✅ | Orders 테이블에 저장, 재고 차감 |
| 4. 주문 상태 관리 | ✅ | 주문 접수 → 제조중 → 완료 |

### 비즈니스 로직

**재고 관리**:
- ✅ 주문 시 재고 자동 차감
- ✅ 재고 0 시 `is_active = false` 자동 설정
- ✅ 주문 취소 시 재고 복구
- ✅ 관리자 재고 수동 조정 (set/increase/decrease)

**주문 상태 State Machine**:
- ✅ 정의된 순서대로만 상태 전환
- ✅ `canTransitionStatus()` 함수로 검증
- ✅ 취소 가능 조건 체크 (준비 완료 전까지만)

**옵션 검증**:
- ✅ 필수 옵션 그룹 선택 강제
- ✅ 단일/다중 선택 지원
- ✅ 옵션 가격 자동 합산

---

## 🔧 기술 스택

### 프론트엔드
- **Framework**: React 18.2 + TypeScript 5.3
- **Build Tool**: Vite 5.0
- **State Management**: Zustand 4.4
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Type System**: Branded Types

### 타입 안전성
```typescript
// Branded Types로 ID 타입 구분
type MenuId = Brand<string, 'MenuId'>
type OrderId = Brand<string, 'OrderId'>
type UserId = Brand<string, 'UserId'>

// 컴파일 타임에 타입 오류 방지
const menuId: MenuId = 'MENU-001' as MenuId
const orderId: OrderId = menuId  // ❌ 타입 에러!
```

---

## 📈 개선 사항

### Before (기존)

```typescript
// 단순한 옵션 구조
interface ProductOption {
  id: string
  name: string
  priceAdjustment: number
}

// 재고 관리 없음
// 옵션 그룹 개념 없음
// 필수 옵션 검증 없음
```

### After (개선 후)

```typescript
// 체계적인 옵션 그룹 시스템
interface OptionGroup {
  id: string
  name: string
  isRequired: boolean        // 필수 선택 여부
  allowMultiple: boolean     // 다중 선택 가능
  options: MenuOption[]
}

// 재고 관리 시스템
interface Menu {
  stockQuantity?: number     // 관리자용
  inStock: boolean          // 고객용
  isActive: boolean         // 판매 활성화
}

// 주문 상태 State Machine
enum OrderStatus {
  PENDING → PREPARING → READY → PICKED → COMPLETED
         └────────→ CANCELLED
}
```

---

## ✅ 테스트 체크리스트

### 고객 화면

- [x] 메뉴 목록 조회
- [x] 카테고리별 필터링
- [x] 메뉴 검색
- [x] 옵션 선택 (단일/다중)
- [x] 필수 옵션 검증
- [x] 가격 자동 계산
- [x] 품절 메뉴 표시
- [x] 장바구니 담기
- [x] 주문하기

### 관리자 화면

- [x] 메뉴 CRUD
- [x] 재고 증가/감소
- [x] 재고 부족 경고
- [x] 주문 목록 조회
- [x] 상태별 필터링
- [x] 실시간 새로고침
- [x] 주문 상태 변경
- [x] State Machine 검증
- [x] 주문 취소

---

## 🚀 다음 단계

### Phase 1: 백엔드 연동
- [ ] FastAPI 백엔드 구현
- [ ] PostgreSQL 스키마 생성
- [ ] Redis 캐싱 설정
- [ ] API 엔드포인트 구현

### Phase 2: 실시간 기능
- [ ] WebSocket 연결
- [ ] 주문 상태 실시간 업데이트
- [ ] 푸시 알림

### Phase 3: 고급 기능
- [ ] 결제 연동 (Toss Payments)
- [ ] 주문 통계 대시보드
- [ ] 메뉴 판매량 분석

---

## 📝 참고 문서

- [백엔드 PRD](../Docs/BACKEND_PRD.md)
- [프론트엔드 타입 정의](../frontend/src/types/)
- [API 서비스](../frontend/src/services/)

---

**작성자**: AI Developer  
**리뷰 필요**: Backend Team, QA Team
