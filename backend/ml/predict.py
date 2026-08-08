import os
from urllib.parse import urlparse

import joblib
import pandas as pd

from ml.feature_extractor import extract_features
from ml.rule_engine import calculate_rule_score
from ml.trusted_domains import TRUSTED_DOMAINS


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(
    BASE_DIR,
    "saved_models",
    "phishing_model.pkl",
)

model = joblib.load(MODEL_PATH)


def is_trusted_domain(url: str) -> bool:
    hostname = urlparse(url).hostname or ""

    if hostname.startswith("www."):
        hostname = hostname[4:]

    return hostname.lower() in TRUSTED_DOMAINS


def get_risk_level(score: float) -> str:
    if score >= 75:
        return "High"

    if score >= 40:
        return "Medium"

    return "Low"


def predict_url(url: str) -> dict:
    if is_trusted_domain(url):
        return {
            "url": url,
            "prediction": "Legitimate",
            "confidence": 100.0,
            "rule_score": 0,
            "final_score": 0,
            "risk_level": "Low",
            "trusted_domain": True,
            "reasons": [
                "Verified trusted domain."
            ],
        }

    rule_score, rule_reasons = calculate_rule_score(url)

    features = extract_features(url)

    X = pd.DataFrame([features])

    X = X.reindex(
        columns=model.feature_names_in_
    )

    prediction = int(
        model.predict(X)[0]
    )

    probabilities = model.predict_proba(X)[0]

    confidence = round(
        float(max(probabilities) * 100),
        2,
    )

    prediction_text = (
        "Legitimate"
        if prediction == 1
        else "Phishing"
    )

    if prediction_text == "Phishing":
        final_score = round(
            (rule_score * 0.4)
            + (confidence * 0.6),
            2,
        )
    else:
        final_score = round(
            rule_score * 0.4,
            2,
        )

    return {
        "url": url,
        "prediction": prediction_text,
        "confidence": confidence,
        "rule_score": rule_score,
        "final_score": final_score,
        "risk_level": get_risk_level(final_score),
        "trusted_domain": False,
        "reasons": rule_reasons,
    }