import os
import secrets
import smtplib

from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from dotenv import load_dotenv

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from rate_limit import rate_limit

from jose import JWTError, jwt
from passlib.context import CryptContext

from pydantic import BaseModel, EmailStr

from email_validator import validate_email, EmailNotValidError

from sqlalchemy.orm import Session

from database import get_db
from models import User


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

ENV_FILE = os.path.join(
    BASE_DIR,
    ".env",
)

load_dotenv(ENV_FILE)


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ==========================================
# CONFIGURATION
# ==========================================

SECRET_KEY = os.getenv(
    "GUARDIAN_SECRET_KEY"
)

if not SECRET_KEY:
    raise RuntimeError(
        "GUARDIAN_SECRET_KEY is missing from the .env file."
    )

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = 30


# ==========================================
# EMAIL CONFIGURATION
# ==========================================

GMAIL_ADDRESS = os.getenv(
    "GMAIL_ADDRESS",
    "",
)

GMAIL_APP_PASSWORD = os.getenv(
    "GMAIL_APP_PASSWORD",
    "",
)

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)


# ==========================================
# PASSWORD HASHING
# ==========================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


# ==========================================
# OAUTH2
# ==========================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# ==========================================
# REQUEST SCHEMAS
# ==========================================

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# ==========================================
# PASSWORD FUNCTIONS
# ==========================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


# ==========================================
# EMAIL VALIDATION
# ==========================================

def validate_email_domain(email: str) -> str:
    try:
        result = validate_email(
            email,
            check_deliverability=True,
        )

        return result.normalized

    except EmailNotValidError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid email address: {str(error)}",
        )


# ==========================================
# TOKEN FUNCTIONS
# ==========================================

def create_password_reset_token() -> str:
    return secrets.token_urlsafe(48)


# ==========================================
# PASSWORD RESET EMAIL
# ==========================================

def send_password_reset_email(
    recipient_email: str,
    recipient_name: str,
    reset_token: str,
):
    if not GMAIL_ADDRESS:
        raise RuntimeError(
            "GMAIL_ADDRESS is missing in the .env file."
        )

    if not GMAIL_APP_PASSWORD:
        raise RuntimeError(
            "GMAIL_APP_PASSWORD is missing in the .env file."
        )

    reset_link = (
        f"{FRONTEND_URL}/reset-password"
        f"?token={reset_token}"
    )

    message = EmailMessage()

    message["Subject"] = (
        "Reset your Guardian AI password"
    )

    message["From"] = (
        f"Guardian AI Security Team <{GMAIL_ADDRESS}>"
    )

    message["To"] = recipient_email

    message.set_content(
        f"""
Hello {recipient_name},

We received a request to reset your Guardian AI password.

Use the link below to create a new password:

{reset_link}

This password reset link will expire in {PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.

If you did not request a password reset, you can safely ignore this email.
Your current password will remain unchanged.

Regards,

Guardian AI Security Team
AI Cybersecurity Platform
"""
    )

    try:
        with smtplib.SMTP_SSL(
            "smtp.gmail.com",
            465,
            timeout=20,
        ) as smtp:

            smtp.login(
                GMAIL_ADDRESS,
                GMAIL_APP_PASSWORD,
            )

            smtp.send_message(message)

    except smtplib.SMTPAuthenticationError:
        raise RuntimeError(
            "Gmail authentication failed. Check the Gmail address and App Password."
        )

    except smtplib.SMTPException as error:
        raise RuntimeError(
            f"Gmail SMTP error: {str(error)}"
        )


# ==========================================
# JWT ACCESS TOKEN
# ==========================================

def create_access_token(user_id: int):
    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# ==========================================
# CURRENT USER
# ==========================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials.",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        user_id = int(user_id)

    except (
        JWTError,
        ValueError,
        TypeError,
    ):
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise credentials_exception

    return user


# ==========================================
# CURRENT ADMIN
# ==========================================

def get_current_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user


# ==========================================
# SIGNUP
# ==========================================

@router.post(
    "/signup",
    dependencies=[
        Depends(
            rate_limit(
                limit=5,
                window_seconds=60,
                name="signup",
            )
        )
    ],
)
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db),
):
    # Validate and normalize email
    normalized_email = validate_email_domain(
        str(data.email)
    )

    # Clean name
    name = data.name.strip()

    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name cannot be empty.",
        )

    if len(name) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name must contain at least 2 characters.",
        )

    # Validate password
    if len(data.password) < 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least 12 characters.",
        )

    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(
            User.email == normalized_email
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )

    # ==========================================
    # CREATE ACCOUNT DIRECTLY
    #
    # Email verification has been removed.
    # Users can log in immediately after signup.
    # ==========================================

    user = User(
        name=name,
        email=normalized_email,
        password_hash=hash_password(
            data.password
        ),
        role="user",

        # Email verification is no longer required
        email_verified=True,

        # No verification token required
        verification_token=None,
        verification_token_expires=None,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Account created successfully. You can now log in.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "email_verified": user.email_verified,
        },
    }


