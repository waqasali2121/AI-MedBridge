'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface SidebarProps {
  pendingCount?: number
}

export function Sidebar({ pendingCount = 12 }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
      exact: true,
    },
    {
      label: 'Pending Reviews',
      href: '/dashboard/reviews',
      icon: 'assignment_late',
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeColor: 'bg-secondary text-on-secondary',
    },
    {
      label: 'Reviewed History',
      href: '/dashboard/reviewed',
      icon: 'verified_user',
    },
    {
      label: 'Patients',
      href: '/dashboard/patients',
      icon: 'personal_injury',
    },
    {
      label: 'Pharmacist Profile',
      href: '/dashboard/profile',
      icon: 'settings',
    },
  ]

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-72 bg-surface-container-lowest border-r border-outline-variant/40 flex flex-col z-30 select-none shadow-sm">
      {/* Brand Header */}
      <div className="p-6 border-b border-outline-variant/30 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-md">
          <span className="material-symbols-outlined text-secondary-container text-2xl">
            health_and_safety
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-xl text-primary tracking-tight">
              MedBridge
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded">
              Rx
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant font-medium">
            Clinical Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-label-sm font-semibold uppercase tracking-wider text-outline">
          Navigation
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group text-body-md font-heading',
                active
                  ? 'bg-primary text-on-primary font-semibold shadow-sm ring-1 ring-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'material-symbols-outlined text-xl transition-colors',
                    active ? 'text-secondary-fixed-dim' : 'text-outline group-hover:text-primary'
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-label-sm font-bold',
                    active
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-secondary-container text-on-secondary-container'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom HIPAA Compliance Card */}
      <div className="p-4 border-t border-outline-variant/30">
        <div className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/40 flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-xl mt-0.5">
            verified
          </span>
          <div className="text-body-sm">
            <p className="font-heading font-semibold text-on-surface">HIPAA & GxP Compliant</p>
            <p className="text-on-surface-variant text-xs mt-0.5">256-bit encrypted audit logging active</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
