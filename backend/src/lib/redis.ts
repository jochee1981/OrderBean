import { createClient, RedisClientType } from 'redis'

let redis: RedisClientType | null = null
let redisConnected = false

// Initialize Redis client (optional)
// Skip Redis initialization in test environment unless explicitly configured
if ((process.env.REDIS_URL || process.env.NODE_ENV === 'production') && process.env.NODE_ENV !== 'test') {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
  if (redisUrl && redisUrl !== '') {
    redis = createClient({
      url: redisUrl,
    })

    redis.on('error', (err) => {
      console.warn('Redis Client Error:', err.message)
      redisConnected = false
    })

    // Connect to Redis (non-blocking)
    redis.connect().then(() => {
      redisConnected = true
      console.log('✅ Redis connected')
    }).catch((err) => {
      console.warn('⚠️  Redis connection failed, continuing without cache:', err.message)
      redisConnected = false
    })
  }
} else if (process.env.NODE_ENV !== 'test') {
  console.log('ℹ️  Redis not configured, running without cache')
}

// Helper function to ensure Redis is connected
export const ensureRedisConnected = async () => {
  if (!redis || !redisConnected) {
    if (redis && !redis.isOpen) {
      try {
        await redis.connect()
        redisConnected = true
      } catch (error) {
        redisConnected = false
        throw error
      }
    }
  }
}

// Safe Redis get
export const redisGet = async (key: string): Promise<string | null> => {
  if (!redis || !redisConnected) return null
  try {
    await ensureRedisConnected()
    return await redis.get(key)
  } catch (error) {
    return null
  }
}

// Safe Redis set
export const redisSet = async (key: string, value: string, ttl?: number): Promise<boolean> => {
  if (!redis || !redisConnected) return false
  try {
    await ensureRedisConnected()
    if (ttl) {
      await redis.setEx(key, ttl, value)
    } else {
      await redis.set(key, value)
    }
    return true
  } catch (error) {
    return false
  }
}

export { redis }

