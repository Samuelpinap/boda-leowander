"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import SearchParamsHandler from "@/components/SearchParamsHandler"
import EnvelopeAnimation from "@/components/EnvelopeAnimation"

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
  const [isPlaying, setIsPlaying] = useState(true)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [showMainContent, setShowMainContent] = useState(false)

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

  // Initialize audio and start playing from 1:33 when component mounts
  useEffect(() => {
    const audio = new Audio('/audio/ordinary-wedding-version.mp3')
    audio.currentTime = 93 // 1:33 in seconds
    audio.loop = true
    audio.volume = 0.3 // Set volume to 30%
    
    setAudioRef(audio)
    
    // Auto-play on user interaction
    const playAudio = () => {
      console.log('User interaction detected, attempting to play music...')
      audio.currentTime = 93 // Ensure it starts from 1:33
      console.log('Set audio currentTime to 93 seconds (1:33)')
      audio.play().then(() => {
        console.log('Music started playing successfully')
        setIsPlaying(true)
        document.removeEventListener('click', playAudio)
        document.removeEventListener('touchstart', playAudio)
      }).catch(error => {
        console.log('Auto-play prevented:', error)
        setIsPlaying(false)
      })
    }
    
    // Wait for user interaction to play due to browser auto-play policies
    document.addEventListener('click', playAudio)
    document.addEventListener('touchstart', playAudio)
    
    return () => {
      audio.pause()
      document.removeEventListener('click', playAudio)
      document.removeEventListener('touchstart', playAudio)
    }
  }, [])

  const toggleMusic = () => {
    console.log('Toggle music clicked, audioRef:', audioRef, 'isPlaying:', isPlaying)
    if (audioRef) {
      if (isPlaying) {
        console.log('Pausing music...')
        audioRef.pause()
        setIsPlaying(false)
      } else {
        console.log('Attempting to play music from 1:33...')
        // Always start from 1:33 when resuming
        audioRef.currentTime = 93
        audioRef.play().then(() => {
          console.log('Music play successful!')
          setIsPlaying(true)
        }).catch(error => {
          console.error('Play failed:', error)
          console.error('Audio readyState:', audioRef.readyState)
          console.error('Audio networkState:', audioRef.networkState)
        })
      }
    } else {
      console.error('No audioRef available')
    }
  }

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

  const handleEnvelopeComplete = () => {
    setShowMainContent(true)
  }

  const mainContent = (
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

        <div className="relative z-10 text-center text-white px-6 animate-fade-in pt-20 md:pt-16">
          
          <div className="mb-6">
            <div className="text-orange-200 text-2xl font-cormorant mb-2 tracking-[0.3em]">✦ JUNTOS PARA SIEMPRE ✦</div>
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
                  <div className="relative w-32 h-48 mx-auto overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-200/50">
                    <Image
                      src="/images/image-1.jpeg"
                      alt="Wedding photo 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>

                {/* Card 2 */}
                <Card className="relative bg-gradient-to-br from-white to-rose-50 shadow-lg border border-rose-100 p-8 text-center group hover:shadow-2xl hover:border-rose-200 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative w-32 h-48 mx-auto overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-200/50">
                    <Image
                      src="/images/image-2.jpeg"
                      alt="Wedding photo 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>

                {/* Card 3 */}
                <Card className="relative bg-gradient-to-br from-white to-rose-50 shadow-lg border border-rose-100 p-8 text-center group hover:shadow-2xl hover:border-rose-200 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative w-32 h-48 mx-auto overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-200/50">
                    <Image
                      src="/images/image-3.jpeg"
                      alt="Wedding photo 3"
                      fill
                      className="object-cover object-left"
                    />
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

            {/* Dress Code Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="mb-8">
                <h3 className="text-3xl font-playfair text-wedding-primary font-semibold mb-4">Código de Vestimenta</h3>
                <div className="flex justify-center items-center space-x-4 mb-8">
                  <div className="h-px bg-rose-300 w-16"></div>
                  <div className="text-wedding-accent text-lg">👗</div>
                  <div className="h-px bg-rose-300 w-16"></div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h4 className="text-xl font-playfair text-wedding-primary mb-4 italic">Formal garden party</h4>
              </div>
              
              {/* Dresscode Image */}
              <div className="mb-8">
                <Image
                  src="/images/dresscode.jpeg"
                  alt="Código de vestimenta - Formal garden party"
                  width={500}
                  height={650}
                  className="mx-auto rounded-xl shadow-lg border-2 border-white"
                />
              </div>
              
              {/* Text Information */}
             
              

              {/* What NOT to wear */}
              <Card className="p-6 bg-gradient-to-br from-rose-50 to-white border-2 border-rose-100 max-w-2xl mx-auto mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-red-500 text-3xl mr-3">🚫</div>
                  <h5 className="text-lg font-playfair text-wedding-primary font-semibold text-center">NO asistir de:</h5>
                </div>
                <p className="text-red-600 font-cormorant text-center">
                  rojo, blanco, beige o estampados
                </p>
              </Card>

              {/* Pinterest Link */}
              <div className="text-center">
                <p className="text-wedding-blush font-cormorant mb-3 text-sm">Para inspiración:</p>
                <Button 
                  className="bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-2 font-cormorant text-sm rounded-lg shadow-lg inline-flex items-center"
                  onClick={() => window.open('https://pin.it/9uXupRDgz', '_blank')}
                >
                  <div className="mr-2">📌</div>
                  Ver en Pinterest
                </Button>
              </div>
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
                    <h4 className="text-lg font-playfair text-wedding-primary font-semibold">AC Hotel Santiago de los Caballeros</h4>
                    <div className="text-wedding-blush font-cormorant text-sm">
                      <p>Santiago, República Dominicana</p>
                    </div>
                    <Button 
                      className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-1 text-sm font-cormorant"
                      onClick={() => window.open('https://maps.app.goo.gl/JDajTzSGEmviyVGs5?g_st=ipc', '_blank')}
                    >
                      Ver ubicación
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-white to-rose-50 border border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3 text-center">
                    <h4 className="text-lg font-playfair text-wedding-primary font-semibold">Hotel Santiago, Curio Collection by Hilton</h4>
                    <div className="text-wedding-blush font-cormorant text-sm">
                      <p>Santiago, República Dominicana</p>
                    </div>
                    <Button 
                      className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-1 text-sm font-cormorant"
                      onClick={() => window.open('https://maps.app.goo.gl/aXz8zv1cZST5zLSJ7?g_st=ipc', '_blank')}
                    >
                      Ver ubicación
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-white to-rose-50 border border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3 text-center">
                    <h4 className="text-lg font-playfair text-wedding-primary font-semibold">Nohian Collection Hotels</h4>
                    <div className="text-wedding-blush font-cormorant text-sm">
                      <p>Santiago, República Dominicana</p>
                    </div>
                    <Button 
                      className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-1 text-sm font-cormorant"
                      onClick={() => window.open('https://maps.app.goo.gl/b3pCsBmHxAAp7bfV8?g_st=ipc', '_blank')}
                    >
                      Ver ubicación
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-white to-rose-50 border border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3 text-center">
                    <h4 className="text-lg font-playfair text-wedding-primary font-semibold">Hodelpa Gran Almirante</h4>
                    <div className="text-wedding-blush font-cormorant text-sm">
                      <p>Santiago, República Dominicana</p>
                    </div>
                    <Button 
                      className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-1 text-sm font-cormorant"
                      onClick={() => window.open('https://maps.app.goo.gl/8d4UnE8XLymtYi6b9?g_st=ipc', '_blank')}
                    >
                      Ver ubicación
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-white to-rose-50 border border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-3 text-center">
                    <h4 className="text-lg font-playfair text-wedding-primary font-semibold">Hotel Los Jardines</h4>
                    <div className="text-wedding-blush font-cormorant text-sm">
                      <p>Santiago, República Dominicana</p>
                    </div>
                    <Button 
                      className="mt-4 bg-wedding-primary hover:bg-wedding-blush text-white px-4 py-1 text-sm font-cormorant"
                      onClick={() => window.open('https://maps.app.goo.gl/87r5fcYsr5TybJ1n8?g_st=ipc', '_blank')}
                    >
                      Ver ubicación
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Mesa de Regalos Section */}
      <section className="py-20 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #7DA080, #8AAA8D, #97B49A)'}}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 text-9xl text-white font-great-vibes">♡</div>
          <div className="absolute bottom-20 right-20 text-9xl text-white font-great-vibes">♡</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-green-100 text-lg font-cormorant tracking-[0.3em] mb-2">✦ MESA DE REGALOS ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-white mb-12">Mesa de Regalos</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Amazon Registry */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-playfair font-semibold mb-4" style={{color: '#7DA080'}}>Amazon</h3>
                  <p className="text-wedding-blush font-cormorant text-sm mb-6 leading-relaxed">
                    Encuentra nuestra lista de regalos en Amazon con todo lo que necesitamos para nuestro nuevo hogar
                  </p>
                  <Button 
                    className="text-white px-6 py-3 font-cormorant text-lg rounded-lg shadow-lg transition-all duration-300"
                    style={{backgroundColor: '#7DA080'}} 
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#6B9570'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#7DA080'}
                    onClick={() => window.open('https://www.amazon.com/wedding/registry/2VQBEDH207ZZ8', '_blank')}
                  >
                    Ir a mesa de regalos
                  </Button>
                </div>
              </Card>

              {/* Casa Cuesta */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-6xl mb-4">🎁</div>
                  <h3 className="text-2xl font-playfair font-semibold mb-4" style={{color: '#7DA080'}}>Casa Cuesta</h3>
                  <p className="text-wedding-blush font-cormorant text-sm mb-6 leading-relaxed">
                    Encuentra nuestra lista de regalos en Casa Cuesta con productos especiales para nuestro hogar
                  </p>
                  <Button 
                    className="text-white px-6 py-3 font-cormorant text-lg rounded-lg shadow-lg transition-all duration-300"
                    style={{backgroundColor: '#7DA080'}} 
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#6B9570'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#7DA080'}
                    onClick={() => window.open('https://listaderegalos.casacuesta.com/Event/Leowander-Sarah', '_blank')}
                  >
                    Ver lista de regalos
                  </Button>
                </div>
              </Card>

              {/* Transferencia */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-6xl mb-4">💳</div>
                  <h3 className="text-2xl font-playfair font-semibold mb-4" style={{color: '#7DA080'}}>Transferencia</h3>
                  <p className="text-wedding-blush font-cormorant text-sm mb-4 leading-relaxed italic">
                    "No es necesario estar cerca, para hacer sentir el amor y el cariño"
                  </p>
                  <p className="text-wedding-blush font-cormorant text-sm mb-4">
                    Si así lo prefieres puedes realizar transferencia
                  </p>
                  <div className="p-4 rounded-lg font-cormorant" style={{backgroundColor: '#f0f7f1', color: '#7DA080'}}>
                    <p className="font-semibold">Leowander Piña & Sarah Saint Hilaire</p>
                    <p className="font-semibold">Banco Popular</p>
                    <p className="text-sm mb-2">Cuenta corriente: <span className="font-mono">834192650</span></p>
                    <p className="text-sm">Cédula: <span className="font-mono">402-2480972-9</span></p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/50">
              <h3 className="text-2xl font-playfair font-semibold mb-4" style={{color: '#7DA080'}}>Gracias</h3>
              <p className="text-wedding-blush font-cormorant text-lg leading-relaxed">
                Por tu muestra de cariño y esperamos verte en este día tan especial
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
      <section className="py-20 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #6B9570, #7DA080, #8AAA8D)'}}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 text-9xl text-white font-great-vibes">♡</div>
          <div className="absolute bottom-20 right-20 text-9xl text-white font-great-vibes">♡</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-green-100 text-lg font-cormorant tracking-[0.3em] mb-2">✦ COMPARTE CON NOSOTROS ✦</div>
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

      {/* Floating Music Control Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 bg-wedding-primary hover:bg-wedding-blush text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        <div className="text-2xl">
          {isPlaying ? '🔊' : '🔇'}
        </div>
      </button>
    </div>
  )

  return (
    <EnvelopeAnimation onComplete={handleEnvelopeComplete}>
      {mainContent}
    </EnvelopeAnimation>
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
