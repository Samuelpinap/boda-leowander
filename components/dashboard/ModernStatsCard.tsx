'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface ModernStatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description: string
  gradient: string
  delay?: string
}

export default function ModernStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  gradient,
  delay = "0s"
}: ModernStatsCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-8"
      style={{ animationDelay: delay }}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Animated Border */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} opacity-20 blur-sm group-hover:opacity-40 transition-all duration-500`} />
      
      <CardContent className="relative p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur opacity-50 group-hover:opacity-75 transition-all duration-500`} />
            <div className={`relative p-3 bg-gradient-to-r ${gradient} rounded-xl shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient} animate-pulse`} />
          </div>
          
          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Floating particles effect */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className={`w-1 h-1 bg-gradient-to-r ${gradient} rounded-full animate-ping`} />
        </div>
        <div className="absolute bottom-6 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className={`w-0.5 h-0.5 bg-gradient-to-r ${gradient} rounded-full animate-ping`} style={{ animationDelay: '0.5s' }} />
        </div>
      </CardContent>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Card>
  )
}