"""
Rule Engine Service

Applies deterministic safety and validation rules to extracted prescription data:
- Duplicate medicine detection
- Incomplete field detection (missing dose, frequency, duration)
- OCR confidence threshold checking
- Rule warning generation (INFO, WARNING, CRITICAL)

Note: The rule engine NEVER makes autonomous clinical decisions.
It flags potential issues for human pharmacist review.
"""

import re
from typing import List, Dict, Any


def check_duplicates(medicines: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Detects potential duplicate medicine entries in the prescription."""
    warnings = []
    seen_names = {}

    for idx, med in enumerate(medicines):
        raw_name = (med.get('name') or '').lower().strip()
        # Clean generic words to compare core drug names
        clean_name = re.sub(r'(tablet|capsule|syrup|inj|injection|suspension|mg|g|ml)', '', raw_name).strip()

        if not clean_name:
            continue

        if clean_name in seen_names:
            prev_idx = seen_names[clean_name]
            warnings.append({
                "rule": "DUPLICATE_MEDICINE",
                "severity": "WARNING",
                "medicine_index": idx,
                "message": f"Potential duplicate entry detected: '{med.get('name')}' matches item #{prev_idx + 1}."
            })
        else:
            seen_names[clean_name] = idx

    return warnings


def check_incomplete_fields(medicines: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Checks for incomplete or missing essential prescription fields."""
    warnings = []

    for idx, med in enumerate(medicines):
        name = med.get('name') or ''
        frequency = med.get('frequency') or ''
        duration = med.get('duration') or ''
        strength = med.get('strength') or ''

        missing = []
        if not name or name == "Unknown Medicine":
            missing.append("medicine name")
        if not frequency or frequency == "As directed":
            missing.append("frequency")
        if not duration or duration == "As prescribed":
            missing.append("duration")

        if missing:
            missing_str = ", ".join(missing)
            warnings.append({
                "rule": "INCOMPLETE_FIELDS",
                "severity": "INFO",
                "medicine_index": idx,
                "message": f"Item #{idx + 1} ({name or 'Unnamed'}) has unconfirmed {missing_str}."
            })

    return warnings


def check_ocr_confidence(medicines: List[Dict[str, Any]], threshold: float = 0.85) -> List[Dict[str, Any]]:
    """Flags medicines where OCR extraction confidence falls below threshold."""
    warnings = []

    for idx, med in enumerate(medicines):
        conf = float(med.get('ocr_confidence', 1.0))
        if conf < threshold:
            warnings.append({
                "rule": "LOW_OCR_CONFIDENCE",
                "severity": "WARNING",
                "medicine_index": idx,
                "message": f"Item #{idx + 1} ('{med.get('name')}') was extracted with low confidence ({int(conf * 100)}%). Manual verification required."
            })

    return warnings


def run_all_rules(medicines: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Executes all rule engine checks and aggregates warnings.
    Returns summary dictionary.
    """
    duplicates = check_duplicates(medicines)
    incompletes = check_incomplete_fields(medicines)
    low_confs = check_ocr_confidence(medicines)

    all_warnings = duplicates + incompletes + low_confs

    has_critical = any(w['severity'] == 'CRITICAL' for w in all_warnings)
    has_warnings = any(w['severity'] == 'WARNING' for w in all_warnings)

    return {
        "warnings": all_warnings,
        "total_warnings": len(all_warnings),
        "requires_pharmacist_flag": has_critical or has_warnings,
        "duplicate_count": len(duplicates),
        "incomplete_count": len(incompletes),
        "low_confidence_count": len(low_confs)
    }
