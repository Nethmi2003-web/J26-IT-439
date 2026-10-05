import axios from 'axios'

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000'

/**
 * Check if the Python ML service is healthy and available.
 * Does not throw an error if unavailable - returns status object instead.
 */
export const checkMLServiceHealth = async (): Promise<{
  available: boolean
  error?: string
}> => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/api/ml/health`, {
      timeout: 5000,
    })

    if (response.status === 200) {
      return { available: true }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.warn(`ML Service health check failed: ${errorMessage}`)
    return {
      available: false,
      error: errorMessage,
    }
  }

  return { available: false }
}

/**
 * Call ML Service predict endpoint.
 * For future use when predict endpoint is implemented.
 */
export const callMLServicePredict = async (data: any): Promise<any> => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/ml/predict`, data, {
      timeout: 30000,
    })
    return response.data
  } catch (error) {
    console.error('ML Service predict error:', error)
    throw error
  }
}

/**
 * Call ML Service train endpoint.
 * For future use when train endpoint is implemented.
 */
export const callMLServiceTrain = async (data: any): Promise<any> => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/ml/train`, data, {
      timeout: 60000,
    })
    return response.data
  } catch (error) {
    console.error('ML Service train error:', error)
    throw error
  }
}

/**
 * Get model info from ML Service.
 * For future use when model endpoint is implemented.
 */
export const getMLServiceModel = async (): Promise<any> => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/api/ml/model`, {
      timeout: 5000,
    })
    return response.data
  } catch (error) {
    console.error('ML Service model info error:', error)
    throw error
  }
}

/**
 * Get metrics from ML Service.
 * For future use when metrics endpoint is implemented.
 */
export const getMLServiceMetrics = async (): Promise<any> => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/api/ml/metrics`, {
      timeout: 5000,
    })
    return response.data
  } catch (error) {
    console.error('ML Service metrics error:', error)
    throw error
  }
}
