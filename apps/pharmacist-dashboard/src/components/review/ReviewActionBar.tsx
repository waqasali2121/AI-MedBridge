'use client'

import React from 'react'
import { Button } from '../ui/Button'

export interface ReviewActionBarProps {
  onSave?: () => void
  onFlag?: () => void
  onClarify?: () => void
  onApprove?: () => void
  loading?: boolean
}

export function ReviewActionBar({
  onSave,
  onFlag,
  onClarify,
  onApprove,
  loading = false,
}: ReviewActionBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-primary text-on-primary border-t border-primary-container p-4 z-20 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Legal Notice */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-container text-secondary-fixed">
            <span className="material-symbols-outlined text-xl">
              gavel
            </span>
          </div>
          <div>
            <p className="text-body-sm font-heading font-bold text-on-primary">
              Licensed Pharmacist Sign-Off
            </p>
            <p className="text-xs text-on-primary-container">
              Approving generates patient handover card and records digital signature in HIPAA audit log
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="md"
            icon="save"
            onClick={onSave}
            disabled={loading}
            className="text-on-primary border-on-primary-container/40 hover:bg-primary-container hover:text-on-primary"
          >
            Save Progress
          </Button>

          <Button
            variant="outline"
            size="md"
            icon="flag"
            onClick={onFlag}
            disabled={loading}
            className="text-rose-300 border-rose-400/40 hover:bg-rose-900/40 hover:text-rose-100"
          >
            Flag Issue
          </Button>

          <Button
            variant="outline"
            size="md"
            icon="help_outline"
            onClick={onClarify}
            disabled={loading}
            className="text-amber-300 border-amber-400/40 hover:bg-amber-900/40 hover:text-amber-100"
          >
            Request Clarification
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon="verified_user"
            onClick={onApprove}
            loading={loading}
            className="shadow-lg hover:shadow-xl"
          >
            Approve & Generate Handover Card
          </Button>
        </div>
      </div>
    </div>
  )
}
