'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUserFromAuth } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for errors first
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          setStatus('error')
          setMessage(`Authentication error: ${errorDescription || error}`)
          return
        }

        // Parse URL fragment for access_token (implicit flow)
        if (window.location.hash) {
          const fragment = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = fragment.get('access_token')
          
          if (accessToken) {
            console.log('Found access token in URL fragment (implicit flow)')
            
            try {
              // Send the token to our backend to verify and get user info
              const response = await api.exchangeGoogleToken(accessToken)
              setUserFromAuth(response.user, response.access_token)
              
              setStatus('success')
              setMessage('Authentication successful! Redirecting...')
              
              // Redirect to dashboard after a short delay
              setTimeout(() => {
                router.push('/dashboard')
              }, 1500)
              return
            } catch (error: any) {
              console.error('Token verification error:', error)
              throw new Error('Failed to verify access token')
            }
          }
        }

        // If no access token found, show error
        setStatus('error')
        setMessage('No access token received from authentication provider. Please try again.')
        
      } catch (error: any) {
        console.error('Callback error:', error)
        setStatus('error')
        const errorMessage = error.message || 'Failed to complete authentication'
        setMessage(errorMessage)
      }
    }

    handleCallback()
  }, [searchParams, router, setUserFromAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Authentication...
            </h2>
            <p className="text-gray-600">
              Please wait while we sign you in with Google.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Success!
            </h2>
            <p className="text-green-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-red-600 mb-4">{message}</p>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 