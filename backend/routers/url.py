from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import User
from routers.auth import get_current_user

from services.url_scanner import scan_url


router = APIRouter()


class URLRequest(BaseModel):
    url: str


@router.post("/scan-url")
def scan(
    request: URLRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return scan_url(
        request.url,
        db,
        current_user.id,
    )