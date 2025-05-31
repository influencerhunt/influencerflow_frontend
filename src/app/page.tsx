"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {user ? `Welcome back, ${user.email.split('@')[0]}!` : 'Welcome to InfluencerFlow'}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          {user 
            ? 'Ready to explore your dashboard and connect with brands and creators?'
            : 'A modern platform built with Next.js 15.3, Tailwind CSS 4, and shadcn/ui'
          }
        </p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <>
              <Button size="lg" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/profile">View Profile</Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator className="mb-12" />

      {user && (
        <>
          {/* User Status Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👋 Your Account Status
                <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'influencer' ? 'secondary' : 'outline'}>
                  {user.role}
                </Badge>
              </CardTitle>
              <CardDescription>
                You're logged in as {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {user.role === 'admin' && 'You have full administrative access to the platform.'}
                {user.role === 'influencer' && 'You can create content, manage campaigns, and connect with brands.'}
                {user.role === 'brand' && 'You can create campaigns, discover influencers, and manage collaborations.'}
                {user.role === 'user' && 'You have basic access to browse and discover content.'}
              </p>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                {user.role === 'admin' && (
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Separator className="mb-12" />
        </>
      )}

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 Modern Stack
              <Badge variant="secondary">New</Badge>
            </CardTitle>
            <CardDescription>
              Built with the latest technologies for optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Next.js 15.3</li>
              <li>• React 19</li>
              <li>• Tailwind CSS 4</li>
              <li>• TypeScript</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Beautiful UI
              <Badge variant="outline">Featured</Badge>
            </CardTitle>
            <CardDescription>
              Clean and accessible components with shadcn/ui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Accessible components</li>
              <li>• Dark mode support</li>
              <li>• Responsive design</li>
              <li>• Clean animations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚡ Performance</CardTitle>
            <CardDescription>
              Optimized for speed and user experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Server components</li>
              <li>• Optimized builds</li>
              <li>• Fast navigation</li>
              <li>• SEO friendly</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Explore InfluencerFlow</CardTitle>
          <CardDescription>
            Discover all the features and capabilities of our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start" asChild>
              <Link href="/features">
                <div className="text-left">
                  <h3 className="font-semibold mb-1">Platform Features</h3>
                  <p className="text-sm text-muted-foreground">Explore what makes InfluencerFlow special</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start" asChild>
              <Link href="/contact">
                <div className="text-left">
                  <h3 className="font-semibold mb-1">Get in Touch</h3>
                  <p className="text-sm text-muted-foreground">Contact us for questions or support</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Component Showcase - Only show for non-authenticated users */}
      {!user && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Component Showcase</CardTitle>
            <CardDescription>
              Basic shadcn/ui components working perfectly with Tailwind CSS 4
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="text-sm font-medium mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <Separator />

            {/* Badges */}
            <div>
              <h3 className="text-sm font-medium mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            <Separator />

            {/* Button Sizes */}
            <div>
              <h3 className="text-sm font-medium mb-3">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Built with ❤️ using modern web technologies</p>
      </div>
    </div>
  )
}
