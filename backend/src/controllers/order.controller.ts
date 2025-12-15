import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth.middleware'
import { prisma } from '../lib/prisma'
import { io } from '../index'

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401))
    }

    // TODO: Implement order creation logic
    // - Validate input
    // - Calculate prices
    // - Process payment
    // - Create order in database
    // - Send notifications

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const getOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401))
    }

    const orders = await prisma.order.findMany({
      where: {
        customer_id: req.user.id,
      },
      include: {
        order_items: {
          include: {
            menu: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    res.json({
      success: true,
      data: { orders },
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401))
    }

    const { id } = req.params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            menu: true,
          },
        },
      },
    })

    if (!order || order.customer_id !== req.user.id) {
      return next(new AppError('Order not found', 404))
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401))
    }

    const { id } = req.params

    const order = await prisma.order.update({
      where: { id },
      data: { status: 'cancelled' },
    })

    // Notify via WebSocket
    io.to(`order:${id}`).emit('order:status-changed', {
      orderId: id,
      status: 'cancelled',
    })

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const retryOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement retry order logic
    res.json({
      success: true,
      message: 'Order retried successfully',
    })
  } catch (error) {
    next(error)
  }
}

