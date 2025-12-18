/**
 * API 응답 래퍼
 * 
 * 모든 API 응답의 표준 형식
 * 
 * @template T - 응답 데이터의 타입
 * 
 * @example
 * ```typescript
 * const response: ApiResponse<Menu[]> = {
 *   success: true,
 *   data: [{ id: '1', name: 'Americano', ... }],
 *   message: '메뉴 목록을 가져왔습니다.'
 * }
 * ```
 */
export interface ApiResponse<T> {
  /** 요청 성공 여부 */
  success: boolean
  /** 응답 데이터 */
  data: T
  /** 성공 메시지 (optional) */
  message?: string
  /** 에러 메시지 (optional) */
  error?: string
}

/**
 * 페이지네이션 응답
 * 
 * 페이지네이션이 적용된 목록 조회 응답
 * 
 * @template T - 목록 아이템의 타입
 * 
 * @example
 * ```typescript
 * const response: PaginatedResponse<Menu> = {
 *   data: [...],
 *   total: 100,
 *   page: 1,
 *   limit: 20,
 *   totalPages: 5
 * }
 * ```
 */
export interface PaginatedResponse<T> {
  /** 현재 페이지의 데이터 */
  data: T[]
  /** 전체 아이템 개수 */
  total: number
  /** 현재 페이지 번호 (1-based) */
  page: number
  /** 페이지당 아이템 개수 */
  limit: number
  /** 전체 페이지 수 */
  totalPages: number
}

/**
 * API 에러
 * 
 * API 요청 실패 시 에러 정보
 */
export interface ApiError {
  /** HTTP 상태 코드 */
  status: number
  /** 에러 메시지 */
  message: string
  /** 에러 코드 (optional) */
  code?: string
  /** 추가 에러 상세 정보 (optional) */
  details?: Record<string, unknown>
}

/**
 * API 요청 옵션
 * 
 * API 호출 시 사용할 수 있는 공통 옵션
 */
export interface ApiRequestOptions {
  /** 요청 헤더 */
  headers?: Record<string, string>
  /** 요청 타임아웃 (ms) */
  timeout?: number
  /** 재시도 횟수 */
  retries?: number
  /** 에러 핸들러 비활성화 */
  skipErrorHandler?: boolean
}
