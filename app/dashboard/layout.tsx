import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Dashboard',
  description: 'Manage your wedding RSVPs and guest list',
  robots: 'noindex, nofollow', // Don't index the dashboard
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}