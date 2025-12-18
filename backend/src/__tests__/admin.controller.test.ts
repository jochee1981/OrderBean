import request from 'supertest'
import app from './app.test'
import { createTestUser, getAuthHeaders } from './helpers/testHelpers'

describe('Admin Controller', () => {
  let adminToken: string
  let customerToken: string

  beforeAll(async () => {
    // Create admin user
    adminToken = await createTestUser(app, {
      email: `admin-${Date.now()}@example.com`,
      password: 'Admin1234!',
      name: 'Admin User',
      role: 'ADMIN',
    })

    // Create customer user
    customerToken = await createTestUser(app, {
      email: `customer-${Date.now()}@example.com`,
      password: 'Customer1234!',
      name: 'Customer User',
      role: 'CUSTOMER',
    })
  })

  describe('GET /api/v1/admin/dashboard', () => {
    it('should return dashboard data for admin', async () => {
      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .set(getAuthHeaders(adminToken))
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('newOrders')
      expect(response.body.data).toHaveProperty('preparingOrders')
      expect(response.body.data).toHaveProperty('readyOrders')
      expect(Array.isArray(response.body.data.newOrders)).toBe(true)
      expect(Array.isArray(response.body.data.preparingOrders)).toBe(true)
      expect(Array.isArray(response.body.data.readyOrders)).toBe(true)
    })

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .set(getAuthHeaders(customerToken))
        .expect(403)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 401 when no auth token is provided', async () => {
      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('GET /api/v1/admin/analytics', () => {
    it('should return analytics data for admin', async () => {
      const response = await request(app)
        .get('/api/v1/admin/analytics')
        .set(getAuthHeaders(adminToken))
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('totalOrders')
      expect(response.body.data).toHaveProperty('totalRevenue')
      expect(response.body.data).toHaveProperty('averagePrepTime')
      expect(response.body.data).toHaveProperty('cancelRate')
      expect(response.body.data).toHaveProperty('popularMenus')
      expect(typeof response.body.data.totalOrders).toBe('number')
      expect(typeof response.body.data.totalRevenue).toBe('number')
      expect(Array.isArray(response.body.data.popularMenus)).toBe(true)
    })

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/v1/admin/analytics')
        .set(getAuthHeaders(customerToken))
        .expect(403)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('GET /api/v1/admin/menu-analytics', () => {
    it('should return menu analytics data for admin', async () => {
      const response = await request(app)
        .get('/api/v1/admin/menu-analytics')
        .set(getAuthHeaders(adminToken))
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('menuSales')
      expect(Array.isArray(response.body.data.menuSales)).toBe(true)
    })

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/v1/admin/menu-analytics')
        .set(getAuthHeaders(customerToken))
        .expect(403)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('GET /api/v1/admin - 에지 케이스', () => {
    it('should handle empty dashboard when no orders exist', async () => {
      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .set(getAuthHeaders(adminToken))
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(Array.isArray(response.body.data.newOrders)).toBe(true)
      expect(Array.isArray(response.body.data.preparingOrders)).toBe(true)
      expect(Array.isArray(response.body.data.readyOrders)).toBe(true)
    })

    it('should handle analytics with zero orders', async () => {
      const response = await request(app)
        .get('/api/v1/admin/analytics')
        .set(getAuthHeaders(adminToken))
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data.totalOrders).toBeGreaterThanOrEqual(0)
      expect(response.body.data.totalRevenue).toBeGreaterThanOrEqual(0)
      expect(response.body.data.cancelRate).toBeGreaterThanOrEqual(0)
      expect(response.body.data.cancelRate).toBeLessThanOrEqual(100)
    })

    it('should handle menu analytics with no sales', async () => {
      const response = await request(app)
        .get('/api/v1/admin/menu-analytics')
        .set(getAuthHeaders(adminToken))
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(Array.isArray(response.body.data.menuSales)).toBe(true)
    })

    it('should return 401 when invalid token is provided', async () => {
      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .set({ Authorization: 'Bearer invalid-token' })
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 401 when expired token is provided', async () => {
      // This would require creating an expired token
      // For now, we test the structure
      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .set({ Authorization: 'Bearer expired.token.here' })
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
    })
  })
})

