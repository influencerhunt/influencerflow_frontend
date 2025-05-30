'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  setUserFromAuth: (user: User, token: string) => void
  signup: (email: string, password: string, role: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        api.setAuthToken(token)
        const userData = await api.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password })
      localStorage.setItem('token', response.access_token)
      api.setAuthToken(response.access_token)
      setUser(response.user)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const setUserFromAuth = (user: User, token: string) => {
    localStorage.setItem('token', token)
    api.setAuthToken(token)
    setUser(user)
  }

  const loginWithGoogle = async () => {
    try {
      // Get Google OAuth URL from backend
      const { url } = await api.getGoogleAuthUrl()
      
      // Redirect to Google OAuth
      window.location.href = url
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  const signup = async (email: string, password: string, role: string) => {
    try {
      await api.signup({ email, password, role })
      // Note: User needs to verify email before they can login
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    api.setAuthToken('')
    setUser(null)
  }

  const value = {
    user,
    login,
    loginWithGoogle,
    setUserFromAuth,
    signup,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 