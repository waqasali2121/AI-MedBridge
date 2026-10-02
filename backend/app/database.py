from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.exc import OperationalError
from app.config import settings

db_url = settings.DATABASE_URL

def create_db_engine():
    if "postgresql" in db_url and "YOUR-PASSWORD" not in db_url and "[YOUR-PASSWORD]" not in db_url:
        try:
            eng = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=300,
                pool_size=10,
                max_overflow=20
            )
            # Test connection
            with eng.connect():
                pass
            print(f"Connected to PostgreSQL/Supabase database.")
            return eng
        except (OperationalError, Exception) as e:
            print(f"Could not connect to PostgreSQL ({e}). Falling back to local SQLite database.")

    print("Using local SQLite database (medbridge.db).")
    sqlite_url = "sqlite:///./medbridge.db"
    return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
