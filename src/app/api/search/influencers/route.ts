import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, filters, limit = 20, include_external = true } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Make request to backend API for AI-powered search
    const response = await fetch(`${BACKEND_URL}/api/v1/search/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query, 
        filters,
        limit,
        include_external 
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json(
        { error: errorData || 'Search failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Influencer search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const limit = searchParams.get('limit') || '20'
    const platform = searchParams.get('platform')
    const location = searchParams.get('location')
    const followers_min = searchParams.get('followers_min')
    const followers_max = searchParams.get('followers_max')
    const price_min = searchParams.get('price_min')
    const price_max = searchParams.get('price_max')
    const verified_only = searchParams.get('verified_only')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Build query parameters for backend
    const params = new URLSearchParams({ query, limit })
    if (platform) params.append('platform', platform)
    if (location) params.append('location', location)
    if (followers_min) params.append('followers_min', followers_min)
    if (followers_max) params.append('followers_max', followers_max)
    if (price_min) params.append('price_min', price_min)
    if (price_max) params.append('price_max', price_max)
    if (verified_only) params.append('verified_only', verified_only)

    const response = await fetch(`${BACKEND_URL}/api/v1/search/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json(
        { error: errorData || 'Search failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Influencer search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
