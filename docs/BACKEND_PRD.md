# 백엔드 개발 PRD (Product Requirements Document)
**OrderBean Backend Development Guide**

## 문서 정보
- **작성일**: 2024-12-18
- **버전**: 1.0
- **상태**: Draft
- **담당자**: Backend Development Team

---

## 📋 목차

1. [개요](#1-개요)
2. [데이터 모델 설계](#2-데이터-모델-설계)
3. [데이터베이스 스키마](#3-데이터베이스-스키마)
4. [사용자 플로우](#4-사용자-플로우)
5. [API 설계](#5-api-설계)
6. [비즈니스 로직](#6-비즈니스-로직)
7. [보안 및 인증](#7-보안-및-인증)
8. [성능 최적화](#8-성능-최적화)
9. [에러 처리](#9-에러-처리)
10. [개발 가이드](#10-개발-가이드)

---

## 1. 개요

### 1.1 목적
OrderBean 백엔드 시스템은 커피 주문 관리를 위한 RESTful API를 제공하며, 메뉴 관리, 주문 처리, 재고 관리, 주문 상태 추적 등의 핵심 기능을 담당합니다.

### 1.2 기술 스택
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0 (Async)
- **Cache**: Redis
- **Authentication**: FastAPI Users + OAuth2 + JWT
- **Task Queue**: Celery
- **Deployment**: Render

### 1.3 핵심 기능
1. ✅ **메뉴 관리**: 커피 메뉴 CRUD, 옵션 관리, 재고 관리
2. ✅ **주문 처리**: 주문 생성, 장바구니, 결제, 재고 차감
3. ✅ **주문 상태 관리**: 실시간 상태 업데이트, 알림
4. ✅ **관리자 기능**: 대시보드, 통계, 분석
5. ✅ **사용자 인증**: 회원가입, 로그인, 권한 관리

---

## 2. 데이터 모델 설계

### 2.1 핵심 엔티티

#### 2.1.1 Menus (메뉴)
커피 메뉴의 기본 정보를 저장합니다.

**주요 속성**:
- `id` (UUID): 메뉴 고유 식별자
- `name` (String): 메뉴 이름 (예: "아메리카노")
- `description` (Text): 메뉴 설명
- `price` (Integer): 기본 가격 (원 단위)
- `image_url` (String): 메뉴 이미지 URL
- `category` (String): 카테고리 (espresso, latte, frappuccino, tea)
- `stock_quantity` (Integer): **재고 수량** (관리자만 조회)
- `is_active` (Boolean): 판매 활성화 여부
- `cafe_id` (UUID): 카페 ID (외래키)
- `created_at`, `updated_at`, `deleted_at`: 시간 정보

**비즈니스 규칙**:
- 재고가 0이 되면 자동으로 `is_active = false` 처리
- 관리자는 재고를 수동으로 조정 가능
- 고객 화면에는 `stock_quantity`를 노출하지 않음 (재고 유무만 표시)

#### 2.1.2 Options (옵션)
메뉴에 추가할 수 있는 커스터마이징 옵션을 저장합니다.

**주요 속성**:
- `id` (UUID): 옵션 고유 식별자
- `name` (String): 옵션 이름 (예: "바닐라 시럽")
- `option_price` (Integer): 옵션 추가 가격 (예: +500원)
- `option_group_id` (UUID): 옵션 그룹 ID (외래키)
- `display_order` (Integer): 표시 순서

**옵션 그룹 (Option Groups)**:
- `id` (UUID): 그룹 고유 식별자
- `menu_id` (UUID): 연결된 메뉴 ID
- `name` (String): 그룹 이름 (예: "시럽", "사이즈", "우유")
- `is_required` (Boolean): 필수 선택 여부
- `allow_multiple` (Boolean): 다중 선택 가능 여부

**비즈니스 규칙**:
- 필수 옵션 그룹(`is_required=true`)의 경우 반드시 하나 이상 선택
- `allow_multiple=true`인 경우 여러 옵션 동시 선택 가능
- 옵션 가격은 메뉴 기본 가격에 합산

#### 2.1.3 Orders (주문)
고객의 주문 정보를 저장합니다.

**주요 속성**:
- `id` (UUID): 주문 고유 식별자
- `order_number` (String): 주문 번호 (예: "ORD-20241218-001")
- `customer_id` (UUID): 주문 고객 ID (외래키)
- `cafe_id` (UUID): 주문 카페 ID (외래키)
- `status` (Enum): 주문 상태
  - `pending`: 주문 접수 (기본값)
  - `preparing`: 제조 중
  - `ready`: 준비 완료
  - `picked`: 픽업 완료
  - `completed`: 완료
  - `cancelled`: 취소됨
- `total_amount` (Integer): 총 금액 (할인 전)
- `discount_amount` (Integer): 할인 금액
- `final_amount` (Integer): 최종 결제 금액
- `order_time` (Timestamp): 주문 일시
- `pickup_time` (Timestamp): 픽업 예정 시간
- `notes` (Text): 주문 메모
- `created_at`, `updated_at`: 시간 정보

**주문 아이템 (Order Items)**:
- `id` (UUID): 아이템 고유 식별자
- `order_id` (UUID): 주문 ID (외래키)
- `menu_id` (UUID): 메뉴 ID (외래키)
- `quantity` (Integer): 수량
- `unit_price` (Integer): 단가 (옵션 포함)
- `subtotal` (Integer): 소계 (unit_price × quantity)
- `selected_options` (JSON): 선택된 옵션 목록

**비즈니스 규칙**:
- 주문 생성 시 재고가 충분한지 확인
- 재고 부족 시 주문 실패 (400 에러 반환)
- 주문 완료 시 재고 자동 차감
- 주문 취소 시 재고 복구
- 주문 상태는 정의된 순서대로만 변경 가능 (State Machine)

---

## 3. 데이터베이스 스키마

### 3.1 ERD (Entity-Relationship Diagram)

```
┌─────────────────┐         ┌──────────────┐
│    users        │────1:N──│   orders     │
├─────────────────┤         ├──────────────┤
│*id (UUID)       │         │*id (UUID)    │
│*email           │         │*customer_id  │
│*password        │         │*cafe_id      │
│ name            │         │*status       │
│ role            │         │*total_amount │
│ created_at      │         │ order_time   │
└─────────────────┘         │ pickup_time  │
                            └──────┬───────┘
                                   │1:N
                            ┌──────▼──────┐
                            │order_items  │
                            ├─────────────┤
                            │*id          │
                            │*order_id    │
                            │*menu_id     │
                            │ quantity    │
                            │ unit_price  │
                            │ subtotal    │
                            └──────┬──────┘
                                   │N:1
┌─────────────┐         ┌──────────▼──────┐
│   cafes     │────1:N──│    menus        │
├─────────────┤         ├─────────────────┤
│*id (UUID)   │         │*id (UUID)       │
│*name        │         │*cafe_id         │
│ address     │         │*name            │
│ phone       │         │*price           │
│ is_active   │         │*stock_quantity  │
└─────────────┘         │ image_url       │
                        │ category        │
                        │ is_active       │
                        └──────┬──────────┘
                               │1:N
                        ┌──────▼──────────┐
                        │option_groups    │
                        ├─────────────────┤
                        │*id              │
                        │*menu_id         │
                        │ name            │
                        │ is_required     │
                        │ allow_multiple  │
                        └──────┬──────────┘
                               │1:N
                        ┌──────▼──────────┐
                        │menu_options     │
                        ├─────────────────┤
                        │*id              │
                        │*option_group_id │
                        │ name            │
                        │ option_price    │
                        └─────────────────┘
```

### 3.2 테이블 정의

#### 3.2.1 menus (메뉴 테이블)

```sql
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  image_url VARCHAR(500),
  category VARCHAR(50) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  INDEX idx_cafe_id (cafe_id),
  INDEX idx_is_active (is_active),
  INDEX idx_category (category),
  INDEX idx_stock_quantity (stock_quantity)
);
```

**인덱스 설명**:
- `idx_cafe_id`: 카페별 메뉴 조회 성능 향상
- `idx_is_active`: 활성화된 메뉴만 필터링 시 성능 향상
- `idx_category`: 카테고리별 검색 성능 향상
- `idx_stock_quantity`: 재고 관련 쿼리 성능 향상

#### 3.2.2 option_groups (옵션 그룹 테이블)

```sql
CREATE TABLE option_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_required BOOLEAN DEFAULT false,
  allow_multiple BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_menu_id (menu_id)
);
```

#### 3.2.3 menu_options (메뉴 옵션 테이블)

```sql
CREATE TABLE menu_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_group_id UUID REFERENCES option_groups(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  option_price INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_option_group_id (option_group_id)
);
```

#### 3.2.4 orders (주문 테이블)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id),
  cafe_id UUID REFERENCES cafes(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  discount_amount INTEGER DEFAULT 0,
  final_amount INTEGER NOT NULL CHECK (final_amount >= 0),
  order_time TIMESTAMP NOT NULL DEFAULT NOW(),
  pickup_time TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_customer_id (customer_id),
  INDEX idx_cafe_id (cafe_id),
  INDEX idx_status (status),
  INDEX idx_order_time (order_time DESC),
  CONSTRAINT chk_status CHECK (
    status IN ('pending', 'preparing', 'ready', 'picked', 'completed', 'cancelled')
  )
);
```

#### 3.2.5 order_items (주문 아이템 테이블)

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_id UUID REFERENCES menus(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  selected_options JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_order_id (order_id),
  INDEX idx_menu_id (menu_id)
);
```

---

## 4. 사용자 플로우

### 4.1 고객 메뉴 조회 플로우

```
[고객] 
  ↓
1. 메뉴 페이지 접속
  ↓
2. GET /api/v1/menus 호출
  ↓
3. 백엔드: Menus 테이블에서 데이터 조회
   - is_active = true인 메뉴만 조회
   - stock_quantity > 0인 메뉴만 조회 (또는 품절 표시)
   - 재고 수량은 고객에게 노출하지 않음
  ↓
4. 응답: 메뉴 목록 반환 (이미지, 이름, 가격, 설명)
  ↓
5. 브라우저 화면에 메뉴 표시
```

**관리자 화면 추가 정보**:
- 관리자는 `stock_quantity` 필드도 함께 조회
- 재고 수량이 낮은 메뉴는 별도 표시 (예: 재고 < 10개)

### 4.2 장바구니 및 주문 생성 플로우

```
[고객]
  ↓
1. 메뉴 선택 (예: "아메리카노")
  ↓
2. 옵션 선택 (예: "사이즈: Large", "샷 추가")
   - 프론트엔드에서 실시간 가격 계산
   - 기본 가격 + 옵션 가격 합산
  ↓
3. "장바구니에 담기" 클릭
   - 프론트엔드 장바구니 상태에 추가
   - 서버 호출 없음 (클라이언트 상태 관리)
  ↓
4. 추가 메뉴 선택 (반복)
  ↓
5. "주문하기" 버튼 클릭
  ↓
6. POST /api/v1/orders 호출
   {
     "items": [
       {
         "menuId": "MENU-001",
         "quantity": 2,
         "selectedOptions": [...]
       }
     ]
   }
  ↓
7. 백엔드 처리:
   a) 트랜잭션 시작
   b) 재고 확인 (FOR UPDATE 락)
      - menus.stock_quantity >= 주문 수량
   c) 재고 부족 시: 에러 반환 (400)
   d) 가격 계산 및 검증
   e) Orders 테이블에 INSERT
   f) Order_Items 테이블에 INSERT
   g) Menus.stock_quantity 차감 (UPDATE)
   h) 트랜잭션 커밋
  ↓
8. 응답: 주문 정보 반환 (주문 번호, 상태, 금액)
  ↓
9. 장바구니 초기화
```

**재고 처리 규칙**:
- 주문 수량만큼 `stock_quantity` 차감
- 재고가 0이 되면 `is_active = false` 자동 설정
- 주문 취소 시 재고 복구 (`stock_quantity` 증가)

### 4.3 주문 상태 관리 플로우 (관리자)

```
[관리자 화면]
  ↓
1. 관리자 대시보드 접속
  ↓
2. GET /api/v1/admin/orders 호출
   - status = 'pending' 인 주문 조회
  ↓
3. 주문 목록 표시
   - 주문 시간, 메뉴, 수량, 옵션, 금액
   - 기본 상태: "주문 접수" (pending)
  ↓
4. "주문 접수" 버튼 클릭
  ↓
5. PATCH /api/v1/admin/orders/{orderId}/status
   { "status": "preparing" }
  ↓
6. 백엔드: Orders.status 업데이트
  ↓
7. 고객 화면에 실시간 반영 (WebSocket 또는 Polling)
  ↓
8. "제조 중" → "완료" 상태 변경 (반복)
   - preparing → ready → picked → completed
```

**주문 상태 State Machine**:

```
        ┌────────────────────────────────┐
        ▼                                │
   [PENDING] ─► [PREPARING] ─► [READY] ─┴─► [PICKED] ─► [COMPLETED]
        │
        ├─────────► [CANCELLED]
        │            (취소 가능 조건)
        └────────────────────────────────┘
```

**상태 전환 규칙**:
- `pending` → `preparing`: 관리자가 주문 확인 시
- `preparing` → `ready`: 제조 완료 시
- `ready` → `picked`: 고객 픽업 완료 시
- `picked` → `completed`: 자동 완료 (1시간 후)
- `pending/preparing` → `cancelled`: 취소 가능 (준비 완료 전까지만)

### 4.4 주문 정보 조회 플로우

```
[고객 또는 관리자]
  ↓
1. GET /api/v1/orders/{orderId} 호출
  ↓
2. 백엔드 처리:
   - Orders 테이블에서 주문 조회
   - Order_Items 조인하여 주문 내용 조회
   - 메뉴 정보, 옵션 정보 포함
  ↓
3. 응답: 주문 상세 정보 반환
   {
     "orderId": "...",
     "orderNumber": "ORD-20241218-001",
     "status": "preparing",
     "items": [
       {
         "menuName": "아메리카노",
         "quantity": 2,
         "options": ["Large", "+1 Shot"],
         "subtotal": 8000
       }
     ],
     "totalAmount": 8000,
     "orderTime": "2024-12-18T10:30:00Z",
     "pickupTime": "2024-12-18T10:45:00Z"
   }
  ↓
4. 화면에 주문 정보 표시
```

---

## 5. API 설계

### 5.1 기본 정보

- **Base URL**: `https://api.orderbean.com/v1`
- **인증 방식**: Bearer Token (JWT)
- **응답 형식**: JSON
- **Rate Limit**: 100 req/min (일반), 1000 req/min (관리자)

### 5.2 공통 응답 포맷

#### 성공 응답

```json
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "timestamp": "2024-12-18T10:30:00Z"
}
```

#### 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "재고가 부족합니다",
    "details": {
      "menuId": "MENU-001",
      "requested": 5,
      "available": 2
    }
  },
  "timestamp": "2024-12-18T10:30:00Z"
}
```

### 5.3 메뉴 관리 API

#### 5.3.1 메뉴 목록 조회

**요청**:
```http
GET /api/v1/menus?category=espresso&minPrice=0&maxPrice=10000&page=1&limit=20
Authorization: Bearer {token} (선택)
```

**쿼리 파라미터**:
- `category` (선택): 카테고리 필터 (espresso, latte, frappuccino, tea)
- `minPrice` (선택): 최소 가격 (기본값: 0)
- `maxPrice` (선택): 최대 가격 (기본값: 100000)
- `page` (선택): 페이지 번호 (기본값: 1)
- `limit` (선택): 페이지 크기 (기본값: 20, 최대: 100)
- `includeInactive` (선택): 비활성 메뉴 포함 여부 (관리자만, 기본값: false)

**응답**:
```json
{
  "success": true,
  "data": {
    "menus": [
      {
        "id": "MENU-001",
        "name": "아메리카노",
        "description": "진한 에스프레소와 뜨거운 물",
        "price": 3500,
        "imageUrl": "https://cdn.orderbean.com/menus/americano.jpg",
        "category": "espresso",
        "isActive": true,
        "inStock": true,
        "stockQuantity": 50,  // 관리자만
        "optionGroups": [
          {
            "id": "OG-001",
            "name": "사이즈",
            "isRequired": true,
            "allowMultiple": false,
            "options": [
              {
                "id": "OPT-001",
                "name": "Small",
                "optionPrice": 0
              },
              {
                "id": "OPT-002",
                "name": "Large",
                "optionPrice": 500
              }
            ]
          },
          {
            "id": "OG-002",
            "name": "샷",
            "isRequired": false,
            "allowMultiple": true,
            "options": [
              {
                "id": "OPT-003",
                "name": "+1 Shot",
                "optionPrice": 500
              }
            ]
          }
        ]
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

**비즈니스 로직**:
1. 입력 검증 (가격 범위, 페이지 번호 등)
2. Redis 캐시 확인 (캐시 키: `menus:cafe:{cafeId}:page:{page}:limit:{limit}`)
3. 캐시 미스 시 DB 조회:
   - `is_active = true` 필터링
   - `stock_quantity > 0` 또는 품절 표시
   - `category`, `price` 필터 적용
4. 옵션 그룹 및 옵션 조회 (조인)
5. 관리자 요청 시 `stock_quantity` 포함
6. Redis에 1시간 캐싱
7. 응답 반환

#### 5.3.2 메뉴 상세 조회

**요청**:
```http
GET /api/v1/menus/{menuId}
Authorization: Bearer {token} (선택)
```

**응답**: 메뉴 목록 조회와 동일한 형식의 단일 메뉴 객체

#### 5.3.3 메뉴 생성 (관리자)

**요청**:
```http
POST /api/v1/menus
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "cafeId": "CAFE-001",
  "name": "카페라떼",
  "description": "부드러운 우유와 에스프레소",
  "price": 4500,
  "category": "latte",
  "stockQuantity": 100,
  "imageUrl": "https://cdn.orderbean.com/menus/latte.jpg"
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "id": "MENU-002",
    "name": "카페라떼",
    "price": 4500,
    "stockQuantity": 100,
    "isActive": true,
    "createdAt": "2024-12-18T10:30:00Z"
  },
  "message": "메뉴가 생성되었습니다"
}
```

**비즈니스 로직**:
1. 관리자 권한 확인
2. 입력 검증 (필수 필드, 가격 범위, 재고 수량)
3. 메뉴 이름 중복 확인
4. 이미지 URL 유효성 검증
5. `menus` 테이블에 INSERT
6. 메뉴 캐시 무효화 (Redis DELETE)
7. 감사 로그 기록
8. 응답 반환

#### 5.3.4 메뉴 수정 (관리자)

**요청**:
```http
PUT /api/v1/menus/{menuId}
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "name": "아메리카노",
  "price": 3800,
  "stockQuantity": 75,
  "isActive": true
}
```

**응답**: 업데이트된 메뉴 정보

**비즈니스 로직**:
1. 관리자 권한 확인
2. 메뉴 존재 여부 확인
3. 변경 내용 검증
4. `menus` 테이블 UPDATE
5. 재고가 0이 되면 `is_active = false` 자동 설정
6. 메뉴 캐시 무효화
7. 감사 로그 기록
8. 응답 반환

#### 5.3.5 메뉴 삭제 (관리자)

**요청**:
```http
DELETE /api/v1/menus/{menuId}
Authorization: Bearer {adminToken}
```

**응답**:
```json
{
  "success": true,
  "message": "메뉴가 삭제되었습니다"
}
```

**비즈니스 로직**:
1. 관리자 권한 확인
2. 메뉴 존재 여부 확인
3. 소프트 삭제 (`deleted_at = NOW()`)
4. `is_active = false` 설정
5. 메뉴 캐시 무효화
6. 감사 로그 기록
7. 응답 반환

#### 5.3.6 재고 수정 (관리자)

**요청**:
```http
PATCH /api/v1/menus/{menuId}/stock
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "stockQuantity": 50,
  "operation": "set"  // "set", "increase", "decrease"
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "menuId": "MENU-001",
    "previousStock": 30,
    "currentStock": 50,
    "updatedAt": "2024-12-18T10:30:00Z"
  },
  "message": "재고가 업데이트되었습니다"
}
```

**비즈니스 로직**:
1. 관리자 권한 확인
2. 메뉴 존재 여부 확인
3. 재고 수량 검증 (0 이상)
4. 재고 업데이트:
   - `set`: 재고를 지정된 값으로 설정
   - `increase`: 재고 증가
   - `decrease`: 재고 감소 (최소 0)
5. 재고가 0보다 크면 `is_active = true` 자동 설정
6. 메뉴 캐시 무효화
7. 감사 로그 기록
8. 응답 반환

### 5.4 주문 관리 API

#### 5.4.1 주문 생성

**요청**:
```http
POST /api/v1/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "cafeId": "CAFE-001",
  "items": [
    {
      "menuId": "MENU-001",
      "quantity": 2,
      "selectedOptions": [
        {
          "optionGroupId": "OG-001",
          "selectedOptionId": "OPT-002"
        },
        {
          "optionGroupId": "OG-002",
          "selectedOptionIds": ["OPT-003"]
        }
      ],
      "notes": "뜨겁게 부탁합니다"
    }
  ],
  "pickupTime": "2024-12-18T11:00:00Z",
  "notes": "빠른 제조 부탁드립니다"
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-001",
    "orderNumber": "ORD-20241218-001",
    "customerId": "CUST-001",
    "cafeId": "CAFE-001",
    "status": "pending",
    "items": [
      {
        "menuId": "MENU-001",
        "menuName": "아메리카노",
        "quantity": 2,
        "unitPrice": 4500,
        "selectedOptions": [
          {
            "groupName": "사이즈",
            "optionName": "Large",
            "optionPrice": 500
          },
          {
            "groupName": "샷",
            "optionName": "+1 Shot",
            "optionPrice": 500
          }
        ],
        "subtotal": 9000
      }
    ],
    "totalAmount": 9000,
    "discountAmount": 0,
    "finalAmount": 9000,
    "orderTime": "2024-12-18T10:30:00Z",
    "pickupTime": "2024-12-18T11:00:00Z"
  },
  "message": "주문이 생성되었습니다"
}
```

**비즈니스 로직 (트랜잭션)**:
```python
async def create_order(order_data: OrderCreate):
    async with db.transaction():
        # 1. 사용자 인증 확인
        user = await get_current_user()
        
        # 2. 입력 검증
        validate_order_items(order_data.items)
        validate_pickup_time(order_data.pickup_time)
        
        # 3. 재고 확인 및 락 획득 (FOR UPDATE)
        for item in order_data.items:
            menu = await db.execute(
                select(Menu)
                .where(Menu.id == item.menu_id)
                .with_for_update()
            )
            
            if menu.stock_quantity < item.quantity:
                raise OutOfStockError(
                    menu_id=item.menu_id,
                    requested=item.quantity,
                    available=menu.stock_quantity
                )
        
        # 4. 가격 계산 및 검증
        total_amount = 0
        for item in order_data.items:
            menu = await get_menu(item.menu_id)
            unit_price = menu.price
            
            # 옵션 가격 합산
            for selected_option in item.selected_options:
                option = await get_option(selected_option.option_id)
                unit_price += option.option_price
            
            item.unit_price = unit_price
            item.subtotal = unit_price * item.quantity
            total_amount += item.subtotal
        
        # 5. 주문 생성
        order = Order(
            order_number=generate_order_number(),
            customer_id=user.id,
            cafe_id=order_data.cafe_id,
            status="pending",
            total_amount=total_amount,
            final_amount=total_amount,
            order_time=datetime.now(),
            pickup_time=order_data.pickup_time
        )
        db.add(order)
        await db.flush()
        
        # 6. 주문 아이템 생성
        for item in order_data.items:
            order_item = OrderItem(
                order_id=order.id,
                menu_id=item.menu_id,
                quantity=item.quantity,
                unit_price=item.unit_price,
                subtotal=item.subtotal,
                selected_options=item.selected_options,
                notes=item.notes
            )
            db.add(order_item)
        
        # 7. 재고 차감
        for item in order_data.items:
            await db.execute(
                update(Menu)
                .where(Menu.id == item.menu_id)
                .values(
                    stock_quantity=Menu.stock_quantity - item.quantity,
                    is_active=case(
                        (Menu.stock_quantity - item.quantity <= 0, False),
                        else_=Menu.is_active
                    )
                )
            )
        
        # 8. 트랜잭션 커밋
        await db.commit()
        
        # 9. 실시간 알림 (비동기)
        await notify_cafe_new_order(order.id)
        
        # 10. 응답 반환
        return order
```

**에러 처리**:
- `400 OUT_OF_STOCK`: 재고 부족
- `400 INVALID_OPTIONS`: 필수 옵션 미선택
- `400 INVALID_PICKUP_TIME`: 픽업 시간이 과거
- `500 ORDER_CREATION_ERROR`: 주문 생성 실패

#### 5.4.2 주문 목록 조회

**요청**:
```http
GET /api/v1/orders?status=pending&page=1&limit=20&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {token}
```

**쿼리 파라미터**:
- `status` (선택): 주문 상태 필터 (pending, preparing, ready, completed, cancelled)
- `page` (선택): 페이지 번호 (기본값: 1)
- `limit` (선택): 페이지 크기 (기본값: 20)
- `startDate` (선택): 시작 날짜
- `endDate` (선택): 종료 날짜

**응답**:
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-001",
        "orderNumber": "ORD-20241218-001",
        "status": "pending",
        "totalAmount": 9000,
        "finalAmount": 9000,
        "orderTime": "2024-12-18T10:30:00Z",
        "pickupTime": "2024-12-18T11:00:00Z",
        "itemCount": 2,
        "cafeId": "CAFE-001",
        "cafeName": "강남역 카페"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "totalPages": 2
    }
  }
}
```

#### 5.4.3 주문 상세 조회

**요청**:
```http
GET /api/v1/orders/{orderId}
Authorization: Bearer {token}
```

**응답**: 주문 생성 응답과 동일한 형식

**비즈니스 로직**:
1. 사용자 인증 확인
2. 주문 소유자 확인 (본인 또는 관리자만 조회)
3. `orders` 테이블에서 주문 조회
4. `order_items` 조인하여 주문 내용 조회
5. 메뉴 정보, 옵션 정보 포함
6. 응답 반환

#### 5.4.4 주문 상태 업데이트 (관리자)

**요청**:
```http
PATCH /api/v1/admin/orders/{orderId}/status
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "status": "preparing"
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-001",
    "previousStatus": "pending",
    "currentStatus": "preparing",
    "updatedAt": "2024-12-18T10:35:00Z"
  },
  "message": "주문 상태가 업데이트되었습니다"
}
```

**비즈니스 로직**:
1. 관리자 권한 확인
2. 주문 존재 여부 확인
3. 상태 전환 유효성 검사 (State Machine)
   - `pending` → `preparing` ✅
   - `preparing` → `ready` ✅
   - `ready` → `picked` ✅
   - `picked` → `completed` ✅
   - `pending/preparing` → `cancelled` ✅
   - `ready` → `cancelled` ❌ (불가)
4. `orders.status` UPDATE
5. 취소 시 재고 복구 (`stock_quantity` 증가)
6. 고객에게 푸시 알림 발송 (비동기)
7. WebSocket으로 실시간 업데이트
8. 감사 로그 기록
9. 응답 반환

**State Machine 검증**:
```python
ALLOWED_TRANSITIONS = {
    "pending": ["preparing", "cancelled"],
    "preparing": ["ready", "cancelled"],
    "ready": ["picked"],
    "picked": ["completed"],
    "completed": [],
    "cancelled": []
}

def is_valid_transition(current_status: str, new_status: str) -> bool:
    return new_status in ALLOWED_TRANSITIONS.get(current_status, [])
```

#### 5.4.5 주문 취소

**요청**:
```http
POST /api/v1/orders/{orderId}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "주문 실수"
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-001",
    "status": "cancelled",
    "refundAmount": 9000,
    "cancelledAt": "2024-12-18T10:35:00Z"
  },
  "message": "주문이 취소되었습니다"
}
```

**비즈니스 로직**:
1. 사용자 인증 확인
2. 주문 소유자 확인
3. 취소 가능 상태 확인 (`pending` 또는 `preparing`)
4. 트랜잭션 시작
5. 주문 상태를 `cancelled`로 업데이트
6. 재고 복구 (`stock_quantity` 증가)
7. 환불 처리 (결제 게이트웨이 호출)
8. 트랜잭션 커밋
9. 관리자에게 알림 발송
10. 응답 반환

### 5.5 관리자 통계 API

#### 5.5.1 주문 대시보드

**요청**:
```http
GET /api/v1/admin/orders/dashboard?cafeId=CAFE-001
Authorization: Bearer {adminToken}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "pendingOrders": 3,
      "preparingOrders": 5,
      "readyOrders": 2,
      "todayOrders": 45,
      "todayRevenue": 247500
    },
    "recentOrders": [
      {
        "id": "ORD-001",
        "orderNumber": "ORD-20241218-001",
        "status": "pending",
        "items": ["아메리카노 x2", "카페라떼 x1"],
        "totalAmount": 9000,
        "orderTime": "2024-12-18T10:30:00Z"
      }
    ]
  }
}
```

#### 5.5.2 주문 통계

**요청**:
```http
GET /api/v1/admin/analytics/orders?startDate=2024-12-01&endDate=2024-12-31&cafeId=CAFE-001
Authorization: Bearer {adminToken}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-12-01",
      "endDate": "2024-12-31"
    },
    "overview": {
      "totalOrders": 450,
      "totalRevenue": 2475000,
      "averageOrderValue": 5500,
      "completionRate": 95.5,
      "cancellationRate": 2.2
    },
    "topMenus": [
      {
        "menuId": "MENU-001",
        "menuName": "아메리카노",
        "orderCount": 150,
        "revenue": 525000
      },
      {
        "menuId": "MENU-002",
        "menuName": "카페라떼",
        "orderCount": 120,
        "revenue": 540000
      }
    ],
    "hourlyDistribution": [
      { "hour": 8, "orderCount": 25 },
      { "hour": 9, "orderCount": 45 },
      { "hour": 10, "orderCount": 60 }
    ]
  }
}
```

---

## 6. 비즈니스 로직

### 6.1 재고 관리

#### 6.1.1 재고 차감 로직

```python
async def deduct_stock(menu_id: UUID, quantity: int):
    """
    주문 생성 시 재고 차감
    """
    async with db.transaction():
        # 1. 메뉴 조회 및 락 획득
        menu = await db.execute(
            select(Menu)
            .where(Menu.id == menu_id)
            .with_for_update()
        )
        
        # 2. 재고 확인
        if menu.stock_quantity < quantity:
            raise OutOfStockError(
                menu_id=menu_id,
                requested=quantity,
                available=menu.stock_quantity
            )
        
        # 3. 재고 차감
        menu.stock_quantity -= quantity
        
        # 4. 재고가 0이 되면 비활성화
        if menu.stock_quantity == 0:
            menu.is_active = False
        
        # 5. 저장
        await db.commit()
        
        # 6. 캐시 무효화
        await redis.delete(f"menu:{menu_id}")
        
        return menu
```

#### 6.1.2 재고 복구 로직

```python
async def restore_stock(order_id: UUID):
    """
    주문 취소 시 재고 복구
    """
    async with db.transaction():
        # 1. 주문 아이템 조회
        order_items = await db.execute(
            select(OrderItem)
            .where(OrderItem.order_id == order_id)
        )
        
        # 2. 각 메뉴의 재고 복구
        for item in order_items:
            menu = await db.execute(
                select(Menu)
                .where(Menu.id == item.menu_id)
                .with_for_update()
            )
            
            menu.stock_quantity += item.quantity
            
            # 3. 재고가 복구되면 활성화
            if menu.stock_quantity > 0:
                menu.is_active = True
        
        # 4. 저장
        await db.commit()
        
        # 5. 캐시 무효화
        for item in order_items:
            await redis.delete(f"menu:{item.menu_id}")
```

### 6.2 가격 계산

```python
def calculate_order_total(items: List[OrderItemCreate]) -> int:
    """
    주문 총 금액 계산
    """
    total_amount = 0
    
    for item in items:
        # 1. 메뉴 기본 가격
        menu = get_menu(item.menu_id)
        unit_price = menu.price
        
        # 2. 선택된 옵션 가격 합산
        for selected_option in item.selected_options:
            option_group = get_option_group(selected_option.option_group_id)
            
            # 필수 옵션 확인
            if option_group.is_required and not selected_option.selected_option_id:
                raise MissingRequiredOptionError(
                    option_group_id=option_group.id,
                    option_group_name=option_group.name
                )
            
            # 옵션 가격 추가
            option = get_option(selected_option.selected_option_id)
            unit_price += option.option_price
        
        # 3. 수량 곱하기
        subtotal = unit_price * item.quantity
        total_amount += subtotal
    
    return total_amount
```

### 6.3 주문 번호 생성

```python
def generate_order_number() -> str:
    """
    주문 번호 생성: ORD-YYYYMMDD-NNN
    예: ORD-20241218-001
    """
    today = datetime.now().strftime("%Y%m%d")
    
    # 오늘 날짜의 주문 수 조회
    count = db.query(Order).filter(
        func.date(Order.order_time) == date.today()
    ).count()
    
    sequence = f"{count + 1:03d}"
    return f"ORD-{today}-{sequence}"
```

---

## 7. 보안 및 인증

### 7.1 인증 방식

**JWT (JSON Web Token) 기반 인증**:

```python
# 토큰 생성
def create_access_token(user_id: UUID, role: str) -> str:
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# 토큰 검증
def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise UnauthorizedError("토큰이 만료되었습니다")
    except jwt.InvalidTokenError:
        raise UnauthorizedError("유효하지 않은 토큰입니다")
```

### 7.2 권한 관리

**Role-Based Access Control (RBAC)**:

```python
# 권한 체크 데코레이터
def require_role(required_role: str):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            user = get_current_user()
            if user.role != required_role:
                raise ForbiddenError("권한이 없습니다")
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# 사용 예시
@app.post("/api/v1/menus")
@require_role("admin")
async def create_menu(menu: MenuCreate):
    ...
