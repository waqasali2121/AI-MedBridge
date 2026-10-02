import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export function AIStatusPanel() {
  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-2xl">
            psychology
          </span>
          <div>
            <h4 className="text-label-lg font-heading font-bold text-on-surface">
              AI Engine Diagnostics
            </h4>
            <p className="text-xs text-on-surface-variant">MedBridge OCR & Translation</p>
          </div>
        </div>
        <Badge variant="teal" pulse icon="check_circle">
          Active
        </Badge>
      </div>

      {/* Main Score Ring */}
      <div className="flex items-center justify-around py-2 bg-surface-container-low rounded-xl p-3 border border-outline-variant/30">
        <div className="relative h-20 w-20 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-outline-variant/30"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-secondary"
              strokeDasharray="99.4, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-headline-sm font-heading font-bold text-primary">
              99.4%
            </span>
          </div>
        </div>
        <div className="text-left space-y-1">
          <span className="text-xs font-semibold uppercase text-outline">OCR Accuracy</span>
          <p className="text-body-sm font-bold text-on-surface">32,840 tokens processed</p>
          <p className="text-xs text-secondary font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified</span>
            Zero fatal misread errors
          </p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3 pt-1">
        <div>
          <div className="flex justify-between text-body-sm mb-1">
            <span className="font-heading font-semibold text-on-surface">Bilingual Terminology</span>
            <span className="font-bold text-secondary">98.8%</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full" style={{ width: '98.8%' }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-body-sm mb-1">
            <span className="font-heading font-semibold text-on-surface">Drug Interaction API</span>
            <span className="font-bold text-secondary">100%</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-body-sm mb-1">
            <span className="font-heading font-semibold text-on-surface">Urdu Medical Translation</span>
            <span className="font-bold text-secondary font-sans">99.2%</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full" style={{ width: '99.2%' }} />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
        <span>Model: <strong>MedBridge-Llama3-8B-Med</strong></span>
        <span className="text-emerald-700 font-medium">Latency: 142ms</span>
      </div>
    </Card>
  )
}
