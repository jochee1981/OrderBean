import api from '@/lib/api'
import type { 
  Menu, 
  MenuListResponse,
  MenuFilterOptions,
  CreateMenuRequest, 
  UpdateMenuRequest,
  UpdateStockRequest,
  UpdateStockResponse
} from '@/types/menu'
import type { ApiResponse } from '@/types/api'

export const menuService = {
  /**
   * 메뉴 목록 조회 (필터링 지원)
   * 
   * @example
   * ```typescript
   * const menus = await menuService.getMenus({
   *   category: 'espresso',
   *   minPrice: 3000,
   *   maxPrice: 5000,
   *   page: 1,
   *   limit: 20
   * })
   * ```
   */
  getMenus: async (filters?: MenuFilterOptions): Promise<MenuListResponse> => {
    const params = new URLSearchParams()
    
    if (filters?.category) params.append('category', filters.category)
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm)
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.includeInactive) params.append('includeInactive', 'true')
    
    const response = await api.get<ApiResponse<MenuListResponse>>(
      `/api/v1/menus${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data.data
  },

  /**
   * 메뉴 상세 조회
   */
  getMenuById: async (id: string): Promise<Menu> => {
    const response = await api.get<ApiResponse<Menu>>(`/api/v1/menus/${id}`)
    return response.data.data
  },

  /**
   * 메뉴 생성 (관리자 전용)
   * 
   * @example
   * ```typescript
   * const menu = await menuService.createMenu({
   *   cafeId: 'CAFE-001',
   *   name: '카페라떼',
   *   price: 4500,
   *   description: '부드러운 우유와 에스프레소',
   *   category: 'latte',
   *   stockQuantity: 100
   * })
   * ```
   */
  createMenu: async (data: CreateMenuRequest): Promise<Menu> => {
    const response = await api.post<ApiResponse<Menu>>('/api/v1/menus', data)
    return response.data.data
  },

  /**
   * 메뉴 수정 (관리자 전용)
   * 
   * @example
   * ```typescript
   * const menu = await menuService.updateMenu('MENU-001', {
   *   price: 4000,
   *   stockQuantity: 75,
   *   isActive: true
   * })
   * ```
   */
  updateMenu: async (id: string, data: UpdateMenuRequest): Promise<Menu> => {
    const response = await api.put<ApiResponse<Menu>>(`/api/v1/menus/${id}`, data)
    return response.data.data
  },

  /**
   * 메뉴 삭제 (관리자 전용)
   * 소프트 삭제로 처리됨
   */
  deleteMenu: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/menus/${id}`)
  },

  /**
   * 재고 수정 (관리자 전용)
   * 
   * @example
   * ```typescript
   * // 재고를 50개로 설정
   * await menuService.updateStock('MENU-001', {
   *   stockQuantity: 50,
   *   operation: 'set'
   * })
   * 
   * // 재고 10개 증가
   * await menuService.updateStock('MENU-001', {
   *   stockQuantity: 10,
   *   operation: 'increase'
   * })
   * ```
   */
  updateStock: async (
    id: string, 
    data: UpdateStockRequest
  ): Promise<UpdateStockResponse> => {
    const response = await api.patch<ApiResponse<UpdateStockResponse>>(
      `/api/v1/menus/${id}/stock`,
      data
    )
    return response.data.data
  }
}
