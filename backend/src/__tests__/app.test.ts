// Test app setup - exports app without starting server
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { errorHandler } from '../middleware/errorHandler'
import { notFoundHandler } from '../middleware/notFoundHandler'
import authRoutes from '../routes/auth.routes'
import menuRoutes from '../routes/menu.routes'
import orderRoutes from '../routes/order.routes'
import adminRoutes from '../routes/admin.routes'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: '*',
  credentials: true,
}))
app.use(morgan('test'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/menus', menuRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/admin', adminRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Set io in socket lib to avoid circular dependency
import { setIo } from '../lib/socket'
setIo(io)

// Export io for use in other modules (same as index.ts)
export { app, io }
export default app

