from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.prescriptions import router as prescriptions_router
from app.api.reviews import router as reviews_router
from app.api.users import router as users_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(prescriptions_router)
api_router.include_router(reviews_router)
api_router.include_router(users_router)
