import React from 'react'
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-body-sm text-on-surface-variant font-medium py-1">
      <Link
        href="/dashboard"
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-lg">home</span>
        <span>Dashboard</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="material-symbols-outlined text-outline text-base mx-1.5 select-none">
            chevron_right
          </span>
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-on-surface font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
