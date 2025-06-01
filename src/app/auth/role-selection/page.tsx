"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2 } from "lucide-react"

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, updateUserRole } = useAuth()

  // Handle redirects in useEffect to avoid setState-in-render errors
  useEffect(() => {
    if (user && (user.role === 'influencer' || user.role === 'brand')) {
      console.log('🔄 User already has role:', user.role, 'redirecting to onboarding/dashboard')
      if (!user.profile_completed) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, router])

  const roles = [
    {
      id: "influencer",
      title: "Content Creator",
      description: "I create content and want to collaborate with brands",
      icon: Users,
      features: [
        "Showcase your content portfolio",
        "Connect with brands for sponsorships",
        "Track your audience analytics",
        "Manage collaboration opportunities"
      ]
    },
    {
      id: "brand",
      title: "Brand/Business", 
      description: "I represent a brand looking for influencer partnerships",
      icon: Building2,
      features: [
        "Find and connect with influencers",
        "Manage influencer campaigns",
        "Track campaign performance",
        "Access detailed analytics and reporting"
      ]
    }
  ]

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      setError("Please select an account type")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log('🔄 Updating user role to:', selectedRole)
      // Update user role via API
      const updatedUser = await updateUserRole(selectedRole)
      console.log('✅ Role update response:', updatedUser)
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirect to onboarding
      console.log('📍 Redirecting to onboarding...')
      router.push('/onboarding')
    } catch (error: any) {
      console.error('❌ Role selection error:', error)
      setError(error.response?.data?.detail || error.message || "Failed to update role. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking user role or if user already has influencer/brand role
  if (!user || (user && (user.role === 'influencer' || user.role === 'brand'))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {!user ? 'Loading...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Account Type</h1>
          <p className="text-muted-foreground text-lg">
            Let us know how you plan to use InfluencerFlow
          </p>
          <div className="flex justify-center mt-4">
            <Badge variant="outline" className="text-sm">
              Welcome, {user.email}
            </Badge>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6 max-w-md mx-auto">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedRole === role.id 
                    ? 'ring-2 ring-primary border-primary shadow-lg' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">
                    <div className={`rounded-full p-4 ${
                      selectedRole === role.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <Icon size={32} />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={handleRoleSelect}
            disabled={!selectedRole || loading}
            size="lg"
            className="w-full max-w-md"
          >
            {loading ? "Setting up your account..." : "Continue"}
          </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            You can change your account type later in your profile settings
          </p>
        </div>
      </div>
    </div>
  )
}
