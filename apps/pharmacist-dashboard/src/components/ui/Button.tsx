'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      disabled,
      className,
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-heading font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary: 'bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container active:scale-[0.99] shadow-sm',
      secondary: 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container active:scale-[0.99]',
      outline: 'border border-outline-variant text-on-surface hover:bg-surface-container hover:border-outline active:scale-[0.99]',
      ghost: 'bg-transparent text-on-surface hover:bg-surface-container text-on-surface-variant active:scale-[0.99]',
      destructive: 'bg-error text-on-error hover:bg-red-700 active:scale-[0.99] shadow-sm',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-body-sm rounded-lg font-medium',
      md: 'px-4 py-2.5 text-label-lg rounded-lg font-semibold',
      lg: 'px-6 py-3.5 text-headline-sm rounded-xl font-semibold',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="material-symbols-outlined animate-spin text-lg mr-2">
            progress_activity
          </span>
        ) : (
          icon && iconPosition === 'left' && (
            <span className="material-symbols-outlined text-lg mr-2 leading-none">
              {icon}
            </span>
          )
        )}
        <span>{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="material-symbols-outlined text-lg ml-2 leading-none">
            {icon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
