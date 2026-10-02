"""
Synthetic Demo Data Generator

Generates realistic computerized hospital prescription PDFs using PyMuPDF (fitz)
for testing the MedBridge extraction pipeline and demonstration scenarios.
"""

import os
import fitz  # PyMuPDF


def create_prescription_pdf(filename: str, hospital_name: str, patient_name: str, mrn: str, rx_id: str, prescriber: str, medicines: list):
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)  # A4 size

    # Header / Masthead
    rect = fitz.Rect(30, 30, 565, 90)
    page.draw_rect(rect, color=(0.06, 0.16, 0.26), fill=(0.96, 0.97, 1.0))
    page.insert_text(fitz.Point(40, 55), hospital_name.upper(), fontsize=16, fontname="helv", color=(0.06, 0.16, 0.26))
    page.insert_text(fitz.Point(40, 75), "COMPUTERIZED E-PRESCRIPTION ORDER SHEET", fontsize=10, fontname="helv", color=(0.05, 0.58, 0.53))

    # Patient & Rx metadata
    page.insert_text(fitz.Point(40, 115), f"PATIENT NAME: {patient_name.upper()}", fontsize=11, fontname="helv")
    page.insert_text(fitz.Point(40, 130), f"MRN: {mrn}  |  AGE: 54y  |  GENDER: Male", fontsize=10, fontname="helv")
    page.insert_text(fitz.Point(40, 145), "ALLERGIES: NKDA (Penicillin Tested Negative)", fontsize=10, fontname="helv")

    page.insert_text(fitz.Point(360, 115), f"PRESCRIPTION TOKEN: {rx_id}", fontsize=11, fontname="helv")
    page.insert_text(fitz.Point(360, 130), f"PRESCRIBER: {prescriber}", fontsize=10, fontname="helv")
    page.insert_text(fitz.Point(360, 145), "DATE: 2024-10-24 09:32:00", fontsize=10, fontname="helv")

    # Divider line
    page.draw_line(fitz.Point(30, 165), fitz.Point(565, 165), color=(0.8, 0.85, 0.9), width=1)

    # Orders header
    page.insert_text(fitz.Point(40, 185), "RX PRESCRIBED MEDICATIONS", fontsize=12, fontname="helv", color=(0.06, 0.16, 0.26))

    y = 210
    for idx, med in enumerate(medicines, 1):
        # Med container box
        med_rect = fitz.Rect(30, y, 565, y + 65)
        page.draw_rect(med_rect, color=(0.8, 0.85, 0.9), fill=(0.98, 0.99, 1.0))
        page.draw_line(fitz.Point(30, y), fitz.Point(36, y + 65), color=(0.05, 0.58, 0.53), width=6)

        page.insert_text(fitz.Point(45, y + 20), f"{idx}. {med['name']} {med['strength']}", fontsize=11, fontname="helv", color=(0.06, 0.16, 0.26))
        page.insert_text(fitz.Point(45, y + 38), f"Sig: {med['sig']}", fontsize=10, fontname="helv")
        page.insert_text(fitz.Point(45, y + 53), f"Instructions: {med['instruction']}", fontsize=9, fontname="helv", color=(0.3, 0.35, 0.4))

        page.insert_text(fitz.Point(440, y + 20), f"Dispense: {med['dispense']}", fontsize=10, fontname="helv")
        page.insert_text(fitz.Point(440, y + 38), f"Refills: {med.get('refills', 0)}", fontsize=10, fontname="helv")

        y += 75

    # Footer E-signature
    page.draw_line(fitz.Point(30, 750), fitz.Point(565, 750), color=(0.8, 0.85, 0.9), width=1)
    page.insert_text(fitz.Point(40, 770), f"ELECTRONICALLY SIGNED BY: {prescriber}", fontsize=10, fontname="helv")
    page.insert_text(fitz.Point(40, 785), "DIGITAL STAMP: SHA256-VALID-TOKEN-8FA19E34", fontsize=9, fontname="helv", color=(0.5, 0.5, 0.5))

    output_path = os.path.join(os.path.dirname(__file__), filename)
    doc.save(output_path)
    doc.close()
    print(f"Generated demo prescription: {output_path}")


