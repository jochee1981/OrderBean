import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { tokenManager } from '@/utils/token'
import { ROUTES } from '@/constants/routes'
import type { User } from '@/types/auth'
import { parseUserRole } from '@/types/auth'

export const useAuth = () => {
  const { user, setUser, setToken, logout: storeLogout } = useAuthStore()
  const navigate = useNavigate()

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      
      // 역할 파싱
      const parsedUser: User = {
        ...response.user,
        role: parseUserRole(response.user.role as any)
      }
      
      setUser(parsedUser)
      setToken(response.token)
      tokenManager.set(response.token)
      
      // 역할에 따라 리다이렉트
      if (parsedUser.role === 'ADMIN') {
        navigate(ROUTES.ADMIN.DASHBOARD)
      } else {
        navigate(ROUTES.HOME)
      }
      
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '로그인에 실패했습니다.'
      }
    }
  }

  // 로그아웃
  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // 에러가 발생해도 로컬 상태는 정리
    } finally {
      storeLogout()
      tokenManager.remove()
      navigate(ROUTES.HOME)
    }
  }

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    try {
      const userData = await authService.me()
      setUser({
        ...userData,
        role: parseUserRole(userData.role as any)
      })
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  // 인증 여부 확인
  const isAuthenticated = (): boolean => {
    return !!user && tokenManager.isValid()
  }

  // 관리자 여부 확인
  const isAdmin = (): boolean => {
    return user?.role === 'ADMIN'
  }

  return {
    user,
    login,
    logout,
    refreshUser,
    isAuthenticated,
    isAdmin
  }
}
