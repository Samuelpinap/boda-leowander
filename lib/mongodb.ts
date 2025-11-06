import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri: string = process.env.MONGODB_URI
const options = {
  serverSelectionTimeoutMS: 30000, // Increased timeout for initial connection
  socketTimeoutMS: 30000, // Increased timeout for operations
  connectTimeoutMS: 30000, // Increased connection timeout
  retryWrites: true,
  w: 'majority' as const,
  maxPoolSize: 5, // Slightly larger pool
  minPoolSize: 1, // Keep at least 1 connection open
  maxIdleTimeMS: 30000, // Longer idle time to maintain connections
  waitQueueTimeoutMS: 10000, // Reasonable queue timeout
  // Connection stability optimizations
  heartbeatFrequencyMS: 30000, // Less frequent heartbeats to reduce load
  serverMonitoringMode: 'auto' as const, // Let MongoDB decide the best mode
  compressors: ['zlib' as const], // Enable compression
  zlibCompressionLevel: 6,
  // Retry configuration
  retryReads: true,
  readPreference: 'primary' as const
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch(err => {
      console.error('MongoDB initial connection failed:', err)
      throw err
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch(err => {
    console.error('MongoDB initial connection failed:', err)
    throw err
  })
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
  try {
    console.log('Attempting to connect to MongoDB...')
    const client = await clientPromise
    
    // Test the connection with a simple ping
    console.log('Testing MongoDB connection with ping...')
    await client.db('admin').command({ ping: 1 })
    console.log('MongoDB connection successful')
    
    return client.db('leowanderboda')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3)
      })
    }
    
    // Re-create the connection promise for next attempt
    console.log('Recreating MongoDB connection promise...')
    if (process.env.NODE_ENV === 'development') {
      let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
      }
      const newClient = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = newClient.connect().catch(err => {
        console.error('MongoDB reconnection failed:', err)
        throw err
      })
      clientPromise = globalWithMongo._mongoClientPromise
    } else {
      const newClient = new MongoClient(uri, options)
      clientPromise = newClient.connect().catch(err => {
        console.error('MongoDB reconnection failed:', err)
        throw err
      })
    }
    
    throw error
  }
}