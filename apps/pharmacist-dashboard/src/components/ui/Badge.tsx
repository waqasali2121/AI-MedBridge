import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'teal'
  icon?: string
  pulse?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export function Badge({
  children,
  variant = 'default',
  icon,
  pulse = false,
  className,
  size = 'md',
}: BadgeProps) {
  const variants = {
    default: 'bg-surface-container-highest text-on-surface-variant',
    success: 'bg-secondary-container text-on-secondary-container',
    warning: 'bg-amber-100 text-amber-900 border border-amber-300',
    error: 'bg-error-container text-on-error-container',
    info: 'bg-surface-container text-on-surface font-medium',
    teal: 'bg-secondary-fixed text-on-secondary-fixed font-semibold',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-label-sm rounded-md',
    md: 'px-2.5 py-1 text-label-md rounded-lg',
  }

  const pulseColors = {
    default: 'bg-outline',
    success: 'bg-secondary',
    warning: 'bg-amber-600',
    error: 'bg-error',
    info: 'bg-primary',
    teal: 'bg-secondary',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-heading font-medium tracking-wide leading-none select-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              pulseColors[variant]
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              pulseColors[variant]
            )}
          />
        </span>
      )}
      {icon && (
        <span className="material-symbols-outlined text-sm leading-none">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  )
}
