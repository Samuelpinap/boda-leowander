'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Percent,
  Calendar,
  Heart,
  MapPin,
  RefreshCw,
  LogOut,
  Sparkles,
  TrendingUp,
  Star,
  Coffee,
  Shield,
  Gift
} from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'

import DashboardLogin from '@/components/dashboard/DashboardLogin'
import ModernStatsCard from '@/components/dashboard/ModernStatsCard'
import ModernRSVPTable from '@/components/dashboard/ModernRSVPTable'
import ModernWellWishesGrid from '@/components/dashboard/ModernWellWishesGrid'
import ModernAnalyticsCharts from '@/components/dashboard/ModernAnalyticsCharts'
import ModernQuickActions from '@/components/dashboard/ModernQuickActions'

interface DashboardStats {
  metrics: {
    totalInvitations: number
    confirmedGuests: number
    pending: number
    declined: number
    responseRate: number
    daysUntilWedding: number
    wellWishesCount: number
    availableSpots: number
    totalPossibleInvites: number
    validInvitations: number
  }
  charts: {
    rsvpTimeline: Array<{ date: string; responses: number }>
    statusBreakdown: Array<{ name: string; value: number; color: string }>
  }
  recent: {
    rsvps: any[]
    wellWishes: any[]
  }
  dietaryRestrictionsCount: number
  isDemo?: boolean
}

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const fetchStats = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      // Try the main API first
      let response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // If main API fails, fallback to demo mode
      if (!response.ok) {
        console.log('Main API failed, trying demo mode...')
        response = await fetch('/api/dashboard/demo-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          setIsDemoMode(true)
          toast.success('✨ Running in demo mode', {
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            },
          })
        }
      } else {
        setIsDemoMode(false)
      }

      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setLastUpdated(new Date())
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.')
        setToken(null)
      } else {
        toast.error('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Stats fetch error:', error)
      // Try demo mode as last resort
      try {
        const demoResponse = await fetch('/api/dashboard/demo-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (demoResponse.ok) {
          const demoData = await demoResponse.json()
          setStats(demoData)
          setLastUpdated(new Date())
          setIsDemoMode(true)
          toast.success('✨ Demo mode activated!', {
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            },
          })
        } else {
          toast.error('Error loading dashboard')
        }
      } catch (demoError) {
        toast.error('Error loading dashboard')
        console.error('Demo mode also failed:', demoError)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchStats()
    }
  }, [token])

  const handleLogin = (newToken: string) => {
    setToken(newToken)
    localStorage.setItem('dashboardToken', newToken)
  }

  const handleLogout = () => {
    setToken(null)
    setStats(null)
    localStorage.removeItem('dashboardToken')
    toast.success('👋 See you soon!', {
      style: {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        color: 'white',
      },
    })
  }

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('dashboardToken')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  if (!token) {
    return <DashboardLogin onLogin={handleLogin} />
  }

  const getDaysUntilWeddingColor = (days: number) => {
    if (days < 0) return 'from-red-500 to-pink-500'
    if (days < 7) return 'from-yellow-400 to-orange-500'
    if (days < 30) return 'from-blue-400 to-purple-500'
    return 'from-green-400 to-blue-500'
  }

  const getDaysUntilWeddingText = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days ago`
    if (days === 0) return 'Today! 🎉'
    if (days === 1) return '1 day'
    return `${days} days`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
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
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome back, Leowander & Sarah! 💕
                  </h1>
                  {isDemoMode && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 animate-pulse">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Demo Mode
                    </Badge>
                  )}
                </div>
                {stats && (
                  <div className="flex items-center space-x-3 text-gray-600 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span className={`font-medium bg-gradient-to-r ${getDaysUntilWeddingColor(stats.metrics.daysUntilWedding)} bg-clip-text text-transparent`}>
                      {getDaysUntilWeddingText(stats.metrics.daysUntilWedding)} until your special day
                    </span>
                    <span className="text-gray-500 text-sm">• November 29, 2025 at 3:00 PM</span>
                    <Star className="h-4 w-4 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <div className="text-sm text-gray-500 bg-white/60 backdrop-blur px-3 py-1 rounded-full">
                  <Coffee className="h-3 w-3 inline mr-1" />
                  {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchStats}
                disabled={loading}
                className="backdrop-blur bg-white/80 border-white/30 hover:bg-white/90 transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="backdrop-blur bg-white/80 border-white/30 hover:bg-white/90 hover:text-red-600 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !stats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-white/60 backdrop-blur rounded-2xl animate-pulse shadow-xl"></div>
              ))}
            </div>
          </div>
        ) : stats ? (
          <>
            {/* Modern Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <ModernStatsCard
                title="Total Invitations"
                value={stats.metrics.totalInvitations}
                icon={Users}
                description="Your lovely invites sent"
                gradient="from-blue-500 to-purple-600"
                delay="0s"
              />
              <ModernStatsCard
                title="Confirmed Guests"
                value={stats.metrics.confirmedGuests}
                icon={UserCheck}
                description="Ready to celebrate with you"
                gradient="from-green-500 to-teal-600"
                delay="0.1s"
              />
              <ModernStatsCard
                title="Declined"
                value={stats.metrics.declined}
                icon={UserX}
                description="Will be missed"
                gradient="from-red-500 to-pink-600"
                delay="0.2s"
              />
              <ModernStatsCard
                title="Pending RSVPs"
                value={stats.metrics.pending}
                icon={Clock}
                description="Awaiting response"
                gradient="from-yellow-500 to-orange-600"
                delay="0.3s"
              />
              <ModernStatsCard
                title="Response Rate"
                value={`${stats.metrics.responseRate}%`}
                icon={TrendingUp}
                description="Engagement level"
                gradient="from-indigo-500 to-purple-600"
                delay="0.4s"
              />
              <ModernStatsCard
                title="Wedding Countdown"
                value={getDaysUntilWeddingText(stats.metrics.daysUntilWedding)}
                icon={Calendar}
                description="Time remaining"
                gradient={getDaysUntilWeddingColor(stats.metrics.daysUntilWedding)}
                delay="0.5s"
              />
              <ModernStatsCard
                title="Well Wishes"
                value={stats.metrics.wellWishesCount}
                icon={Heart}
                description="Messages full of love for you"
                gradient="from-pink-500 to-rose-600"
                delay="0.6s"
              />
              <ModernStatsCard
                title="Available Spots"
                value={stats.metrics.availableSpots}
                icon={MapPin}
                description="Unused guest capacity"
                gradient={stats.metrics.availableSpots < 10 ? 'from-red-500 to-pink-600' : 'from-emerald-500 to-green-600'}
                delay="0.7s"
              />
              <ModernStatsCard
                title="Valid Invitations"
                value={stats.metrics.validInvitations}
                icon={Shield}
                description="Verified invites"
                gradient="from-cyan-500 to-blue-600"
                delay="0.8s"
              />
              <ModernStatsCard
                title="Total Guest Capacity"
                value={stats.metrics.totalPossibleInvites}
                icon={Gift}
                description="Max possible guests"
                gradient="from-violet-500 to-purple-600"
                delay="0.9s"
              />
            </div>

            {/* Modern Tabs */}
            <Tabs defaultValue="rsvps" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur p-2 rounded-2xl shadow-xl border border-white/20">
                <TabsTrigger 
                  value="rsvps" 
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Your Guests
                  <Badge variant="secondary" className="ml-2 bg-white/20">
                    {stats.metrics.totalInvitations}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="wishes"
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white transition-all duration-300"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Love Messages
                  <Badge variant="secondary" className="ml-2 bg-white/20">
                    {stats.metrics.wellWishesCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rsvps" className="animate-in slide-in-from-right-10 duration-500">
                <ModernRSVPTable token={token} isDemoMode={isDemoMode} />
              </TabsContent>

              <TabsContent value="wishes" className="animate-in slide-in-from-right-10 duration-500">
                <ModernWellWishesGrid token={token} />
              </TabsContent>

              <TabsContent value="analytics" className="animate-in slide-in-from-right-10 duration-500">
                <ModernAnalyticsCharts data={stats.charts} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <div className="text-xl text-gray-600 mb-4">Oops! Something went wrong</div>
            <Button onClick={fetchStats} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:shadow-lg transition-all duration-300">
              Try Again
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}