export interface User {
  id: number;
  email: string;
  name: string;
  role: 'patient' | 'caregiver' | 'pharmacist' | 'admin';
  language: 'en' | 'ur';
  is_active: boolean;
  created_at: string;
}

export interface Medicine {
  id: number;
  prescription_id: number;
  name: string | null;
  strength?: string | null;
  instruction?: string | null;
  frequency?: string | null;
  duration?: string | null;
  additional_notes?: string | null;
  ocr_confidence: number;
  source: 'ocr_extracted' | 'user_corrected' | 'user_confirmed';
  verification_status: 'unverified' | 'confirmed' | 'flagged';
  is_duplicate_flag: boolean;
  dosage_form?: string;
  dose?: string;
  quantity?: string;
  timing_instructions?: string;
  user_confirmed_at?: string;
}

export interface AIOutput {
  id: number;
  prescription_id: number;
  language: 'en' | 'ur';
  generated_text: string | null;
  generated_questions: string[] | null;
  model_used: string | null;
  safety_check_passed: boolean;
  safety_warnings: string[] | null;
  review_status: 'pending' | 'approved' | 'rejected';
  generation_time: number | null;
  created_at: string;
  drug_interaction_status?: 'clean' | 'warning' | 'severe';
  interaction_details?: string;
  urdu_text?: string;
  english_text?: string;
}

export interface Prescription {
  id: number;
  user_id: number;
  image_path: string | null;
  original_filename: string | null;
  file_type: string | null;
  extraction_method: string | null;
  processing_status: 'uploaded' | 'processing' | 'extracted' | 'confirmed' | 'generated' | 'reviewed';
  review_status: 'pending_review' | 'under_review' | 'approved' | 'correction_required';
  selected_language: 'en' | 'ur';
  upload_time: string;
  confirmed_at: string | null;
  created_at: string;
  medicine_count?: number;
  user?: User;
  medicines?: Medicine[];
  ai_outputs?: AIOutput[];
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  mrn?: string;
  rx_id?: string;
  prescriber?: string;
  prescriber_npi?: string;
  hospital_name?: string;
  urgency?: 'urgent' | 'routine' | 'stat' | 'pediatric';
  caregiver_name?: string;
  caregiver_relation?: string;
  vitals?: {
    bp?: string;
    hr?: number;
    weight?: string;
    allergies?: string[];
  };
}

export interface PharmacistReview {
  id: number;
  prescription_id: number;
  pharmacist_id: number;
  status: 'pending' | 'under_review' | 'approved' | 'correction_required';
  comments: string | null;
  correction_notes: string | null;
  review_started_at: string | null;
  review_completed_at: string | null;
  created_at: string;
}

export interface ReviewStats {
  pending: number;
  reviewed_today: number;
  needs_clarification: number;
  total_handovers: number;
}

export interface ShiftNote {
  id: number;
  severity: 'urgent' | 'protocol' | 'regulatory' | 'info';
  category: string;
  time: string;
  description: string;
  author: string;
  author_role: string;
}
