import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestId, guestName } = body

    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('wedding')
    const collection = db.collection('visits')

    // Get current timestamp
    const timestamp = new Date()

    // Find existing visitor record or create new one
    const existingVisitor = await collection.findOne({ guestId })

    if (existingVisitor) {
      // Increment visit count and add new timestamp
      await collection.updateOne(
        { guestId },
        {
          $inc: { visitCount: 1 },
          $push: { visitTimestamps: timestamp },
          $set: { lastVisit: timestamp, guestName: guestName || existingVisitor.guestName }
        }
      )
    } else {
      // Create new visitor record
      await collection.insertOne({
        guestId,
        guestName: guestName || 'Unknown Guest',
        visitCount: 1,
        firstVisit: timestamp,
        lastVisit: timestamp,
        visitTimestamps: [timestamp]
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Visit tracked successfully' 
    })
  } catch (error) {
    console.error('Visit tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guestId = searchParams.get('guestId')

    const client = await clientPromise
    const db = client.db('wedding')
    const collection = db.collection('visits')

    if (guestId) {
      // Get specific guest visit data
      const visitor = await collection.findOne({ guestId })
      return NextResponse.json(visitor || null)
    } else {
      // Get all visit data
      const visits = await collection.find({}).toArray()
      return NextResponse.json(visits)
    }
  } catch (error) {
    console.error('Error fetching visits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visits' },
      { status: 500 }
    )
  }
}