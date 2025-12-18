import api from '@/lib/api'
import type { 
  Order, 
  OrderListResponse,
  OrderFilterOptions,
  CreateOrderRequest, 
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  CancelOrderRequest,
  CancelOrderResponse
} from '@/types/order'
import type { ApiResponse } from '@/types/api'

export const orderService = {
  /**
   * 주문 생성
   * 
   * @example
   * ```typescript
   * const order = await orderService.createOrder({
   *   cafeId: 'CAFE-001',
   *   items: [{
   *     menuId: 'MENU-001',
   *     quantity: 2,
   *     selectedOptions: [{
   *       optionGroupId: 'OG-001',
   *       selectedOptionId: 'OPT-001'
   *     }]
   *   }],
   *   pickupTime: '2024-12-18T11:00:00Z'
   * })
   * ```
   */
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/api/v1/orders', data)
    return response.data.data
  },

  /**
   * 주문 목록 조회 (필터링 지원)
   * 
   * @example
   * ```typescript
   * const orders = await orderService.getOrders({
   *   status: OrderStatus.PENDING,
   *   page: 1,
   *   limit: 20
   * })
   * ```
   */
  getOrders: async (filters?: OrderFilterOptions): Promise<OrderListResponse> => {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.cafeId) params.append('cafeId', filters.cafeId)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const response = await api.get<ApiResponse<OrderListResponse>>(
      `/api/v1/orders${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data.data
  },

  /**
   * 주문 상세 조회
   */
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/api/v1/orders/${id}`)
    return response.data.data
  },

  /**
   * 주문 상태 업데이트 (관리자 전용)
   * 
   * @example
   * ```typescript
   * const result = await orderService.updateOrderStatus('ORD-001', {
   *   status: OrderStatus.PREPARING
   * })
   * ```
   */
  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusRequest
  ): Promise<UpdateOrderStatusResponse> => {
    const response = await api.patch<ApiResponse<UpdateOrderStatusResponse>>(
      `/api/v1/admin/orders/${id}/status`,
      data
    )
    return response.data.data
  },

  /**
   * 주문 취소
   * 
   * @example
   * ```typescript
   * const result = await orderService.cancelOrder('ORD-001', {
   *   reason: '주문 실수'
   * })
   * ```
   */
  cancelOrder: async (
    id: string,
    data: CancelOrderRequest
  ): Promise<CancelOrderResponse> => {
    const response = await api.post<ApiResponse<CancelOrderResponse>>(
      `/api/v1/orders/${id}/cancel`,
      data
    )
    return response.data.data
  },

  /**
   * 관리자 주문 대시보드 데이터 조회
   */
  getAdminDashboard: async (cafeId?: string): Promise<any> => {
    const params = cafeId ? `?cafeId=${cafeId}` : ''
    const response = await api.get<ApiResponse<any>>(
      `/api/v1/admin/orders/dashboard${params}`
    )
    return response.data.data
  },

  /**
   * 주문 통계 조회 (관리자 전용)
   * 
   * @example
   * ```typescript
   * const stats = await orderService.getOrderAnalytics({
   *   startDate: '2024-12-01',
   *   endDate: '2024-12-31',
   *   cafeId: 'CAFE-001'
   * })
   * ```
   */
  getOrderAnalytics: async (params: {
    startDate: string
    endDate: string
    cafeId?: string
  }): Promise<any> => {
    const queryParams = new URLSearchParams()
    queryParams.append('startDate', params.startDate)
    queryParams.append('endDate', params.endDate)
    if (params.cafeId) queryParams.append('cafeId', params.cafeId)
    
    const response = await api.get<ApiResponse<any>>(
      `/api/v1/admin/analytics/orders?${queryParams.toString()}`
    )
    return response.data.data
  }
}
