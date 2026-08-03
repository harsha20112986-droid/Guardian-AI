from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/sms",
    tags=["SMS Scanner"]
)


class SMSRequest(BaseModel):
    message: str


@router.post("/scan")
def scan_sms(request: SMSRequest):
    return {
        "message": request.message,
        "prediction": "Safe",
        "risk_level": "Low",
        "score": 0,
        "reasons": [
            "SMS scanner is working."
        ]
    }