import { Express } from 'express'
import request from 'supertest'
import { prisma } from '../../lib/prisma'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * Create a test user and get auth token
 */
export const createTestUser = async (app: Express, userData?: {
  email?: string
  password?: string
  name?: string
  role?: 'CUSTOMER' | 'ADMIN'
}) => {
  const defaultUser = {
    email: userData?.email || `test-${Date.now()}@example.com`,
    password: userData?.password || 'Test1234!',
    name: userData?.name || 'Test User',
    role: userData?.role || 'CUSTOMER',
  }

  // If admin role is requested, create directly in DB
  if (defaultUser.role === 'ADMIN') {
    try {
      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email: defaultUser.email },
      })

      if (!user) {
        // Create admin user directly
        const hashedPassword = await bcrypt.hash(defaultUser.password, 10)
        user = await prisma.user.create({
          data: {
            email: defaultUser.email,
            password_hash: hashedPassword,
            name: defaultUser.name,
            role: UserRole.ADMIN,
          },
        })
      } else {
        // Update existing user to admin
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: UserRole.ADMIN },
        })
      }

      // Generate token
      const secret = process.env.JWT_SECRET || 'test_jwt_secret_key'
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: '24h' }
      )

      return token
    } catch (error) {
      // Fallback to signup if DB operation fails
      console.warn('Failed to create admin user directly, using signup:', error)
    }
  }

  // Signup (creates CUSTOMER by default)
  const signupRes = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: defaultUser.email,
      password: defaultUser.password,
      name: defaultUser.name,
    })

  if (signupRes.status === 201) {
    // If admin was requested but signup created customer, update role
    if (defaultUser.role === 'ADMIN') {
      try {
        const user = await prisma.user.findUnique({
          where: { email: defaultUser.email },
        })
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: UserRole.ADMIN },
          })
          // Regenerate token with admin role
          const secret = process.env.JWT_SECRET || 'test_jwt_secret_key'
          return jwt.sign(
            { id: user.id, email: user.email, role: UserRole.ADMIN },
            secret,
            { expiresIn: '24h' }
          )
        }
      } catch (error) {
        console.warn('Failed to update user role to admin:', error)
      }
    }
    return signupRes.body.data.token
  }

  // If user exists, try login
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: defaultUser.email,
      password: defaultUser.password,
    })

  // If admin was requested, update role
  if (defaultUser.role === 'ADMIN' && loginRes.status === 200) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: defaultUser.email },
      })
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: UserRole.ADMIN },
        })
        // Regenerate token with admin role
        const secret = process.env.JWT_SECRET || 'test_jwt_secret_key'
        return jwt.sign(
          { id: user.id, email: user.email, role: UserRole.ADMIN },
          secret,
          { expiresIn: '24h' }
        )
      }
    } catch (error) {
      console.warn('Failed to update user role to admin:', error)
    }
  }

  return loginRes.body.data.token
}

/**
 * Get auth headers with token
 */
export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
})

/**
 * Clean up order-related test data
 * This function deletes orders, order_items, and order_item_options
 * Note: This is a basic cleanup - more sophisticated isolation can be added in Phase 2
 */
export const cleanupOrderData = async () => {
  try {
    // Delete in reverse order of dependencies
    await prisma.orderItemOption.deleteMany({})
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
  } catch (error) {
    // Ignore errors if database is not connected
    // This allows tests to run even without a database connection
    if (error instanceof Error && error.message.includes('connect')) {
      console.warn('⚠️  Database not connected, skipping cleanup')
      return
    }
    throw error
  }
}

/**
 * Clean up all test data (users, orders, etc.)
 * Use with caution - this deletes all test data
 */
export const cleanupAllTestData = async () => {
  try {
    await cleanupOrderData()
    // Note: We don't delete users as they might be needed across tests
    // In Phase 2, we can implement more sophisticated isolation
  } catch (error) {
    if (error instanceof Error && error.message.includes('connect')) {
      console.warn('⚠️  Database not connected, skipping cleanup')
      return
    }
    throw error
  }
}