```

### 7.3 API Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# 일반 사용자: 100 req/min
@app.get("/api/v1/menus")
@limiter.limit("100/minute")
async def get_menus():
    ...

# 관리자: 1000 req/min
@app.get("/api/v1/admin/orders")
@limiter.limit("1000/minute")
async def get_admin_orders():
    ...
```

---

## 8. 성능 최적화

### 8.1 캐싱 전략

#### 8.1.1 메뉴 캐싱

```python
async def get_menu_cached(menu_id: UUID) -> Menu:
    # 1. Redis 캐시 확인
    cache_key = f"menu:{menu_id}"
    cached_data = await redis.get(cache_key)
    
    if cached_data:
        return json.loads(cached_data)
    
    # 2. DB 조회
    menu = await db.query(Menu).filter(Menu.id == menu_id).first()
    
    # 3. 캐시 저장 (1시간 TTL)
    await redis.setex(cache_key, 3600, json.dumps(menu.dict()))
    
    return menu
```

#### 8.1.2 캐시 무효화

```python
async def invalidate_menu_cache(menu_id: UUID):
    # 단일 메뉴 캐시 삭제
    await redis.delete(f"menu:{menu_id}")
    
    # 메뉴 목록 캐시 삭제
    await redis.delete("menus:*")
```

### 8.2 데이터베이스 최적화

