import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { prisma } from '../lib/prisma'
import { redisGet, redisSet } from '../lib/redis'
import { checkDbConnection, handleDbError } from '../utils/dbUtils'
import { invalidateMenuCache } from '../utils/cacheUtils'

export const getMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if database is connected
    if (!checkDbConnection(res)) {
      return // Response already sent by checkDbConnection
    }

    const { cafeId, category, minPrice, maxPrice, searchTerm, sortBy, page = 1, limit = 20 } = req.query

    // Build cache key
    const cacheKey = `menus:${cafeId}:${category}:${minPrice}:${maxPrice}:${searchTerm}:${sortBy}:${page}:${limit}`

    // Try to get from cache
    const cached = await redisGet(cacheKey)
    if (cached) {
      return res.json(JSON.parse(cached))
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
    await redisSet(cacheKey, JSON.stringify(response), 3600)

    return res.json(response)
  } catch (error: any) {
    if (handleDbError(error, res, next)) {
      return
    }
    // If handleDbError returns false, next(error) was called
    return
  }
}

export const getMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!checkDbConnection(res)) {
      return
    }

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
  } catch (error: any) {
    if (handleDbError(error, res, next)) {
      return
    }
    // If handleDbError returns false, next(error) was called
    return
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
    await invalidateMenuCache()

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
    await invalidateMenuCache()

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
    await invalidateMenuCache()

    res.json({
      success: true,
      message: 'Menu deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

