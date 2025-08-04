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

    const wellWishData: WellWishesData = {
      name: body.name.trim(),
      email: body.email?.trim() || '',
      message: body.message.trim(),
      timestamp: body.timestamp || new Date().toISOString(),
      createdAt: new Date()
    }

    // Try to connect to database with timeout handling
    try {
      const db = await Promise.race([
        getDatabase(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timeout')), 8000)
        )
      ]) as any
      
      const collection = db.collection('well-wishes')
      const result = await collection.insertOne(wellWishData)

      return NextResponse.json({
        success: true,
        message: 'Well wish saved successfully',
        data: {
          name: wellWishData.name,
          message: wellWishData.message
        }
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      
      // Return error to user when database is down
      return NextResponse.json({
        success: false,
        error: 'El sistema no está disponible en este momento. Por favor, intenta más tarde o contacta directamente a Leowander & Sarah.',
        dbError: true
      }, { status: 503 })
    }

  } catch (error) {
    console.error('Error processing well wish:', error)
    return NextResponse.json(
      { error: 'Unable to process request. Please try again.' },
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
        setTimeout(() => reject(new Error('Database connection timeout')), 8000)
      )
    ]) as any
    
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
    return NextResponse.json({
      success: false,
      error: 'Database temporarily unavailable',
      message: 'Unable to fetch well wishes at this time',
      data: []
    }, { status: 503 })
  }
}