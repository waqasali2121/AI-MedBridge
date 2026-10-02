from fastapi import HTTPException, status


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

forbidden_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Not enough permissions",
)

not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Resource not found",
)

bad_request_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Bad request",
)
