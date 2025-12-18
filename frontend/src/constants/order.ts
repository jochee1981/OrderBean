import { OrderStatus } from '@/types/order'

// 주문 상태 텍스트
export const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '주문 접수',
  [OrderStatus.PREPARING]: '제조 중',
  [OrderStatus.READY]: '제조 완료',
  [OrderStatus.COMPLETED]: '픽업 완료'
}

// 주문 상태 색상
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PREPARING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.READY]: 'bg-green-100 text-green-800',
  [OrderStatus.COMPLETED]: 'bg-gray-100 text-gray-800'
}

// 주문 상태 아이콘
export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '🔔',
  [OrderStatus.PREPARING]: '⚡',
  [OrderStatus.READY]: '✅',
  [OrderStatus.COMPLETED]: '✔️'
}

// 주문 상태 배경색 (카드용)
export const ORDER_STATUS_BG: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-blue-50 border-blue-200',
  [OrderStatus.PREPARING]: 'bg-yellow-50 border-yellow-200',
  [OrderStatus.READY]: 'bg-green-50 border-green-200',
  [OrderStatus.COMPLETED]: 'bg-gray-50 border-gray-200'
}
