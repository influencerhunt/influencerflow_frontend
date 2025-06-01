"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    company: "",
    website: "",
    location: "",
    phone: "",
    social_instagram: "",
    social_tiktok: "",
    social_youtube: "",
    social_twitter: "",
    interests: [] as string[],
    experience_level: "",
    budget_range: "",
    content_categories: [] as string[]
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const { user, updateUserProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're sure there's no user (not during loading)
    if (user === null) {
      // Small delay to ensure auth context has finished loading
      const timer = setTimeout(() => {
        if (!user) {
          router.push('/login')
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }
    
    // Pre-fill name if available
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || ""
      }))
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      // Call API to update user profile
      await updateUserProfile(formData)
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.response?.data?.detail || "Failed to complete profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      content_categories: prev.content_categories.includes(category)
        ? prev.content_categories.filter(c => c !== category)
        : [...prev.content_categories, category]
    }))
  }

  const interestOptions = [
    "Technology", "Fashion", "Beauty", "Fitness", "Food", "Travel", 
    "Gaming", "Music", "Art", "Sports", "Health", "Education",
    "Business", "Lifestyle", "Photography", "Design"
  ]

  const contentCategories = [
    "Instagram Posts", "Instagram Stories", "Instagram Reels", "TikTok Videos",
    "YouTube Videos", "YouTube Shorts", "Blog Posts", "Podcasts",
    "Live Streams", "Product Reviews", "Tutorials", "Unboxing"
  ]

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Help us personalize your InfluencerFlow experience by sharing more about yourself
          </CardDescription>
          <div className="flex justify-center mt-4">
            <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'influencer' ? 'secondary' : 'outline'}>
              {user.role} Account
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Professional Information */}
            {(user.role === 'brand' || user.role === 'influencer') && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Information</h3>
                
                {user.role === 'brand' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Your company name"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="budget_range">Monthly Marketing Budget</Label>
                      <Select onValueChange={(value) => handleSelectChange('budget_range', value)} disabled={loading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-1k">Under $1,000</SelectItem>
                          <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                          <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k-plus">$50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {user.role === 'influencer' && (
                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Experience Level</Label>
                    <Select onValueChange={(value) => handleSelectChange('experience_level', value)} disabled={loading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                        <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="website">Website/Portfolio</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media Profiles</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    name="social_instagram"
                    type="text"
                    placeholder="@username"
                    value={formData.social_instagram}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_tiktok">TikTok</Label>
                  <Input
                    id="social_tiktok"
                    name="social_tiktok"
                    type="text"
                    placeholder="@username"
                    value={formData.social_tiktok}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    name="social_youtube"
                    type="text"
                    placeholder="Channel URL or @handle"
                    value={formData.social_youtube}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter/X</Label>
                  <Input
                    id="social_twitter"
                    name="social_twitter"
                    type="text"
                    placeholder="@username"
                    value={formData.social_twitter}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Interests & Categories</h3>
              <p className="text-sm text-muted-foreground">
                Select the topics and categories that interest you most
              </p>
              
              <div className="space-y-3">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Button
                      key={interest}
                      type="button"
                      size="sm"
                      variant={formData.interests.includes(interest) ? "default" : "outline"}
                      onClick={() => handleInterestToggle(interest)}
                      disabled={loading}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>

              {user.role === 'influencer' && (
                <div className="space-y-3">
                  <Label>Content Types You Create</Label>
                  <div className="flex flex-wrap gap-2">
                    {contentCategories.map((category) => (
                      <Button
                        key={category}
                        type="button"
                        size="sm"
                        variant={formData.content_categories.includes(category) ? "default" : "outline"}
                        onClick={() => handleCategoryToggle(category)}
                        disabled={loading}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Completing Profile..." : "Complete Profile"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard')} disabled={loading}>
                Skip for Now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 