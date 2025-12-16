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
    })

    // Create customer user
    customerToken = await createTestUser(app, {
      email: `customer-${Date.now()}@example.com`,
      password: 'Customer1234!',
      name: 'Customer User',
    })

    // Note: In real implementation, admin role should be set during user creation
    // For now, tests will check for proper authorization
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
})

