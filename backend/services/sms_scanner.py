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
):
    score = 0
    reasons = []

    text = message.lower()

    # --------------------------------
    # Keyword Detection
    # --------------------------------

    for word in SCAM_KEYWORDS:

        if word in text:

            score += 8

            reasons.append(
                f"Contains keyword: {word}"
            )

    # --------------------------------
    # URL Detection
    # --------------------------------

    urls = re.findall(
        URL_REGEX,
        message,
    )

    url_result = None

    if urls:

        reasons.append(
            "Contains URL"
        )

        try:

            url_result = predict_url(
                urls[0]
            )

            if (
                url_result["prediction"]
                == "Phishing"
            ):

                score += 35

                reasons.append(
                    "Embedded URL detected as phishing."
                )

        except Exception as error:

            print(
                "SMS URL analysis error:",
                error,
            )

    # --------------------------------
    # Limit Score
    # --------------------------------

    score = min(
        score,
        100,
    )

    # --------------------------------
    # SMS Classification
    # --------------------------------

    if score >= 70:

        prediction = "Scam"
        risk = "High"

    elif score >= 40:

        prediction = "Suspicious"
        risk = "Medium"

    else:

        prediction = "Safe"
        risk = "Low"

    # --------------------------------
    # Convert SMS prediction
    # to common History prediction
    # --------------------------------

    history_prediction = (
        "Legitimate"
        if prediction == "Safe"
        else "Phishing"
    )

    # --------------------------------
    # Save SMS Scan to Database
    # --------------------------------

    history = ScanHistory(
        scan_type="SMS",
        content=message,
        prediction=history_prediction,
        confidence=None,
        rule_score=score,
        final_score=float(score),
        risk_level=risk,
        reasons=" | ".join(reasons),
    )

    db.add(history)

    db.commit()

    db.refresh(history)

    # --------------------------------
    # Return Result to Frontend
    # --------------------------------

    return {
        "id": history.id,
        "scan_type": "SMS",

        "message": message,

        # Keep original SMS classification
        "prediction": prediction,

        "risk_level": risk,

        "score": score,

        "reasons": reasons,

        "url_analysis": url_result,

        "scanned_at": history.scanned_at,
    }