// 제품 옵션
export interface ProductOption {
  id: string
  name: string
  priceAdjustment: number
}

// 메뉴 아이템
export interface Menu {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string | null
  options: ProductOption[]
  stock?: number
  isAvailable?: boolean
  createdAt?: string
  updatedAt?: string
}

// 메뉴 생성 요청
export interface CreateMenuRequest {
  name: string
  price: number
  description: string
  imageUrl?: string | null
  options?: ProductOption[]
}

// 메뉴 수정 요청
export interface UpdateMenuRequest {
  name?: string
  price?: number
  description?: string
  imageUrl?: string | null
  stock?: number
  isAvailable?: boolean
}
