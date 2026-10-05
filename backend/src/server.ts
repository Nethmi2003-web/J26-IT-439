import dotenv from 'dotenv'
import { createApp } from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

/**
 * Start the Express server.
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase()

    // Create Express app
    const app = createApp()

    // Start listening
    const server = app.listen(PORT, () => {
      console.log()
      console.log('='.repeat(50))
      console.log('🚀 Backend Server Started')
      console.log('='.repeat(50))
      console.log(`📍 Environment: ${NODE_ENV}`)
      console.log(`🔌 Server running on: http://localhost:${PORT}`)
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
      console.log(`📦 MongoDB URI: ${process.env.MONGODB_URI}`)
      console.log(`🤖 ML Service URL: ${process.env.ML_SERVICE_URL}`)
      console.log('='.repeat(50))
      console.log()
    })

    // Graceful shutdown
    const handleShutdown = async (signal: string) => {
      console.log()
      console.log(`\n${signal} received. Shutting down gracefully...`)
      server.close(async () => {
        try {
          await disconnectDatabase()
          console.log('✓ Server shutdown complete')
          process.exit(0)
        } catch (error) {
          console.error('Error during shutdown:', error)
          process.exit(1)
        }
      })
    }

    process.on('SIGTERM', () => handleShutdown('SIGTERM'))
    process.on('SIGINT', () => handleShutdown('SIGINT'))
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
