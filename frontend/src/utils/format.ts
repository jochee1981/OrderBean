/**
 * 날짜 및 숫자 포맷팅 유틸리티
 * 
 * @module utils/format
 */

/**
 * 날짜를 한국어 형식으로 포맷팅
 * 
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 한국어 형식의 날짜 문자열 (예: "2024년 12월 18일 오후 3:45")
 * 
 * @example
 * ```typescript
 * formatDate('2024-12-18T15:45:00')
 * // "2024년 12월 18일 오후 3:45"
 * ```
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 간단한 날짜 포맷 (월/일 시:분)
 * 
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 간략한 형식의 날짜 문자열 (예: "12월 18일 15:45")
 * 
 * @example
 * ```typescript
 * formatDateShort('2024-12-18T15:45:00')
 * // "12월 18일 15:45"
 * ```
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}월 ${day}일 ${hours}:${minutes}`
}

/**
 * 가격을 한국 원화 형식으로 포맷팅
 * 
 * @param price - 금액 (숫자)
 * @returns 천단위 콤마가 포함된 가격 문자열 (예: "5,000원")
 * 
 * @example
 * ```typescript
 * formatPrice(5000)
 * // "5,000원"
 * ```
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()}원`
}

/**
 * 숫자를 천단위 콤마로 포맷팅
 * 
 * @param num - 숫자
 * @returns 천단위 콤마가 포함된 문자열
 * 
 * @example
 * ```typescript
 * formatNumber(1234567)
 * // "1,234,567"
 * ```
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

/**
 * 상대 시간 포맷 (예: "5분 전", "1시간 전")
 * 
 * 현재 시간 기준으로 얼마나 지났는지 표시합니다.
 * 
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 상대 시간 문자열
 * 
 * @example
 * ```typescript
 * formatRelativeTime('2024-12-18T15:40:00') // 현재가 15:45일 때
 * // "5분 전"
 * ```
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  
  return formatDate(dateString)
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 포맷팅
 * 
 * @param bytes - 바이트 단위의 파일 크기
 * @returns 사람이 읽기 쉬운 형식의 문자열 (예: "1.5 MB")
 * 
 * @example
 * ```typescript
 * formatFileSize(1536000)
 * // "1.5 MB"
 * ```
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 퍼센트를 포맷팅
 * 
 * @param value - 값
 * @param total - 전체 값
 * @param decimals - 소수점 자릿수 (기본값: 0)
 * @returns 퍼센트 문자열 (예: "75%")
 * 
 * @example
 * ```typescript
 * formatPercent(75, 100)
 * // "75%"
 * 
 * formatPercent(1, 3, 2)
 * // "33.33%"
 * ```
 */
export const formatPercent = (value: number, total: number, decimals: number = 0): string => {
  if (total === 0) return '0%'
  const percent = (value / total) * 100
  return `${percent.toFixed(decimals)}%`
}
