from typing import Optional
from pydantic import BaseModel, ConfigDict


class MedicineResponse(BaseModel):
    id: int
    prescription_id: int
    name: Optional[str] = None
    strength: Optional[str] = None
    instruction: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    additional_notes: Optional[str] = None
    ocr_confidence: float
    source: str
    verification_status: str
    is_duplicate_flag: bool

    model_config = ConfigDict(from_attributes=True)


class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    strength: Optional[str] = None
    instruction: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    additional_notes: Optional[str] = None
