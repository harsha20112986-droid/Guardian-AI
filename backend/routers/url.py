from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import User
from routers.auth import get_current_user
from rate_limit import rate_limit

from services.url_scanner import scan_url


router = APIRouter()


class URLRequest(BaseModel):
    url: str = Field(
        ...,
        min_length=1,
        max_length=2048,
    )


@router.post(
    "/scan-url",
    dependencies=[
        Depends(
            rate_limit(
                limit=30,
                window_seconds=60,
                name="url-scan",
            )
        )
    ],
)
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