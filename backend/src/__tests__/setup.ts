// Test setup file
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join } from 'path'

// Load test environment variables
const testEnvPath = join(process.cwd(), '.env.test')
if (existsSync(testEnvPath)) {
  dotenv.config({ path: testEnvPath })
} else {
  // Fallback: try to load from env.test.example or use defaults
  console.warn('⚠️  .env.test file not found. Using default test environment variables.')
}

// Set test environment
process.env.NODE_ENV = 'test'

// JWT Secret - Use test secret if not set
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_for_testing_only'

// Database URL - Prefer TEST_DATABASE_URL, fallback to DATABASE_URL or default
process.env.DATABASE_URL = 
  process.env.TEST_DATABASE_URL || 
  process.env.DATABASE_URL || 
  'postgresql://orderbean:orderbean_dev@localhost:5432/orderbean_test?schema=public'

// Don't initialize Redis in test environment unless explicitly set
if (!process.env.TEST_REDIS_URL && !process.env.REDIS_URL) {
  delete process.env.REDIS_URL
}

// Global test timeout
jest.setTimeout(10000)

