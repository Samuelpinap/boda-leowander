import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { WellWishesData } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body: WellWishesData = await request.json()
    
    // Validate required fields
    if (!body.name || !body.message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection('well-wishes')

    const wellWishData: WellWishesData = {
      name: body.name.trim(),
      email: body.email?.trim() || '',
      message: body.message.trim(),
      timestamp: body.timestamp || new Date().toISOString(),
      createdAt: new Date()
    }

    const result = await collection.insertOne(wellWishData)

    return NextResponse.json({
      success: true,
      message: 'Well wish saved successfully',
      data: {
        name: wellWishData.name,
        message: wellWishData.message
      }
    })

  } catch (error) {
    console.error('Error saving well wish:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection('well-wishes')
    
    // Get all well wishes, sorted by creation date (newest first)
    const wellWishes = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      count: wellWishes.length,
      data: wellWishes
    })

  } catch (error) {
    console.error('Error fetching well wishes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}