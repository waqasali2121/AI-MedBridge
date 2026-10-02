from datetime import datetime
from sqlalchemy import Integer, String, Text, Float, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prescription_id: Mapped[int] = mapped_column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    strength: Mapped[str | None] = mapped_column(String(100), nullable=True)
    instruction: Mapped[str | None] = mapped_column(Text, nullable=True)
    frequency: Mapped[str | None] = mapped_column(String(100), nullable=True)
    duration: Mapped[str | None] = mapped_column(String(100), nullable=True)
    additional_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    ocr_confidence: Mapped[float] = mapped_column(Float, default=0.0)
    source: Mapped[str] = mapped_column(String(50), default="ocr_extracted")
    verification_status: Mapped[str] = mapped_column(String(50), default="unverified")
    is_duplicate_flag: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    prescription = relationship("Prescription", back_populates="medicines")
