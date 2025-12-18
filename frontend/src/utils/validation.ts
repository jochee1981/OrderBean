// 이메일 유효성 검사
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 비밀번호 유효성 검사 (최소 8자, 영문/숫자 포함)
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false
  
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  return hasLetter && hasNumber
}

// 비밀번호 강도 체크
export type PasswordStrength = 'weak' | 'medium' | 'strong'

export const getPasswordStrength = (password: string): PasswordStrength => {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
}

// 전화번호 유효성 검사 (한국 형식)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
  return phoneRegex.test(phone)
}

// 숫자만 포함 여부
export const isNumericOnly = (value: string): boolean => {
  return /^\d+$/.test(value)
}
