'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: string
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      className,
      containerClassName,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-md font-heading font-semibold text-on-surface flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-error text-xs font-normal">*Required</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-xl pointer-events-none select-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 text-body-md text-on-surface placeholder:text-outline transition-all duration-200',
              'focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20',
              disabled && 'bg-surface-container/50 opacity-60 cursor-not-allowed',
              error && 'border-error focus:border-error focus:ring-error/20',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-body-sm text-error flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-body-sm text-on-surface-variant mt-0.5">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
