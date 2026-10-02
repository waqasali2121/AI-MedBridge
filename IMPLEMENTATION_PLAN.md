# MedBridge — Implementation Plan

## Final Technology Stack

| Layer | Technology | Why |
|---|---|---|
| Patient mobile app | React Native + Expo | Android/iOS from one codebase |
| Pharmacist dashboard | Next.js + TypeScript | Professional web application |
| UI styling | Tailwind CSS | Consistent design system |
| Backend | Python + FastAPI | Excellent for AI/document processing |
| Database | PostgreSQL | Powerful, free, open-source |
| ORM | SQLAlchemy | PostgreSQL integration |
| PDF extraction (primary) | PyMuPDF | Extract text directly from computerized PDFs |
| Image OCR (fallback) | Tesseract OCR | Free/open-source, for scanned documents only |
| AI runtime | Ollama | Run AI locally |
| AI model | Qwen/Gemma (or suitable open model) | No API cost |
| Validation | Python rule engine | Deterministic safety checks |
| Authentication | JWT + FastAPI | Free |
| File storage | Local filesystem initially | $0 |
| Notifications | Expo Notifications | Free for MVP/local notifications |
| Version control | Git + GitHub | Free |
| Containerization | Docker | Free |
| API testing | Postman/Insomnia | Free options |
| Development | VS Code | Free |
| Deployment initially | Local machine | $0 |

---

## Project Structure (Monorepo)

```
MedBridge/
├── apps/
│   ├── mobile/                    # React Native + Expo (Patient App)
│   │   ├── app/                   # Expo Router screens
│   │   │   ├── (auth)/
│   │   │   │   ├── login.tsx
│   │   │   │   └── register.tsx
│   │   │   ├── (tabs)/
│   │   │   │   ├── index.tsx              # Home
│   │   │   │   ├── medicines.tsx          # My Medicines
│   │   │   │   ├── upload.tsx             # Upload Prescription
│   │   │   │   ├── history.tsx            # Prescription History
│   │   │   │   ├── schedule.tsx           # Medicine Schedule
│   │   │   │   └── profile.tsx            # Profile
│   │   │   ├── prescription/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── review.tsx         # OCR Review & Edit
│   │   │   │   │   ├── confirm.tsx        # Confirmation Screen
│   │   │   │   │   ├── handover.tsx       # AI Handover View
│   │   │   │   │   ├── card.tsx           # Final Handover Card
│   │   │   │   │   └── status.tsx         # Pharmacist Review Status
│   │   │   │   └── language.tsx           # Language Selection
│   │   │   └── _layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                        # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── StatusIndicator.tsx
│   │   │   │   └── ConfidenceBar.tsx
│   │   │   ├── prescription/
│   │   │   │   ├── MedicineCard.tsx
│   │   │   │   ├── EditableField.tsx
│   │   │   │   ├── ConfidenceWarning.tsx
│   │   │   │   ├── HandoverCard.tsx
│   │   │   │   └── UploadArea.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       └── TabBar.tsx
│   │   ├── services/
│   │   │   ├── api.ts                     # API client (Axios)
│   │   │   ├── auth.ts                    # Auth service
│   │   │   └── notifications.ts           # Expo notifications
│   │   ├── store/
│   │   │   ├── authStore.ts               # Zustand auth state
│   │   │   ├── prescriptionStore.ts       # Prescription state
│   │   │   └── settingsStore.ts           # Language/preferences
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── usePrescription.ts
│   │   │   └── useLanguage.ts
│   │   ├── i18n/
│   │   │   ├── en.json                    # English translations
│   │   │   └── ur.json                    # Urdu translations
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   └── formatting.ts
│   │   ├── constants/
│   │   │   └── config.ts
│   │   ├── app.json
│   │   ├── tailwind.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── pharmacist-dashboard/      # Next.js + TypeScript (Pharmacist Web)
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx               # Dashboard home
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   ├── reviews/
│       │   │   │   ├── page.tsx           # Pending Reviews list
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx       # Single Prescription Review
│       │   │   ├── patients/
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx       # Patient Info
│       │   │   ├── history/
│       │   │   │   └── page.tsx           # Review History
│       │   │   └── profile/
│       │   │       └── page.tsx           # Pharmacist Profile
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   ├── Table.tsx
│       │   │   │   ├── Badge.tsx
│       │   │   │   ├── Modal.tsx
│       │   │   │   └── StatusPill.tsx
│       │   │   ├── dashboard/
│       │   │   │   ├── StatsBar.tsx
│       │   │   │   ├── PendingReviewsList.tsx
│       │   │   │   └── RecentActivity.tsx
│       │   │   ├── review/
│       │   │   │   ├── PrescriptionViewer.tsx
│       │   │   │   ├── MedicineTable.tsx
│       │   │   │   ├── AIExplanationPanel.tsx
│       │   │   │   ├── WarningsList.tsx
│       │   │   │   ├── ReviewActions.tsx
│       │   │   │   └── CommentBox.tsx
│       │   │   └── layout/
│       │   │       ├── Sidebar.tsx
│       │   │       ├── Header.tsx
│       │   │       └── Breadcrumb.tsx
│       │   ├── services/
│       │   │   ├── api.ts
│       │   │   └── auth.ts
│       │   ├── hooks/
│       │   │   ├── useReviews.ts
│       │   │   └── usePrescription.ts
│       │   └── types/
│       │       └── index.ts
│       ├── tailwind.config.ts
│       ├── next.config.js
│       ├── package.json
│       └── tsconfig.json
│
├── backend/                       # Python + FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                        # FastAPI entry point
│   │   ├── config.py                      # Settings & environment
│   │   ├── database.py                    # SQLAlchemy connection
│   │   │
│   │   ├── models/                        # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── prescription.py
│   │   │   ├── medicine.py
│   │   │   ├── ai_output.py
│   │   │   ├── pharmacist_review.py
│   │   │   └── audit_log.py
│   │   │
│   │   ├── schemas/                       # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── prescription.py
│   │   │   ├── medicine.py
│   │   │   ├── review.py
│   │   │   └── ai_output.py
│   │   │
│   │   ├── api/                           # Route handlers
│   │   │   ├── __init__.py
│   │   │   ├── router.py                  # Main API router
│   │   │   ├── auth.py                    # POST /auth/login, /auth/register
│   │   │   ├── prescriptions.py           # Prescription CRUD + workflow
│   │   │   ├── reviews.py                 # Pharmacist review endpoints
│   │   │   └── users.py                   # User management
│   │   │
│   │   ├── services/                      # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py            # JWT creation/validation
│   │   │   ├── prescription_service.py    # Upload, processing orchestration
│   │   │   ├── extraction_service.py      # PDF text extraction (PyMuPDF)
│   │   │   ├── ocr_service.py             # Tesseract fallback
│   │   │   ├── ai_service.py              # Ollama LLM integration
│   │   │   ├── rule_engine.py             # Validation rules
│   │   │   ├── review_service.py          # Pharmacist review logic
│   │   │   ├── handover_service.py        # Handover card generation
│   │   │   └── audit_service.py           # Audit logging
│   │   │
│   │   ├── core/                          # Cross-cutting concerns
│   │   │   ├── __init__.py
│   │   │   ├── security.py                # Password hashing, JWT
│   │   │   ├── dependencies.py            # FastAPI dependencies
│   │   │   └── exceptions.py              # Custom exceptions
│   │   │
│   │   └── prompts/                       # LLM prompt templates
│   │       ├── __init__.py
│   │       ├── extraction_prompt.py       # Structured extraction from text
│   │       ├── explanation_prompt.py      # Plain-language generation
│   │       ├── urdu_prompt.py             # Urdu translation
│   │       └── safety_prompt.py           # Safety validation prompt
│   │
│   ├── migrations/                        # Alembic migrations
│   │   ├── versions/
│   │   ├── env.py
│   │   └── alembic.ini
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_prescriptions.py
│   │   ├── test_extraction.py
│   │   ├── test_rule_engine.py
│   │   ├── test_ai_safety.py
│   │   └── conftest.py
│   │
│   ├── sample_data/                       # Synthetic demo prescriptions
│   │   ├── prescription_clear.pdf
│   │   ├── prescription_multiple.pdf
│   │   ├── prescription_ambiguous.pdf
│   │   └── prescription_duplicate.pdf
│   │
│   ├── uploads/                           # Local file storage
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml                     # PostgreSQL + Backend + Ollama
├── .gitignore
├── README.md
└── IMPLEMENTATION_PLAN.md
```

