---
name: MedBridge Platform
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#49607c'
  primary: '#001428'
  on-primary: '#ffffff'
  primary-container: '#0f2942'
  on-primary-container: '#7991af'
  inverse-primary: '#b0c9e8'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#00132c'
  on-tertiary: '#ffffff'
  tertiary-container: '#07284c'
  on-tertiary-container: '#7690ba'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b0c9e8'
  on-primary-fixed: '#011d35'
  on-primary-fixed-variant: '#314863'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#d5e3ff'
  tertiary-fixed-dim: '#adc8f5'
  on-tertiary-fixed: '#001c3b'
  on-tertiary-fixed-variant: '#2d486d'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a clinical-grade, modern healthcare SaaS environment engineered for safety, precision, and cognitive calm. The product serves hospital pharmacists, clinical teams, patients, and multi-lingual caregivers navigating complex medication regimens during transitions of care.

### Brand Personality & Emotional Resonance
- **Clinical Rigor & Authority:** Emphasizes absolute clarity and data fidelity without feeling sterile or intimidating.
- **Cognitive Calm & Assurance:** Reduces high-stress medical anxiety during prescription handover via generous negative space, gentle transitions, and structured data hierarchy.
- **Inclusivity & Cultural Empathy:** Treats bilingual English and Urdu-script text with equal dignity, ensuring accessible line heights, vertical metrics, and bidirectional layout harmony.

### Design Movement: Modern Clinical Precision
The visual language blends clean corporate healthcare architecture with subtle tactile surfaces:
- **Low-glare matte planes:** Light slate backgrounds prevent visual exhaustion during extended shifts under fluorescent hospital lighting or dim night settings.
- **Restrained color attribution:** Colors represent actionable clinical states rather than decorative embellishments.
- **Architectural hierarchy:** High-density medical dashboards nest effortlessly within soft, border-defined cards.

## Colors

The palette is engineered around WCAG 2.1 AAA contrast targets for core medical legibility, ensuring life-critical medication information is unmistakable across varying display qualities and ambient lighting conditions.

### Core Swatches
- **Primary Navy (`#0F2942`):** Grounding foundation for top navigation, primary actions, dense typography headers, and persistent app scaffolding.
- **Secondary Medical Teal (`#0D9488`):** AI synthesis indicators, interactive state accents, focus rings, and positive progression actions.
- **Tertiary Slate Navy (`#1E3A5F`):** Subdued primary alternative for segmented controls, card headers, and selected table row backgrounds.
- **Neutral Slate (`#64748B`):** Structural borders, metadata labels, divider strokes, and auxiliary icons.

### Surface Architecture
- **Canvas Base:** `#F8FAFC` (Slate 50) provides an anti-glare clinical backdrop.
- **Surface Elevation (Cards/Sheets):** `#FFFFFF` (Pure White) with an explicit border of `#E2E8F0` (Slate 200).
- **Secondary Inset Surfaces:** `#F1F5F9` (Slate 100) for medication calculation strips, code snippets, and metadata callouts.

### Typography Ink
- **Body & Headlines:** `#0F172A` (Slate 900) for uncompromised readability on all white and slate-50 backgrounds.
- **Muted & Descriptive Text:** `#334155` (Slate 700) for secondary metrics, dosage explanations, and timestamps.
- **Disabled / Placeholder:** `#94A3B8` (Slate 400).

### Semantic & Clinical Verification Palette
- **Success / User-Confirmed (`#16A34A`):** Patient-confirmed intake and verified reconciliation.
- **Warning / Needs Clarification (`#D97706`):** Dose discrepancy, missing frequency, or drug-drug interaction warning.
- **Critical / Error (`#DC2626`):** Allergy contraindications, fatal dosage limit exceedance, system failure.
- **AI-Extracted Informational (`#0284C7`):** Unverified OCR/audio ingest state awaiting human validation.
- **Pharmacist Reviewed (`#0D9488`):** Teal verification state representing certified clinical review.

