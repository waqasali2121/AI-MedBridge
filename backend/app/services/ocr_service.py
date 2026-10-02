"""
OCR Service

Handles text extraction from prescription documents:
- Primary method: PyMuPDF (fitz) for computerized/digital PDFs (1.0 confidence)
- Fallback method: Tesseract OCR for scanned/image PDFs or raw image uploads
"""

import os
from typing import Tuple
import fitz  # PyMuPDF
from PIL import Image
import pytesseract


def extract_text_from_pdf(pdf_path: str) -> Tuple[str, float, str]:
    """
    Extract text directly from a PDF file using PyMuPDF.
    If text is found, returns (extracted_text, 1.0, "PYMUPDF").
    If PDF contains only images/scans, falls back to rendering page as image + Tesseract OCR.
    """
    try:
        doc = fitz.open(pdf_path)
        extracted_text = ""
        for page in doc:
            extracted_text += page.get_text("text") + "\n"
        doc.close()

        cleaned_text = extracted_text.strip()
        # If we got meaningful text (more than 20 chars of readable text)
        if len(cleaned_text) > 20:
            return cleaned_text, 1.0, "PYMUPDF"

        # Fallback: render first page as image and run Tesseract
        doc = fitz.open(pdf_path)
        page = doc[0]
        pix = page.get_pixmap(dpi=300)
        temp_img_path = f"{pdf_path}_page0.png"
        pix.save(temp_img_path)
        doc.close()

        text, conf, _ = extract_text_from_image(temp_img_path)
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)

        return text, conf, "TESSERACT"
    except Exception as e:
        print(f"Error in PyMuPDF extraction: {e}")
        # Fallback attempt
        return f"Error extracting PDF: {str(e)}", 0.0, "FAILED"


def extract_text_from_image(image_path: str) -> Tuple[str, float, str]:
    """
    Extract text from an image using Tesseract OCR.
    Returns (extracted_text, average_confidence, "TESSERACT").
    """
    try:
        img = Image.open(image_path)
        # Convert image to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Get detailed OCR data with confidence
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)

        # Calculate average confidence for non-empty text blocks
        confidences = [
            float(conf) for conf, text in zip(data['conf'], data['text'])
            if text.strip() and int(conf) > 0
        ]

        avg_confidence = (sum(confidences) / len(confidences) / 100.0) if confidences else 0.7
        extracted_text = pytesseract.image_to_string(img)

        return extracted_text.strip(), round(avg_confidence, 2), "TESSERACT"
    except Exception as e:
        print(f"Error in Tesseract OCR extraction: {e}")
        return f"OCR Extraction Error: {str(e)}", 0.0, "FAILED"


def extract_text(file_path: str, file_type: str | None = None) -> Tuple[str, float, str]:
    """
    Main extraction router:
    Checks extension / file_type and routes to PDF or Image extraction.
    """
    if not os.path.exists(file_path):
        return "File not found", 0.0, "FAILED"

    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf" or file_type == "PDF":
        return extract_text_from_pdf(file_path)
    elif ext in [".jpg", ".jpeg", ".png", ".webp", ".bmp"] or file_type == "IMAGE":
        return extract_text_from_image(file_path)
    else:
        # Default try PDF then image
        try:
            return extract_text_from_pdf(file_path)
        except Exception:
            return extract_text_from_image(file_path)
