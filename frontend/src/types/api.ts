// API 응답 래퍼
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// API 에러
export interface ApiError {
  status: number
  message: string
  code?: string
}
