'use client'

import React, { useState } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { ShiftNote } from '@/types'

export function ShiftNotes() {
  const [notes, setNotes] = useState<ShiftNote[]>([
    {
      id: 1,
      severity: 'urgent',
      category: 'Medication Shortage',
      time: '08:30 AM',
      description: 'Amoxicillin 250mg suspension out of stock. Substitute with 500mg chewable tablets divided.',
      author: 'Dr. Tariq Mahmood',
      author_role: 'Night Shift Lead',
    },
    {
      id: 2,
      severity: 'protocol',
      category: 'Clinical Protocol',
      time: '07:15 AM',
      description: 'All pediatric prescriptions under 5 years require secondary weight verification before sign-off.',
      author: 'Dr. Sarah Reid',
      author_role: 'Lead Pharmacist',
    },
    {
      id: 3,
      severity: 'regulatory',
      category: 'Controlled Substance',
      time: 'Yesterday',
      description: 'Updated Schedule IV reporting guidelines active today. Check updated DEA hash before clearance.',
      author: 'Compliance Team',
      author_role: 'Regulatory',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newSeverity, setNewSeverity] = useState<'urgent' | 'protocol' | 'regulatory'>('protocol')

  const handleAddNote = () => {
    if (!newDesc.trim()) return
    const newNote: ShiftNote = {
      id: Date.now(),
      severity: newSeverity,
      category: newCategory || 'Clinical Notice',
      time: 'Just now',
      description: newDesc,
      author: 'Dr. Sarah Reid',
      author_role: 'Lead Pharmacist',
    }
    setNotes([newNote, ...notes])
    setIsModalOpen(false)
    setNewCategory('')
    setNewDesc('')
  }

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'urgent':
        return <Badge variant="error" icon="warning">Shortage Alert</Badge>
      case 'protocol':
        return <Badge variant="teal" icon="verified_user">Protocol Change</Badge>
      default:
        return <Badge variant="default" icon="info">Notice</Badge>
    }
  }

  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            sticky_note_2
          </span>
          <h4 className="text-label-lg font-heading font-bold text-on-surface">
            Shift Notes & Flags
          </h4>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon="add"
          onClick={() => setIsModalOpen(true)}
        >
          Add Note
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2 hover:border-outline-variant transition-colors"
          >
            <div className="flex items-center justify-between">
              {getSeverityBadge(note.severity)}
              <span className="text-xs text-outline font-medium">{note.time}</span>
            </div>
            <p className="text-body-sm text-on-surface font-medium leading-relaxed">
              {note.description}
            </p>
            <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-outline-variant/20">
              <span>By: <strong>{note.author}</strong></span>
              <span className="text-outline">{note.author_role}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Note Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Shift Note / Flag"
        subtitle="Broadcast an important clinical update or inventory notice to the team"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon="send" onClick={handleAddNote}>
              Post Note
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Category / Tag"
            placeholder="e.g. Drug Shortage, Policy Update"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />

          <div>
            <label className="text-label-md font-heading font-semibold text-on-surface block mb-1.5">
              Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'urgent', label: 'Urgent Shortage', variant: 'error' },
                { id: 'protocol', label: 'Protocol', variant: 'teal' },
                { id: 'regulatory', label: 'General Info', variant: 'default' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setNewSeverity(s.id as typeof newSeverity)}
                  className={`p-2.5 rounded-lg border text-body-sm font-heading font-semibold transition-all ${
                    newSeverity === s.id
                      ? 'border-secondary bg-secondary-container text-on-secondary-container shadow-xs'
                      : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-label-md font-heading font-semibold text-on-surface block mb-1.5">
              Note Description *
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Enter detailed notice for incoming pharmacists..."
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-3 text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            />
          </div>
        </div>
      </Modal>
    </Card>
  )
}
