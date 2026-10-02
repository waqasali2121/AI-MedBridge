'use client'

import React from 'react'
import Link from 'next/link'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Prescription } from '@/types'

export interface ReviewQueueItemProps {
  item: Prescription
  onQuickPreview?: (item: Prescription) => void
}

export function ReviewQueueItem({ item, onQuickPreview }: ReviewQueueItemProps) {
  const patientName = item.patient_name || item.user?.name || 'Farhan Ahmed'
  const age = item.patient_age || 42
  const gender = item.patient_gender || 'Male'
  const mrn = item.mrn || 'MRN-88402'
  const rxId = item.rx_id || `RX-${item.id || 90823}`
  const prescriber = item.prescriber || 'Dr. Ayesha Khan (Internal Med)'
  const urgency = item.urgency || 'urgent'

  const medList = item.medicines?.map((m) => `${m.name} ${m.strength || ''}`).join(', ') ||
    'Amoxicillin 500mg, Paracetamol 500mg, Omeprazole 20mg'

  const getUrgencyBadge = (u: string) => {
    switch (u) {
      case 'stat':
        return <Badge variant="error" icon="bolt" pulse>STAT (Emergency)</Badge>
      case 'urgent':
        return <Badge variant="warning" icon="priority_high">Urgent Discharge</Badge>
      case 'pediatric':
        return <Badge variant="teal" icon="child_care">Pediatric Rx</Badge>
      default:
        return <Badge variant="info" icon="schedule">Routine Outpatient</Badge>
    }
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 hover:border-secondary/40 hover:shadow-md transition-all duration-200 group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info Column */}
        <div className="flex items-start gap-4 flex-1">
          {/* Avatar Icon */}
          <div className="h-12 w-12 rounded-xl bg-surface-container text-primary flex items-center justify-center font-bold text-lg border border-outline-variant/30 flex-shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">
              person
            </span>
          </div>

          <div className="flex-1 space-y-1">
            {/* Top row: Patient Name + Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-headline-sm font-heading font-bold text-on-surface">
                {patientName}
              </h4>
              <span className="text-body-sm font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                {age} yrs, {gender}
              </span>
              {getUrgencyBadge(urgency)}
              <Badge variant="default" icon="translate">
                {item.selected_language === 'ur' ? 'Urdu (اردو)' : 'English'}
              </Badge>
            </div>

            {/* Sub Meta Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-on-surface-variant">
              <span className="font-mono text-xs font-semibold bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant/30">
                {mrn}
              </span>
              <span className="font-mono text-xs font-semibold text-secondary">
                {rxId}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-outline">
                  stethoscope
                </span>
                <span>{prescriber}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-outline">
                <span className="material-symbols-outlined text-base">
                  schedule
                </span>
                <span>12 mins ago</span>
              </span>
            </div>

            {/* Medicines List summary */}
            <div className="pt-1.5 flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-base mt-0.5">
                medication
              </span>
              <p className="text-body-sm font-medium text-on-surface line-clamp-1">
                <span className="font-semibold text-on-surface-variant mr-1">Extracted Rx ({item.medicine_count || 3}):</span>
                {medList}
              </p>
            </div>

            {/* Caregiver info if available */}
            {item.caregiver_name && (
              <div className="text-xs text-on-surface-variant flex items-center gap-1 pt-0.5">
                <span className="material-symbols-outlined text-xs text-primary">family_history</span>
                <span>Caregiver linked: <strong>{item.caregiver_name}</strong> ({item.caregiver_relation || 'Family'})</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Column */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-outline-variant/30 justify-end flex-shrink-0">
          {onQuickPreview && (
            <Button
              variant="outline"
              size="sm"
              icon="visibility"
              onClick={() => onQuickPreview(item)}
            >
              Quick Preview
            </Button>
          )}
          <Link href={`/dashboard/reviews/${item.id}`}>
            <Button variant="primary" size="sm" icon="verified">
              Review & Verify
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
