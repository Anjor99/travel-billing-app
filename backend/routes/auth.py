from fastapi import APIRouter, HTTPException
from database import get_connection
from utils.security import (
    hash_password,
    verify_password,
    create_access_token
)
from services.email_service import send_verification_email
from schemas.auth_schema import RegisterRequest, LoginRequest
import uuid

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# REGISTER USER
@router.post("/register")
def register_user(payload: RegisterRequest):

    name = payload.name
    email = payload.email
    password = payload.password

    conn = get_connection()
    cursor = conn.cursor()

    # Check if email exists
    cursor.execute(
        "SELECT id FROM users WHERE email=%s",
        (email,)
    )

    if cursor.fetchone():

        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(password)

    verification_token = str(uuid.uuid4())

    query = """
        INSERT INTO users (
            name,
            email,
            password,
            verification_token
        )
        VALUES (%s, %s, %s, %s)
    """

    cursor.execute(
        query,
        (
            name,
            email,
            hashed_password,
            verification_token
        )
    )

    conn.commit()

    send_verification_email(
        email,
        verification_token
    )

    cursor.close()
    conn.close()

    return {
        "message": "Registration successful. Check email to verify account."
    }


# VERIFY EMAIL
@router.get("/verify-email")
def verify_email(token: str):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE users
        SET is_verified = TRUE,
            verification_token = NULL
        WHERE verification_token = %s
        RETURNING id
        """,
        (token,)
    )

    user = cursor.fetchone()

    conn.commit()

    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid token"
        )

    return {
        "message": "Email verified successfully"
    }


# LOGIN
@router.post("/login")
def login_user(payload: LoginRequest):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, password, is_verified
        FROM users
        WHERE email=%s
        """,
        (payload.email,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )

    user_id, hashed_password, is_verified = user

    if not verify_password(
        payload.password,
        hashed_password
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    if not is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email not verified"
        )

    token = create_access_token({
        "user_id": user_id
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }