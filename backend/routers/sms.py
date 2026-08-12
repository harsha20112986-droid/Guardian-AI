from fastapi import APIRouter, Depends

from pydantic import BaseModel

from sqlalchemy.orm import Session

from database import get_db

from models import User

from routers.auth import get_current_user

from services.sms_scanner import scan_sms


router = APIRouter(
    prefix="/sms",
    tags=["SMS Scanner"],
)


class SMSRequest(BaseModel):
    message: str


@router.post("/scan")
def scan_sms_route(
    request: SMSRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return scan_sms(
        message=request.message,
        db=db,
        user_id=current_user.id,
    )