## Typography

The type system prioritizes micro-legibility and bilingual vertical metric safety. 

### Font Selection
- **Headlines:** `Plus Jakarta Sans` provides geometric balance and subtle warmth to section titles, patient demographics, and modal banners without appearing overly whimsical.
- **Body & Data:** `Inter` handles dense tabular values, clinical instructions, warnings, and complex numerical dosages (`500 mg`, `0.125 mcg`) with optical precision and tabular figures enabled (`tnum`, `cv05`, `cv08`).
- **Urdu / Nastaliq Fallback:** When rendering Nastaliq or Arabic-script localized instructions (e.g., patient translation sheets), the typography stack maps to native platform fonts with dynamic line-height expansion (1.7x to 2.0x base values) to avoid ascender/descender clipping on multi-tier diacritics.

### Rules of Usage
- **Tabular Figures:** Always use `font-feature-settings: 'tnum'` for dosage tables, schedules, quantities, and chronological timestamps.
- **Strict Weight Budgets:** Limit weights to 400 (Regular), 500 (Medium), 600 (Semibold), and 700 (Bold). Avoid thin or hairline cuts under any circumstance.
- **Sentence Case Primacy:** Drug names, medical instructions, and action prompts strictly follow sentence case (e.g., "Add new medication", not "Add New Medication") to expedite clinical scanning.

## Layout & Spacing

The design system operates on an 8-point spatial rhythm with a secondary 4-point micro-grid for compact metadata badges and form fields.

### Grid Framework
- **Desktop (1280px+):** 12-column layout with 24px (`1.5rem`) gutters and variable margins up to a max-width container of 1440px. Left-hand global navigation persists at a fixed 280px width.
- **Tablet (768px – 1279px):** 8-column layout with 16px (`1rem`) gutters and 24px canvas margins. Sidebars collapse to responsive overlay drawers or icon rails.
- **Mobile (< 768px):** 4-column fluid layout with 16px margins and 12px gutters. All critical medication reviews stack sequentially to avoid truncated text.

### Spacing Philosophy
- **Component Padding:** Standard cards utilize `space-lg` (24px) for desktop and `space-md` (16px) on mobile viewports. Dense tabular rows use `space-sm` (8px) vertical padding paired with `space-md` (16px) horizontal gutters.
- **Visual Grouping:** Elements with direct relationships (e.g., dosage label to dosage value) share `space-xs` (4px). Unrelated clinical sections enforce a minimum separation of `space-xl` (32px).

## Elevation & Depth

The design system eschews floating, skeuomorphic, or deep theatrical drops in favor of low-contrast, clinical outlines and soft ambient shading that maintains spatial discipline.

### Elevation Hierarchy
- **Level 0 (Flat / Canvas):** Applied to the base canvas (`#F8FAFC`). No borders, zero shadow.
- **Level 1 (Card & Content Blocks):** Applied to resting medication cards, verification lists, and panel modules. Composed of a solid `1px` border in `#E2E8F0` and an ultra-subtle ambient shadow: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Active / Hover / Dropdown):** Applied to hovered list rows, popovers, select dropdown menus, and active drag targets. Formed by a `1px` border in `#CBD5E1` and an elevated drop: `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals / Critical Overlays):** Applied to medication interaction modals, dosage override confirmation dialogs, and slide-in drawer sheets. Formed by `box-shadow: 0 20px 25px -5px rgba(15, 41, 66, 0.12), 0 8px 10px -6px rgba(15, 41, 66, 0.08)`. Accompanied by a 40% opacity navy backdrop veil (`rgba(15, 41, 66, 0.40)` with `backdrop-filter: blur(4px)`).

### Outline & Ghost Principles
Dividers and borders between clinical sections maintain a crisp 1px thickness using slate neutrals (`#E2E8F0` on pure white, `#CBD5E1` on slate-50). Elements never rely solely on shadow for visual boundary separation.

## Shapes

