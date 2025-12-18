import api from '@/lib/api'
import type { ApiResponse } from '@/types/api'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  preparingOrders: number
  readyOrders: number
  completedOrders: number
  totalRevenue: number
  todayOrders: number
  todayRevenue: number
}

export const adminService = {
  // 대시보드 통계 조회
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>(
      '/admin/dashboard'
    )
    return response.data.data
  },

  // 일별 통계 조회
  getDailyStats: async (
    startDate: string,
    endDate: string
  ): Promise<any[]> => {
    const response = await api.get('/admin/stats/daily', {
      params: { startDate, endDate }
    })
    return response.data.data
  },

  // 인기 메뉴 조회
  getPopularMenus: async (limit: number = 10): Promise<any[]> => {
    const response = await api.get('/admin/stats/popular-menus', {
      params: { limit }
    })
    return response.data.data
  }
}
