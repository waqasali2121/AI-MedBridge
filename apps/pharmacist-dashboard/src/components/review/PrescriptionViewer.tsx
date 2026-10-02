'use client'

import React, { useState } from 'react'
import { Badge } from '../ui/Badge'
import { Prescription } from '@/types'

export interface PrescriptionViewerProps {
  prescription?: Prescription | null
}

export function PrescriptionViewer({ prescription }: PrescriptionViewerProps) {
  const [zoom, setZoom] = useState(100)

  const patientName = prescription?.patient_name || 'Farhan Ahmed'
  const mrn = prescription?.mrn || 'MRN-88402'
  const rxId = prescription?.rx_id || `RX-${prescription?.id || '90823'}`
  const prescriber = prescription?.prescriber || 'Dr. Ayesha Khan, MD'
  const prescriberNpi = prescription?.prescriber_npi || 'NPI-1948205912'
  const hospital = prescription?.hospital_name || 'Metropolitan General Hospital'

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
      {/* Document Viewer Toolbar */}
      <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-xl">
            description
          </span>
          <span className="font-heading font-bold text-body-md text-on-surface">
            Original E-Prescription Document
          </span>
          <Badge variant="teal" icon="integration_instructions">
            HL7-FHIR v4
          </Badge>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-1">
          <button
            onClick={() => setZoom(Math.max(75, zoom - 15))}
            className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded"
            title="Zoom out"
          >
            <span className="material-symbols-outlined text-lg">zoom_out</span>
          </button>
          <span className="text-xs font-mono px-2 font-semibold text-on-surface">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(150, zoom + 15))}
            className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded"
            title="Zoom in"
          >
            <span className="material-symbols-outlined text-lg">zoom_in</span>
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded"
            title="Reset zoom"
          >
            <span className="material-symbols-outlined text-lg">aspect_ratio</span>
          </button>
        </div>
      </div>

      {/* Document Scroll Viewport */}
      <div className="flex-1 p-6 overflow-y-auto bg-surface-dim/30 flex justify-center">
        <div
          className="bg-white text-slate-900 shadow-xl border border-slate-200 rounded-lg p-8 w-full max-w-xl space-y-6 transition-all duration-200 font-sans"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Hospital Masthead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900 font-serif">
                {hospital}
              </h2>
              <p className="text-xs font-semibold uppercase text-slate-600">
                Department of Internal Medicine & Outpatient Care
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                100 Medical Center Way, Suite 400 • Tel: (555) 019-2834
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded text-xs font-mono font-bold">
                E-RX VERIFIED
              </span>
              <p className="text-xs text-slate-500 mt-1 font-mono">HASH: 8f92a10b</p>
            </div>
          </div>

          {/* Rx Metadata Strip */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block font-semibold uppercase">Prescription ID</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{rxId}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase">Date Issued</span>
              <span className="font-semibold text-slate-900">Oct 02, 2026</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold uppercase">Prescriber NPI</span>
              <span className="font-mono font-semibold text-slate-900">{prescriberNpi}</span>
            </div>
          </div>

          {/* Patient Info Block */}
          <div className="border border-slate-200 rounded p-4 space-y-2 bg-slate-50/50 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block font-semibold uppercase">Patient Name</span>
                <span className="text-sm font-bold text-slate-900">{patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold uppercase">Medical Record # (MRN)</span>
                <span className="text-sm font-mono font-bold text-slate-900">{mrn}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
              <div>
                <span className="text-slate-500 block font-semibold">Age / Gender</span>
                <span className="font-semibold text-slate-900">42 YRS / MALE</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">Weight</span>
                <span className="font-semibold text-slate-900">78.5 kg</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">Known Allergies</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-1 rounded">PENICILLIN (Mild Rash)</span>
              </div>
            </div>
          </div>

          {/* Rx Symbol + Medication Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="text-2xl font-serif font-bold italic text-slate-900">Rx</span>
              <span className="text-xs font-bold uppercase text-slate-500">Medication Orders</span>
            </div>

            <div className="space-y-4 text-sm">
              {/* Item 1 */}
              <div className="p-3 bg-slate-50/80 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>1. Amoxicillin 500 mg Capsule</span>
                  <span className="font-mono text-xs font-semibold bg-slate-200 px-1.5 py-0.5 rounded">Qty: #21</span>
                </div>
                <p className="text-xs text-slate-700 font-mono">
                  Sig: Take 1 capsule by mouth three times daily (t.i.d.) with meals for 7 days.
                </p>
                <p className="text-xs text-slate-500 italic">Indication: Bacterial Respiratory Infection</p>
              </div>

              {/* Item 2 */}
              <div className="p-3 bg-slate-50/80 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>2. Paracetamol (Acetaminophen) 500 mg Tablet</span>
                  <span className="font-mono text-xs font-semibold bg-slate-200 px-1.5 py-0.5 rounded">Qty: #20</span>
                </div>
                <p className="text-xs text-slate-700 font-mono">
                  Sig: Take 1 tablet by mouth every 6 hours as needed for fever/pain. Do not exceed 4000mg/day.
                </p>
              </div>

              {/* Item 3 */}
              <div className="p-3 bg-slate-50/80 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>3. Omeprazole 20 mg Delayed-Release Capsule</span>
                  <span className="font-mono text-xs font-semibold bg-slate-200 px-1.5 py-0.5 rounded">Qty: #14</span>
                </div>
                <p className="text-xs text-slate-700 font-mono">
                  Sig: Take 1 capsule daily in the morning 30 minutes before breakfast.
                </p>
              </div>
            </div>
          </div>

          {/* Prescriber Signature */}
          <div className="pt-6 border-t border-slate-300 flex justify-between items-end">
            <div>
              <p className="text-xs text-slate-500">Refills: 0 (Zero)</p>
              <p className="text-xs text-slate-500">Substitution Permitted: Yes</p>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-lg font-bold text-slate-800 underline decoration-slate-400">
                {prescriber}
              </div>
              <p className="text-xs font-semibold text-slate-700">{prescriber}</p>
              <p className="text-[10px] text-slate-400 font-mono">Electronically Signed via EPIC EHR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
