"""
Seed Database Script

Seeds the MedBridge PostgreSQL/SQLite database with initial demo accounts,
synthetic computerized prescriptions, extracted medicines, and review records.
"""

import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.prescription import Prescription
from app.models.medicine import Medicine
from app.models.ai_output import AIOutput
from app.models.pharmacist_review import PharmacistReview
from app.core.security import get_password_hash
from app.services import handover_service, ai_service


def seed():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if users already exist
        if db.query(User).filter(User.email == "patient@medbridge.com").first():
            print("Database already seeded. Skipping.")
            return

        print("Seeding demo users...")
        hashed_password = get_password_hash("demo1234")

        patient = User(
            email="patient@medbridge.com",
            password_hash=hashed_password,
            name="Farhan Ahmed",
            role="patient",
            language="en"
        )

        caregiver = User(
            email="caregiver@medbridge.com",
            password_hash=hashed_password,
            name="Sara Ahmed (Caregiver)",
            role="caregiver",
            language="en"
        )

        pharmacist = User(
            email="pharmacist@medbridge.com",
            password_hash=hashed_password,
            name="Dr. Sarah Reid, PharmD",
            role="pharmacist",
            language="en"
        )

        db.add_all([patient, caregiver, pharmacist])
        db.commit()
        db.refresh(patient)
        db.refresh(pharmacist)

        print("Seeding demo prescriptions...")

        # 1. Prescription 1: Farhan Ahmed (Clear 3 medicines)
        rx1 = Prescription(
            user_id=patient.id,
            original_filename="prescription_clear.pdf",
            image_path="sample_data/prescription_clear.pdf",
            file_type="PDF",
            extraction_method="PYMUPDF",
            raw_extracted_text="METROPOLITAN GENERAL HOSPITAL\nFARHAN AHMED MRN-88392 RX-90823...",
            processing_status="confirmed",
            review_status="pending_review",
            selected_language="en"
        )
        db.add(rx1)
        db.commit()
        db.refresh(rx1)

        # Medicines for Rx 1
        med1_1 = Medicine(
            prescription_id=rx1.id,
            name="Amoxicillin Trihydrate",
            strength="500mg",
            instruction="Take 1 capsule orally 3 times daily after meals for 5 days.",
            frequency="3 times daily (Every 8 hours)",
            duration="5 days",
            additional_notes="Complete full 5-day course even if feeling fully recovered.",
            ocr_confidence=0.99,
            source="user_confirmed",
            verification_status="confirmed"
        )
        med1_2 = Medicine(
            prescription_id=rx1.id,
            name="Paracetamol (Acetaminophen)",
            strength="500mg",
            instruction="Take 2 tablets orally every 6 hours as needed for fever or pain.",
            frequency="Every 6 hours as needed",
            duration="As needed",
            additional_notes="Maximum 4000mg / 24 hours.",
            ocr_confidence=0.98,
            source="user_confirmed",
            verification_status="confirmed"
        )
        med1_3 = Medicine(
            prescription_id=rx1.id,
            name="Omeprazole",
            strength="20mg",
            instruction="Take 1 capsule orally once daily in the morning 30 minutes before breakfast for 14 days.",
            frequency="Once daily in morning",
            duration="14 days",
            additional_notes="Take 30 mins BEFORE breakfast. Swallow whole.",
            ocr_confidence=0.99,
            source="user_confirmed",
            verification_status="confirmed"
        )
        db.add_all([med1_1, med1_2, med1_3])
        db.commit()

        # AI Output for Rx 1
        ai1_en = AIOutput(
            prescription_id=rx1.id,
            language="en",
            generated_text="Take 1 capsule of Amoxicillin 500mg three times daily after meals for 5 days. Take 2 tablets of Paracetamol 500mg every 6 hours as needed for fever. Take 1 capsule of Omeprazole 20mg every morning 30 minutes before breakfast.",
            generated_questions=[
                "Should I take Amoxicillin with food or water?",
                "What is the maximum daily limit for Paracetamol?",
                "How long before breakfast should I take Omeprazole?"
            ],
            model_used="qwen2:7b",
            safety_check_passed=True,
            safety_warnings=[],
            review_status="pending"
        )

        ai1_ur = AIOutput(
            prescription_id=rx1.id,
            language="ur",
            generated_text="اموکسیسلن ۵۰۰ ملی گرام: کھانے کے بعد دن میں ۳ مرتبہ ۱ کیپسول ۵ دن تک لیں۔\nپیراسیٹامول ۵۰۰ ملی گرام: بخار یا درد کی صورت میں ہر ۶ گھنٹے بعد ۲ گولیاں لیں۔\nاومپرازول ۲۰ ملی گرام: روزانہ صبح ناشتے سے ۳۰ منٹ پہلے ۱ کیپسول لیں۔",
            generated_questions=[
                "کیا مجھے اموکسیسلن کھانے کے ساتھ لینی چاہیے؟",
                "پیراسیٹامول کی 24 گھنٹوں میں زیادہ سے زیادہ کتنی خوراک لی جا سکتی ہے؟"
            ],
            model_used="qwen2:7b",
            safety_check_passed=True,
            safety_warnings=[],
            review_status="pending"
        )
        db.add_all([ai1_en, ai1_ur])

        # Pharmacist Review pending record for Rx 1
        rev1 = PharmacistReview(
            prescription_id=rx1.id,
            pharmacist_id=pharmacist.id,
            status="pending",
            comments="Real-time incoming digital prescription flagged for handover preparation"
        )
        db.add(rev1)

        # 2. Prescription 2: David Chen (Multiple medicines)
        rx2 = Prescription(
            user_id=patient.id,
            original_filename="prescription_multiple.pdf",
            image_path="sample_data/prescription_multiple.pdf",
            file_type="PDF",
            extraction_method="PYMUPDF",
            raw_extracted_text="ST. MARY'S ORTHOPEDIC CENTER DAVID CHEN MRN-99214 RX-90829...",
            processing_status="confirmed",
            review_status="approved",
            selected_language="en"
        )
        db.add(rx2)
        db.commit()
        db.refresh(rx2)

        med2_1 = Medicine(
            prescription_id=rx2.id,
            name="Celecoxib",
            strength="200mg",
            instruction="Take 1 capsule once daily after food for joint pain.",
            frequency="Once daily",
            duration="10 days",
            ocr_confidence=0.97,
            source="user_confirmed",
            verification_status="confirmed"
        )
        med2_2 = Medicine(
            prescription_id=rx2.id,
            name="Tramadol",
            strength="50mg",
            instruction="Take 1 tablet every 8 hours as needed for severe pain.",
            frequency="Every 8 hours PRN",
            duration="5 days",
            ocr_confidence=0.96,
            source="user_confirmed",
            verification_status="confirmed"
        )
        db.add_all([med2_1, med2_2])

        rev2 = PharmacistReview(
            prescription_id=rx2.id,
            pharmacist_id=pharmacist.id,
            status="approved",
            comments="Verified by Dr. Sarah Reid, PharmD. All drug interactions checked.",
            review_completed_at=datetime.utcnow()
        )
        db.add(rev2)

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