The design system implements a disciplined **Rounded (Level 2)** shape standard. Radii are calculated to soften complex clinical data while preserving structural order and clean scanning vectors.

### Corner Radii Tokens
- **Base (0.5rem / 8px):** Primary buttons, text input fields, status chips, dropdown items, alert callout banners, and nested item rows.
- **Large (`rounded-lg`, 1rem / 16px):** Primary content cards, patient overview modules, interaction panels, and verification summary widgets.
- **Extra Large (`rounded-xl`, 1.5rem / 24px):** Global modal windows, prescription preview sheets, and bottom-anchored mobile handover drawers.
- **Full Pill (`rounded-full`):** Exclusively reserved for circular avatar badges, quantitative pill-count tags, and verification status indicators. Form elements never use pill shapes.

## Components

### Buttons
- **Primary:** Background `#0F2942`, text `#FFFFFF`, rounded 8px. Hover shifts to `#1E3A5F`. Active state scales down subtly (0.99) with `#0B1F32`. Minimum touch height is 44px on mobile and 40px on desktop.
- **Secondary (Clinical Accent):** Background `#0D9488`, text `#FFFFFF`. Hover `#14B8A6`. Focus ring is a 2px offset ring of `#14B8A6`.
- **Outline / Ghost:** Transparent surface with a 1px `#CBD5E1` border and `#0F2942` text. Hover shifts to background `#F1F5F9`.
- **Destructive:** Background `#DC2626`, text `#FFFFFF`. Used strictly for irrevocable actions (e.g., "Discard Prescription", "Revoke Access").

### Clinical Verification Badges & Chips
Status badges communicate the machine-to-human review pipeline with high-contrast color pairs and standardized iconography:
- **State: Extracted (AI Ingest):** Background `#F0F9FF`, text `#0369A1`, border `#BAE6FD`. Displays an AI spark icon indicating optical extraction awaiting verification.
- **State: User-Confirmed:** Background `#F0FDF4`, text `#15803D`, border `#BBF7D0`. Displays a single checkmark icon indicating patient or caregiver confirmation.
- **State: Pharmacist Reviewed:** Background `#CCFBF1`, text `#0F766E`, border `#99F6E4`. Displays a verified shield icon marking professional clinical validation.
- **State: Needs Clarification:** Background `#FFFBEB`, text `#B45309`, border `#FDE68A`. Displays an alert-triangle icon flagging ambiguities, missing dosage, or contraindications.

### Input Fields & Controls
- **Inputs:** 1px `#CBD5E1` border, 8px radius, `#FFFFFF` background. Text is 14px `#0F172A`. Inactive placeholders use `#94A3B8`. Focus state applies a crisp `#0D9488` border with a 3px outer halo of `rgba(13, 148, 136, 0.15)`.
- **Checkboxes & Radios:** 20px x 20px accessible touch footprint (with a 44px invisible tap target). Checked state fills `#0F2942` with `#FFFFFF` glyph. Indeterminate states clearly delineated.
- **Error State:** Border shifts to `#DC2626` accompanied by an inline 12px descriptive error message with leading error iconography below the field.

### Cards & Panels
- **Medication Item Card:** White container with 1px `#E2E8F0` border and 16px border-radius. Features a left-side accent stripe indicating schedule timing (e.g., Morning, Afternoon, Evening) or clinical state. Incorporates dosage title, generic name subtitle, schedule pills, and a dedicated review-badge slot.
- **Bilingual Translation Card:** Split-pane or stacked comparative card displaying English instructions alongside Urdu translation. The Urdu container is furnished with right-to-left layout alignment (`dir="rtl"`), increased line height (`28px` for 14px font), and Nastaliq typeface support.

### Medication Schedule & Interaction Lists
- Rows feature alternating surface states or clean hairline dividers (`#E2E8F0`). High-risk interactions automatically tint the row header with `#FEF2F2` (Red 50) and a high-contrast `#DC2626` warning callout.