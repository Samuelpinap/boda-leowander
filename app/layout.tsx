import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Playfair_Display, Dancing_Script, Great_Vibes, Cormorant_Garamond } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const dancing = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dancing",
})

const greatVibes = Great_Vibes({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-great-vibes",
})

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  keywords: ["boda", "wedding", "Leowander", "Sarah", "invitación", "Santiago", "República Dominicana", "2025"],
  authors: [{ name: "Leowander & Sarah" }],
  creator: "Leowander & Sarah",
  publisher: "Leowander & Sarah",
  metadataBase: new URL('https://boda-leowander.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://boda-leowander.vercel.app',
    siteName: 'Leowander & Sarah - Boda',
    title: 'Leowander & Sarah - Invitación de Boda',
    description: 'Nos complace invitarte a celebrar nuestro amor el 29 de Noviembre, 2025 en Santiago, República Dominicana',
    images: [
      {
        url: '/images/hero-couple.jpg',
        width: 1200,
        height: 630,
        alt: 'Leowander & Sarah - Invitación de Boda',
        type: 'image/jpeg',
      },
      {
        url: '/images/hero-couple.jpg',
        width: 1920,
        height: 1080,
        alt: 'Leowander & Sarah - Wedding Invitation',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@leowander_sarah', // Replace with actual Twitter handle if exists
    creator: '@leowander_sarah', // Replace with actual Twitter handle if exists
    title: 'Leowander & Sarah - Invitación de Boda',
    description: 'Nos complace invitarte a celebrar nuestro amor el 29 de Noviembre, 2025 en Santiago, República Dominicana',
    images: ['/images/hero-couple.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes if needed
    // google: 'verification-code',
    // yandex: 'verification-code',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className={`${playfair.variable} ${dancing.variable} ${greatVibes.variable} ${cormorant.variable} bg-background text-foreground`}>{children}</body>
    </html>
  )
}
