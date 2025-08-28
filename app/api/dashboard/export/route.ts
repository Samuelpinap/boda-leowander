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
    const type = searchParams.get('type') || 'rsvps'

    const db = await getDatabase()

    if (type === 'rsvps') {
      // Export RSVPs as CSV
      const rsvps = await db.collection('rsvps').find({}).sort({ submittedAt: -1 }).toArray()

      const csvHeader = 'Guest Name,Guest ID,Guest Count,Status,RSVP Date,Email,Dietary Restrictions,Confirmation Number\n'
      
      const csvData = rsvps.map(rsvp => {
        const status = rsvp.attending === 'yes' ? 'Attending' : 
                     rsvp.attending === 'no' ? 'Declined' : 'Pending'
        const date = rsvp.submittedAt ? new Date(rsvp.submittedAt).toLocaleDateString() : 'N/A'
        
        return [
          rsvp.guestName || 'N/A',
          rsvp.guestId || 'N/A',
          rsvp.guestCount || '0',
          status,
          date,
          rsvp.email || 'N/A',
          (rsvp.dietaryRestrictions || '').replace(/,/g, ';'), // Replace commas to avoid CSV issues
          rsvp.confirmationNumber || 'N/A'
        ].join(',')
      }).join('\n')

      const csvContent = csvHeader + csvData

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="wedding_rsvps_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    if (type === 'wellwishes') {
      // Export well wishes as JSON
      const wellWishes = await db.collection('wellWishes').find({}).sort({ submittedAt: -1 }).toArray()

      const exportData = {
        exported_at: new Date().toISOString(),
        total_messages: wellWishes.length,
        messages: wellWishes.map(wish => ({
          guest_name: wish.guestName,
          message: wish.message,
          submitted_at: wish.submittedAt,
          id: wish._id.toString()
        }))
      }

      return new Response(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="wedding_wellwishes_${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid export type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}