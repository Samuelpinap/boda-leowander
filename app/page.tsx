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
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-stone-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-serif text-stone-800">
              Jane <span className="text-stone-400">&</span> Arthur
            </div>
            <div className="hidden md:flex space-x-8 text-sm tracking-wider text-stone-600">
              <a href="#about" className="hover:text-stone-800 transition-colors">
                ABOUT US
              </a>
              <a href="#invitation" className="hover:text-stone-800 transition-colors">
                INVITATION
              </a>
              <a href="#location" className="hover:text-stone-800 transition-colors">
                LOCATION
              </a>
              <a href="#rsvp" className="hover:text-stone-800 transition-colors">
                RSVP
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
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-6xl md:text-8xl font-script mb-4 leading-tight">Me and you. Just us two.</h1>
          <p className="text-xl md:text-2xl font-serif tracking-wider">20.09.2020</p>
        </div>
      </section>

      {/* Save the Dates Section */}
      <section id="invitation" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left side - Title */}
              <div className="lg:w-1/3">
                <h2 className="text-6xl md:text-7xl font-serif text-stone-800 leading-tight">
                  SAVE
                  <br />
                  THE
                  <br />
                  DATES
                </h2>
              </div>

              {/* Right side - Photo cards */}
              <div className="lg:w-2/3 flex flex-col md:flex-row gap-8 md:gap-6">
                {/* Card 1 */}
                <Card className="relative bg-white shadow-lg border-0 p-8 text-center group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-32 h-48 mx-auto mb-6 overflow-hidden rounded-full bg-stone-200">
                    <Image
                      src="/placeholder.svg?height=200&width=130"
                      alt="The day we met"
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-serif text-stone-300">01.</div>
                  <div className="space-y-2">
                    <p className="text-sm tracking-wider text-stone-500">24 JUN 2017</p>
                    <h3 className="text-lg font-serif text-stone-800">THE DAY WE MET</h3>
                  </div>
                </Card>

                {/* Card 2 */}
                <Card className="relative bg-white shadow-lg border-0 p-8 text-center group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-32 h-48 mx-auto mb-6 overflow-hidden rounded-full bg-stone-200">
                    <Image
                      src="/placeholder.svg?height=200&width=130"
                      alt="Stories opening"
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-serif text-stone-300">02.</div>
                  <div className="space-y-2">
                    <p className="text-sm tracking-wider text-stone-500">12 JUL 2017</p>
                    <h3 className="text-lg font-serif text-stone-800">STORIES OPENING</h3>
                  </div>
                </Card>

                {/* Card 3 */}
                <Card className="relative bg-white shadow-lg border-0 p-8 text-center group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-32 h-48 mx-auto mb-6 overflow-hidden rounded-full bg-stone-200">
                    <Image
                      src="/placeholder.svg?height=200&width=130"
                      alt="The next journey"
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-serif text-stone-300">03.</div>
                  <div className="space-y-2">
                    <p className="text-sm tracking-wider text-stone-500">19 MAY 2022</p>
                    <h3 className="text-lg font-serif text-stone-800">THE NEXT JOURNEY</h3>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-stone-600">
              <p className="text-xl leading-relaxed mb-6">
                What started as a chance encounter on a summer evening has blossomed into a love story that spans
                continents and seasons. From our first dance under the stars to adventures across mountain peaks, every
                moment has led us to this beautiful beginning.
              </p>
              <p className="text-lg leading-relaxed">
                Join us as we celebrate the next chapter of our journey together, surrounded by the people who have made
                our story possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-12">Celebration Details</h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-stone-800">Ceremony</h3>
                <div className="text-stone-600 space-y-2">
                  <p className="text-lg">Mountain View Chapel</p>
                  <p>123 Alpine Drive, Scenic Valley</p>
                  <p>September 20, 2020 at 4:00 PM</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-stone-800">Reception</h3>
                <div className="text-stone-600 space-y-2">
                  <p className="text-lg">Garden Terrace Venue</p>
                  <p>456 Sunset Boulevard, Scenic Valley</p>
                  <p>Following ceremony until midnight</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">RSVP</h2>
              <p className="text-lg text-stone-600">Please let us know if you'll be joining us for our special day</p>
            </div>

            <Card className="bg-white shadow-lg border-0 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-stone-300 focus:border-stone-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-stone-300 focus:border-stone-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Will you be attending?</label>
                  <select
                    name="response"
                    value={formData.response}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-stone-300 rounded-md focus:border-stone-500 focus:outline-none"
                    required
                  >
                    <option value="">Please select</option>
                    <option value="yes">Yes, I'll be there</option>
                    <option value="no">Sorry, I can't make it</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Special Message (Optional)</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border-stone-300 focus:border-stone-500 min-h-[100px]"
                    placeholder="Share your excitement or any special requests..."
                  />
                </div>

                <Button type="submit" className="w-full bg-stone-800 hover:bg-stone-700 text-white py-3 text-lg">
                  Send RSVP
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-stone-200">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-serif text-stone-800 mb-4">
            Jane <span className="text-stone-400">&</span> Arthur
          </div>
          <p className="text-stone-600">With love and gratitude for your presence in our lives</p>
        </div>
      </footer>
    </div>
  )
}
