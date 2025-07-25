import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { initializeEnvelopeAudio, playEnvelopeSound } from '@/utils/envelopeAudio'

export type AnimationState = 'initial' | 'opening' | 'letter-out' | 'letter-visible' | 'completed'

export interface PersonalizedData {
  name: string
  guestCount: number
  gender: string
}

export interface EnvelopeAnimationState {
  animationState: AnimationState
  showFloatingButton: boolean
  personalizedData: PersonalizedData | null
  shouldSkip: boolean
}

export interface EnvelopeAnimationActions {
  handleEnvelopeClick: () => void
  handleContinue: () => void
  resetAnimation: () => void
  setAnimationState: (state: AnimationState) => void
}

export function useEnvelopeAnimation(onComplete?: () => void): EnvelopeAnimationState & EnvelopeAnimationActions {
  const [animationState, setAnimationState] = useState<AnimationState>('initial')
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const [personalizedData, setPersonalizedData] = useState<PersonalizedData | null>(null)
  const [shouldSkip, setShouldSkip] = useState(false)
  const searchParams = useSearchParams()

  // Parse URL parameters and check if animation should be skipped
  useEffect(() => {
    const registered = searchParams.get('registered')
    const hasViewed = sessionStorage.getItem('envelope-viewed')
    
    if (registered || hasViewed) {
      setShouldSkip(true)
      setShowFloatingButton(!!hasViewed)
      return
    }

    // Parse personalization data
    const inviteParam = searchParams.get('invite')
    const genderParam = searchParams.get('g')
    
    if (inviteParam) {
      // Find guest count from URL parameters
      const params = Array.from(searchParams.entries())
      let guestCount = 1
      
      for (const [key] of params) {
        const match = key.match(/^([a-zA-Z]+)-(\d+)$/)
        if (match) {
          guestCount = parseInt(match[2], 10)
          break
        }
      }

      const decodedName = decodeURIComponent(inviteParam.replace(/\+/g, ' '))
      const capitalizedName = decodedName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

      setPersonalizedData({
        name: capitalizedName,
        guestCount,
        gender: genderParam === 'a' || genderParam === 'o' ? genderParam : 'o'
      })
    }
  }, [searchParams])

  // Initialize audio system
  useEffect(() => {
    if (typeof window !== 'undefined' && !shouldSkip) {
      const initAudio = async () => {
        try {
          await initializeEnvelopeAudio()
        } catch (error) {
          console.log('Audio initialization failed:', error)
        }
      }
      
      const handleInteraction = () => {
        initAudio()
        document.removeEventListener('click', handleInteraction)
        document.removeEventListener('touchstart', handleInteraction)
      }
      
      document.addEventListener('click', handleInteraction, { once: true })
      document.addEventListener('touchstart', handleInteraction, { once: true })
      
      return () => {
        document.removeEventListener('click', handleInteraction)
        document.removeEventListener('touchstart', handleInteraction)
      }
    }
  }, [shouldSkip])

  const handleEnvelopeClick = useCallback(() => {
    if (animationState === 'initial') {
      playEnvelopeSound('open')
      setAnimationState('opening')
      
      setTimeout(() => {
        playEnvelopeSound('unfold')
        setAnimationState('letter-out')
        
        setTimeout(() => {
          playEnvelopeSound('emerge')
          setAnimationState('letter-visible')
        }, 800)
      }, 600)
    }
  }, [animationState])

  const handleContinue = useCallback(() => {
    playEnvelopeSound('confirm')
    setAnimationState('completed')
    sessionStorage.setItem('envelope-viewed', 'true')
    setShowFloatingButton(true)
    
    setTimeout(() => {
      onComplete?.()
    }, 800)
  }, [onComplete])

  const resetAnimation = useCallback(() => {
    setAnimationState('initial')
  }, [])

  return {
    animationState,
    showFloatingButton,
    personalizedData,
    shouldSkip,
    handleEnvelopeClick,
    handleContinue,
    resetAnimation,
    setAnimationState
  }
}

// Hook for managing responsive design
export function useEnvelopeResponsive() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkResponsive = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    const checkMotionPreference = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
    }

    checkResponsive()
    checkMotionPreference()

    window.addEventListener('resize', checkResponsive)
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkMotionPreference)

    return () => {
      window.removeEventListener('resize', checkResponsive)
      mediaQuery.removeEventListener('change', checkMotionPreference)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    prefersReducedMotion
  }
}

// Hook for envelope performance optimization
export function useEnvelopePerformance() {
  const [isVisible, setIsVisible] = useState(true)
  const [shouldAnimate, setShouldAnimate] = useState(true)

  useEffect(() => {
    // Check if page is visible (for battery saving)
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    // Check device capabilities
    const checkPerformance = () => {
      // Disable complex animations on low-end devices
      const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
      const isSlowConnection = (navigator as any).connection?.effectiveType === 'slow-2g' || (navigator as any).connection?.effectiveType === '2g'
      
      setShouldAnimate(!isLowEndDevice && !isSlowConnection)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    checkPerformance()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return {
    isVisible,
    shouldAnimate: shouldAnimate && isVisible
  }
}