#### 8.2.1 인덱스 최적화

```sql
-- 메뉴 조회 성능 향상
CREATE INDEX idx_menus_cafe_active ON menus(cafe_id, is_active);
CREATE INDEX idx_menus_category ON menus(category);
CREATE INDEX idx_menus_stock ON menus(stock_quantity);

-- 주문 조회 성능 향상
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
CREATE INDEX idx_orders_cafe_time ON orders(cafe_id, order_time DESC);
CREATE INDEX idx_orders_status ON orders(status);
```

#### 8.2.2 쿼리 최적화

```python
# N+1 문제 해결: Eager Loading
menus = await db.execute(
    select(Menu)
    .options(
        selectinload(Menu.option_groups).selectinload(OptionGroup.options)
    )
    .where(Menu.cafe_id == cafe_id)
)
```

---

## 9. 에러 처리

### 9.1 에러 코드 정의

| HTTP 코드 | 에러 코드 | 설명 | 예시 |
|----------|----------|------|------|
| 400 | `INVALID_INPUT` | 입력 검증 실패 | "가격은 0 이상이어야 합니다" |
| 400 | `OUT_OF_STOCK` | 재고 부족 | "재고가 부족합니다" |
| 400 | `INVALID_OPTIONS` | 필수 옵션 미선택 | "사이즈를 선택해주세요" |
| 400 | `INVALID_PICKUP_TIME` | 픽업 시간 오류 | "픽업 시간이 과거입니다" |
| 401 | `UNAUTHORIZED` | 인증 실패 | "로그인이 필요합니다" |
| 403 | `FORBIDDEN` | 권한 없음 | "관리자 권한이 필요합니다" |
| 404 | `NOT_FOUND` | 리소스 없음 | "메뉴를 찾을 수 없습니다" |
| 409 | `CONFLICT` | 충돌 | "이미 존재하는 메뉴입니다" |
| 429 | `RATE_LIMIT_EXCEEDED` | 요청 제한 초과 | "너무 많은 요청입니다" |
| 500 | `INTERNAL_SERVER_ERROR` | 서버 오류 | "서버 오류가 발생했습니다" |

