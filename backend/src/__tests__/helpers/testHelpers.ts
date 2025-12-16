import { Express } from 'express'
import request from 'supertest'

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

