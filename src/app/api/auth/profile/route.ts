import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')

    if (!token) {
      return NextResponse.json({ detail: 'No authorization token provided' }, { status: 401 })
    }

    console.log('🔄 Forwarding profile update request to backend...')
    
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('✅ Backend response:', data)

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Profile update error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
} 