import { Router } from 'express'
import {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from '../controllers/menu.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

/**
 * @swagger
 * /api/v1/menus:
 *   get:
 *     summary: 메뉴 목록 조회
 *     tags: [Menus]
 *     parameters:
 *       - in: query
 *         name: cafeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 메뉴 목록
 */
router.get('/', getMenus)
router.get('/:id', getMenuById)
router.post('/', authenticate, authorize('admin'), createMenu)
router.put('/:id', authenticate, authorize('admin'), updateMenu)
router.delete('/:id', authenticate, authorize('admin'), deleteMenu)

export default router

