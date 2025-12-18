// 토큰 관리 유틸리티
export const tokenManager = {
  // 토큰 가져오기
  get: (): string | null => {
    return localStorage.getItem('token')
  },
  
  // 토큰 저장
  set: (token: string): void => {
    localStorage.setItem('token', token)
  },
  
  // 토큰 제거
  remove: (): void => {
    localStorage.removeItem('token')
  },
  
  // 토큰 유효성 검사 (간단한 형식 체크)
  isValid: (): boolean => {
    const token = tokenManager.get()
    if (!token) return false
    
    try {
      // JWT 형식 체크 (3개 파트로 구성)
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      // Base64 디코딩 시도
      const payload = JSON.parse(atob(parts[1]))
      
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
  
  // 토큰에서 페이로드 추출
  getPayload: (): any | null => {
    const token = tokenManager.get()
    if (!token) return null
    
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      return JSON.parse(atob(parts[1]))
    } catch {
      return null
    }
  }
}
