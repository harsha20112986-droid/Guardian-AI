import json

from sqlalchemy.orm import Session

from ml.predict import predict_url
from models import ScanHistory


def scan_url(
    url: str,
    db: Session,
    user_id: int,
    scan_type: str = "URL",
):
    result = predict_url(url)

    history = ScanHistory(
        user_id=user_id,
        scan_type=scan_type,
        content=result["url"],
        prediction=result["prediction"],
        confidence=result["confidence"],
        rule_score=result["rule_score"],
        final_score=result["final_score"],
        risk_level=result["risk_level"],
        reasons=json.dumps(
            result.get("reasons", [])
        ),
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return result