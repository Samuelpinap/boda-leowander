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

    const db = await getDatabase()
    
    // Get wedding date and max guests from environment
    const weddingDate = process.env.WEDDING_DATE || '2025-11-29T15:00:00'
    const maxGuests = parseInt(process.env.MAX_GUESTS || '150')
    
    // Calculate days until wedding
    const today = new Date()
    const wedding = new Date(weddingDate)
    const daysUntilWedding = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 3600 * 24))

    // Aggregate RSVP statistics
    const rsvpStats = await db.collection('invitados').aggregate([
      {
        $group: {
          _id: null,
          totalInvitations: { $sum: 1 },
          confirmedGuests: {
            $sum: {
              $cond: [{ $eq: ['$response', 'yes'] }, '$guestCount', 0]
            }
          },
          declined: {
            $sum: {
              $cond: [{ $eq: ['$response', 'no'] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [
                { $or: [
                  { $eq: ['$response', null] },
                  { $not: { $in: ['$response', ['yes', 'no']] } }
                ]}, 
                1, 
                0
              ]
            }
          },
          responded: {
            $sum: {
              $cond: [{ $in: ['$response', ['yes', 'no']] }, 1, 0]
            }
          },
          totalPossibleInvites: {
            $sum: { $ifNull: ['$possibleInvitesInvited', 0] }
          },
          validInvitations: {
            $sum: {
              $cond: [{ $eq: ['$invitationValid', true] }, 1, 0]
            }
          },
          // Calculate unused spots from each invitation
          unusedSpots: {
            $sum: {
              $cond: [
                { $eq: ['$response', 'yes'] },
                {
                  $subtract: [
                    { $ifNull: ['$possibleInvitesInvited', '$guestCount'] },
                    '$guestCount'
                  ]
                },
                0
              ]
            }
          }
        }
      }
    ]).toArray()

    // Get well wishes count
    const wellWishesCount = await db.collection('well-wishes').countDocuments()

    // Get visit tracking statistics
    const visitStats = await db.collection('visit-tracking').aggregate([
      {
        $group: {
          _id: null,
          totalVisits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' },
          visitsToday: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$visitedAt',
                    new Date(new Date().setHours(0, 0, 0, 0))
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          totalVisits: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          visitsToday: 1
        }
      }
    ]).toArray()

    // Get visit timeline (visits over time)
    const visitTimeline = await db.collection('visit-tracking').aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$visitedAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    // Get visits by inviter
    const visitsByInviter = await db.collection('visit-tracking').aggregate([
      {
        $group: {
          _id: '$invitedBy',
          visits: { $sum: 1 }
        }
      },
      { $sort: { visits: -1 } }
    ]).toArray()

    // Get dietary restrictions summary (counting messages)
    const dietaryRestrictions = await db.collection('invitados').aggregate([
      { $match: { 
        $and: [
          { message: { $ne: null } },
          { message: { $ne: '' } }
        ]
      }},
      { $group: { _id: null, count: { $sum: 1 } } }
    ]).toArray()

    // Get RSVP timeline (responses over time)
    const rsvpTimeline = await db.collection('invitados').aggregate([
      { $match: { 
        response: { $in: ['yes', 'no'] },
        $or: [
          { timestamp: { $exists: true } },
          { createdAt: { $exists: true } }
        ]
      }},
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $ifNull: ['$createdAt', { $toDate: '$timestamp' }] }
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    // Get recent RSVPs
    const recentRSVPs = await db.collection('invitados').find({
      response: { $in: ['yes', 'no'] }
    }).sort({ createdAt: -1, _id: -1 }).limit(5).toArray()

    // Get recent well wishes
    const recentWellWishes = await db.collection('well-wishes').find({})
      .sort({ createdAt: -1, _id: -1 }).limit(5).toArray()

    const stats = rsvpStats[0] || {
      totalInvitations: 0,
      confirmedGuests: 0,
      declined: 0,
      pending: 0,
      responded: 0,
      totalPossibleInvites: 0,
      validInvitations: 0,
      unusedSpots: 0
    }

    const visits = visitStats[0] || {
      totalVisits: 0,
      uniqueVisitors: 0,
      visitsToday: 0
    }

    const responseRate = stats.totalInvitations > 0 
      ? Math.round((stats.responded / stats.totalInvitations) * 100) 
      : 0

    // Get RSVPs from visit tracking start date onwards for conversion rate calculation
    const visitTrackingStartDate = new Date('2025-08-28T00:00:00.000Z')
    const rsvpsFromTrackingStart = await db.collection('invitados').countDocuments({
      response: { $in: ['yes', 'no'] },
      $or: [
        { createdAt: { $gte: visitTrackingStartDate } },
        { timestamp: { $gte: visitTrackingStartDate } }
      ]
    })

    // Calculate conversion rate (RSVPs from tracking start vs total visits)
    const conversionRate = visits.totalVisits > 0 
      ? Math.round((rsvpsFromTrackingStart / visits.totalVisits) * 100) 
      : 0

    // Available spots are the unused invitation capacity
    const availableSpots = stats.unusedSpots

    return NextResponse.json({
      metrics: {
        totalInvitations: stats.totalInvitations,
        confirmedGuests: stats.confirmedGuests,
        pending: stats.pending,
        declined: stats.declined,
        responseRate,
        daysUntilWedding,
        wellWishesCount,
        availableSpots,
        totalPossibleInvites: stats.totalPossibleInvites,
        validInvitations: stats.validInvitations,
        // Visit tracking metrics
        totalVisits: visits.totalVisits,
        uniqueVisitors: visits.uniqueVisitors,
        visitsToday: visits.visitsToday,
        conversionRate
      },
      charts: {
        rsvpTimeline: rsvpTimeline.map(item => ({
          date: item._id,
          responses: item.count
        })),
        visitTimeline: visitTimeline.map(item => ({
          date: item._id,
          visits: item.count
        })),
        statusBreakdown: [
          { name: 'Attending', value: stats.confirmedGuests, color: '#22c55e' },
          { name: 'Declined', value: stats.declined, color: '#ef4444' },
          { name: 'Pending', value: stats.pending, color: '#f59e0b' }
        ],
        visitsByInviter: visitsByInviter.map(item => ({
          inviter: item._id,
          visits: item.visits
        }))
      },
      recent: {
        rsvps: recentRSVPs.map(rsvp => ({
          ...rsvp,
          _id: rsvp._id.toString(),
          date: rsvp.createdAt || rsvp.timestamp
        })),
        wellWishes: recentWellWishes.map(wish => ({
          ...wish,
          _id: wish._id.toString(),
          date: wish.createdAt || wish.timestamp
        }))
      },
      dietaryRestrictionsCount: dietaryRestrictions[0]?.count || 0
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}