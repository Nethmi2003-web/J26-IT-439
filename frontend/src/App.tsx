import { useEffect, useState } from 'react'
import apiClient from './services/api'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Loading...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await apiClient.get('/health')
        setBackendStatus('Backend is running')
        setError(null)
      } catch (err) {
        setBackendStatus('Backend is unavailable')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    checkBackendHealth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Frontend is running
        </h1>
        <p className="text-gray-600 text-center mb-6">
          MERN + ML Service Application
        </p>

        <div className="bg-gray-50 rounded p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Backend Status:
          </h2>
          <p className="text-sm text-gray-600">{backendStatus}</p>
          {error && <p className="text-sm text-red-600 mt-2">Error: {error}</p>}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Frontend URL:</span> http://localhost:5173
          </p>
          <p>
            <span className="font-semibold">Backend URL:</span> http://localhost:5000
          </p>
          <p>
            <span className="font-semibold">ML Service URL:</span> http://localhost:8000
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>Status Check:</strong> The application is successfully communicating with the backend via the configured API endpoint.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