### 9.2 에러 응답 형식

```json
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "재고가 부족합니다",
    "details": {
      "menuId": "MENU-001",
      "menuName": "아메리카노",
      "requested": 5,
      "available": 2
    }
  },
  "timestamp": "2024-12-18T10:30:00Z",
  "requestId": "req_abc123"
}
```

### 9.3 예외 처리 구현

```python
class OrderBeanException(Exception):
    def __init__(self, code: str, message: str, details: dict = None):
        self.code = code
        self.message = message
        self.details = details or {}

class OutOfStockError(OrderBeanException):
    def __init__(self, menu_id: UUID, requested: int, available: int):
        super().__init__(
            code="OUT_OF_STOCK",
            message="재고가 부족합니다",
            details={
                "menuId": str(menu_id),
                "requested": requested,
                "available": available
            }
        )

# 에러 핸들러
@app.exception_handler(OrderBeanException)
async def orderbean_exception_handler(request: Request, exc: OrderBeanException):
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details
            },
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "requestId": request.state.request_id
        }
    )
```

---

## 10. 개발 가이드

### 10.1 개발 환경 설정

#### 10.1.1 필수 도구
- **Python**: 3.11+
- **PostgreSQL**: 15+
- **Redis**: 7+
- **Docker**: (선택) 로컬 개발 환경