---

## Database Schema

### Tables & Relationships

```
┌─────────────────────┐
│       users          │
├─────────────────────┤
│ id            (PK)   │
│ email         (UQ)   │
│ password_hash        │
│ name                 │
│ role          (ENUM) │  ← PATIENT | CAREGIVER | PHARMACIST | ADMIN
│ language      (ENUM) │  ← EN | UR
│ is_active            │
│ created_at           │
│ updated_at           │
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────────┐
│     prescriptions       │
├─────────────────────────┤
│ id                 (PK) │
│ user_id            (FK) │ → users.id
│ image_path               │
│ original_filename        │
│ file_type                │  ← PDF | IMAGE
│ extraction_method        │  ← PYMUPDF | TESSERACT
│ raw_extracted_text       │
│ processing_status  (ENUM)│  ← UPLOADED | PROCESSING | EXTRACTED | CONFIRMED | GENERATED | REVIEWED
│ review_status      (ENUM)│  ← PENDING_REVIEW | UNDER_REVIEW | APPROVED | CORRECTION_REQUIRED
│ selected_language  (ENUM)│  ← EN | UR
│ upload_time              │
│ confirmed_at             │
│ created_at               │
│ updated_at               │
└──────────┬──────────────┘
           │
           │ 1:N
           ▼
┌──────────────────────────────┐
│         medicines            │
├──────────────────────────────┤
│ id                    (PK)   │
│ prescription_id       (FK)   │ → prescriptions.id
│ name                         │
│ strength                     │
│ instruction                  │
│ frequency                    │
│ duration                     │
│ additional_notes             │
│ ocr_confidence       (FLOAT)│  ← 0.0 to 1.0
│ source               (ENUM) │  ← OCR_EXTRACTED | USER_CORRECTED | USER_CONFIRMED
│ verification_status  (ENUM) │  ← UNVERIFIED | CONFIRMED | FLAGGED
│ is_duplicate_flag            │
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘

┌──────────────────────────────┐
│         ai_outputs           │
├──────────────────────────────┤
│ id                    (PK)   │
│ prescription_id       (FK)   │ → prescriptions.id
│ language              (ENUM) │  ← EN | UR
│ generated_text        (TEXT) │
│ generated_questions   (JSON) │  ← Questions for pharmacist
│ source_version               │  ← Which confirmed data version
│ model_used                   │  ← e.g. "qwen2:7b"
│ safety_check_passed   (BOOL)│
│ safety_warnings       (JSON) │
│ review_status         (ENUM) │  ← PENDING | APPROVED | REJECTED
│ generation_time       (FLOAT)│  ← seconds
│ created_at                   │
└──────────────────────────────┘

┌──────────────────────────────┐
│     pharmacist_reviews       │
├──────────────────────────────┤
│ id                    (PK)   │
│ prescription_id       (FK)   │ → prescriptions.id
│ pharmacist_id         (FK)   │ → users.id
│ status                (ENUM) │  ← PENDING | UNDER_REVIEW | APPROVED | CORRECTION_REQUIRED
│ comments              (TEXT) │
│ correction_notes      (TEXT) │
│ warnings_acknowledged (JSON) │
│ review_started_at            │
│ review_completed_at          │
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘

┌──────────────────────────────┐
│        audit_logs            │
├──────────────────────────────┤
│ id                    (PK)   │
│ user_id               (FK)   │ → users.id
│ prescription_id       (FK)   │ → prescriptions.id (nullable)
│ action                (ENUM) │  ← UPLOAD | EXTRACT | EDIT | CONFIRM | GENERATE | REVIEW_START
│                              │     APPROVE | REJECT | EXPORT | LOGIN | LOGOUT
│ details               (JSON) │  ← Additional context (no sensitive data)
│ ip_address                   │
│ timestamp                    │
└──────────────────────────────┘
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login, returns JWT
POST   /api/auth/refresh           # Refresh token
GET    /api/auth/me                # Current user profile
PUT    /api/auth/me                # Update profile
```

