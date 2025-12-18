import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { AppError } from './errorHandler'

/**
 * Request validation middleware using Zod schema
 * 
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Validate request body against schema
      const validated = schema.parse(req.body)
      
      // Replace request body with validated data
      req.body = validated
      
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into standardized error response
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))

        return next(
          new AppError(
            'Validation failed',
            400,
            'VALIDATION_ERROR',
            errors
          )
        )
      }
      
      // Unknown error
      next(error)
    }
  }
}

