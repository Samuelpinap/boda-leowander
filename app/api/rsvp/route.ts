import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { RSVPData } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body: RSVPData = await request.json()
    
    // Validate required fields
    if (!body.email || !body.names || body.names.length === 0 || !body.response) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Filter out empty names
    const validNames = body.names.filter(name => name.trim())
    if (validNames.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid name is required' },
        { status: 400 }
      )
    }

    // Try to connect to database with timeout handling
    let db, collection, existingRSVP
    try {
      db = await Promise.race([
        getDatabase(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timeout')), 15000)
        )
      ]) as any
      
      collection = db.collection('invitados')
      // Check if email already exists (update existing RSVP)
      existingRSVP = await collection.findOne({ email: body.email })
    } catch (dbError) {
      console.error('Database error:', dbError)
      
      // Log the RSVP locally as fallback
      console.log('FALLBACK - RSVP received:', {
        email: body.email,
        names: validNames,
        response: body.response,
        guestCount: body.guestCount,
        timestamp: body.timestamp || new Date().toISOString()
      })
      
      // Return success to user even if database is down
      return NextResponse.json({
        success: true,
        message: 'RSVP received successfully',
        data: {
          email: body.email,
          names: validNames,
          response: body.response,
          guestCount: body.guestCount
        },
        fallback: true
      })
    }

    const rsvpData: RSVPData = {
      email: body.email,
      names: validNames,
      response: body.response,
      message: body.message || '',
      guestCount: body.guestCount,
      invitedBy: body.invitedBy || '',
      invitationValid: body.invitationValid || false,
      personalizedInvite: body.personalizedInvite || null,
      timestamp: body.timestamp || new Date().toISOString(),
      updatedAt: new Date()
    }

    let result
    if (existingRSVP) {
      // Update existing RSVP
      result = await collection.updateOne(
        { email: body.email },
        { 
          $set: rsvpData
        }
      )
    } else {
      // Create new RSVP
      rsvpData.createdAt = new Date()
      result = await collection.insertOne(rsvpData)
    }

    return NextResponse.json({
      success: true,
      message: existingRSVP ? 'RSVP updated successfully' : 'RSVP created successfully',
      data: {
        email: body.email,
        names: validNames,
        response: body.response,
        guestCount: body.guestCount
      }
    })

  } catch (error) {
    console.error('Error processing RSVP:', error)
    return NextResponse.json(
      { error: 'Unable to process RSVP. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Try to connect to database with timeout handling
    const db = await Promise.race([
      getDatabase(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 15000)
      )
    ]) as any
    
    const collection = db.collection('invitados')
    
    // Get all RSVPs (for admin purposes - you might want to add authentication)
    const rsvps = await collection.find({}).toArray()
    
    return NextResponse.json({
      success: true,
      count: rsvps.length,
      data: rsvps
    })

  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    return NextResponse.json({
      success: false,
      error: 'Database temporarily unavailable',
      message: 'Unable to fetch RSVPs at this time',
      data: []
    }, { status: 503 })
  }
}