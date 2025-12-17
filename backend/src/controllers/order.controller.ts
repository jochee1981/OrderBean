import { Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth.middleware'
import { prisma } from '../lib/prisma'
import { getIo } from '../lib/socket'
import { OrderStatus } from '@prisma/client'
import { CreateOrderRequest } from '../schemas/order.schema'
import {
  generateOrderNumber,
  validateMenu,
  validateRequiredOptions,
  validateSelectedOptions,
  checkStock,
  calculateOrderTotal,
} from '../utils/orderUtils'

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.user is guaranteed by authenticate middleware
    const userId = req.user!.id
    const orderData: CreateOrderRequest = req.body

    // 1. Validate cafe exists
    const cafe = await prisma.cafe.findUnique({
      where: { id: orderData.cafeId },
    })

    if (!cafe) {
      return next(new AppError('Cafe not found', 400, 'CAFE_NOT_FOUND'))
    }

    // 2. Validate all menus and options
    for (const item of orderData.items) {
      // Validate menu exists and is active
      await validateMenu(item.menuId)

      // Validate required options are selected
      if (item.selectedOptions) {
        await validateRequiredOptions(item.menuId, item.selectedOptions)
        await validateSelectedOptions(item.menuId, item.selectedOptions)
      } else {
        // Check if menu has required options
        await validateRequiredOptions(item.menuId, [])
      }

      // Check stock
      await checkStock(item.menuId, item.quantity)
    }

    // 3. Calculate prices
    const { totalAmount, itemPrices } = await calculateOrderTotal(orderData.items)

    // 4. Generate order number
    const orderNumber = await generateOrderNumber()

    // 5. Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          customer_id: userId,
          cafe_id: orderData.cafeId,
          status: OrderStatus.PENDING,
          total_amount: totalAmount,
          discount_amount: 0, // Phase 3: Implement discount logic
          final_amount: totalAmount,
          pickup_time: orderData.pickupTime ? new Date(orderData.pickupTime) : null,
          notes: orderData.notes || null,
        },
      })

      // Create order items
      const orderItems = await Promise.all(
        orderData.items.map(async (item, index) => {
          const itemPrice = itemPrices[index]
          const orderItem = await tx.orderItem.create({
            data: {
              order_id: newOrder.id,
              menu_id: item.menuId,
              quantity: item.quantity,
              unit_price: itemPrice.unitPrice,
              subtotal: itemPrice.subtotal,
              notes: item.notes || null,
            },
          })

          // Create order item options if any
          if (item.selectedOptions && item.selectedOptions.length > 0) {
            // Get option prices
            const optionIds = item.selectedOptions.map((opt) => opt.selectedOptionId)
            const options = await tx.menuOption.findMany({
              where: {
                id: {
                  in: optionIds,
                },
              },
            })

            await Promise.all(
              item.selectedOptions.map(async (selectedOption) => {
                const option = options.find((opt) => opt.id === selectedOption.selectedOptionId)
                if (option) {
                  await tx.orderItemOption.create({
                    data: {
                      order_item_id: orderItem.id,
                      menu_option_id: option.id,
                      option_price: option.price_adjustment,
                    },
                  })
                }
              })
            )
          }

          return orderItem
        })
      )

      // Update stock (if stock is tracked)
      for (const item of orderData.items) {
        const menu = await tx.menu.findUnique({
          where: { id: item.menuId },
        })

        if (menu && menu.stock !== null && menu.stock !== undefined) {
          await tx.menu.update({
            where: { id: item.menuId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        }
      }

      // Return order with items
      return await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          order_items: {
            include: {
              menu: true,
              order_item_options: {
                include: {
                  menu_option: true,
                },
              },
            },
          },
        },
      })
    })

    // 6. Send WebSocket notification (if available)
    const io = getIo()
    if (io) {
      io.to(`cafe:${orderData.cafeId}`).emit('order:new', {
        orderId: order!.id,
        orderNumber: order!.order_number,
        status: order!.status,
      })
    }

    // 7. Format response
    res.status(201).json({
      success: true,
      data: {
        orderId: order!.id,
        orderNumber: order!.order_number,
        status: order!.status,
        totalAmount: order!.total_amount,
        finalAmount: order!.final_amount,
        items: order!.order_items.map((item) => ({
          id: item.id,
          menuId: item.menu_id,
          menuName: item.menu.name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          subtotal: item.subtotal,
          notes: item.notes,
          options: item.order_item_options.map((opt) => ({
            optionGroupId: opt.menu_option.option_group_id,
            optionName: opt.menu_option.name,
            priceAdjustment: opt.option_price,
          })),
        })),
      },
    })
  } catch (error) {
    // If it's already an AppError, pass it through
    if (error instanceof AppError) {
      return next(error)
    }
    next(error)
  }
}

