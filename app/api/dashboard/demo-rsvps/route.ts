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

// Demo RSVP data
const demoRSVPs = [
  {
    _id: '1',
    email: 'john@example.com',
    invitedPerson: 'John Doe',
    names: ['John Doe', 'Jane Doe'],
    response: 'yes' as const,
    message: 'Looking forward to celebrating with you!',
    guestCount: 2,
    possibleInvites: 0,
    possibleInvitesInvited: 2,
    invitedBy: '',
    invitationValid: true,
    personalizedInvite: { name: 'John', gender: 'M' },
    timestamp: new Date().toISOString(),
    createdAt: new Date()
  },
  {
    _id: '2',
    email: 'smith@example.com',
    invitedPerson: 'Bob Smith',
    names: ['Bob Smith', 'Mary Smith', 'Tom Smith', 'Lisa Smith'],
    response: 'yes' as const,
    message: 'Excited to be there! No nuts for Tom please.',
    guestCount: 4,
    possibleInvites: 1,
    possibleInvitesInvited: 5,
    invitedBy: 'John Doe',
    invitationValid: true,
    personalizedInvite: null,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    _id: '3',
    email: 'browns@example.com',
    invitedPerson: 'Michael Brown',
    names: ['Michael Brown', 'Sarah Brown'],
    response: 'no' as const,
    message: 'Sorry, we have a conflict that weekend.',
    guestCount: 0,
    possibleInvites: 0,
    possibleInvitesInvited: 2,
    invitedBy: '',
    invitationValid: true,
    personalizedInvite: { name: 'Michael', gender: 'M' },
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000)
  },
  {
    _id: '4',
    email: 'johnsons@example.com',
    invitedPerson: 'Robert Johnson',
    names: ['Robert Johnson'],
    response: null,
    message: '',
    guestCount: 1,
    possibleInvites: 2,
    possibleInvitesInvited: 3,
    invitedBy: 'Bob Smith',
    invitationValid: true,
    personalizedInvite: null,
    timestamp: '',
    createdAt: new Date(Date.now() - 432000000)
  },
  {
    _id: '5',
    email: 'maria@example.com',
    invitedPerson: 'Maria Garcia',
    names: ['Maria Garcia'],
    response: 'yes' as const,
    message: 'Can\'t wait! Need gluten-free meal please.',
    guestCount: 1,
    possibleInvites: 0,
    possibleInvitesInvited: 1,
    invitedBy: '',
    invitationValid: true,
    personalizedInvite: { name: 'Maria', gender: 'F' },
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    createdAt: new Date(Date.now() - 259200000)
  },
  {
    _id: '6',
    email: 'wilsons@example.com',
    invitedPerson: 'David Wilson',
    names: ['David Wilson', 'Emma Wilson'],
    response: 'yes' as const,
    message: 'So happy for you both!',
    guestCount: 2,
    possibleInvites: 0,
    possibleInvitesInvited: 2,
    invitedBy: '',
    invitationValid: true,
    personalizedInvite: { name: 'David', gender: 'M' },
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    createdAt: new Date(Date.now() - 345600000)
  }
]

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
    
    // Filter demo data
    let filteredRSVPs = [...demoRSVPs]
    
    if (search) {
      filteredRSVPs = filteredRSVPs.filter(rsvp => 
        rsvp.invitedPerson.toLowerCase().includes(search.toLowerCase()) ||
        rsvp.email.toLowerCase().includes(search.toLowerCase()) ||
        rsvp.names.some(name => name.toLowerCase().includes(search.toLowerCase())) ||
        (rsvp.invitedBy && rsvp.invitedBy.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (status !== 'all') {
      switch (status) {
        case 'attending':
          filteredRSVPs = filteredRSVPs.filter(rsvp => rsvp.response === 'yes')
          break
        case 'declined':
          filteredRSVPs = filteredRSVPs.filter(rsvp => rsvp.response === 'no')
          break
        case 'pending':
          filteredRSVPs = filteredRSVPs.filter(rsvp => rsvp.response === null)
          break
      }
    }

    // Pagination
    const total = filteredRSVPs.length
    const skip = (page - 1) * limit
    const paginatedRSVPs = filteredRSVPs.slice(skip, skip + limit)

    return NextResponse.json({
      rsvps: paginatedRSVPs,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + limit < total,
        hasPrev: page > 1
      },
      isDemo: true
    })
  } catch (error) {
    console.error('Demo dashboard RSVPs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch demo RSVPs' },
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

    // For demo, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Demo mode - RSVP deletion simulated' 
    })
  } catch (error) {
    console.error('Delete demo RSVP error:', error)
    return NextResponse.json(
      { error: 'Failed to delete demo RSVP' },
      { status: 500 }
    )
  }
}