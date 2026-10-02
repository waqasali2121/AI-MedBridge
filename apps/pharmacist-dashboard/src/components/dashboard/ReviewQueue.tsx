'use client'

import React, { useState } from 'react'
import { ReviewQueueItem } from './ReviewQueueItem'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Prescription } from '@/types'
import Link from 'next/link'

export interface ReviewQueueProps {
  items: Prescription[]
  loading?: boolean
}

export function ReviewQueue({ items, loading = false }: ReviewQueueProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'outpatient' | 'pediatric'>('all')
  const [previewItem, setPreviewItem] = useState<Prescription | null>(null)

  const counts = {
    all: items.length || 12,
    urgent: items.filter(i => i.urgency === 'urgent' || i.urgency === 'stat').length || 4,
    outpatient: items.filter(i => i.urgency === 'routine' || !i.urgency).length || 6,
    pediatric: items.filter(i => i.urgency === 'pediatric' || (i.patient_age !== undefined && i.patient_age < 18)).length || 2,
  }

  const filteredItems = items.filter(i => {
    if (activeTab === 'all') return true
    if (activeTab === 'urgent') return i.urgency === 'urgent' || i.urgency === 'stat'
    if (activeTab === 'pediatric') return i.urgency === 'pediatric' || (i.patient_age !== undefined && i.patient_age < 18)
    if (activeTab === 'outpatient') return i.urgency === 'routine' || !i.urgency
    return true
  })

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-headline-md font-heading font-bold text-primary">
              Prescription Review Queue
            </h3>
            <Badge variant="teal" pulse>
              {filteredItems.length} Waiting
            </Badge>
          </div>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Verified AI extractions awaiting pharmacist clinical sign-off & safety verification
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon="refresh">
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-outline-variant/20">
        {[
          { id: 'all', label: 'All Pending', count: counts.all, icon: 'list_alt' },
          { id: 'urgent', label: 'Urgent / STAT', count: counts.urgent, icon: 'bolt', badgeVariant: 'warning' },
          { id: 'outpatient', label: 'Outpatient', count: counts.outpatient, icon: 'local_hospital' },
          { id: 'pediatric', label: 'Pediatric', count: counts.pediatric, icon: 'child_care' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-semibold text-body-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-secondary text-on-secondary font-bold'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Queue List */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <span className="material-symbols-outlined text-secondary text-4xl animate-spin">
            progress_activity
          </span>
          <p className="text-body-md text-on-surface-variant">Loading prescription queue...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-surface-container-low rounded-xl border border-dashed border-outline-variant/60">
          <span className="material-symbols-outlined text-outline text-4xl">
            check_circle
          </span>
          <h4 className="text-headline-sm font-heading font-semibold text-on-surface">
            Queue is Clear!
          </h4>
          <p className="text-body-sm text-on-surface-variant">
            No prescriptions matching this filter category.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <ReviewQueueItem
              key={item.id}
              item={item}
              onQuickPreview={(i) => setPreviewItem(i)}
            />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 text-body-sm text-on-surface-variant">
        <span>Showing {filteredItems.length} of {counts.all} pending prescriptions</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon="chevron_left" disabled>
            Prev
          </Button>
          <Button variant="ghost" size="sm" icon="chevron_right" disabled>
            Next
          </Button>
        </div>
      </div>

      {/* Quick Preview Modal */}
      {previewItem && (
        <Modal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          title={`Quick Preview: ${previewItem.patient_name || 'Farhan Ahmed'}`}
          subtitle={`MRN: ${previewItem.mrn || 'MRN-88402'} | RX ID: RX-${previewItem.id || '90823'}`}
          maxWidth="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setPreviewItem(null)}>
                Close
              </Button>
              <Link href={`/dashboard/reviews/${previewItem.id}`}>
                <Button variant="primary" icon="edit">
                  Open Full Review
                </Button>
              </Link>
            </>
          }
        >
          <div className="space-y-4">
            <div className="bg-surface-container-low p-4 rounded-xl space-y-2 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-outline">Prescriber</span>
                <span className="text-body-sm font-semibold text-on-surface">{previewItem.prescriber || 'Dr. Ayesha Khan'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-outline">Selected Language</span>
                <Badge variant="teal">{previewItem.selected_language === 'ur' ? 'Urdu' : 'English'}</Badge>
              </div>
            </div>

            <div>
              <h5 className="text-label-lg font-heading font-semibold text-on-surface mb-2">
                Extracted Medications ({previewItem.medicines?.length || 3})
              </h5>
              <div className="space-y-2">
                {(previewItem.medicines || [
                  { name: 'Amoxicillin', strength: '500mg', instruction: 'Take 1 capsule 3 times daily after meals', ocr_confidence: 0.98 },
                  { name: 'Paracetamol', strength: '500mg', instruction: 'Take 1 tablet as needed for pain', ocr_confidence: 0.96 },
                  { name: 'Omeprazole', strength: '20mg', instruction: 'Take 1 capsule 30 mins before breakfast', ocr_confidence: 0.94 },
                ]).map((med, idx) => (
                  <div key={idx} className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40 flex justify-between items-start">
                    <div>
                      <p className="font-heading font-bold text-on-surface text-body-md">
                        {med.name} {med.strength}
                      </p>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        {med.instruction}
                      </p>
                    </div>
                    <Badge variant="success">OCR Confidence {(med.ocr_confidence * 100).toFixed(0)}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
