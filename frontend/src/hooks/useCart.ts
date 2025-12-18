import { useCartStore } from '@/stores/cartStore'
import type { CartItem } from '@/types/cart'
import { useMemo } from 'react'

export const useCart = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal
  } = useCartStore()

  // 총 수량 계산
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  // 총 금액 계산 (메모이제이션)
  const total = useMemo(() => {
    return getTotal()
  }, [items, getTotal])

  // 장바구니가 비어있는지 확인
  const isEmpty = items.length === 0

  // 특정 아이템이 장바구니에 있는지 확인
  const hasItem = (id: string, options?: string[]): boolean => {
    return items.some(
      item =>
        item.id === id &&
        JSON.stringify(item.options) === JSON.stringify(options)
    )
  }

  // 특정 아이템의 수량 가져오기
  const getItemQuantity = (id: string, options?: string[]): number => {
    const item = items.find(
      item =>
        item.id === id &&
        JSON.stringify(item.options) === JSON.stringify(options)
    )
    return item?.quantity || 0
  }

  return {
    items,
    totalItems,
    total,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    hasItem,
    getItemQuantity
  }
}
