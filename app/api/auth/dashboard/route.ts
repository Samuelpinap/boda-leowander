import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'wedding-dashboard-secret-2024'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const dashboardPassword = process.env.DASHBOARD_PASSWORD
    
    if (!dashboardPassword) {
      return NextResponse.json(
        { error: 'Dashboard password not configured' },
        { status: 500 }
      )
    }

    // For simplicity, we'll do a direct comparison. In production, the stored password should be hashed
    const isValid = password === dashboardPassword

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { authorized: true, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return NextResponse.json({ 
      success: true, 
      token 
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { authorized: false },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    try {
      jwt.verify(token, JWT_SECRET)
      return NextResponse.json({ authorized: true })
    } catch {
      return NextResponse.json(
        { authorized: false },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}