from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict


class AIOutputResponse(BaseModel):
    id: int
    prescription_id: int
    language: str
    generated_text: Optional[str] = None
    generated_questions: Optional[List[str]] = None
    model_used: Optional[str] = None
    safety_check_passed: bool
    safety_warnings: Optional[Any] = None
    review_status: str
    generation_time: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
