"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

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

export default function SearchParamsHandler({
  onInvitationUpdate,
  onPersonalizedInviteUpdate,
  onFormDataUpdate
}: SearchParamsHandlerProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const parseInvitation = () => {
      const params = Array.from(searchParams.entries())
      let foundValidInvitation = false
      
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
        
        // Track the visit
        const trackVisit = async () => {
          try {
            await fetch('/api/visits', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                guestId: inviteParam.toLowerCase().replace(/\s+/g, '-'),
                guestName: capitalizedName
              })
            })
          } catch (error) {
            console.error('Failed to track visit:', error)
          }
        }
        
        trackVisit()
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