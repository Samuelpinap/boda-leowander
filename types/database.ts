export interface RSVPData {
  _id?: string
  email: string
  names: string[]
  response: 'yes' | 'no'
  message?: string
  guestCount: number
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