// Test setup file
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Set test environment
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key'
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test'
// Don't initialize Redis in test environment unless explicitly set
if (!process.env.TEST_REDIS_URL && !process.env.REDIS_URL) {
  delete process.env.REDIS_URL
}

// Global test timeout
jest.setTimeout(10000)

