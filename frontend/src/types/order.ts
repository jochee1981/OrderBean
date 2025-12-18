import type { OrderId, MenuId, UserId } from './brands'

/**
 * 주문 상태
 * 
 * 주문의 처리 단계를 나타냅니다.
 */
export enum OrderStatus {
  /** 주문 접수 */
  PENDING = 'PENDING',
  /** 제조 중 */
  PREPARING = 'PREPARING',
  /** 제조 완료 (픽업 대기) */
  READY = 'READY',
  /** 픽업 완료 */
  COMPLETED = 'COMPLETED'
}

/**
 * 주문 아이템
 * 
 * 주문에 포함된 개별 메뉴 항목
 */
export interface OrderItem {
  /** 메뉴 이름 */
  menuName: string
  /** 주문 수량 */
  quantity: number
  /** 소계 (가격 × 수량) */
  subtotal: number
}

/**
 * 주문
 * 
 * 고객의 주문 정보를 담는 메인 엔티티
 */
export interface Order {
  /** 주문 고유 ID */
  id: OrderId
  /** 주문 번호 (사용자 표시용) */
  orderNumber: string
  /** 주문 생성 일시 (ISO 8601) */
  createdAt: string
  /** 주문 항목 목록 */
  items: OrderItem[]
  /** 총 주문 금액 (원) */
  totalAmount: number
  /** 현재 주문 상태 */
  status: OrderStatus
  /** 주문한 사용자 ID */
  userId?: UserId
  /** 최종 수정 일시 (ISO 8601) */
  updatedAt?: string
}

/**
 * 주문 생성 요청
 * 
 * 새로운 주문을 생성하기 위한 요청 데이터
 */
export interface CreateOrderRequest {
  items: {
    /** 주문할 메뉴 ID */
    menuId: MenuId
    /** 주문 수량 */
    quantity: number
    /** 선택한 옵션들 */
    options?: string[]
  }[]
}

/**
 * 주문 상태 업데이트 요청
 * 
 * 주문의 상태를 변경하기 위한 요청 (관리자용)
 */
export interface UpdateOrderStatusRequest {
  /** 변경할 주문 상태 */
  status: OrderStatus
}

/**
 * 주문 스토어 인터페이스
 * 
 * Zustand 스토어의 타입 정의
 */
export interface OrderStore {
  /** 주문 목록 */
  orders: Order[]
  /** 주문 번호 카운터 */
  orderCounter: number
  /** 새 주문 추가 */
  addOrder: (items: OrderItem[], totalAmount: number) => void
  /** 주문 상태 업데이트 */
  updateOrderStatus: (orderId: OrderId, status: OrderStatus) => void
}

/**
 * 주문 상태를 한글 텍스트로 변환
 * 
 * @param status - 주문 상태
 * @returns 한글 상태 텍스트
 * 
 * @example
 * ```typescript
 * getOrderStatusText(OrderStatus.PENDING) // "주문 접수"
 * getOrderStatusText(OrderStatus.READY) // "제조 완료"
 * ```
 */
export const getOrderStatusText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: '주문 접수',
    [OrderStatus.PREPARING]: '제조 중',
    [OrderStatus.READY]: '제조 완료',
    [OrderStatus.COMPLETED]: '픽업 완료'
  }
  return statusMap[status]
}

/**
 * 주문 상태에 따른 Tailwind CSS 클래스를 반환
 * 
 * @param status - 주문 상태
 * @returns Tailwind CSS 클래스 문자열
 * 
 * @example
 * ```typescript
 * getOrderStatusColor(OrderStatus.PENDING) // "bg-blue-100 text-blue-800"
 * ```
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-blue-100 text-blue-800',
    [OrderStatus.PREPARING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.READY]: 'bg-green-100 text-green-800',
    [OrderStatus.COMPLETED]: 'bg-gray-100 text-gray-800'
  }
  return colorMap[status]
}
