import { z } from 'zod'

/**
 * Common error response format
 */
export interface ErrorResponse {
  success: false
  message: string
  code: string
  errors?: Array<{
    field: string
    message: string
  }>
}

/**
 * Common success response format
 */
export interface SuccessResponse<T = unknown> {
  success: true
  data: T
}

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid UUID format')

/**
 * ISO date string validation schema
 */
export const isoDateSchema = z.string().datetime('Invalid ISO date format')