#### 10.1.2 프로젝트 구조

```
backend/
├── app/
│   ├── main.py              # FastAPI 앱 진입점
│   ├── config.py            # 설정
│   ├── database.py          # DB 연결
│   ├── models/              # SQLAlchemy 모델
│   │   ├── menu.py
│   │   ├── order.py
│   │   └── user.py
│   ├── schemas/             # Pydantic 스키마
│   │   ├── menu.py
│   │   ├── order.py
│   │   └── user.py
│   ├── api/                 # API 라우터
│   │   ├── menus.py
│   │   ├── orders.py
│   │   ├── admin.py
│   │   └── auth.py
│   ├── services/            # 비즈니스 로직
│   │   ├── menu_service.py
│   │   ├── order_service.py
│   │   └── stock_service.py
│   ├── utils/               # 유틸리티
│   │   ├── auth.py
│   │   ├── cache.py
│   │   └── errors.py
│   └── tests/               # 테스트
│       ├── test_menus.py
│       └── test_orders.py
├── alembic/                 # DB 마이그레이션
├── requirements.txt
├── .env.example
└── README.md
```

### 10.2 코딩 컨벤션

#### 10.2.1 명명 규칙
- **함수/메서드**: `snake_case` (예: `get_menu`, `create_order`)
- **클래스**: `PascalCase` (예: `MenuService`, `OrderCreate`)
- **상수**: `UPPER_SNAKE_CASE` (예: `MAX_QUANTITY`, `DEFAULT_LIMIT`)
- **변수**: `snake_case` (예: `menu_id`, `total_amount`)

