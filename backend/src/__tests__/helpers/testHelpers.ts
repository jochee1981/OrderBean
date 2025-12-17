import { Express } from 'express'
import request from 'supertest'
import { prisma } from '../../lib/prisma'

/**
 * Create a test user and get auth token
 */
export const createTestUser = async (app: Express, userData?: {
  email?: string
  password?: string
  name?: string
}) => {
  const defaultUser = {
    email: userData?.email || 'test@example.com',
    password: userData?.password || 'Test1234!',
    name: userData?.name || 'Test User',
  }

  // Signup
  const signupRes = await request(app)
    .post('/api/v1/auth/signup')
    .send(defaultUser)

  if (signupRes.status === 201) {
    return signupRes.body.data.token
  }

  // If user exists, try login
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: defaultUser.email,
      password: defaultUser.password,
    })

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

