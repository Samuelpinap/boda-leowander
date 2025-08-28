import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri: string = process.env.MONGODB_URI

// Simplified connection with minimal options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 60000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 60000,
  maxIdleTimeMS: 30000,
}

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (db && client) {
    return { client, db }
  }

  try {
    console.log('Connecting to MongoDB...')
    client = new MongoClient(uri, options)
    await client.connect()
    
    // Test the connection
    await client.db('admin').command({ ping: 1 })
    console.log('Connected to MongoDB successfully')
    
    db = client.db('leowanderboda')
    return { client, db }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    
    // Close the client on error
    if (client) {
      await client.close().catch(console.error)
      client = null
      db = null
    }
    
    throw new Error('Failed to connect to MongoDB: ' + (error as Error).message)
  }
}