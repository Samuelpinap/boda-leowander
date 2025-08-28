"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

interface SearchParamsHandlerProps {
  onInvitationUpdate: (data: {
    invitedBy: string
    guestCount: number
    isValid: boolean
  }) => void
  onPersonalizedInviteUpdate: (data: {
    name: string
    gender: string
    isPersonalized: boolean
  }) => void
  onFormDataUpdate: (guestCount: number) => void
}

// Generate a unique session ID
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Track visit only once per session with proper locking
async function trackVisit(
  invitationData: {
    invitedBy: string
    guestCount: number
    invitedPerson?: string
    personalizedGender?: string
  },
  isTrackingRef: React.MutableRefObject<boolean>
) {
  // Prevent concurrent tracking calls
  if (isTrackingRef.current) {
    return // Already tracking
  }

  // Check if we've already tracked this session
  const sessionKey = `visit_tracked_${invitationData.invitedBy}_${invitationData.guestCount}`
  if (sessionStorage.getItem(sessionKey)) {
    return // Already tracked in this session
  }

  // Set tracking flag
  isTrackingRef.current = true

  try {
    // Generate or get existing session ID
    let sessionId = sessionStorage.getItem('wedding_session_id')
    if (!sessionId) {
      sessionId = generateSessionId()
      sessionStorage.setItem('wedding_session_id', sessionId)
    }

    const response = await fetch('/api/visit-tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invitedBy: invitationData.invitedBy,
        guestLimit: invitationData.guestCount,
        invitedPerson: invitationData.invitedPerson,
        personalizedGender: invitationData.personalizedGender,
        sessionId: sessionId
      })
    })

    if (response.ok) {
      // Mark as tracked in this session
      sessionStorage.setItem(sessionKey, 'tracked')
      console.log('Visit tracked successfully')
    }
  } catch (error) {
    console.error('Failed to track visit:', error)
    // Fail silently - don't affect the user experience
  } finally {
    // Always release the lock
    isTrackingRef.current = false
  }
}

export default function SearchParamsHandler({
  onInvitationUpdate,
  onPersonalizedInviteUpdate,
  onFormDataUpdate
}: SearchParamsHandlerProps) {
  const searchParams = useSearchParams()
  const hasTrackedRef = useRef(false) // Prevent multiple tracking calls
  const isTrackingRef = useRef(false) // Prevent concurrent tracking calls

  useEffect(() => {
    const parseInvitation = async () => {
      const params = Array.from(searchParams.entries())
      let foundValidInvitation = false
      let trackingData: any = {}
      
      // Check for personalized invite parameter first
      const inviteParam = searchParams.get('invite')
      const genderParam = searchParams.get('g') // 'a' for female, 'o' for male
      
      if (inviteParam) {
        // Replace + with spaces and decode
        const decodedName = decodeURIComponent(inviteParam.replace(/\+/g, ' '))
        // Capitalize each word
        const capitalizedName = decodedName
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
        
        onPersonalizedInviteUpdate({
          name: capitalizedName,
          gender: genderParam === 'a' || genderParam === 'o' ? genderParam : '',
          isPersonalized: true
        })
        
        // Store for tracking
        trackingData.invitedPerson = capitalizedName
        trackingData.personalizedGender = genderParam
      }
      
      for (const [key, value] of params) {
        // Look for pattern like "leowander-2" or "maria-5"
        const match = key.match(/^([a-zA-Z]+)-(\d+)$/)
        if (match) {
          const [, inviterName, guestCountStr] = match
          const guestCount = parseInt(guestCountStr, 10)
          
          // Validate guest count (1-7)
          if (guestCount >= 1 && guestCount <= 7) {
            onInvitationUpdate({
              invitedBy: inviterName,
              guestCount: guestCount,
              isValid: true
            })
            
            onFormDataUpdate(guestCount)
            
            // Track the visit (only once per session)
            if (!hasTrackedRef.current && !isTrackingRef.current) {
              trackingData.invitedBy = inviterName
              trackingData.guestCount = guestCount
              
              hasTrackedRef.current = true // Set this immediately to prevent multiple calls
              await trackVisit(trackingData, isTrackingRef)
            }
            
            foundValidInvitation = true
            break
          }
        }
      }
      
      if (!foundValidInvitation) {
        // No valid invitation found - set default
        onInvitationUpdate({
          invitedBy: "",
          guestCount: 1,
          isValid: false
        })
      }
    }

    parseInvitation()
  }, [searchParams, onInvitationUpdate, onPersonalizedInviteUpdate, onFormDataUpdate])

  return null
}