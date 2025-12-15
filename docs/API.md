# API 문서

## 기본 정보

- **Base URL**: `http://localhost:3000/api/v1`
- **인증**: Bearer Token (JWT)
- **응답 형식**: JSON
- **API 문서**: `http://localhost:3000/api-docs` (Swagger UI)

## 인증

### 회원가입

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

### 로그인

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

### 로그아웃

```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

## 메뉴

### 메뉴 목록 조회

```http
GET /api/v1/menus?cafeId={cafeId}&category={category}&page=1&limit=20
```

**Query Parameters:**
- `cafeId` (string, optional): 카페 ID
- `category` (string, optional): 카테고리 (espresso, latte, frappuccino, tea)
- `minPrice` (number, optional): 최소 가격
- `maxPrice` (number, optional): 최대 가격
- `searchTerm` (string, optional): 검색어
- `sortBy` (string, optional): 정렬 기준 (name, price, popularity)
- `page` (number, optional): 페이지 번호 (기본값: 1)
- `limit` (number, optional): 페이지당 항목 수 (기본값: 20)

**응답:**
```json
{
  "success": true,
  "data": {
    "menus": [
      {
        "id": "menu-uuid",
        "name": "아메리카노",
        "price": 3500,
        "category": "espresso",
        "description": "진한 에스프레소와 뜨거운 물",
        "imageUrl": "https://...",
        "isActive": true,
        "optionGroups": [
          {
            "id": "og-uuid",
            "name": "Size",
            "isRequired": true,
            "allowMultiple": false,
            "options": [
              {
                "id": "opt-uuid",
                "name": "Small",
                "priceAdjustment": 0
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
  },
  "timestamp": "2024-12-15T14:30:00Z"
}
```

### 메뉴 상세 조회

```http
GET /api/v1/menus/{menuId}
```

### 메뉴 생성 (관리자)

```http
POST /api/v1/menus
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "cafeId": "cafe-uuid",
  "name": "콜드브루",
  "description": "차가운 브루드 커피",
  "price": 5500,
  "category": "espresso",
  "imageUrl": "https://..."
}
```

### 메뉴 수정 (관리자)

```http
PUT /api/v1/menus/{menuId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "콜드브루",
  "price": 5000
}
```

### 메뉴 삭제 (관리자)

```http
DELETE /api/v1/menus/{menuId}
Authorization: Bearer {admin_token}
```

## 주문

### 주문 생성

```http
POST /api/v1/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "cafeId": "cafe-uuid",
  "items": [
    {
      "menuId": "menu-uuid",
      "quantity": 2,
      "selectedOptions": [
        {
          "optionGroupId": "og-uuid",
          "selectedOptionId": "opt-uuid"
        }
      ],
      "notes": "뜨겁게 부탁합니다"
    }
  ],
  "pickupTime": "2024-12-15T14:40:00Z",
  "couponCode": "WELCOME10",
  "paymentMethod": "credit_card",
  "paymentToken": "pm_1234567890"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "orderId": "order-uuid",
    "orderNumber": "ORD-20241215-001",
    "status": "pending",
    "items": [
      {
        "menuId": "menu-uuid",
        "menuName": "아메리카노",
        "quantity": 2,
        "unitPrice": 3500,
        "subtotal": 7000
      }
    ],
    "totalAmount": 7000,
    "discountAmount": 700,
    "finalAmount": 6300,
    "pickupTime": "2024-12-15T14:40:00Z",
    "pickupEstimatedTime": "2024-12-15T14:45:00Z",
    "paymentStatus": "completed",
    "createdAt": "2024-12-15T14:30:00Z"
  }
}
```

### 주문 목록 조회

```http
GET /api/v1/orders?status={status}&page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (string, optional): 주문 상태 (pending, preparing, ready, completed, cancelled)
- `page` (number, optional): 페이지 번호
- `limit` (number, optional): 페이지당 항목 수

### 주문 상세 조회

```http
GET /api/v1/orders/{orderId}
Authorization: Bearer {token}
```

### 주문 취소

```http
PATCH /api/v1/orders/{orderId}/cancel
Authorization: Bearer {token}
```

### 주문 재주문

```http
POST /api/v1/orders/{orderId}/retry
Authorization: Bearer {token}
```

## 관리자 API

### 주문 모니터링 대시보드

```http
GET /api/v1/admin/orders/dashboard
Authorization: Bearer {admin_token}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "newOrders": [
      {
        "id": "order-uuid",
        "orderNumber": "ORD-20241215-001",
        "status": "pending",
        "items": [...],
        "createdAt": "2024-12-15T14:30:00Z"
      }
    ],
    "preparingOrders": [...],
    "readyOrders": [...]
  }
}
```

### 주문 상태 업데이트

```http
PATCH /api/v1/admin/orders/{orderId}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "preparing"
}
```

**주문 상태:**
- `pending`: 대기 중
- `preparing`: 준비 중
- `ready`: 준비 완료
- `picked`: 픽업 완료
- `completed`: 완료
- `cancelled`: 취소됨

### 주문 통계

```http
GET /api/v1/admin/analytics/orders?startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `startDate` (string, optional): 시작 날짜 (ISO 8601)
- `endDate` (string, optional): 종료 날짜 (ISO 8601)

**응답:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 450,
    "totalRevenue": 2475000,
    "averagePrepTime": 323,
    "cancelRate": 0.022,
    "popularMenus": [
      {
        "menuId": "menu-uuid",
        "menuName": "아메리카노",
        "count": 150
      }
    ],
    "hourlyDistribution": [
      { "hour": 8, "count": 45 },
      { "hour": 9, "count": 78 }
    ]
  }
}
```

### 메뉴 판매량 통계

```http
GET /api/v1/admin/analytics/menus?startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer {admin_token}
```

## WebSocket

### 연결

```javascript
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  auth: {
    token: 'jwt_token_here'
  }
})
```

### 주문 상태 구독

```javascript
// 주문 방에 조인
socket.emit('join:order', orderId)

// 주문 상태 변경 이벤트 수신
socket.on('order:status-changed', (data) => {
  console.log('Order status changed:', data)
  // { orderId: 'uuid', status: 'preparing' }
})
```

## 에러 응답

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "에러 메시지",
  "timestamp": "2024-12-15T14:30:00Z",
  "requestId": "req_abc123"
}
```

### 에러 코드

- `INVALID_INPUT`: 입력 검증 실패
- `UNAUTHORIZED`: 인증 실패
- `FORBIDDEN`: 권한 없음
- `NOT_FOUND`: 리소스를 찾을 수 없음
- `CAFE_NOT_FOUND`: 카페를 찾을 수 없음
- `MENU_NOT_FOUND`: 메뉴를 찾을 수 없음
- `ORDER_NOT_FOUND`: 주문을 찾을 수 없음
- `INVALID_OPTIONS`: 필수 옵션 미선택
- `OUT_OF_STOCK`: 재고 부족
- `PAYMENT_FAILED`: 결제 실패
- `RATE_LIMIT`: 요청 제한 초과
- `INTERNAL_ERROR`: 서버 내부 오류

## Rate Limiting

- **일반 사용자**: 100 requests/minute
- **프리미엄 사용자**: 1000 requests/minute

Rate limit 초과 시 `429 Too Many Requests` 응답과 함께 다음 헤더가 포함됩니다:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1609459200
```

