import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { cn } from '@/lib/utils'

export interface KPICardProps {
  title: string
  value: number | string
  subtitle?: string
  badge?: {
    text: string
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'teal'
  }
  icon?: string
  iconColor?: string
  footer?: string
  footerIcon?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  badge,
  icon = 'analytics',
  iconColor = 'text-secondary',
  footer,
  footerIcon = 'trending_up',
}: KPICardProps) {
  return (
    <Card hoverable className="relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-surface-container text-on-surface">
              <span className={cn('material-symbols-outlined text-xl', iconColor)}>
                {icon}
              </span>
            </div>
            <span className="text-body-sm font-heading font-semibold text-on-surface-variant">
              {title}
            </span>
          </div>
          {badge && (
            <Badge variant={badge.variant || 'default'} size="sm">
              {badge.text}
            </Badge>
          )}
        </div>

        {/* Big Number */}
        <div className="mt-1">
          <div className="text-headline-xl font-heading font-extrabold text-primary tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-body-sm text-on-surface-variant font-medium mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-base text-secondary">
            {footerIcon}
          </span>
          <span>{footer}</span>
        </div>
      )}
    </Card>
  )
}
