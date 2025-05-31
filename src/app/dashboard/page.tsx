'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface TestResult {
  success: boolean
  data?: any
  error?: string
}

interface TestResults {
  [key: string]: TestResult
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [testResults, setTestResults] = useState<TestResults>({})
  const [isLoading, setIsLoading] = useState(false)
  
  // Debug logging
  console.log('🎯 Dashboard render - loading:', loading, 'user:', user)
  
  useEffect(() => {
    console.log('🚀 Dashboard useEffect - loading:', loading, 'user:', user)
    
    // Only redirect if we're definitely not loading and definitely have no user
    if (!loading && !user) {
      console.log('🔄 Redirecting to login...')
      router.push('/login')
    }
  }, [user, loading, router])

  const testEndpoint = async (endpoint: string, testName: string) => {
    setIsLoading(true)
    try {
      let result
      switch (endpoint) {
        case 'protected':
          result = await api.testProtected()
          break
        case 'admin':
          result = await api.testAdminOnly()
          break
        case 'influencer':
          result = await api.testInfluencerOnly()
          break
        default:
          result = { error: 'Unknown endpoint' }
      }
      setTestResults((prev: TestResults) => ({ ...prev, [testName]: { success: true, data: result } }))
    } catch (error: any) {
      setTestResults((prev: TestResults) => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error.response?.data?.detail || error.message 
        } 
      }))
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome to your Dashboard!
                  </h1>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">User ID:</span> {user.id}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-gray-600 mr-2">Role:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'influencer'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'brand'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {/* <Button onClick={() => router.push('/profile')}>
                    View Profile
                  </Button> */}
                </div>
              </div>
            </div>
          </div>

          {/* API Testing Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">API Testing</h2>
              <p className="text-sm text-gray-600 mb-6">
                Test different API endpoints based on your role and permissions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <Button
                    onClick={() => testEndpoint('protected', 'Protected Route')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Test Protected Route
                  </Button>
                  {testResults['Protected Route'] && (
                    <div className={`p-3 rounded text-xs ${
                      testResults['Protected Route'].success 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-red-50 text-red-800'
                    }`}>
                      {testResults['Protected Route'].success 
                        ? JSON.stringify(testResults['Protected Route'].data, null, 2)
                        : testResults['Protected Route'].error
                      }
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => testEndpoint('admin', 'Admin Only')}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    Test Admin Only
                  </Button>
                  {testResults['Admin Only'] && (
                    <div className={`p-3 rounded text-xs ${
                      testResults['Admin Only'].success 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-red-50 text-red-800'
                    }`}>
                      {testResults['Admin Only'].success 
                        ? JSON.stringify(testResults['Admin Only'].data, null, 2)
                        : testResults['Admin Only'].error
                      }
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => testEndpoint('influencer', 'Influencer Only')}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    Test Influencer Only
                  </Button>
                  {testResults['Influencer Only'] && (
                    <div className={`p-3 rounded text-xs ${
                      testResults['Influencer Only'].success 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-red-50 text-red-800'
                    }`}>
                      {testResults['Influencer Only'].success 
                        ? JSON.stringify(testResults['Influencer Only'].data, null, 2)
                        : testResults['Influencer Only'].error
                      }
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">How it works:</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• <strong>Protected Route:</strong> Available to all authenticated users</li>
                  <li>• <strong>Admin Only:</strong> Only accessible by users with 'admin' role</li>
                  <li>• <strong>Influencer Only:</strong> Only accessible by users with 'influencer' role</li>
                  <li>• Admins can access all endpoints regardless of specific role requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 