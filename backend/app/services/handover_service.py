"""
Handover Service

Generates structured patient handover cards and daily administration schedules
in English and Urdu, formatted according to the MedBridge design specifications.
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.prescription import Prescription
from app.models.medicine import Medicine
from app.models.ai_output import AIOutput
from app.models.pharmacist_review import PharmacistReview
from app.services import ai_service


def generate_handover_card(db: Session, prescription_id: int, language: str = "en") -> Dict[str, Any]:
    """
    Builds a complete, formatted patient handover card object for a prescription.
    """
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise ValueError(f"Prescription {prescription_id} not found")

    medicines = db.query(Medicine).filter(Medicine.prescription_id == prescription_id).all()
    ai_output = db.query(AIOutput).filter(
        AIOutput.prescription_id == prescription_id,
        AIOutput.language == language
    ).first()
    latest_review = db.query(PharmacistReview).filter(
        PharmacistReview.prescription_id == prescription_id
    ).order_by(PharmacistReview.created_at.desc()).first()

    # Convert medicines to list of dicts
    med_list = [
        {
            "id": m.id,
            "name": m.name or "Prescribed Medicine",
            "strength": m.strength or "",
            "instruction": m.instruction or "",
            "frequency": m.frequency or "",
            "duration": m.duration or "",
            "additional_notes": m.additional_notes or "",
            "ocr_confidence": m.ocr_confidence,
            "verification_status": m.verification_status,
            "is_duplicate_flag": m.is_duplicate_flag
        }
        for m in medicines
    ]

    # Generate questions for pharmacist
    questions = ai_service.generate_questions(med_list, language)

    # Build visual 24-hour schedule grid
    schedule_grid = _build_daily_schedule(med_list)

    review_status_display = {
        "pending_review": "Pending Pharmacist Review",
        "under_review": "Under Clinical Review",
        "approved": "Pharmacist Verified & Approved",
        "correction_required": "Clarification Requested"
    }.get(prescription.review_status, "Unreviewed")

    return {
        "prescription_id": prescription.id,
        "patient_id": prescription.user_id,
        "original_filename": prescription.original_filename,
        "selected_language": language,
        "review_status": prescription.review_status,
        "review_status_display": review_status_display,
        "is_pharmacist_approved": prescription.review_status == "approved",
        "pharmacist_reviewer": latest_review.pharmacist_id if latest_review else None,
        "pharmacist_comments": latest_review.comments if latest_review else None,
        "medicines": med_list,
        "ai_explanation": ai_output.generated_text if ai_output else ai_service.generate_explanation(med_list, language),
        "questions_for_pharmacist": questions,
        "daily_schedule": schedule_grid,
        "disclaimer": "MedBridge AI converts verified prescription data into clear instructions. It does NOT diagnose or change prescribed dosages. Always consult your pharmacist for medical advice."
    }


def _build_daily_schedule(medicines: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Categorizes medicines into Morning, Afternoon, and Evening/Night administration slots.
    """
    morning_slot = []
    afternoon_slot = []
    night_slot = []

    for m in medicines:
        freq = (m.get("frequency") or "").lower()
        inst = (m.get("instruction") or "").lower()

        # Morning checks
        if any(w in freq or w in inst for w in ["morning", "tid", "bid", "qd", "od", "once daily", "3 times", "2 times", "8:00 am"]):
            morning_slot.append({
                "name": m["name"],
                "strength": m["strength"],
                "instruction": "Take with breakfast/water",
                "instruction_ur": "صبح کے وقت پانی کے ساتھ لیں"
            })

        # Afternoon checks
        if any(w in freq or w in inst for w in ["afternoon", "tid", "q8h", "3 times", "2:00 pm", "lunch"]):
            afternoon_slot.append({
                "name": m["name"],
                "strength": m["strength"],
                "instruction": "Take after lunch with water",
                "instruction_ur": "دوپہر کے کھانے کے بعد لیں"
            })

        # Night checks
        if any(w in freq or w in inst for w in ["night", "evening", "tid", "bid", "q12h", "q8h", "3 times", "2 times", "10:00 pm", "bedtime", "dinner"]):
            night_slot.append({
                "name": m["name"],
                "strength": m["strength"],
                "instruction": "Take after dinner before sleep",
                "instruction_ur": "رات کے کھانے کے بعد لیں"
            })

    return {
        "morning": {"time_label": "Morning (approx. 8:00 AM)", "items": morning_slot},
        "afternoon": {"time_label": "Afternoon (approx. 2:00 PM)", "items": afternoon_slot},
        "night": {"time_label": "Evening/Night (approx. 8:00 PM)", "items": night_slot}
    }
