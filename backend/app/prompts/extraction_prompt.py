"""
Extraction Prompt

Prompt template for extracting structured medicine data from raw OCR text.
Used by the AI service to parse unstructured prescription text into
medicine name, strength, dosage, frequency, and duration fields.
"""

EXTRACTION_PROMPT = """You are a medical prescription parser. Extract structured medicine information from the following prescription text.

For each medicine found, extract:
- Medicine name
- Strength/dosage (e.g., 500mg, 10ml)
- Instructions (e.g., take with food, before meals)
- Frequency (e.g., twice daily, every 8 hours)
- Duration (e.g., 7 days, 2 weeks)
- Additional notes

Return the data as a JSON array of objects.

Prescription text:
{raw_text}

Respond ONLY with valid JSON. Do not include any explanation or markdown formatting.
"""
