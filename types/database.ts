export interface RSVPData {
  _id?: string
  email: string
  invitedPerson: string  // The main person who was invited (first name)
  names: string[]        // All attendees including the invited person
  response: 'yes' | 'no'
  message?: string
  guestCount: number
  possibleInvites?: number      // Additional guests allowed (not counting the invited person)
  possibleInvitesInvited?: number // Total allowed (including the invited person)
  invitedBy?: string
  invitationValid: boolean
  personalizedInvite?: {
    name: string
    gender: string
  } | null
  timestamp: string
  createdAt?: Date
  updatedAt?: Date
}

export interface InvitationData {
  _id?: string
  invitedBy: string
  guestCount: number
  email?: string
  isUsed: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface WellWishesData {
  _id?: string
  name: string
  email?: string
  message: string
  timestamp: string
  createdAt?: Date
  updatedAt?: Date
}

export interface VisitTrackingData {
  _id?: string
  invitedBy: string           // Who sent the invitation (from URL params like "leowander-2")
  invitedPerson?: string      // Name from personalized invite (from "invite" param)
  guestLimit: number          // Number from invitation params
  personalizedGender?: string // Gender from "g" param
  visitedAt: Date
  ipAddressHash?: string      // Hashed IP for privacy
  userAgent?: string          // Browser info
  referrer?: string           // Where they came from
  sessionId: string           // Unique session identifier
  createdAt?: Date
}