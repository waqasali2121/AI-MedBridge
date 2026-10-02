'use client'

import React from 'react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ReviewQueue } from '@/components/dashboard/ReviewQueue'
import { Prescription } from '@/types'

const PENDING_LIST: Prescription[] = [
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
    urgency: 'urgent',
    caregiver_name: 'Saima Ahmed',
    caregiver_relation: 'Wife',
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

export default function PendingReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'Pending Reviews' }]} />

      {/* Page Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg font-heading font-extrabold text-primary">
            Pending Prescription Queue
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Prescriptions needing clinical verification, dosage checking, and bilingual handover generation
          </p>
        </div>
      </div>

      {/* Full Queue View */}
      <ReviewQueue items={PENDING_LIST} />
    </div>
  )
}
