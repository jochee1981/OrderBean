import type { MenuId, ProductOptionId } from './brands'

/**
 * 옵션 그룹
 * 
 * 메뉴 옵션을 그룹화하여 관리 (예: 사이즈, 시럽, 우유 종류)
 */
export interface OptionGroup {
  /** 옵션 그룹 고유 ID */
  id: string
  /** 그룹 이름 (예: "사이즈", "시럽", "우유") */
  name: string
  /** 필수 선택 여부 */
  isRequired: boolean
  /** 다중 선택 가능 여부 */
  allowMultiple: boolean
  /** 표시 순서 */
  displayOrder?: number
  /** 그룹 내 옵션 목록 */
  options: MenuOption[]
}

/**
 * 메뉴 옵션
 * 
 * 옵션 그룹에 속한 개별 옵션
 */
export interface MenuOption {
  /** 옵션 고유 ID */
  id: ProductOptionId
  /** 옵션 이름 */
  name: string
  /** 가격 조정 (양수: 추가 요금, 음수: 할인) */
  optionPrice: number
  /** 표시 순서 */
  displayOrder?: number
}

/**
 * 제품 옵션 (레거시 - 하위 호환성 유지)
 * 
 * @deprecated OptionGroup과 MenuOption을 사용하세요
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
  /** 카페 ID */
  cafeId?: string
  /** 메뉴 이름 */
  name: string
  /** 가격 (원) */
  price: number
  /** 메뉴 설명 */
  description: string
  /** 이미지 URL (nullable) */
  imageUrl: string | null
  /** 카테고리 (espresso, latte, frappuccino, tea) */
  category: string
  /** 재고 수량 (관리자만 조회) */
  stockQuantity?: number
  /** 재고 유무 (고객 화면용) */
  inStock: boolean
  /** 판매 활성화 여부 */
  isActive: boolean
  /** 옵션 그룹 목록 */
  optionGroups: OptionGroup[]
  /** 레거시 옵션 (하위 호환성) */
  options?: ProductOption[]
  /** 생성 일시 (ISO 8601) */
  createdAt?: string
  /** 수정 일시 (ISO 8601) */
  updatedAt?: string
}

/**
 * 메뉴 목록 응답 (페이지네이션 포함)
 */
export interface MenuListResponse {
  /** 메뉴 목록 */
  menus: Menu[]
  /** 페이지네이션 정보 */
  pagination: {
    /** 전체 메뉴 수 */
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
 * 메뉴 조회 필터 옵션
 */
export interface MenuFilterOptions {
  /** 카테고리 필터 */
  category?: string
  /** 최소 가격 */
  minPrice?: number
  /** 최대 가격 */
  maxPrice?: number
  /** 검색어 */
  searchTerm?: string
  /** 정렬 기준 (name, price, popularity) */
  sortBy?: 'name' | 'price' | 'popularity'
  /** 페이지 번호 */
  page?: number
  /** 페이지 크기 */
  limit?: number
  /** 비활성 메뉴 포함 (관리자용) */
  includeInactive?: boolean
}

/**
 * 메뉴 생성 요청
 */
export interface CreateMenuRequest {
  /** 카페 ID */
  cafeId: string
  /** 메뉴 이름 */
  name: string
  /** 가격 (원) */
  price: number
  /** 메뉴 설명 */
  description: string
  /** 이미지 URL (optional) */
  imageUrl?: string | null
  /** 카테고리 */
  category: string
  /** 재고 수량 */
  stockQuantity: number
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
  stockQuantity?: number
  /** 판매 활성화 여부 */
  isActive?: boolean
}

/**
 * 재고 수정 요청
 */
export interface UpdateStockRequest {
  /** 재고 수량 */
  stockQuantity: number
  /** 작업 타입 (set: 설정, increase: 증가, decrease: 감소) */
  operation: 'set' | 'increase' | 'decrease'
}

/**
 * 재고 수정 응답
 */
export interface UpdateStockResponse {
  /** 메뉴 ID */
  menuId: string
  /** 이전 재고 수량 */
  previousStock: number
  /** 현재 재고 수량 */
  currentStock: number
  /** 업데이트 일시 */
  updatedAt: string
}
