// 장바구니 아이템
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  options?: string[]
}

// 장바구니 스토어
export interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}