def generate_all_demo_data():
    dir_path = os.path.dirname(__file__)

    # Scenario 1: Farhan Ahmed - Clear 3 medicines
    create_prescription_pdf(
        filename="prescription_clear.pdf",
        hospital_name="Metropolitan General Hospital",
        patient_name="Farhan Ahmed",
        mrn="MRN-88392",
        rx_id="RX-90823",
        prescriber="Dr. Michael Harris, MD (PMDC-44219)",
        medicines=[
            {
                "name": "Amoxicillin Trihydrate",
                "strength": "500mg Capsules",
                "sig": "1 cap PO TID PC x 5 days",
                "instruction": "Take 1 capsule orally 3 times daily after meals for 5 days.",
                "dispense": "15 Capsules",
                "refills": 0
            },
            {
                "name": "Paracetamol (Acetaminophen)",
                "strength": "500mg Tablets",
                "sig": "2 tab PO Q6H PRN fever/pain",
                "instruction": "Take 2 tablets orally every 6 hours as needed for fever or body pain.",
                "dispense": "20 Tablets",
                "refills": 0
            },
            {
                "name": "Omeprazole",
                "strength": "20mg Delayed-Release Capsules",
                "sig": "1 cap PO OD AC morning x 14 days",
                "instruction": "Take 1 capsule orally once daily in the morning 30 minutes before breakfast for 14 days.",
                "dispense": "14 Capsules",
                "refills": 1
            }
        ]
    )

    # Scenario 2: David Chen - Multiple 4 medicines
    create_prescription_pdf(
        filename="prescription_multiple.pdf",
        hospital_name="St. Mary's Orthopedic Center",
        patient_name="David Chen",
        mrn="MRN-99214",
        rx_id="RX-90829",
        prescriber="Dr. Rachel Vance, MD",
        medicines=[
            {
                "name": "Celecoxib",
                "strength": "200mg Capsules",
                "sig": "1 cap PO OD PC x 10 days",
                "instruction": "Take 1 capsule once daily after food for joint pain.",
                "dispense": "10 Capsules",
                "refills": 0
            },
            {
                "name": "Tramadol",
                "strength": "50mg Tablets",
                "sig": "1 tab PO Q8H PRN severe pain",
                "instruction": "Take 1 tablet every 8 hours as needed for severe pain.",
                "dispense": "15 Tablets",
                "refills": 0
            },
            {
                "name": "Pantoprazole",
                "strength": "40mg Tablets",
                "sig": "1 tab PO OD AC morning x 14 days",
                "instruction": "Take 1 tablet in the morning before breakfast.",
                "dispense": "14 Tablets",
                "refills": 1
            },
            {
                "name": "Vitamin D3",
                "strength": "2000 IU Tablets",
                "sig": "1 tab PO OD x 30 days",
                "instruction": "Take 1 tablet daily with meals.",
                "dispense": "30 Tablets",
                "refills": 2
            }
        ]
    )

    # Scenario 3: Duplicate medicine scenario
    create_prescription_pdf(
        filename="prescription_duplicate.pdf",
        hospital_name="City Outpatient Clinic",
        patient_name="Zainab Bibi",
        mrn="MRN-41902",
        rx_id="RX-90824",
        prescriber="Dr. S. K. Rao, MD",
        medicines=[
            {
                "name": "Paracetamol",
                "strength": "500mg Tablets",
                "sig": "2 tab PO Q6H PRN",
                "instruction": "Take 2 tablets every 6 hours for fever.",
                "dispense": "20 Tablets",
                "refills": 0
            },
            {
                "name": "Acetaminophen",
                "strength": "500mg Tablets",
                "sig": "1 tab PO Q8H PRN",
                "instruction": "Take 1 tablet for headache.",
                "dispense": "10 Tablets",
                "refills": 0
            }
        ]
    )

if __name__ == "__main__":
    generate_all_demo_data()
