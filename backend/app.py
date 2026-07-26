from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
scan_history = []
app = FastAPI(title="Guardian AI API")

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str


@app.get("/")
def home():
    return {
        "message": "Guardian AI Backend Running"
    }


@app.post("/scan-url")
def scan_url(data: URLRequest):
    url = data.url.lower()

    suspicious_words = [
        "login",
        "verify",
        "bank",
        "secure",
        "update",
        "account",
        "gift",
        "paypal",
        "free",
    ]

    risk = 0

    for word in suspicious_words:
        if word in url:
            risk += 15

    if len(url) > 60:
        risk += 10

    if url.count("-") >= 3:
        risk += 15

    if "@" in url:
        risk += 25

    if url.count(".") >= 4:
        risk += 10

    risk = min(risk, 100)

    if risk >= 60:
        status = "Phishing"
    elif risk >= 30:
        status = "Suspicious"
    else:
        status = "Safe"

    result = {
        "url": data.url,
        "status": status,
        "risk_score": risk,
    }

    scan_history.insert(0, result)

    return result

@app.get("/history")
def history():
    return scan_history