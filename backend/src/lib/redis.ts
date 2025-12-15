import { createClient, RedisClientType } from 'redis'

const redis: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
})

redis.on('error', (err) => console.error('Redis Client Error', err))

// Connect to Redis
redis.connect().catch((err) => {
  console.error('Failed to connect to Redis:', err)
  process.exit(1)
})

// Helper function to ensure Redis is connected
export const ensureRedisConnected = async () => {
  if (!redis.isOpen) {
    await redis.connect()
  }
}

export { redis }

