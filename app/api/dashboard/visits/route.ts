import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('wedding')
    const collection = db.collection('visits')

    // Get all visitor data with aggregation for statistics
    const visitors = await collection.find({}).toArray()
    
    // Calculate statistics
    const totalVisitors = visitors.length
    const totalVisits = visitors.reduce((sum, visitor) => sum + visitor.visitCount, 0)
    
    // Sort by most recent visit
    const sortedVisitors = visitors.sort((a, b) => {
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    })

    return NextResponse.json({
      statistics: {
        totalVisitors,
        totalVisits,
        averageVisitsPerGuest: totalVisitors > 0 ? (totalVisits / totalVisitors).toFixed(2) : 0
      },
      visitors: sortedVisitors
    })
  } catch (error) {
    console.error('Error fetching visit statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visit statistics' },
      { status: 500 }
    )
  }
}