'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface WellWish {
  _id: string
  guestName: string
  message: string
  submittedAt: string
}

interface WellWishesGridProps {
  token: string
}

export default function WellWishesGrid({ token }: WellWishesGridProps) {
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
        const data = await response.json()
        setWellWishes(data.wellWishes || [])
      } else {
        toast.error('Failed to load well wishes')
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSentimentColor = (message: string) => {
    // Simple sentiment analysis based on keywords
    const positiveWords = ['love', 'happy', 'joy', 'wonderful', 'beautiful', 'amazing', 'congratulations', 'blessed', 'excited']
    const loveWords = ['love', 'heart', 'forever', 'soulmate', 'perfect']
    
    const messageLower = message.toLowerCase()
    const hasLoveWords = loveWords.some(word => messageLower.includes(word))
    const hasPositiveWords = positiveWords.some(word => messageLower.includes(word))
    
    if (hasLoveWords) return 'bg-pink-100 text-pink-700 border-pink-200'
    if (hasPositiveWords) return 'bg-green-100 text-green-700 border-green-200'
    return 'bg-blue-100 text-blue-700 border-blue-200'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-stone-200 rounded w-1/2"></div>
              <div className="h-3 bg-stone-100 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-stone-100 rounded"></div>
                <div className="h-3 bg-stone-100 rounded"></div>
                <div className="h-3 bg-stone-100 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (wellWishes.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-stone-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-stone-600 mb-2">
          No Well Wishes Yet
        </h3>
        <p className="text-stone-500">
          Well wishes from guests will appear here once they start sending messages.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-rose-600" />
          <h2 className="text-xl font-semibold text-stone-900">
            Well Wishes ({wellWishes.length})
          </h2>
        </div>
        <Badge variant="secondary" className="bg-rose-100 text-rose-700">
          Latest Messages
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wellWishes.map((wish) => (
          <Card 
            key={wish._id} 
            className={`transition-all hover:shadow-md border-l-4 ${getSentimentColor(wish.message)}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="font-medium text-stone-900">
                  {wish.guestName}
                </div>
                <div className="flex items-center text-xs text-stone-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(wish.submittedAt)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700 text-sm leading-relaxed">
                &ldquo;{wish.message}&rdquo;
              </p>
              <div className="mt-3 pt-3 border-t border-stone-100">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-3 w-3 text-stone-400" />
                  <span className="text-xs text-stone-500">
                    {wish.message.length} characters
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}