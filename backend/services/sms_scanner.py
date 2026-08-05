import re

from ml.predict import predict_url


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


def scan_sms(message: str):
    score = 0
    reasons = []

    text = message.lower()

    # Keyword detection
    for word in SCAM_KEYWORDS:
        if word in text:
            score += 8
            reasons.append(f"Contains keyword: {word}")

    # URL detection
    urls = re.findall(URL_REGEX, message)

    url_result = None

    if urls:
        reasons.append("Contains URL")

        try:
            url_result = predict_url(urls[0])

            if url_result["prediction"] == "Phishing":
                score += 35
                reasons.append(
                    "Embedded URL detected as phishing."
                )

        except Exception:
            pass

    score = min(score, 100)

    if score >= 70:
        prediction = "Scam"
        risk = "High"

    elif score >= 40:
        prediction = "Suspicious"
        risk = "Medium"

    else:
        prediction = "Safe"
        risk = "Low"

    return {
        "message": message,
        "prediction": prediction,
        "risk_level": risk,
        "score": score,
        "reasons": reasons,
        "url_analysis": url_result,
    }