# Phase 3 구현 시나리오: 관리자 기능 (대시보드 및 통계)

## 📋 개요

**목표**: 관리자 대시보드 및 통계 분석 기능을 최소 단위로 구현하여 테스트를 통과시키기

**범위**: 관리자 대시보드, 주문 통계, 메뉴 분석의 핵심 기능만 구현

**예상 소요 시간**: 3-4시간

---

## 🎯 구현 목표

### 1. 관리자 대시보드 구현
- **최소 목표**: 주문 상태별 조회 기능 구현
- **방법**: DB에서 주문을 상태별로 조회하여 반환
- **제외**: 고급 필터링, 페이지네이션, 실시간 업데이트

### 2. 주문 통계 분석 구현
- **최소 목표**: 기본 통계 데이터 계산 및 반환
- **방법**: Prisma 집계 쿼리 사용
- **제외**: 기간별 필터링, 고급 분석, 그래프 데이터

### 3. 메뉴 분석 구현
- **최소 목표**: 메뉴별 판매 통계 계산
- **방법**: OrderItem을 그룹화하여 통계 계산
- **제외**: 기간별 필터링, 트렌드 분석

---

## 📝 상세 구현 계획

### Step 1: 관리자 대시보드 구현 (60분)

#### 1.1 주문 상태별 조회
- **엔드포인트**: `GET /api/v1/admin/orders/dashboard`
- **기능**:
  - `newOrders`: PENDING 상태 주문 목록
  - `preparingOrders`: PREPARING 상태 주문 목록
  - `readyOrders`: READY 상태 주문 목록
- **정렬**: 최신순 (created_at DESC)
- **제한**: 최대 50개 (Phase 4에서 페이지네이션 추가)

**파일**: `backend/src/controllers/admin.controller.ts` (getOrderDashboard 함수)

```typescript
// 예시 로직
const newOrders = await prisma.order.findMany({
  where: { status: 'PENDING' },
  include: { order_items: { include: { menu: true } } },
  orderBy: { created_at: 'desc' },
  take: 50
})
```

#### 1.2 권한 검증 확인
- **현재 상태**: 이미 `authorize('admin')` 미들웨어 적용됨
- **확인 사항**: 403 에러가 올바르게 반환되는지 확인
- **추가 작업**: 없음 (이미 구현됨)

---

### Step 2: 주문 통계 분석 구현 (90분)

#### 2.1 전체 주문 수 계산
- `totalOrders`: 전체 주문 수 (COMPLETED, CANCELLED 제외 또는 포함 결정)
- **기본**: 모든 주문 수 (상태 무관)

#### 2.2 총 매출액 계산
- `totalRevenue`: COMPLETED 상태 주문의 final_amount 합계
- **주의**: CANCELLED 주문은 제외

#### 2.3 평균 준비 시간 계산
- `averagePrepTime`: PREPARING → READY 상태 변경까지의 평균 시간 (초 단위)
- **로직**: 
  - PREPARING 상태로 변경된 시간과 READY 상태로 변경된 시간의 차이
  - **문제**: 현재 스키마에 상태 변경 시간 추적 필드가 없음
  - **해결**: updated_at을 사용하거나 간단히 0 반환 (Phase 4에서 개선)

#### 2.4 취소율 계산
- `cancelRate`: (CANCELLED 주문 수 / 전체 주문 수) × 100
- **형식**: 소수점 2자리 (예: 5.25)

#### 2.5 인기 메뉴 목록
- `popularMenus`: 판매량 기준 Top 10 메뉴
- **데이터**: 메뉴명, 판매량, 매출액
- **정렬**: 판매량 내림차순

**파일**: `backend/src/controllers/admin.controller.ts` (getOrderAnalytics 함수)

```typescript
// 예시 로직
const totalOrders = await prisma.order.count()
const totalRevenue = await prisma.order.aggregate({
  where: { status: 'COMPLETED' },
  _sum: { final_amount: true }
})
const cancelRate = (cancelledCount / totalOrders) * 100
```

---

### Step 3: 메뉴 분석 구현 (60분)

