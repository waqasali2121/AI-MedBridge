'use client'

import React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Fixed Sidebar */}
      <Sidebar pendingCount={12} />

      {/* Fixed Header */}
      <Header />

      {/* Main Page Area */}
      <main className="pl-72 pt-16 min-h-screen bg-surface p-6">
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  )
}
