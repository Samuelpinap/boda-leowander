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
  ExternalLink,
  Sparkles,
  Send,
  FileDown,
  Plus,
  Zap
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ModernQuickActionsProps {
  token: string
  onRefresh?: () => void
}

export default function ModernQuickActions({ token, onRefresh }: ModernQuickActionsProps) {
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
        
        toast.success(`✨ ${type === 'rsvps' ? 'Guest list' : 'Well wishes'} exported!`, {
          style: {
            background: 'linear-gradient(135deg, #10ac84 0%, #1dd1a1 100%)',
            color: 'white',
          },
        })
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
      toast.success(`✨ Invitation created for ${newInvite.guestName}`, {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      })
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
      toast.success('🚀 Reminder emails queued for pending RSVPs!', {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      })
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
      description: 'Download complete RSVP data as CSV',
      icon: Download,
      gradient: 'from-blue-500 to-purple-600',
      action: () => handleExport('rsvps'),
      loading: loading === 'rsvps'
    },
    {
      id: 'export-wishes',
      title: 'Export Well Wishes',
      description: 'Download all messages as JSON',
      icon: FileDown,
      gradient: 'from-green-500 to-emerald-600',
      action: () => handleExport('wellwishes'),
      loading: loading === 'wellwishes'
    },
    {
      id: 'send-reminder',
      title: 'Send Reminders',
      description: 'Notify guests with pending RSVPs',
      icon: Send,
      gradient: 'from-purple-500 to-pink-600',
      action: sendReminder,
      loading: loading === 'reminder'
    }
  ]

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-white/20">
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-emerald-600" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Quick Actions
          </span>
          <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {actions.map((action, index) => (
            <Card 
              key={action.id} 
              className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <CardContent className="relative p-6 z-10">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} rounded-xl blur opacity-50 group-hover:opacity-75 transition-all duration-500`} />
                    <div className={`relative p-3 bg-gradient-to-r ${action.gradient} rounded-xl shadow-lg`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                      {action.description}
                    </p>
                    <Button
                      onClick={action.action}
                      disabled={action.loading}
                      className={`w-full bg-gradient-to-r ${action.gradient} hover:shadow-lg transition-all duration-300 border-0 text-white`}
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

              {/* Shimmer effect */}
              <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Card>
          ))}

          {/* Add Manual Invitation Card */}
          <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: '0.3s' }}>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            
            <CardContent className="relative p-6 z-10">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-all duration-500" />
                  <div className="relative p-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl shadow-lg">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors duration-300">
                    Add New Invitation
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    Create beautiful invitation for guests
                  </p>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg transition-all duration-300 border-0 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Guest
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/95 backdrop-blur-xl border border-white/20">
                      <DialogHeader>
                        <DialogTitle className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                          Create New Invitation
                        </DialogTitle>
                        <DialogDescription>
                          Add a new guest to your wedding invitation list. They'll receive a personalized invitation link.
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
                              className="border-rose-200 focus:border-rose-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guestId">Guest ID *</Label>
                            <Input
                              id="guestId"
                              value={newInvite.guestId}
                              onChange={(e) => setNewInvite(prev => ({ ...prev, guestId: e.target.value }))}
                              placeholder="johndoe2024"
                              className="border-rose-200 focus:border-rose-400"
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
                              className="border-rose-200 focus:border-rose-400"
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
                              className="border-rose-200 focus:border-rose-400"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleAddInvite} 
                          disabled={loading === 'invite'}
                          className="bg-gradient-to-r from-rose-500 to-pink-600 text-white border-0"
                        >
                          {loading === 'invite' ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Create Invitation
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="justify-start border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 group" 
                asChild
              >
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:text-purple-600" />
                  <span className="group-hover:text-purple-600">View Wedding Site</span>
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 group" 
                onClick={() => toast.info('✨ Feature coming soon!')}
              >
                <Mail className="h-4 w-4 mr-2 group-hover:text-purple-600" />
                <span className="group-hover:text-purple-600">Email Templates</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}