#### 10.2.2 타입 힌팅
모든 함수에 타입 힌팅 사용:

```python
async def get_menu(menu_id: UUID) -> Menu:
    ...

async def create_order(order_data: OrderCreate, user: User) -> Order:
    ...
```

#### 10.2.3 Docstring
주요 함수/클래스에 docstring 작성:

```python
async def deduct_stock(menu_id: UUID, quantity: int) -> Menu:
    """
    주문 생성 시 재고를 차감합니다.
    
    Args:
        menu_id: 메뉴 ID
        quantity: 차감할 수량
        
    Returns:
        업데이트된 메뉴 객체
        
    Raises:
        OutOfStockError: 재고가 부족한 경우
    """
    ...
```

### 10.3 테스트 가이드

#### 10.3.1 단위 테스트 예시

```python
import pytest
from app.services.stock_service import deduct_stock

@pytest.mark.asyncio
async def test_deduct_stock_success():
    # Given
    menu_id = UUID("...")
    initial_stock = 10
    quantity = 3
    
    # When
    menu = await deduct_stock(menu_id, quantity)
    
    # Then
    assert menu.stock_quantity == initial_stock - quantity

@pytest.mark.asyncio
async def test_deduct_stock_out_of_stock():
    # Given
    menu_id = UUID("...")
    quantity = 100
    
    # When / Then
    with pytest.raises(OutOfStockError):
        await deduct_stock(menu_id, quantity)
```

#### 10.3.2 통합 테스트 예시

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_order_success(client: AsyncClient, auth_token: str):
    # Given
    order_data = {
        "cafeId": "CAFE-001",
        "items": [
            {
                "menuId": "MENU-001",
                "quantity": 2,
                "selectedOptions": []
            }
        ]
    }
    
    # When
    response = await client.post(
        "/api/v1/orders",
        json=order_data,
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    
    # Then
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "pending"
```

### 10.4 배포 가이드

#### 10.4.1 환경 변수

```bash
# .env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/orderbean
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

#### 10.4.2 Render 배포

1. **GitHub 연동**: 리포지토리를 Render에 연결
2. **환경 변수 설정**: 위의 환경 변수를 Render 대시보드에 추가
3. **빌드 명령어**: `pip install -r requirements.txt`
4. **시작 명령어**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **자동 배포**: `main` 브랜치에 푸시 시 자동 배포

---

## 11. 부록

### 11.1 참고 문서
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 공식 문서](https://docs.sqlalchemy.org/)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Redis 공식 문서](https://redis.io/docs/)

### 11.2 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2024-12-18 | 초안 작성 | Backend Team |

---

**문서 끝**
