import api from '@/lib/api'
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  OrderStatus
} from '@/types/order'
import type { ApiResponse } from '@/types/api'

export const orderService = {
  // 주문 생성
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', data)
    return response.data.data
  },

  // 내 주문 목록 조회
  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]>>('/orders/me')
    return response.data.data
  },

  // 주문 상세 조회
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`)
    return response.data.data
  },

  // 모든 주문 조회 (관리자)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]>>('/admin/orders')
    return response.data.data
  },

  // 주문 상태 업데이트 (관리자)
  updateOrderStatus: async (
    id: string,
    status: OrderStatus
  ): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      { status }
    )
    return response.data.data
  },

  // 주문 취소
  cancelOrder: async (id: string): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>(
      `/orders/${id}/cancel`
    )
    return response.data.data
  }
}
