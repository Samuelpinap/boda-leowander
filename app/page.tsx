"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

export default function WeddingInvitation() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    response: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("RSVP submitted:", formData)
    // Handle form submission here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blush-50 to-pink-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center mb-2">
              <div className="text-sm font-cormorant text-rose-600 tracking-[0.3em] mb-2">NOS COMPLACE INVITARLE A NUESTRA BODA</div>
              <div className="text-4xl font-great-vibes text-rose-700 tracking-wide">
                Leowander <span className="text-rose-400 font-dancing text-5xl mx-3">&</span> Sarah
              </div>
            </div>
            <div className="flex items-center text-sm tracking-wider text-rose-600 font-cormorant font-bold">
              <a href="#about" className="hover:text-rose-800 transition-all duration-300 px-6">
                NUESTRA HISTORIA
              </a>
              <div className="h-px bg-rose-400 w-8 mx-2"></div>
              <a href="#invitation" className="hover:text-rose-800 transition-all duration-300 px-6">
                CEREMONIA
              </a>
              <div className="h-px bg-rose-400 w-8 mx-2"></div>
              <a href="#location" className="hover:text-rose-800 transition-all duration-300 px-6">
                RECEPCIÓN
              </a>
              <div className="h-px bg-rose-400 w-8 mx-2"></div>
              <a href="#rsvp" className="hover:text-rose-800 transition-all duration-300 px-6">
                CONFIRMAR
              </a>
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-rose-900/20 to-black/30"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 animate-fade-in">
          <div className="mb-6">
            <div className="text-rose-200 text-2xl font-cormorant mb-2 tracking-[0.3em]">✦ TOGETHER FOREVER ✦</div>
          </div>
          <h1 className="text-6xl md:text-8xl font-great-vibes mb-6 leading-tight animate-float drop-shadow-2xl">Me and you. Just us two.</h1>
          <div className="space-y-2">
            <p className="text-xl md:text-3xl font-cormorant tracking-[0.2em] text-rose-100">29.11.2025</p>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <div className="h-px bg-rose-300 w-12"></div>
              <div className="text-rose-200 text-lg">♡</div>
              <div className="h-px bg-rose-300 w-12"></div>
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
                  <h2 className="text-6xl md:text-7xl font-playfair text-rose-800 leading-tight">
                    LEOWANDER
                    <br />
                    &
                    <br />
                    SARAH
                  </h2>
                  <div className="absolute -top-4 -left-4 text-rose-300 text-6xl font-great-vibes opacity-30">❦</div>
                  <div className="absolute -bottom-4 -right-4 text-rose-300 text-6xl font-great-vibes opacity-30">❦</div>
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
                    <h3 className="text-lg font-playfair text-rose-800 font-semibold">THE DAY WE MET</h3>
                    <div className="mt-2 text-rose-400">♥</div>
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
                    <h3 className="text-lg font-playfair text-rose-800 font-semibold">STORIES OPENING</h3>
                    <div className="mt-2 text-rose-400">♥</div>
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
                    <h3 className="text-lg font-playfair text-rose-800 font-semibold">THE NEXT JOURNEY</h3>
                    <div className="mt-2 text-rose-400">♥</div>
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
              <div className="text-rose-400 text-lg font-cormorant tracking-[0.3em] mb-2">✦ FALTAN ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-rose-800 mb-8">¡Nos casamos!</h2>
            <p className="text-lg text-rose-600 font-cormorant mb-12">29 de Noviembre, 2025</p>
            
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-rose-200 rounded-lg p-6 hover:border-rose-300 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-playfair text-rose-800 font-bold">0</div>
                <div className="text-sm md:text-base font-cormorant text-rose-600 uppercase tracking-wider">Días</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border-2 border-rose-200 rounded-lg p-6 hover:border-rose-300 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-playfair text-rose-800 font-bold">0</div>
                <div className="text-sm md:text-base font-cormorant text-rose-600 uppercase tracking-wider">Horas</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border-2 border-rose-200 rounded-lg p-6 hover:border-rose-300 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-playfair text-rose-800 font-bold">0</div>
                <div className="text-sm md:text-base font-cormorant text-rose-600 uppercase tracking-wider">Min</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border-2 border-rose-200 rounded-lg p-6 hover:border-rose-300 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-playfair text-rose-800 font-bold">0</div>
                <div className="text-sm md:text-base font-cormorant text-rose-600 uppercase tracking-wider">Seg</div>
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
              <div className="text-rose-400 text-lg font-cormorant tracking-[0.3em] mb-2">✦ CON LA BENDICIÓN DE DIOS Y DE NUESTROS PADRES ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-rose-800 mb-12">Nuestras Familias</h2>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-rose-400 text-4xl mb-4">👰🏻</div>
                  <h3 className="text-2xl font-playfair text-rose-800 font-semibold">Padres de la Novia</h3>
                  <div className="text-rose-600 space-y-2 font-cormorant">
                    <p className="text-lg font-semibold">Carlos Saint-Hilaire</p>
                    <p className="text-lg font-semibold">María González</p>
                  </div>
                  <div className="mt-4 text-rose-400">♥</div>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300">
                <div className="space-y-4 text-center">
                  <div className="text-rose-400 text-4xl mb-4">🤵🏻</div>
                  <h3 className="text-2xl font-playfair text-rose-800 font-semibold">Padres del Novio</h3>
                  <div className="text-rose-600 space-y-2 font-cormorant">
                    <p className="text-lg font-semibold">Roberto Piña</p>
                    <p className="text-lg font-semibold">Ana Rodríguez</p>
                  </div>
                  <div className="mt-4 text-rose-400">♥</div>
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
              <div className="text-rose-400 text-lg font-cormorant tracking-[0.3em] mb-2">✦ NUESTRA HISTORIA ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-rose-800 mb-8 animate-fade-in">Leowander y Sarah</h2>
            <div className="prose prose-lg mx-auto text-rose-700">
              <p className="text-xl leading-relaxed mb-8 font-cormorant italic text-center">
                "Dos corazones que se encontraron en el momento perfecto, dos almas que decidieron caminar juntas hacia el futuro. Hoy celebramos no solo nuestro amor, sino el comienzo de una nueva aventura como esposos."
              </p>
              <div className="flex justify-center items-center space-x-6 my-8">
                <div className="h-px bg-rose-300 w-16"></div>
                <div className="text-rose-400 text-2xl">♥</div>
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
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <div className="text-rose-400 text-lg font-cormorant tracking-[0.3em] mb-2">✦ DÓNDE & CUÁNDO ✦</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-rose-800 mb-12">Detalles de la Celebración</h2>

            <div className="grid md:grid-cols-2 gap-12">
              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                <div className="space-y-4 text-center">
                  <div className="text-rose-400 text-4xl mb-4">⛪</div>
                  <h3 className="text-2xl font-playfair text-rose-800 font-semibold">Ceremonia</h3>
                  <div className="text-rose-600 space-y-3 font-cormorant">
                    <p className="text-lg font-semibold">Parroquia De los Santos Médicos</p>
                    <p>Cosme y Damián</p>
                    <p>Santiago, República Dominicana</p>
                    <p className="font-medium">3:00 PM</p>
                  </div>
                  <div className="mt-4 text-rose-400">♥</div>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg">
                <div className="space-y-4 text-center">
                  <div className="text-rose-400 text-4xl mb-4">🎉</div>
                  <h3 className="text-2xl font-playfair text-rose-800 font-semibold">Recepción</h3>
                  <div className="text-rose-600 space-y-3 font-cormorant">
                    <p className="text-lg font-semibold">Jardín de bodas todo santiago</p>
                    <p>República Dominicana</p>
                    <p className="font-medium">6:00 PM</p>
                    <p className="text-sm italic">Celebración, música y alegría</p>
                    <p className="text-sm italic">Cena, baile y diversión hasta altas horas</p>
                  </div>
                  <div className="mt-4 text-rose-400">♥</div>
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
                <div className="text-rose-400 text-lg font-cormorant tracking-[0.3em] mb-2">✦ ÚnETE A NUESTRA CELEBRACIÓN ✦</div>
              </div>
              <h2 className="text-4xl md:text-5xl font-great-vibes text-rose-800 mb-6">Confirmar Asistencia</h2>
              <p className="text-lg text-rose-600 font-cormorant italic">Tu presencia hará que este día sea aún más especial. Por favor, confirma tu asistencia antes del 15 de Noviembre, 2024.</p>
              <div className="flex justify-center items-center space-x-4 mt-6">
                <div className="h-px bg-rose-300 w-12"></div>
                <div className="text-rose-400 text-lg">♡</div>
                <div className="h-px bg-rose-300 w-12"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-2xl mx-auto">
                <div className="text-center p-6 bg-white/50 rounded-lg">
                  <h4 className="font-playfair text-rose-800 text-lg mb-2">Teléfono</h4>
                  <p className="font-cormorant text-rose-600">+1 (809) 123-4567</p>
                  <p className="text-sm text-rose-500">WhatsApp disponible</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-lg">
                  <h4 className="font-playfair text-rose-800 text-lg mb-2">Email</h4>
                  <p className="font-cormorant text-rose-600">boda@leowanderysarah.com</p>
                  <p className="text-sm text-rose-500">Respuesta en 24 horas</p>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-white to-rose-50 shadow-2xl border-2 border-rose-100 p-10 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-rose-700 font-cormorant tracking-wide">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-rose-200 focus:border-rose-400 focus:ring-rose-200 rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-rose-700 font-cormorant tracking-wide">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-rose-200 focus:border-rose-400 focus:ring-rose-200 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-rose-700 font-cormorant tracking-wide">Will you be attending?</label>
                  <select
                    name="response"
                    value={formData.response}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-rose-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none font-cormorant"
                    required
                  >
                    <option value="">Please select</option>
                    <option value="yes">Yes, I'll be there</option>
                    <option value="no">Sorry, I can't make it</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-rose-700 font-cormorant tracking-wide">Special Message (Optional)</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-200 min-h-[100px] rounded-lg font-cormorant"
                    placeholder="Share your excitement or any special requests..."
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white py-4 text-lg font-cormorant tracking-wide rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  ♥ Confirmar Asistencia Ahora ♥
                </Button>
                <p className="text-sm text-rose-500 text-center mt-4 font-cormorant italic">Por favor, incluye el número de invitados y cualquier restricción alimentaria</p>
              </form>
            </Card>
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
          <div className="text-rose-600 font-cormorant italic text-lg mb-4">Con amor,</div>
          <div className="text-3xl font-great-vibes text-rose-700 mb-6 tracking-wide">
            Leowander <span className="text-rose-400 font-dancing text-4xl mx-3">&</span> Sarah
          </div>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="h-px bg-rose-300 w-16"></div>
            <div className="text-rose-400 text-xl">♥</div>
            <div className="h-px bg-rose-300 w-16"></div>
          </div>
          <p className="text-rose-600 font-cormorant text-lg font-medium">29 de Noviembre, 2024 • Santiago, República Dominicana</p>
          <div className="mt-6 text-rose-400 text-sm font-cormorant tracking-[0.2em]">✦ PARA SIEMPRE & SIEMPRE ✦</div>
        </div>
      </footer>
    </div>
  )
}
