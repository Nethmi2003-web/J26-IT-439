import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import healthRoutes from './routes/health.js'

/**
 * Create and configure Express application.
 */
export const createApp = (): Express => {
  const app = express()

  // Security middleware
  app.use(helmet())

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    })
  )

  // Body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Request logging middleware (basic)
  app.use((req, _res, next) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${req.method} ${req.path}`)
    next()
  })

  // Routes
  app.use('/api/health', healthRoutes)

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.path,
    })
  })

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
    })
  })

  return app
}
