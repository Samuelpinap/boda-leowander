"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { useEnvelopeAnimation, useEnvelopeResponsive, useEnvelopePerformance } from '@/hooks/useEnvelopeAnimation'

interface EnvelopeAnimationProps {
  onComplete: () => void
  children: React.ReactNode
}

export default function EnvelopeAnimation({ onComplete, children }: EnvelopeAnimationProps) {
  const {
    animationState,
    showFloatingButton,
    personalizedData,
    shouldSkip,
    handleEnvelopeClick,
    handleContinue,
    resetAnimation
  } = useEnvelopeAnimation(onComplete)

  const { isMobile, isTablet, prefersReducedMotion } = useEnvelopeResponsive()
  const { shouldAnimate } = useEnvelopePerformance()

  // Responsive sizing classes
  const getEnvelopeSize = () => {
    if (isMobile) return 'w-[90%] max-w-xs'
    if (isTablet) return 'w-3/5 max-w-md'
    return 'w-2/5 max-w-lg'
  }

  const getTextSize = () => {
    if (isMobile) return 'text-sm'
    if (isTablet) return 'text-sm'
    return 'text-sm'
  }

  const getLetterScale = () => {
    if (isMobile) return 'scale-100'
    if (isTablet) return 'scale-110'
    return 'scale-125'
  }

  const getLetterPosition = () => {
    if (isMobile) return '-translate-y-4'
    if (isTablet) return '-translate-y-8'
    return '-translate-y-12'
  }

  if (shouldSkip) {
    return (
      <div className="relative">
        {children}
        {showFloatingButton && (
          <button
            onClick={resetAnimation}
            className="fixed bottom-20 right-6 z-50 bg-orange-100 hover:bg-orange-200 border-2 border-wedding-accent text-wedding-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Ver invitación nuevamente"
          >
            <div className="text-xl">✉️</div>
          </button>
        )}
      </div>
    )
  }

  if (animationState === 'completed') {
    return (
      <div className="relative">
        {children}
        <button
          onClick={resetAnimation}
          className="fixed bottom-20 right-6 z-50 bg-orange-100 hover:bg-orange-200 border-2 border-wedding-accent text-wedding-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Ver invitación nuevamente"
        >
          <div className="text-xl">✉️</div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Static Envelope Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/images/envelope-letter.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Letter Card that appears after a delay */}
      {animationState === 'letter-visible' && (
        <div className={`relative z-10 ${getEnvelopeSize()} animate-fade-in`}>
          <div
            className={`flex flex-col items-center py-6 px-6 justify-center bg-gradient-to-br from-orange-50 to-amber-50 w-full border-2 border-wedding-accent shadow-2xl rounded-lg ${
              isMobile ? 'h-auto min-h-[400px]' : 'h-auto min-h-[500px]'
            } transition-all duration-800 ease-out transform scale-95 hover:scale-100`}
          >
            {/* Letter content */}
            <div className={`text-center transition-all duration-600 delay-300 opacity-100 translate-y-0`}>
              {/* Letter header */}
              <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
                <div className={`text-wedding-accent ${isMobile ? 'text-lg' : 'text-xl'} ${isMobile ? 'mb-3' : 'mb-4'}`}>✦ ❤ ✦</div>
                <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-dancing text-wedding-primary ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  ¡Querid{personalizedData?.gender === 'a' ? 'a' : personalizedData?.gender === 'o' ? 'o' : 'o/a'} {personalizedData?.name || 'Invitado/a'}!
                </h3>
              </div>

              {/* Letter body */}
              <div className={`${isMobile ? 'space-y-3' : 'space-y-4'} ${getTextSize()} leading-relaxed text-wedding-blush font-playfair ${isMobile ? 'max-w-xs' : 'max-w-md'}`}>
                <p>Nos complace enormemente invitarte a nuestra celebración de amor.</p>
                <p>Tu presencia hará que este día sea aún más especial.</p>
                {personalizedData && personalizedData.guestCount > 1 && (
                  <p>Puedes traer {personalizedData.guestCount - 1} acompañante{personalizedData.guestCount > 2 ? 's' : ''} contigo.</p>
                )}
                <div className={`${isMobile ? 'py-3' : 'py-4'}`}>
                  <div className={`text-wedding-accent ${isMobile ? 'text-lg' : 'text-xl'}`}>♥</div>
                </div>
                <p className={`font-dancing ${isMobile ? 'text-base' : 'text-lg'}`}>Con amor,</p>
                <p className={`font-dancing ${isMobile ? 'text-xl' : 'text-2xl'} text-wedding-primary`}>Leowander & Sarah</p>
                <div className={`${isMobile ? 'text-sm' : 'text-sm'} text-wedding-blush ${isMobile ? 'mt-3' : 'mt-4'} space-y-1`}>
                  <p>29 de Noviembre, 2025</p>
                  <p>Santiago, República Dominicana</p>
                </div>
              </div>

              {/* Action button */}
              <div className={`${isMobile ? 'mt-6' : 'mt-8'} transition-all duration-500 delay-500`}>
                <Button
                  onClick={handleContinue}
                  className={`bg-gradient-to-r from-wedding-primary to-wedding-accent hover:from-wedding-accent hover:to-wedding-secondary text-white ${isMobile ? 'px-6 py-3 text-sm' : 'px-8 py-3 text-base'} rounded-full font-dancing shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                >
                  Ver más detalles ✨
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial click prompt */}
      {animationState === 'initial' && (
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={handleEnvelopeClick}
        >
          <div className="absolute bottom-8 left-0 right-0 text-center text-white animate-bounce">
            <div className="text-2xl font-dancing">Toca aquí para abrir tu invitación</div>
          </div>
        </div>
      )}

    </div>
  )
}