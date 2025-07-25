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
    
    // Validate guest count doesn't exceed invitation limit
    if (name === 'guestCount') {
      const count = parseInt(value, 10)
      if (invitationData.isValid && count > invitationData.guestCount) {
        return // Don't update if exceeds limit
      }
      
      // Update names array when guest count changes
      const newNames = Array(count).fill("")
      // Preserve existing names if reducing count
      for (let i = 0; i < Math.min(count, formData.names.length); i++) {
        newNames[i] = formData.names[i] || ""
      }
      
      setFormData({
        ...formData,
        guestCount: count,
        names: newNames
      })
      return
    }
    
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...formData.names]
    newNames[index] = value
    setFormData({
      ...formData,
      names: newNames
    })
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
                  isScrolled ? 'text-wedding-primary' : 'text-white'
                }`}>
                  Leowander <span className={`font-dancing text-4xl md:text-5xl mx-3 transition-colors duration-500 ${
                    isScrolled ? 'text-wedding-accent' : 'text-white/80'
                  }`}>&</span> Sarah
                </div>
              </div>
              <div className={`flex items-center text-xs md:text-sm tracking-wider font-cormorant font-bold flex-wrap justify-center transition-colors duration-500 ${
                isScrolled ? 'text-wedding-primary' : 'text-white/90'
              }`}>
                <a href="#about" className={`transition-all duration-300 px-3 md:px-6 py-1 ${
                  isScrolled ? 'hover:text-wedding-sage' : 'hover:text-white'
                }`}>
                  NUESTRA HISTORIA
                </a>
                <div className={`h-px w-6 md:w-8 mx-1 md:mx-2 transition-colors duration-500 ${
                  isScrolled ? 'bg-wedding-accent' : 'bg-white/60'
                }`}></div>
                <a href="#invitation" className={`transition-all duration-300 px-3 md:px-6 py-1 ${
                  isScrolled ? 'hover:text-wedding-sage' : 'hover:text-white'
                }`}>
                  CEREMONIA
                </a>
                <div className={`h-px w-6 md:w-8 mx-1 md:mx-2 transition-colors duration-500 ${
                  isScrolled ? 'bg-wedding-accent' : 'bg-white/60'
                }`}></div>
                <a href="#location" className={`transition-all duration-300 px-3 md:px-6 py-1 ${
                  isScrolled ? 'hover:text-wedding-sage' : 'hover:text-white'
                }`}>
                  RECEPCIÓN
                </a>
                <div className={`h-px w-6 md:w-8 mx-1 md:mx-2 transition-colors duration-500 ${
                  isScrolled ? 'bg-wedding-accent' : 'bg-white/60'
                }`}></div>
                <a href="#rsvp" className={`transition-all duration-300 px-3 md:px-6 py-1 ${
                  isScrolled ? 'hover:text-wedding-sage' : 'hover:text-white'
                }`}>
                  CONFIRMAR
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
            src="/images/hero-couple.jpeg"
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
                <div className="flex justify-center items-center space-x-2 mt-3">
                  <div className="h-px bg-white/30 w-8"></div>
                  <div className="text-yellow-200 text-xl">💕</div>
                  <div className="h-px bg-white/30 w-8"></div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="text-orange-200 text-2xl font-cormorant mb-2 tracking-[0.3em]">✦ TOGETHER FOREVER ✦</div>
          </div>
          <h1 className="text-6xl md:text-8xl font-great-vibes mb-6 leading-tight animate-float drop-shadow-2xl">De lo inesperado nació lo eterno</h1>
          <div className="space-y-2">
            <p className="text-xl md:text-3xl font-cormorant tracking-[0.2em] text-orange-100">29.11.2025</p>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <div className="h-px bg-orange-300 w-12"></div>
              <div className="text-orange-200 text-lg">♡</div>
              <div className="h-px bg-orange-300 w-12"></div>
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
                    <p className="text-sm tracking-wider text-rose-500 font-cormorant">12 JUL 2017</p>
                    <h3 className="text-lg font-playfair text-wedding-primary font-semibold">STORIES OPENING</h3>
                    <div className="mt-2 text-wedding-accent">♥</div>
                  </div>
                </Card>

                {/* Card 3 */}
                <Card className="relative bg-gradient-to-br from-white to-rose-50 shadow-lg border border-rose-100 p-8 text-center group hover:shadow-2xl hover:border-rose-200 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative w-32 h-48 mx-auto mb-6 overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-200/50">
                    <Image
                      src="/placeholder.svg?height=200&width=130"
                      alt="The next journey"
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-great-vibes text-rose-300">03.</div>
                  <div className="space-y-2">
                    <p className="text-sm tracking-wider text-rose-500 font-cormorant">19 MAY 2022</p>
                    <h3 className="text-lg font-playfair text-wedding-primary font-semibold">THE NEXT JOURNEY</h3>
                    <div className="mt-2 text-wedding-accent">♥</div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 bg-gradient-to-br from-rose-100 via-blush-100 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 text-9xl text-rose-300 font-great-vibes">♡</div>
          <div className="absolute bottom-20 right-20 text-9xl text-rose-300 font-great-vibes">♡</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-wedding-accent text-lg font-cormorant tracking-[0.3em] mb-2">✦ FALTAN ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-8">¡Nos casamos!</h2>
            <p className="text-lg text-wedding-blush font-cormorant mb-12">29 de Noviembre, 2025</p>
            
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-rose-200 rounded-lg p-6 hover:border-rose-300 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-playfair text-wedding-primary font-bold">{timeLeft.days}</div>
                <div className="text-sm md:text-base font-cormorant text-wedding-blush uppercase tracking-wider">Días</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border-2 border-rose-200 rounded-lg p-6 hover:border-rose-300 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-playfair text-wedding-primary font-bold">{timeLeft.hours}</div>
                <div className="text-sm md:text-base font-cormorant text-wedding-blush uppercase tracking-wider">Horas</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border-2 border-rose-200 rounded-lg p-6 hover:border-rose-300 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-playfair text-wedding-primary font-bold">{timeLeft.minutes}</div>
                <div className="text-sm md:text-base font-cormorant text-wedding-blush uppercase tracking-wider">Min</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border-2 border-rose-200 rounded-lg p-6 hover:border-rose-300 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-playfair text-wedding-primary font-bold">{timeLeft.seconds}</div>
                <div className="text-sm md:text-base font-cormorant text-wedding-blush uppercase tracking-wider">Seg</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parents Section */}
      <section className="py-20 bg-gradient-to-b from-white to-rose-50 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/4 text-6xl text-rose-300 font-great-vibes">❦</div>
          <div className="absolute bottom-10 right-1/4 text-6xl text-rose-300 font-great-vibes">❦</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-wedding-accent text-lg font-cormorant tracking-[0.3em] mb-2">✦ CON LA BENDICIÓN DE DIOS Y DE NUESTROS PADRES ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-12">Nuestras Familias</h2>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-accent text-4xl mb-4">👰🏻</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold">Padres de la Novia</h3>
                  <div className="text-wedding-blush space-y-2 font-cormorant">
                    <p className="text-lg font-semibold">Ángel Luis Saint-Hilaire Pérez</p>
                    <p className="text-lg font-semibold">Luisa Virginia Marmolejos González</p>
                  </div>
                  <div className="mt-4 text-wedding-accent">♥</div>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-accent text-4xl mb-4">🤵🏻</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold">Padres del Novio</h3>
                  <div className="text-wedding-blush space-y-2 font-cormorant">
                    <p className="text-lg font-semibold">Leonardo Piña Luciano</p>
                    <p className="text-lg font-semibold">Ysabel Polanco Sanchez</p>
                  </div>
                  <div className="mt-4 text-wedding-accent">♥</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-rose-50 to-blush-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl text-rose-300 font-great-vibes">❦</div>
          <div className="absolute bottom-10 right-10 text-6xl text-rose-300 font-great-vibes">❦</div>
          <div className="absolute top-1/2 left-1/4 text-4xl text-rose-200 font-great-vibes">♥</div>
          <div className="absolute top-1/3 right-1/4 text-4xl text-rose-200 font-great-vibes">♥</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <div className="text-wedding-accent text-lg font-cormorant tracking-[0.3em] mb-2">✦ NUESTRA HISTORIA ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-8 animate-fade-in">Leowander y Sarah</h2>
            <div className="prose prose-lg mx-auto text-rose-700">
              <p className="text-xl leading-relaxed mb-8 font-cormorant italic text-center">
                "Dos corazones que se encontraron en el momento perfecto, dos almas que decidieron caminar juntas hacia el futuro. Hoy celebramos no solo nuestro amor, sino el comienzo de una nueva aventura como esposos."
              </p>
              <div className="flex justify-center items-center space-x-6 my-8">
                <div className="h-px bg-rose-300 w-16"></div>
                <div className="text-wedding-accent text-2xl">♥</div>
                <div className="h-px bg-rose-300 w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 bg-gradient-to-b from-white to-rose-50 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 text-8xl text-rose-300 font-great-vibes">♡</div>
          <div className="absolute bottom-20 right-20 text-8xl text-rose-300 font-great-vibes">♡</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-4">
              <div className="text-wedding-accent text-lg font-cormorant tracking-[0.3em] mb-2">✦ UBICACIONES ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-12">Detalles de la Celebración</h2>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-accent text-4xl mb-4">⛪</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold">Ceremonia</h3>
                  <div className="text-wedding-blush space-y-3 font-cormorant">
                    <p className="font-medium text-xl">3:00 PM</p>
                    <p className="text-lg font-semibold">Parroquia De los Santos Médicos</p>
                    <p>Cosme y Damián</p>
                    <p>Santiago, República Dominicana</p>
                    <Button className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-6 py-2 font-cormorant">
                      Ver ubicación
                    </Button>
                  </div>
                  <div className="mt-4 text-wedding-accent">♥</div>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-accent text-4xl mb-4">🎉</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold">Recepción</h3>
                  <div className="text-wedding-blush space-y-3 font-cormorant">
                    <p className="font-medium text-xl">5:00 PM</p>
                    <p className="text-lg font-semibold">Jardín de bodas todo santiago</p>
                    <p>Santiago, República Dominicana</p>
                    <p className="text-sm italic">Celebración, música y alegría</p>
                    <p className="text-sm italic">Cena, baile y diversión hasta altas horas</p>
                    <Button className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-6 py-2 font-cormorant">
                      Ver ubicación
                    </Button>
                  </div>
                  <div className="mt-4 text-wedding-accent">♥</div>
                </div>
              </Card>
            </div>

            {/* Accommodation Section */}
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h3 className="text-3xl font-playfair text-wedding-primary font-semibold mb-4">Sugerencia de Hospedaje</h3>
                <div className="flex justify-center items-center space-x-4 mb-8">
                  <div className="h-px bg-rose-300 w-16"></div>
                  <div className="text-wedding-accent text-lg">🏨</div>
                  <div className="h-px bg-rose-300 w-16"></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-white to-rose-50 border border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3 text-center">
                    <h4 className="text-lg font-playfair text-wedding-primary font-semibold">Hotel Platino</h4>
                    <div className="text-wedding-blush font-cormorant text-sm">
                      <p>Av. Juan Pablo Duarte 54</p>
                      <p>Santiago, República Dominicana</p>
                    </div>
                    <Button className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-1 text-sm font-cormorant">
                      Ver ubicación
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-white to-rose-50 border border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3 text-center">
                    <h4 className="text-lg font-playfair text-wedding-primary font-semibold">Gran Almirante Hotel</h4>
                    <div className="text-wedding-blush font-cormorant text-sm">
                      <p>Av. Estrella Sadhalá</p>
                      <p>Santiago, República Dominicana</p>
                    </div>
                    <Button className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-1 text-sm font-cormorant">
                      Ver ubicación
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-white to-rose-50 border border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3 text-center">
                    <h4 className="text-lg font-playfair text-wedding-primary font-semibold">Hodelpa Centro Plaza</h4>
                    <div className="text-wedding-blush font-cormorant text-sm">
                      <p>Calle Mella 54</p>
                      <p>Santiago, República Dominicana</p>
                    </div>
                    <Button className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-1 text-sm font-cormorant">
                      Ver ubicación
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-white to-rose-50 border border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3 text-center">
                    <h4 className="text-lg font-playfair text-wedding-primary font-semibold">Hotel Mercedes</h4>
                    <div className="text-wedding-blush font-cormorant text-sm">
                      <p>Av. Salvador Estrella Sadhalá</p>
                      <p>Santiago, República Dominicana</p>
                    </div>
                    <Button className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-1 text-sm font-cormorant">
                      Ver ubicación
                    </Button>
                  </div>
                </Card>
              </div>
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
                    <p className="text-2xl font-bold">5:00 PM</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-rose-200 hover:border-rose-300 transition-all duration-300 hover:shadow-xl">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-blush text-5xl mb-4">💃</div>
                  <h3 className="text-xl font-playfair text-wedding-primary font-semibold">Fiesta</h3>
                  <div className="text-wedding-blush font-cormorant">
                    <p className="text-2xl font-bold">9:00 PM</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-20 bg-gradient-to-b from-white to-rose-50 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/4 text-6xl text-rose-300 font-great-vibes">❦</div>
          <div className="absolute bottom-10 right-1/4 text-6xl text-rose-300 font-great-vibes">❦</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-wedding-accent text-lg font-cormorant tracking-[0.3em] mb-2">✦ CÓDIGO DE VESTIMENTA ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-6">Nuestra boda</h2>
            <h3 className="text-2xl md:text-3xl font-playfair text-wedding-primary mb-12 italic">Formal garden party</h3>
            
            {/* Dresscode Image */}
            <div className="mb-12">
              <Image
                src="/images/dresscode.jpeg"
                alt="Código de vestimenta - Formal garden party"
                width={600}
                height={800}
                className="mx-auto rounded-2xl shadow-lg border-4 border-white"
              />
            </div>
            
            {/* Text Information */}
            <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-8xl mb-6">🤵🏻</div>
                <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">ELLOS</h3>
                <div className="text-wedding-blush font-cormorant space-y-2 text-lg">
                  <p>Traje</p>
                  <p>Chacabana</p>
                  <p>Corbatín o corbata</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-8xl mb-6">👰🏻</div>
                <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">ELLAS</h3>
                <div className="text-wedding-blush font-cormorant space-y-2 text-lg">
                  <p>Vestido largo</p>
                  <p>Tacón grueso</p>
                  <p>(no de aguja)</p>
                </div>
              </div>
            </div>
            
            {/* Suggested Colors */}
            <Card className="p-8 bg-gradient-to-br from-rose-50 to-white border-2 border-rose-100 max-w-3xl mx-auto mb-8">
              <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-6">COLORES SUGERIDOS</h3>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {/* Pastel colors from the image */}
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#B8E6E1'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#D4E7A1'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#F5E991'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#F4C2C2'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#F5B895'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#F2D7A7'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#F9E8A8'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#E5F2A3'}}></div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {/* Blue tones */}
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#E8E8F5'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#D1D1F0'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#A8C8E8'}}></div>
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: '#7B68EE'}}></div>
              </div>
              <p className="text-wedding-blush font-cormorant text-lg mb-6">Tonos pasteles y suaves para complementar el jardín</p>
            </Card>

            {/* What NOT to wear */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-2 border-red-200 max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="text-red-500 text-3xl mr-3">🚫</div>
                <h3 className="text-xl font-playfair text-red-700 font-semibold">NO asistir de:</h3>
              </div>
              <p className="text-red-600 font-cormorant text-lg">
                rojo, blanco, beige o estampados
              </p>
            </Card>

            {/* Pinterest Link */}
            <div className="mt-8">
              <p className="text-wedding-blush font-cormorant text-lg mb-4">Para inspiración:</p>
              <Button 
                className="bg-wedding-primary hover:bg-wedding-blush text-white px-6 py-3 font-cormorant text-lg rounded-lg shadow-lg inline-flex items-center"
                onClick={() => window.open('https://pin.it/9uXupRDgz', '_blank')}
              >
                <div className="mr-2">📌</div>
                Ver en Pinterest
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mesa de Regalos Section */}
      <section className="py-20 bg-gradient-to-br from-rose-600 via-rose-500 to-rose-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 text-9xl text-white font-great-vibes">♡</div>
          <div className="absolute bottom-20 right-20 text-9xl text-white font-great-vibes">♡</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-rose-100 text-lg font-cormorant tracking-[0.3em] mb-2">✦ MESA DE REGALOS ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-white mb-12">Mesa de Regalos</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Amazon Registry */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">Amazon</h3>
                  <p className="text-wedding-blush font-cormorant text-sm mb-6 leading-relaxed">
                    Encuentra nuestra lista de regalos en Amazon con todo lo que necesitamos para nuestro nuevo hogar
                  </p>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-cormorant text-lg rounded-lg shadow-lg">
                    Ir a mesa de regalos
                  </Button>
                </div>
              </Card>

              {/* Lluvia de Sobres */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-6xl mb-4">💌</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">Lluvia de Sobres</h3>
                  <p className="text-wedding-blush font-cormorant text-sm mb-6 leading-relaxed italic">
                    "La lluvia de sobres, es la tradición de regalar dinero en efectivo a los novios en un sobre el día del evento"
                  </p>
                </div>
              </Card>

              {/* Transferencia */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-6xl mb-4">💳</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">Transferencia</h3>
                  <p className="text-wedding-blush font-cormorant text-sm mb-4 leading-relaxed italic">
                    "No es necesario estar cerca, para hacer sentir el amor y el cariño"
                  </p>
                  <p className="text-wedding-blush font-cormorant text-sm mb-4">
                    Si así lo prefieres puedes realizar transferencia
                  </p>
                  <div className="bg-rose-50 p-4 rounded-lg text-rose-700 font-cormorant">
                    <p className="font-semibold">NOMBRE</p>
                    <p className="font-semibold">BANCO</p>
                    <p className="font-mono">0000-0000-0000</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/50">
              <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">Gracias</h3>
              <p className="text-wedding-blush font-cormorant text-lg leading-relaxed">
                Por tu muestra de cariño y espero verte en este día tan especial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Buenos Deseos Section */}
      <section className="py-20 bg-gradient-to-b from-white to-rose-50 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/4 text-6xl text-rose-300 font-great-vibes">❦</div>
          <div className="absolute bottom-10 right-1/4 text-6xl text-rose-300 font-great-vibes">❦</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-wedding-accent text-lg font-cormorant tracking-[0.3em] mb-2">✦ BUENOS DESEOS ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-12">Buenos Deseos</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-accent text-6xl mb-4">💝</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">Ver Buenos Deseos</h3>
                  <p className="text-wedding-blush font-cormorant text-sm mb-6 leading-relaxed">
                    Lee todos los hermosos mensajes y deseos que familiares y amigos han compartido para nosotros
                  </p>
                  <Button className="bg-wedding-primary hover:bg-wedding-blush text-white px-6 py-3 font-cormorant text-lg rounded-lg shadow-lg">
                    Ver Buenos Deseos
                  </Button>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                <div className="space-y-4 text-center">
                  <div className="text-wedding-accent text-6xl mb-4">✍️</div>
                  <h3 className="text-2xl font-playfair text-wedding-primary font-semibold mb-4">Enviar Buenos Deseos</h3>
                  <p className="text-wedding-blush font-cormorant text-sm mb-6 leading-relaxed">
                    Comparte tus mejores deseos y bendiciones para nuestra nueva vida juntos
                  </p>
                  <Button className="bg-wedding-primary hover:bg-wedding-blush text-white px-6 py-3 font-cormorant text-lg rounded-lg shadow-lg">
                    Enviar Buenos Deseos
                  </Button>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 bg-gradient-to-br from-rose-50 via-blush-50 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 text-9xl text-rose-300 font-great-vibes transform -rotate-12">♥</div>
          <div className="absolute bottom-0 right-0 text-9xl text-rose-300 font-great-vibes transform rotate-12">♥</div>
          <div className="absolute top-1/2 left-1/3 text-6xl text-rose-200 font-great-vibes">❦</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="mb-4">
                <div className="text-wedding-accent text-lg font-cormorant tracking-[0.3em] mb-2">✦ ÚNETE A NUESTRA CELEBRACIÓN ✦</div>
              </div>
              <h2 className="text-4xl md:text-5xl font-great-vibes text-wedding-primary mb-6">Confirmar Asistencia</h2>
              
              {invitationData.isValid ? (
                <div className="mb-6 p-4 bg-wedding-primary/10 rounded-lg border border-wedding-accent/20">
                  <p className="text-wedding-primary font-cormorant text-lg">
                    ¡Hola! Has sido invitado/a por <span className="font-semibold capitalize">{invitationData.invitedBy}</span>
                  </p>
                  <p className="text-wedding-blush font-cormorant text-sm mt-1">
                    Invitación para {invitationData.guestCount} persona{invitationData.guestCount > 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-wedding-sage/10 rounded-lg border border-wedding-sage/20">
                  <p className="text-wedding-sage font-cormorant text-lg">
                    👋 ¡Bienvenido! Para confirmar tu asistencia, necesitas un enlace de invitación personalizado.
                  </p>
                  <p className="text-wedding-blush font-cormorant text-sm mt-1">
                    Si no tienes uno, por favor contacta a los novios.
                  </p>
                </div>
              )}
              
              <p className="text-lg text-wedding-blush font-cormorant italic">Tu presencia hará que este día sea aún más especial. Por favor, confirma tu asistencia antes del 15 de Noviembre, 2025.</p>
              <div className="flex justify-center items-center space-x-4 mt-6">
                <div className="h-px bg-rose-300 w-12"></div>
                <div className="text-wedding-accent text-lg">♡</div>
                <div className="h-px bg-rose-300 w-12"></div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-white to-rose-50 shadow-2xl border-2 border-rose-100 p-10 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-rose-700 font-cormorant tracking-wide">Correo Electrónico de Contacto</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-200 rounded-lg"
                    required
                  />
                </div>

                {/* Dynamic name fields */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-rose-700 font-cormorant tracking-wide">
                    Nombres de los Asistentes
                  </label>
                  {formData.names.map((name, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-xs text-wedding-blush font-cormorant">
                        {index === 0 ? "Tu nombre completo" : `Acompañante ${index}`}
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        className="border-rose-200 focus:border-rose-400 focus:ring-rose-200 rounded-lg"
                        placeholder={index === 0 ? "Tu nombre completo" : `Nombre del acompañante ${index}`}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-rose-700 font-cormorant tracking-wide">¿Confirmas tu asistencia?</label>
                    <select
                      name="response"
                      value={formData.response}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-rose-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none font-cormorant"
                      required
                    >
                      <option value="">Por favor selecciona</option>
                      <option value="yes">Sí, ahí estaré</option>
                      <option value="no">Lo siento, no podré asistir</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-rose-700 font-cormorant tracking-wide">
                      Número de personas
                      {invitationData.isValid && (
                        <span className="text-xs text-wedding-blush ml-1">(máx. {invitationData.guestCount})</span>
                      )}
                    </label>
                    <select
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-rose-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none font-cormorant"
                      required
                    >
                      {Array.from({ length: invitationData.isValid ? invitationData.guestCount : 5 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} persona{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-rose-700 font-cormorant tracking-wide">Mensaje Especial (Opcional)</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-200 min-h-[100px] rounded-lg font-cormorant"
                    placeholder="Comparte tu emoción o cualquier solicitud especial..."
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white py-4 text-lg font-cormorant tracking-wide rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  ♥ Confirmar Asistencia Ahora ♥
                </Button>
                <p className="text-sm text-rose-500 text-center mt-4 font-cormorant italic">Por favor, incluye los nombres de todos los asistentes y cualquier restricción alimentaria en el mensaje</p>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Hashtag Section */}
      <section className="py-20 bg-gradient-to-br from-rose-600 via-rose-500 to-rose-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 text-9xl text-white font-great-vibes">♡</div>
          <div className="absolute bottom-20 right-20 text-9xl text-white font-great-vibes">♡</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-rose-100 text-lg font-cormorant tracking-[0.3em] mb-2">✦ COMPARTE CON NOSOTROS ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-white mb-8">Hashtag Oficial</h2>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border-2 border-white/50">
              <div className="text-6xl mb-6">📸</div>
              <div className="text-4xl md:text-6xl font-great-vibes text-wedding-primary mb-6">#LeowanderYSarah2025</div>
              <p className="text-lg text-wedding-blush font-cormorant leading-relaxed">
                Comparte con nosotros todas tus fotografías del evento, usando nuestro hashtag oficial en todas tus publicaciones de Facebook e Instagram
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-16 bg-gradient-to-t from-rose-100 to-white border-t border-rose-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-1/4 text-6xl text-rose-300 font-great-vibes">❦</div>
          <div className="absolute top-4 right-1/4 text-6xl text-rose-300 font-great-vibes">❦</div>
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

export default function WeddingInvitation() {
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
