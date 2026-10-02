from datetime import datetime
from sqlalchemy import Integer, String, Text, Float, Boolean, DateTime, JSON, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class AIOutput(Base):
    __tablename__ = "ai_outputs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prescription_id: Mapped[int] = mapped_column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    language: Mapped[str] = mapped_column(String(10), default="en")
    generated_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    generated_questions: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    source_version: Mapped[str | None] = mapped_column(String(100), nullable=True)
    model_used: Mapped[str | None] = mapped_column(String(100), nullable=True)
    safety_check_passed: Mapped[bool] = mapped_column(Boolean, default=False)
    safety_warnings: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    review_status: Mapped[str] = mapped_column(String(50), default="pending")
    generation_time: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    prescription = relationship("Prescription", back_populates="ai_outputs")
