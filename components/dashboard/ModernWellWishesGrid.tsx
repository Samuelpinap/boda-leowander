'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Calendar, Sparkles, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface WellWish {
  _id: string
  name: string
  email?: string
  message: string
  timestamp?: string
  createdAt?: any
  updatedAt?: any
}

interface ModernWellWishesGridProps {
  token: string
}

export default function ModernWellWishesGrid({ token }: ModernWellWishesGridProps) {
  const [wellWishes, setWellWishes] = useState<WellWish[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWellWishes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/well-wishes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setWellWishes(result.data || [])
      } else {
        toast.error('Failed to load well wishes', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
          },
        })
      }
    } catch (error) {
      toast.error('Error loading well wishes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWellWishes()
  }, [token])

  const formatDate = (wish: WellWish) => {
    const dateString = wish.createdAt || wish.timestamp
    if (!dateString) return 'Recently'
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Recently'
    }
  }

  const getSentimentGradient = (message: string) => {
    // Simple sentiment analysis based on keywords
    const positiveWords = ['love', 'happy', 'joy', 'wonderful', 'beautiful', 'amazing', 'congratulations', 'blessed', 'excited']
    const loveWords = ['love', 'heart', 'forever', 'soulmate', 'perfect', 'adore', 'cherish']
    const celebrationWords = ['celebrate', 'party', 'dance', 'cheers', 'toast', 'festive']
    
    const messageLower = message.toLowerCase()
    const hasLoveWords = loveWords.some(word => messageLower.includes(word))
    const hasCelebrationWords = celebrationWords.some(word => messageLower.includes(word))
    const hasPositiveWords = positiveWords.some(word => messageLower.includes(word))
    
    if (hasLoveWords) return 'from-pink-400 to-rose-500'
    if (hasCelebrationWords) return 'from-yellow-400 to-orange-500'
    if (hasPositiveWords) return 'from-green-400 to-emerald-500'
    return 'from-blue-400 to-indigo-500'
  }

  const getRandomDelay = (index: number) => {
    return `${(index * 0.1)}s`
  }

  if (loading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-b border-white/20">
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Messages of Love for You
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                <CardHeader>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (wellWishes.length === 0) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-b border-white/20">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Well Wishes
              </span>
            </div>
            <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              0 messages
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💕</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Messages Yet
            </h3>
            <p className="text-gray-500">
              Loving messages from your guests will appear here as they share their joy for your special day.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-b border-white/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Messages of Love for You
            </span>
            <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
          </div>
          <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse">
            {wellWishes.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wellWishes.map((wish, index) => (
            <Card 
              key={wish._id} 
              className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: getRandomDelay(index) }}
            >
              {/* Gradient Border */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${getSentimentGradient(wish.message)} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              
              {/* Floating hearts animation */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-700">
                <Heart className="h-3 w-3 text-pink-400 animate-bounce" />
              </div>
              
              <CardHeader className="relative z-10 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${getSentimentGradient(wish.message)} animate-pulse`} />
                    <div className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      {wish.name}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(wish)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <blockquote className="text-gray-700 text-sm leading-relaxed italic group-hover:text-gray-800 transition-colors duration-300">
                  &ldquo;{wish.message}&rdquo;
                </blockquote>
                
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {wish.message.length} characters
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 group-hover:animate-spin" style={{ animationDuration: '2s' }} />
                    <Star className="h-3 w-3 text-yellow-400 group-hover:animate-spin" style={{ animationDuration: '3s' }} />
                    <Star className="h-3 w-3 text-yellow-400 group-hover:animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                </div>
              </CardContent>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}