### Prescriptions (Patient)
```
POST   /api/prescriptions/upload                    # Upload prescription PDF/image
GET    /api/prescriptions                            # List user's prescriptions
GET    /api/prescriptions/{id}                       # Get prescription details
GET    /api/prescriptions/{id}/medicines             # Get extracted medicines
PUT    /api/prescriptions/{id}/medicines/{med_id}    # Edit a medicine field
POST   /api/prescriptions/{id}/confirm               # User confirms extracted data
PUT    /api/prescriptions/{id}/language               # Set language preference
POST   /api/prescriptions/{id}/generate              # Trigger AI explanation
GET    /api/prescriptions/{id}/handover              # Get handover card
GET    /api/prescriptions/{id}/status                # Get review status
GET    /api/prescriptions/{id}/export                # Export handover as PDF
```

### Pharmacist Reviews
```
GET    /api/reviews/pending                          # List pending reviews
GET    /api/reviews/{prescription_id}                # Get review details
POST   /api/reviews/{prescription_id}/start          # Start review
POST   /api/reviews/{prescription_id}/approve        # Approve handover
POST   /api/reviews/{prescription_id}/reject         # Request correction
POST   /api/reviews/{prescription_id}/comment        # Add review comment
GET    /api/reviews/history                           # Review history
GET    /api/reviews/stats                             # Review statistics
```

### Users (Admin — future)
```
GET    /api/users                                    # List users
PUT    /api/users/{id}/role                          # Change role
```

---

## Implementation Phases

### Phase 1: Foundation (Days 1–3)
**Goal**: Project setup, database, authentication

#### 1.1 Backend Setup
- [ ] Initialize FastAPI project with proper structure
- [ ] Configure SQLAlchemy + PostgreSQL connection
- [ ] Create all database models (User, Prescription, Medicine, AIOutput, PharmacistReview, AuditLog)
- [ ] Set up Alembic migrations
- [ ] Run initial migration to create all tables
- [ ] Create Pydantic schemas for request/response validation
- [ ] Implement JWT authentication (register, login, refresh, role-based guards)
- [ ] Set up CORS middleware for mobile app + web dashboard
- [ ] Create Docker Compose with PostgreSQL service
- [ ] Write `.env.example` with all config vars

#### 1.2 Mobile App Setup
- [ ] Initialize Expo project with TypeScript
- [ ] Configure Expo Router for file-based routing
- [ ] Set up NativeWind (Tailwind for React Native)
- [ ] Build auth screens (Login, Register)
- [ ] Implement JWT token storage (SecureStore)
- [ ] Create API client service (Axios with interceptors)
- [ ] Set up Zustand stores (auth, settings)
- [ ] Set up i18n with English + Urdu JSON files
- [ ] Build tab navigation shell (Home, Medicines, Upload, History, Profile)

#### 1.3 Pharmacist Dashboard Setup
- [ ] Initialize Next.js 14 project with App Router + TypeScript
- [ ] Configure Tailwind CSS
- [ ] Build login page
- [ ] Implement auth with JWT (httpOnly cookies or localStorage)
- [ ] Create dashboard layout (sidebar, header, breadcrumb)
- [ ] Build empty dashboard home page

---

### Phase 2: Prescription Upload & Extraction (Days 4–7)
**Goal**: Upload flow, PDF text extraction, OCR fallback

#### 2.1 Backend — Upload & Storage
- [ ] Create file upload endpoint with validation (PDF, JPG, PNG; max 10MB)
- [ ] Save uploaded files to local `uploads/` directory
- [ ] Create prescription record in database
- [ ] Return prescription ID + processing status

#### 2.2 Backend — PDF Text Extraction (Primary)
- [ ] Implement PyMuPDF service to extract text from computerized PDFs
- [ ] Detect if PDF contains extractable text or is image-based
- [ ] If text found → use PyMuPDF extracted text (primary path)
- [ ] If no text found → fall back to Tesseract OCR

```
Upload PDF
    ↓
PyMuPDF: attempt text extraction
    ↓
Text found? ──YES──→ Use extracted text
    │
    NO
    ↓
Tesseract OCR (image fallback)
    ↓
Use OCR text
```

#### 2.3 Backend — Structured Extraction via LLM
- [ ] Set up Ollama connection service
- [ ] Pull and configure Qwen/Gemma model
- [ ] Write extraction prompt: raw text → structured JSON
  - Medicine name, strength, instruction, frequency, duration, notes
