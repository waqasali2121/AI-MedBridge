import React from 'react'
import { Badge } from '../ui/Badge'

export function SafetyBanner() {
  return (
    <div className="bg-primary text-on-primary rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-primary-container">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-primary-container text-secondary-fixed flex-shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-2xl">
            gavel
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-bold text-headline-sm text-on-primary">
              Pharmacist Verification Required
            </h4>
            <Badge variant="teal" pulse icon="smart_toy">
              AI Co-Pilot Mode
            </Badge>
          </div>
          <p className="text-body-sm text-on-primary-container leading-relaxed max-w-3xl">
            MedBridge AI assists with OCR extraction and translation generation. Final medical clinical responsibility resides solely with the licensed reviewing pharmacist. Verify all drug strengths, dosages, and patient instructions against original electronic prescriptions.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-center">
        <button className="px-4 py-2 bg-primary-container hover:bg-tertiary-container text-on-primary text-body-sm font-heading font-semibold rounded-xl border border-on-primary-container/30 transition-all flex items-center gap-1.5">
          <span className="material-symbols-outlined text-lg">description</span>
          <span>View SOP Standards</span>
        </button>
      </div>
    </div>
  )
}
