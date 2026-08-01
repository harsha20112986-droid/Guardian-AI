from sqlalchemy.orm import Session

from ml.predict import predict_url
from models import ScanHistory


def scan_url(url: str, db: Session):
    result = predict_url(url)

    history = ScanHistory(
        url=result["url"],
        prediction=result["prediction"],
        confidence=result["confidence"],
        rule_score=result["rule_score"],
        final_score=result["final_score"],
        risk_level=result["risk_level"],
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return result