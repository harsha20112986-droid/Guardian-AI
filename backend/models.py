from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from database import Base


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)

    url = Column(String, nullable=False)
    prediction = Column(String, nullable=False)
    confidence = Column(Float)
    rule_score = Column(Integer)
    final_score = Column(Float)
    risk_level = Column(String)

    scanned_at = Column(DateTime(timezone=True), server_default=func.now())