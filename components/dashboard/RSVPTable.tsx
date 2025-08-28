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
import { Search, Trash2, Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RSVP {
  _id: string
  guestId: string
  guestName: string
  guestCount: number
  attending: 'yes' | 'no' | null
  submittedAt: string
  dietaryRestrictions?: string
  confirmationNumber: string
  email: string
}

interface RSVPTableProps {
  token: string
  isDemoMode?: boolean
}

export default function RSVPTable({ token, isDemoMode = false }: RSVPTableProps) {
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
        toast.error('Failed to load RSVPs')
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

  const handleDelete = async (rsvpId: string, guestName: string) => {
    try {
      const response = await fetch(`/api/dashboard/rsvps?id=${rsvpId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success(`Deleted RSVP for ${guestName}`)
        fetchRSVPs()
      } else {
        toast.error('Failed to delete RSVP')
      }
    } catch (error) {
      toast.error('Error deleting RSVP')
      console.error(error)
    }
  }

  const getStatusBadge = (attending: 'yes' | 'no' | null) => {
    switch (attending) {
      case 'yes':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Attending</Badge>
      case 'no':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Declined</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-stone-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-stone-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search by name or confirmation number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="attending">Attending</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-stone-50">
                <TableHead>Guest</TableHead>
                <TableHead className="hidden sm:table-cell">Guest Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">RSVP Date</TableHead>
                <TableHead className="hidden lg:table-cell">Dietary Restrictions</TableHead>
                <TableHead className="hidden sm:table-cell">Confirmation #</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvps.map((rsvp) => (
                <TableRow key={rsvp._id} className="hover:bg-stone-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-stone-900">
                        {rsvp.guestName}
                      </div>
                      <div className="text-sm text-stone-500 sm:hidden">
                        {rsvp.guestCount} guests • {rsvp.confirmationNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-stone-400" />
                      {rsvp.guestCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(rsvp.attending)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center text-stone-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(rsvp.submittedAt)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="max-w-32 truncate text-stone-600">
                      {rsvp.dietaryRestrictions || 'None'}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-mono text-sm">
                    {rsvp.confirmationNumber}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete RSVP</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the RSVP for {rsvp.guestName}? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(rsvp._id, rsvp.guestName)}
                            className="bg-red-600 hover:bg-red-700"
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-stone-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalItems)} of {pagination.totalItems} RSVPs
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              <span className="px-3 py-1 text-sm bg-stone-100 rounded">
                {currentPage} of {pagination.total}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {rsvps.length === 0 && (
        <div className="text-center py-8 text-stone-500">
          No RSVPs found matching your criteria.
        </div>
      )}
    </div>
  )
}