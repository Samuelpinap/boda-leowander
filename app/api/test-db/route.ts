import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    
    // Test database connection by listing collections
    const collections = await db.listCollections().toArray()
    
    // Insert a test document to verify write access
    const testCollection = db.collection('test')
    const testDoc = {
      message: 'Database connection test',
      timestamp: new Date(),
      success: true
    }
    
    const insertResult = await testCollection.insertOne(testDoc)
    
    // Clean up - remove the test document
    await testCollection.deleteOne({ _id: insertResult.insertedId })
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: 'leowanderboda',
      collections: collections.map(col => col.name),
      testInsert: insertResult.acknowledged
    })

  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'MongoDB connection failed'
    }, { status: 500 })
  }
}