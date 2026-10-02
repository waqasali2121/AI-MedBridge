import React from 'react'
import { cn } from '@/lib/utils'

export interface StatusPillProps {
  status: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function StatusPill({ status, label, className, size = 'md' }: StatusPillProps) {
  const normalized = status.toLowerCase()

  const getPillConfig = (s: string) => {
    switch (s) {
      case 'approved':
      case 'reviewed':
      case 'confirmed':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          displayLabel: 'Approved',
        }
      case 'pending_review':
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-500',
          displayLabel: 'Pending Review',
        }
      case 'under_review':
      case 'processing':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
          displayLabel: 'Under Review',
        }
      case 'correction_required':
      case 'flagged':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          displayLabel: 'Needs Clarification',
        }
      case 'urgent':
      case 'stat':
        return {
          bg: 'bg-red-100 text-red-900 border-red-300 font-bold',
          dot: 'bg-red-600 animate-pulse',
          displayLabel: 'URGENT',
        }
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          displayLabel: s.replace(/_/g, ' '),
        }
    }
  }

  const config = getPillConfig(normalized)
  const displayText = label || config.displayLabel

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border capitalize',
        config.bg,
        sizes[size],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      <span>{displayText}</span>
    </span>
  )
}
