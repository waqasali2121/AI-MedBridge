"""
Extraction Service

Coordinates the text extraction pipeline:
1. Determines file type (PDF vs Image)
2. Routes to appropriate extractor (PyMuPDF for PDFs, Tesseract for images)
3. Parses raw text into structured medicine data
4. Saves extracted medicines to database

TODO: Implement in Phase 2
"""

# TODO: Implement extraction pipeline
# - extract_from_prescription(db, prescription_id): main entry point
# - parse_raw_text_to_medicines(raw_text: str): parse extracted text into medicine fields
# - save_medicines(db, prescription_id, medicines: list): persist to DB