#### 3.1 메뉴별 판매 통계
- `menuSales`: 각 메뉴의 판매 통계 배열
- **포함 데이터**:
  - menuId
  - menuName
  - totalQuantity: 총 판매 수량
  - totalRevenue: 총 매출액
  - orderCount: 주문 횟수

#### 3.2 정렬
- 판매량 내림차순 (totalQuantity DESC)

**파일**: `backend/src/controllers/admin.controller.ts` (getMenuAnalytics 함수)

```typescript
// 예시 로직
const menuSales = await prisma.orderItem.groupBy({
  by: ['menu_id'],
  _sum: { quantity: true, subtotal: true },
  _count: { id: true }
})
```

---

## 🔍 구현 범위 및 제한사항

### ✅ 포함되는 것
1. 주문 상태별 조회 (PENDING, PREPARING, READY)
2. 기본 통계 계산 (주문 수, 매출액, 취소율)
3. 인기 메뉴 목록 (판매량 기준)
4. 메뉴별 판매 통계
5. 권한 검증 (이미 구현됨)

### ❌ 제외되는 것 (Phase 4로 연기)
1. 기간별 필터링 (오늘, 이번 주, 이번 달 등)
2. 페이지네이션 (대시보드, 통계)
3. 고급 분석 (트렌드, 예측 등)
4. 그래프 데이터 (시간대별, 요일별 등)
5. 평균 준비 시간 정확한 계산 (상태 변경 시간 추적 필요)
6. 실시간 업데이트 (WebSocket)
7. 캐싱 (Redis)

---

## 📊 예상 결과

### Before (현재 상태)
```
❌ 대시보드: 빈 배열만 반환
❌ 통계: 모든 값이 0
❌ 메뉴 분석: 빈 배열 반환
✅ 권한 검증: 이미 구현됨
```

### After (구현 후)
```
✅ 대시보드: 상태별 주문 목록 반환
✅ 통계: 실제 데이터 기반 계산값 반환
✅ 메뉴 분석: 메뉴별 판매 통계 반환
✅ 권한 검증: 이미 구현됨 (확인만)
⚠️  평균 준비 시간: 간소화된 계산 (0 또는 기본값)
⚠️  고급 기능: 미구현 (Phase 4)
```

---

## 🧪 테스트 시나리오

### 시나리오 1: 관리자 대시보드 조회
```bash
GET /api/v1/admin/orders/dashboard
Headers: Authorization: Bearer <admin-token>

# 예상 결과
✅ 200 OK
✅ newOrders, preparingOrders, readyOrders 배열 반환
✅ 각 배열에 주문 데이터 포함
```

### 시나리오 2: 비관리자 접근 차단
```bash
GET /api/v1/admin/orders/dashboard
Headers: Authorization: Bearer <customer-token>

# 예상 결과
✅ 403 Forbidden
✅ success: false
```

### 시나리오 3: 주문 통계 조회
```bash
GET /api/v1/admin/analytics/orders
Headers: Authorization: Bearer <admin-token>

# 예상 결과
✅ 200 OK
✅ totalOrders, totalRevenue, cancelRate, popularMenus 반환
✅ 모든 값이 숫자 또는 배열
```

### 시나리오 4: 메뉴 분석 조회
```bash
GET /api/v1/admin/analytics/menus
Headers: Authorization: Bearer <admin-token>

# 예상 결과
✅ 200 OK
✅ menuSales 배열 반환
✅ 각 항목에 menuId, menuName, totalQuantity, totalRevenue 포함
```

---

## ⚠️ 주의사항 및 고려사항

### 1. 권한 검증
- **현재 상태**: 이미 `authorize('admin')` 미들웨어 적용됨
- **확인 필요**: 테스트에서 admin 사용자 생성 시 role이 'ADMIN'으로 설정되는지
- **해결**: testHelpers에 admin 사용자 생성 함수 추가 또는 수동으로 role 업데이트

### 2. 평균 준비 시간 계산
- **문제**: 상태 변경 시간을 추적하는 필드가 없음
- **해결 방안**:
  - Option 1: 간단히 0 반환 (Phase 4에서 개선)
  - Option 2: updated_at을 사용한 근사치 계산
  - **권장**: Option 1 (최소 단위 구현)

