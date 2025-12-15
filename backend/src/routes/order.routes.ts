import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  retryOrder,
} from '../controllers/order.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/', authenticate, createOrder)
router.get('/', authenticate, getOrders)
router.get('/:id', authenticate, getOrderById)
router.patch('/:id/cancel', authenticate, cancelOrder)
router.post('/:id/retry', authenticate, retryOrder)

export default router

