import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  children,
  className,
  hoverable = false,
  padding = 'md',
  ...props
}: CardProps) {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm transition-all duration-200',
        hoverable && 'hover:shadow-md hover:border-outline-variant/60 cursor-pointer',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
