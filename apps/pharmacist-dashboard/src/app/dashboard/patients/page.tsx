'use client'

import React, { useState } from 'react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function PatientsPage() {
  const [search, setSearch] = useState('')

  const patients = [
    {
      id: 1,
      name: 'Farhan Ahmed',
      mrn: 'MRN-88402',
      age: 42,
      gender: 'Male',
      language: 'Urdu',
      caregiver: 'Saima Ahmed (Wife)',
      activeRx: 3,
      lastVisit: 'Oct 02, 2026',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Zainab Bibi',
      mrn: 'MRN-91204',
      age: 68,
      gender: 'Female',
      language: 'Urdu',
      caregiver: 'Bilal Bibi (Son)',
      activeRx: 4,
      lastVisit: 'Oct 02, 2026',
      status: 'Active',
    },
    {
      id: 3,
      name: 'David Chen',
      mrn: 'MRN-74109',
      age: 35,
      gender: 'Male',
      language: 'English',
      caregiver: 'None',
      activeRx: 2,
      lastVisit: 'Oct 01, 2026',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Amina Malik',
      mrn: 'MRN-60291',
      age: 6,
      gender: 'Female',
      language: 'Urdu',
      caregiver: 'Usman Malik (Father)',
      activeRx: 1,
      lastVisit: 'Sep 28, 2026',
      status: 'Pediatric',
    },
  ]

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Patients Directory' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-heading font-extrabold text-primary">
            Patient & Caregiver Directory
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Registered patients receiving bilingual mobile handover cards
          </p>
        </div>
        <Button variant="primary" icon="person_add">
          Register New Patient
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name or MRN..."
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-10 pr-4 py-2 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-label-md font-heading font-semibold text-outline">
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">MRN</th>
                <th className="py-3.5 px-4">Age / Gender</th>
                <th className="py-3.5 px-4">Preferred Language</th>
                <th className="py-3.5 px-4">Linked Caregiver</th>
                <th className="py-3.5 px-4">Active Rx</th>
                <th className="py-3.5 px-4">Last Visit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-body-sm">
              {filtered.map((patient) => (
                <tr key={patient.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-heading font-bold text-on-surface">
                    {patient.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-secondary">
                    {patient.mrn}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">
                    {patient.age} yrs, {patient.gender}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="teal">{patient.language}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">
                    {patient.caregiver}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    {patient.activeRx} Prescriptions
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{patient.lastVisit}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="sm" icon="badge">
                      View Profile
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
