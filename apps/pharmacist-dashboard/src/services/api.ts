import axios from 'axios'
import { Prescription, PharmacistReview, ReviewStats, User, ShiftNote } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach bearer token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const reviewService = {
  async getPendingReviews(): Promise<Prescription[]> {
    try {
      const res = await api.get('/pharmacist/reviews/pending')
      return res.data
    } catch {
      return []
    }
  },

  async getReviewById(id: number | string): Promise<Prescription | null> {
    try {
      const res = await api.get(`/pharmacist/reviews/${id}`)
      return res.data
    } catch {
      return null
    }
  },

  async submitReview(id: number | string, payload: {
    status: 'approved' | 'correction_required';
    comments?: string;
    correction_notes?: string;
  }): Promise<PharmacistReview> {
    const res = await api.post(`/pharmacist/reviews/${id}/action`, payload)
    return res.data
  },

  async getStats(): Promise<ReviewStats> {
    try {
      const res = await api.get('/pharmacist/stats')
      return res.data
    } catch {
      return {
        pending: 12,
        reviewed_today: 18,
        needs_clarification: 3,
        total_handovers: 64,
      }
    }
  },

  async getPatients(): Promise<User[]> {
    try {
      const res = await api.get('/pharmacist/patients')
      return res.data
    } catch {
      return []
    }
  },

  async getShiftNotes(): Promise<ShiftNote[]> {
    try {
      const res = await api.get('/pharmacist/shift-notes')
      return res.data
    } catch {
      return []
    }
  },
}
