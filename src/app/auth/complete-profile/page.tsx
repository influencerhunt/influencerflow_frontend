'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { RoleSelection } from '@/components/RoleSelection'
import { api } from '@/lib/api'

type UserRole = 'influencer' | 'brand'

export default function CompleteProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, setUserFromAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Get temporary user data from URL params (passed from OAuth callback)
  const tempUserId = searchParams.get('user_id')
  const tempEmail = searchParams.get('email')
  const tempToken = searchParams.get('token')

  useEffect(() => {
    // If user is already authenticated and has a proper role (not 'user'), redirect to dashboard
    if (user && user.role && user.role !== 'user') {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleRoleSelect = async (role: UserRole) => {
    setIsLoading(true)
    setError('')

    try {
      // If we have temp data from OAuth, update the user's role
      if (tempUserId && tempEmail && tempToken) {
        // Call API to update user role
        const response = await fetch('/api/auth/update-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tempToken}`
          },
          body: JSON.stringify({
            user_id: tempUserId,
            role: role
          })
        })

        if (!response.ok) {
          throw new Error('Failed to update user role')
        }

        const userData = await response.json()

        // Update auth context with new user data
        setUserFromAuth({
          id: tempUserId,
          email: tempEmail,
          role: role
        }, tempToken)

        // Redirect to dashboard
        router.push('/dashboard')
      } else if (user) {
        // Update existing user's role
        api.setAuthToken(localStorage.getItem('token') || '')
        await api.updateUserRole(role)
        
        // Update auth context
        setUserFromAuth({
          ...user,
          role: role
        }, localStorage.getItem('token') || '')

        router.push('/dashboard')
      } else {
        throw new Error('No user data available')
      }
    } catch (error: any) {
      console.error('Failed to update role:', error)
      setError('Failed to complete profile setup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <RoleSelection 
          onRoleSelect={handleRoleSelect}
          isLoading={isLoading}
          title="Welcome to InfluencerFlow!"
          subtitle="Complete your profile by selecting your account type"
          showBackToLogin={false}
        />
      </div>
    </div>
  )
} 