import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
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

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const db = await getDatabase()
    
    // Build query
    let query: any = {}
    
    if (search) {
      query.$or = [
        { invitedPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { names: { $regex: search, $options: 'i' } },
        { invitedBy: { $regex: search, $options: 'i' } }
      ]
    }

    if (status !== 'all') {
      switch (status) {
        case 'attending':
          query.response = 'yes'
          break
        case 'declined':
          query.response = 'no'
          break
        case 'pending':
          query.$or = [
            { response: null },
            { response: { $nin: ['yes', 'no'] } }
          ]
          break
      }
    }

    // Get total count for pagination
    const total = await db.collection('invitados').countDocuments(query)

    // Get RSVPs with pagination
    const rsvps = await db.collection('invitados')
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      rsvps: rsvps.map(rsvp => ({
        _id: rsvp._id.toString(),
        email: rsvp.email,
        invitedPerson: rsvp.invitedPerson,
        names: rsvp.names || [],
        response: rsvp.response,
        message: rsvp.message || '',
        guestCount: rsvp.guestCount,
        possibleInvites: rsvp.possibleInvites,
        possibleInvitesInvited: rsvp.possibleInvitesInvited,
        invitedBy: rsvp.invitedBy || '',
        invitationValid: rsvp.invitationValid || false,
        personalizedInvite: rsvp.personalizedInvite,
        timestamp: rsvp.timestamp,
        createdAt: rsvp.createdAt,
        updatedAt: rsvp.updatedAt
      })),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Dashboard RSVPs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const rsvpId = searchParams.get('id')

    if (!rsvpId) {
      return NextResponse.json(
        { error: 'RSVP ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    
    const { ObjectId } = require('mongodb')
    const result = await db.collection('invitados').deleteOne({
      _id: new ObjectId(rsvpId)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete RSVP error:', error)
    return NextResponse.json(
      { error: 'Failed to delete RSVP' },
      { status: 500 }
    )
  }
}