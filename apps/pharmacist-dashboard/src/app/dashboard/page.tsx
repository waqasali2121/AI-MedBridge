'use client'

import React from 'react'
import { KPICard } from '@/components/dashboard/KPICard'
import { ReviewQueue } from '@/components/dashboard/ReviewQueue'
import { AIStatusPanel } from '@/components/dashboard/AIStatusPanel'
import { ShiftNotes } from '@/components/dashboard/ShiftNotes'
import { SafetyBanner } from '@/components/dashboard/SafetyBanner'
import { Button } from '@/components/ui/Button'
import { Prescription } from '@/types'

const DEMO_PRESCRIPTIONS: Prescription[] = [
  {
    id: 90823,
    user_id: 1,
    image_path: '/prescriptions/rx-90823.png',
    original_filename: 'farhan_rx.jpg',
    file_type: 'image/jpeg',
    extraction_method: 'llama3_ocr_med',
    processing_status: 'extracted',
    review_status: 'pending_review',
    selected_language: 'ur',
    upload_time: '2026-10-02T09:14:00Z',
    confirmed_at: null,
    created_at: '2026-10-02T09:14:00Z',
    medicine_count: 3,
    patient_name: 'Farhan Ahmed',
    patient_age: 42,
    patient_gender: 'Male',
    mrn: 'MRN-88402',
    rx_id: 'RX-90823',
    prescriber: 'Dr. Ayesha Khan (Internal Med)',
    prescriber_npi: 'NPI-1948205912',
    hospital_name: 'Metropolitan General Hospital',
    urgency: 'urgent',
    caregiver_name: 'Saima Ahmed',
    caregiver_relation: 'Wife',
    medicines: [
      {
        id: 1,
        prescription_id: 90823,
        name: 'Amoxicillin',
        strength: '500 mg',
        instruction: 'Take 1 capsule by mouth three times daily after meals',
        frequency: 'Three times daily (TID)',
        duration: '7 Days',
        additional_notes: 'Take after meals with plenty of water',
        ocr_confidence: 0.98,
        source: 'ocr_extracted',
        verification_status: 'confirmed',
        is_duplicate_flag: false,
        dosage_form: 'Oral Capsule',
        dose: '1 Capsule',
        quantity: '21 Capsules',
        timing_instructions: 'Take after meals',
        user_confirmed_at: '09:14 AM Today',
      },
      {
        id: 2,
        prescription_id: 90823,
        name: 'Paracetamol',
        strength: '500 mg',
        instruction: 'Take 1 tablet every 6 hours as needed for fever',
        frequency: 'Every 6 hours (PRN)',
        duration: '5 Days',
        additional_notes: 'Do not exceed 4g daily',
        ocr_confidence: 0.96,
        source: 'ocr_extracted',
        verification_status: 'confirmed',
        is_duplicate_flag: false,
        dosage_form: 'Tablet',
        dose: '1 Tablet',
        quantity: '20 Tablets',
        timing_instructions: 'As needed for fever/pain',
        user_confirmed_at: '09:14 AM Today',
      },
      {
        id: 3,
        prescription_id: 90823,
        name: 'Omeprazole',
        strength: '20 mg',
        instruction: 'Take 1 capsule daily before breakfast',
        frequency: 'Once daily (QD)',
        duration: '14 Days',
        additional_notes: 'Take 30 mins before morning meal',
        ocr_confidence: 0.94,
        source: 'ocr_extracted',
        verification_status: 'confirmed',
        is_duplicate_flag: false,
        dosage_form: 'Delayed-Release Capsule',
        dose: '1 Capsule',
        quantity: '14 Capsules',
        timing_instructions: '30 mins before breakfast',
        user_confirmed_at: '09:14 AM Today',
      },
    ],
  },
  {
    id: 90824,
    user_id: 2,
    image_path: '/prescriptions/rx-90824.png',
    original_filename: 'zainab_cardio.png',
    file_type: 'image/png',
    extraction_method: 'llama3_ocr_med',
    processing_status: 'extracted',
    review_status: 'pending_review',
    selected_language: 'ur',
    upload_time: '2026-10-02T09:02:00Z',
    confirmed_at: null,
    created_at: '2026-10-02T09:02:00Z',
    medicine_count: 4,
    patient_name: 'Zainab Bibi',
    patient_age: 68,
    patient_gender: 'Female',
    mrn: 'MRN-91204',
    rx_id: 'RX-90824',
    prescriber: 'Dr. Tariq Mahmood (Cardiology)',
    urgency: 'stat',
    medicines: [
      { id: 4, prescription_id: 90824, name: 'Clopidogrel', strength: '75 mg', instruction: '1 tab daily', frequency: 'QD', duration: '30 Days', ocr_confidence: 0.99, source: 'ocr_extracted', verification_status: 'unverified', is_duplicate_flag: false },
      { id: 5, prescription_id: 90824, name: 'Atorvastatin', strength: '40 mg', instruction: '1 tab at bedtime', frequency: 'QHS', duration: '30 Days', ocr_confidence: 0.97, source: 'ocr_extracted', verification_status: 'unverified', is_duplicate_flag: false },
    ],
  },
  {
    id: 90825,
    user_id: 3,
    image_path: '/prescriptions/rx-90825.png',
    original_filename: 'david_ortho.jpg',
    file_type: 'image/jpeg',
    extraction_method: 'llama3_ocr_med',
    processing_status: 'extracted',
    review_status: 'pending_review',
    selected_language: 'en',
    upload_time: '2026-10-02T08:45:00Z',
    confirmed_at: null,
    created_at: '2026-10-02T08:45:00Z',
    medicine_count: 2,
    patient_name: 'David Chen',
    patient_age: 35,
    patient_gender: 'Male',
    mrn: 'MRN-74109',
    rx_id: 'RX-90825',
    prescriber: 'Dr. Sarah Jenkins (Orthopedics)',
    urgency: 'routine',
  },
  {
    id: 90826,
    user_id: 4,
    image_path: '/prescriptions/rx-90826.png',
    original_filename: 'amina_peds.png',
    file_type: 'image/png',
    extraction_method: 'llama3_ocr_med',
    processing_status: 'extracted',
    review_status: 'pending_review',
    selected_language: 'ur',
    upload_time: '2026-10-02T08:15:00Z',
    confirmed_at: null,
    created_at: '2026-10-02T08:15:00Z',
    medicine_count: 2,
    patient_name: 'Amina Malik',
    patient_age: 6,
    patient_gender: 'Female',
    mrn: 'MRN-60291',
    rx_id: 'RX-90826',
    prescriber: 'Dr. Bilal Hassan (Pediatrics)',
    urgency: 'pediatric',
    caregiver_name: 'Usman Malik',
    caregiver_relation: 'Father',
  },
]

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-heading font-extrabold text-primary tracking-tight">
            Good morning, Dr. Reid
          </h1>
          <p className="text-body-md text-on-surface-variant font-medium mt-0.5">
            Shift: Day 07:00 - 15:00 • Metropolitan General Outpatient Pharmacy
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon="filter_list">
            Filter Queue
          </Button>
          <Button variant="outline" size="md" icon="download">
            Export Shift Log
          </Button>
          <Button variant="primary" size="md" icon="qr_code_scanner">
            Scan New Rx
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Pending Reviews"
          value={12}
          subtitle="Prescriptions awaiting sign-off"
          badge={{ text: '4 Urgent/STAT', variant: 'warning' }}
          icon="assignment_late"
          iconColor="text-amber-600"
          footer="Avg turnaround time: 3.4 mins"
          footerIcon="schedule"
        />

        <KPICard
          title="Reviewed Today"
          value={18}
          subtitle="Completed pharmacist verifications"
          badge={{ text: '+24% vs yesterday', variant: 'success' }}
          icon="task_alt"
          iconColor="text-secondary"
          footer="100% accuracy rating"
          footerIcon="verified"
        />

        <KPICard
          title="Needs Clarification"
          value={3}
          subtitle="Flagged for prescriber follow-up"
          badge={{ text: 'Action Needed', variant: 'error' }}
          icon="warning"
          iconColor="text-error"
          footer="2 doctor calls pending"
          footerIcon="phone_callback"
        />

        <KPICard
          title="Handover Cards"
          value={64}
          subtitle="Bilingual cards delivered to mobile"
          badge={{ text: 'EN/UR Sync', variant: 'teal' }}
          icon="description"
          iconColor="text-primary"
          footer="Live patient app sync active"
          footerIcon="sync"
        />
      </div>

      {/* Clinical Safety Banner */}
      <SafetyBanner />

      {/* Main Grid Layout: Queue (2/3) + Diagnostics & Notes (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Review Queue (2 cols) */}
        <div className="lg:col-span-2">
          <ReviewQueue items={DEMO_PRESCRIPTIONS} />
        </div>

        {/* Right Column: AI Diagnostics & Shift Notes (1 col) */}
        <div className="space-y-6">
          <AIStatusPanel />
          <ShiftNotes />

          {/* Quick Prescriber Intercom Card */}
          <div className="bg-primary text-on-primary rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-2xl">
                contact_support
              </span>
              <h4 className="font-heading font-bold text-headline-sm">
                Prescriber Intercom
              </h4>
            </div>
            <p className="text-body-sm text-on-primary-container leading-relaxed">
              Direct line to Metropolitan General EHR physician desk for Rx clarification queries.
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon="phone_in_talk"
              fullWidth
              className="bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container"
            >
              Call On-Duty Prescriber
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
