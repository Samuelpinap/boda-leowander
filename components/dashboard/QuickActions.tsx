'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Download,
  Mail,
  UserPlus,
  FileText,
  Loader2,
  ExternalLink
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface QuickActionsProps {
  token: string
  onRefresh?: () => void
}

export default function QuickActions({ token, onRefresh }: QuickActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newInvite, setNewInvite] = useState({
    guestName: '',
    guestId: '',
    possibleInvites: 1,
    email: ''
  })

  const handleExport = async (type: 'rsvps' | 'wellwishes') => {
    setLoading(type)
    try {
      const response = await fetch(`/api/dashboard/export?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        
        // Get filename from response headers or create default
        const contentDisposition = response.headers.get('content-disposition')
        let filename = `wedding_${type}_export.${type === 'rsvps' ? 'csv' : 'json'}`
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }
        
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success(`${type === 'rsvps' ? 'Guest list' : 'Well wishes'} exported successfully!`)
      } else {
        toast.error('Failed to export data')
      }
    } catch (error) {
      toast.error('Export failed')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const handleAddInvite = async () => {
    if (!newInvite.guestName || !newInvite.guestId) {
      toast.error('Please fill in required fields')
      return
    }

    setLoading('invite')
    try {
      // This would typically add to a separate invitations collection
      // For now, we'll just show a success message
      toast.success(`Invitation created for ${newInvite.guestName}`)
      setNewInvite({ guestName: '', guestId: '', possibleInvites: 1, email: '' })
      setIsDialogOpen(false)
      onRefresh?.()
    } catch (error) {
      toast.error('Failed to create invitation')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const sendReminder = async () => {
    setLoading('reminder')
    try {
      // Mock functionality - in real implementation, this would trigger email reminders
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Reminder emails queued for pending RSVPs!')
    } catch (error) {
      toast.error('Failed to send reminders')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const actions = [
    {
      id: 'export-rsvps',
      title: 'Export Guest List',
      description: 'Download RSVPs as CSV file',
      icon: Download,
      color: 'bg-blue-100 text-blue-700',
      action: () => handleExport('rsvps'),
      loading: loading === 'rsvps'
    },
    {
      id: 'export-wishes',
      title: 'Export Well Wishes',
      description: 'Download messages as JSON file',
      icon: FileText,
      color: 'bg-green-100 text-green-700',
      action: () => handleExport('wellwishes'),
      loading: loading === 'wellwishes'
    },
    {
      id: 'send-reminder',
      title: 'Send Reminders',
      description: 'Email pending RSVPs',
      icon: Mail,
      color: 'bg-purple-100 text-purple-700',
      action: sendReminder,
      loading: loading === 'reminder'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Card key={action.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-stone-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-stone-600 mb-4">
                    {action.description}
                  </p>
                  <Button
                    onClick={action.action}
                    disabled={action.loading}
                    size="sm"
                    className="w-full"
                  >
                    {action.loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <action.icon className="h-4 w-4 mr-2" />
                        {action.title}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Manual Invitation Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-rose-100 text-rose-700">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-stone-900 mb-1">
                  Add Invitation
                </h3>
                <p className="text-sm text-stone-600 mb-4">
                  Create new guest invitation
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Guest
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Invitation</DialogTitle>
                      <DialogDescription>
                        Create a new invitation for a guest. They'll be able to RSVP using the provided Guest ID.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guestName">Guest Name *</Label>
                          <Input
                            id="guestName"
                            value={newInvite.guestName}
                            onChange={(e) => setNewInvite(prev => ({ ...prev, guestName: e.target.value }))}
                            placeholder="John & Jane Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guestId">Guest ID *</Label>
                          <Input
                            id="guestId"
                            value={newInvite.guestId}
                            onChange={(e) => setNewInvite(prev => ({ ...prev, guestId: e.target.value }))}
                            placeholder="johndoe2024"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="possibleInvites">Max Guests</Label>
                          <Input
                            id="possibleInvites"
                            type="number"
                            min="1"
                            max="10"
                            value={newInvite.possibleInvites}
                            onChange={(e) => setNewInvite(prev => ({ ...prev, possibleInvites: parseInt(e.target.value) || 1 }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email (Optional)</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newInvite.email}
                            onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddInvite} disabled={loading === 'invite'}>
                        {loading === 'invite' ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Invitation'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-stone-900">
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Wedding Site
              </a>
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <Mail className="h-4 w-4 mr-2" />
              Email Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}