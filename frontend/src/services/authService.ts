import api from '@/lib/api'
import type { User, UserRole } from '@/types/auth'
import type { ApiResponse } from '@/types/api'
import { parseUserRole } from '@/types/auth'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
}

interface RegisterRequest {
  email: string
  password: string
  name: string
}

export const authService = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    )
    return response.data.data
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/auth/register',
      data
    )
    return response.data.data
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  // 현재 사용자 정보 조회
  me: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  },

  // 토큰 검증
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.success
    } catch {
      return false
    }
  }
}