- [ ] Parse LLM response into Medicine records
- [ ] Assign confidence scores (1.0 for PyMuPDF text, variable for OCR)
- [ ] Save extracted medicines to database
- [ ] Update prescription status to `EXTRACTED`
- [ ] Log extraction event to audit log

#### 2.4 Mobile — Upload Flow
- [ ] Build Upload screen with file picker (PDF) + camera option (image)
- [ ] Show upload progress indicator
- [ ] Handle file validation errors with clear messages
- [ ] Navigate to Review screen after successful upload
- [ ] Show processing state while backend extracts

#### 2.5 Mobile — Extraction Review Screen
- [ ] Display list of extracted medicines as editable cards
- [ ] Each card shows: name, strength, instruction, frequency, duration
- [ ] Highlight fields with low confidence (yellow/orange warning)
- [ ] Show confidence indicator bar per field
- [ ] Allow inline editing of any field
- [ ] Track field source: `OCR_EXTRACTED` vs `USER_CORRECTED`
- [ ] Show "uncertain" banner for low-confidence medicines
- [ ] User cannot proceed without reviewing flagged fields

---

### Phase 3: Confirmation & Rule Validation (Days 8–10)
**Goal**: User confirmation, rule engine, safety checks

#### 3.1 Backend — Rule Engine
- [ ] Build Python rule engine with these checks:
  - **Duplicate detection**: Flag medicines with similar names
  - **Incomplete fields**: Flag missing frequency, duration, or instruction
  - **Uncertain extraction**: Flag any medicine below confidence threshold
  - **Dosage format validation**: Check for recognizable dose patterns
- [ ] Return warnings list with severity (INFO, WARNING, CRITICAL)
- [ ] Rule engine does NOT make clinical decisions

#### 3.2 Backend — Confirmation Endpoint
- [ ] Accept user-confirmed medicine data
- [ ] Run rule validation on confirmed data
- [ ] Return any warnings/flags
- [ ] Update medicine verification_status to `CONFIRMED`
- [ ] Update prescription processing_status to `CONFIRMED`
- [ ] Log confirmation to audit

#### 3.3 Mobile — Confirmation Screen
- [ ] Show summary of all medicines after editing
- [ ] Display any rule engine warnings (duplicates, missing fields)
- [ ] Require explicit confirmation checkbox: "I have reviewed the extracted information"
- [ ] Show warning dismissal for each flag (user must acknowledge)
- [ ] Confirmation button disabled until all warnings addressed
- [ ] Language selection (English / اردو) before generation

---

### Phase 4: AI Explanation Generation (Days 11–14)
**Goal**: LLM-powered plain-language explanations in English & Urdu

#### 4.1 Backend — AI Service
- [ ] Write constrained generation prompt for English explanation:
  - Transform verified medicine data into simple language
  - Generate a medicine schedule from frequency/duration
  - Generate "questions to ask your pharmacist"
  - STRICT: No diagnosis, no dose changes, no treatment recommendations
  - STRICT: Do not invent missing information
  - STRICT: Mark uncertain items as "please confirm with pharmacist"
- [ ] Write Urdu translation/generation prompt
- [ ] Implement output safety validation:
  - Check for prohibited terms (diagnosis language, dose changes)
  - Check that output references only confirmed input data
  - Flag any generated content not grounded in source
- [ ] Save AI output to `ai_outputs` table
- [ ] Generate safety warnings if any checks fail
- [ ] Update prescription status to `GENERATED`
- [ ] Log generation event

#### 4.2 Backend — Handover Card Builder
- [ ] Build handover card data structure:
  ```json
  {
    "patient_name": "...",
    "medicines": [
      {
        "name": "...",
        "verified_instruction": "...",
        "schedule": "...",
        "duration": "...",
        "important_notes": "..."
      }
    ],
    "questions_for_pharmacist": ["..."],
    "language": "EN",
    "review_status": "PENDING_REVIEW",
    "generated_at": "...",
    "disclaimer": "This is AI-generated. Please verify with your pharmacist."
  }
  ```

#### 4.3 Mobile — AI Handover Screen
- [ ] Display medicine information in clear cards
- [ ] Show simple-language explanation (English or Urdu)
- [ ] Show medicine schedule in a visual timeline
- [ ] Display "Questions for your pharmacist" section
- [ ] Show any warnings/uncertainty clearly
- [ ] Clear visual separation between:
  - Prescription Information (blue)
  - AI Explanation (green)
  - Pharmacist Review Status (orange/grey)
- [ ] Show review status badge: "Pending Pharmacist Review"
- [ ] Language toggle (English ↔ Urdu)

---

### Phase 5: Pharmacist Review Workflow (Days 15–18)
**Goal**: Complete pharmacist review dashboard and approval flow

#### 5.1 Backend — Review Endpoints
- [ ] List pending reviews (sorted by upload time)
- [ ] Get full review details (prescription + medicines + AI output + warnings)
- [ ] Start review (locks to pharmacist, updates status)
- [ ] Approve review (marks handover as approved)
- [ ] Reject / request correction (with comments)
- [ ] Add review comments

#### 5.2 Pharmacist Dashboard — Pending Reviews
- [ ] Dashboard home with stats: pending, reviewed today, correction requested
- [ ] Pending reviews table: patient name, medicines count, upload date, urgency
- [ ] Click to open full review

#### 5.3 Pharmacist Dashboard — Review Screen
- [ ] Left panel: Original extracted data + user-confirmed data
- [ ] Center panel: AI-generated explanation (highlighted as AI content)
- [ ] Right panel: Warnings, flags, confidence scores
- [ ] Bottom: Review actions
  - ✅ Approve — marks handover as pharmacist-reviewed
  - ⚠️ Request Correction — sends back with notes
  - 💬 Add Comment — free-text feedback
