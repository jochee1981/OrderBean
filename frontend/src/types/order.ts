// 주문 상태
export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED'
}

// 주문 아이템
export interface OrderItem {
  menuName: string
  quantity: number
  subtotal: number
}

// 주문
export interface Order {
  id: string
  orderNumber: string
  createdAt: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  userId?: string
  updatedAt?: string
}

// 주문 생성 요청
export interface CreateOrderRequest {
  items: {
    menuId: string
    quantity: number
    options?: string[]
  }[]
}

// 주문 상태 업데이트 요청
export interface UpdateOrderStatusRequest {
  status: OrderStatus
}

// 주문 스토어
export interface OrderStore {
  orders: Order[]
  orderCounter: number
  addOrder: (items: OrderItem[], totalAmount: number) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
}

// 주문 상태 텍스트 변환
export const getOrderStatusText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: '주문 접수',
    [OrderStatus.PREPARING]: '제조 중',
    [OrderStatus.READY]: '제조 완료',
    [OrderStatus.COMPLETED]: '픽업 완료'
  }
  return statusMap[status]
}

// 주문 상태 색상
export const getOrderStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-blue-100 text-blue-800',
    [OrderStatus.PREPARING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.READY]: 'bg-green-100 text-green-800',
    [OrderStatus.COMPLETED]: 'bg-gray-100 text-gray-800'
  }
  return colorMap[status]
}
