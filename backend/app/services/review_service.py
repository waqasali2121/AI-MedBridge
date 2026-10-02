"""
Review Service

Business logic for the pharmacist review and clinical validation workflow:
- Start review: Assigns prescription & transitions status to "under_review"
- Approve review: Certifies clinical correctness & transitions status to "approved"
- Request correction: Flags issues for patient re-confirmation & transitions to "correction_required"
- Review statistics & history tracking
"""

from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.prescription import Prescription
from app.models.pharmacist_review import PharmacistReview
from app.schemas.review import ReviewApprove, ReviewReject
from app.services import audit_service


def start_pharmacist_review(db: Session, prescription_id: int, pharmacist_id: int) -> PharmacistReview:
    """Assigns prescription and sets review_status to 'under_review'."""
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise ValueError(f"Prescription {prescription_id} not found")

    prescription.review_status = "under_review"

    review = PharmacistReview(
        prescription_id=prescription_id,
        pharmacist_id=pharmacist_id,
        status="under_review",
        review_started_at=datetime.utcnow()
    )
    db.add(review)
    db.commit()

    audit_service.log_action(
        db=db,
        user_id=pharmacist_id,
        action="review_start",
        prescription_id=prescription_id
    )

    db.refresh(review)
    return review


def approve_pharmacist_review(db: Session, prescription_id: int, pharmacist_id: int, approve_data: ReviewApprove) -> PharmacistReview:
    """Approves prescription handover and sets review_status to 'approved'."""
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise ValueError(f"Prescription {prescription_id} not found")

    prescription.review_status = "approved"

    # Find existing or create new review
    review = db.query(PharmacistReview).filter(
        PharmacistReview.prescription_id == prescription_id
    ).order_by(PharmacistReview.created_at.desc()).first()

    if not review:
        review = PharmacistReview(prescription_id=prescription_id, pharmacist_id=pharmacist_id)
        db.add(review)

    review.status = "approved"
    review.comments = approve_data.comments if approve_data else "Approved by pharmacist"
    review.review_completed_at = datetime.utcnow()

    db.commit()

    audit_service.log_action(
        db=db,
        user_id=pharmacist_id,
        action="approve",
        prescription_id=prescription_id,
        details={"comments": review.comments}
    )

    db.refresh(review)
    return review


def reject_pharmacist_review(db: Session, prescription_id: int, pharmacist_id: int, reject_data: ReviewReject) -> PharmacistReview:
    """Requests correction and sets review_status to 'correction_required'."""
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise ValueError(f"Prescription {prescription_id} not found")

    prescription.review_status = "correction_required"

    review = db.query(PharmacistReview).filter(
        PharmacistReview.prescription_id == prescription_id
    ).order_by(PharmacistReview.created_at.desc()).first()

    if not review:
        review = PharmacistReview(prescription_id=prescription_id, pharmacist_id=pharmacist_id)
        db.add(review)

    review.status = "correction_required"
    review.correction_notes = reject_data.correction_notes
    review.comments = reject_data.comments
    review.review_completed_at = datetime.utcnow()

    db.commit()

    audit_service.log_action(
        db=db,
        user_id=pharmacist_id,
        action="reject",
        prescription_id=prescription_id,
        details={"correction_notes": reject_data.correction_notes}
    )

    db.refresh(review)
    return review


def get_review_stats(db: Session) -> Dict[str, int]:
    """Generates KPI statistics for the pharmacist dashboard."""
    pending = db.query(Prescription).filter(Prescription.review_status == "pending_review").count()
    under_review = db.query(Prescription).filter(Prescription.review_status == "under_review").count()
    approved = db.query(Prescription).filter(Prescription.review_status == "approved").count()
    correction = db.query(Prescription).filter(Prescription.review_status == "correction_required").count()
    total = db.query(Prescription).count()

    return {
        "pending": pending,
        "under_review": under_review,
        "approved": approved,
        "correction_required": correction,
        "reviewed_today": approved + correction,
        "total_handovers": total
    }
