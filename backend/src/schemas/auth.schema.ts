import { z } from 'zod'

/**
 * Password validation schema
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

/**
 * Email validation schema
 */
const emailSchema = z.string().email('Invalid email format')

/**
 * Signup request schema
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
})

/**
 * Login request schema
 * Note: Password policy is not applied to login (user already has a password)
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Refresh token request schema
 * Token can be provided in body or will be read from Authorization header
 */
export const refreshSchema = z.object({
  token: z.string().optional(), // Optional, will try to get from header if not provided
})

/**
 * Type inference for request schemas
 */
export type SignupRequest = z.infer<typeof signupSchema>
export type LoginRequest = z.infer<typeof loginSchema>
export type RefreshRequest = z.infer<typeof refreshSchema>

