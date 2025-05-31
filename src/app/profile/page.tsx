'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface UserProfile {
  id: string
  email: string
  role: string
  created_at?: string
}

export default function ProfilePage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Only redirect if we're not loading AND there's definitely no user
    // This prevents race conditions where loading becomes false before user is set
    if (loading) {
      return // Still loading, don't do anything yet
    }
    
    if (!user) {
      console.log('No user found after auth check, redirecting to login')
      router.push('/login')
      return
    }

    console.log('User found, fetching profile:', user)
    fetchUserProfile()
  }, [user, loading, router])

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true)
      const profile = await api.getCurrentUser()
      setUserProfile(profile)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      setError('Failed to load profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading || profileLoading) {
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {userProfile?.id || user.id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {userProfile?.email || user.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      (userProfile?.role || user.role) === 'admin' 
                        ? 'bg-red-100 text-red-800'
                        : (userProfile?.role || user.role) === 'influencer'
                        ? 'bg-purple-100 text-purple-800'
                        : (userProfile?.role || user.role) === 'brand'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {userProfile?.role || user.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role-specific Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Role Features</h2>
                
                <div className="border rounded-lg p-4">
                  {(userProfile?.role || user.role) === 'admin' && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">Admin Features</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Manage all users</li>
                        <li>• Access admin dashboard</li>
                        <li>• View platform analytics</li>
                        <li>• Configure system settings</li>
                      </ul>
                    </div>
                  )}

                  {(userProfile?.role || user.role) === 'influencer' && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">Influencer Features</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Create content campaigns</li>
                        <li>• Connect with brands</li>
                        <li>• Track performance metrics</li>
                        <li>• Manage collaborations</li>
                      </ul>
                    </div>
                  )}

                  {(userProfile?.role || user.role) === 'brand' && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">Brand Features</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Launch campaigns</li>
                        <li>• Find influencers</li>
                        <li>• Manage brand assets</li>
                        <li>• Track ROI</li>
                      </ul>
                    </div>
                  )}

                  {(userProfile?.role || user.role) === 'user' && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">User Features</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Browse content</li>
                        <li>• Follow influencers</li>
                        <li>• Basic platform access</li>
                        <li>• Upgrade to premium roles</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  onClick={fetchUserProfile}
                  variant="outline"
                >
                  Refresh Profile
                </Button>
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 