# ==========================================
# EMAIL VERIFICATION ENDPOINT
# ==========================================
#
# Kept for compatibility with existing
# frontend routes/links, but verification
# is no longer required for new accounts.
#

@router.get("/verify-email")
def verify_email(
    token: str,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(
            User.verification_token == token
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token.",
        )

    if user.email_verified:
        return {
            "message": (
                "Email is already verified. "
                "You can now log in."
            )
        }

    expiry = user.verification_token_expires

    if expiry is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token.",
        )

    if expiry.tzinfo is None:
        expiry = expiry.replace(
            tzinfo=timezone.utc
        )

    if expiry < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Verification link has expired."
            ),
        )

    user.email_verified = True
    user.verification_token = None
    user.verification_token_expires = None

    db.commit()
    db.refresh(user)

    return {
        "message": (
            "Email verified successfully. "
            "You can now log in."
        )
    }


# ==========================================
# LOGIN
# ==========================================

@router.post(
    "/login",
    dependencies=[
        Depends(
            rate_limit(
                limit=5,
                window_seconds=60,
                name="login",
            )
        )
    ],
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    try:
        normalized_email = validate_email_domain(
            str(data.email)
        )

    except HTTPException:
        normalized_email = (
            str(data.email)
            .strip()
            .lower()
        )

    # Find user
    user = (
        db.query(User)
        .filter(
            User.email == normalized_email
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Verify password
    if not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # ==========================================
    # EMAIL VERIFICATION CHECK REMOVED
    #
    # Users can now log in immediately.
    # ==========================================

    # Automatically mark old accounts as verified
    # so existing accounts are not blocked.
    if not user.email_verified:
        user.email_verified = True
        user.verification_token = None
        user.verification_token_expires = None

        db.commit()
        db.refresh(user)

    # Create JWT
    access_token = create_access_token(
        user.id
    )

    return {
        "message": "Login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "email_verified": user.email_verified,
        },
    }


# ==========================================
# FORGOT PASSWORD
# ==========================================

@router.post(
    "/forgot-password",
    dependencies=[
        Depends(
            rate_limit(
                limit=3,
                window_seconds=600,
                name="forgot-password",
            )
        )
    ],
)
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    normalized_email = validate_email_domain(
        str(data.email)
    )

    user = (
        db.query(User)
        .filter(
            User.email == normalized_email
        )
        .first()
    )

    generic_message = (
        "If an account with this email exists, "
        "a password reset link has been sent."
    )

    if user is None:
        return {
            "message": generic_message
        }

    # Email verification is no longer required.
    # Any existing account can request a reset.
    reset_token = create_password_reset_token()

    reset_expiry = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
        )
    )

    user.password_reset_token = reset_token
    user.password_reset_token_expires = reset_expiry

    db.commit()

    try:
        send_password_reset_email(
            recipient_email=user.email,
            recipient_name=user.name,
            reset_token=reset_token,
        )

    except Exception as error:
        print(
            "Failed to send password reset email:",
            error,
        )

        user.password_reset_token = None
        user.password_reset_token_expires = None

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Password reset email could not be sent. "
                "Please try again later."
            ),
        )

    return {
        "message": generic_message
    }


# ==========================================
# RESET PASSWORD
# ==========================================

@router.post(
    "/reset-password",
    dependencies=[
        Depends(
            rate_limit(
                limit=5,
                window_seconds=600,
                name="reset-password",
            )
        )
    ],
)
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    if len(data.new_password) < 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least 12 characters.",
        )

    user = (
        db.query(User)
        .filter(
            User.password_reset_token == data.token
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset link.",
        )

    expiry = user.password_reset_token_expires

    if expiry is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset link.",
        )

    if expiry.tzinfo is None:
        expiry = expiry.replace(
            tzinfo=timezone.utc
        )

    if expiry < datetime.now(timezone.utc):
        user.password_reset_token = None
        user.password_reset_token_expires = None

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset link has expired.",
        )

    # Update password
    user.password_hash = hash_password(
        data.new_password
    )

    # Remove used reset token
    user.password_reset_token = None
    user.password_reset_token_expires = None

    db.commit()
    db.refresh(user)

    return {
        "message": (
            "Password reset successfully. "
            "You can now log in with your new password."
        )
    }