export const getOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.user is guaranteed by authenticate middleware
    const orders = await prisma.order.findMany({
      where: {
        customer_id: req.user!.id,
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
    // req.user is guaranteed by authenticate middleware
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

    if (!order || order.customer_id !== req.user!.id) {
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
    // req.user is guaranteed by authenticate middleware
    const { id } = req.params
    
    // Verify order ownership
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: { customer_id: true },
    })

    if (!existingOrder || existingOrder.customer_id !== req.user!.id) {
      return next(new AppError('Order not found or unauthorized', 404))
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    })

    // Notify via WebSocket
    const io = getIo()
    if (io) {
      io.to(`order:${id}`).emit('order:status-changed', {
        orderId: id,
        status: OrderStatus.CANCELLED,
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

export const retryOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.user is guaranteed by authenticate middleware
    const userId = req.user!.id
    const { id } = req.params

    // 1. Find the original order
    const originalOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            menu: true,
            order_item_options: {
              include: {
                menu_option: {
                  include: {
                    option_group: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!originalOrder) {
      return next(new AppError('Order not found', 404, 'ORDER_NOT_FOUND'))
    }

    // 2. Verify order ownership
    if (originalOrder.customer_id !== userId) {
      return next(new AppError('Unauthorized', 403, 'UNAUTHORIZED'))
    }

    // 3. Prepare order data from original order
    const orderData: CreateOrderRequest = {
      cafeId: originalOrder.cafe_id,
      items: originalOrder.order_items.map((item) => ({
        menuId: item.menu_id,
        quantity: item.quantity,
        selectedOptions: item.order_item_options.map((opt) => ({
          optionGroupId: opt.menu_option.option_group_id,
          selectedOptionId: opt.menu_option_id,
        })),
        notes: item.notes || undefined,
      })),
      pickupTime: originalOrder.pickup_time
        ? originalOrder.pickup_time.toISOString()
        : undefined,
      notes: originalOrder.notes || undefined,
    }

    // 4. Validate all menus and options (in case menu/options changed)
    for (const item of orderData.items) {
      await validateMenu(item.menuId)

      if (item.selectedOptions) {
        await validateRequiredOptions(item.menuId, item.selectedOptions)
        await validateSelectedOptions(item.menuId, item.selectedOptions)
      } else {
        await validateRequiredOptions(item.menuId, [])
      }

      await checkStock(item.menuId, item.quantity)
    }

    // 5. Calculate prices
    const { totalAmount, itemPrices } = await calculateOrderTotal(orderData.items)

    // 6. Generate new order number
    const orderNumber = await generateOrderNumber()

    // 7. Create new order in transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          order_number: orderNumber,
          customer_id: userId,
          cafe_id: originalOrder.cafe_id,
          status: OrderStatus.PENDING,
          total_amount: totalAmount,
          discount_amount: 0,
          final_amount: totalAmount,
          pickup_time: orderData.pickupTime ? new Date(orderData.pickupTime) : null,
          notes: orderData.notes || null,
        },
      })

      // Create order items
      const orderItems = await Promise.all(
        orderData.items.map(async (item, index) => {
          const itemPrice = itemPrices[index]
          const orderItem = await tx.orderItem.create({
            data: {
              order_id: order.id,
              menu_id: item.menuId,
              quantity: item.quantity,
              unit_price: itemPrice.unitPrice,
              subtotal: itemPrice.subtotal,
              notes: item.notes || null,
            },
          })

          // Create order item options if any
          if (item.selectedOptions && item.selectedOptions.length > 0) {
            const optionIds = item.selectedOptions.map((opt) => opt.selectedOptionId)
            const options = await tx.menuOption.findMany({
              where: {
                id: {
                  in: optionIds,
                },
              },
            })

            await Promise.all(
              item.selectedOptions.map(async (selectedOption) => {
                const option = options.find((opt) => opt.id === selectedOption.selectedOptionId)
                if (option) {
                  await tx.orderItemOption.create({
                    data: {
                      order_item_id: orderItem.id,
                      menu_option_id: option.id,
                      option_price: option.price_adjustment,
                    },
                  })
                }
              })
            )
          }

          return orderItem
        })
      )

      // Update stock
      for (const item of orderData.items) {
        const menu = await tx.menu.findUnique({
          where: { id: item.menuId },
        })

        if (menu && menu.stock !== null && menu.stock !== undefined) {
          await tx.menu.update({
            where: { id: item.menuId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        }
      }

      // Return order with items
      return await tx.order.findUnique({
        where: { id: order.id },
        include: {
          order_items: {
            include: {
              menu: true,
              order_item_options: {
                include: {
                  menu_option: true,
                },
              },
            },
          },
        },
      })
    })

    // 8. Send WebSocket notification
    const io = getIo()
    if (io) {
      io.to(`cafe:${originalOrder.cafe_id}`).emit('order:new', {
        orderId: newOrder!.id,
        orderNumber: newOrder!.order_number,
        status: newOrder!.status,
      })
    }

    // 9. Format response
    res.status(201).json({
      success: true,
      data: {
        orderId: newOrder!.id,
        orderNumber: newOrder!.order_number,
        status: newOrder!.status,
        totalAmount: newOrder!.total_amount,
        finalAmount: newOrder!.final_amount,
        items: newOrder!.order_items.map((item) => ({
          id: item.id,
          menuId: item.menu_id,
          menuName: item.menu.name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          subtotal: item.subtotal,
          notes: item.notes,
          options: item.order_item_options.map((opt) => ({
            optionGroupId: opt.menu_option.option_group_id,
            optionName: opt.menu_option.name,
            priceAdjustment: opt.option_price,
          })),
        })),
      },
    })
  } catch (error) {
    if (error instanceof AppError) {
      return next(error)
    }
    next(error)
  }
}

