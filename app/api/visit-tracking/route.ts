import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { VisitTrackingData } from '@/types/database'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'wedding-dashboard-secret-2024'

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }

  const token = authHeader.split(' ')[1]
  
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.invitedBy || !body.guestLimit || !body.sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get client IP and hash it for privacy
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const ipAddressHash = crypto.createHash('sha256').update(clientIP + 'salt').digest('hex')

    // Get user agent and referrer
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''

    const db = await getDatabase()
    const collection = db.collection('visit-tracking')

    // Check for recent visit from same session/IP to prevent duplicates
    const recentVisit = await collection.findOne({
      $and: [
        {
          $or: [
            { sessionId: body.sessionId },
            { ipAddressHash: ipAddressHash }
          ]
        },
        { invitedBy: body.invitedBy },
        { 
          visitedAt: { 
            $gte: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes window
          } 
        }
      ]
    })

    if (recentVisit) {
      return NextResponse.json({
        success: true,
        message: 'Visit already tracked recently',
        duplicate: true
      })
    }

    const visitData: VisitTrackingData = {
      invitedBy: body.invitedBy,
      invitedPerson: body.invitedPerson || '',
      guestLimit: body.guestLimit,
      personalizedGender: body.personalizedGender || '',
      visitedAt: new Date(),
      ipAddressHash: ipAddressHash,
      userAgent: userAgent.substring(0, 200), // Limit length
      referrer: referrer.substring(0, 200),   // Limit length
      sessionId: body.sessionId,
      createdAt: new Date()
    }

    const result = await collection.insertOne(visitData)

    return NextResponse.json({
      success: true,
      message: 'Visit tracked successfully',
      visitId: result.insertedId.toString()
    })

  } catch (error) {
    console.error('Error tracking visit:', error)
    return NextResponse.json(
      { error: 'Unable to track visit. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication for dashboard access
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection('visit-tracking')
    
    // Get all visits, sorted by creation date (newest first) - for admin purposes
    const visits = await collection
      .find({})
      .sort({ visitedAt: -1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      count: visits.length,
      data: visits.map(visit => ({
        ...visit,
        _id: visit._id.toString(),
        // Remove sensitive data in response
        ipAddressHash: undefined
      }))
    })

  } catch (error) {
    console.error('Error fetching visits:', error)
    return NextResponse.json({
      success: false,
      error: 'Database temporarily unavailable',
      message: 'Unable to fetch visits at this time',
      data: []
    }, { status: 503 })
  }
}