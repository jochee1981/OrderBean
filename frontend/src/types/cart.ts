import type { CartItemId, MenuId } from './brands'

/**
 * 장바구니 아이템
 * 
 * 사용자가 주문하기 전에 담은 메뉴 항목
 */
export interface CartItem {
  /** 장바구니 아이템 고유 ID */
  id: CartItemId
  /** 메뉴 ID */
  menuId: MenuId
  /** 메뉴 이름 */
  name: string
  /** 가격 (원) */
  price: number
  /** 수량 */
  quantity: number
  /** 선택한 옵션들 */
  options?: string[]
}

/**
 * 장바구니 스토어 인터페이스
 * 
 * Zustand 스토어의 타입 정의
 */
export interface CartStore {
  /** 장바구니 아이템 목록 */
  items: CartItem[]
  /** 아이템 추가 */
  addItem: (item: CartItem) => void
  /** 아이템 제거 */
  removeItem: (id: CartItemId) => void
  /** 수량 변경 */
  updateQuantity: (id: CartItemId, quantity: number) => void
  /** 장바구니 비우기 */
  clearCart: () => void
  /** 총 금액 계산 */
  getTotal: () => number
}
