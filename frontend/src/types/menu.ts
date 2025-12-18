import type { MenuId, ProductOptionId } from './brands'

/**
 * 제품 옵션
 * 
 * 메뉴에 추가할 수 있는 옵션 (예: 샷 추가, 사이즈 변경)
 */
export interface ProductOption {
  /** 옵션 고유 ID */
  id: ProductOptionId
  /** 옵션 이름 */
  name: string
  /** 가격 조정 (양수: 추가 요금, 음수: 할인) */
  priceAdjustment: number
}

/**
 * 메뉴 아이템
 * 
 * 카페에서 판매하는 음료/음식 메뉴
 */
export interface Menu {
  /** 메뉴 고유 ID */
  id: MenuId
  /** 메뉴 이름 */
  name: string
  /** 가격 (원) */
  price: number
  /** 메뉴 설명 */
  description: string
  /** 이미지 URL (nullable) */
  imageUrl: string | null
  /** 사용 가능한 옵션 목록 */
  options: ProductOption[]
  /** 재고 수량 */
  stock?: number
  /** 판매 가능 여부 */
  isAvailable?: boolean
  /** 생성 일시 (ISO 8601) */
  createdAt?: string
  /** 수정 일시 (ISO 8601) */
  updatedAt?: string
}

/**
 * 메뉴 생성 요청
 */
export interface CreateMenuRequest {
  /** 메뉴 이름 */
  name: string
  /** 가격 (원) */
  price: number
  /** 메뉴 설명 */
  description: string
  /** 이미지 URL (optional) */
  imageUrl?: string | null
  /** 옵션 목록 (optional) */
  options?: ProductOption[]
}

/**
 * 메뉴 수정 요청
 * 
 * 모든 필드는 선택적이며, 제공된 필드만 업데이트됩니다.
 */
export interface UpdateMenuRequest {
  /** 메뉴 이름 */
  name?: string
  /** 가격 (원) */
  price?: number
  /** 메뉴 설명 */
  description?: string
  /** 이미지 URL */
  imageUrl?: string | null
  /** 재고 수량 */
  stock?: number
  /** 판매 가능 여부 */
  isAvailable?: boolean
}
