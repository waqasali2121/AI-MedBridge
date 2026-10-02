from typing import Optional, Any

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def log_action(
    db: Session,
    user_id: Optional[int] = None,
    action: str = "",
    prescription_id: Optional[int] = None,
    details: Optional[dict[str, Any]] = None,
    ip_address: Optional[str] = None,
) -> AuditLog:
    log_entry = AuditLog(
        user_id=user_id,
        action=action,
        prescription_id=prescription_id,
        details=details,
        ip_address=ip_address,
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
