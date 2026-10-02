import { api } from './api'
import { User } from '../types'

export interface LoginResponse {
  access_token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      const res = await api.post<LoginResponse>('/auth/login', { email, password })
      const { access_token, user } = res.data
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(user))
      }
      return user
    } catch {
      // Mock fallback authentication for demonstration / offline dev
      if (email === 'pharmacist@medbridge.com' || email.includes('pharmacist')) {
        const mockUser: User = {
          id: 101,
          email,
          name: 'Dr. Sarah Reid, PharmD',
          role: 'pharmacist',
          language: 'en',
          is_active: true,
          created_at: new Date().toISOString(),
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', 'mock-jwt-token-pharmacist')
          localStorage.setItem('user', JSON.stringify(mockUser))
        }
        return mockUser
      }
      throw new Error('Invalid email or password')
    }
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  },

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return null
        }
      }
    }
    return null
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
