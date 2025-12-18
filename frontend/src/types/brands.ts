/**
 * 브랜드 타입 (Branded Types)
 * 
 * 문자열 ID를 타입 안전하게 만들기 위한 브랜드 타입입니다.
 * 이를 통해 컴파일 타임에 잘못된 ID 사용을 방지할 수 있습니다.
 * 
 * @example
 * ```typescript
 * const menuId: MenuId = 'menu-123' as MenuId
 * const orderId: OrderId = 'order-456' as OrderId
 * 
 * // 컴파일 에러: Type 'OrderId' is not assignable to type 'MenuId'
 * const wrongId: MenuId = orderId
 * ```
 */

declare const brand: unique symbol

/**
 * 브랜드 타입 헬퍼
 */
type Brand<T, TBrand> = T & { [brand]: TBrand }

/**
 * 메뉴 ID 브랜드 타입
 */
export type MenuId = Brand<string, 'MenuId'>

/**
 * 주문 ID 브랜드 타입
 */
export type OrderId = Brand<string, 'OrderId'>

/**
 * 사용자 ID 브랜드 타입
 */
export type UserId = Brand<string, 'UserId'>

/**
 * 장바구니 아이템 ID 브랜드 타입
 */
export type CartItemId = Brand<string, 'CartItemId'>

/**
 * 제품 옵션 ID 브랜드 타입
 */
export type ProductOptionId = Brand<string, 'ProductOptionId'>

/**
 * ID 생성 헬퍼 함수들
 */

export const toMenuId = (id: string): MenuId => id as MenuId
export const toOrderId = (id: string): OrderId => id as OrderId
export const toUserId = (id: string): UserId => id as UserId
export const toCartItemId = (id: string): CartItemId => id as CartItemId
export const toProductOptionId = (id: string): ProductOptionId => id as ProductOptionId

/**
 * ID 검증 함수들
 */

export const isValidMenuId = (id: unknown): id is MenuId => {
  return typeof id === 'string' && id.length > 0
}

export const isValidOrderId = (id: unknown): id is OrderId => {
  return typeof id === 'string' && id.length > 0
}

export const isValidUserId = (id: unknown): id is UserId => {
  return typeof id === 'string' && id.length > 0
}
