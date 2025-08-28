import { NextRequest, NextResponse } from 'next/server'
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

    // Get wedding date and max guests from environment
    const weddingDate = process.env.WEDDING_DATE || '2025-11-29T15:00:00'
    const maxGuests = parseInt(process.env.MAX_GUESTS || '150')
    
    // Calculate days until wedding
    const today = new Date()
    const wedding = new Date(weddingDate)
    const daysUntilWedding = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 3600 * 24))

    // Demo data for testing the dashboard
    const demoStats = {
      totalInvitations: 45,
      confirmedGuests: 78,
      declined: 8,
      pending: 12,
      responded: 33
    }

    const responseRate = Math.round((demoStats.responded / demoStats.totalInvitations) * 100)
    const availableSpots = maxGuests - demoStats.confirmedGuests

    // Generate demo timeline data
    const rsvpTimeline = []
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    
    for (let i = 0; i < 30; i += 3) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      rsvpTimeline.push({
        date: date.toISOString().split('T')[0],
        responses: Math.floor(Math.random() * 5) + 1
      })
    }

    return NextResponse.json({
      metrics: {
        totalInvitations: demoStats.totalInvitations,
        confirmedGuests: demoStats.confirmedGuests,
        pending: demoStats.pending,
        declined: demoStats.declined,
        responseRate,
        daysUntilWedding,
        wellWishesCount: 23,
        availableSpots,
        totalPossibleInvites: 180,
        validInvitations: 42
      },
      charts: {
        rsvpTimeline,
        statusBreakdown: [
          { name: 'Attending', value: demoStats.confirmedGuests, color: '#22c55e' },
          { name: 'Declined', value: demoStats.declined, color: '#ef4444' },
          { name: 'Pending', value: demoStats.pending, color: '#f59e0b' }
        ]
      },
      recent: {
        rsvps: [
          {
            _id: 'demo1',
            invitedPerson: 'John Doe',
            email: 'john@example.com',
            names: ['John Doe', 'Jane Doe'],
            response: 'yes',
            message: 'Looking forward to celebrating with you!',
            guestCount: 2,
            possibleInvitesInvited: 2,
            invitedBy: 'Direct',
            invitationValid: true,
            date: new Date().toISOString()
          },
          {
            _id: 'demo2',
            invitedPerson: 'The Smith Family',
            email: 'smith@example.com',
            names: ['Bob Smith', 'Mary Smith', 'Tom Smith', 'Lisa Smith'],
            response: 'yes',
            guestCount: 4,
            possibleInvitesInvited: 5,
            invitedBy: 'John Doe',
            invitationValid: true,
            date: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        wellWishes: [
          {
            _id: 'wish1',
            name: 'Sarah Johnson',
            message: 'Congratulations on your special day! Wishing you both a lifetime of love and happiness.',
            date: new Date().toISOString()
          },
          {
            _id: 'wish2',
            name: 'Mike & Lisa Chen',
            message: 'So excited for you both! May your marriage be filled with joy and laughter.',
            date: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      },
      dietaryRestrictionsCount: 5,
      isDemo: true
    })
  } catch (error) {
    console.error('Demo dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch demo dashboard statistics' },
      { status: 500 }
    )
  }
}