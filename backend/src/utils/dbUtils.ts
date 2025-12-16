import { Response } from 'express'
import { isDbConnected } from '../lib/prisma'

/**
 * Check if database is connected and return error response if not
 * Returns true if connected, false if not (and sends error response)
 */
export const checkDbConnection = (res: Response): boolean => {
  if (!isDbConnected()) {
    res.status(503).json({
      success: false,
      code: 'DATABASE_NOT_CONNECTED',
      message: 'Database is not connected. Please install PostgreSQL and run migrations.',
      data: {
        menus: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      },
    })
    return false
  }
  return true
}

/**
 * Handle Prisma database connection errors
 */
export const handleDbError = (error: any, res: Response, next: Function): boolean => {
  if (error.code === 'P1001' || error.code === 'P1000') {
    res.status(503).json({
      success: false,
      code: 'DATABASE_CONNECTION_ERROR',
      message: 'Database connection failed. Please check your database configuration.',
    })
    return true
  }
  next(error)
  return false
}

