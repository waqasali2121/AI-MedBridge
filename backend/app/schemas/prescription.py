from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator


class PrescriptionResponse(BaseModel):
    id: int
    user_id: int
    image_path: Optional[str] = None
    original_filename: Optional[str] = None
    file_type: Optional[str] = None
    extraction_method: Optional[str] = None
    processing_status: str
    review_status: str
    selected_language: str
    upload_time: datetime
    confirmed_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PrescriptionListResponse(BaseModel):
    id: int
    original_filename: Optional[str] = None
    processing_status: str
    review_status: str
    selected_language: str
    upload_time: datetime
    medicine_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class LanguageUpdate(BaseModel):
    language: str

    @field_validator("language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        if v not in ("en", "ur"):
            raise ValueError("Language must be 'en' or 'ur'")
        return v
