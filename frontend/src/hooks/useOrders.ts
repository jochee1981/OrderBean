import { useOrderStore } from '@/stores/orderStore'
import type { OrderStatus } from '@/types/order'
import { useMemo } from 'react'

export const useOrders = () => {
  const { orders, addOrder, updateOrderStatus } = useOrderStore()

  // 상태별 주문 수 계산
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      preparing: orders.filter(o => o.status === 'PREPARING').length,
      ready: orders.filter(o => o.status === 'READY').length,
      completed: orders.filter(o => o.status === 'COMPLETED').length
    }
  }, [orders])

  // 특정 상태의 주문 목록
  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status)
  }

  // 특정 주문 찾기
  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id)
  }

  // 최근 주문
  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 10)
  }, [orders])

  return {
    orders,
    stats,
    recentOrders,
    addOrder,
    updateOrderStatus,
    getOrdersByStatus,
    getOrderById
  }
}
