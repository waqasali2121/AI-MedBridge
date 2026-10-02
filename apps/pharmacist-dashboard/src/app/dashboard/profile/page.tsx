'use client'

import React from 'react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { authService } from '@/services/auth'

export default function ProfilePage() {
  const user = authService.getUser() || {
    name: 'Dr. Sarah Reid, PharmD',
    email: 'pharmacist@medbridge.com',
  }

  const handleLogout = () => {
    authService.logout()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Pharmacist Profile' }]} />

      {/* Title */}
      <div>
        <h1 className="text-headline-lg font-heading font-extrabold text-primary">
          Pharmacist Profile & Credentials
        </h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">
          Licensed clinical reviewer credentials and system settings
        </p>
      </div>

      {/* Main Profile Info Card */}
      <Card className="space-y-6">
        <div className="flex items-start justify-between border-b border-outline-variant/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-2xl border-2 border-secondary shadow-md">
              SR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-headline-sm font-heading font-bold text-on-surface">
                  {user.name}
                </h3>
                <Badge variant="teal" icon="verified">
                  Active License
                </Badge>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                Lead Clinical Pharmacist • Metropolitan General Hospital
              </p>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" defaultValue={user.name} readOnly />
          <Input label="Work Email" defaultValue={user.email} readOnly />
          <Input label="NPI Number" defaultValue="NPI-1948205912" readOnly />
          <Input label="State Pharmacist License #" defaultValue="PH-49201-GA" readOnly />
        </div>

        {/* Audit Sign-Off Configuration */}
        <div className="pt-4 border-t border-outline-variant/30 space-y-3">
          <h4 className="text-label-lg font-heading font-bold text-on-surface">
            Digital Signature & Audit Preferences
          </h4>
          <div className="space-y-2 text-body-sm text-on-surface">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-outline text-secondary focus:ring-secondary" />
              <span>Automatically attach digital signature hash to approved handover cards</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-outline text-secondary focus:ring-secondary" />
              <span>Enable AI Co-Pilot high-confidence OCR auto-flagging</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Sign Out Card */}
      <Card className="flex items-center justify-between bg-error-container/30 border-error/20">
        <div>
          <h4 className="text-headline-sm font-heading font-bold text-on-error-container">
            End Shift & Sign Out
          </h4>
          <p className="text-body-sm text-on-surface-variant">
            Clears terminal security session and returns to login page
          </p>
        </div>
        <Button variant="destructive" icon="logout" onClick={handleLogout}>
          Sign Out of Portal
        </Button>
      </Card>
    </div>
  )
}
