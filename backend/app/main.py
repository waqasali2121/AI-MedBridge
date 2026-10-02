import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.router import api_router

app = FastAPI(
    title="MedBridge API",
    description="AI-powered prescription understanding platform for patients and caregivers",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def on_startup():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


@app.get("/")
def root():
    return {"message": "MedBridge API", "version": "1.0.0"}
