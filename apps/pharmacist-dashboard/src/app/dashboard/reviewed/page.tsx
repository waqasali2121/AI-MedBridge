'use client'

import React, { useState } from 'react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { StatusPill } from '@/components/ui/StatusPill'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function ReviewedHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const historyItems = [
    {
      id: 'RX-90819',
      patient: 'Rashid Mahmood',
      mrn: 'MRN-44102',
      prescriber: 'Dr. Ayesha Khan',
      approvedAt: 'Today, 08:30 AM',
      pharmacist: 'Dr. Sarah Reid',
      medsCount: 4,
      status: 'approved',
      language: 'Urdu',
    },
    {
      id: 'RX-90818',
      patient: 'Elena Rostova',
      mrn: 'MRN-88219',
      prescriber: 'Dr. James Miller',
      approvedAt: 'Today, 08:12 AM',
      pharmacist: 'Dr. Sarah Reid',
      medsCount: 2,
      status: 'approved',
      language: 'English',
    },
    {
      id: 'RX-90815',
      patient: 'Mohammad Ali',
      mrn: 'MRN-10294',
      prescriber: 'Dr. Tariq Mahmood',
      approvedAt: 'Yesterday, 04:45 PM',
      pharmacist: 'Dr. Tariq Mahmood',
      medsCount: 3,
      status: 'approved',
      language: 'Urdu',
    },
    {
      id: 'RX-90810',
      patient: 'Sara Khan',
      mrn: 'MRN-55201',
      prescriber: 'Dr. Bilal Hassan',
      approvedAt: 'Yesterday, 02:15 PM',
      pharmacist: 'Dr. Sarah Reid',
      medsCount: 1,
      status: 'correction_required',
      language: 'Urdu',
    },
  ]

  const filtered = historyItems.filter(
    (i) =>
      i.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Reviewed History' }]} />

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-heading font-extrabold text-primary">
            Reviewed Prescriptions History
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Audit log of verified prescriptions, approved handovers, and clarification requests
          </p>
        </div>

        <Button variant="outline" icon="download">
          Export Audit Log (CSV)
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by patient name, MRN, or Rx ID..."
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-10 pr-4 py-2 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-label-md font-heading font-semibold text-outline">
                <th className="py-3.5 px-4">Rx ID</th>
                <th className="py-3.5 px-4">Patient Name & MRN</th>
                <th className="py-3.5 px-4">Prescriber</th>
                <th className="py-3.5 px-4">Verification Date</th>
                <th className="py-3.5 px-4">Reviewer</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-body-sm">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-secondary">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-heading font-bold text-on-surface">{item.patient}</div>
                    <div className="text-xs font-mono text-outline">{item.mrn}</div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                    {item.prescriber}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{item.approvedAt}</td>
                  <td className="py-3.5 px-4 font-medium text-on-surface">{item.pharmacist}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="default">{item.language}</Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusPill status={item.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="sm" icon="visibility">
                      View Audit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
