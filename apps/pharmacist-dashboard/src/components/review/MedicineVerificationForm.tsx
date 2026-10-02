'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '../ui/Badge'
import { Input } from '../ui/Input'
import { Medicine } from '@/types'

export interface MedicineVerificationFormProps {
  medicines?: Medicine[]
  activeMedicineIndex?: number
  onSelectMedicine?: (index: number) => void
  onUpdateMedicine?: (index: number, updated: Medicine) => void
}

export function MedicineVerificationForm({
  medicines = [
    {
      id: 1,
      prescription_id: 1,
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
      prescription_id: 1,
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
      prescription_id: 1,
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
  activeMedicineIndex = 0,
  onSelectMedicine,
  onUpdateMedicine,
}: MedicineVerificationFormProps) {
  const [selectedIndex, setSelectedIndex] = useState(activeMedicineIndex)

  useEffect(() => {
    setSelectedIndex(activeMedicineIndex)
  }, [activeMedicineIndex])

  const handleTabClick = (idx: number) => {
    setSelectedIndex(idx)
    if (onSelectMedicine) onSelectMedicine(idx)
  }

  const currentMed = medicines[selectedIndex] || medicines[0]

  const [formData, setFormData] = useState<Partial<Medicine>>(currentMed)

  useEffect(() => {
    setFormData(currentMed)
  }, [currentMed])

  const handleChange = (field: keyof Medicine, value: string) => {
    const updated = { ...formData, [field]: value } as Medicine
    setFormData(updated)
    if (onUpdateMedicine) {
      onUpdateMedicine(selectedIndex, updated)
    }
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-headline-sm font-heading font-bold text-primary">
              Medication Verification Form
            </h3>
            <Badge variant="teal" icon="verified">
              OCR Verified ({Math.round((currentMed.ocr_confidence || 0.98) * 100)}%)
            </Badge>
          </div>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Verify extracted clinical parameters against the document on left
          </p>
        </div>
      </div>

      {/* Medicine Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {medicines.map((med, idx) => (
          <button
            key={med.id || idx}
            type="button"
            onClick={() => handleTabClick(idx)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-semibold text-body-sm transition-all whitespace-nowrap ${
              selectedIndex === idx
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-lg">medication</span>
            <span>
              Med {idx + 1}: {med.name}
            </span>
            <span className="material-symbols-outlined text-sm">
              {med.verification_status === 'confirmed' ? 'check_circle' : 'pending'}
            </span>
          </button>
        ))}
      </div>

      {/* User App Confirmation Notice */}
      <div className="bg-secondary-container/40 border border-secondary/30 p-3.5 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-body-sm text-on-secondary-container font-medium">
          <span className="material-symbols-outlined text-secondary text-xl">
            smartphone
          </span>
          <span>
            Patient confirmed mobile preview at <strong>{currentMed.user_confirmed_at || '09:14 AM Today'}</strong>
          </span>
        </div>
        <Badge variant="teal" icon="check_circle">
          User Confirmed
        </Badge>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Input
            label="Medicine Name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-9 text-secondary text-lg">
            check_circle
          </span>
        </div>

        <div className="relative">
          <Input
            label="Strength"
            value={formData.strength || ''}
            onChange={(e) => handleChange('strength', e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-9 text-secondary text-lg">
            check_circle
          </span>
        </div>

        <div className="relative">
          <Input
            label="Dosage Form"
            value={formData.dosage_form || 'Oral Capsule'}
            onChange={(e) => handleChange('dosage_form', e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-9 text-secondary text-lg">
            check_circle
          </span>
        </div>

        <div className="relative">
          <Input
            label="Dose / Unit"
            value={formData.dose || '1 Capsule'}
            onChange={(e) => handleChange('dose', e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-9 text-secondary text-lg">
            check_circle
          </span>
        </div>

        <div className="relative">
          <Input
            label="Frequency"
            value={formData.frequency || ''}
            onChange={(e) => handleChange('frequency', e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-9 text-secondary text-lg">
            check_circle
          </span>
        </div>

        <div className="relative">
          <Input
            label="Duration"
            value={formData.duration || ''}
            onChange={(e) => handleChange('duration', e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-9 text-secondary text-lg">
            check_circle
          </span>
        </div>

        <div className="relative">
          <Input
            label="Total Quantity to Dispense"
            value={formData.quantity || '21 Capsules'}
            onChange={(e) => handleChange('quantity', e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-9 text-secondary text-lg">
            check_circle
          </span>
        </div>

        <div className="relative">
          <Input
            label="Timing / Administration Instructions"
            value={formData.timing_instructions || 'Take after meals with plenty of water'}
            onChange={(e) => handleChange('timing_instructions', e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-9 text-secondary text-lg">
            check_circle
          </span>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="pt-2 border-t border-outline-variant/30 flex items-center gap-3">
        <input
          type="checkbox"
          id="confirm-match"
          defaultChecked
          className="h-5 w-5 rounded border-outline text-secondary focus:ring-secondary cursor-pointer"
        />
        <label htmlFor="confirm-match" className="text-body-sm font-semibold text-on-surface cursor-pointer select-none">
          I confirm that all extracted medicine fields match the original prescription image and clinical standards.
        </label>
      </div>
    </div>
  )
}
