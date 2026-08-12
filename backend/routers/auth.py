import os
import secrets
import smtplib

from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from dotenv import load_dotenv

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt
from passlib.context import CryptContext

from pydantic import BaseModel, EmailStr

from email_validator import validate_email, EmailNotValidError

from sqlalchemy.orm import Session

from database import get_db
from models import User


load_dotenv()


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


SECRET_KEY = os.getenv("GUARDIAN_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError(
        "GUARDIAN_SECRET_KEY is missing from the .env file."
    )

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

VERIFICATION_TOKEN_EXPIRE_MINUTES = 30

PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = 30


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


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


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


def create_verification_token() -> str:
    return secrets.token_urlsafe(48)


def create_password_reset_token() -> str:
    return secrets.token_urlsafe(48)


def send_verification_email(
    recipient_email: str,
    recipient_name: str,
    verification_token: str,
):
    if not GMAIL_ADDRESS:
        raise RuntimeError(
            "GMAIL_ADDRESS is missing in the .env file."
        )

    if not GMAIL_APP_PASSWORD:
        raise RuntimeError(
            "GMAIL_APP_PASSWORD is missing in the .env file."
        )

    verification_link = (
        f"{FRONTEND_URL}/verify-email"
        f"?token={verification_token}"
    )

    message = EmailMessage()

    message["Subject"] = "Verify your Guardian AI account"

    message["From"] = (
        f"Guardian AI Security Team <{GMAIL_ADDRESS}>"
    )

    message["To"] = recipient_email

    message.set_content(
        f"""
Hello {recipient_name},

Welcome to Guardian AI.

Thank you for creating your Guardian AI account.

To activate your account, please verify your email address using the link below:

{verification_link}

This verification link will expire in {VERIFICATION_TOKEN_EXPIRE_MINUTES} minutes.

If you did not create a Guardian AI account, you can safely ignore this email.

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

    message["Subject"] = "Reset your Guardian AI password"

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


def get_current_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user


@router.post("/signup")
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db),
):
    normalized_email = validate_email_domain(
        str(data.email)
    )

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

    if len(data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least 8 characters.",
        )

    existing_user = (
        db.query(User)
        .filter(
            User.email == normalized_email
        )
        .first()
    )

    if existing_user:
        if not existing_user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "This email is already registered "
                    "but has not been verified."
                ),
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )

    verification_token = create_verification_token()

    verification_expiry = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=VERIFICATION_TOKEN_EXPIRE_MINUTES
        )
    )

    user = User(
        name=name,
        email=normalized_email,
        password_hash=hash_password(
            data.password
        ),
        role="user",
        email_verified=False,
        verification_token=verification_token,
        verification_token_expires=verification_expiry,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        send_verification_email(
            recipient_email=user.email,
            recipient_name=user.name,
            verification_token=verification_token,
        )

    except Exception as error:
        print(
            "Failed to send verification email:",
            error,
        )

        db.delete(user)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Account could not be created because "
                "the verification email could not be sent."
            ),
        )

    return {
        "message": (
            "Account created successfully. "
            "Please check your email to verify your account."
        ),
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "email_verified": user.email_verified,
        },
    }


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
                "Verification link has expired. "
                "Please request a new verification email."
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


@router.post("/login")
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

    if not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Please verify your email before logging in."
            ),
        )

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


@router.post("/forgot-password")
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

    if not user.email_verified:
        return {
            "message": generic_message
        }

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


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least 8 characters.",
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

    user.password_hash = hash_password(
        data.new_password
    )

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