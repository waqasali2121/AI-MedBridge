'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { PrescriptionViewer } from '@/components/review/PrescriptionViewer'
import { MedicineVerificationForm } from '@/components/review/MedicineVerificationForm'
import { AIExplanationPanel } from '@/components/review/AIExplanationPanel'
import { ReviewActionBar } from '@/components/review/ReviewActionBar'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SingleReviewPage() {
  const params = useParams()
  const router = useRouter()
  const rxId = (params?.id as string) || '90823'

  const [loading, setLoading] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [flagModalOpen, setFlagModalOpen] = useState(false)
  const [clarifyModalOpen, setClarifyModalOpen] = useState(false)

  const [flagReason, setFlagReason] = useState('')
  const [clarifyNote, setClarifyNote] = useState('')

  const handleApprove = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccessModalOpen(true)
    }, 800)
  }

  const handleFlagSubmit = () => {
    setFlagModalOpen(false)
    alert(`Prescription RX-${rxId} flagged for review. Reason: ${flagReason}`)
    router.push('/dashboard')
  }

  const handleClarifySubmit = () => {
    setClarifyModalOpen(false)
    alert(`Clarification requested from prescriber for RX-${rxId}. Note: ${clarifyNote}`)
    router.push('/dashboard')
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Pending Reviews', href: '/dashboard/reviews' },
          { label: `Review RX-${rxId} (Farhan Ahmed)` },
        ]}
      />

      {/* Patient Dossier Header Strip */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-2xl shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">person</span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-headline-md font-heading font-extrabold text-primary">
                  Farhan Ahmed
                </h1>
                <span className="text-body-md font-semibold text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-lg">
                  42 YRS, MALE
                </span>
                <Badge variant="warning" icon="priority_high">
                  Urgent Discharge
                </Badge>
                <Badge variant="teal" icon="translate">
                  Urdu Handover Selected
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-on-surface-variant mt-1">
                <span>MRN: <strong className="font-mono text-on-surface">MRN-88402</strong></span>
                <span>Rx ID: <strong className="font-mono text-secondary">RX-90823</strong></span>
                <span>Prescriber: <strong className="text-on-surface">Dr. Ayesha Khan (Internal Med)</strong></span>
                <span>Hospital: <strong>Metropolitan General</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end lg:self-center">
            <span className="text-xs text-outline">Uploaded 12 mins ago</span>
          </div>
        </div>

        {/* Patient Vitals & Clinical Risk Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 text-xs">
          <div>
            <span className="text-outline font-semibold uppercase block">Blood Pressure</span>
            <span className="font-bold text-on-surface text-body-sm">120/80 mmHg</span>
          </div>
          <div>
            <span className="text-outline font-semibold uppercase block">Heart Rate</span>
            <span className="font-bold text-on-surface text-body-sm">74 bpm</span>
          </div>
          <div>
            <span className="text-outline font-semibold uppercase block">Body Weight</span>
            <span className="font-bold text-on-surface text-body-sm">78.5 kg</span>
          </div>
          <div>
            <span className="text-outline font-semibold uppercase block">Allergies</span>
            <span className="font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
              PENICILLIN (Mild Rash)
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Grid: 6 cols Document Viewer (Left) | 6 cols Forms & AI (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[720px]">
        {/* Left Column: E-Prescription Document Viewer */}
        <div className="lg:col-span-6 h-full">
          <PrescriptionViewer />
        </div>

        {/* Right Column: Medicine Verification + AI Explanation */}
        <div className="lg:col-span-6 space-y-6">
          <MedicineVerificationForm />
          <AIExplanationPanel />
        </div>
      </div>

      {/* Sticky Bottom Review Action Bar */}
      <ReviewActionBar
        onApprove={handleApprove}
        onFlag={() => setFlagModalOpen(true)}
        onClarify={() => setClarifyModalOpen(true)}
        onSave={() => alert('Progress saved successfully.')}
        loading={loading}
      />

      {/* Approval Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false)
          router.push('/dashboard')
        }}
        title="Prescription Approved & Handover Card Generated!"
        subtitle="Digital signature recorded. Mobile sync transmitted to patient & caregiver."
        maxWidth="lg"
        footer={
          <Button
            variant="primary"
            icon="arrow_forward"
            onClick={() => {
              setSuccessModalOpen(false)
              router.push('/dashboard')
            }}
          >
            Return to Review Queue
          </Button>
        }
      >
        <div className="space-y-4 text-center py-4">
          <div className="h-16 w-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl">verified_user</span>
          </div>
          <div>
            <h4 className="text-headline-sm font-heading font-bold text-primary">
              Handover Card #HC-90823 Active
            </h4>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Patient <strong>Farhan Ahmed</strong> and caregiver <strong>Saima Ahmed</strong> can now access bilingual instructions on the MedBridge Mobile App.
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-left text-xs font-mono space-y-1">
            <p><strong>AUDIT HASH:</strong> e8f92a10b48c90123f</p>
            <p><strong>PHARMACIST:</strong> Dr. Sarah Reid, PharmD (ID #PH-4920)</p>
            <p><strong>TIMESTAMPS:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>
      </Modal>

      {/* Flag Modal */}
      <Modal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        title="Flag Prescription Issue"
        subtitle="Mark prescription with clinical concerns requiring review"
        footer={
          <>
            <Button variant="ghost" onClick={() => setFlagModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" icon="flag" onClick={handleFlagSubmit}>
              Submit Flag
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="text-label-md font-heading font-semibold text-on-surface block">
            Reason for Flagging *
          </label>
          <textarea
            rows={3}
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="e.g. Allergy conflict detected, dosage exceeds recommended threshold..."
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3 text-body-md text-on-surface focus:outline-none focus:border-error"
          />
        </div>
      </Modal>

      {/* Clarification Modal */}
      <Modal
        isOpen={clarifyModalOpen}
        onClose={() => setClarifyModalOpen(false)}
        title="Request Prescriber Clarification"
        subtitle="Send inquiry directly to Dr. Ayesha Khan (Internal Med)"
        footer={
          <>
            <Button variant="ghost" onClick={() => setClarifyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon="send" onClick={handleClarifySubmit}>
              Send Request
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Inquiry Subject"
            defaultValue="Dosage & Allergy Clarification for RX-90823"
          />
          <div>
            <label className="text-label-md font-heading font-semibold text-on-surface block mb-1">
              Message to Prescriber *
            </label>
            <textarea
              rows={3}
              value={clarifyNote}
              onChange={(e) => setClarifyNote(e.target.value)}
              placeholder="Enter specific question for the prescribing physician..."
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3 text-body-md text-on-surface focus:outline-none focus:border-secondary"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