### 3. 데이터 정확성
- **현재**: 기본적인 집계만 수행
- **제한**: 복잡한 비즈니스 로직은 Phase 4에서 추가
- **예시**: 할인 적용 여부, 부분 취소 등

### 4. 성능 고려사항
- **현재**: 단순 쿼리만 사용
- **제한**: 대량 데이터 시 성능 이슈 가능
- **Phase 4**: 인덱싱, 캐싱, 페이지네이션 추가

### 5. 테스트 데이터
- **필요**: 통계 테스트를 위한 샘플 주문 데이터
- **방법**: 테스트에서 직접 생성하거나 시드 데이터 사용

---

## 📁 생성/수정될 파일 목록

### 수정
1. `backend/src/controllers/admin.controller.ts` - 3개 함수 구현
   - `getOrderDashboard()` - 대시보드 구현
   - `getOrderAnalytics()` - 주문 통계 구현
   - `getMenuAnalytics()` - 메뉴 분석 구현

### 수정 (선택적)
2. `backend/src/__tests__/helpers/testHelpers.ts` - admin 사용자 생성 헬퍼 추가

---

## 🔄 라우트 경로 불일치 발견 및 해결

### 문제 발견
**테스트에서 사용하는 경로**:
- `/api/v1/admin/dashboard`
- `/api/v1/admin/analytics`
- `/api/v1/admin/menu-analytics`

**현재 라우트 설정** (`admin.routes.ts`):
- `/orders/dashboard` → 전체: `/api/v1/admin/orders/dashboard`
- `/analytics/orders` → 전체: `/api/v1/admin/analytics/orders`
- `/analytics/menus` → 전체: `/api/v1/admin/analytics/menus`

**경로 불일치**: 테스트와 라우트 경로가 다름

### 해결 방안
**Option 1**: 라우트 경로 수정 (권장)
```typescript
router.get('/dashboard', getOrderDashboard)  // 변경
router.get('/analytics', getOrderAnalytics)   // 변경
router.get('/menu-analytics', getMenuAnalytics) // 변경
```

**Option 2**: 테스트 경로 수정
- 테스트 파일의 경로를 현재 라우트에 맞게 수정

**권장**: Option 1 (라우트 수정)
- 더 간단하고 직관적인 경로
- RESTful 원칙에 더 부합

---

## 📝 구현 순서

1. **Step 1**: 관리자 대시보드 구현
   - 주문 상태별 조회
   - 응답 형식 구성

2. **Step 2**: 주문 통계 분석 구현
   - 전체 주문 수
   - 총 매출액
   - 취소율
   - 인기 메뉴
   - 평균 준비 시간 (간소화)

3. **Step 3**: 메뉴 분석 구현
   - 메뉴별 판매 통계
   - 정렬 및 포맷팅

4. **Step 4**: 테스트 헬퍼 개선 (선택적)
   - Admin 사용자 생성 함수

---

## ✅ 승인 체크리스트

구현 전 확인 사항:
- [ ] 시나리오 검토 완료
- [ ] 구현 범위 이해 (최소 단위)
- [ ] 제외 사항 이해 (Phase 4로 연기)
- [ ] 평균 준비 시간 간소화 수용
- [ ] 라우트 경로 확인 필요
- [ ] 예상 결과 수용 가능
- [ ] 주의사항 확인

---

## 🚀 다음 단계 (Phase 4)

Phase 3 완료 후:
1. 기간별 필터링 (오늘, 이번 주, 이번 달)
2. 페이지네이션 구현
3. 평균 준비 시간 정확한 계산 (상태 변경 시간 추적)
4. 고급 분석 기능
5. 그래프 데이터 생성
6. 캐싱 전략 (Redis)
7. 실시간 업데이트 (WebSocket)

---

## 🔍 라우트 경로 확인 필요

테스트에서 사용하는 경로:
- `/api/v1/admin/dashboard`
- `/api/v1/admin/analytics`
- `/api/v1/admin/menu-analytics`

라우트에서 정의된 경로:
- `/orders/dashboard`
- `/analytics/orders`
- `/analytics/menus`

**확인 필요**: 실제 라우트 등록 경로 확인

---

**작성일**: 2024-12-16  
**버전**: 1.0  
**상태**: 승인 대기

