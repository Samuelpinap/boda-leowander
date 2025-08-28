'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Heart, Loader2, Sparkles, Star, Lock } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'

interface DashboardLoginProps {
  onLogin: (token: string) => void
}

export default function DashboardLogin({ onLogin }: DashboardLoginProps) {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('✨ Welcome to your wedding dashboard!', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        })
        onLogin(data.token)
      } else {
        toast.error(data.error || 'Invalid password', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
          },
        })
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden flex items-center justify-center p-4">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating hearts */}
        <div className="absolute top-1/3 left-1/3 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <Heart className="h-4 w-4 text-pink-300" />
        </div>
        <div className="absolute top-2/3 right-1/3 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Sparkles className="h-3 w-3 text-purple-300" />
        </div>
        <div className="absolute bottom-1/3 left-2/3 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <Star className="h-3 w-3 text-yellow-300" />
        </div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 border-0 bg-white/80 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400 to-purple-600 opacity-20 blur-sm"></div>
        
        <CardHeader className="text-center relative z-10 pb-2">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-2xl">
                <Heart className="h-10 w-10 text-white animate-pulse" style={{ animationDuration: '2s' }} />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Wedding Dashboard
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter the dashboard password to access your beautiful wedding management tools ✨
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-700 font-medium flex items-center">
                <Lock className="h-4 w-4 mr-2 text-purple-500" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secret dashboard password"
                  required
                  disabled={isLoading}
                  className="w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white/90 backdrop-blur pl-4 pr-4 py-3 text-base"
                />
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Access Dashboard
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Secure access to your wedding management suite
            </p>
          </div>
        </CardContent>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full opacity-20 animate-ping" style={{ animationDelay: '1s' }}></div>
      </Card>
    </div>
  )
}