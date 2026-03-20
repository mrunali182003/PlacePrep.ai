import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
})

// Auto-attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

// ── Auth ──────────────────────────────────────────
export const registerUser  = (data) => API.post('/auth/register', data)
export const loginUser     = (data) => API.post('/auth/login', data)
export const getMe         = ()     => API.get('/auth/me')
export const saveToken     = (token) => localStorage.setItem('token', token)
export const getToken      = ()      => localStorage.getItem('token')
export const removeToken   = ()      => localStorage.removeItem('token')
export const isLoggedIn    = ()      => !!localStorage.getItem('token')

// ── Resume ────────────────────────────────────────
export const analyzeResume    = (formData) => API.post('/analyze-resume', formData)
export const getResumeHistory = ()         => API.get('/resume-history')

// ── Interview ─────────────────────────────────────
export const sendAnswer          = (data) => API.post('/interview', data)
export const saveInterview       = (data) => API.post('/interview/save', data)
export const getInterviewHistory = ()     => API.get('/interview-history')

// ── Dashboard ─────────────────────────────────────
export const getDashboardStats = () => API.get('/dashboard-stats')

// ── Jobs ──────────────────────────────────────────
export const getJobs = () => API.get('/jobs')

// ── Code ──────────────────────────────────────────
export const runCode = (data) => API.post('/run-code', data)

// ── Leaderboard ───────────────────────────────────
export const getLeaderboard = () => API.get('/leaderboard')
export const getMyRank      = () => API.get('/my-rank')

// ── Admin ─────────────────────────────────────────
export const getAdminStats = () => API.get('/admin-stats')