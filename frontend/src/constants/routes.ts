// 애플리케이션 라우트
export const ROUTES = {
  // 공통
  HOME: '/',
  LOGIN: '/login',
  
  // 고객
  CUSTOMER: {
    MENU: '/menu',
    ORDER: '/order',
    ORDER_HISTORY: '/orders',
    ORDER_TRACKING: (id: string) => `/orders/${id}`
  },
  
  // 관리자
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    MENUS: '/admin/menus',
    ORDERS: '/admin/orders'
  }
} as const

// 라우트 경로만 추출 (타입 가드용)
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  MENU: '/menu',
  ORDER: '/order',
  ORDER_HISTORY: '/orders',
  ORDER_TRACKING: '/orders/:id',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MENUS: '/admin/menus',
  ADMIN_ORDERS: '/admin/orders'
} as const
