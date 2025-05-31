'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  role: string
  full_name?: string
  profile_completed?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  setUserFromAuth: (user: User, token: string) => void
  signup: (userData: { email: string; password: string; full_name: string; role: string }) => Promise<void>
  updateUserProfile: (profileData: any) => Promise<void>
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
      
      // Check if user needs onboarding
      if (!response.user.profile_completed) {
        window.location.href = '/onboarding'
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const setUserFromAuth = (user: User, token: string) => {
    localStorage.setItem('token', token)
    api.setAuthToken(token)
    setUser(user)
    
    // Check if user needs onboarding (for OAuth flows)
    const isSignupIntent = localStorage.getItem('oauth_signup_intent') === 'true'
    if (isSignupIntent || !user.profile_completed) {
      localStorage.removeItem('oauth_signup_intent')
      window.location.href = '/onboarding'
    }
  }

  const loginWithGoogle = async () => {
    try {
      console.log('🔄 Starting Google OAuth flow...')
      
      // Get the Google OAuth URL from our backend
      const { url } = await api.getGoogleAuthUrl()
      
      console.log('✅ Got Google OAuth URL, redirecting...')
      
      // Redirect to Google OAuth
      window.location.href = url
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  const signup = async (userData: { email: string; password: string; full_name: string; role: string }) => {
    try {
      await api.signup(userData)
      // Note: User needs to verify email before they can login
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const updateUserProfile = async (profileData: any) => {
    try {
      const updatedUser = await api.updateUserProfile(profileData)
      setUser(updatedUser)
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('oauth_signup_intent')
    api.setAuthToken('')
    setUser(null)
  }

  const value = {
    user,
    login,
    loginWithGoogle,
    setUserFromAuth,
    signup,
    updateUserProfile,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 