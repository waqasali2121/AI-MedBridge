from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.models.user import User
from app.models.prescription import Prescription
from app.models.pharmacist_review import PharmacistReview
from app.schemas.review import ReviewResponse, ReviewCreate, ReviewApprove, ReviewReject
from app.services import review_service, audit_service

router = APIRouter(prefix="/reviews", tags=["Pharmacist Reviews"])


@router.get("/pending", response_model=list[ReviewResponse])
def list_pending_reviews(
    current_user: User = Depends(require_role("pharmacist", "admin")),
    db: Session = Depends(get_db),
):
    prescriptions = (
        db.query(Prescription)
        .filter(Prescription.review_status == "pending_review")
        .order_by(Prescription.upload_time.asc())
        .all()
    )

    reviews = []
    for p in prescriptions:
        existing_review = (
            db.query(PharmacistReview)
            .filter(PharmacistReview.prescription_id == p.id)
            .first()
        )
        if not existing_review:
            # Create a pending review record placeholder
            existing_review = PharmacistReview(
                prescription_id=p.id,
                pharmacist_id=current_user.id,
                status="pending"
            )
            db.add(existing_review)
            db.commit()
            db.refresh(existing_review)

        reviews.append(existing_review)

    return reviews


@router.get("/history", response_model=list[ReviewResponse])
def list_review_history(
    current_user: User = Depends(require_role("pharmacist", "admin")),
    db: Session = Depends(get_db),
):
    reviews = (
        db.query(PharmacistReview)
        .filter(PharmacistReview.pharmacist_id == current_user.id)
        .filter(PharmacistReview.status.in_(["approved", "correction_required"]))
        .order_by(PharmacistReview.review_completed_at.desc())
        .all()
    )
    return reviews


@router.get("/stats")
def get_review_stats(
    current_user: User = Depends(require_role("pharmacist", "admin")),
    db: Session = Depends(get_db),
):
    stats = review_service.get_review_stats(db)
    return stats


@router.get("/{prescription_id}", response_model=ReviewResponse)
def get_review(
    prescription_id: int,
    current_user: User = Depends(require_role("pharmacist", "admin")),
    db: Session = Depends(get_db),
):
    review = (
        db.query(PharmacistReview)
        .filter(PharmacistReview.prescription_id == prescription_id)
        .order_by(PharmacistReview.created_at.desc())
        .first()
    )
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    return review


@router.post("/{prescription_id}/start", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def start_review(
    prescription_id: int,
    current_user: User = Depends(require_role("pharmacist", "admin")),
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")

    review = review_service.start_pharmacist_review(db, prescription_id, current_user.id)
    return review


@router.post("/{prescription_id}/approve", response_model=ReviewResponse)
def approve_review(
    prescription_id: int,
    data: ReviewApprove,
    current_user: User = Depends(require_role("pharmacist", "admin")),
    db: Session = Depends(get_db),
):
    review = review_service.approve_pharmacist_review(db, prescription_id, current_user.id, data)
    return review


@router.post("/{prescription_id}/reject", response_model=ReviewResponse)
def reject_review(
    prescription_id: int,
    data: ReviewReject,
    current_user: User = Depends(require_role("pharmacist", "admin")),
    db: Session = Depends(get_db),
):
    review = review_service.reject_pharmacist_review(db, prescription_id, current_user.id, data)
    return review


@router.post("/{prescription_id}/comment", response_model=ReviewResponse)
def add_comment(
    prescription_id: int,
    data: ReviewCreate,
    current_user: User = Depends(require_role("pharmacist", "admin")),
    db: Session = Depends(get_db),
):
    review = (
        db.query(PharmacistReview)
        .filter(
            PharmacistReview.prescription_id == prescription_id,
            PharmacistReview.pharmacist_id == current_user.id,
        )
        .order_by(PharmacistReview.created_at.desc())
        .first()
    )
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found for this prescription",
        )

    if data.comments:
        existing = review.comments or ""
        review.comments = f"{existing}\n{data.comments}".strip() if existing else data.comments

    db.commit()
    db.refresh(review)

    return review
