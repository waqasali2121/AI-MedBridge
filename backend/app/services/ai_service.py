"""
AI Service

Interfaces with Ollama (local LLM) or falls back to deterministic rule-based formatting:
- Extracting structured medicine JSON from raw prescription text
- Generating patient-friendly bilingual (English / Urdu) explanations & schedules
- Generating questions for the pharmacist
- Running safety checks against clinical boundaries
"""

import json
import re
import httpx
from typing import List, Dict, Any, Tuple
from app.config import settings
from app.prompts.extraction_prompt import EXTRACTION_PROMPT
from app.prompts.explanation_prompt import EXPLANATION_PROMPT
from app.prompts.urdu_prompt import URDU_PROMPT
from app.prompts.safety_prompt import SAFETY_PROMPT


def call_ollama(prompt: str, model: str | None = None) -> str | None:
    """
    Call Ollama local LLM endpoint via HTTP POST.
    Returns generated response string or None if service unavailable.
    """
    model_name = model or settings.OLLAMA_MODEL
    url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1  # Low temperature for deterministic medical extraction
        }
    }

    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "")
    except Exception as e:
        print(f"Ollama connection error (will use fallback): {e}")

    return None


def extract_structured_medicines(raw_text: str) -> List[Dict[str, Any]]:
    """
    Converts raw prescription text into a list of structured medicine dicts.
    Uses Ollama if available, otherwise uses Regex/Rule-based parser fallback.
    """
    prompt = EXTRACTION_PROMPT.format(raw_text=raw_text)
    response_text = call_ollama(prompt)

    if response_text:
        try:
            # Extract JSON array from LLM response (in case there's markdown ticks)
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group(0))
                if isinstance(parsed, list):
                    return [_normalize_medicine_dict(m) for m in parsed]
        except Exception as e:
            print(f"Failed to parse LLM JSON response: {e}")

    # Fallback regex/heuristic parser when Ollama is unavailable or fails
    return _heuristic_medicine_parser(raw_text)


