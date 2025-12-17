import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  statusCode?: number
  code?: string
  errors?: Array<{ field: string; message: string }>

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.errors = errors
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  const response: {
    success: false
    code: string
    message: string
    errors?: Array<{ field: string; message: string }>
    timestamp: string
    requestId: string
  } = {
    success: false,
    code: err.code || 'INTERNAL_ERROR',
    message,
    timestamp: new Date().toISOString(),
    requestId: (req.headers['x-request-id'] as string) || 'unknown',
  }

  // Include validation errors if present
  if (err.errors && err.errors.length > 0) {
    response.errors = err.errors
  }

  res.status(statusCode).json(response)
}