- [ ] Review status workflow:
  ```
  PENDING_REVIEW → UNDER_REVIEW → APPROVED
                                → CORRECTION_REQUIRED → (patient corrects) → PENDING_REVIEW
  ```

#### 5.4 Mobile — Review Status Updates
- [ ] Show current review status on prescription detail
- [ ] If CORRECTION_REQUIRED: show pharmacist comments, allow re-edit
- [ ] If APPROVED: show approved badge on handover card
- [ ] Push notification when review status changes (Expo Notifications)

---

### Phase 6: Final Handover Card & Export (Days 19–21)
**Goal**: Complete handover card with export/share

#### 6.1 Mobile — Final Handover Card Screen
- [ ] Beautiful medicine handover card with:
  - Patient identifier
  - Each medicine: name, instruction, schedule, duration
  - Important notes
  - Questions for pharmacist
  - Review status badge (prominent)
  - Language indicator
  - Generation date
  - Disclaimer text
- [ ] Clear status indicator:
  - 🔴 Not Reviewed
  - 🟡 Pending Pharmacist Review
  - 🟢 Pharmacist Reviewed & Approved
- [ ] Share button (native share sheet)
- [ ] Export as image/screenshot

#### 6.2 Mobile — Medicine Schedule View
- [ ] Visual daily schedule (morning, afternoon, evening, night)
- [ ] Each time slot shows which medicines to take
- [ ] Based only on verified frequency data
- [ ] Does not invent schedules for missing frequency info

#### 6.3 Mobile — Prescription History
- [ ] List of all uploaded prescriptions
- [ ] Each shows: date, medicine count, review status
- [ ] Tap to view handover card

---

### Phase 7: Integration & Safety Testing (Days 22–25)
**Goal**: End-to-end testing, safety validation, demo data

#### 7.1 End-to-End Integration
- [ ] Test complete workflow: upload → extract → edit → confirm → generate → review → card
- [ ] Test with all 10 synthetic scenarios from PRD:
  1. Clear prescription with one medicine
  2. Clear prescription with two medicines
  3. Multiple medicines
  4. Handwritten medicine (image upload → Tesseract)
  5. Ambiguous medicine name
  6. Missing frequency
  7. Missing duration
  8. Duplicate medicine entry
  9. Urdu language request
  10. Unsafe/unsupported AI request

#### 7.2 AI Safety Testing
- [ ] Test AI-SR-001: Model does not invent missing fields → verify blank stays blank
- [ ] Test AI-SR-002: Model does not change dosage → verify output matches input
- [ ] Test AI-SR-003: Model does not recommend medicine → verify no recommendations
- [ ] Test AI-SR-004: Model does not diagnose → verify no diagnosis language
- [ ] Test AI-SR-005: Model does not say "stop medication" → verify
- [ ] Test AI-SR-006: Model does not claim safe/unsafe → verify
- [ ] Test AI-SR-007: Model flags uncertainty → verify flagging works

#### 7.3 Create Demo Data
- [ ] Create 4 synthetic prescription PDFs (computerized)
- [ ] Create 1 scanned/image prescription (for OCR fallback demo)
- [ ] Pre-populate database with demo patient + pharmacist accounts
- [ ] Prepare demo script matching PRD Section 40

---

### Phase 8: Polish & Deployment (Days 26–28)
**Goal**: UI polish, error handling, local deployment

#### 8.1 Error Handling
- [ ] E-001: Invalid file → "Please upload a supported prescription image"
- [ ] E-002: OCR failure → "Could not read. Please review or enter manually"
- [ ] E-003: Uncertain name → "Confirm with pharmacist" warning
- [ ] E-004: Missing info → No invention, show blank
- [ ] E-005: AI failure → "Explanation unavailable. Confirmed data unchanged"
- [ ] E-006: Pharmacist rejection → "CORRECTION REQUIRED" status

#### 8.2 UI Polish
- [ ] Consistent design system across mobile + web
- [ ] Large readable text, clear buttons (NFR-001, NFR-002)
- [ ] Urdu RTL support for Urdu language mode
- [ ] Loading states for all async operations
- [ ] Empty states for lists

#### 8.3 Docker Deployment
- [ ] Final docker-compose.yml:
  ```yaml
  services:
    db:         # PostgreSQL
    backend:    # FastAPI
    ollama:     # AI runtime
    dashboard:  # Next.js (optional, can run separately)
  ```
- [ ] Environment variable configuration
- [ ] Database seeding script with demo data
- [ ] Startup script that pulls Ollama model

---

## Critical Design Decisions

### 1. PDF Extraction Strategy
```
Computerized PDF (primary path — your case)
       ↓
   PyMuPDF (fitz)
       ↓
   Extract text directly
       ↓
   Confidence: HIGH (1.0)

Scanned/Image PDF (fallback)
       ↓
   Tesseract OCR
       ↓
   Extract text from image
       ↓
   Confidence: VARIABLE (0.0–0.9)
```
PyMuPDF is tried first. Only if it returns no text does Tesseract run.

### 2. AI Pipeline (Safety-First)
```
Verified Medicine Data
       ↓
   Constrained Prompt (no diagnosis/dose/treatment)
       ↓
   Ollama (Qwen/Gemma)
       ↓
   Output Safety Validator
       ↓
   Check: grounded in source? No prohibited content?
       ↓
   Pass → Save AI Output
   Fail → Flag for pharmacist, show warning
```
The LLM is never the first or final authority.

