"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to your Dashboard, {user.full_name || user.email.split('@')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your InfluencerFlow account
        </p>
      </div>

      {/* User Info Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              Your Profile
              <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'influencer' ? 'secondary' : 'outline'}>
                {user.role}
              </Badge>
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href="/onboarding">Complete Profile</Link>
              </Button>
              <Button size="sm" variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Account information and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="mb-3">{user.email}</p>
              
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p className="mb-3">{user.full_name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Account Type</p>
              <p className="mb-3 capitalize">{user.role}</p>
              
              <p className="text-sm font-medium text-muted-foreground">Profile Status</p>
              <div className="flex items-center gap-2">
                <Badge variant={user.profile_completed ? 'secondary' : 'outline'}>
                  {user.profile_completed ? 'Complete' : 'Incomplete'}
                </Badge>
                {!user.profile_completed && (
                  <Button size="sm" asChild>
                    <Link href="/onboarding">Complete Now</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific content */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>🛠️ Admin Tools</CardTitle>
              <CardDescription>
                Administrative functions and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" disabled>
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === 'influencer' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>📊 Content Analytics</CardTitle>
                <CardDescription>
                  Track your content performance and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/content-analysis">
                      YouTube Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    Engagement Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>🤝 Brand Collaborations</CardTitle>
                <CardDescription>
                  Manage your partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    Active Campaigns
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    Browse Opportunities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === 'brand' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>🎯 Campaign Management</CardTitle>
                <CardDescription>
                  Create and manage your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    Create Campaign
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    Active Campaigns
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>🔍 Influencer Discovery</CardTitle>
                <CardDescription>
                  Find the perfect creators for your brand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    Browse Influencers
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    Saved Profiles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Common cards for all users */}
        <Card>
          <CardHeader>
            <CardTitle>💬 Messages</CardTitle>
            <CardDescription>
              Communication center
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                Inbox (0)
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Sent Messages
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ Settings</CardTitle>
            <CardDescription>
              Account and notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/onboarding">Edit Profile</Link>
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Notifications
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📈 Quick Stats</CardTitle>
          <CardDescription>
            Your account overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Active Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Messages</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {user.profile_completed ? '100%' : '50%'}
              </p>
              <p className="text-sm text-muted-foreground">Profile Complete</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Notifications</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 