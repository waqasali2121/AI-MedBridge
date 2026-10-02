from datetime import datetime
from sqlalchemy import Integer, String, Text, DateTime, JSON, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PharmacistReview(Base):
    __tablename__ = "pharmacist_reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prescription_id: Mapped[int] = mapped_column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    pharmacist_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    comments: Mapped[str | None] = mapped_column(Text, nullable=True)
    correction_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    warnings_acknowledged: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    review_started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    review_completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    prescription = relationship("Prescription", back_populates="reviews")
    pharmacist = relationship("User", back_populates="reviews")
