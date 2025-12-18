/**
 * 입력 유효성 검사 유틸리티
 * 
 * @module utils/validation
 */

/**
 * 비밀번호 강도
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong'

/**
 * 이메일 유효성 검사
 * 
 * @param email - 검증할 이메일 주소
 * @returns 유효한 이메일이면 true
 * 
 * @example
 * ```typescript
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid-email') // false
 * ```
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 비밀번호 유효성 검사
 * 
 * 최소 8자 이상, 영문자와 숫자를 모두 포함해야 합니다.
 * 
 * @param password - 검증할 비밀번호
 * @returns 유효한 비밀번호면 true
 * 
 * @example
 * ```typescript
 * isValidPassword('password123') // true
 * isValidPassword('short') // false
 * isValidPassword('12345678') // false (숫자만)
 * ```
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false
  
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  return hasLetter && hasNumber
}

/**
 * 비밀번호 강도 체크
 * 
 * 길이, 대소문자, 숫자, 특수문자를 고려하여 강도를 평가합니다.
 * 
 * @param password - 검증할 비밀번호
 * @returns 비밀번호 강도 ('weak', 'medium', 'strong')
 * 
 * @example
 * ```typescript
 * getPasswordStrength('pass') // 'weak'
 * getPasswordStrength('Password123') // 'medium'
 * getPasswordStrength('P@ssw0rd!123') // 'strong'
 * ```
 */
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

/**
 * 전화번호 유효성 검사 (한국 형식)
 * 
 * 010, 011 등의 휴대폰 번호를 검증합니다.
 * 하이픈은 있어도 되고 없어도 됩니다.
 * 
 * @param phone - 검증할 전화번호
 * @returns 유효한 전화번호면 true
 * 
 * @example
 * ```typescript
 * isValidPhoneNumber('010-1234-5678') // true
 * isValidPhoneNumber('01012345678') // true
 * isValidPhoneNumber('02-123-4567') // false
 * ```
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
  return phoneRegex.test(phone)
}

/**
 * 숫자만 포함 여부
 * 
 * @param value - 검증할 문자열
 * @returns 숫자만 포함하면 true
 * 
 * @example
 * ```typescript
 * isNumericOnly('12345') // true
 * isNumericOnly('123abc') // false
 * ```
 */
export const isNumericOnly = (value: string): boolean => {
  return /^\d+$/.test(value)
}

/**
 * 빈 문자열 또는 공백만 있는지 확인
 * 
 * @param value - 검증할 문자열
 * @returns 빈 문자열이거나 공백만 있으면 true
 * 
 * @example
 * ```typescript
 * isEmpty('') // true
 * isEmpty('   ') // true
 * isEmpty('hello') // false
 * ```
 */
export const isEmpty = (value: string): boolean => {
  return value.trim().length === 0
}

/**
 * 최소 길이 검증
 * 
 * @param value - 검증할 문자열
 * @param minLength - 최소 길이
 * @returns 최소 길이 이상이면 true
 * 
 * @example
 * ```typescript
 * isMinLength('hello', 5) // true
 * isMinLength('hi', 5) // false
 * ```
 */
export const isMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

/**
 * 최대 길이 검증
 * 
 * @param value - 검증할 문자열
 * @param maxLength - 최대 길이
 * @returns 최대 길이 이하면 true
 * 
 * @example
 * ```typescript
 * isMaxLength('hello', 10) // true
 * isMaxLength('hello world!!!', 10) // false
 * ```
 */
export const isMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

/**
 * URL 형식 검증
 * 
 * @param url - 검증할 URL
 * @returns 유효한 URL이면 true
 * 
 * @example
 * ```typescript
 * isValidUrl('https://example.com') // true
 * isValidUrl('not-a-url') // false
 * ```
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 숫자 범위 검증
 * 
 * @param value - 검증할 숫자
 * @param min - 최솟값
 * @param max - 최댓값
 * @returns 범위 내에 있으면 true
 * 
 * @example
 * ```typescript
 * isInRange(5, 1, 10) // true
 * isInRange(15, 1, 10) // false
 * ```
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}
