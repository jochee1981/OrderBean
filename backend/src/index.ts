import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'
import authRoutes from './routes/auth.routes'
import menuRoutes from './routes/menu.routes'
import orderRoutes from './routes/order.routes'
import adminRoutes from './routes/admin.routes'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
})

const PORT = process.env.PORT || 3000

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OrderBean API',
      version: '1.0.0',
      description: 'OrderBean Coffee Ordering Service API',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/menus', menuRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/admin', adminRoutes)

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join:order', (orderId: string) => {
    socket.join(`order:${orderId}`)
    console.log(`Client ${socket.id} joined order:${orderId}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Export io for use in other modules
export { io }
// Set in socket lib to avoid circular dependency
import { setIo } from './lib/socket'
setIo(io)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
})

