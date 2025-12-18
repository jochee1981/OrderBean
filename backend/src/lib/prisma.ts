import { PrismaClient } from '@prisma/client'

let prismaInstance: PrismaClient | null = null
let dbConnected = false

// Initialize Prisma client (lazy connection - no connection attempt on init)
const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

// Get Prisma client instance
export const getPrisma = (): PrismaClient => {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient()
    // Test connection asynchronously (non-blocking)
    testConnection()
  }
  return prismaInstance
}

// Test database connection (non-blocking)
const testConnection = async () => {
  if (!prismaInstance) return
  
  try {
    await prismaInstance.$connect()
    dbConnected = true
    console.log('✅ Database connected')
  } catch (err: any) {
    dbConnected = false
    console.warn('⚠️  Database connection failed, some features may not work:', err.message)
    console.warn('💡 To enable database features, install PostgreSQL and run: npm run prisma:migrate')
    console.warn('💡 Server will continue running, but database operations will fail')
  }
}

// Check if database is connected
export const isDbConnected = (): boolean => dbConnected

// Export prisma for direct use (lazy initialization)
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getPrisma()[prop as keyof PrismaClient]
  },
})

