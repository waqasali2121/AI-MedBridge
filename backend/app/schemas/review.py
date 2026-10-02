from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ReviewResponse(BaseModel):
    id: int
    prescription_id: int
    pharmacist_id: int
    status: str
    comments: Optional[str] = None
    correction_notes: Optional[str] = None
    review_started_at: Optional[datetime] = None
    review_completed_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewCreate(BaseModel):
    comments: Optional[str] = None


class ReviewApprove(BaseModel):
    comments: Optional[str] = None


class ReviewReject(BaseModel):
    correction_notes: str
    comments: Optional[str] = None
