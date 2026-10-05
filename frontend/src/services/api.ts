import axios, { AxiosInstance } from 'axios'

const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Create and configure Axios instance for API communication.
 * Reads VITE_API_URL from environment configuration.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor for adding auth tokens or custom headers if needed.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add any custom headers or auth tokens here in the future
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor for handling errors globally.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally if needed
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default apiClient
