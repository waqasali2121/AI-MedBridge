'use client'

import React, { useState } from 'react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

export function AIExplanationPanel() {
  const [langTab, setLangTab] = useState<'en' | 'ur'>('en')
  const [isEditing, setIsEditing] = useState(false)

  const [englishText, setEnglishText] = useState(
    'Take 1 capsule of Amoxicillin 500mg three times daily (every 8 hours) after meals. Complete the full 7-day course even if you feel better. Take 1 tablet of Paracetamol 500mg as needed for fever or body pain, up to 4 times a day. Take 1 capsule of Omeprazole 20mg once daily in the morning 30 minutes before breakfast to protect your stomach.'
  )

  const [urduText, setUrduText] = useState(
    'ایموکسیسیلین (Amoxicillin) 500 ملی گرام کا ایک کیپسول دن میں 3 بار (ہر 8 گھنٹے بعد) کھانا کھانے کے بعد لیں۔ علاج کا پورا 7 دن کا کورس مکمل کریں خواہ آپ بہتر محسوس کر رہے ہوں۔ بخار یا جسم میں درد کے لیے پیراسیٹامول (Paracetamol) 500 ملی گرام کی 1 گولی ضرورت کے مطابق لیں (دن میں 4 بار سے زیادہ نہیں)۔ اومیپرازول (Omeprazole) 20 ملی گرام کا 1 کیپسول روزانہ صبح ناشتے سے 30 منٹ پہلے لیں۔'
  )

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Disclaimer Banner */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-secondary text-2xl mt-0.5">
          smart_toy
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-body-md text-on-surface">
              AI-Generated Patient Handover Instructions
            </h4>
            <Badge variant="teal" icon="auto_awesome">
              Bilingual Engine
            </Badge>
          </div>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Generated patient-facing explanation in simple language. Please verify accuracy before approval.
          </p>
        </div>
      </div>

      {/* Language Switcher & Controls */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLangTab('en')}
            className={`px-4 py-2 rounded-xl text-body-sm font-heading font-semibold transition-all ${
              langTab === 'en'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            English View
          </button>
          <button
            type="button"
            onClick={() => setLangTab('ur')}
            className={`px-4 py-2 rounded-xl text-body-sm font-heading font-semibold transition-all ${
              langTab === 'ur'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Urdu View (اردو)
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={isEditing ? 'check' : 'edit'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Save Changes' : 'Edit Explanation'}
        </Button>
      </div>

      {/* Content Area */}
      {langTab === 'en' ? (
        <div className="space-y-4">
          {isEditing ? (
            <textarea
              rows={4}
              value={englishText}
              onChange={(e) => setEnglishText(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3.5 text-body-md text-on-surface focus:outline-none focus:border-secondary"
            />
          ) : (
            <div className="p-4 bg-surface-container-low/60 rounded-xl border border-outline-variant/20 text-body-md text-on-surface leading-relaxed">
              {englishText}
            </div>
          )}

          {/* Timing Schedule Grid */}
          <div className="space-y-2">
            <h5 className="text-label-md font-heading font-semibold uppercase text-outline">
              Patient Daily Schedule Preview
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-sky-50 text-sky-900 rounded-lg border border-sky-200">
                <span className="material-symbols-outlined block text-lg text-sky-700">wb_sunny</span>
                <span className="font-bold block mt-1">Morning</span>
                <span className="text-[11px] block text-sky-800">Omeprazole + Amoxicillin</span>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
                <span className="material-symbols-outlined block text-lg text-amber-700">wb_twilight</span>
                <span className="font-bold block mt-1">Afternoon</span>
                <span className="text-[11px] block text-amber-800">Amoxicillin</span>
              </div>
              <div className="p-2.5 bg-orange-50 text-orange-900 rounded-lg border border-orange-200">
                <span className="material-symbols-outlined block text-lg text-orange-700">nights_stay</span>
                <span className="font-bold block mt-1">Evening</span>
                <span className="text-[11px] block text-orange-800">Amoxicillin</span>
              </div>
              <div className="p-2.5 bg-purple-50 text-purple-900 rounded-lg border border-purple-200">
                <span className="material-symbols-outlined block text-lg text-purple-700">bedtime</span>
                <span className="font-bold block mt-1">As Needed</span>
                <span className="text-[11px] block text-purple-800">Paracetamol (fever)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4" dir="rtl">
          {isEditing ? (
            <textarea
              rows={5}
              value={urduText}
              onChange={(e) => setUrduText(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3.5 text-body-lg text-on-surface leading-loose focus:outline-none focus:border-secondary font-sans"
            />
          ) : (
            <div className="p-4 bg-surface-container-low/60 rounded-xl border border-outline-variant/20 text-body-lg text-on-surface leading-loose font-sans">
              {urduText}
            </div>
          )}

          {/* Urdu Schedule Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-sans">
            <div className="p-2.5 bg-sky-50 text-sky-900 rounded-lg border border-sky-200">
              <span className="font-bold block text-sm">صبح (ناشتہ)</span>
              <span className="text-[11px] block mt-1">اومیپرازول + ایموکسیسیلین</span>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
              <span className="font-bold block text-sm">دوپہر</span>
              <span className="text-[11px] block mt-1">ایموکسیسیلین</span>
            </div>
            <div className="p-2.5 bg-orange-50 text-orange-900 rounded-lg border border-orange-200">
              <span className="font-bold block text-sm">شام / رات</span>
              <span className="text-[11px] block mt-1">ایموکسیسیلین</span>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-900 rounded-lg border border-purple-200">
              <span className="font-bold block text-sm">ضرورت کے وقت</span>
              <span className="text-[11px] block mt-1">پیراسیٹامول (بخار)</span>
            </div>
          </div>
        </div>
      )}

      {/* Drug Interaction Safety Result */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3">
        <span className="material-symbols-outlined text-emerald-700 text-2xl">
          shield_with_check
        </span>
        <div className="text-body-sm text-emerald-900">
          <p className="font-bold">Drug Interaction Safety Check Passed</p>
          <p className="text-xs text-emerald-800">
            No severe interactions or contraindications found between Amoxicillin, Paracetamol, and Omeprazole.
          </p>
        </div>
      </div>
    </div>
  )
}
