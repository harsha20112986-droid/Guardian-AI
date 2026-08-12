from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Text,
    ForeignKey,
    Boolean,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database import Base


# ============================================================
# USER MODEL
# ============================================================

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash = Column(
        String,
        nullable=False,
    )

    # --------------------------------------------------------
    # USER ROLE
    # user = normal registered user
    # admin = administrator
    # --------------------------------------------------------

    role = Column(
        String,
        default="user",
        nullable=False,
    )

    # --------------------------------------------------------
    # EMAIL VERIFICATION
    # --------------------------------------------------------

    email_verified = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    verification_token = Column(
        String,
        nullable=True,
        unique=True,
        index=True,
    )

    verification_token_expires = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # --------------------------------------------------------
    # USER SCAN HISTORY
    # --------------------------------------------------------

    scans = relationship(
        "ScanHistory",
        back_populates="user",
        cascade="all, delete-orphan",
    )


# ============================================================
# SCAN HISTORY MODEL
# ============================================================

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    scan_type = Column(
        String,
        default="URL",
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    prediction = Column(
        String,
        nullable=False,
    )

    confidence = Column(
        Float,
    )

    rule_score = Column(
        Integer,
    )

    final_score = Column(
        Float,
    )

    risk_level = Column(
        String,
    )

    reasons = Column(
        Text,
    )

    scanned_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # --------------------------------------------------------
    # RELATIONSHIP TO USER
    # --------------------------------------------------------

    user = relationship(
        "User",
        back_populates="scans",
    )