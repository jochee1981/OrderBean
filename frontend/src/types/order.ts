import type { OrderId, MenuId, UserId } from './brands'

/**
 * 주문 상태
 * 
 * 주문의 처리 단계를 나타냅니다.
 * State Machine: PENDING → PREPARING → READY → PICKED → COMPLETED
 *                  └─────────────→ CANCELLED
 */
export enum OrderStatus {
  /** 주문 접수 (기본값) */
  PENDING = 'pending',
  /** 제조 중 */
  PREPARING = 'preparing',
  /** 준비 완료 (픽업 대기) */
  READY = 'ready',
  /** 픽업 완료 */
  PICKED = 'picked',
  /** 완료 */
  COMPLETED = 'completed',
  /** 취소됨 */
  CANCELLED = 'cancelled'
}

/**
 * 주문 아이템 (주문 내 메뉴 항목)
 * 
 * 주문에 포함된 개별 메뉴 항목
 */
export interface OrderItem {
  /** 주문 아이템 ID */
  id?: string
  /** 메뉴 ID */
  menuId: MenuId
  /** 메뉴 이름 */
  menuName: string
  /** 주문 수량 */
  quantity: number
  /** 단가 (옵션 포함) */
  unitPrice: number
  /** 소계 (unitPrice × quantity) */
  subtotal: number
  /** 선택된 옵션 정보 */
  selectedOptions?: SelectedOption[]
  /** 메뉴별 메모 */
  notes?: string
}

/**
 * 선택된 옵션
 */
export interface SelectedOption {
  /** 옵션 그룹 이름 */
  groupName: string
  /** 옵션 이름 */
  optionName: string
  /** 옵션 가격 */
  optionPrice: number
}

/**
 * 주문
 * 
 * 고객의 주문 정보를 담는 메인 엔티티
 */
export interface Order {
  /** 주문 고유 ID */
  id: OrderId
  /** 주문 번호 (사용자 표시용, 예: ORD-20241218-001) */
  orderNumber: string
  /** 고객 ID */
  customerId: UserId
  /** 카페 ID */
  cafeId: string
  /** 현재 주문 상태 */
  status: OrderStatus
  /** 주문 항목 목록 */
  items: OrderItem[]
  /** 총 금액 (할인 전) */
  totalAmount: number
  /** 할인 금액 */
  discountAmount: number
  /** 최종 결제 금액 */
  finalAmount: number
  /** 주문 일시 */
  orderTime: string
  /** 픽업 예정 시간 */
  pickupTime?: string
  /** 픽업 예상 시간 (자동 계산) */
  pickupEstimatedTime?: string
  /** 주문 메모 */
  notes?: string
  /** 결제 상태 */
  paymentStatus?: string
  /** 결제 방법 */
  paymentMethod?: string
  /** 생성 일시 (ISO 8601) */
  createdAt: string
  /** 최종 수정 일시 (ISO 8601) */
  updatedAt?: string
}

/**
 * 주문 생성 요청
 * 
 * 새로운 주문을 생성하기 위한 요청 데이터
 */
export interface CreateOrderRequest {
  /** 카페 ID */
  cafeId: string
  /** 주문 항목 목록 */
  items: {
    /** 주문할 메뉴 ID */
    menuId: MenuId
    /** 주문 수량 */
    quantity: number
    /** 선택된 옵션 정보 */
    selectedOptions: {
      /** 옵션 그룹 ID */
      optionGroupId: string
      /** 선택된 옵션 ID (단일 선택) */
      selectedOptionId?: string
      /** 선택된 옵션 ID 목록 (다중 선택) */
      selectedOptionIds?: string[]
    }[]
    /** 메뉴별 메모 */
    notes?: string
  }[]
  /** 픽업 시간 */
  pickupTime?: string
  /** 쿠폰 코드 */
  couponCode?: string
  /** 결제 방법 */
  paymentMethod?: string
  /** 결제 토큰 */
  paymentToken?: string
  /** 주문 전체 메모 */
  notes?: string
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
 * 주문 목록 응답 (페이지네이션 포함)
 */
export interface OrderListResponse {
  /** 주문 목록 */
  orders: Order[]
  /** 페이지네이션 정보 */
  pagination: {
    /** 전체 주문 수 */
    total: number
    /** 현재 페이지 */
    page: number
    /** 페이지 크기 */
    limit: number
    /** 전체 페이지 수 */
    totalPages: number
  }
}

/**
 * 주문 필터 옵션
 */
export interface OrderFilterOptions {
  /** 상태 필터 */
  status?: OrderStatus
  /** 시작 날짜 */
  startDate?: string
  /** 종료 날짜 */
  endDate?: string
  /** 카페 ID */
  cafeId?: string
  /** 페이지 번호 */
  page?: number
  /** 페이지 크기 */
  limit?: number
}

/**
 * 주문 상태 업데이트 응답
 */
export interface UpdateOrderStatusResponse {
  /** 주문 ID */
  orderId: string
  /** 이전 상태 */
  previousStatus: OrderStatus
  /** 현재 상태 */
  currentStatus: OrderStatus
  /** 업데이트 일시 */
  updatedAt: string
}

/**
 * 주문 취소 요청
 */
export interface CancelOrderRequest {
  /** 취소 사유 */
  reason: string
}

/**
 * 주문 취소 응답
 */
export interface CancelOrderResponse {
  /** 주문 ID */
  orderId: string
  /** 주문 상태 (cancelled) */
  status: OrderStatus
  /** 환불 금액 */
  refundAmount: number
  /** 취소 일시 */
  cancelledAt: string
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
 * getOrderStatusText(OrderStatus.READY) // "준비 완료"
 * ```
 */
export const getOrderStatusText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: '주문 접수',
    [OrderStatus.PREPARING]: '제조 중',
    [OrderStatus.READY]: '준비 완료',
    [OrderStatus.PICKED]: '픽업 완료',
    [OrderStatus.COMPLETED]: '완료',
    [OrderStatus.CANCELLED]: '취소됨'
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
    [OrderStatus.PICKED]: 'bg-purple-100 text-purple-800',
    [OrderStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800'
  }
  return colorMap[status]
}

/**
 * 주문 상태 전환 가능 여부 확인
 * 
 * @param currentStatus - 현재 주문 상태
 * @param newStatus - 변경할 주문 상태
 * @returns 전환 가능 여부
 */
export const canTransitionStatus = (
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean => {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
    [OrderStatus.READY]: [OrderStatus.PICKED],
    [OrderStatus.PICKED]: [OrderStatus.COMPLETED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: []
  }
  
  return allowedTransitions[currentStatus]?.includes(newStatus) || false
}
