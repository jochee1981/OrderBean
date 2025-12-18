// API 기본 URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  
  // 메뉴
  MENUS: {
    LIST: '/menus',
    DETAIL: (id: string) => `/menus/${id}`,
    UPDATE_STOCK: (id: string) => `/menus/${id}/stock`,
    CREATE: '/menus',
    UPDATE: (id: string) => `/menus/${id}`,
    DELETE: (id: string) => `/menus/${id}`
  },
  
  // 주문
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    MY_ORDERS: '/orders/me'
  },
  
  // 관리자
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ORDERS: '/admin/orders',
    STATS: '/admin/stats'
  }
} as const
