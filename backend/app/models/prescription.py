from datetime import datetime
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Prescription(Base):
    __tablename__ = "prescriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    image_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file_type: Mapped[str | None] = mapped_column(String(20), nullable=True)
    extraction_method: Mapped[str | None] = mapped_column(String(50), nullable=True)
    raw_extracted_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    processing_status: Mapped[str] = mapped_column(String(50), default="uploaded")
    review_status: Mapped[str] = mapped_column(String(50), default="pending_review")
    selected_language: Mapped[str] = mapped_column(String(10), default="en")
    upload_time: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="prescriptions")
    medicines = relationship("Medicine", back_populates="prescription", lazy="selectin", cascade="all, delete-orphan")
    ai_outputs = relationship("AIOutput", back_populates="prescription", lazy="selectin", cascade="all, delete-orphan")
    reviews = relationship("PharmacistReview", back_populates="prescription", lazy="selectin", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="prescription", lazy="selectin", cascade="all, delete-orphan")
