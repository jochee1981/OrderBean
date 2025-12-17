import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return next(new AppError('User already exists', 400))
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        name,
        role: UserRole.CUSTOMER,
      },
    })

    // Generate token
    const token = generateToken(user.id, user.email, user.role)

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // Returns 'CUSTOMER' or 'ADMIN' from Prisma enum
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return next(new AppError('Invalid credentials', 401))
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return next(new AppError('Invalid credentials', 401))
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // Returns 'CUSTOMER' or 'ADMIN' from Prisma enum
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can add token blacklisting here if needed
  res.json({ success: true, message: 'Logged out successfully' })
}

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header or request body
    let token: string | undefined

    // Try to get from Authorization header first
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else if (req.body && req.body.token) {
      // Fallback to body
      token = req.body.token
    }

    if (!token) {
      return next(new AppError('Token is required', 400, 'TOKEN_REQUIRED'))
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }

    // Verify token (allow expired tokens for refresh)
    let decoded: { id: string; email: string; role: string }
    try {
      decoded = jwt.verify(token, secret, {
        ignoreExpiration: true, // Allow expired tokens for refresh
      }) as { id: string; email: string; role: string }
    } catch (error) {
      return next(new AppError('Invalid token', 401, 'INVALID_TOKEN'))
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    })

    if (!user) {
      return next(new AppError('User not found', 404, 'USER_NOT_FOUND'))
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return next(new AppError('User account is not active', 403, 'ACCOUNT_INACTIVE'))
    }

    // Generate new token
    const newToken = generateToken(user.id, user.email, user.role)

    res.json({
      success: true,
      data: {
        token: newToken,
      },
    })
  } catch (error) {
    next(error)
  }
}

function generateToken(userId: string, email: string, role: string): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '24h'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(
    { id: userId, email, role },
    secret,
    { expiresIn } as any
  ) as string
}

