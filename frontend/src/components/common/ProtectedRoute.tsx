import { ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { UserRole } from '@/types/auth'
import { ROUTES } from '@/constants/routes'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
  requireAuth?: boolean
}

/**
 * 보호된 라우트 컴포넌트
 * - 인증이 필요한 페이지 보호
 * - 특정 역할(관리자)이 필요한 페이지 보호
 */
export default function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true
}: ProtectedRouteProps) {
  const { user } = useAuthStore()
  const location = useLocation()

  // 인증이 필요하지만 로그인하지 않은 경우
  if (requireAuth && !user) {
    // 현재 위치를 저장하여 로그인 후 돌아올 수 있도록
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // 특정 역할이 필요하지만 권한이 없는 경우
  if (requiredRole && user?.role !== requiredRole) {
    // 고객이 관리자 페이지 접근 시 홈으로 리다이렉트
    return <Navigate to={ROUTES.HOME} replace />
  }

  // 모든 검사를 통과하면 자식 컴포넌트 렌더링
  return <>{children}</>
}

/**
 * 관리자 전용 라우트 컴포넌트
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * 인증된 사용자만 접근 가능한 라우트 (역할 무관)
 */
export function AuthenticatedRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true}>
      {children}
    </ProtectedRoute>
  )
}
