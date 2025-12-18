/**
 * JWT 토큰 관리 유틸리티
 * 
 * localStorage를 사용하여 인증 토큰을 관리합니다.
 * 
 * @module utils/token
 */

/**
 * JWT 토큰 페이로드 인터페이스
 */
export interface TokenPayload {
  /** 사용자 ID */
  userId?: string
  /** 이메일 */
  email?: string
  /** 역할 */
  role?: string
  /** 발급 시간 (Unix timestamp) */
  iat?: number
  /** 만료 시간 (Unix timestamp) */
  exp?: number
}

/**
 * 토큰 관리자
 * 
 * JWT 토큰의 저장, 조회, 검증 등을 담당합니다.
 */
export const tokenManager = {
  /**
   * 토큰 가져오기
   * 
   * @returns 저장된 토큰 또는 null
   * 
   * @example
   * ```typescript
   * const token = tokenManager.get()
   * ```
   */
  get: (): string | null => {
    return localStorage.getItem('token')
  },
  
  /**
   * 토큰 저장
   * 
   * @param token - 저장할 JWT 토큰
   * 
   * @example
   * ```typescript
   * tokenManager.set('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
   * ```
   */
  set: (token: string): void => {
    localStorage.setItem('token', token)
  },
  
  /**
   * 토큰 제거
   * 
   * 로그아웃 시 토큰을 삭제합니다.
   * 
   * @example
   * ```typescript
   * tokenManager.remove()
   * ```
   */
  remove: (): void => {
    localStorage.removeItem('token')
  },
  
  /**
   * 토큰 유효성 검사
   * 
   * JWT 형식과 만료 시간을 확인합니다.
   * 
   * @returns 토큰이 유효하면 true
   * 
   * @example
   * ```typescript
   * if (tokenManager.isValid()) {
   *   // 토큰이 유효함
   * }
   * ```
   */
  isValid: (): boolean => {
    const token = tokenManager.get()
    if (!token) return false
    
    try {
      // JWT 형식 체크 (3개 파트로 구성)
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      // Base64 디코딩 시도
      const payload = JSON.parse(atob(parts[1])) as TokenPayload
      
      // 만료 시간 체크
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000)
        return payload.exp > now
      }
      
      return true
    } catch {
      return false
    }
  },
  
  /**
   * 토큰에서 페이로드 추출
   * 
   * JWT 토큰의 페이로드 부분을 디코딩합니다.
   * 
   * @returns 페이로드 객체 또는 null
   * 
   * @example
   * ```typescript
   * const payload = tokenManager.getPayload()
   * if (payload) {
   *   console.log('User ID:', payload.userId)
   * }
   * ```
   */
  getPayload: (): TokenPayload | null => {
    const token = tokenManager.get()
    if (!token) return null
    
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      return JSON.parse(atob(parts[1])) as TokenPayload
    } catch {
      return null
    }
  },
  
  /**
   * 토큰 만료까지 남은 시간 (초)
   * 
   * @returns 남은 시간 (초) 또는 null
   * 
   * @example
   * ```typescript
   * const remaining = tokenManager.getTimeRemaining()
   * if (remaining && remaining < 300) {
   *   // 5분 미만 남음 - 토큰 갱신 필요
   * }
   * ```
   */
  getTimeRemaining: (): number | null => {
    const payload = tokenManager.getPayload()
    if (!payload?.exp) return null
    
    const now = Math.floor(Date.now() / 1000)
    return payload.exp - now
  }
}
