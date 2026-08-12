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

    role = Column(
        String,
        default="user",
        nullable=False,
    )

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

    password_reset_token = Column(
        String,
        nullable=True,
        unique=True,
        index=True,
    )

    password_reset_token_expires = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    scans = relationship(
        "ScanHistory",
        back_populates="user",
        cascade="all, delete-orphan",
    )


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

    user = relationship(
        "User",
        back_populates="scans",
    )