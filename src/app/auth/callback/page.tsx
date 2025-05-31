"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

export default function AuthCallbackPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUserFromAuth } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...')
        
        // Get the authorization code from URL parameters
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        
        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }
        
        if (!code) {
          throw new Error('No authorization code found in URL')
        }

        console.log('✅ Authorization code found:', code.substring(0, 10) + '...')
        
        // Exchange the authorization code for our backend token
        const response = await api.exchangeGoogleCode(code)
        console.log('✅ Backend authentication successful')
        
        // Set user in auth context (this will handle onboarding redirect if needed)
        setUserFromAuth(response.user, response.access_token)
        
        // If we get here, user doesn't need onboarding
        router.push('/dashboard')
        
      } catch (error: any) {
        console.error('❌ OAuth callback error:', error)
        setError(error.message || 'Authentication failed')
        setLoading(false)
        
        // Redirect to login after error
        setTimeout(() => {
          router.push('/login?error=' + encodeURIComponent(error.message || 'Authentication failed'))
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams, setUserFromAuth])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Authentication Failed</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to login page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-4">Completing Sign In</h1>
        <p className="text-muted-foreground">
          Please wait while we set up your account...
        </p>
      </div>
    </div>
  )
} 