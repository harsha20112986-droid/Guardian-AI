from sqlalchemy.orm import Session

from models import Notification


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "security",
    severity: str = "info",
):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
        severity=severity,
        is_read=False,
    )

    db.add(notification)

    return notification


def create_scan_notification(
    db: Session,
    user_id: int,
    scan_type: str,
    prediction: str,
    risk_level: str,
    score: float,
):
    normalized_prediction = str(
        prediction or ""
    ).strip().lower()

    normalized_risk = str(
        risk_level or ""
    ).strip().lower()

    scan_name = str(
        scan_type or "Security"
    ).upper()

    # ==========================================
    # HIGH-RISK / PHISHING / SCAM
    # ==========================================

    if (
        normalized_risk == "high"
        or normalized_prediction in {
            "phishing",
            "scam",
        }
    ):
        notification = create_notification(
            db=db,
            user_id=user_id,
            title="High Risk Threat Detected",
            message=(
                f"Guardian AI detected a potentially "
                f"dangerous threat in your {scan_name} scan. "
                f"Risk score: {round(float(score or 0), 2)}."
            ),
            notification_type="threat",
            severity="high",
        )

        return notification

    # ==========================================
    # MEDIUM-RISK / SUSPICIOUS
    # ==========================================

    if (
        normalized_risk == "medium"
        or normalized_prediction == "suspicious"
    ):
        notification = create_notification(
            db=db,
            user_id=user_id,
            title="Suspicious Content Detected",
            message=(
                f"Guardian AI found suspicious indicators "
                f"in your {scan_name} scan. "
                f"Risk score: {round(float(score or 0), 2)}."
            ),
            notification_type="threat",
            severity="medium",
        )

        return notification

    return None