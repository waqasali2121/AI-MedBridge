'use client'

import { useState, useEffect, useCallback } from 'react'
import { User } from '../types'
import { authService } from '../services/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, pass: string) => {
    setLoading(true)
    try {
      const loggedUser = await authService.login(email, pass)
      setUser(loggedUser)
      return loggedUser
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user || authService.isAuthenticated(),
  }
}
