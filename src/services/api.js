import axios from 'axios'
import { API_URL } from '../config/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
})

// ============================================
// Voice
// ============================================

export async function processVoice(audioBlob, language = 'hinglish') {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  formData.append('language', language)
  const { data } = await api.post('/api/voice/process', formData)
  return data
}

export async function transcribeAudio(audioBlob) {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  const { data } = await api.post('/api/voice/transcribe', formData)
  return data
}

export async function speakText(text, language = 'hi') {
  const formData = new FormData()
  formData.append('text', text)
  formData.append('language', language)
  const { data } = await api.post('/api/voice/speak', formData)
  return data
}

export async function askVoiceCopilot(question, context) {
  const formData = new FormData()
  formData.append('question', question)
  formData.append('context', context)
  const { data } = await api.post('/api/voice/ask_text', formData)
  return data
}

// ============================================
// Lesson
// ============================================

export async function generateLesson(params) {
  const { data } = await api.post('/api/lesson/generate', params)
  return data
}

export async function simplifyLesson(params) {
  const { data } = await api.post('/api/lesson/simplify', params)
  return data
}

// ============================================
// Quiz
// ============================================

export async function generateQuiz(params) {
  const { data } = await api.post('/api/quiz/generate', params)
  return data
}

export async function submitAnswer(params) {
  const { data } = await api.post('/api/quiz/answer', params)
  return data
}

// ============================================
// Sessions
// ============================================

export async function getSessions() {
  const { data } = await api.get('/api/sessions')
  return data
}

export async function getSession(id) {
  const { data } = await api.get(`/api/session/${id}`)
  return data
}

// ============================================
// Health
// ============================================

export async function checkHealth() {
  try {
    const { data } = await api.get('/api/health')
    return data
  } catch {
    return null
  }
}

// Helper: check if backend is available
export async function isBackendAvailable() {
  try {
    const { data } = await api.get('/api/health', { timeout: 3000 })
    return data?.status === 'healthy'
  } catch {
    return false
  }
}

export default api
