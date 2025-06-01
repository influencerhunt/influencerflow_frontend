import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

interface FilterOptions {
  platforms: string[]
  popular_niches: string[]
  follower_ranges: Array<{
    label: string
    min: number
    max: number
  }>
  price_ranges: Array<{
    label: string
    min: number
    max: number
  }>
  engagement_ranges: Array<{
    label: string
    min: number
    max: number
  }>
  popular_locations: string[]
}

export async function GET(request: NextRequest) {
  try {
    // Make request to backend API for filter options
    const response = await fetch(`${BACKEND_URL}/api/v1/search/filters/options`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // If backend fails, return mock filter options
      return NextResponse.json(getMockFilterOptions())
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Filter options API error:', error)
    
    // Fallback to mock filter options on error
    return NextResponse.json(getMockFilterOptions())
  }
}

function getMockFilterOptions(): FilterOptions {
  return {
    platforms: [
      'instagram',
      'youtube', 
      'tiktok',
      'twitter',
      'linkedin',
      'facebook'
    ],
    popular_niches: [
      'fashion',
      'beauty',
      'fitness',
      'food',
      'travel',
      'tech',
      'gaming',
      'lifestyle',
      'business',
      'health',
      'education',
      'entertainment',
      'sports',
      'music',
      'art',
      'photography',
      'parenting',
      'diy',
      'automotive',
      'finance'
    ],
    follower_ranges: [
      { label: 'Nano (1K-10K)', min: 1000, max: 10000 },
      { label: 'Micro (10K-100K)', min: 10000, max: 100000 },
      { label: 'Mid-tier (100K-1M)', min: 100000, max: 1000000 },
      { label: 'Macro (1M-10M)', min: 1000000, max: 10000000 },
      { label: 'Mega (10M+)', min: 10000000, max: 100000000 }
    ],
    price_ranges: [
      { label: 'Budget (<$100)', min: 0, max: 100 },
      { label: 'Standard ($100-$500)', min: 100, max: 500 },
      { label: 'Premium ($500-$1,500)', min: 500, max: 1500 },
      { label: 'High-end ($1,500-$5,000)', min: 1500, max: 5000 },
      { label: 'Enterprise ($5,000+)', min: 5000, max: 50000 }
    ],
    engagement_ranges: [
      { label: 'Low (0-2%)', min: 0, max: 2 },
      { label: 'Average (2-4%)', min: 2, max: 4 },
      { label: 'Good (4-6%)', min: 4, max: 6 },
      { label: 'High (6-8%)', min: 6, max: 8 },
      { label: 'Excellent (8%+)', min: 8, max: 20 }
    ],
    popular_locations: [
      'New York, NY',
      'Los Angeles, CA',
      'San Francisco, CA',
      'Miami, FL',
      'Chicago, IL',
      'Austin, TX',
      'Seattle, WA',
      'Boston, MA',
      'Atlanta, GA',
      'Las Vegas, NV',
      'London, UK',
      'Paris, France',
      'Tokyo, Japan',
      'Sydney, Australia',
      'Toronto, Canada'
    ]
  }
}
