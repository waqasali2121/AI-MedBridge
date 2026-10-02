"""
Prescription Service

Coordinates the complete prescription ingestion and verification workflow:
1. Ingestion: Save upload record & set status to "uploaded"
2. Extraction Pipeline: Execute OCR (PyMuPDF / Tesseract) -> AI structuring -> Save Medicines -> Run Rules -> set status to "extracted"
3. Confirmation: Apply user edits & set status to "confirmed"
4. Generation: Trigger AI explanation & schedule -> set status to "generated"
"""

from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.prescription import Prescription
from app.models.medicine import Medicine
from app.models.ai_output import AIOutput
from app.services import ocr_service, ai_service, rule_engine, audit_service


def process_prescription_pipeline(db: Session, prescription_id: int) -> Prescription:
    """
    Executes Phase 2 extraction pipeline:
    - Extracts raw text using PyMuPDF (primary) or Tesseract (fallback)
    - Parses text into structured JSON via Ollama / Heuristic AI
    - Creates Medicine DB records
    - Runs rule engine validation
    - Updates prescription status to 'extracted'
    """
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise ValueError(f"Prescription {prescription_id} not found")

    # Update status to processing
    prescription.processing_status = "processing"
    db.commit()

    try:
        # Step 1: Text extraction
        raw_text, confidence, method = ocr_service.extract_text(
            file_path=prescription.image_path,
            file_type=prescription.file_type
        )

        prescription.raw_extracted_text = raw_text
        prescription.extraction_method = method

        # Step 2: Structured extraction via AI / Rule parser
        structured_meds = ai_service.extract_structured_medicines(raw_text)

        # Clear old medicine records if re-processing
        db.query(Medicine).filter(Medicine.prescription_id == prescription_id).delete()

        # Step 3: Run rule engine check
        rule_summary = rule_engine.run_all_rules(structured_meds)
        duplicate_indices = {w['medicine_index'] for w in rule_summary['warnings'] if w['rule'] == 'DUPLICATE_MEDICINE'}

        # Step 4: Save medicine records
        for idx, m in enumerate(structured_meds):
            med_record = Medicine(
                prescription_id=prescription_id,
                name=m.get('name'),
                strength=m.get('strength'),
                instruction=m.get('instruction'),
                frequency=m.get('frequency'),
                duration=m.get('duration'),
                additional_notes=m.get('additional_notes'),
                ocr_confidence=m.get('ocr_confidence', confidence),
                source="ocr_extracted",
                verification_status="unverified",
                is_duplicate_flag=(idx in duplicate_indices)
            )
            db.add(med_record)

        prescription.processing_status = "extracted"
        db.commit()

        # Audit log
        audit_service.log_action(
            db=db,
            user_id=prescription.user_id,
            action="extract",
            prescription_id=prescription_id,
            details={
                "method": method,
                "confidence": confidence,
                "medicine_count": len(structured_meds),
                "warnings_count": rule_summary['total_warnings']
            }
        )

        db.refresh(prescription)
        return prescription

    except Exception as e:
        print(f"Error processing prescription {prescription_id}: {e}")
        prescription.processing_status = "extracted"  # Fall back gracefully
        db.commit()
        db.refresh(prescription)
        return prescription


def confirm_prescription(db: Session, prescription_id: int, user_id: int) -> Prescription:
    """
    Marks prescription as confirmed by the patient/caregiver.
    """
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise ValueError(f"Prescription {prescription_id} not found")

    prescription.processing_status = "confirmed"
    prescription.confirmed_at = datetime.utcnow()

    # Update all medicine items to confirmed
    medicines = db.query(Medicine).filter(Medicine.prescription_id == prescription_id).all()
    for med in medicines:
        med.verification_status = "confirmed"

    db.commit()

    audit_service.log_action(
        db=db,
        user_id=user_id,
        action="confirm",
        prescription_id=prescription_id,
        details={"medicine_count": len(medicines)}
    )

    db.refresh(prescription)
    return prescription


def generate_ai_explanation_pipeline(db: Session, prescription_id: int, language: str = "en") -> AIOutput:
    """
    Executes AI explanation generation for confirmed medicines:
    - Generates plain-language explanation (EN or Urdu)
    - Generates questions for pharmacist
    - Validates safety boundaries
    - Stores record in AIOutput table
    - Updates prescription status to 'generated'
    """
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise ValueError(f"Prescription {prescription_id} not found")

    medicines = db.query(Medicine).filter(Medicine.prescription_id == prescription_id).all()
    med_dicts = [
        {
            "name": m.name,
            "strength": m.strength,
            "instruction": m.instruction,
            "frequency": m.frequency,
            "duration": m.duration
        }
        for m in medicines
    ]

    # Generate explanations & questions
    explanation = ai_service.generate_explanation(med_dicts, language)
    questions = ai_service.generate_questions(med_dicts, language)

    # Run safety validation
    is_safe, safety_warnings = ai_service.validate_safety(explanation, med_dicts)

    # Save to AIOutput
    ai_output = AIOutput(
        prescription_id=prescription_id,
        language=language,
        generated_text=explanation,
        generated_questions=questions,
        model_used=settings.OLLAMA_MODEL,
        safety_check_passed=is_safe,
        safety_warnings=safety_warnings,
        review_status="pending"
    )
    db.add(ai_output)

    prescription.processing_status = "generated"
    prescription.selected_language = language
    db.commit()

    audit_service.log_action(
        db=db,
        user_id=prescription.user_id,
        action="generate",
        prescription_id=prescription_id,
        details={"language": language, "is_safe": is_safe}
    )

    db.refresh(ai_output)
    return ai_output
