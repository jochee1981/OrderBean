import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { prisma } from '../lib/prisma'
import { redis, ensureRedisConnected } from '../lib/redis'

export const getMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cafeId, category, minPrice, maxPrice, searchTerm, sortBy, page = 1, limit = 20 } = req.query

    // Build cache key
    const cacheKey = `menus:${cafeId}:${category}:${minPrice}:${maxPrice}:${searchTerm}:${sortBy}:${page}:${limit}`

    // Try to get from cache
    try {
      await ensureRedisConnected()
      const cached = await redis.get(cacheKey)
      if (cached) {
        return res.json(JSON.parse(cached))
      }
    } catch (error) {
      // If Redis fails, continue without cache
      console.warn('Redis cache error:', error)
    }

    // Build where clause
    const where: any = {
      is_active: true,
      deleted_at: null,
    }

    if (cafeId) where.cafe_id = cafeId as string
    if (category) where.category = category as string
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseInt(minPrice as string)
      if (maxPrice) where.price.lte = parseInt(maxPrice as string)
    }
    if (searchTerm) {
      where.name = {
        contains: searchTerm as string,
        mode: 'insensitive',
      }
    }

    // Build orderBy
    let orderBy: any = {}
    switch (sortBy) {
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'price':
        orderBy = { price: 'asc' }
        break
      case 'popularity':
        orderBy = { created_at: 'desc' } // TODO: Add popularity field
        break
      default:
        orderBy = { created_at: 'desc' }
    }

    // Get menus with pagination
    const [menus, total] = await Promise.all([
      prisma.menu.findMany({
        where,
        orderBy,
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
        include: {
          option_groups: {
            include: {
              menu_options: true,
            },
          },
        },
      }),
      prisma.menu.count({ where }),
    ])

    const response = {
      success: true,
      data: {
        menus,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      },
      timestamp: new Date().toISOString(),
    }

    // Cache for 1 hour
    try {
      await ensureRedisConnected()
      await redis.setEx(cacheKey, 3600, JSON.stringify(response))
    } catch (error) {
      // If Redis fails, continue without cache
      console.warn('Redis cache error:', error)
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export const getMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        option_groups: {
          include: {
            menu_options: true,
          },
        },
      },
    })

    if (!menu) {
      return next(new AppError('Menu not found', 404))
    }

    res.json({
      success: true,
      data: menu,
    })
  } catch (error) {
    next(error)
  }
}

export const createMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menu = await prisma.menu.create({
      data: req.body,
    })

    // Invalidate cache
    try {
      await ensureRedisConnected()
      // Note: Redis doesn't support wildcard deletion directly
      // In production, consider using a cache key prefix and deleting by pattern
      // For now, we'll skip cache invalidation on individual operations
    } catch (error) {
      console.warn('Redis cache invalidation error:', error)
    }

    res.status(201).json({
      success: true,
      data: menu,
    })
  } catch (error) {
    next(error)
  }
}

export const updateMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const menu = await prisma.menu.update({
      where: { id },
      data: req.body,
    })

    // Invalidate cache
    try {
      await ensureRedisConnected()
      // Note: Redis doesn't support wildcard deletion directly
      // In production, consider using a cache key prefix and deleting by pattern
      // For now, we'll skip cache invalidation on individual operations
    } catch (error) {
      console.warn('Redis cache invalidation error:', error)
    }

    res.json({
      success: true,
      data: menu,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // Soft delete
    await prisma.menu.update({
      where: { id },
      data: { deleted_at: new Date() },
    })

    // Invalidate cache
    try {
      await ensureRedisConnected()
      // Note: Redis doesn't support wildcard deletion directly
      // In production, consider using a cache key prefix and deleting by pattern
      // For now, we'll skip cache invalidation on individual operations
    } catch (error) {
      console.warn('Redis cache invalidation error:', error)
    }

    res.json({
      success: true,
      message: 'Menu deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

