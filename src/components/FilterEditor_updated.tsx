"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Star,
  DollarSign,
  X
} from 'lucide-react'

interface SearchFilters {
  platform?: string
  followers_min?: number
  followers_max?: number
  price_min?: number
  price_max?: number
  location?: string
  niche?: string
  engagement_min?: number
  engagement_max?: number
  verified_only?: boolean
}

interface FilterEditorProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'facebook', name: 'Facebook', icon: '👥' },
]

const NICHES = [
  'Fashion', 'Beauty', 'Fitness', 'Food', 'Travel', 'Tech', 
  'Gaming', 'Lifestyle', 'Business', 'Health', 'Education',
  'Entertainment', 'Sports', 'Music', 'Art', 'Photography'
]

const LOCATIONS = [
  'New York, NY', 'Los Angeles, CA', 'San Francisco, CA', 'Miami, FL',
  'Chicago, IL', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
  'Atlanta, GA', 'Las Vegas, NV', 'London, UK', 'Paris, France',
  'Tokyo, Japan', 'Sydney, Australia', 'Toronto, Canada'
]

export function FilterEditor({ filters, onFiltersChange, open, onOpenChange }: FilterEditorProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onOpenChange(false)
  }

  const handleClearFilters = () => {
    const emptyFilters: SearchFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
    onOpenChange(false)
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Advanced Filters
          </DialogTitle>
          <DialogDescription>
            Fine-tune your search criteria to find the perfect influencers
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={localFilters.platform || ''}
                onValueChange={(value) => updateFilter('platform', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Platforms</SelectItem>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Niche Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Niche</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={localFilters.niche || ''}
                onValueChange={(value) => updateFilter('niche', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Niches</SelectItem>
                  {NICHES.map((niche) => (
                    <SelectItem key={niche} value={niche.toLowerCase()}>
                      {niche}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Follower Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Followers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-followers">Minimum</Label>
                  <Input
                    id="min-followers"
                    type="number"
                    placeholder="e.g., 10000"
                    value={localFilters.followers_min || ''}
                    onChange={(e) => updateFilter('followers_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="max-followers">Maximum</Label>
                  <Input
                    id="max-followers"
                    type="number"
                    placeholder="e.g., 1000000"
                    value={localFilters.followers_max || ''}
                    onChange={(e) => updateFilter('followers_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
              </div>
              {(localFilters.followers_min || localFilters.followers_max) && (
                <p className="text-sm text-muted-foreground">
                  Range: {formatNumber(localFilters.followers_min || 0)} - {formatNumber(localFilters.followers_max || 10000000)} followers
                </p>
              )}
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Engagement Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-engagement">Minimum (%)</Label>
                  <Input
                    id="min-engagement"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.0"
                    value={localFilters.engagement_min || ''}
                    onChange={(e) => updateFilter('engagement_min', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="max-engagement">Maximum (%)</Label>
                  <Input
                    id="max-engagement"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10.0"
                    value={localFilters.engagement_max || ''}
                    onChange={(e) => updateFilter('engagement_max', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price per Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-price">Minimum ($)</Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="e.g., 100"
                    value={localFilters.price_min || ''}
                    onChange={(e) => updateFilter('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="max-price">Maximum ($)</Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="e.g., 5000"
                    value={localFilters.price_max || ''}
                    onChange={(e) => updateFilter('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={localFilters.location || ''}
                onValueChange={(value) => updateFilter('location', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={localFilters.verified_only || false}
                onCheckedChange={(checked) => updateFilter('verified_only', checked)}
              />
              <Label htmlFor="verified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Only show verified influencers
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All Filters
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
