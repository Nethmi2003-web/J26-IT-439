import mongoose from 'mongoose'

/**
 * Connect to MongoDB database.
 * Handles connection success, failure, and graceful shutdown.
 */
export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/project_database'

  try {
    await mongoose.connect(mongoUri)
    console.log('✓ MongoDB connected successfully')
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error)
    throw error
  }
}

/**
 * Disconnect from MongoDB database.
 * Called during application shutdown.
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect()
    console.log('✓ MongoDB disconnected')
  } catch (error) {
    console.error('✗ MongoDB disconnection error:', error)
    throw error
  }
}
