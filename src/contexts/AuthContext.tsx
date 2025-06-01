'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  role: string | null
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
  updateUserRole: (role: string) => Promise<User>
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
      
      // Check if user needs role selection or onboarding (after successful auth)
      console.log('🔍 User role check:', { role: userData.role, typeof: typeof userData.role })
      
      if (!userData.role || (userData.role !== 'influencer' && userData.role !== 'brand')) {
        console.log('👤 Role not set or invalid, redirecting to role selection...')
        // Show loading state for a bit longer for better UX
        await new Promise(resolve => setTimeout(resolve, 800))
        setLoading(false)
        // Only redirect if we're not already on role-selection page
        if (!window.location.pathname.includes('/auth/role-selection')) {
          setTimeout(() => {
            window.location.href = '/auth/role-selection'
          }, 200)
        }
        return
      } else if (!userData.profile_completed) {
        console.log('👤 Profile incomplete, redirecting to onboarding...')
        // Show loading state for a bit longer for better UX
        await new Promise(resolve => setTimeout(resolve, 800))
        setLoading(false)
        // Only redirect if we're not already on onboarding page
        if (!window.location.pathname.includes('/onboarding')) {
          setTimeout(() => {
            window.location.href = '/onboarding'
          }, 200)
        }
        return
      }
      
      // Small delay to ensure user state is set before loading becomes false
      await new Promise(resolve => setTimeout(resolve, 300))
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
    console.log('🔧 Setting user from auth:', user)
    localStorage.setItem('token', token)
    api.setAuthToken(token)
    setUser(user)
    
    // Check role and onboarding status for redirect
    const isSignupIntent = localStorage.getItem('oauth_signup_intent') === 'true'
    const needsRoleSelection = !user.role || (user.role !== 'influencer' && user.role !== 'brand')
    const needsOnboarding = (user.role === 'influencer' || user.role === 'brand') && (isSignupIntent || !user.profile_completed)
    
    console.log('🎯 User flow check:', {
      isSignupIntent,
      role: user.role,
      roleType: typeof user.role,
      profile_completed: user.profile_completed,
      needsRoleSelection,
      needsOnboarding
    })
    
    if (needsRoleSelection) {
      console.log('📍 Redirecting to role selection...')
      localStorage.removeItem('oauth_signup_intent')
      // Use a small delay to ensure state is set
      setTimeout(() => {
        window.location.href = '/auth/role-selection'
      }, 50)
    } else if (needsOnboarding) {
      console.log('📍 Redirecting to onboarding...')
      localStorage.removeItem('oauth_signup_intent')
      // Use a small delay to ensure state is set
      setTimeout(() => {
        window.location.href = '/onboarding'
      }, 50)
    } else {
      console.log('📍 User setup complete, can go to dashboard')
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

  const updateUserRole = async (role: string) => {
    try {
      const updatedUser = await api.updateUserRole(role)
      console.log('🔄 Role updated successfully:', updatedUser)
      // Update user state with complete user object
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Role update failed:', error)
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
    updateUserRole,
    logout,
    loading,
  }

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">InfluencerFlow</h1>
          <p className="text-muted-foreground">
            Setting up your account...
          </p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 