### 3. Status Verification Model
```
OCR EXTRACTED → USER CONFIRMED → AI GENERATED → PHARMACIST REVIEWED → APPROVED
```
Every piece of content is traceable to its source and verification state.

### 4. Safety Boundaries (Hardcoded)
These are enforced at prompt level AND validated in post-processing:
- ❌ No diagnosis
- ❌ No dose changes
- ❌ No treatment recommendations
- ❌ No invented information
- ❌ No "safe/unsafe" claims
- ✅ Explain verified information only
- ✅ Flag uncertainty for human review
- ✅ Pharmacist has final authority

---

## Team Task Assignment (5 People)

| Member | Role | Responsibilities | Phases |
|--------|------|-------------------|--------|
| Member 1 | Product/Domain Lead | Requirements, user journey, safety rules, demo script, pitch | All phases oversight |
| Member 2 | Frontend (Mobile) | React Native app, all patient screens, upload flow, handover card | 1.2, 2.4, 2.5, 3.3, 4.3, 5.4, 6.1–6.3 |
| Member 3 | Backend Developer | FastAPI, database, auth, APIs, prescription workflow | 1.1, 2.1, 2.2, 3.1, 3.2, 5.1 |
| Member 4 | AI/OCR Engineer | PyMuPDF, Tesseract, Ollama, prompts, AI safety | 2.2, 2.3, 4.1, 4.2, 7.2 |
| Member 5 | Frontend (Web) + QA | Pharmacist dashboard, integration testing, demo data | 1.3, 5.2, 5.3, 7.1, 7.3, 8.1 |

---

## UI Design System (From Uploaded Designs)

Your uploaded designs establish a complete, production-ready design system. All 4 design assets have been reviewed and integrated below.

### Design Assets Inventory

| # | Design Asset | File | Screen | Purpose |
|---|---|---|---|---|
| 1 | **MedBridge Logo** | `medbridge_logo/` | SVG Logo | Brand identity — navy-to-teal gradient mark with bridge arch + healthcare cross |
| 2 | **Pharmacist Dashboard Home** | `pharmacist_dashboard_home/` | Dashboard | Main pharmacist workspace with KPI cards, review queue, bilingual preview, AI status |
| 3 | **Prescription Review & Verification** | `pharmacist_prescription_review_verification/` | Split-pane Review | Side-by-side e-prescription viewer + clinical verification form + bilingual AI explanation |
| 4 | **Medicine Handover Cards** | `medicine_handover_plan_dual_language_cards/` | Handover Output | Final patient-facing medication cards with daily schedule visualizer + bilingual instructions |

### Brand Identity

**Logo**: Navy-to-teal gradient icon (bridge arch + healthcare cross) with "Med" in navy `#0F2942` and "Bridge" in teal `#0D9488`. Tagline: "MEDICATION HANDOVER" in uppercase slate `#64748B`.

**Typefaces**:
- **Headlines**: `Plus Jakarta Sans` (600–700 weight) — geometric warmth for section titles
- **Body & Data**: `Inter` (400–600 weight) — optical precision for clinical data, dosages, tables
- **Urdu**: Native platform Nastaliq fallback with dynamic line-height expansion (1.7x–2.0x)

### Color System (Material 3–Based Tokens)

#### Core Palette
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#001428` | Top nav, primary actions, headlines |
| `primary-container` | `#0F2942` | Active sidebar items, selected states |
| `secondary` | `#006A61` | Teal accent — CTA buttons, verification badges, AI indicators |
| `secondary-container` | `#86F2E4` | Light teal surfaces for success states |
| `error` | `#BA1A1A` | Critical warnings, urgent discharge badges |
| `error-container` | `#FFDAD6` | Light error backgrounds |

#### Surface Architecture
| Token | Hex | Usage |
|---|---|---|
| `surface` | `#F8F9FF` | Page background (anti-glare clinical) |
| `surface-container-lowest` | `#FFFFFF` | Cards, panels, modals |
| `surface-container-low` | `#EFF4FF` | Inset surfaces, input backgrounds |
| `surface-container` | `#E5EEFF` | Secondary containers, filter bars |
| `surface-container-high` | `#DCE9FF` | Hover states, active selections |
| `surface-container-highest` | `#D3E4FE` | MRN tags, metadata badges |

#### Typography Ink
| Token | Hex | Usage |
|---|---|---|
| `on-surface` | `#0B1C30` | Primary text — body, headlines |
| `on-surface-variant` | `#43474D` | Secondary text — descriptions, timestamps |
| `outline` | `#74777E` | Borders, dividers |
| `outline-variant` | `#C3C6CE` | Subtle dividers, inactive states |

#### Clinical Verification Badges
| State | Background | Text | Border | Icon |
|---|---|---|---|---|
| AI Extracted | `#F0F9FF` | `#0369A1` | `#BAE6FD` | AI spark |
| User Confirmed | `#F0FDF4` | `#15803D` | `#BBF7D0` | Single check |
| Pharmacist Verified | `#CCFBF1` | `#0F766E` | `#99F6E4` | Shield verified |
| Needs Clarification | `#FFFBEB` | `#B45309` | `#FDE68A` | Alert triangle |

### Typography Scale

| Token | Font | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| `headline-xl` | Plus Jakarta Sans | 36px | 700 | 44px | Page titles |
| `headline-lg` | Plus Jakarta Sans | 30px | 600 | 38px | Section headers |
| `headline-md` | Plus Jakarta Sans | 22px | 600 | 28px | Card titles |
| `headline-sm` | Plus Jakarta Sans | 18px | 600 | 24px | Sub-sections |
| `body-lg` | Inter | 16px | 400 | 26px | Main body text |
| `body-md` | Inter | 14px | 400 | 22px | Default body |
| `body-sm` | Inter | 12px | 400 | 18px | Metadata, notes |
| `label-lg` | Inter | 14px | 600 | 20px | Button text, nav items |
| `label-md` | Inter | 12px | 500 | 16px | Badges, chips |
| `label-sm` | Inter | 10px | 600 | 14px | Tiny labels, categories |

