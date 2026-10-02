import base64
import hashlib
import json
import time
from datetime import datetime, timedelta, timezone
from typing import Optional

from app.config import settings

# Passlib / Bcrypt with fallback
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            return _fallback_verify(plain_password, hashed_password)

    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)
except ImportError:
    def _fallback_hash(password: str) -> str:
        return "pbkdf2:" + hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), b'medbridge_salt', 100000).hex()

    def _fallback_verify(plain: str, hashed: str) -> bool:
        if hashed.startswith("pbkdf2:"):
            return _fallback_hash(plain) == hashed
        return plain == hashed  # fallback comparison

    get_password_hash = _fallback_hash
    verify_password = _fallback_verify


# PyJWT / python-jose with fallback
try:
    from jose import JWTError, jwt
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire, "type": "access"})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def create_refresh_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def decode_token(token: str) -> dict:
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except Exception:
            return _fallback_decode_token(token)

except ImportError:
    def _fallback_encode(payload: dict) -> str:
        header = base64.b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode()
        body = base64.b64encode(json.dumps(payload).encode()).decode()
        sig_input = f"{header}.{body}".encode()
        signature = base64.b64encode(hashlib.sha256(sig_input + settings.SECRET_KEY.encode()).digest()).decode()
        return f"{header}.{body}.{signature}"

    def _fallback_decode_token(token: str) -> dict:
        try:
            parts = token.split(".")
            if len(parts) != 3:
                return {}
            body_json = base64.b64decode(parts[1] + "==").decode()
            return json.loads(body_json)
        except Exception:
            return {}

    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        exp = int(time.time()) + (int(expires_delta.total_seconds()) if expires_delta else settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
        to_encode.update({"exp": exp, "type": "access"})
        return _fallback_encode(to_encode)

    def create_refresh_token(data: dict) -> str:
        to_encode = data.copy()
        exp = int(time.time()) + (settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400)
        to_encode.update({"exp": exp, "type": "refresh"})
        return _fallback_encode(to_encode)

    decode_token = _fallback_decode_token
