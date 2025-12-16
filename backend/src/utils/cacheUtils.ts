import { ensureRedisConnected } from '../lib/redis'

/**
 * Invalidate menu cache (currently skips due to Redis wildcard limitation)
 * In production, consider using cache key prefix and deleting by pattern
 */
export const invalidateMenuCache = async (): Promise<void> => {
  try {
    await ensureRedisConnected()
    // Note: Redis doesn't support wildcard deletion directly
    // In production, consider using a cache key prefix and deleting by pattern
    // For now, we'll skip cache invalidation on individual operations
  } catch (error) {
    console.warn('Redis cache invalidation error:', error)
  }
}

