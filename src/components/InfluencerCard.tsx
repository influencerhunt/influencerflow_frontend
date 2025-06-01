"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  MapPin, 
  Users, 
  TrendingUp, 
  ExternalLink,
  Heart,
  MessageCircle,
  Instagram,
  Youtube,
  Twitter,
  Globe
} from 'lucide-react'

interface InfluencerProfile {
  id: string
  name: string
  username: string
  bio: string
  followers: number
  engagement_rate: number
  categories: string[]
  location: string
  profile_image: string
  rating: number
  verified: boolean
  platforms: {
    instagram?: string
    youtube?: string
    twitter?: string
    website?: string
  }
  recent_posts: number
  avg_likes: number
  price_range: string
}

interface InfluencerCardProps {
  influencer: InfluencerProfile
  onContact?: (influencer: InfluencerProfile) => void
  onSave?: (influencer: InfluencerProfile) => void
}

export function InfluencerCard({ influencer, onContact, onSave }: InfluencerCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />
      case 'youtube':
        return <Youtube className="w-4 h-4" />
      case 'twitter':
        return <Twitter className="w-4 h-4" />
      case 'website':
        return <Globe className="w-4 h-4" />
      default:
        return null
    }
  }

  const getEngagementColor = (rate: number) => {
    if (rate >= 7) return 'text-green-600'
    if (rate >= 4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.(influencer)
  }

  const handleContact = () => {
    onContact?.(influencer)
  }

  return (
    <CardSpotlight className="p-0 border-gray-200 bg-white group">
      <Card className="border-0 bg-transparent h-full">
        <CardContent className="pt-6 h-full flex flex-col">
          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <img
                src={influencer.profile_image}
                alt={influencer.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300"
              />
              {influencer.verified && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{influencer.name}</h3>
              <p className="text-sm text-muted-foreground">@{influencer.username}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{influencer.rating}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({formatNumber(Math.floor(Math.random() * 1000 + 100))} reviews)
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`p-2 ${isSaved ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-shrink-0">
            {influencer.bio}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Followers</p>
              <p className="font-semibold text-lg">{formatNumber(influencer.followers)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Engagement</p>
              <p className={`font-semibold text-lg ${getEngagementColor(influencer.engagement_rate)}`}>
                {influencer.engagement_rate}%
              </p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p className="text-muted-foreground">Avg. Likes</p>
              <p className="font-medium">{formatNumber(influencer.avg_likes)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Recent Posts</p>
              <p className="font-medium">{influencer.recent_posts}</p>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-4 flex-shrink-0">
            <div className="flex flex-wrap gap-1">
              {influencer.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {influencer.categories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{influencer.categories.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Location & Platforms */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{influencer.location}</span>
            </div>
            <div className="flex gap-2">
              {Object.entries(influencer.platforms).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-gray-100 rounded"
                >
                  {getPlatformIcon(platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Starting from</p>
              <p className="font-semibold text-green-700">
                💰 {influencer.price_range}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <Button 
              className="flex-1" 
              size="sm"
              onClick={handleContact}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button variant="outline" size="sm" className="px-3">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions - Visible on Hover */}
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-1 text-xs">
              <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
                View Portfolio
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
                Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardSpotlight>
  )
}
