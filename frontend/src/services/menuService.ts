import api from '@/lib/api'
import type { Menu, CreateMenuRequest, UpdateMenuRequest } from '@/types/menu'
import type { ApiResponse } from '@/types/api'

export const menuService = {
  // 메뉴 목록 조회
  getMenus: async (): Promise<Menu[]> => {
    const response = await api.get<ApiResponse<Menu[]>>('/menus')
    return response.data.data
  },

  // 메뉴 상세 조회
  getMenuById: async (id: string): Promise<Menu> => {
    const response = await api.get<ApiResponse<Menu>>(`/menus/${id}`)
    return response.data.data
  },

  // 메뉴 생성 (관리자)
  createMenu: async (data: CreateMenuRequest): Promise<Menu> => {
    const response = await api.post<ApiResponse<Menu>>('/menus', data)
    return response.data.data
  },

  // 메뉴 수정 (관리자)
  updateMenu: async (id: string, data: UpdateMenuRequest): Promise<Menu> => {
    const response = await api.patch<ApiResponse<Menu>>(`/menus/${id}`, data)
    return response.data.data
  },

  // 메뉴 삭제 (관리자)
  deleteMenu: async (id: string): Promise<void> => {
    await api.delete(`/menus/${id}`)
  },

  // 재고 업데이트
  updateStock: async (id: string, stock: number): Promise<Menu> => {
    const response = await api.patch<ApiResponse<Menu>>(
      `/menus/${id}/stock`,
      { stock }
    )
    return response.data.data
  }
}
