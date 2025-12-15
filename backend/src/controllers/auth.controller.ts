import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
        role: 'customer',
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
          role: user.role,
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
          role: user.role,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
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
  // Implement token refresh logic
  res.json({ success: true, message: 'Token refreshed' })
}

function generateToken(userId: string, email: string, role: string): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  return jwt.sign(
    { id: userId, email, role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
}

