import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export interface BilingualPreviewProps {
  patientName?: string
  rxId?: string
  verifiedBy?: string
}

export function BilingualPreview({
  patientName = 'Farhan Ahmed',
  rxId = 'RX-90823',
  verifiedBy = 'Dr. Sarah Reid, PharmD',
}: BilingualPreviewProps) {
  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        <div>
          <h3 className="text-headline-sm font-heading font-bold text-primary">
            Bilingual Handover Card Preview
          </h3>
          <p className="text-body-sm text-on-surface-variant">
            Patient view as rendered on MedBridge Mobile & Printed Caregiver Card
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="teal" icon="qr_code_2">
            QR Encrypted
          </Badge>
          <Badge variant="success" icon="verified">
            Pharmacist Signed
          </Badge>
        </div>
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English Side */}
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <span className="font-heading font-bold text-body-md text-primary">
              English Patient Care Instructions
            </span>
            <span className="text-xs text-outline">Patient: {patientName}</span>
          </div>

          <div className="space-y-3 text-body-sm text-on-surface">
            <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
              <h5 className="font-bold text-secondary">1. Amoxicillin 500mg</h5>
              <p className="mt-1">Take 1 capsule 3 times daily after meals for 7 days.</p>
              <p className="text-xs text-on-surface-variant mt-1">⚠️ Finish entire prescription.</p>
            </div>

            <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
              <h5 className="font-bold text-secondary">2. Paracetamol 500mg</h5>
              <p className="mt-1">Take 1 tablet every 6 hours as needed for fever or body pain.</p>
            </div>

            <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
              <h5 className="font-bold text-secondary">3. Omeprazole 20mg</h5>
              <p className="mt-1">Take 1 capsule daily 30 minutes before breakfast.</p>
            </div>
          </div>
        </div>

        {/* Urdu Side */}
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 space-y-4" dir="rtl">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <span className="font-sans font-bold text-body-md text-primary">
              اردو ہدایت برائے مریض
            </span>
            <span className="text-xs text-outline font-sans">مریض: {patientName}</span>
          </div>

          <div className="space-y-3 text-body-md text-on-surface font-sans leading-relaxed">
            <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
              <h5 className="font-bold text-secondary">1. ایموکسیسیلین 500 ملی گرام</h5>
              <p className="mt-1">کھانا کھانے کے بعد دن میں 3 بار 1 کیپسول 7 دن تک لیں۔</p>
              <p className="text-xs text-on-surface-variant mt-1">⚠️ دوا کا پورا کورس مکمل کریں۔</p>
            </div>

            <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
              <h5 className="font-bold text-secondary">2. پیراسیٹامول 500 ملی گرام</h5>
              <p className="mt-1">بخار یا جسم میں درد کے لیے ہر 6 گھنٹے بعد 1 گولی لیں۔</p>
            </div>

            <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
              <h5 className="font-bold text-secondary">3. اومیپرازول 20 ملی گرام</h5>
              <p className="mt-1">روزانہ صبح ناشتے سے 30 منٹ پہلے 1 کیپسول لیں۔</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
        <span>Prescription ID: <strong className="font-mono">{rxId}</strong></span>
        <span>Verified by: <strong className="text-primary">{verifiedBy}</strong></span>
      </div>
    </Card>
  )
}
