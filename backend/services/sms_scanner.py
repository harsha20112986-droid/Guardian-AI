import re

from sqlalchemy.orm import Session

from ml.predict import predict_url
from models import ScanHistory


SCAM_KEYWORDS = [
    "winner",
    "won",
    "lottery",
    "reward",
    "claim",
    "urgent",
    "verify",
    "bank",
    "account",
    "otp",
    "gift",
    "click",
    "limited",
    "expire",
    "congratulations",
]


URL_REGEX = r"(https?://[^\s]+)"


def scan_sms(
    message: str,
    db: Session,
    user_id: int,
):
    message = message.strip()

    if not message:
        raise ValueError(
            "SMS message cannot be empty."
        )

    score = 0
    reasons = []

    text = message.lower()

    detected_keywords = []

    for word in SCAM_KEYWORDS:
        if word in text:
            detected_keywords.append(word)

    if detected_keywords:
        keyword_score = min(
            len(detected_keywords) * 8,
            56,
        )

        score += keyword_score

        for word in detected_keywords:
            reasons.append(
                f"Contains suspicious keyword: {word}"
            )

    urls = re.findall(
        URL_REGEX,
        message,
    )

    url_result = None
    url_confidence = None

    if urls:
        reasons.append(
            "Contains an embedded URL."
        )

        try:
            url_result = predict_url(
                urls[0]
            )

            url_confidence = float(
                url_result.get(
                    "confidence",
                    0,
                )
            )

            if (
                url_result.get("prediction")
                == "Phishing"
            ):
                score += 35

                reasons.append(
                    "Embedded URL was detected as phishing."
                )

            elif (
                url_result.get("prediction")
                == "Legitimate"
            ):
                reasons.append(
                    "Embedded URL was classified as legitimate."
                )

        except Exception as error:
            print(
                "SMS URL analysis error:",
                error,
            )

            reasons.append(
                "Embedded URL could not be fully analyzed."
            )

    score = min(
        score,
        100,
    )

    if score >= 70:
        prediction = "Scam"
        risk = "High"

    elif score >= 40:
        prediction = "Suspicious"
        risk = "Medium"

    else:
        prediction = "Safe"
        risk = "Low"

    history_prediction = (
        "Legitimate"
        if prediction == "Safe"
        else "Phishing"
    )

    confidence = (
        round(
            max(
                float(score),
                url_confidence or 0,
            ),
            2,
        )
        if score > 0 or url_confidence
        else 0.0
    )

    history = ScanHistory(
        user_id=user_id,
        scan_type="SMS",
        content=message,
        prediction=history_prediction,
        confidence=confidence,
        rule_score=score,
        final_score=float(score),
        risk_level=risk,
        reasons=" | ".join(reasons),
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return {
        "id": history.id,
        "scan_type": "SMS",
        "message": message,
        "prediction": prediction,
        "confidence": confidence,
        "risk_level": risk,
        "score": score,
        "rule_score": score,
        "final_score": float(score),
        "reasons": reasons,
        "url_analysis": url_result,
        "scanned_at": history.scanned_at,
    }