### Spacing System (8pt Grid)

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px (0.25rem) | Tight gaps, badge padding |
| `space-sm` | 8px (0.5rem) | Compact spacing, input padding |
| `space-md` | 16px (1rem) | Standard component padding |
| `space-lg` | 24px (1.5rem) | Card padding, section gaps |
| `space-xl` | 32px (2rem) | Major section separation |
| `gutter` | 24px (1.5rem) | Page horizontal padding |
| `margin-lg` | 48px (3rem) | Large vertical margins |

### Border Radius Tokens

| Token | Value | Usage |
|---|---|---|
| Default | 4px (0.25rem) | Small badges, inputs |
| `lg` | 8px (0.5rem) | Buttons, nav items, tags |
| `xl` | 12px (0.75rem) | Cards, panels, modals |
| `full` | 9999px | Avatars, pill badges, status dots |

### Elevation System

| Level | Usage | Border | Shadow |
|---|---|---|---|
| Level 0 | Canvas background | None | None |
| Level 1 | Cards, panels | 1px `#E2E8F0` | `0 1px 3px rgba(15,23,42,0.04)` |
| Level 2 | Hover, dropdowns | 1px `#CBD5E1` | `0 4px 6px -1px rgba(15,23,42,0.06)` |
| Level 3 | Modals, critical overlays | — | `0 20px 25px -5px rgba(15,41,66,0.12)` + backdrop blur |

### Icon System

Uses **Material Symbols Outlined** from Google Fonts. Key icons from the designs:

| Context | Icon Name | Usage |
|---|---|---|
| Dashboard | `dashboard` | Sidebar nav |
| Pending Reviews | `assignment_late` | Sidebar with badge count |
| Verified | `verified_user` | Reviewed nav item |
| Patients | `personal_injury` | Patient list |
| Prescriptions | `prescriptions` | Prescription list |
| Medication | `medication` | Medicine info |
| Search | `search` | Global search bar |
| Notifications | `notifications` | Header bell with dot |
| Document Scanner | `document_scanner` | E-prescription viewer |
| Pill | `pill` | Medicine verification |
| Translate | `translate` | Language switcher |
| Warning | `warning` | Safety critical notices |
| Check Circle | `check_circle` | Confirmed states |
| Shield | `shield` | Pharmacist verified footer |
| AI/Smart | `smart_toy` | AI-generated content disclaimer |
| Gavel | `gavel` | Legal/clinical safety banner |
| Schedule | `schedule` | Daily timeline |
| Sunny / Bedtime | `wb_sunny` / `bedtime` | Morning / Night time slots |

---

### Screen-by-Screen Implementation Guide

#### Screen A: Pharmacist Dashboard Home
**File**: `pharmacist_dashboard_home/code.html`

**Layout**: Fixed 288px sidebar + top header bar + main content area (max 1440px)

**Components to Build**:
1. **Sidebar** (fixed left, `w-72`)
   - Logo + "MedBridge Clinical Portal" branding
   - Nav items with Material icons, active state uses `bg-primary-container text-on-primary`
   - "Pending Reviews" has teal badge count `(12)`
   - Bottom: HIPAA compliance card with lock icon
2. **Header Bar** (fixed top, `h-16`, backdrop blur)
   - Search input with icon
   - Hospital/facility selector dropdown
   - AI Safety Protocols active indicator (green pulse dot)
   - Notification bell with red dot
   - Profile avatar + name + role
3. **KPI Cards Grid** (4 columns on XL, 2 on SM)
   - Pending Reviews (red "Queue Alert" badge with animated ping)
   - Reviewed Today (teal "On Target" badge)
   - Needs Clarification (neutral badge)
   - Handover Cards Created (teal "Bilingual Ready" badge)
4. **Clinical Safety Banner**
   - Gavel icon + "AI Co-Pilot Mode" chip
   - Safety disclaimer text (MedBridge does NOT diagnose/prescribe)
   - "View SOP Standards" link
5. **Prescription Review Queue** (2/3 width)
   - Tab filters: All / Urgent Discharge / Outpatient / Pediatric
   - Queue items as cards with patient info, MRN, Rx ID, medicine list
   - Priority badges (Discharge Urgent = red, Clarification = neutral)
   - "Review & Verify" teal CTA buttons
   - Bilingual language badges per patient
6. **Right Sidebar** (1/3 width)
   - AI Engine Status card with circular progress (99.4% OCR fidelity)
   - Progress bars for bilingual accuracy + API latency
   - Shift Notes & Flags (shortage alerts, discharge protocols)
   - Hospital intercom card

#### Screen B: Prescription Review & Verification
**File**: `pharmacist_prescription_review_verification/code.html`

**Layout**: 12-column grid, 6+6 split on large screens

**Components to Build**:
1. **Breadcrumb + Patient Dossier Header**
   - Breadcrumb: Prescriptions > Review Queue > RX-90823 Farhan Ahmed
   - Language mode switcher (English & Urdu)
   - "Needs Clinical Verification" amber badge with pulse
   - Patient vitals strip: name, age, weight, allergies, prescriber, department
