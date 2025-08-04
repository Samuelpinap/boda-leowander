import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Playfair_Display, Dancing_Script, Great_Vibes, Cormorant_Garamond } from "next/font/google"
import { Toaster } from "react-hot-toast"

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
        url: '/images/hero-couple.jpeg',
        width: 1200,
        height: 630,
        alt: 'Leowander & Sarah - Invitación de Boda',
        type: 'image/jpeg',
      },
      {
        url: '/images/hero-couple.jpeg',
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
    images: ['/images/hero-couple.jpeg'],
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
      <body className={`${playfair.variable} ${dancing.variable} ${greatVibes.variable} ${cormorant.variable} bg-background text-foreground`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
              color: '#be185d',
              border: '2px solid #fda4af',
              borderRadius: '12px',
              fontFamily: 'var(--font-cormorant)',
              fontSize: '16px',
              padding: '16px 20px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              style: {
                background: 'linear-gradient(to right, #f0fdf4, #dcfce7)',
                color: '#166534',
                border: '2px solid #86efac',
              },
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff'
              }
            },
            error: {
              style: {
                background: 'linear-gradient(to right, #fef2f2, #fee2e2)',
                color: '#dc2626',
                border: '2px solid #fca5a5',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff'
              }
            }
          }}
        />
      </body>
    </html>
  )
}