def _normalize_medicine_dict(m: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure standard keys exist in extracted medicine dict."""
    return {
        "name": m.get("name") or m.get("medicine_name") or "Unknown Medicine",
        "strength": m.get("strength") or m.get("dosage") or "",
        "instruction": m.get("instruction") or m.get("instructions") or m.get("sig") or "",
        "frequency": m.get("frequency") or "",
        "duration": m.get("duration") or "",
        "additional_notes": m.get("additional_notes") or m.get("notes") or "",
        "ocr_confidence": float(m.get("ocr_confidence", 0.95)),
    }


def _heuristic_medicine_parser(raw_text: str) -> List[Dict[str, Any]]:
    """
    Smart rule-based parser for computerized prescriptions.
    Groups block items by item numbers (e.g. 1. Amoxicillin ... 2. Paracetamol ...)
    or by drug headers.
    """
    medicines = []

    # First attempt: split text by numbered items (e.g., "1. ", "2. ", "3. ")
    blocks = re.split(r'\n(?=\d+[\.\)]\s+)', raw_text)

    # Filter out header blocks (like hospital title) that start with "1." vs top header
    item_blocks = []
    for b in blocks:
        if re.match(r'^\d+[\.\)]\s+', b.strip()):
            item_blocks.append(b.strip())

    if item_blocks:
        for block in item_blocks:
            lines = [l.strip() for l in block.split('\n') if l.strip()]
            first_line = lines[0]

            # Extract drug name & strength from first line: "1. Amoxicillin Trihydrate 500mg Capsules"
            clean_first = re.sub(r'^\d+[\.\)]\s*', '', first_line).strip()
            str_match = re.search(r'(\d+\s*(?:mg|g|mcg|ml|IU|units|capsules|tablets|capsule|tablet))', clean_first, re.I)
            strength = str_match.group(1) if str_match else ""

            # Drug name is clean_first minus form words
            drug_name = clean_first
            if str_match:
                drug_name = clean_first[:str_match.start()].strip()

            # Instructions, Sig, Frequency, Duration from full block
            full_block_text = " ".join(lines)

            # Sig line or Instructions line
            sig_line = ""
            inst_line = ""
            for l in lines:
                if l.lower().startswith("sig:"):
                    sig_line = l[4:].strip()
                elif l.lower().startswith("instructions:"):
                    inst_line = l[13:].strip()

            instruction = inst_line or sig_line or full_block_text

            # Frequency
            freq = "As directed"
            if re.search(r'TID|3 times|every 8 h|three times', full_block_text, re.I):
                freq = "3 times daily (Every 8 hours)"
            elif re.search(r'BID|2 times|every 12 h|twice daily', full_block_text, re.I):
                freq = "2 times daily (Every 12 hours)"
            elif re.search(r'OD|QD|once daily|every morning|once a day', full_block_text, re.I):
                freq = "Once daily in morning"
            elif re.search(r'PRN|as needed|every 6 h|every 6 hours', full_block_text, re.I):
                freq = "Every 6 hours as needed for symptoms"

            # Duration
            dur_match = re.search(r'(?:x|for)\s*(\d+\s*(?:days|weeks|months|day))', full_block_text, re.I)
            duration = dur_match.group(1) if dur_match else "As prescribed"

            medicines.append({
                "name": drug_name or clean_first,
                "strength": strength,
                "instruction": instruction,
                "frequency": freq,
                "duration": duration,
                "additional_notes": "Extracted from computerized prescription order",
                "ocr_confidence": 0.95
            })

        return medicines

    # Unstructured fallback if no numbered items found
    lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
    for line in lines:
        str_match = re.search(r'(\d+\s*(?:mg|g|mcg|ml))', line, re.I)
        if str_match:
            drug_name = line[:str_match.start()].strip()
            medicines.append({
                "name": drug_name if len(drug_name) > 2 else line,
                "strength": str_match.group(1),
                "instruction": line,
                "frequency": "As directed",
                "duration": "As prescribed",
                "additional_notes": "Extracted line",
                "ocr_confidence": 0.90
            })

    if not medicines:
        medicines.append({
            "name": "Prescribed Medicine",
            "strength": "",
            "instruction": raw_text[:100],
            "frequency": "As directed",
            "duration": "As prescribed",
            "additional_notes": "Manual review recommended",
            "ocr_confidence": 0.75
        })

    return medicines


def generate_explanation(medicines: List[Dict[str, Any]], language: str = "en") -> str:
    """
    Generates plain-language patient explanations in English or Urdu.
    Uses Ollama if available, otherwise generates structured fallback templates.
    """
    medicines_json = json.dumps(medicines, indent=2)

    if language.lower() in ["ur", "urdu"]:
        prompt = URDU_PROMPT.format(medicines_json=medicines_json)
        llm_response = call_ollama(prompt)
        if llm_response:
            return llm_response

        # Fallback Urdu explanation template
        lines = ["مندرجہ ذیل دوائیوں کے لیے ہدایات:\n"]
        for i, m in enumerate(medicines, 1):
            name = m.get('name', 'دوائی')
            strength = m.get('strength', '')
            freq = m.get('frequency', '')
            dur = m.get('duration', '')
            lines.append(f"{i}. {name} {strength}")
            lines.append(f"   • استعمال کا طریقہ: {m.get('instruction', 'ڈاکٹر کی ہدایت کے مطابق لیں')}")
            lines.append(f"   • اوقات: {freq} ({dur} تک)\n")
        lines.append("نوٹ: کسی بھی قسم کے سوال کے لیے اپنے فارماسسٹ سے رجوع کریں۔")
        return "\n".join(lines)

    else:
        prompt = EXPLANATION_PROMPT.format(medicines_json=medicines_json)
        llm_response = call_ollama(prompt)
        if llm_response:
            return llm_response

        # Fallback English explanation template
        lines = ["Patient-Friendly Medication Guide:\n"]
        for i, m in enumerate(medicines, 1):
            name = m.get('name', 'Medicine')
            strength = m.get('strength', '')
            freq = m.get('frequency', 'As directed')
            dur = m.get('duration', 'As prescribed')
            lines.append(f"{i}. {name} {strength}")
            lines.append(f"   • How to take: {m.get('instruction', 'Take as directed by doctor.')}")
            lines.append(f"   • Schedule: {freq} for {dur}")
            lines.append("   • Important: Complete the full course as instructed.\n")
        lines.append("Note: Always consult your pharmacist or doctor if you experience discomfort.")
        return "\n".join(lines)


def generate_questions(medicines: List[Dict[str, Any]], language: str = "en") -> List[str]:
    """Generates suggested questions for the patient to ask their pharmacist."""
    if language.lower() in ["ur", "urdu"]:
        return [
            "کیا مجھے یہ دوائی کھانے کے ساتھ لینی چاہیے یا خالی پیٹ؟",
            "اگر میں کوئی خوراک بھول جاؤں تو مجھے کیا کرنا چاہیے؟",
            "کیا اس دوائی کے ساتھ کچھ مخصوص غذاؤں سے پرہیز کرنا ضروری ہے؟",
            "اس دوائی کے عام ضمنی اثرات کیا ہیں؟"
        ]
    return [
        "Should I take this medication with food or on an empty stomach?",
        "What should I do if I miss a dose?",
        "Are there any food, drink, or other medicines I should avoid while taking this?",
        "What are the most common side effects to watch out for?"
    ]


def validate_safety(ai_text: str, medicines: List[Dict[str, Any]]) -> Tuple[bool, List[str]]:
    """
    Validates that AI output complies with safety rules:
    - No diagnosis claims
    - No dosage changes
    - No treatment recommendations
    """
    warnings = []

    # Prohibited keywords check
    prohibited_patterns = [
        (r'you have (been diagnosed with|a condition|infection)', "Contains diagnosis language"),
        (r'change your (dose|dosage)', "Contains dose modification instruction"),
        (r'stop taking your (medicine|medication)', "Contains instruction to stop treatment"),
        (r'we recommend taking', "Contains unverified treatment recommendation"),
    ]

    for pattern, warning_msg in prohibited_patterns:
        if re.search(pattern, ai_text, re.I):
            warnings.append(warning_msg)

    is_safe = len(warnings) == 0
    return is_safe, warnings
