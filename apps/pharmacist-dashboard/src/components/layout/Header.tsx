'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Badge } from '../ui/Badge'
import { authService } from '@/services/auth'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const user = authService.getUser() || {
    name: 'Dr. Sarah Reid, PharmD',
    role: 'pharmacist',
  }

  return (
    <header className="fixed top-0 right-0 left-72 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/40 px-6 flex items-center justify-between z-20 shadow-xs">
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, MRN, or Rx ID..."
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-10 pr-4 py-1.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-all"
          />
        </div>
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center gap-4">
        {/* Hospital Facility Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/30 text-body-sm font-medium text-on-surface">
          <span className="material-symbols-outlined text-secondary text-lg">
            local_hospital
          </span>
          <span>Metropolitan General Hospital</span>
          <span className="material-symbols-outlined text-outline text-sm">
            expand_more
          </span>
        </div>

        {/* AI Safety Active Status */}
        <Badge variant="teal" pulse icon="psychology">
          AI Co-Pilot Active
        </Badge>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest animate-pulse" />
        </button>

        {/* Vertical Separator */}
        <div className="h-8 w-[1px] bg-outline-variant/40" />

        {/* Pharmacist Profile */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-container transition-colors group"
        >
          <div className="h-9 w-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm border border-secondary/30">
            SR
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-body-sm font-heading font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-on-surface-variant leading-tight">
              Lead Clinical Pharmacist
            </p>
          </div>
        </Link>
      </div>
    </header>
  )
}
