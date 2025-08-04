import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri: string = process.env.MONGODB_URI
const options = {
  serverSelectionTimeoutMS: 10000, // Reduced from 30s to 10s
  socketTimeoutMS: 20000, // Reduced from 45s to 20s
  connectTimeoutMS: 10000, // Reduced from 30s to 10s
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 3, // Reduced pool size for development
  minPoolSize: 1,
  maxIdleTimeMS: 10000, // Reduced from 30s to 10s
  waitQueueTimeoutMS: 10000, // Reduced from 30s to 10s
  // Additional options for better reliability
  heartbeatFrequencyMS: 2000,
  serverMonitoringMode: 'auto'
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
    const client = await clientPromise
    
    // Test the connection
    await client.db('admin').command({ ping: 1 })
    
    return client.db('leowanderboda')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    
    // Re-create the connection promise for next attempt
    if (process.env.NODE_ENV === 'development') {
      let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
      }
      const newClient = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = newClient.connect()
      clientPromise = globalWithMongo._mongoClientPromise
    } else {
      const newClient = new MongoClient(uri, options)
      clientPromise = newClient.connect()
    }
    
    throw error
  }
}