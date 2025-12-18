import request from 'supertest'
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import app from './app.test'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware'
import jwt from 'jsonwebtoken'
import { createTestUser } from './helpers/testHelpers'
import { AppError } from '../middleware/errorHandler'

describe('Auth Middleware', () => {
  describe('authenticate', () => {
    it('should pass with valid token', async () => {
      const token = await createTestUser(app)
      
      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.user).toHaveProperty('id')
      expect(response.body.user).toHaveProperty('email')
      expect(response.body.user).toHaveProperty('role')
    })

    it('should return 401 when Authorization header is missing', async () => {
      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.message).toContain('Unauthorized')
    })

    it('should return 401 when Authorization header does not start with Bearer', async () => {
      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', 'InvalidFormat token123')
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.message).toContain('Unauthorized')
    })

    it('should return 401 when token is invalid', async () => {
      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.message).toContain('Unauthorized')
    })

    it('should return 401 when token is expired', async () => {
      const secret = process.env.JWT_SECRET || 'test_jwt_secret_key'
      const expiredToken = jwt.sign(
        { id: 'test-id', email: 'test@example.com', role: 'CUSTOMER' },
        secret,
        { expiresIn: '-1h' } // Expired token
      )

      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.message).toContain('Unauthorized')
    })

    it('should return 401 when token is signed with wrong secret', async () => {
      const wrongSecret = 'wrong_secret_key'
      const wrongToken = jwt.sign(
        { id: 'test-id', email: 'test@example.com', role: 'CUSTOMER' },
        wrongSecret,
        { expiresIn: '24h' }
      )

      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', `Bearer ${wrongToken}`)
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.message).toContain('Unauthorized')
    })
  })

  describe('authorize', () => {
    it('should pass when user has required role (CUSTOMER)', async () => {
      const token = await createTestUser(app, { role: 'CUSTOMER' })
      
      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, authorize('CUSTOMER'), (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })

    it('should pass when user has required role (ADMIN)', async () => {
      const token = await createTestUser(app, { role: 'ADMIN' })
      
      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, authorize('ADMIN'), (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })

    it('should pass when user has one of multiple allowed roles', async () => {
      const token = await createTestUser(app, { role: 'ADMIN' })
      
      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, authorize('ADMIN', 'CUSTOMER'), (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })

    it('should return 401 when user is not authenticated (no req.user)', async () => {
      const testApp = express()
      testApp.use(express.json())
      // Skip authenticate middleware to simulate missing user
      testApp.get('/test', authorize('ADMIN'), (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .expect(401)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.code).toBe('UNAUTHORIZED')
      expect(response.body.message).toContain('Unauthorized')
    })

    it('should return 403 when user does not have required role', async () => {
      const token = await createTestUser(app, { role: 'CUSTOMER' })
      
      const testApp = express()
      testApp.use(express.json())
      testApp.get('/test', authenticate, authorize('ADMIN'), (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(403)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.code).toBe('FORBIDDEN')
      expect(response.body.message).toContain('Access denied')
      expect(response.body.message).toContain('ADMIN')
    })

    it('should handle case-insensitive role comparison', async () => {
      const token = await createTestUser(app, { role: 'ADMIN' })
      
      const testApp = express()
      testApp.use(express.json())
      // Token has 'ADMIN' but authorize checks for 'admin' (lowercase)
      testApp.get('/test', authenticate, authorize('admin'), (req: AuthRequest, res) => {
        res.json({ success: true, user: req.user })
      })
      const errorHandler: ErrorRequestHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.statusCode || 500).json({
          success: false,
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
        })
      }
      testApp.use(errorHandler)

      const response = await request(testApp)
        .get('/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
    })
  })
})