2. **Left Column (6 cols): E-Prescription Document Viewer**
   - Viewer control bar (zoom in/out/fit, HL7-FHIR badge)
   - OCR extraction confidence overlay (99.2%)
   - Simulated hospital prescription document:
     - Hospital masthead
     - Patient & Rx metadata (2-column grid)
     - Prescribed medications with numbered items + teal accent stripe on active item
     - Prescriber e-signature + digital hash
3. **Right Column (6 cols): Clinical Verification**
   - Medicine tab switcher (1. Amoxicillin / 2. Paracetamol / 3. Omeprazole)
   - Verification form with editable fields:
     - Medicine name (with check icon), strength, dosage form, dose
     - Frequency, duration, total quantity, timing instructions
   - "Pharmacist Match Confirmation" toggle checkbox
   - "User Confirmed on App" badge with timestamp
4. **AI-Generated Explanation Panel**
   - "AI-Drafted Handover Explanation" disclaimer banner
   - Bilingual tab switcher (English / Urdu)
   - English: patient-friendly text + schedule + meal instructions
   - Urdu: RTL layout with elevated line-height (`line-height: 2.2rem`)
   - Drug interaction check result
5. **Sticky Bottom Action Bar**
   - Legal responsibility notice with gavel icon
   - Buttons: Save Progress | Flag Note (red) | Request Prescriber Clarification (amber) | **Approve & Generate Handover Card** (teal primary CTA)

#### Screen C: Medicine Handover Cards (Bilingual)
**File**: `medicine_handover_plan_dual_language_cards/code.html`

**Layout**: Full-width with 3-column card grid on large screens

**Components to Build**:
1. **Command Bar**
   - "Verified Handover Suite" badge
   - Patient metadata pills (name, MRN, Rx ID, pharmacist verified)
   - Language mode switcher (Dual EN+UR / English Only / Urdu Only)
   - Action buttons: Print Cards | Send to App | Export PDF | Share
2. **Regimen Overview Card** (8/12 cols)
   - Discharge summary: 3 medicines, 5-day course
   - 3 highlight pillars: Meal Alignment / Regimen Duration / Interaction Clear
   - Critical safety warning (red): "Do not alter doses, pause antibiotics..."
3. **Pharmacy Contact Card** (4/12 cols, dark navy background)
   - Pharmacy helpline number
   - "Call Now" CTA button
   - Pharmacist name + extension
4. **Three Medication Cards** (1 per medicine)
   - Color-coded headers: Teal (Amoxicillin) / Navy (Paracetamol) / Dark Blue (Omeprazole)
   - Quick matrix: Dose, Duration, Frequency
   - Food relation alert
   - **Bilingual instruction blocks**:
     - English pane (light grey background)
     - Urdu pane (light teal background, RTL, `dir="rtl"`)
   - Footer: "Pharmacist Verified • Reid, PharmD" with shield icon
5. **Daily Schedule Visualizer**
   - 3-column timeline: Morning (8 AM) / Afternoon (2 PM) / Evening (8 PM)
   - Sun/Moon icons for time-of-day
   - Each slot lists medicines with step order + bilingual Urdu subtitles
   - Legend: Mandatory Core (teal) vs As Needed/PRN (navy)
6. **Export Settings Bar**
   - Layout selector dropdown (Pocket Print / A4 Sheet / Large Print / Fridge Magnet)
   - Print + Copy Link buttons
   - Toast notification system

### Tailwind Configuration (Pharmacist Dashboard)

The designs use a custom Tailwind config that must be replicated in `tailwind.config.ts`:

```typescript
// apps/pharmacist-dashboard/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#001428',
        'on-primary': '#ffffff',
        'primary-container': '#0f2942',
        'on-primary-container': '#7991af',
        'secondary': '#006a61',
        'on-secondary': '#ffffff',
        'secondary-container': '#86f2e4',
        'on-secondary-container': '#006f66',
        'secondary-fixed': '#89f5e7',
        'on-secondary-fixed': '#00201d',
        'tertiary': '#00132c',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#07284c',
        'on-tertiary-container': '#7690ba',
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'surface': '#f8f9ff',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#43474d',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'outline': '#74777e',
        'outline-variant': '#c3c6ce',
        'inverse-surface': '#213145',
        'inverse-on-surface': '#eaf1ff',
        'inverse-primary': '#b0c9e8',
      },
      fontFamily: {
        'heading': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'headline-lg': ['30px', { lineHeight: '38px', fontWeight: '600' }],
        'headline-md': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-sm': ['10px', { lineHeight: '14px', fontWeight: '600' }],
      },
      spacing: {
        'gutter': '1.5rem',
        'gutter-sm': '1rem',
        'gutter-lg': '2rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'margin-lg': '3rem',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
```

### Urdu/RTL Implementation Rules

From the designs, Urdu rendering follows these rules:
1. Urdu containers use `dir="rtl"` attribute
2. Line-height for Urdu body text: `1.7x–2.0x` (designs use `leading-loose` or inline `line-height: 2.2rem`)
3. Urdu panes have a distinct teal-tinted background (`bg-secondary-fixed/20`)
4. Labels mix Urdu + English: `"اردو ہدایات (Urdu)"`
5. Bilingual cards show English and Urdu side-by-side (desktop) or stacked (mobile)
6. Language switcher has 3 modes: Dual (EN + اردو) / English Only / Urdu Only

---

## Quick Start Commands

```bash
# 1. Clone and setup
git init MedBridge && cd MedBridge

# 2. Start infrastructure
docker-compose up -d db ollama

# 3. Pull AI model
docker exec ollama ollama pull qwen2:7b

# 4. Backend
cd backend
python -m venv venv && source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# 5. Mobile app
cd apps/mobile
npm install
npx expo start

# 6. Pharmacist dashboard
cd apps/pharmacist-dashboard
npm install
npm run dev
```
