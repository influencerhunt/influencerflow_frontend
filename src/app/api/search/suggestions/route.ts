import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Make request to backend API for search suggestions
    const response = await fetch(`${BACKEND_URL}/api/v1/search/suggestions?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // If backend fails, return mock suggestions
      const mockSuggestions = generateMockSuggestions(query)
      return NextResponse.json(mockSuggestions)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Search suggestions API error:', error)
    
    // Fallback to mock suggestions on error
    const query = new URL(request.url).searchParams.get('query') || ''
    const mockSuggestions = generateMockSuggestions(query)
    return NextResponse.json(mockSuggestions)
  }
}

function generateMockSuggestions(query: string): string[] {
  const suggestions = [
    `${query} influencers`,
    `${query} content creators`,
    `${query} bloggers`,
    `${query} with high engagement`,
    `${query} in New York`,
    `${query} in Los Angeles`,
    `${query} under $500`,
    `${query} with 100K+ followers`,
    `verified ${query} influencers`,
    `${query} YouTubers`
  ]

  // Filter out duplicates and empty suggestions
  return suggestions
    .filter(suggestion => suggestion.trim() !== query && suggestion.trim().length > 0)
    .slice(0, 6)
}
