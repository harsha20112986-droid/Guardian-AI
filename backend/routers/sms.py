from fastapi import APIRouter
from pydantic import BaseModel

from services.sms_scanner import scan_sms


router = APIRouter(
    prefix="/sms",
    tags=["SMS Scanner"]
)


class SMSRequest(BaseModel):
    message: str


@router.post("/scan")
def scan_sms_route(request: SMSRequest):
    return scan_sms(request.message)