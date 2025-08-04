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
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 z-50 flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 text-8xl text-wedding-accent font-dancing animate-pulse">♡</div>
        <div className="absolute bottom-20 right-20 text-8xl text-wedding-accent font-dancing animate-pulse delay-1000">♡</div>
        <div className="absolute top-1/2 left-1/4 text-6xl text-wedding-sage font-dancing animate-pulse delay-500">❦</div>
        <div className="absolute top-1/3 right-1/4 text-6xl text-wedding-sage font-dancing animate-pulse delay-1500">❦</div>
      </div>

      {/* Elegant Envelope Card Container */}
      <div className={`relative ${getEnvelopeSize()}`}>
        <div className="card">
          <div
            className={`relative bg-gradient-to-br from-wedding-primary to-wedding-blush w-full group transition-all duration-700 aspect-[4/3] flex items-center justify-center rounded-lg shadow-2xl cursor-pointer ${
              animationState === 'initial' && shouldAnimate && !prefersReducedMotion ? 'envelope-breathing' : ''
            } ${
              animationState === 'completed' ? 'envelope-shrink' : ''
            }`}
            onClick={handleEnvelopeClick}
          >
            {/* Letter Content */}
            <div
              className={`flex flex-col items-center py-4 px-4 justify-center bg-gradient-to-br from-orange-50 to-amber-50 w-full absolute border-2 border-wedding-accent shadow-2xl rounded-lg ${
                isMobile ? 'h-[150%]' : 'h-full'
              } ${
                animationState === 'letter-out' ? 'letter-exit-up z-50' :
                animationState === 'letter-visible' ? `letter-descend-scale letter-top-float z-50 ${getLetterScale()} ${getLetterPosition()}` :
                'z-10 translate-y-0 scale-75 opacity-0'
              }`}
            >
              {/* Letter content */}
              <div className={`text-center transition-all duration-600 delay-500 ${
                animationState === 'letter-visible' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {/* Letter header */}
                <div className={`${isMobile ? 'mb-3' : 'mb-6'}`}>
                  <div className={`text-wedding-accent ${isMobile ? 'text-base' : 'text-lg'} ${isMobile ? 'mb-2' : 'mb-3'}`}>✦ ❤ ✦</div>
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-dancing text-wedding-primary ${isMobile ? 'mb-2' : 'mb-3'}`}>
                    ¡Querid{personalizedData?.gender === 'a' ? 'a' : 'o'} {personalizedData?.name || 'Invitado'}!
                  </h3>
                </div>

                {/* Letter body */}
                <div className={`${isMobile ? 'space-y-2' : 'space-y-3'} ${getTextSize()} leading-relaxed text-wedding-blush font-playfair ${isMobile ? 'max-w-xs' : 'max-w-sm'}`}>
                  <p>Nos complace enormemente invitarte a nuestra celebración de amor.</p>
                  <p>Tu presencia hará que este día sea aún más especial.</p>
                  {personalizedData && personalizedData.guestCount > 1 && (
                    <p>Puedes traer {personalizedData.guestCount - 1} acompañante{personalizedData.guestCount > 2 ? 's' : ''} contigo.</p>
                  )}
                  <div className={`${isMobile ? 'py-2' : 'py-3'}`}>
                    <div className={`text-wedding-accent ${isMobile ? 'text-base' : 'text-lg'}`}>♥</div>
                  </div>
                  <p className={`font-dancing ${isMobile ? 'text-sm' : 'text-base'}`}>Con amor,</p>
                  <p className={`font-dancing ${isMobile ? 'text-lg' : 'text-xl'} text-wedding-primary`}>Leowander & Sarah</p>
                  <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-wedding-blush ${isMobile ? 'mt-2' : 'mt-4'} space-y-1`}>
                    <p>29 de Noviembre, 2025</p>
                    <p>Santiago, República Dominicana</p>
                  </div>
                </div>

                {/* Action button */}
                <div className={`${isMobile ? 'mt-3' : 'mt-6'} transition-all duration-500 delay-1000 ${
                  animationState === 'letter-visible' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <Button
                    onClick={handleContinue}
                    className={`bg-gradient-to-r from-wedding-primary to-wedding-accent hover:from-wedding-accent hover:to-wedding-secondary text-white ${isMobile ? 'px-4 py-2 text-xs' : 'px-6 py-2 text-sm'} rounded-full font-dancing shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    Ver más detalles ✨
                  </Button>
                </div>
              </div>
            </div>

            {/* Wax Seal */}
            <button
              className={`seal bg-gradient-to-br from-wedding-accent to-wedding-secondary text-white w-16 aspect-square rounded-full z-30 text-xs flex items-center justify-center font-semibold transition-all duration-1000 border-4 border-wedding-primary shadow-lg ${
                animationState === 'opening' || animationState === 'letter-out' || animationState === 'letter-visible' 
                  ? 'opacity-0 scale-0 rotate-180' 
                  : 'opacity-100 scale-100 rotate-0'
              } [clip-path:polygon(50%_0%,_80%_10%,_100%_35%,_100%_70%,_80%_90%,_50%_100%,_20%_90%,_0%_70%,_0%_35%,_20%_10%)]`}
            >
              <div className="text-center leading-tight">
                <div className="font-dancing text-sm">L&S</div>
                <div className="text-[8px] opacity-80">2025</div>
              </div>
            </button>

            {/* Envelope Flaps */}
            {/* Top */}
            <div
              className={`tp transition-all duration-1000 bg-gradient-to-br from-wedding-primary via-wedding-accent to-wedding-secondary absolute w-full h-full z-20 ${
                animationState === 'opening' || animationState === 'letter-out' || animationState === 'letter-visible' 
                  ? '[clip-path:polygon(50%_0%,_100%_0,_0_0)] duration-100' 
                  : '[clip-path:polygon(50%_50%,_100%_0,_0_0)]'
              } rounded-lg`}
            ></div>
            
            {/* Left */}
            <div
              className={`lft transition-all duration-700 absolute w-full h-full bg-gradient-to-br from-wedding-primary to-wedding-blush [clip-path:polygon(50%_50%,_0_0,_0_100%)] rounded-lg z-10 ${
                animationState === 'opening' || animationState === 'letter-out' || animationState === 'letter-visible' ? 'opacity-90' : ''
              }`}
            ></div>
            
            {/* Right */}
            <div
              className={`rgt transition-all duration-700 absolute w-full h-full bg-gradient-to-br from-wedding-accent to-wedding-secondary [clip-path:polygon(50%_50%,_100%_0,_100%_100%)] rounded-lg z-10 ${
                animationState === 'opening' || animationState === 'letter-out' || animationState === 'letter-visible' ? 'opacity-90' : ''
              }`}
            ></div>
            
            {/* Bottom */}
            <div
              className={`btm transition-all duration-700 absolute w-full h-full bg-gradient-to-br from-wedding-blush to-wedding-primary [clip-path:polygon(50%_50%,_100%_100%,_0_100%)] rounded-lg z-10 ${
                animationState === 'opening' || animationState === 'letter-out' || animationState === 'letter-visible' ? 'opacity-90' : ''
              }`}
            ></div>

            {/* Click hint (only shown initially) */}
            {animationState === 'initial' && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white animate-pulse">
                <div className="text-2xl mb-1">👆</div>
                <div className="text-xs font-dancing">Toca para abrir</div>
              </div>
            )}
          </div>
        </div>

        {/* Skip option for accessibility */}
        <div className="mt-6 text-center">
          <button
            onClick={handleContinue}
            className="text-xs text-wedding-primary hover:text-wedding-accent underline font-playfair opacity-70 hover:opacity-100 transition-opacity"
          >
            Ir directo al sitio →
          </button>
        </div>
      </div>
    </div>
  )
}