import request from 'supertest'
import app from './app.test'

describe('Auth Controller', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: `test-${Date.now()}@example.com`,
        password: 'Test1234!',
        name: 'Test User',
      }

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('user')
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.name).toBe(userData.name)
      expect(response.body.data.user).not.toHaveProperty('password')
    })

    it('should return 400 when email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'Test1234!',
        name: 'Test User',
      }

      // First signup
      await request(app)
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(201)

      // Try to signup again with same email
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 400 when required fields are missing', async () => {
      const invalidData = {
        email: 'test@example.com',
        // password missing
      }

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(invalidData)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 400 when password is too weak', async () => {
      const weakPasswordData = {
        email: 'test@example.com',
        password: '123', // too short
        name: 'Test User',
      }

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(weakPasswordData)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('POST /api/v1/auth/login', () => {
    let testUser: { email: string; password: string; name: string }

    beforeAll(async () => {
      // Create a test user for login tests
      testUser = {
        email: `login-test-${Date.now()}@example.com`,
        password: 'Test1234!',
        name: 'Login Test User',
      }

      await request(app)
        .post('/api/v1/auth/signup')
        .send(testUser)
        .expect(201)
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('user')
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data.user.email).toBe(testUser.email)
    })

    it('should return 401 with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test1234!',
        })
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          // password missing
        })
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })
  })

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // This test will fail until refresh token logic is implemented
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('token')
    })
  })
})

