'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart
} from 'recharts'
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react'

interface ChartData {
  rsvpTimeline: Array<{
    date: string
    responses: number
  }>
  statusBreakdown: Array<{
    name: string
    value: number
    color: string
  }>
}

interface ModernAnalyticsChartsProps {
  data: ChartData
}

export default function ModernAnalyticsCharts({ data }: ModernAnalyticsChartsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-bold drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-2xl border border-purple-100">
          <p className="font-semibold text-gray-800">{`Date: ${formatDate(label)}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-purple-600">
              {`${entry.dataKey}: ${entry.value} responses`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-2xl border border-purple-100">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-purple-600">{`Count: ${data.value} guests`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* RSVP Timeline Chart */}
      <Card className="lg:col-span-2 border-0 bg-white/70 backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              RSVP Response Timeline
            </span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Track how RSVPs are flowing in over time ✨
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.rsvpTimeline} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#6366f1"
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis 
                  stroke="#6366f1"
                  fontSize={12}
                  fontWeight={500}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="responses"
                  stroke="#8884d8"
                  strokeWidth={3}
                  fill="url(#colorUv)"
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown Pie Chart */}
      <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-b border-white/20">
          <CardTitle className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5 text-pink-600" />
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              RSVP Status Breakdown
            </span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Current distribution of responses 🎯
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-gray-700 font-medium">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Guest Count Analysis */}
      <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-white/20">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Guest Count Analysis
            </span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Breakdown by response status 📊
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.statusBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="#059669"
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis 
                  stroke="#059669"
                  fontSize={12}
                  fontWeight={500}
                />
                <Tooltip 
                  content={<PieTooltip />}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-300"
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats Card */}
      <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/20">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analytics Summary
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {data.rsvpTimeline.reduce((sum, item) => sum + item.responses, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Responses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {data.statusBreakdown.find(item => item.name === 'Attending')?.value || 0}
              </div>
              <div className="text-sm text-gray-600">Confirmed Guests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {Math.round((data.statusBreakdown.reduce((sum, item) => sum + (item.name !== 'Pending' ? item.value : 0), 0) / data.statusBreakdown.reduce((sum, item) => sum + item.value, 0)) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}