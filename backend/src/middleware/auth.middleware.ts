import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401)
    }

    const token = authHeader.substring(7)
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token, secret) as {
      id: string
      email: string
      role: string
    }

    req.user = decoded
    next()
  } catch (error) {
    next(new AppError('Unauthorized', 401))
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'))
    }

    // Normalize role comparison (handle both 'ADMIN' and 'admin')
    const userRole = req.user.role.toUpperCase()
    const normalizedRoles = roles.map(r => r.toUpperCase())
    
    if (!normalizedRoles.includes(userRole)) {
      // Provide more specific error message
      const requiredRoles = roles.join(' or ')
      return next(
        new AppError(
          `Access denied. ${requiredRoles} role required.`,
          403,
          'FORBIDDEN'
        )
      )
    }

    next()
  }
}

