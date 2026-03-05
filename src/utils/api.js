import axios from 'axios'
import { getIdToken } from './auth.jsx'

const BASE_URL = import.meta.env.VITE_API_URL
  || 'https://in69ou4s98.execute-api.ap-south-1.amazonaws.com/Dev'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60s timeout for Bedrock analysis calls
})

// Automatically attach Cognito JWT token to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = await getIdToken()
    if (token) {
      config.headers.Authorization = token
    }
  } catch (err) {
    console.warn('Could not get auth token:', err)
  }
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// POST /api/ingest — Submit patient biomarker data
export const ingestPatient = (data) => api.post('/api/ingest', data)

// POST /api/etl — Run Medallion ETL pipeline
export const runETL = (patientId) => api.post('/api/etl', { patient_id: patientId })

// POST /api/analyze — Trigger 4-agent AI analysis
export const analyzePatient = (patientId) => api.post('/api/analyze', { patient_id: patientId })

// GET /api/patients — List all patients with risk levels
export const getPatients = () => api.get('/api/patients')

// GET /api/predictions/{userId} — Get predictions for patient
export const getPredictions = (userId) => api.get(`/api/predictions/${userId}`)

// GET /api/reasoning/{sessionId} — Get agent reasoning chain
export const getReasoning = (sessionId) => api.get(`/api/reasoning/${sessionId}`)

// POST /api/translate — Translate text to Indian languages
export const translateText = (text, targetLanguage) =>
  api.post('/api/translate', { text, target_language: targetLanguage })

export default api
