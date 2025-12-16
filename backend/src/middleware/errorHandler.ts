import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  statusCode?: number
  code?: string

  constructor(message: string, statusCode?: number, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
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

  res.status(statusCode).json({
    success: false,
    code: err.code || 'INTERNAL_ERROR',
    message,
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown',
  })
}

