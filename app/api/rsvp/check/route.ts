import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { invitedPerson } = await request.json()
    
    if (!invitedPerson) {
      return NextResponse.json(
        { error: 'Invited person name is required' },
        { status: 400 }
      )
    }

    try {
      const db = await Promise.race([
        getDatabase(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timeout')), 10000)
        )
      ]) as any
      
      const collection = db.collection('invitados')
      
      // Escape special regex characters in the name
      const escapedName = invitedPerson.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const existingPerson = await collection.findOne({ 
        invitedPerson: { $regex: new RegExp(`^${escapedName}$`, 'i') }
      })
      
      return NextResponse.json({
        exists: !!existingPerson,
        email: existingPerson?.email || null
      })
      
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Return false if database is down
      return NextResponse.json({
        exists: false,
        error: 'Unable to check at this time'
      })
    }

  } catch (error) {
    console.error('Error checking RSVP:', error)
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}