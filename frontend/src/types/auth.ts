// 사용자 역할 enum
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

// 사용자 인터페이스
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

// 인증 상태
export interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

// 역할 확인 유틸리티
export const isAdmin = (user: User | null): boolean => {
  return user?.role === UserRole.ADMIN
}

export const isCustomer = (user: User | null): boolean => {
  return user?.role === UserRole.CUSTOMER
}

// 역할 문자열을 enum으로 변환
export const parseUserRole = (role: string): UserRole => {
  const upperRole = role.toUpperCase()
  if (upperRole === 'ADMIN') return UserRole.ADMIN
  return UserRole.CUSTOMER
}
