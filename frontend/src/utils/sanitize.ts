/**
 * XSS(Cross-Site Scripting) 방지 유틸리티
 * 
 * 사용자 입력을 안전하게 처리하여 XSS 공격을 방지합니다.
 * 
 * @module utils/sanitize
 */

/**
 * HTML 특수 문자를 엔티티로 변환
 * 
 * @param str - 변환할 문자열
 * @returns 안전하게 변환된 문자열
 * 
 * @example
 * ```typescript
 * escapeHtml('<script>alert("xss")</script>')
 * // "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 * ```
 */
export const escapeHtml = (str: string): string => {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  }
  
  return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char)
}

/**
 * HTML 엔티티를 일반 문자로 변환
 * 
 * @param str - 변환할 문자열
 * @returns 디코딩된 문자열
 * 
 * @example
 * ```typescript
 * unescapeHtml('&lt;div&gt;Hello&lt;/div&gt;')
 * // "<div>Hello</div>"
 * ```
 */
export const unescapeHtml = (str: string): string => {
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/'
  }
  
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, (entity) => htmlEntities[entity] || entity)
}

/**
 * 스크립트 태그 제거
 * 
 * @param str - 처리할 문자열
 * @returns 스크립트 태그가 제거된 문자열
 * 
 * @example
 * ```typescript
 * stripScripts('<script>alert("xss")</script>Hello')
 * // "Hello"
 * ```
 */
export const stripScripts = (str: string): string => {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

/**
 * 위험한 HTML 태그 제거
 * 
 * @param str - 처리할 문자열
 * @returns 위험한 태그가 제거된 문자열
 * 
 * @example
 * ```typescript
 * stripDangerousTags('<iframe src="evil.com"></iframe>Hello')
 * // "Hello"
 * ```
 */
export const stripDangerousTags = (str: string): string => {
  const dangerousTags = [
    'script',
    'iframe',
    'object',
    'embed',
    'link',
    'style',
    'form',
    'input',
    'button',
    'textarea'
  ]
  
  const pattern = new RegExp(
    `<(${dangerousTags.join('|')})\\b[^<]*(?:(?!<\\/\\1>)<[^<]*)*<\\/\\1>`,
    'gi'
  )
  
  return str.replace(pattern, '')
}

/**
 * 안전한 텍스트 추출
 * 
 * HTML 태그를 모두 제거하고 순수 텍스트만 추출합니다.
 * 
 * @param str - 처리할 문자열
 * @returns 순수 텍스트
 * 
 * @example
 * ```typescript
 * stripTags('<p>Hello <strong>World</strong>!</p>')
 * // "Hello World!"
 * ```
 */
export const stripTags = (str: string): string => {
  return str.replace(/<[^>]*>/g, '')
}

/**
 * URL 검증 및 안전성 확인
 * 
 * @param url - 검증할 URL
 * @returns URL이 안전하면 true
 * 
 * @example
 * ```typescript
 * isSafeUrl('https://example.com') // true
 * isSafeUrl('javascript:alert(1)') // false
 * ```
 */
export const isSafeUrl = (url: string): boolean => {
  // 위험한 프로토콜 차단
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = url.toLowerCase().trim()
  
  return !dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))
}

/**
 * 안전한 URL 생성
 * 
 * @param url - 처리할 URL
 * @param fallback - URL이 안전하지 않을 때 대체 URL
 * @returns 안전한 URL
 * 
 * @example
 * ```typescript
 * sanitizeUrl('javascript:alert(1)', '#')
 * // "#"
 * 
 * sanitizeUrl('https://example.com', '#')
 * // "https://example.com"
 * ```
 */
export const sanitizeUrl = (url: string, fallback: string = '#'): string => {
  return isSafeUrl(url) ? url : fallback
}

/**
 * 사용자 입력 텍스트 전처리
 * 
 * 앞뒤 공백 제거 및 연속된 공백 정규화
 * 
 * @param str - 처리할 문자열
 * @returns 정규화된 문자열
 * 
 * @example
 * ```typescript
 * normalizeWhitespace('  Hello   World  ')
 * // "Hello World"
 * ```
 */
export const normalizeWhitespace = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ')
}

/**
 * SQL 인젝션 방지를 위한 문자열 이스케이프
 * 
 * 주의: 이 함수는 기본적인 보호만 제공합니다.
 * 실제로는 Prepared Statements를 사용해야 합니다.
 * 
 * @param str - 처리할 문자열
 * @returns 이스케이프된 문자열
 */
export const escapeSql = (str: string): string => {
  return str.replace(/['";\\]/g, '\\$&')
}

/**
 * 파일명 안전성 검증
 * 
 * 디렉토리 탐색 공격을 방지합니다.
 * 
 * @param filename - 검증할 파일명
 * @returns 파일명이 안전하면 true
 * 
 * @example
 * ```typescript
 * isSafeFilename('document.pdf') // true
 * isSafeFilename('../../../etc/passwd') // false
 * ```
 */
export const isSafeFilename = (filename: string): boolean => {
  // 디렉토리 탐색 패턴 차단
  const dangerousPatterns = [
    /\.\./,  // ..
    /\//,    // /
    /\\/,    // \
    /:/,     // :
    /\*/,    // *
    /\?/,    // ?
    /"/,     // "
    /</,     // <
    />/,     // >
    /\|/     // |
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(filename))
}

/**
 * JSON 안전 파싱
 * 
 * JSON 파싱 실패 시 기본값 반환
 * 
 * @param jsonString - JSON 문자열
 * @param fallback - 파싱 실패 시 반환할 기본값
 * @returns 파싱된 객체 또는 기본값
 * 
 * @example
 * ```typescript
 * safeJsonParse('{"name":"John"}', {})
 * // { name: "John" }
 * 
 * safeJsonParse('invalid json', { error: true })
 * // { error: true }
 * ```
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T
  } catch {
    return fallback
  }
}
