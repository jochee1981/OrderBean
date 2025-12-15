import { Router } from 'express'
import {
  getOrderDashboard,
  updateOrderStatus,
  getOrderAnalytics,
  getMenuAnalytics,
} from '../controllers/admin.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

// All admin routes require authentication and admin role
router.use(authenticate)
router.use(authorize('admin'))

router.get('/orders/dashboard', getOrderDashboard)
router.patch('/orders/:id/status', updateOrderStatus)
router.get('/analytics/orders', getOrderAnalytics)
router.get('/analytics/menus', getMenuAnalytics)

export default router

