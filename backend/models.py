from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)

    scan_type = Column(String, default="URL")   # URL / QR / SMS

    content = Column(Text, nullable=False)      # URL or SMS text

    prediction = Column(String, nullable=False)

    confidence = Column(Float)

    rule_score = Column(Integer)

    final_score = Column(Float)

    risk_level = Column(String)

    reasons = Column(Text)                      # Detection reasons

    scanned_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )