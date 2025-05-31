'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { supabase } from '@/lib/supabase'

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
      console.log('🔍 Checking authentication...')
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.log('❌ No token found in localStorage')
        setUser(null)
        setLoading(false)
        return
      }
      
      console.log('✅ Token found, verifying with backend...')
      api.setAuthToken(token)
      const userData = await api.getCurrentUser()
      console.log('✅ User data received:', userData)
      
      // Use a single state update to ensure synchronization
      setUser(userData)
      // Small delay to ensure user state is set before loading becomes false
      await new Promise(resolve => setTimeout(resolve, 0))
      setLoading(false)
      console.log('✅ Auth check complete - user set and loading disabled')
    } catch (error) {
      console.error('❌ Auth check failed:', error)
      console.log('🧹 Clearing invalid token from localStorage')
      localStorage.removeItem('token')
      api.setAuthToken('')
      setUser(null)
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
      // Use Supabase client directly for OAuth (this handles PKCE properly)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
      // The redirect will happen automatically
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