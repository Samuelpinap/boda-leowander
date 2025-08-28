'use client'

import { useState, useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Search, 
  Trash2, 
  Users, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Sparkles,
  Heart,
  UserCheck,
  UserX,
  Clock,
  Mail,
  User,
  MessageSquare,
  Shield,
  Gift,
  UserPlus,
  CalendarDays,
  Info
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RSVP {
  _id: string
  email: string
  invitedPerson: string
  names: string[]
  response: 'yes' | 'no' | null
  message?: string
  guestCount: number
  possibleInvites?: number
  possibleInvitesInvited?: number
  invitedBy?: string
  invitationValid: boolean
  personalizedInvite?: {
    name: string
    gender: string
  } | null
  timestamp: string
  createdAt?: any
  updatedAt?: any
}

interface ModernRSVPTableProps {
  token: string
  isDemoMode?: boolean
}

export default function ModernRSVPTable({ token, isDemoMode = false }: ModernRSVPTableProps) {
  const [rsvps, setRSVPs] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  })
  const [selectedRSVP, setSelectedRSVP] = useState<RSVP | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const fetchRSVPs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        page: currentPage.toString(),
        limit: '10'
      })

      // Use demo API if in demo mode, otherwise try main API first
      const apiUrl = isDemoMode 
        ? `/api/dashboard/demo-rsvps?${params}`
        : `/api/dashboard/rsvps?${params}`

      let response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // If main API fails and not already in demo mode, try demo API
      if (!response.ok && !isDemoMode) {
        response = await fetch(`/api/dashboard/demo-rsvps?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }

      if (response.ok) {
        const data = await response.json()
        setRSVPs(data.rsvps)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to load RSVPs', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
          },
        })
      }
    } catch (error) {
      toast.error('Error loading RSVPs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRSVPs()
  }, [search, statusFilter, currentPage, token])

  const handleDelete = async (rsvpId: string, invitedPerson: string) => {
    try {
      const response = await fetch(`/api/dashboard/rsvps?id=${rsvpId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success(`✨ Deleted RSVP for ${invitedPerson}`, {
          style: {
            background: 'linear-gradient(135deg, #10ac84 0%, #1dd1a1 100%)',
            color: 'white',
          },
        })
        fetchRSVPs()
      } else {
        toast.error('Failed to delete RSVP')
      }
    } catch (error) {
      toast.error('Error deleting RSVP')
      console.error(error)
    }
  }

  const getStatusBadge = (response: 'yes' | 'no' | null) => {
    switch (response) {
      case 'yes':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:shadow-lg transition-shadow duration-300">
            <UserCheck className="h-3 w-3 mr-1" />
            Attending
          </Badge>
        )
      case 'no':
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 hover:shadow-lg transition-shadow duration-300">
            <UserX className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 hover:shadow-lg transition-shadow duration-300 animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A'
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  const handleRowClick = (rsvp: RSVP) => {
    setSelectedRSVP(rsvp)
    setDetailsOpen(true)
  }

  if (loading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>RSVP Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              RSVP Management
            </span>
          </div>
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            {rsvps.length} guests
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
            <Input
              placeholder="Search by name or confirmation number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white/80 backdrop-blur"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-purple-200 focus:border-purple-400 bg-white/80 backdrop-blur">
              <Filter className="h-4 w-4 mr-2 text-purple-400" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="attending">Attending</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border border-purple-100 bg-white/50 backdrop-blur">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
                  <TableHead className="text-purple-700 font-semibold">Invited Person</TableHead>
                  <TableHead className="hidden sm:table-cell text-purple-700 font-semibold">All Guests</TableHead>
                  <TableHead className="text-purple-700 font-semibold">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-purple-700 font-semibold">Guest Limit</TableHead>
                  <TableHead className="hidden lg:table-cell text-purple-700 font-semibold">Invited By</TableHead>
                  <TableHead className="hidden xl:table-cell text-purple-700 font-semibold">Message</TableHead>
                  <TableHead className="w-20 text-purple-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((rsvp, index) => (
                  <TableRow 
                    key={rsvp._id} 
                    className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300 border-purple-100/50"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <TableCell>
                      <div 
                        className="space-y-1 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleRowClick(rsvp)}
                      >
                        <div className="font-medium text-gray-900 flex items-center">
                          <Heart className="h-3 w-3 mr-2 text-pink-400" />
                          {rsvp.invitedPerson}
                          <Info className="h-3 w-3 ml-2 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-500">
                          {rsvp.email}
                        </div>
                        {rsvp.invitationValid && (
                          <Badge className="bg-green-100 text-green-700 text-xs">Valid</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full w-fit">
                          <Users className="h-3 w-3 mr-1 text-blue-500" />
                          <span className="text-blue-700 font-medium">{rsvp.guestCount} / {rsvp.names.length}</span>
                        </div>
                        <div className="text-xs text-gray-600 max-w-[200px] truncate">
                          {rsvp.names.join(', ')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(rsvp.response)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm text-gray-600">
                        {rsvp.possibleInvitesInvited ? (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            Max: {rsvp.possibleInvitesInvited}
                          </span>
                        ) : (
                          <span className="text-gray-400">No limit</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="max-w-32 truncate text-gray-600">
                        {rsvp.invitedBy ? (
                          <span className="text-sm bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                            {rsvp.invitedBy}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Direct</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="max-w-[200px] truncate text-sm text-gray-600" title={rsvp.message}>
                        {rsvp.message || <span className="text-gray-400">No message</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white/95 backdrop-blur">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600">Delete RSVP</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the RSVP for <strong>{rsvp.invitedPerson}</strong>? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(rsvp._id, rsvp.invitedPerson)}
                              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="flex items-center justify-between mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="text-sm text-gray-600 flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-purple-400" />
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalItems)} of {pagination.totalItems} RSVPs
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="border-purple-200 hover:bg-purple-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                <span className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium">
                  {currentPage} of {pagination.total}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="border-purple-200 hover:bg-purple-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {rsvps.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💌</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No RSVPs found
            </h3>
            <p className="text-gray-500">
              No RSVPs match your current search criteria.
            </p>
          </div>
        )}

        {/* RSVP Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                RSVP Details
              </DialogTitle>
              <DialogDescription>
                Complete information for this guest's RSVP
              </DialogDescription>
            </DialogHeader>
            
            {selectedRSVP && (
              <div className="space-y-6 mt-6">
                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <User className="h-5 w-5 mr-2 text-purple-500" />
                    Guest Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Invited Person</p>
                      <p className="font-medium">{selectedRSVP.invitedPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {selectedRSVP.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Response Status</p>
                      <div className="mt-1">{getStatusBadge(selectedRSVP.response)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Invitation Valid</p>
                      <div className="flex items-center mt-1">
                        <Shield className={`h-4 w-4 mr-1 ${selectedRSVP.invitationValid ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`font-medium ${selectedRSVP.invitationValid ? 'text-green-700' : 'text-red-700'}`}>
                          {selectedRSVP.invitationValid ? 'Valid' : 'Invalid'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    Guest List ({selectedRSVP.guestCount} attending)
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {selectedRSVP.names.map((name, index) => (
                        <li key={index} className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-blue-400" />
                          <span className="font-medium">{name}</span>
                          {index === 0 && (
                            <Badge className="ml-2 bg-blue-100 text-blue-700">Main Guest</Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                    {selectedRSVP.possibleInvitesInvited && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm text-blue-700">
                          <Gift className="h-4 w-4 inline mr-1" />
                          Guest Limit: {selectedRSVP.guestCount} / {selectedRSVP.possibleInvitesInvited}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Invitation Details */}
                {(selectedRSVP.invitedBy || selectedRSVP.personalizedInvite) && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center">
                      <UserPlus className="h-5 w-5 mr-2 text-indigo-500" />
                      Invitation Details
                    </h3>
                    <div className="bg-indigo-50 p-4 rounded-lg space-y-2">
                      {selectedRSVP.invitedBy && (
                        <div>
                          <p className="text-sm text-gray-500">Invited By</p>
                          <p className="font-medium">{selectedRSVP.invitedBy}</p>
                        </div>
                      )}
                      {selectedRSVP.personalizedInvite && (
                        <div>
                          <p className="text-sm text-gray-500">Personalized For</p>
                          <p className="font-medium">
                            {selectedRSVP.personalizedInvite.name} ({selectedRSVP.personalizedInvite.gender})
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Message */}
                {selectedRSVP.message && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-pink-500" />
                      Message
                    </h3>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedRSVP.message}</p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-green-500" />
                    Timestamps
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRSVP.createdAt && (
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium">{formatDate(selectedRSVP.createdAt)}</p>
                      </div>
                    )}
                    {selectedRSVP.updatedAt && (
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium">{formatDate(selectedRSVP.updatedAt)}</p>
                      </div>
                    )}
                    {selectedRSVP.timestamp && (
                      <div>
                        <p className="text-sm text-gray-500">Timestamp</p>
                        <p className="font-medium">{formatDate(selectedRSVP.timestamp)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}