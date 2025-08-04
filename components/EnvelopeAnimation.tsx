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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Botanical decorative elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-8 left-8 text-6xl text-wedding-sage">🌿</div>
        <div className="absolute top-12 right-12 text-5xl text-wedding-sage rotate-45">🌿</div>
        <div className="absolute bottom-12 left-12 text-5xl text-wedding-sage -rotate-45">🌿</div>
        <div className="absolute bottom-8 right-8 text-6xl text-wedding-sage">🌿</div>
        <div className="absolute top-1/4 left-16 text-4xl text-wedding-sage/60">🍃</div>
        <div className="absolute top-1/3 right-16 text-4xl text-wedding-sage/60">🍃</div>
        <div className="absolute bottom-1/4 left-20 text-4xl text-wedding-sage/60">🍃</div>
        <div className="absolute bottom-1/3 right-20 text-4xl text-wedding-sage/60">🍃</div>
      </div>

      {/* Main centered envelope container */}
      <div className="flex items-center justify-center min-h-screen p-6">
        {/* Envelope card centered like in screenshots */}
        <div className={`relative ${isMobile ? 'w-[350px]' : 'w-[450px]'} ${isMobile ? 'max-w-[90vw]' : 'max-w-md'}`}>
          
          {/* Title above envelope */}
          <div className="text-center mb-8">
            <div className="text-wedding-accent text-lg font-cormorant tracking-[0.3em] mb-4">29/11/25</div>
            <h1 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-4">Leowander & Sarah</h1>
          </div>

          {/* Main envelope image */}
          <div className="relative">
            <button 
              className="block w-full cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={handleEnvelopeClick}
              type="button"
            >
              <img 
                src="/images/envelope-s.PNG" 
                alt="Wedding invitation envelope"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              
              {/* Click overlay */}
              {animationState === 'initial' && (
                <div className="absolute inset-0 bg-black/10 hover:bg-black/5 transition-all duration-300 rounded-lg flex items-end justify-center pb-4">
                  <div className="text-center">
                    <div className="text-white text-sm font-dancing animate-bounce drop-shadow-lg">Toca para abrir</div>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Bottom text */}
          <div className="text-center mt-6">
            <div className="text-wedding-primary font-cormorant tracking-[0.2em] text-sm">PRESIONE EL SOBRE</div>
            <div className="flex justify-center items-center space-x-4 mt-3">
              <div className="h-px bg-wedding-accent w-16"></div>
              <div className="text-wedding-accent text-sm">❦</div>
              <div className="h-px bg-wedding-accent w-16"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Letter Card that appears after clicking */}
      {animationState === 'letter-visible' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6 z-40">
          <div className={`relative ${getEnvelopeSize()} animate-fade-in`}>
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
                    ¡Querid{personalizedData?.gender === 'a' ? 'a' : 'o'} {personalizedData?.name || 'Invitado'}!
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
        </div>
      )}

      {/* Skip option for accessibility */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <button
          onClick={handleContinue}
          className="text-sm text-wedding-primary/80 hover:text-wedding-primary underline font-playfair opacity-70 hover:opacity-100 transition-opacity"
        >
          Ir directo al sitio →
        </button>
      </div>
    </div>
  )
}