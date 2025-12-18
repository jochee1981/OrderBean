import request from 'supertest'
import app from './app.test'

describe('Menu Controller', () => {
  describe('GET /api/v1/menus', () => {
    it('should return menu list with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/menus')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('menus')
      expect(response.body.data).toHaveProperty('pagination')
      expect(Array.isArray(response.body.data.menus)).toBe(true)
      expect(response.body.data.pagination).toHaveProperty('total')
      expect(response.body.data.pagination).toHaveProperty('page')
      expect(response.body.data.pagination).toHaveProperty('limit')
      expect(response.body.data.pagination).toHaveProperty('totalPages')
    })

    it('should filter menus by category', async () => {
      const response = await request(app)
        .get('/api/v1/menus?category=coffee')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(Array.isArray(response.body.data.menus)).toBe(true)
    })

    it('should filter menus by price range', async () => {
      const response = await request(app)
        .get('/api/v1/menus?minPrice=1000&maxPrice=5000')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(Array.isArray(response.body.data.menus)).toBe(true)
    })

    it('should search menus by name', async () => {
      const response = await request(app)
        .get('/api/v1/menus?searchTerm=아메리카노')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(Array.isArray(response.body.data.menus)).toBe(true)
    })

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/menus?page=1&limit=10')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data.pagination.page).toBe(1)
      expect(response.body.data.pagination.limit).toBe(10)
    })

    it('should sort menus by name', async () => {
      const response = await request(app)
        .get('/api/v1/menus?sortBy=name')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })

    it('should sort menus by price', async () => {
      const response = await request(app)
        .get('/api/v1/menus?sortBy=price')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })
  })

  describe('GET /api/v1/menus/:id', () => {
    it('should return menu details with options', async () => {
      // This will fail if no menu exists - that's expected
      const response = await request(app)
        .get('/api/v1/menus/test-menu-id')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('name')
      expect(response.body.data).toHaveProperty('price')
      expect(response.body.data).toHaveProperty('option_groups')
      expect(Array.isArray(response.body.data.option_groups)).toBe(true)
    })

    it('should return 404 when menu not found', async () => {
      const response = await request(app)
        .get('/api/v1/menus/non-existent-id')
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('GET /api/v1/menus - 에지 케이스', () => {
    it('should handle empty menu list', async () => {
      const response = await request(app)
        .get('/api/v1/menus')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(Array.isArray(response.body.data.menus)).toBe(true)
      expect(response.body.data.pagination.total).toBeGreaterThanOrEqual(0)
    })

    it('should handle invalid page number', async () => {
      const response = await request(app)
        .get('/api/v1/menus?page=-1')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      // Should default to page 1 or handle gracefully
    })

    it('should handle invalid limit', async () => {
      const response = await request(app)
        .get('/api/v1/menus?limit=0')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      // Should use default limit or handle gracefully
    })

    it('should handle very large limit', async () => {
      const response = await request(app)
        .get('/api/v1/menus?limit=10000')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      // Should cap at maximum limit
    })

    it('should handle invalid price range (minPrice > maxPrice)', async () => {
      const response = await request(app)
        .get('/api/v1/menus?minPrice=5000&maxPrice=1000')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      // Should return empty array or handle gracefully
      expect(Array.isArray(response.body.data.menus)).toBe(true)
    })

    it('should handle negative price values', async () => {
      const response = await request(app)
        .get('/api/v1/menus?minPrice=-100')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })

    it('should handle very long search term', async () => {
      const longSearchTerm = 'A'.repeat(1000)
      const response = await request(app)
        .get(`/api/v1/menus?searchTerm=${longSearchTerm}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })

    it('should handle special characters in search term', async () => {
      const response = await request(app)
        .get('/api/v1/menus?searchTerm=!@#$%^&*()')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })

    it('should handle invalid sortBy parameter', async () => {
      const response = await request(app)
        .get('/api/v1/menus?sortBy=invalidField')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      // Should default to a valid sort field or ignore invalid sort
    })

    it('should handle multiple query parameters together', async () => {
      const response = await request(app)
        .get('/api/v1/menus?category=coffee&minPrice=1000&maxPrice=5000&page=1&limit=10&sortBy=price')
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(Array.isArray(response.body.data.menus)).toBe(true)
    })

    it('should handle invalid UUID format for menu ID', async () => {
      const response = await request(app)
        .get('/api/v1/menus/invalid-uuid-format')
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })
  })
})

