import { Router } from 'express'
import { signup, login, logout, refresh } from '../controllers/auth.controller'
import { validateRequest } from '../middleware/validation.middleware'
import { signupSchema, loginSchema } from '../schemas/auth.schema'

const router = Router()

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
router.post('/signup', validateRequest(signupSchema), signup)

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 */
router.post('/login', validateRequest(loginSchema), login)
router.post('/logout', logout)
router.post('/refresh', refresh)

export default router

