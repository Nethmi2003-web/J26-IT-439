import { Router } from 'express'
import { checkMLServiceHealth } from '../services/mlService.js'

const router = Router()

/**
 * GET /api/health
 * Health check endpoint for the backend.
 * Also checks ML service availability.
 */
router.get('/', async (_req, res) => {
  try {
    const mlServiceStatus = await checkMLServiceHealth()

    const response: any = {
      success: true,
      message: 'Backend is running',
      timestamp: new Date().toISOString(),
    }

    if (mlServiceStatus.available) {
      response.mlService = 'available'
    } else {
      response.mlService = 'unavailable'
      if (mlServiceStatus.error) {
        response.mlServiceError = mlServiceStatus.error
      }
    }

    res.json(response)
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({
      success: false,
      message: 'Health check failed',
    })
  }
})

export default router
