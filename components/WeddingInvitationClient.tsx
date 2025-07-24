"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import SearchParamsHandler from "@/components/SearchParamsHandler"

function WeddingInvitationContent() {
  const [invitationData, setInvitationData] = useState({
    invitedBy: "",
    guestCount: 1,
    isValid: false
  })

  const [personalizedInvite, setPersonalizedInvite] = useState({
    name: "",
    gender: "", // 'a' for female, 'o' for male
    isPersonalized: false
  })

  const [formData, setFormData] = useState({
    names: [""], // Array of names for each guest
    email: "",
    response: "",
    message: "",
    guestCount: 1,
  })

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [isScrolled, setIsScrolled] = useState(false)

  // Handlers for SearchParamsHandler
  const handleInvitationUpdate = (data: { invitedBy: string; guestCount: number; isValid: boolean }) => {
    setInvitationData(data)
  }

  const handlePersonalizedInviteUpdate = (data: { name: string; gender: string; isPersonalized: boolean }) => {
    setPersonalizedInvite(data)
  }

  const handleFormDataUpdate = (guestCount: number) => {
    setFormData(prev => ({
      ...prev,
      guestCount: guestCount,
      names: Array(guestCount).fill("")
    }))
  }

  useEffect(() => {
    const weddingDate = new Date('2025-11-29T18:00:00').getTime()
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = weddingDate - now
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Update document title based on gender parameter
  useEffect(() => {
    if (personalizedInvite.isPersonalized) {
      const genderTitle = personalizedInvite.gender === 'a' ? 'Invitada' : personalizedInvite.gender === 'o' ? 'Invitado' : 'Invitado/a'
      document.title = `${personalizedInvite.name} - ${genderTitle} a la Boda de Leowander & Sarah`
    } else {
      document.title = "Leowander & Sarah - Invitación de Boda"
    }
  }, [personalizedInvite])

  // Handle scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const shouldBeScrolled = scrollTop > 100
      
      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled)
      }
    }

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Check initial scroll position
    handleScroll()

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolled])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all names are filled
    const emptyNames = formData.names.some((name, index) => !name.trim())
    if (emptyNames) {
      alert("Por favor, completa todos los nombres de los asistentes.")
      return
    }
    
    const submitData = {
      email: formData.email,
      names: formData.names.filter(name => name.trim()), // Remove empty names
      response: formData.response,
      message: formData.message,
      guestCount: formData.guestCount,
      invitedBy: invitationData.invitedBy,
      invitationValid: invitationData.isValid,
      personalizedInvite: personalizedInvite.isPersonalized ? {
        name: personalizedInvite.name,
        gender: personalizedInvite.gender
      } : null,
      timestamp: new Date().toISOString(),
    }
    
    console.log("RSVP submitted:", submitData)
    
    // Here you would normally send to your database
    // Example API call:
    // fetch('/api/rsvp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(submitData)
    // })
    
    const guestList = formData.names.filter(name => name.trim()).join(", ")
    alert(`¡Gracias por confirmar tu asistencia!\n\nAsistentes: ${guestList}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...formData.names]
    newNames[index] = value
    setFormData(prev => ({
      ...prev,
      names: newNames
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <SearchParamsHandler
        onInvitationUpdate={handleInvitationUpdate}
        onPersonalizedInviteUpdate={handlePersonalizedInviteUpdate}
        onFormDataUpdate={handleFormDataUpdate}
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-500 ease-in-out">
        <div className={`transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-sm shadow-lg border-b border-wedding-accent/20' 
            : 'bg-transparent'
        }`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center mb-2">
                <div className={`text-sm font-cormorant tracking-[0.3em] mb-2 transition-colors duration-500 ${
                  isScrolled ? 'text-wedding-primary' : 'text-white/90'
                }`}>
                  NOS COMPLACE INVITARLE A NUESTRA BODA
                </div>
                <div className={`text-3xl md:text-4xl font-great-vibes tracking-wide transition-colors duration-500 ${
                  isScrolled ? 'text-wedding-accent' : 'text-white'
                }`}>
                  Leowander <span className="text-wedding-blush font-dancing text-3xl mx-2">&</span> Sarah
                </div>
              </div>
              
              <div className="flex space-x-8 text-sm font-cormorant tracking-[0.15em]">
                <a 
                  href="#invitation" 
                  className={`transition-colors duration-500 hover:text-wedding-accent ${
                    isScrolled ? 'text-wedding-primary' : 'text-white/80 hover:text-white'
                  }`}
                >
                  INVITACIÓN
                </a>
                <a 
                  href="#details" 
                  className={`transition-colors duration-500 hover:text-wedding-accent ${
                    isScrolled ? 'text-wedding-primary' : 'text-white/80 hover:text-white'
                  }`}
                >
                  DETALLES
                </a>
                <a 
                  href="#rsvp" 
                  className={`transition-colors duration-500 hover:text-wedding-accent ${
                    isScrolled ? 'text-wedding-primary' : 'text-white/80 hover:text-white'
                  }`}
                >
                  RSVP
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-couple.jpg"
            alt="Couple walking through mountains"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-amber-900/20 to-black/30"></div>
        </div>

        <div className={`relative z-10 text-center text-white px-6 animate-fade-in ${personalizedInvite.isPersonalized ? 'pt-32 md:pt-20' : 'pt-20 md:pt-16'}`}>
          {personalizedInvite.isPersonalized && (
            <div className="mb-8 animate-slide-up">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-2xl animate-welcome-glow">
                <div className="text-orange-200 text-lg font-cormorant mb-2 tracking-[0.2em] animate-sparkle">
                  ✨ Especialmente para ti ✨
                </div>
                <h2 className="text-3xl md:text-4xl font-great-vibes text-white mb-2 drop-shadow-lg">
                  ¡Bienvenid{personalizedInvite.gender === 'a' ? 'a' : personalizedInvite.gender === 'o' ? 'o' : 'o/a'}, <span className="text-yellow-200">{personalizedInvite.name}</span>!
                </h2>
                <p className="text-orange-100 font-cormorant text-sm md:text-base leading-relaxed">
                  Nos emociona enormemente tener{personalizedInvite.gender === 'a' ? 'te' : personalizedInvite.gender === 'o' ? 'te' : 'te'} en nuestra celebración de amor
                </p>
              </div>
            </div>
          )}
          
          <div className="text-orange-200 text-lg font-cormorant mb-4 tracking-[0.3em]">✦ NOS VAMOS A CASAR ✦</div>
          <h1 className="text-6xl md:text-8xl font-great-vibes mb-6 leading-tight drop-shadow-2xl">
            Leowander
            <br />
            <span className="text-yellow-200 font-dancing text-5xl md:text-7xl">&</span>
            <br />
            Sarah
          </h1>
          <div className="text-orange-100 text-xl md:text-2xl font-cormorant mb-8 tracking-[0.2em]">
            29 DE NOVIEMBRE, 2025
          </div>
          <div className="text-orange-200 font-cormorant text-lg tracking-[0.15em] mb-8">
            SANTIAGO, REPÚBLICA DOMINICANA
          </div>
          
          {/* Countdown Timer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-white/20">
            <div className="text-orange-200 text-sm font-cormorant mb-4 tracking-[0.2em]">FALTAN</div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-xs text-orange-200 font-cormorant">DÍAS</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-xs text-orange-200 font-cormorant">HORAS</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-xs text-orange-200 font-cormorant">MIN</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.seconds}</div>
                <div className="text-xs text-orange-200 font-cormorant">SEG</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Save the Dates Section */}
      <section id="invitation" className="py-20 bg-gradient-to-b from-white to-rose-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left side - Title */}
              <div className="lg:w-1/3 animate-slide-up">
                <div className="relative">
                  <h2 className="text-6xl md:text-7xl font-playfair text-wedding-primary leading-tight">
                    LEOWANDER
                    <br />
                    &
                    <br />
                    SARAH
                  </h2>
                  <div className="absolute -top-4 -left-4 text-wedding-accent text-6xl font-great-vibes opacity-30">❦</div>
                  <div className="absolute -bottom-4 -right-4 text-wedding-accent text-6xl font-great-vibes opacity-30">❦</div>
                </div>
              </div>

              {/* Right side - Photo cards */}
              <div className="lg:w-2/3 flex flex-col md:flex-row gap-8 md:gap-6">
                {/* Card 1 */}
                <Card className="relative bg-gradient-to-br from-white to-rose-50 shadow-lg border border-rose-100 p-8 text-center group hover:shadow-2xl hover:border-rose-200 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative w-32 h-48 mx-auto mb-6 overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-200/50">
                    <Image
                      src="/placeholder.svg?height=200&width=130"
                      alt="The day we met"
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-great-vibes text-rose-300">01.</div>
                  <div className="space-y-2">
                    <p className="text-sm tracking-wider text-rose-500 font-cormorant">24 JUN 2017</p>
                    <h3 className="text-lg font-playfair text-wedding-primary font-semibold">THE DAY WE MET</h3>
                    <div className="mt-2 text-wedding-accent">♥</div>
                  </div>
                </Card>

                {/* Card 2 */}
                <Card className="relative bg-gradient-to-br from-white to-rose-50 shadow-lg border border-rose-100 p-8 text-center group hover:shadow-2xl hover:border-rose-200 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative w-32 h-48 mx-auto mb-6 overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-200/50">
                    <Image
                      src="/placeholder.svg?height=200&width=130"
                      alt="Stories opening"
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-great-vibes text-rose-300">02.</div>
                  <div className="space-y-2">
                    <p className="text-sm tracking-wider text-rose-500 font-cormorant">14 FEB 2018</p>
                    <h3 className="text-lg font-playfair text-wedding-primary font-semibold">STORIES OPENING</h3>
                    <div className="mt-2 text-wedding-accent">♥</div>
                  </div>
                </Card>

                {/* Card 3 */}
                <Card className="relative bg-gradient-to-br from-white to-rose-50 shadow-lg border border-rose-100 p-8 text-center group hover:shadow-2xl hover:border-rose-200 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative w-32 h-48 mx-auto mb-6 overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-200/50">
                    <Image
                      src="/placeholder.svg?height=200&width=130"
                      alt="The proposal"
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-great-vibes text-rose-300">03.</div>
                  <div className="space-y-2">
                    <p className="text-sm tracking-wider text-rose-500 font-cormorant">08 MAR 2024</p>
                    <h3 className="text-lg font-playfair text-wedding-primary font-semibold">THE PROPOSAL</h3>
                    <div className="mt-2 text-wedding-accent">♥</div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl text-white font-great-vibes">♡</div>
          <div className="absolute bottom-10 right-10 text-8xl text-white font-great-vibes">♡</div>
          <div className="absolute top-1/2 left-1/2 text-6xl text-white font-great-vibes transform -translate-x-1/2 -translate-y-1/2">❦</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-rose-200 text-lg font-cormorant tracking-[0.3em] mb-2">✦ NUESTRA HISTORIA ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-white mb-12">Sobre Nosotros</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 relative overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-200/50">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Sarah"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-great-vibes text-rose-100 mb-4">Sarah</h3>
                <p className="text-rose-200 font-cormorant leading-relaxed">
                  Hija querida de Ángel Luis Saint-Hilaire Pérez y Luisa Virginia Marmolejos González. 
                  Una persona llena de alegría y amor que ilumina cada día con su sonrisa.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 relative overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-200/50">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Leowander"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-great-vibes text-rose-100 mb-4">Leowander</h3>
                <p className="text-rose-200 font-cormorant leading-relaxed">
                  Hijo querido de Leonardo Piña Luciano y Ysabel Polanco Sanchez. 
                  Un corazón noble y generoso que encuentra en el amor su mayor fortaleza.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <p className="text-rose-100 text-lg font-cormorant leading-relaxed italic">
                "Dos corazones que se encontraron en el momento perfecto, dos vidas que se unen para crear una historia de amor eterna. 
                Después de años de compartir sueños, risas y aventuras, hemos decidido dar el paso más importante: 
                prometernos amor eterno ante Dios, nuestras familias y amigos."
              </p>
              <div className="mt-6 text-rose-200 text-xl">♥</div>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Section */}
      <section className="py-20 bg-gradient-to-br from-rose-800 via-rose-700 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl text-white font-great-vibes">♡</div>
          <div className="absolute bottom-10 right-10 text-8xl text-white font-great-vibes">♡</div>
          <div className="absolute top-1/2 left-1/2 text-6xl text-white font-great-vibes transform -translate-x-1/2 -translate-y-1/2">❦</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-rose-200 text-lg font-cormorant tracking-[0.3em] mb-2">✦ CRONOGRAMA DEL DÍA ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-white mb-12">Itinerario</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-rose-200 hover:border-rose-300 transition-all duration-300 hover:shadow-xl">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-blush text-5xl mb-4">⛪</div>
                  <h3 className="text-xl font-playfair text-wedding-primary font-semibold">Ceremonia</h3>
                  <div className="text-wedding-blush font-cormorant">
                    <p className="text-2xl font-bold">3:00 PM</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-rose-200 hover:border-rose-300 transition-all duration-300 hover:shadow-xl">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-blush text-5xl mb-4">📸</div>
                  <h3 className="text-xl font-playfair text-wedding-primary font-semibold">Fotos</h3>
                  <div className="text-wedding-blush font-cormorant">
                    <p className="text-2xl font-bold">4:30 PM</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-rose-200 hover:border-rose-300 transition-all duration-300 hover:shadow-xl">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-blush text-5xl mb-4">🥂</div>
                  <h3 className="text-xl font-playfair text-wedding-primary font-semibold">Recepción</h3>
                  <div className="text-wedding-blush font-cormorant">
                    <p className="text-2xl font-bold">6:00 PM</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-rose-200 hover:border-rose-300 transition-all duration-300 hover:shadow-xl">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-blush text-5xl mb-4">💃</div>
                  <h3 className="text-xl font-playfair text-wedding-primary font-semibold">Fiesta</h3>
                  <div className="text-wedding-blush font-cormorant">
                    <p className="text-2xl font-bold">8:00 PM</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="details" className="py-20 bg-gradient-to-b from-white to-rose-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-wedding-blush text-lg font-cormorant tracking-[0.3em] mb-2">✦ UBICACIONES ✦</div>
              <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-6">Lugares de Celebración</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* Church */}
              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 shadow-lg border border-rose-100 hover:shadow-2xl transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="text-wedding-blush text-6xl mb-4">⛪</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-2">Iglesia</h3>
                  <p className="text-wedding-blush font-cormorant text-lg">6:00 PM</p>
                </div>
                <div className="space-y-3 text-wedding-primary font-cormorant">
                  <p className="font-semibold">Catedral Santiago Apóstol</p>
                  <p>Calle del Sol esq. 30 de Marzo</p>
                  <p>Santiago de los Caballeros</p>
                  <p>República Dominicana</p>
                </div>
                <Button className="w-full mt-6 bg-wedding-primary hover:bg-wedding-accent text-white">
                  Ver en Google Maps
                </Button>
              </Card>

              {/* Reception */}
              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 shadow-lg border border-rose-100 hover:shadow-2xl transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="text-wedding-blush text-6xl mb-4">🏛️</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-2">Recepción</h3>
                  <p className="text-wedding-blush font-cormorant text-lg">8:00 PM</p>
                </div>
                <div className="space-y-3 text-wedding-primary font-cormorant">
                  <p className="font-semibold">Centro de Convenciones Utesa</p>
                  <p>Av. Francisco Alberto Caamaño Deñó</p>
                  <p>Santiago de los Caballeros</p>
                  <p>República Dominicana</p>
                </div>
                <Button className="w-full mt-6 bg-wedding-primary hover:bg-wedding-accent text-white">
                  Ver en Google Maps
                </Button>
              </Card>
            </div>

            {/* Hotel Recommendations */}
            <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <div className="text-rose-200 text-lg font-cormorant tracking-[0.3em] mb-2">✦ RECOMENDACIONES ✦</div>
                <h3 className="text-3xl font-great-vibes mb-4">Hoteles Sugeridos</h3>
                <p className="text-rose-100 font-cormorant">Para nuestros invitados que vienen de fuera</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                  <h4 className="text-xl font-playfair font-semibold mb-2">Hotel Mercedes</h4>
                  <p className="text-rose-100 font-cormorant text-sm mb-4">Zona Colonial de Santiago</p>
                  <p className="text-rose-200 font-cormorant text-xs">5 min del centro</p>
                </Card>

                <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                  <h4 className="text-xl font-playfair font-semibold mb-2">Gran Almirante</h4>
                  <p className="text-rose-100 font-cormorant text-sm mb-4">Hotel & Casino</p>
                  <p className="text-rose-200 font-cormorant text-xs">10 min del centro</p>
                </Card>

                <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                  <h4 className="text-xl font-playfair font-semibold mb-2">Hodelpa Centro Plaza</h4>
                  <p className="text-rose-100 font-cormorant text-sm mb-4">En el corazón de Santiago</p>
                  <p className="text-rose-200 font-cormorant text-xs">Centro de la ciudad</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mesa de Regalos Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-wedding-blush text-lg font-cormorant tracking-[0.3em] mb-2">✦ MESA DE REGALOS ✦</div>
              <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-6">Regalos</h2>
              <p className="text-wedding-blush font-cormorant text-lg leading-relaxed">
                Tu presencia es nuestro mayor regalo, pero si deseas obsequiarnos algo, 
                estas son algunas opciones que nos ayudarán a comenzar nuestra nueva vida juntos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Amazon Registry */}
              <Card className="p-8 text-center bg-white shadow-lg border border-rose-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-wedding-accent text-6xl mb-6">📦</div>
                <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">Lista de Amazon</h3>
                <p className="text-wedding-blush font-cormorant mb-6 leading-relaxed">
                  Artículos para el hogar seleccionados especialmente para nuestra nueva vida juntos.
                </p>
                <Button className="w-full bg-wedding-primary hover:bg-wedding-accent text-white">
                  Ver Lista en Amazon
                </Button>
              </Card>

              {/* Cash Envelope */}
              <Card className="p-8 text-center bg-white shadow-lg border border-rose-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-wedding-accent text-6xl mb-6">💌</div>
                <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">Sobre con Efectivo</h3>
                <p className="text-wedding-blush font-cormorant mb-6 leading-relaxed">
                  Tradición dominicana. Los sobres se pueden entregar el día de la boda en la recepción.
                </p>
                <div className="bg-wedding-primary/10 rounded-lg p-4">
                  <p className="text-wedding-primary font-cormorant text-sm">Recepción de sobres durante la celebración</p>
                </div>
              </Card>

              {/* Bank Transfer */}
              <Card className="p-8 text-center bg-white shadow-lg border border-rose-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-wedding-accent text-6xl mb-6">🏦</div>
                <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">Transferencia Bancaria</h3>
                <p className="text-wedding-blush font-cormorant mb-6 leading-relaxed">
                  Para contribuir a nuestros sueños y proyectos futuros como pareja.
                </p>
                <div className="bg-wedding-primary/10 rounded-lg p-4 text-left">
                  <p className="text-wedding-primary font-cormorant text-sm mb-2">
                    <span className="font-semibold">Banco:</span> Banco Popular
                  </p>
                  <p className="text-wedding-primary font-cormorant text-sm mb-2">
                    <span className="font-semibold">Cuenta:</span> 123-456789-0
                  </p>
                  <p className="text-wedding-primary font-cormorant text-sm">
                    <span className="font-semibold">Titular:</span> Leowander & Sarah
                  </p>
                </div>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-wedding-accent/20">
                <p className="text-wedding-primary font-cormorant italic text-lg">
                  "Lo más importante para nosotros es compartir este día tan especial contigo. 
                  Tu amor y compañía son los regalos más valiosos que podemos recibir."
                </p>
                <div className="mt-4 text-wedding-accent text-2xl">♥</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buenos Deseos Section */}
      <section className="py-20 bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 text-6xl text-white font-great-vibes">♪</div>
          <div className="absolute bottom-20 right-20 text-6xl text-white font-great-vibes">♫</div>
          <div className="absolute top-40 right-40 text-4xl text-white font-great-vibes">♬</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-rose-200 text-lg font-cormorant tracking-[0.3em] mb-2">✦ BUENOS DESEOS ✦</div>
              <h2 className="text-4xl md:text-5xl font-great-vibes text-white mb-6">Mensajes & Música</h2>
              <p className="text-rose-100 font-cormorant text-lg leading-relaxed">
                Comparte tus deseos y ayúdanos a crear la playlist perfecta para nuestra celebración
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Ver Buenos Deseos */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-white/30">
                <div className="text-center mb-6">
                  <div className="text-wedding-accent text-6xl mb-4">💌</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold">Ver Buenos Deseos</h3>
                </div>
                <p className="text-wedding-blush font-cormorant mb-6 text-center leading-relaxed">
                  Lee los hermosos mensajes que nuestros seres queridos han compartido con nosotros.
                </p>
                <Button className="w-full bg-wedding-primary hover:bg-wedding-accent text-white">
                  Ver Mensajes
                </Button>
              </Card>

              {/* Enviar Buenos Deseos */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-white/30">
                <div className="text-center mb-6">
                  <div className="text-wedding-accent text-6xl mb-4">✍️</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold">Enviar Buenos Deseos</h3>
                </div>
                <p className="text-wedding-blush font-cormorant mb-6 text-center leading-relaxed">
                  Déjanos un mensaje especial que atesoraremos para siempre en nuestros corazones.
                </p>
                <Button className="w-full bg-wedding-primary hover:bg-wedding-accent text-white">
                  Escribir Mensaje
                </Button>
              </Card>
            </div>

            {/* Sugerencia de Canciones */}
            <Card className="mt-12 p-8 bg-white/90 backdrop-blur-sm border-2 border-white/30">
              <div className="text-center mb-6">
                <div className="text-wedding-accent text-6xl mb-4">🎵</div>
                <h3 className="text-2xl font-playfair text-wedding-primary font-semibold">Sugerencia de Canciones</h3>
                <p className="text-wedding-blush font-cormorant mt-4 leading-relaxed">
                  ¿Qué canción no puede faltar en nuestra fiesta? Ayúdanos a crear la playlist perfecta.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Nombre de la canción"
                    className="border-wedding-accent/30 focus:border-wedding-primary"
                  />
                  <Input
                    type="text"
                    placeholder="Artista"
                    className="border-wedding-accent/30 focus:border-wedding-primary"
                  />
                </div>
                <Textarea
                  placeholder="¿Por qué esta canción es especial? (opcional)"
                  rows={3}
                  className="mt-4 border-wedding-accent/30 focus:border-wedding-primary"
                />
                <Button className="w-full mt-6 bg-wedding-primary hover:bg-wedding-accent text-white">
                  Sugerir Canción
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 bg-gradient-to-b from-white to-rose-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-wedding-blush text-lg font-cormorant tracking-[0.3em] mb-2">✦ CONFIRMAR ASISTENCIA ✦</div>
              <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-6">Confirmar Asistencia</h2>
              
              {invitationData.isValid ? (
                <div className="mb-6 p-4 bg-wedding-primary/10 rounded-lg border border-wedding-accent/20">
                  <p className="text-wedding-primary font-cormorant text-lg">
                    ¡Hola! Has sido invitad{personalizedInvite.gender === 'a' ? 'a' : personalizedInvite.gender === 'o' ? 'o' : 'o/a'} por <span className="font-semibold capitalize">{invitationData.invitedBy}</span>
                  </p>
                  <p className="text-wedding-blush font-cormorant text-sm mt-1">
                    Invitación para {invitationData.guestCount} persona{invitationData.guestCount > 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <p className="text-wedding-blush font-cormorant text-lg mb-6">
                  Por favor confirma tu asistencia antes del 15 de noviembre de 2025
                </p>
              )}
            </div>

            <Card className="p-8 shadow-lg border border-rose-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Names for each guest */}
                <div className="space-y-4">
                  <label className="block text-wedding-primary font-cormorant text-lg font-semibold">
                    Nombre{formData.guestCount > 1 ? 's' : ''} completo{formData.guestCount > 1 ? 's' : ''}
                  </label>
                  {formData.names.map((name, index) => (
                    <div key={index}>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        placeholder={
                          index === 0 
                            ? "Tu nombre completo" 
                            : `Nombre del acompañante ${index}`
                        }
                        required
                        className="border-wedding-accent/30 focus:border-wedding-primary"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="email" className="block text-wedding-primary font-cormorant text-lg font-semibold mb-2">
                    Correo Electrónico
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-wedding-accent/30 focus:border-wedding-primary"
                  />
                </div>

                <div>
                  <label htmlFor="response" className="block text-wedding-primary font-cormorant text-lg font-semibold mb-2">
                    ¿Confirmas tu asistencia?
                  </label>
                  <select
                    id="response"
                    name="response"
                    value={formData.response}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-wedding-accent/30 rounded-md focus:border-wedding-primary focus:outline-none bg-white"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="si">¡Sí, asistiré con mucho gusto!</option>
                    <option value="no">Lo siento, no podré asistir</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-wedding-primary font-cormorant text-lg font-semibold mb-2">
                    Mensaje especial (opcional)
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Comparte tus mejores deseos con nosotros..."
                    className="border-wedding-accent/30 focus:border-wedding-primary"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-wedding-primary hover:bg-wedding-accent text-white text-lg py-3 font-cormorant tracking-wide"
                >
                  Confirmar Asistencia
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-br from-rose-800 via-rose-700 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl text-white font-great-vibes">♡</div>
          <div className="absolute bottom-10 right-10 text-8xl text-white font-great-vibes">♡</div>
          <div className="absolute top-1/2 left-1/2 text-6xl text-white font-great-vibes transform -translate-x-1/2 -translate-y-1/2">❦</div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="text-wedding-blush font-cormorant italic text-lg mb-4">Con amor,</div>
          <div className="text-3xl font-great-vibes text-rose-700 mb-6 tracking-wide">
            Leowander <span className="text-wedding-accent font-dancing text-4xl mx-3">&</span> Sarah
          </div>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="h-px bg-rose-300 w-16"></div>
            <div className="text-wedding-accent text-xl">♥</div>
            <div className="h-px bg-rose-300 w-16"></div>
          </div>
          <p className="text-wedding-blush font-cormorant text-lg font-medium">29 de Noviembre, 2025 • Santiago, República Dominicana</p>
          <div className="mt-6 text-wedding-accent text-sm font-cormorant tracking-[0.2em]">✦ PARA SIEMPRE & SIEMPRE ✦</div>
        </div>
      </footer>
    </div>
  )
}

export default function WeddingInvitationClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-great-vibes text-wedding-primary mb-4">Loading...</div>
        <div className="text-wedding-accent font-cormorant">Preparando tu invitación</div>
      </div>
    </div>}>
      <WeddingInvitationContent />
    </Suspense>
  )
}