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
})

