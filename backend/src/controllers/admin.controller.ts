import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { prisma } from '../lib/prisma'
import { getIo } from '../lib/socket'
import { OrderStatus } from '@prisma/client'

export const getOrderDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get orders by status
    const [newOrders, preparingOrders, readyOrders] = await Promise.all([
      // PENDING orders (new orders)
      prisma.order.findMany({
        where: {
          status: OrderStatus.PENDING,
        },
        include: {
          order_items: {
            include: {
              menu: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 50, // Limit to 50 most recent orders
      }),
      // PREPARING orders
      prisma.order.findMany({
        where: {
          status: OrderStatus.PREPARING,
        },
        include: {
          order_items: {
            include: {
              menu: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 50,
      }),
      // READY orders
      prisma.order.findMany({
        where: {
          status: OrderStatus.READY,
        },
        include: {
          order_items: {
            include: {
              menu: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 50,
      }),
    ])

    res.json({
      success: true,
      data: {
        newOrders,
        preparingOrders,
        readyOrders,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })

    // Notify customer via WebSocket
    const io = getIo()
    if (io) {
      io.to(`order:${id}`).emit('order:status-changed', {
        orderId: id,
        status,
      })
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get total orders count
    const totalOrders = await prisma.order.count()

    // Get total revenue (sum of final_amount for COMPLETED orders)
    const revenueResult = await prisma.order.aggregate({
      where: {
        status: OrderStatus.COMPLETED,
      },
      _sum: {
        final_amount: true,
      },
    })
    const totalRevenue = revenueResult._sum.final_amount || 0

    // Get cancelled orders count
    const cancelledCount = await prisma.order.count({
      where: {
        status: OrderStatus.CANCELLED,
      },
    })

    // Calculate cancel rate (percentage with 2 decimal places)
    const cancelRate =
      totalOrders > 0 ? Number(((cancelledCount / totalOrders) * 100).toFixed(2)) : 0

    // Average prep time calculation
    // Note: Since we don't have status change timestamps, we'll use a simplified approach
    // Phase 4: Implement proper status change tracking
    const averagePrepTime = 0 // Placeholder - Phase 4에서 구현

    // Get popular menus (top 10 by quantity sold)
    const popularMenusData = await prisma.orderItem.groupBy({
      by: ['menu_id'],
      where: {
        order: {
          status: {
            not: OrderStatus.CANCELLED,
          },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    })

    // Get menu details for popular menus
    const menuIds = popularMenusData.map((item) => item.menu_id)
    const menus = await prisma.menu.findMany({
      where: {
        id: {
          in: menuIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    })

    // Combine menu data with statistics
    const popularMenus = popularMenusData.map((item) => {
      const menu = menus.find((m) => m.id === item.menu_id)
      return {
        menuId: item.menu_id,
        menuName: menu?.name || 'Unknown',
        totalQuantity: item._sum.quantity || 0,
        totalRevenue: item._sum.subtotal || 0,
        orderCount: item._count.id || 0,
      }
    })

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        averagePrepTime,
        cancelRate,
        popularMenus,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMenuAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get menu sales statistics grouped by menu
    const menuSalesData = await prisma.orderItem.groupBy({
      by: ['menu_id'],
      where: {
        order: {
          status: {
            not: OrderStatus.CANCELLED,
          },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
    })

    // Get menu details
    const menuIds = menuSalesData.map((item) => item.menu_id)
    const menus = await prisma.menu.findMany({
      where: {
        id: {
          in: menuIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
      },
    })

    // Combine menu data with sales statistics
    const menuSales = menuSalesData.map((item) => {
      const menu = menus.find((m) => m.id === item.menu_id)
      return {
        menuId: item.menu_id,
        menuName: menu?.name || 'Unknown',
        category: menu?.category || null,
        basePrice: menu?.price || 0,
        totalQuantity: item._sum.quantity || 0,
        totalRevenue: item._sum.subtotal || 0,
        orderCount: item._count.id || 0,
      }
    })

    res.json({
      success: true,
      data: {
        menuSales,
      },
    })
  } catch (error) {
    next(error)
  }
}

