import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { Menu, MenuOption, OptionGroup } from '@prisma/client'

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXXX (e.g., ORD-20241216-0001)
 */
export async function generateOrderNumber(): Promise<string> {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD

  // Find the highest sequence number for today
  const todayPrefix = `ORD-${dateStr}-`
  const todayOrders = await prisma.order.findMany({
    where: {
      order_number: {
        startsWith: todayPrefix,
      },
    },
    orderBy: {
      order_number: 'desc',
    },
    take: 1,
  })

  let sequence = 1
  if (todayOrders.length > 0) {
    const lastOrderNumber = todayOrders[0].order_number
    const lastSequence = parseInt(lastOrderNumber.slice(-4), 10)
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1
    }
  }

  // Format sequence as 4-digit string (0001, 0002, etc.)
  const sequenceStr = sequence.toString().padStart(4, '0')
  return `${todayPrefix}${sequenceStr}`
}

/**
 * Validate menu exists and is active
 */
export async function validateMenu(menuId: string): Promise<Menu> {
  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
  })

  if (!menu) {
    throw new AppError('Menu not found', 400, 'MENU_NOT_FOUND')
  }

  if (!menu.is_active || menu.deleted_at) {
    throw new AppError('Menu is not available', 400, 'MENU_NOT_AVAILABLE')
  }

  return menu
}

/**
 * Validate required options are selected
 */
export async function validateRequiredOptions(
  menuId: string,
  selectedOptions: Array<{ optionGroupId: string; selectedOptionId: string }>
): Promise<void> {
  // Get all option groups for this menu
  const optionGroups = await prisma.optionGroup.findMany({
    where: {
      menu_id: menuId,
      is_required: true,
    },
    include: {
      menu_options: true,
    },
  })

  // Check if all required option groups have selected options
  for (const group of optionGroups) {
    const hasSelectedOption = selectedOptions.some(
      (opt) => opt.optionGroupId === group.id
    )

    if (!hasSelectedOption) {
      throw new AppError(
        `Required option group "${group.name}" is not selected`,
        400,
        'INVALID_OPTIONS'
      )
    }

    // Validate that selected option belongs to this group
    const selectedOption = selectedOptions.find(
      (opt) => opt.optionGroupId === group.id
    )

    if (selectedOption) {
      const optionExists = group.menu_options.some(
        (opt) => opt.id === selectedOption.selectedOptionId
      )

      if (!optionExists) {
        throw new AppError(
          `Selected option does not belong to option group "${group.name}"`,
          400,
          'INVALID_OPTIONS'
        )
      }
    }
  }
}

/**
 * Validate selected options belong to the menu
 */
export async function validateSelectedOptions(
  menuId: string,
  selectedOptions: Array<{ optionGroupId: string; selectedOptionId: string }>
): Promise<void> {
  // Get all option groups for this menu
  const menuOptionGroups = await prisma.optionGroup.findMany({
    where: { menu_id: menuId },
    include: {
      menu_options: true,
    },
  })

  // Create a map of valid option IDs
  const validOptionIds = new Set<string>()
  menuOptionGroups.forEach((group) => {
    group.menu_options.forEach((option) => {
      validOptionIds.add(option.id)
    })
  })

  // Validate each selected option
  for (const selected of selectedOptions) {
    // Check if option group belongs to menu
    const group = menuOptionGroups.find((g) => g.id === selected.optionGroupId)
    if (!group) {
      throw new AppError(
        `Option group "${selected.optionGroupId}" does not belong to this menu`,
        400,
        'INVALID_OPTIONS'
      )
    }

    // Check if option belongs to the group
    if (!validOptionIds.has(selected.selectedOptionId)) {
      throw new AppError(
        `Selected option "${selected.selectedOptionId}" is not valid for this menu`,
        400,
        'INVALID_OPTIONS'
      )
    }
  }
}

/**
 * Check if menu has enough stock
 */
export async function checkStock(menuId: string, quantity: number): Promise<void> {
  const menu = await validateMenu(menuId)

  // If stock is null, skip stock check (unlimited stock)
  if (menu.stock === null || menu.stock === undefined) {
    return
  }

  if (menu.stock < quantity) {
    throw new AppError(
      `Insufficient stock. Available: ${menu.stock}, Requested: ${quantity}`,
      400,
      'OUT_OF_STOCK'
    )
  }
}

/**
 * Calculate item price (base price + option prices)
 */
export async function calculateItemPrice(
  menuId: string,
  quantity: number,
  selectedOptions: Array<{ optionGroupId: string; selectedOptionId: string }>
): Promise<{ unitPrice: number; subtotal: number }> {
  const menu = await validateMenu(menuId)

  // Start with base menu price
  let unitPrice = menu.price

  // Add option prices if any
  if (selectedOptions && selectedOptions.length > 0) {
    const optionIds = selectedOptions.map((opt) => opt.selectedOptionId)
    const options = await prisma.menuOption.findMany({
      where: {
        id: {
          in: optionIds,
        },
      },
    })

    // Sum up all option price adjustments
    const optionPriceAdjustment = options.reduce(
      (sum, option) => sum + option.price_adjustment,
      0
    )

    unitPrice += optionPriceAdjustment
  }

  const subtotal = unitPrice * quantity

  return { unitPrice, subtotal }
}

/**
 * Calculate total order amount
 */
export async function calculateOrderTotal(
  items: Array<{
    menuId: string
    quantity: number
    selectedOptions?: Array<{ optionGroupId: string; selectedOptionId: string }>
  }>
): Promise<{ totalAmount: number; itemPrices: Array<{ unitPrice: number; subtotal: number }> }> {
  const itemPrices = await Promise.all(
    items.map((item) =>
      calculateItemPrice(item.menuId, item.quantity, item.selectedOptions || [])
    )
  )

  const totalAmount = itemPrices.reduce((sum, item) => sum + item.subtotal, 0)

  return { totalAmount, itemPrices }
}

