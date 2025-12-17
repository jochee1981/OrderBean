import { z } from 'zod'
import { uuidSchema, isoDateSchema } from './common.schema'

/**
 * Selected option schema for order items
 */
const selectedOptionSchema = z.object({
  optionGroupId: uuidSchema,
  selectedOptionId: uuidSchema,
})

/**
 * Order item schema
 */
const orderItemSchema = z.object({
  menuId: uuidSchema,
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  selectedOptions: z.array(selectedOptionSchema).optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
})

/**
 * Create order request schema
 */
export const createOrderSchema = z.object({
  cafeId: uuidSchema,
  items: z
    .array(orderItemSchema)
    .min(1, 'At least one item is required'),
  pickupTime: isoDateSchema.refine(
    (date) => new Date(date) > new Date(),
    {
      message: 'Pickup time must be in the future',
    }
  ).optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
})

/**
 * Type inference for create order request
 */
export type CreateOrderRequest = z.infer<typeof createOrderSchema>

