'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireRole?: string
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requireRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(fallbackPath)
      return
    }

    if (user && requireRole && user.role !== requireRole && user.role !== 'admin') {
      router.push('/dashboard') // Redirect to dashboard if insufficient permissions
      return
    }
  }, [user, loading, router, requireRole, fallbackPath])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  // Check role requirements
  if (requireRole && user.role !== requireRole && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You need the '{requireRole}' role to access this page.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your current role: <span className="font-medium capitalize">{user.role}</span>
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render children if all checks pass
  return <>{children}</>
}

// HOC version for easier use
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  requireRole?: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requireRole={requireRole}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
} 