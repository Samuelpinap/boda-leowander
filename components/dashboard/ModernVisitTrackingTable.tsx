'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Eye,
  Calendar,
  User,
  Globe,
  Search,
  RefreshCw,
  Filter,
  Clock,
  Heart,
  Users,
  ArrowUpDown
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface VisitData {
  _id: string
  invitedBy: string
  invitedPerson?: string
  guestLimit: number
  personalizedGender?: string
  visitedAt: string
  userAgent?: string
  referrer?: string
  sessionId: string
  createdAt: string
}

interface VisitTrackingTableProps {
  token: string
}

export default function ModernVisitTrackingTable({ token }: VisitTrackingTableProps) {
  const [visits, setVisits] = useState<VisitData[]>([])
  const [filteredVisits, setFilteredVisits] = useState<VisitData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'inviter' | 'personalized'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'inviter' | 'visits'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchVisits = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/visit-tracking', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setVisits(data.data || [])
          setFilteredVisits(data.data || [])
        } else {
          toast.error('Failed to load visit data')
        }
      } else if (response.status === 401) {
        toast.error('Session expired')
      } else {
        toast.error('Error loading visit tracking data')
      }
    } catch (error) {
      console.error('Visit tracking fetch error:', error)
      toast.error('Error loading visit tracking data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisits()
  }, [token])

  // Filter and sort visits
  useEffect(() => {
    let filtered = [...visits]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(visit => 
        visit.invitedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.invitedPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (filterBy === 'personalized') {
      filtered = filtered.filter(visit => visit.invitedPerson && visit.invitedPerson.trim() !== '')
    } else if (filterBy === 'inviter') {
      filtered = filtered.filter(visit => !visit.invitedPerson || visit.invitedPerson.trim() === '')
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0
      
      switch (sortBy) {
        case 'date':
          compareValue = new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime()
          break
        case 'inviter':
          compareValue = a.invitedBy.localeCompare(b.invitedBy)
          break
        default:
          compareValue = new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime()
      }

      return sortOrder === 'desc' ? -compareValue : compareValue
    })

    setFilteredVisits(filtered)
  }, [visits, searchTerm, filterBy, sortBy, sortOrder])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getGenderIcon = (gender?: string) => {
    if (gender === 'a') return '👩'
    if (gender === 'o') return '👨'
    return '👤'
  }

  const getBrowserName = (userAgent?: string) => {
    if (!userAgent) return 'Unknown'
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Other'
  }

  // Get visit statistics
  const totalVisits = visits.length
  const uniqueInviters = new Set(visits.map(v => v.invitedBy)).size
  const personalizedVisits = visits.filter(v => v.invitedPerson && v.invitedPerson.trim() !== '').length
  const todayVisits = visits.filter(v => {
    const visitDate = new Date(v.visitedAt).toDateString()
    const today = new Date().toDateString()
    return visitDate === today
  }).length

  if (loading) {
    return (
      <Card className="backdrop-blur bg-white/60 border-white/20 shadow-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Eye className="h-6 w-6 text-purple-600" />
            <CardTitle>Visit Tracking Analytics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur bg-gradient-to-br from-blue-50 to-purple-50 border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur bg-gradient-to-br from-green-50 to-teal-50 border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unique Inviters</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueInviters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur bg-gradient-to-br from-pink-50 to-rose-50 border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Personalized</p>
                <p className="text-2xl font-bold text-gray-900">{personalizedVisits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur bg-gradient-to-br from-yellow-50 to-orange-50 border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Visits</p>
                <p className="text-2xl font-bold text-gray-900">{todayVisits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="backdrop-blur bg-white/60 border-white/20 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle>Visit Tracking Details</CardTitle>
                <CardDescription>Complete history of invitation link visits</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchVisits}
              disabled={loading}
              className="backdrop-blur bg-white/80 border-white/30"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by inviter, person, or session..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 backdrop-blur bg-white/80"
              />
            </div>
            
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-40 backdrop-blur bg-white/80">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visits</SelectItem>
                <SelectItem value="personalized">Personalized</SelectItem>
                <SelectItem value="inviter">General Invites</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32 backdrop-blur bg-white/80">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="inviter">Inviter</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="backdrop-blur bg-white/80"
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border border-white/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-purple-100/50 to-pink-100/50">
                <TableRow>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Personalized For</TableHead>
                  <TableHead>Guest Limit</TableHead>
                  <TableHead>Visit Time</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Session</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => (
                    <TableRow key={visit._id} className="hover:bg-purple-50/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="capitalize">{visit.invitedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {visit.invitedPerson ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getGenderIcon(visit.personalizedGender)}</span>
                            <span className="text-purple-700 font-medium">{visit.invitedPerson}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">General invite</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {visit.guestLimit} guests
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{formatDate(visit.visitedAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{getBrowserName(visit.userAgent)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {visit.sessionId.slice(-8)}...
                        </code>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm || filterBy !== 'all' ? 'No visits match your filters' : 'No visits recorded yet'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredVisits.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {filteredVisits.length} of {totalVisits} total visits
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}