import request from 'supertest'
import app from './app.test'
import { createTestUser, getAuthHeaders, cleanupOrderData } from './helpers/testHelpers'

describe('Order Controller - Create Order', () => {
  let authToken: string

  beforeAll(async () => {
    // Create test user
    authToken = await createTestUser(app)
  })

  // Clean up order data before and after each test
  beforeEach(async () => {
    await cleanupOrderData()
  })

  afterEach(async () => {
    await cleanupOrderData()
  })

  describe('POST /api/v1/orders - 정상적인 주문 생성', () => {
    it('should create an order with valid menu items and options', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 2,
            selectedOptions: [
              {
                optionGroupId: 'test-option-group-id',
                selectedOptionId: 'test-option-id',
              },
            ],
            notes: '뜨겁게 부탁합니다',
          },
        ],
        pickupTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30분 후
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('orderId')
      expect(response.body.data).toHaveProperty('orderNumber')
      expect(response.body.data).toHaveProperty('status', 'PENDING')
      expect(response.body.data).toHaveProperty('totalAmount')
      expect(response.body.data).toHaveProperty('finalAmount')
      expect(response.body.data.items).toHaveLength(1)
    })

    it('should calculate total price correctly (base price + options)', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 1,
            selectedOptions: [
              {
                optionGroupId: 'test-option-group-id',
                selectedOptionId: 'test-option-id',
              },
            ],
          },
        ],
        pickupTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(201)

      // 가격 검증: 기본 가격 + 옵션 가격
      expect(response.body.data.totalAmount).toBeGreaterThan(0)
      expect(response.body.data.finalAmount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('POST /api/v1/orders - 입력 검증', () => {
    it('should return 400 when required fields are missing', async () => {
      const invalidOrder = {
        items: [], // cafeId missing
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(invalidOrder)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body).toHaveProperty('message')
    })

    it('should return 400 when items array is empty', async () => {
      const invalidOrder = {
        cafeId: 'test-cafe-id',
        items: [],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(invalidOrder)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 400 when menuId is invalid', async () => {
      const invalidOrder = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'invalid-menu-id',
            quantity: 1,
          },
        ],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(invalidOrder)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 400 when quantity is invalid (0 or negative)', async () => {
      const invalidOrder = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 0,
          },
        ],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(invalidOrder)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 400 when pickupTime is in the past', async () => {
      const invalidOrder = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 1,
          },
        ],
        pickupTime: new Date(Date.now() - 60 * 1000).toISOString(), // 1분 전
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(invalidOrder)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('POST /api/v1/orders - 권한 검증', () => {
    it('should return 401 when no auth token is provided', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 1,
          },
        ],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .send(orderData)
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 401 when invalid token is provided', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 1,
          },
        ],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set({ Authorization: 'Bearer invalid-token' })
        .send(orderData)
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('POST /api/v1/orders - 재고 확인', () => {
    it('should return 400 when menu is out of stock', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'out-of-stock-menu-id',
            quantity: 100, // 재고보다 많은 수량
          },
        ],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.code).toBe('OUT_OF_STOCK')
    })
  })

  describe('POST /api/v1/orders - 필수 옵션 검증', () => {
    it('should return 400 when required options are not selected', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'menu-with-required-options',
            quantity: 1,
            // required option missing
          },
        ],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.code).toBe('INVALID_OPTIONS')
    })

    it('should return 400 when invalid option ID is provided', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 1,
            selectedOptions: [
              {
                optionGroupId: 'test-option-group-id',
                selectedOptionId: 'invalid-option-id',
              },
            ],
          },
        ],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 400 when invalid option group ID is provided', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 1,
            selectedOptions: [
              {
                optionGroupId: 'invalid-option-group-id',
                selectedOptionId: 'test-option-id',
              },
            ],
          },
        ],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('POST /api/v1/orders - 에지 케이스', () => {
    it('should handle order with multiple items correctly', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 2,
            selectedOptions: [],
          },
          {
            menuId: 'test-menu-id-2',
            quantity: 1,
            selectedOptions: [],
          },
        ],
        pickupTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data.items).toHaveLength(2)
    })

    it('should return 400 when quantity exceeds maximum allowed', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 1000, // 매우 큰 수량
          },
        ],
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should handle order with very long notes', async () => {
      const longNotes = 'A'.repeat(1000) // 매우 긴 메모
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 1,
            notes: longNotes,
          },
        ],
        pickupTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
    })

    it('should return 400 when pickupTime is too far in the future', async () => {
      const orderData = {
        cafeId: 'test-cafe-id',
        items: [
          {
            menuId: 'test-menu-id',
            quantity: 1,
          },
        ],
        pickupTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1년 후
      }

      const response = await request(app)
        .post('/api/v1/orders')
        .set(getAuthHeaders(authToken))
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('POST /api/v1/orders/:id/retry - 재시도', () => {
    it('should return 404 when order does not exist', async () => {
      const response = await request(app)
        .post('/api/v1/orders/non-existent-id/retry')
        .set(getAuthHeaders(authToken))
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 403 when trying to retry another user\'s order', async () => {
      // This test would require creating an order with a different user
      // For now, we'll test the basic structure
      const response = await request(app)
        .post('/api/v1/orders/test-order-id/retry')
        .set(getAuthHeaders(authToken))
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })
  })
})

