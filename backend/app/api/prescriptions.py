import os
import uuid
import shutil
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.prescription import Prescription
from app.models.medicine import Medicine
from app.schemas.prescription import (
    PrescriptionResponse,
    PrescriptionListResponse,
    LanguageUpdate,
)
from app.schemas.medicine import MedicineResponse, MedicineUpdate
from app.services import prescription_service, handover_service, audit_service

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/tiff",
    "image/bmp",
}


@router.post("/upload", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED)
def upload_prescription(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{file.content_type}' not allowed. Allowed: {', '.join(ALLOWED_MIME_TYPES)}",
        )

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '{ext}' not allowed.",
        )

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    max_size = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds {settings.MAX_FILE_SIZE_MB}MB limit.",
        )

    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_type = "PDF" if ext == ".pdf" else "IMAGE"

    prescription = Prescription(
        user_id=current_user.id,
        image_path=file_path,
        original_filename=file.filename,
        file_type=file_type,
        processing_status="uploaded",
        review_status="pending_review",
        selected_language=current_user.language or "en",
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)

    audit_service.log_action(
        db,
        user_id=current_user.id,
        action="upload",
        prescription_id=prescription.id,
        details={"filename": file.filename, "file_type": file_type},
    )

    # Process extraction pipeline
    processed_prescription = prescription_service.process_prescription_pipeline(db, prescription.id)

    return processed_prescription


@router.get("/", response_model=list[PrescriptionListResponse])
def list_prescriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescriptions = (
        db.query(Prescription)
        .filter(Prescription.user_id == current_user.id)
        .order_by(Prescription.upload_time.desc())
        .all()
    )
    result = []
    for p in prescriptions:
        medicine_count = db.query(Medicine).filter(Medicine.prescription_id == p.id).count()
        result.append(
            PrescriptionListResponse(
                id=p.id,
                original_filename=p.original_filename,
                processing_status=p.processing_status,
                review_status=p.review_status,
                selected_language=p.selected_language,
                upload_time=p.upload_time,
                medicine_count=medicine_count,
            )
        )
    return result


@router.get("/{prescription_id}", response_model=PrescriptionResponse)
def get_prescription(
    prescription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")
    if prescription.user_id != current_user.id and current_user.role not in ("pharmacist", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this prescription")
    return prescription


@router.get("/{prescription_id}/medicines", response_model=list[MedicineResponse])
def get_prescription_medicines(
    prescription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")
    if prescription.user_id != current_user.id and current_user.role not in ("pharmacist", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    medicines = db.query(Medicine).filter(Medicine.prescription_id == prescription_id).all()
    return medicines


@router.put("/{prescription_id}/medicines/{medicine_id}", response_model=MedicineResponse)
def update_medicine(
    prescription_id: int,
    medicine_id: int,
    medicine_update: MedicineUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")
    if prescription.user_id != current_user.id and current_user.role not in ("pharmacist", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    medicine = (
        db.query(Medicine)
        .filter(Medicine.id == medicine_id, Medicine.prescription_id == prescription_id)
        .first()
    )
    if not medicine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicine not found")

    update_data = medicine_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(medicine, field, value)
    medicine.source = "user_corrected"
    db.commit()
    db.refresh(medicine)

    audit_service.log_action(
        db,
        user_id=current_user.id,
        action="edit",
        prescription_id=prescription_id,
        details={"medicine_id": medicine_id, "updated_fields": list(update_data.keys())},
    )

    return medicine


@router.post("/{prescription_id}/confirm", response_model=PrescriptionResponse)
def confirm_prescription(
    prescription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")
    if prescription.user_id != current_user.id and current_user.role not in ("pharmacist", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    confirmed_prescription = prescription_service.confirm_prescription(db, prescription_id, current_user.id)
    return confirmed_prescription


@router.put("/{prescription_id}/language", response_model=PrescriptionResponse)
def update_language(
    prescription_id: int,
    lang_update: LanguageUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")
    if prescription.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    prescription.selected_language = lang_update.language
    db.commit()
    db.refresh(prescription)

    return prescription


@router.post("/{prescription_id}/generate")
def generate_ai_output(
    prescription_id: int,
    language: str = Query("en", description="Target language ('en' or 'ur')"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")
    if prescription.user_id != current_user.id and current_user.role not in ("pharmacist", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    ai_output = prescription_service.generate_ai_explanation_pipeline(db, prescription_id, language)
    return {
        "message": "AI output generated successfully",
        "prescription_id": prescription_id,
        "language": ai_output.language,
        "generated_text": ai_output.generated_text,
        "generated_questions": ai_output.generated_questions,
        "safety_check_passed": ai_output.safety_check_passed,
        "safety_warnings": ai_output.safety_warnings
    }


@router.get("/{prescription_id}/handover")
def get_handover_card(
    prescription_id: int,
    language: str = Query("en", description="Target language ('en' or 'ur')"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")
    if prescription.user_id != current_user.id and current_user.role not in ("pharmacist", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    handover_card = handover_service.generate_handover_card(db, prescription_id, language)
    return handover_card


@router.get("/{prescription_id}/status")
def get_prescription_status(
    prescription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")
    if prescription.user_id != current_user.id and current_user.role not in ("pharmacist", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return {
        "prescription_id": prescription.id,
        "processing_status": prescription.processing_status,
        "review_status": prescription.review_status,
    }
